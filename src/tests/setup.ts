import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Polyfill ResizeObserver for jsdom (used by Radix UI)
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
