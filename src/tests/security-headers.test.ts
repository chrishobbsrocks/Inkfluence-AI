import { describe, it, expect } from "vitest";
import nextConfig from "../../next.config";

describe("next.config security headers", () => {
  it("defines a headers function", () => {
    expect(nextConfig.headers).toBeDefined();
    expect(typeof nextConfig.headers).toBe("function");
  });

  it("returns security headers for all routes", async () => {
    const headerSets = await nextConfig.headers!();
    expect(headerSets.length).toBeGreaterThan(0);

    const mainHeaders = headerSets[0]!;
    expect(mainHeaders.source).toBe("/(.*)" );

    const headerNames = mainHeaders.headers.map((h) => h.key);
    expect(headerNames).toContain("X-Frame-Options");
    expect(headerNames).toContain("X-Content-Type-Options");
    expect(headerNames).toContain("Referrer-Policy");
    expect(headerNames).toContain("Permissions-Policy");
    expect(headerNames).toContain("Content-Security-Policy");
  });

  it("sets X-Frame-Options to DENY", async () => {
    const headerSets = await nextConfig.headers!();
    const headers = headerSets[0]!.headers;
    const xfo = headers.find((h) => h.key === "X-Frame-Options");
    expect(xfo?.value).toBe("DENY");
  });

  it("sets X-Content-Type-Options to nosniff", async () => {
    const headerSets = await nextConfig.headers!();
    const headers = headerSets[0]!.headers;
    const xcto = headers.find((h) => h.key === "X-Content-Type-Options");
    expect(xcto?.value).toBe("nosniff");
  });

  it("includes CSP with self default-src", async () => {
    const headerSets = await nextConfig.headers!();
    const headers = headerSets[0]!.headers;
    const csp = headers.find((h) => h.key === "Content-Security-Policy");
    expect(csp?.value).toContain("default-src 'self'");
    expect(csp?.value).toContain("clerk.com");
  });

  it("blocks camera, microphone, and geolocation", async () => {
    const headerSets = await nextConfig.headers!();
    const headers = headerSets[0]!.headers;
    const pp = headers.find((h) => h.key === "Permissions-Policy");
    expect(pp?.value).toContain("camera=()");
    expect(pp?.value).toContain("microphone=()");
    expect(pp?.value).toContain("geolocation=()");
  });
});
