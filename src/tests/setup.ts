import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Polyfill ResizeObserver for jsdom (used by Radix UI)
// Must be a proper class so `new ResizeObserver()` works
global.ResizeObserver = class ResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
} as unknown as typeof globalThis.ResizeObserver;
