import type { EnduranceBlockData, EnduranceCalendarRow, EnduranceDisciplineTarget } from "./types";

/**
 * CR-EF-211 — turn a pasted endurance plan (the text layout Esther/Craig write
 * Rick's blocks in) into `EnduranceBlockData`, so a block can be filled in the
 * hub without anyone touching the database. Deterministic, no AI: the layout is
 * fixed, and anything that doesn't fit is reported back as a warning for Esther
 * to fix by hand in the editor.
 *
 * Expected layout (headings on their own line, calendar rows tab-separated as
 * they come out of a Word/Docs table):
 *
 *   Title: Rick — Foundation (12–25 Oct)
 *   Target event: IRONMAN 70.3 …
 *   Start date: 12/10/2026
 *   End date: 25/10/2026
 *   Direction
 *   <paragraphs>
 *   Weekly targets
 *   Run: week 1 = 30 min + 40 min …
 *   Coaching note
 *   <paragraphs>
 *   Calendar
 *   Date  Day  Run  Bike  Swim  Notes
 *   2026-10-12  Mon  Rest  Rest  Rest  Robin day. Mobility only
 *   Week 1 (12–18 Oct): Run 70 min · Bike ~75 min · Swim ~60 min · ~3 hrs 25 total
 */

export interface ParsedEndurancePlan {
  title?: string;
  block: EnduranceBlockData;
  warnings: string[];
}

type Section = "none" | "direction" | "targets" | "coaching" | "calendar";

const HEADINGS: { re: RegExp; section: Section }[] = [
  { re: /^direction:?$/i, section: "direction" },
  { re: /^weekly targets?:?$/i, section: "targets" },
  { re: /^coaching notes?:?$/i, section: "coaching" },
  { re: /^calendar:?$/i, section: "calendar" },
];

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

let uidCounter = 0;
function uid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return `eb-${Date.now()}-${uidCounter++}`;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function validISO(y: number, m: number, d: number): string | null {
  const dt = new Date(Date.UTC(y, m - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== m - 1 || dt.getUTCDate() !== d) return null;
  return `${y}-${pad(m)}-${pad(d)}`;
}

/** Accepts 2026-10-12, 12/10/2026 (UK order), 12-10-2026, 12.10.2026, "12 Oct 2026". */
export function parsePlanDate(raw: string): string | null {
  const s = raw.trim();
  let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (m) return validISO(+m[1], +m[2], +m[3]);
  m = s.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/);
  if (m) return validISO(+m[3], +m[2], +m[1]);
  m = s.match(/^(?:[A-Za-z]+,?\s+)?(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]+)\.?,?\s+(\d{4})$/);
  if (m) {
    const month = MONTHS.indexOf(m[2].slice(0, 3).toLowerCase());
    if (month >= 0) return validISO(+m[3], month + 1, +m[1]);
  }
  return null;
}

function dayLabelFor(iso: string): string {
  const [y, mo, d] = iso.split("-").map(Number);
  return DAY_NAMES[new Date(Date.UTC(y, mo - 1, d)).getUTCDay()];
}

/** "—" / "-" / "–" placeholders mean "nothing that day". */
function cell(raw: string | undefined): string {
  const s = (raw ?? "").trim();
  return /^[—–-]+$/.test(s) ? "" : s;
}

/** Calendar cells: tabs (Word/Docs table paste), else " | ", else 2+ spaces. */
function splitCells(line: string): string[] {
  if (line.includes("\t")) return line.split("\t");
  if (line.includes("|")) return line.replace(/^\||\|$/g, "").split("|");
  return line.split(/ {2,}/);
}

function highlightFor(notes: string): EnduranceCalendarRow["highlight"] {
  if (/\bbrick\b/i.test(notes)) return "brick";
  if (/^event\b|\brace day\b/i.test(notes)) return "race";
  return null;
}

/** "Week 1 (12–18 Oct): Run 70 min · Bike ~75 min · Swim ~60 min · ~3 hrs 25 total" */
function parseWeekSummary(line: string): EnduranceCalendarRow | null {
  const m = line.match(/^(.+?\)|[^:]+?)\s*:\s*(.+)$/);
  if (!m) return null;
  const row: EnduranceCalendarRow = { id: uid(), type: "week_summary", weekLabel: m[1].trim(), run: "", bike: "", swim: "", notes: "" };
  const rest: string[] = [];
  for (const part of m[2].split(/\s*[·•|]\s*/)) {
    const p = part.trim();
    if (!p) continue;
    const d = p.match(/^(run|bike|swim)\s*[:=]?\s*(.*)$/i);
    if (d) row[d[1].toLowerCase() as "run" | "bike" | "swim"] = d[2].trim();
    else rest.push(p);
  }
  row.notes = rest.join(" · ");
  return row;
}

