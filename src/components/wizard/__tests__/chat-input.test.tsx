import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ChatInput } from "../chat-input";

// Mock tooltip provider context
vi.mock("@/components/ui/tooltip", () => ({
  Tooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  TooltipTrigger: ({ children, ...props }: { children: React.ReactNode; asChild?: boolean }) => <span {...props}>{children}</span>,
  TooltipContent: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));

describe("ChatInput", () => {
  const defaultProps = {
    onSendMessage: vi.fn(),
    isStreaming: false,
    questionCount: 3,
    totalQuestions: 12,
  };

  it("renders input field and send button", () => {
    render(<ChatInput {...defaultProps} />);
    expect(screen.getByPlaceholderText("Type your response...")).toBeInTheDocument();
    expect(screen.getByText("Send")).toBeInTheDocument();
  });

  it("shows question counter", () => {
    render(<ChatInput {...defaultProps} />);
    expect(screen.getByText("Question 3 of ~12")).toBeInTheDocument();
  });

  it("calls onSendMessage when form is submitted", () => {
    const onSend = vi.fn();
    render(<ChatInput {...defaultProps} onSendMessage={onSend} />);
    const input = screen.getByPlaceholderText("Type your response...");
    fireEvent.change(input, { target: { value: "My answer" } });
    fireEvent.submit(input.closest("form")!);
    expect(onSend).toHaveBeenCalledWith("My answer");
  });

  it("clears input after sending", () => {
    render(<ChatInput {...defaultProps} onSendMessage={vi.fn()} />);
    const input = screen.getByPlaceholderText("Type your response...") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "My answer" } });
    fireEvent.submit(input.closest("form")!);
    expect(input.value).toBe("");
  });

  it("disables input and send when streaming", () => {
    render(<ChatInput {...defaultProps} isStreaming={true} />);
    expect(screen.getByPlaceholderText("Type your response...")).toBeDisabled();
  });

  it("does not send empty messages", () => {
    const onSend = vi.fn();
    render(<ChatInput {...defaultProps} onSendMessage={onSend} />);
    fireEvent.submit(screen.getByPlaceholderText("Type your response...").closest("form")!);
    expect(onSend).not.toHaveBeenCalled();
  });

  it("shows disabled Record and Upload buttons", () => {
    render(<ChatInput {...defaultProps} />);
    expect(screen.getByText("Record")).toBeDisabled();
    expect(screen.getByText("Upload notes")).toBeDisabled();
  });
});
