import { describe, it, expect, vi } from "vitest";
import { guardForEnvironment, isNonProductionEnv, type EmailSender } from "./email";

const mk = () => {
  const send = vi.fn(async () => ({ success: true as const, messageId: "x" }));
  return { inner: { send } as EmailSender, send };
};
const msg = (to: string | string[]) => ({ to, subject: "s", html: "<p>h</p>" });

describe("isNonProductionEnv", () => {
  it("detects APP_ENV=staging", () => {
    expect(isNonProductionEnv({ APP_ENV: "staging" } as any)).toBe(true);
  });
  it("detects development.* host", () => {
    expect(isNonProductionEnv({ NEXT_PUBLIC_SITE_URL: "https://development.eternal-fitness.co.uk" } as any)).toBe(true);
  });
  it("treats production as production", () => {
    expect(isNonProductionEnv({ NEXT_PUBLIC_SITE_URL: "https://eternal-fitness.co.uk" } as any)).toBe(false);
    expect(isNonProductionEnv({} as any)).toBe(false);
  });
});

describe("guardForEnvironment", () => {
  it("passes straight through in production", async () => {
    const { inner, send } = mk();
    await guardForEnvironment(inner, {} as any).send(msg("client@example.com"));
    expect(send).toHaveBeenCalledOnce();
  });
  it("blocks everything on staging with no allowlist", async () => {
    const { inner, send } = mk();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const r = await guardForEnvironment(inner, { APP_ENV: "staging" } as any).send(msg("client@example.com"));
    expect(send).not.toHaveBeenCalled();
    expect(r.dryRun).toBe(true);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
  it("only sends to allowlisted addresses/domains on staging", async () => {
    const { inner, send } = mk();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const env = { APP_ENV: "staging", EMAIL_ALLOWLIST: "ok@x.com, @test.dev" } as any;
    await guardForEnvironment(inner, env).send(msg(["ok@x.com", "a@test.dev", "real@client.com"]));
    expect(send).toHaveBeenCalledWith(expect.objectContaining({ to: ["ok@x.com", "a@test.dev"] }));
    warn.mockRestore();
  });
});