export function parseEndurancePlan(text: string): ParsedEndurancePlan {
  const warnings: string[] = [];
  const lines = text
    .replace(/\r\n?/g, "\n")
    .replace(/ /g, " ")
    .split("\n")
    .map((l) => l.replace(/\s+$/, ""));

  let title: string | undefined;
  let targetEvent = "";
  let startDate = "";
  let endDate = "";
  const direction: string[] = [];
  const coaching: string[] = [];
  const targets: EnduranceDisciplineTarget[] = [];
  const rows: EnduranceCalendarRow[] = [];
  let section: Section = "none";

  lines.forEach((rawLine, i) => {
    const line = rawLine.trim();
    if (!line) return;
    const lineNo = i + 1;

    const heading = HEADINGS.find((h) => h.re.test(line));
    if (heading) {
      section = heading.section;
      return;
    }

    const meta = line.match(/^(title|target event|start date|end date)\s*:\s*(.*)$/i);
    if (meta) {
      const key = meta[1].toLowerCase();
      const value = meta[2].trim();
      if (key === "title") title = value;
      else if (key === "target event") targetEvent = value;
      else {
        const iso = parsePlanDate(value);
        if (!iso) warnings.push(`Line ${lineNo}: couldn't read the ${key} "${value}" — set it by hand.`);
        else if (key === "start date") startDate = iso;
        else endDate = iso;
      }
      return;
    }

    // Calendar day rows and week summaries are recognised wherever they appear.
    const cells = splitCells(rawLine.trim());
    const rowDate = cells.length >= 2 ? parsePlanDate(cells[0]) : null;
    if (rowDate) {
      if (cells.length > 6) warnings.push(`Line ${lineNo} (${rowDate}): more than 6 columns — extra text was added to Notes, check it.`);
      const notes = cells.length > 6 ? cells.slice(5).map((c) => cell(c)).filter(Boolean).join(" ") : cell(cells[5]);
      rows.push({
        id: uid(),
        type: "day",
        date: rowDate,
        dayLabel: cell(cells[1]) || dayLabelFor(rowDate),
        run: cell(cells[2]),
        bike: cell(cells[3]),
        swim: cell(cells[4]),
        notes,
        highlight: highlightFor(notes),
      });
      return;
    }
    if (/^date\b/i.test(line) && /\brun\b/i.test(line)) return; // table header row
    if (/^(week\s+\d+|final days|race week)\b/i.test(line) && line.includes(":")) {
      const summary = parseWeekSummary(line);
      if (summary) {
        rows.push(summary);
        return;
      }
    }

    switch (section) {
      case "direction":
        direction.push(line);
        return;
      case "coaching":
        coaching.push(line);
        return;
      case "targets": {
        const t = line.match(/^([^:]{1,40}):\s*(.*)$/);
        if (t) targets.push({ id: uid(), discipline: t[1].trim(), detail: t[2].trim() });
        else if (targets.length) targets[targets.length - 1].detail += ` ${line}`;
        else warnings.push(`Line ${lineNo}: weekly target with no "Discipline:" label — "${line.slice(0, 60)}".`);
        return;
      }
      case "calendar":
        warnings.push(`Line ${lineNo}: not a calendar row (needs a date then tab-separated Day / Run / Bike / Swim / Notes) — "${line.slice(0, 60)}".`);
        return;
      default:
        warnings.push(`Line ${lineNo}: outside any section, skipped — "${line.slice(0, 60)}".`);
    }
  });

  const dayDates = rows.filter((r) => r.type === "day" && r.date).map((r) => r.date as string);
  if (!startDate && dayDates.length) startDate = dayDates.reduce((a, b) => (a < b ? a : b));
  if (!endDate && dayDates.length) endDate = dayDates.reduce((a, b) => (a > b ? a : b));
  if (startDate && endDate) {
    const outside = dayDates.filter((d) => d < startDate || d > endDate);
    if (outside.length) warnings.push(`${outside.length} calendar day(s) fall outside the start/end dates: ${outside.join(", ")}.`);
  }
  if (!dayDates.length) warnings.push("No calendar days found — rows need a date (e.g. 2026-10-12) followed by tab-separated columns.");

  return {
    title,
    block: {
      targetEvent,
      startDate,
      endDate,
      directionIntro: direction.join("\n"),
      disciplineTargets: targets,
      coachingNotes: coaching.join("\n"),
      rows,
    },
    warnings,
  };
}
