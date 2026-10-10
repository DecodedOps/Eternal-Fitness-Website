"use client";

import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { IconTrash2, IconMessageCircle } from "@/components/icons";
import { cn } from "@/lib/utils";
import type { EnduranceBlockData, EnduranceCalendarRow, EnduranceDisciplineTarget } from "@/lib/documents/types";
import { parseEndurancePlan } from "@/lib/documents/parseEndurancePlan";

let uidCounter = 0;
function uid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `eb-${Date.now()}-${uidCounter++}`;
}

/**
 * Single-line-looking cell that wraps and grows instead of truncating —
 * a plain <input> clips/scrolls long content out of view with no visual
 * sign anything is hidden, and rows/weekly-target details regularly run
 * well past one line (e.g. "~1-1.5 hrs/week (2-3 sessions), open water —
 * good long-term exposure for Venice-Jesolo..."). Auto-resizes on mount
 * (so pasted/loaded long values render fully, not just after a keystroke)
 * and on every change.
 */
function AutoCell({
  value,
  onChange,
  placeholder,
  disabled,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const resize = () => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };
  useEffect(resize, [value]);
  return (
    <textarea
      ref={ref}
      rows={1}
      className={cn("eb-cell", className)}
      style={{ overflow: "hidden", resize: "none" }}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
}

function newDayRow(): EnduranceCalendarRow {
  return { id: uid(), type: "day", date: "", dayLabel: "", run: "", bike: "", swim: "", notes: "", highlight: null };
}
function newSummaryRow(): EnduranceCalendarRow {
  return { id: uid(), type: "week_summary", weekLabel: "", run: "", bike: "", swim: "", notes: "" };
}

/* CR-EF-210 — calendar column resize. Widths are a per-browser viewer
   convenience (localStorage only); they are never written into the document
   body/DB. Defaults must never clip "2026-10-03" / "Sun–Mon". */
const EB_COL_WIDTHS_KEY = "eb-col-widths-v1";
const EB_MIN_COL_WIDTH = 56;
const EB_COL_IDS = ["date", "day", "run", "bike", "swim", "notes"] as const;
type EbColId = (typeof EB_COL_IDS)[number];
const EB_COL_LABELS: Record<EbColId, string> = {
  date: "Date",
  day: "Day",
  run: "Run",
  bike: "Bike",
  swim: "Swim",
  notes: "Notes",
};
/** Fallback widths used when switching to table-layout:fixed for columns the
    user has not resized. Matches the non-clip screen defaults for Date/Day. */
const EB_COL_FALLBACK: Record<EbColId, number> = {
  date: 124,
  day: 100,
  run: 160,
  bike: 160,
  swim: 160,
  notes: 220,
};
const EB_ACTIONS_COL_WIDTH = 80;
const EB_KEY_STEP = 16;

function emptyColWidths(): (number | null)[] {
  return [null, null, null, null, null, null];
}

function loadColWidths(): (number | null)[] {
  try {
    const raw = localStorage.getItem(EB_COL_WIDTHS_KEY);
    if (!raw) return emptyColWidths();
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return emptyColWidths();
    return EB_COL_IDS.map((_, i) => {
      const v = parsed[i];
      if (typeof v === "number" && Number.isFinite(v) && v >= EB_MIN_COL_WIDTH) return v;
      return null;
    });
  } catch {
    return emptyColWidths();
  }
}

function saveColWidths(widths: (number | null)[]) {
  try {
    localStorage.setItem(EB_COL_WIDTHS_KEY, JSON.stringify(widths));
  } catch {
    /* localStorage unavailable — widths just won't persist */
  }
}

/**
 * Editor-only drag/keyboard resize handle for one calendar column.
 * Pointer events (with setPointerCapture) so mouse and touch both work.
 */
function ColResizeHandle({
  label,
  currentWidth,
  fallbackWidth,
  onResize,
  onReset,
}: {
  label: string;
  currentWidth: number | null;
  fallbackWidth: number;
  onResize: (width: number) => void;
  onReset: () => void;
}) {
  const dragRef = useRef<{ x: number; w: number } | null>(null);

  const effectiveWidth = () => currentWidth ?? fallbackWidth;

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    dragRef.current = { x: e.clientX, w: effectiveWidth() };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const start = dragRef.current;
    if (!start) return;
    onResize(Math.max(EB_MIN_COL_WIDTH, start.w + (e.clientX - start.x)));
  };
  const handlePointerEnd = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    dragRef.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* pointer already released */
    }
  };
  const handleKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      onResize(Math.max(EB_MIN_COL_WIDTH, effectiveWidth() - EB_KEY_STEP));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      onResize(effectiveWidth() + EB_KEY_STEP);
    }
  };

  return (
    <div
      className="eb-col-resize"
      role="separator"
      aria-orientation="vertical"
      aria-label={`Resize ${label} column`}
      tabIndex={0}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onDoubleClick={onReset}
      onKeyDown={handleKeyDown}
    />
  );
}

