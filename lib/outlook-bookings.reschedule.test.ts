/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";

// BUG-EF-197 — inbound reschedules must apply to managed/adopted events
// (those mapped in session_calendar_events), which syncOutlookBookings used
// to skip entirely before reaching the CR-EF-095 reschedule branch.

type Row = Record<string, any>;
const tables: Record<string, Row[]> = {};
const updates: { table: string; patch: Row; where: Row }[] = [];
let events: any[] = [];

function builder(table: string) {
  const filters: Row = {};
  let patch: Row | null = null;
  const b: any = {
    select: () => b,
    eq: (k: string, v: any) => { filters[k] = v; return b; },
    update: (p: Row) => { patch = p; return b; },
    insert: () => b,
    delete: () => b,
    single: async () => ({ data: null, error: null }),
    maybeSingle: async () => ({
      data: (tables[table] ?? []).find((r) => Object.entries(filters).every(([k, v]) => r[k] === v)) ?? null,
      error: null,
    }),
    then: (resolve: any) => {
      if (patch) updates.push({ table, patch, where: { ...filters } });
      const data = patch ? null : (tables[table] ?? []);
      return Promise.resolve({ data, error: null }).then(resolve);
    },
  };
  return b;
}

vi.mock("@/lib/pg-client", () => ({ createPgClient: () => ({ from: builder }) }));
vi.mock("@/lib/supplementary-attach", () => ({ attachSupplementaryWork: vi.fn() }));
vi.mock("@/lib/graph-client", () => ({
  graphConfigured: () => true,
  getIntegrationStatus: async () => ({ connected: true, calendarId: "cal-1" }),
  listCalendarView: async () => events,
  GraphReconnectError: class extends Error {},
}));

import { syncOutlookBookings } from "@/lib/outlook-bookings";

const ev = (id: string, subject: string, start: string) => ({
  id,
  subject,
  start: { dateTime: start, timeZone: "UTC" },
  end: { dateTime: start, timeZone: "UTC" },
});

beforeEach(() => {
  updates.length = 0;
  tables.clients = [{ id: "c1", name: "Nathan Wadey" }];
  tables.session_calendar_events = [{ event_id: "AAMk-adopted", session_id: "s1" }];
  tables.sessions = [
    { id: "s1", scheduled_at: "2026-11-16T09:00:00.000Z", cancelled_at: null, status: "scheduled" },
    { id: "s2", scheduled_at: "2026-11-16T09:00:00.000Z", cancelled_at: "2026-11-10T00:00:00Z", status: "cancelled" },
    { id: "s3", scheduled_at: "2026-11-02T09:00:00.000Z", cancelled_at: null, status: "completed" },
  ];
  tables.outlook_booking_events = [];
});

describe("syncOutlookBookings managed-event reschedule (BUG-EF-197)", () => {
  it("applies an inbound reschedule to a managed event's session", async () => {
    events = [ev("AAMk-adopted", "Personal Training - Nathan Wadey", "2026-11-17T10:30:00.0000000")];
    const r = await syncOutlookBookings();
    expect(r.rescheduled).toBe(1);
    expect(updates.find((u) => u.table === "sessions")).toEqual({
      table: "sessions",
      patch: { scheduled_at: "2026-11-17T10:30:00.000Z" },
      where: { id: "s1" },
    });
    // still never ingested as a new booking
    expect(r.created).toBe(0);
    expect(r.updated).toBe(0);
  });

  it("does nothing when the time is unchanged", async () => {
    events = [ev("AAMk-adopted", "Personal Training - Nathan Wadey", "2026-11-16T09:00:00.0000000")];
    const r = await syncOutlookBookings();
    expect(r.rescheduled).toBe(0);
    expect(updates).toHaveLength(0);
  });

  it("leaves cancelled sessions alone", async () => {
    tables.session_calendar_events = [{ event_id: "AAMk-adopted", session_id: "s2" }];
    events = [ev("AAMk-adopted", "Personal Training - Nathan Wadey", "2026-11-17T10:30:00.0000000")];
    const r = await syncOutlookBookings();
    expect(r.rescheduled).toBe(0);
    expect(updates).toHaveLength(0);
  });

  it("leaves completed sessions alone", async () => {
    tables.session_calendar_events = [{ event_id: "AAMk-adopted", session_id: "s3" }];
    events = [ev("AAMk-adopted", "Personal Training - Nathan Wadey", "2026-11-17T10:30:00.0000000")];
    const r = await syncOutlookBookings();
    expect(r.rescheduled).toBe(0);
    expect(updates).toHaveLength(0);
  });
});
