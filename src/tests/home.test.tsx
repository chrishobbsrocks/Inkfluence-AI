import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

describe("Home page", () => {
  it("renders the Inkfluence AI heading", () => {
    render(<Home />);
    expect(screen.getByText("Inkfluence AI")).toBeInTheDocument();
  });

  it("renders the tagline", () => {
    render(<Home />);
    expect(
      screen.getByText(
        "Transform your ideas into complete, formatted ebooks in minutes."
      )
    ).toBeInTheDocument();
  });
});
