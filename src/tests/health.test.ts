import { describe, it, expect } from "vitest";
import { GET } from "@/app/api/health/route";

describe("/api/health", () => {
  it("returns 200 with status ok", async () => {
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe("ok");
    expect(data.timestamp).toBeDefined();
    expect(data.version).toBeDefined();
  });
});
