import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ChatMessage } from "../chat-message";

describe("ChatMessage", () => {
  it("renders AI message content", () => {
    render(<ChatMessage role="assistant" content="Hello! How can I help?" />);
    expect(screen.getByText("Hello! How can I help?")).toBeInTheDocument();
  });

  it("renders user message content", () => {
    render(
      <ChatMessage role="user" content="My answer" userInitial="C" />
    );
    expect(screen.getByText("My answer")).toBeInTheDocument();
  });

  it("shows user initial in avatar", () => {
    render(
      <ChatMessage role="user" content="Test" userInitial="M" />
    );
    expect(screen.getByText("M")).toBeInTheDocument();
  });

  it("defaults user initial to U", () => {
    render(<ChatMessage role="user" content="Test" />);
    expect(screen.getByText("U")).toBeInTheDocument();
  });

  it("renders bold text in content", () => {
    render(
      <ChatMessage role="assistant" content="This is **important** text" />
    );
    const bold = screen.getByText("important");
    expect(bold.tagName).toBe("STRONG");
  });
});
