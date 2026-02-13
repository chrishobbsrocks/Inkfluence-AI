import { describe, it, expect, vi, beforeEach } from "vitest";

describe("Database driver selection", () => {
  const TEST_URL = "postgresql://test:test@localhost:5432/test";

  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  it("defaults to neon driver when DB_DRIVER is not set", async () => {
    vi.stubEnv("DATABASE_URL", TEST_URL);

    const neonFn = vi.fn().mockReturnValue(() => {});
    vi.doMock("@neondatabase/serverless", () => ({ neon: neonFn }));
    vi.doMock("drizzle-orm/neon-http", () => ({
      drizzle: vi.fn().mockReturnValue({ select: vi.fn() }),
    }));
    vi.doMock("drizzle-orm/postgres-js", () => ({
      drizzle: vi.fn(),
    }));
    vi.doMock("postgres", () => ({ default: vi.fn() }));

    const { getDb } = await import("@/server/db");
    getDb();

    expect(neonFn).toHaveBeenCalledWith(TEST_URL);
  });

  it("uses postgres-js driver when DB_DRIVER is postgres-js", async () => {
    vi.stubEnv("DATABASE_URL", TEST_URL);
    vi.stubEnv("DB_DRIVER", "postgres-js");

    const postgresFn = vi.fn().mockReturnValue({});
    vi.doMock("postgres", () => ({ default: postgresFn }));
    vi.doMock("drizzle-orm/postgres-js", () => ({
      drizzle: vi.fn().mockReturnValue({ select: vi.fn() }),
    }));
    vi.doMock("@neondatabase/serverless", () => ({
      neon: vi.fn(),
    }));
    vi.doMock("drizzle-orm/neon-http", () => ({
      drizzle: vi.fn(),
    }));

    const { getDb } = await import("@/server/db");
    getDb();

    expect(postgresFn).toHaveBeenCalledWith(TEST_URL);
  });

  it("throws when DATABASE_URL is not set", async () => {
    vi.stubEnv("DATABASE_URL", "");
    delete process.env.DATABASE_URL;

    vi.doMock("@neondatabase/serverless", () => ({
      neon: vi.fn(),
    }));
    vi.doMock("drizzle-orm/neon-http", () => ({
      drizzle: vi.fn(),
    }));
    vi.doMock("drizzle-orm/postgres-js", () => ({
      drizzle: vi.fn(),
    }));
    vi.doMock("postgres", () => ({ default: vi.fn() }));

    const { getDb } = await import("@/server/db");
    expect(() => getDb()).toThrow("DATABASE_URL is not set");
  });

  it("uses neon driver when DB_DRIVER is explicitly set to neon", async () => {
    vi.stubEnv("DATABASE_URL", TEST_URL);
    vi.stubEnv("DB_DRIVER", "neon");

    const neonFn = vi.fn().mockReturnValue(() => {});
    vi.doMock("@neondatabase/serverless", () => ({ neon: neonFn }));
    vi.doMock("drizzle-orm/neon-http", () => ({
      drizzle: vi.fn().mockReturnValue({ select: vi.fn() }),
    }));
    vi.doMock("drizzle-orm/postgres-js", () => ({
      drizzle: vi.fn(),
    }));
    vi.doMock("postgres", () => ({ default: vi.fn() }));

    const { getDb } = await import("@/server/db");
    getDb();

    expect(neonFn).toHaveBeenCalledWith(TEST_URL);
  });
});
