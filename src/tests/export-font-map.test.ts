import { describe, it, expect } from "vitest";
import { resolveFontFamily, resolveEpubFontFamily } from "@/lib/export/font-map";

describe("resolveFontFamily", () => {
  it("maps var(--font-body) to Helvetica", () => {
    expect(resolveFontFamily("var(--font-body)")).toBe("Helvetica");
  });

  it("maps var(--font-heading) to Times-Roman", () => {
    expect(resolveFontFamily("var(--font-heading)")).toBe("Times-Roman");
  });

  it("maps Georgia, serif to Times-Roman", () => {
    expect(resolveFontFamily("Georgia, serif")).toBe("Times-Roman");
  });

  it("returns Helvetica for unknown fonts", () => {
    expect(resolveFontFamily("unknown-font")).toBe("Helvetica");
  });
});

describe("resolveEpubFontFamily", () => {
  it("maps var(--font-body) to DM Sans stack", () => {
    expect(resolveEpubFontFamily("var(--font-body)")).toContain("DM Sans");
  });

  it("maps var(--font-heading) to Georgia stack", () => {
    expect(resolveEpubFontFamily("var(--font-heading)")).toContain("Georgia");
  });

  it("returns sans-serif for unknown fonts", () => {
    expect(resolveEpubFontFamily("unknown")).toBe("sans-serif");
  });
});