/**
 * Dedicated editor for the "endurance_block" document kind. A manually-editable,
 * calendar-based training block for endurance/multi-discipline clients — no AI
 * generation, no session logging, no signature requirement. Everything edits in
 * place (spreadsheet-style cells), because that is Esther's explicit requirement
 * ("everything needs to be editable... by me... not by an AI agent... time is
 * money"). All edits flow up through `onChange` and are saved by the parent's
 * existing PATCH flow under `body.enduranceBlock`.
 */
/**
 * CR-EF-211 — paste a whole plan written in the standard text layout (Title /
 * Target event / dates / Direction / Weekly targets / Coaching note / Calendar
 * table) and fill the editor from it. Nothing is saved until the normal Save,
 * so Esther reviews and tweaks the result first. Anything the parser couldn't
 * place is listed so it can be fixed by hand.
 */
function PastePlanPanel({
  data,
  onChange,
  onTitleChange,
}: {
  data: EnduranceBlockData;
  onChange: (next: EnduranceBlockData) => void;
  onTitleChange?: (title: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [result, setResult] = useState<{ days: number; weeks: number; warnings: string[] } | null>(null);

  const hasContent = data.rows.length > 0 || Boolean(data.directionIntro?.trim()) || data.disciplineTargets.length > 0;

  const apply = () => {
    const parsed = parseEndurancePlan(text);
    const days = parsed.block.rows.filter((r) => r.type === "day").length;
    if (days === 0 && !parsed.block.directionIntro) {
      setResult({ days: 0, weeks: 0, warnings: parsed.warnings.length ? parsed.warnings : ["Nothing recognisable in the pasted text."] });
      return;
    }
    if (hasContent && !confirm("This replaces everything currently in this plan with the pasted one. Continue?")) return;
    onChange(parsed.block);
    if (parsed.title) onTitleChange?.(parsed.title);
    setResult({ days, weeks: parsed.block.rows.length - days, warnings: parsed.warnings });
    setText("");
  };

  if (!open) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-lg border border-dashed border-[var(--hub-border)] px-4 py-3">
        <p className="text-sm text-muted-foreground">Have the plan written out already? Paste it in and it fills this document for you.</p>
        <Button type="button" variant="outline" size="sm" className="rounded-lg shrink-0" onClick={() => { setOpen(true); setResult(null); }}>
          Paste plan
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-lg border border-[var(--hub-border)] bg-[var(--hub-canvas)] p-4">
      <div className="flex items-baseline justify-between gap-3">
        <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--rose-text)]">Paste plan</h4>
        <button type="button" className="text-xs text-muted-foreground underline underline-offset-2 hover:opacity-80" onClick={() => setOpen(false)}>
          Close
        </button>
      </div>
      <p className="text-xs text-muted-foreground">
        Paste the full plan: Title, Target event, Start date, End date, then the Direction, Weekly targets, Coaching note
        and Calendar sections. Copy the calendar straight from the table so each column stays separate. Nothing is saved
        until you press Save.
      </p>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={"Title: Rick — Foundation (12–25 Oct)\nTarget event: …\nStart date: 12/10/2026\nEnd date: 25/10/2026\nDirection\n…"}
        className="min-h-[200px] resize-y font-mono text-xs bg-background"
      />
      <div className="flex items-center gap-3">
        <Button type="button" size="sm" className="rounded-lg" onClick={apply} disabled={!text.trim()}>
          Fill plan from text
        </Button>
      </div>
      {result && (
        <div className="space-y-1 text-sm">
          {result.days > 0 && (
            <p className="text-teal">
              Filled in {result.days} {result.days === 1 ? "day" : "days"} and {result.weeks} week {result.weeks === 1 ? "total" : "totals"}. Check it below, then press Save.
            </p>
          )}
          {result.warnings.length > 0 && (
            <ul className="list-disc pl-5 text-amber-800">
              {result.warnings.map((w, i) => <li key={i}>{w}</li>)}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export function EnduranceBlockEditor({
  data,
  locked,
  onChange,
  onTitleChange,
}: {
  data: EnduranceBlockData;
  locked: boolean;
  onChange: (next: EnduranceBlockData) => void;
  /** Called with the pasted plan's "Title:" line, so the document title follows it. */
  onTitleChange?: (title: string) => void;
}) {
  const update = (patch: Partial<EnduranceBlockData>) => onChange({ ...data, ...patch });

  // Discipline targets
  const updateTarget = (id: string, patch: Partial<EnduranceDisciplineTarget>) =>
    update({ disciplineTargets: data.disciplineTargets.map((t) => (t.id === id ? { ...t, ...patch } : t)) });
  const addTarget = () =>
    update({ disciplineTargets: [...data.disciplineTargets, { id: uid(), discipline: "", detail: "" }] });
  const removeTarget = (id: string) =>
    update({ disciplineTargets: data.disciplineTargets.filter((t) => t.id !== id) });

  // Calendar rows
  const updateRow = (id: string, patch: Partial<EnduranceCalendarRow>) =>
    update({ rows: data.rows.map((r) => (r.id === id ? { ...r, ...patch } : r)) });
  const addRow = (type: "day" | "week_summary") =>
    update({ rows: [...data.rows, type === "day" ? newDayRow() : newSummaryRow()] });
  const removeRow = (id: string) => update({ rows: data.rows.filter((r) => r.id !== id) });

  // CR-EF-210 — per-column widths (editor only, localStorage, not in DB)
  const tableRef = useRef<HTMLTableElement>(null);
  const [colWidths, setColWidths] = useState<(number | null)[]>(emptyColWidths);
  useEffect(() => {
    setColWidths(loadColWidths());
  }, []);
  const hasCustomWidths = colWidths.some((w) => w != null);

  /** Snapshot currently rendered widths for all six columns so the first
      resize switches to table-layout:fixed without a visual jump. */
  const snapshotRenderedWidths = (): (number | null)[] => {
    const ths = tableRef.current?.querySelectorAll("thead th");
    return EB_COL_IDS.map((id, i) => {
      const th = ths?.[i] as HTMLElement | undefined;
      if (th) return Math.max(EB_MIN_COL_WIDTH, Math.round(th.getBoundingClientRect().width));
      return EB_COL_FALLBACK[id];
    });
  };

  const applyColWidth = (index: number, width: number) => {
    setColWidths((prev) => {
      const next = prev.some((w) => w != null) ? prev.slice() : snapshotRenderedWidths();
      next[index] = Math.max(EB_MIN_COL_WIDTH, Math.round(width));
      saveColWidths(next);
      return next;
    });
  };

  const resetColWidth = (index: number) => {
    setColWidths((prev) => {
      const next = prev.slice();
      next[index] = null;
      const result = next.every((w) => w == null) ? emptyColWidths() : next;
      saveColWidths(result);
      return result;
    });
  };

  const resetAllColWidths = () => {
    const cleared = emptyColWidths();
    setColWidths(cleared);
    saveColWidths(cleared);
  };

  const colWidthFor = (id: EbColId, index: number): number | null => {
    const custom = colWidths[index];
    if (custom != null) return custom;
    if (!hasCustomWidths) return null;
    return EB_COL_FALLBACK[id];
  };

  const tableWidthPx = hasCustomWidths
    ? EB_COL_IDS.reduce((sum, id, i) => sum + (colWidthFor(id, i) ?? EB_COL_FALLBACK[id]), 0) +
      (locked ? 0 : EB_ACTIONS_COL_WIDTH)
    : null;

  const targets = data.disciplineTargets ?? [];

  return (
    <div className="space-y-8">
      {!locked && <PastePlanPanel data={data} onChange={onChange} onTitleChange={onTitleChange} />}

      {/* Header meta fields — target event + date range */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Target event</Label>
          <Input
            value={data.targetEvent ?? ""}
            onChange={(e) => update({ targetEvent: e.target.value })}
            placeholder="e.g. Cross Triathlon Vorden, 1/8th distance"
            disabled={locked}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Start date</Label>
          <Input type="date" value={data.startDate ?? ""} onChange={(e) => update({ startDate: e.target.value })} disabled={locked} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">End date</Label>
          <Input type="date" value={data.endDate ?? ""} onChange={(e) => update({ endDate: e.target.value })} disabled={locked} />
        </div>
      </div>

      {/* Direction */}
      <section>
        <div className="flex items-baseline justify-between gap-3 mb-3">
          <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--rose-text)]">Direction</h4>
          {!locked && <span className="text-xs text-muted-foreground">Tap any text to edit it</span>}
        </div>
        <Textarea
          value={data.directionIntro ?? ""}
          onChange={(e) => update({ directionIntro: e.target.value })}
          placeholder="Write the framing paragraph for this block…"
          disabled={locked}
          className="min-h-[96px] resize-y mb-2"
        />
        <ul className="eb-bullets">
          {targets.map((t) => (
            <li key={t.id} className="eb-bullet-edit">
              <div className="flex items-start gap-2">
                <input
                  className="eb-cell font-semibold"
                  style={{ width: "9.5rem", flex: "none" }}
                  value={t.discipline}
                  onChange={(e) => updateTarget(t.id, { discipline: e.target.value })}
                  placeholder="Swim"
                  disabled={locked}
                />
                <AutoCell
                  value={t.detail}
                  onChange={(v) => updateTarget(t.id, { detail: v })}
                  placeholder="~1–1.5 hrs/week, open water"
                  disabled={locked}
                />
              </div>
              {!locked && (
                <button type="button" className="eb-bullet-rm" title="Remove target" onClick={() => removeTarget(t.id)}>
                  <IconTrash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </li>
          ))}
        </ul>
        {!locked && (
          <button type="button" className="eb-add" onClick={addTarget}>
            <span className="text-base leading-none">+</span> Add weekly target
          </button>
        )}

        {/* Coaching note callout */}
        <div className="eb-callout">
          <div className="eb-callout-top">
            <span className="eb-callout-ic"><IconMessageCircle className="h-3.5 w-3.5" /></span>
            <span className="eb-callout-title">Coaching note</span>
            {!locked && data.coachingNotes ? (
              <button type="button" className="eb-callout-x" title="Clear note" onClick={() => update({ coachingNotes: "" })}>
                <IconTrash2 className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </div>
          <Textarea
            value={data.coachingNotes ?? ""}
            onChange={(e) => update({ coachingNotes: e.target.value })}
            placeholder="Write the coaching note…"
            disabled={locked}
            className="min-h-[72px] resize-y bg-transparent border-0 p-0 shadow-none text-sm leading-relaxed"
          />
        </div>
      </section>

      {/* Calendar */}
      <section>
        <div className="flex items-baseline justify-between gap-3 mb-3">
          <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--rose-text)]">Calendar</h4>
          {!locked && (
            <span className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap justify-end">
              <span>Every cell is editable — type straight into it</span>
              {hasCustomWidths && (
                <button type="button" className="underline underline-offset-2 hover:opacity-80" onClick={resetAllColWidths}>
                  Reset column widths
                </button>
              )}
            </span>
          )}
        </div>
        <div className="eb-table-wrap rounded-lg border border-[var(--color-border-warm)] bg-white">
          <table
            ref={tableRef}
            className="eb-table"
            style={
              hasCustomWidths && tableWidthPx != null
                ? { tableLayout: "fixed", width: `${tableWidthPx}px`, minWidth: "100%" }
                : undefined
            }
          >
            <colgroup>
              {EB_COL_IDS.map((id, i) => {
                const w = colWidthFor(id, i);
                return <col key={id} style={w != null ? { width: `${w}px` } : undefined} />;
              })}
              {!locked && <col style={hasCustomWidths ? { width: `${EB_ACTIONS_COL_WIDTH}px` } : undefined} />}
            </colgroup>
            <thead>
              <tr>
                {EB_COL_IDS.map((id, i) => (
                  <th key={id}>
                    {EB_COL_LABELS[id]}
                    {!locked && (
                      <ColResizeHandle
                        label={EB_COL_LABELS[id]}
                        currentWidth={colWidths[i]}
                        fallbackWidth={EB_COL_FALLBACK[id]}
                        onResize={(w) => applyColWidth(i, w)}
                        onReset={() => resetColWidth(i)}
                      />
                    )}
                  </th>
                ))}
                {!locked && <th className="w-px" aria-label="Actions" />}
              </tr>
            </thead>
            <tbody>
              {data.rows.length === 0 && (
                <tr>
                  <td colSpan={locked ? 6 : 7} className="text-sm text-muted-foreground py-8 text-center">
                    No sessions yet — add a day or a week summary below.
                  </td>
                </tr>
              )}
              {data.rows.map((r) =>
                r.type === "week_summary" ? (
                  <tr key={r.id} className="eb-sum">
                    <td colSpan={2}>
                      <AutoCell
                        value={r.weekLabel ?? ""}
                        onChange={(v) => updateRow(r.id, { weekLabel: v })}
                        placeholder="Week 1 (19–23 Aug, partial)"
                        disabled={locked}
                      />
                    </td>
                    <td><AutoCell value={r.run ?? ""} onChange={(v) => updateRow(r.id, { run: v })} placeholder="—" disabled={locked} /></td>
                    <td><AutoCell value={r.bike ?? ""} onChange={(v) => updateRow(r.id, { bike: v })} placeholder="—" disabled={locked} /></td>
                    <td><AutoCell value={r.swim ?? ""} onChange={(v) => updateRow(r.id, { swim: v })} placeholder="—" disabled={locked} /></td>
                    <td className="eb-sum-notes">
                      <AutoCell value={r.notes ?? ""} onChange={(v) => updateRow(r.id, { notes: v })} placeholder="Week total" disabled={locked} />
                    </td>
                    {!locked && (
                      <td className="text-right align-top">
                        <button type="button" className="eb-row-del" title="Remove week summary" onClick={() => removeRow(r.id)}>
                          <IconTrash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ) : (
                  <tr key={r.id} className={cn(r.highlight === "brick" && "eb-brick", r.highlight === "race" && "eb-race")}>
                    <td className="eb-date-cell">
                      <input className="eb-cell" value={r.date ?? ""} onChange={(e) => updateRow(r.id, { date: e.target.value })} placeholder="—" disabled={locked} />
                    </td>
                    <td className="eb-day-cell">
                      <input className="eb-cell" value={r.dayLabel ?? ""} onChange={(e) => updateRow(r.id, { dayLabel: e.target.value })} placeholder="—" disabled={locked} />
                    </td>
                    <td><AutoCell value={r.run ?? ""} onChange={(v) => updateRow(r.id, { run: v })} placeholder="—" disabled={locked} /></td>
                    <td><AutoCell value={r.bike ?? ""} onChange={(v) => updateRow(r.id, { bike: v })} placeholder="—" disabled={locked} /></td>
                    <td><AutoCell value={r.swim ?? ""} onChange={(v) => updateRow(r.id, { swim: v })} placeholder="—" disabled={locked} /></td>
                    <td className="eb-notes-cell">
                      {r.highlight && (
                        <span className={cn("eb-tag", r.highlight === "race" && "eb-tag--race")}>
                          {r.highlight === "race" ? "Race day" : "Brick"}
                        </span>
                      )}
                      <AutoCell value={r.notes ?? ""} onChange={(v) => updateRow(r.id, { notes: v })} placeholder="Notes" disabled={locked} />
                    </td>
                    {!locked && (
                      <td className="text-right align-top whitespace-nowrap">
                        <select
                          className="eb-hl"
                          value={r.highlight ?? ""}
                          onChange={(e) => updateRow(r.id, { highlight: (e.target.value || null) as EnduranceCalendarRow["highlight"] })}
                          aria-label="Row highlight"
                        >
                          <option value="">—</option>
                          <option value="brick">Brick</option>
                          <option value="race">Race</option>
                        </select>
                        <button type="button" className="eb-row-del" title="Delete row" onClick={() => removeRow(r.id)}>
                          <IconTrash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
        {!locked && (
          <div className="flex items-center gap-2 flex-wrap mt-3">
            <button type="button" className="eb-add" onClick={() => addRow("day")}>
              <span className="text-base leading-none">+</span> Add day
            </button>
            <button type="button" className="eb-add" onClick={() => addRow("week_summary")}>
              <span className="text-base leading-none">+</span> Add week summary
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
