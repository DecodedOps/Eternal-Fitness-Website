/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from "vitest";

// BUG-EF-199 — deleting a hub session must never call Graph deleteEvent
// directly (mappings point at Esther's real, adopted Outlook entries).

const deleteEvent = vi.fn();
const sessionDelete = vi.fn();

vi.mock("@/lib/graph-client", () => ({ deleteEvent }));
vi.mock("@/lib/calendar-sync", () => ({ syncSessionCalendarEvent: vi.fn() }));
vi.mock("@/lib/supabase-server", () => ({
  createClient: () => ({
    auth: { getUser: async () => ({ data: { user: { id: "u1" } } }) },
    from: (table: string) => {
      const b: any = {
        select: () => b,
        eq: () => b,
        maybeSingle: async () =>
          table === "session_calendar_events"
            ? { data: { event_id: "AAMk-esther-real-appointment" }, error: null }
            : { data: null, error: null },
        delete: () => ({ eq: async () => { sessionDelete(table); return { error: null }; } }),
      };
      return b;
    },
  }),
}));

import { DELETE } from "./route";

describe("DELETE /api/sessions/[id]", () => {
  it("removes the session without ever calling deleteEvent", async () => {
    const res = await DELETE(new Request("http://x/api/sessions/s1", { method: "DELETE" }), { params: { id: "s1" } });
    expect(res.status).toBe(200);
    expect(sessionDelete).toHaveBeenCalledWith("sessions");
    expect(deleteEvent).not.toHaveBeenCalled();
  });
});
