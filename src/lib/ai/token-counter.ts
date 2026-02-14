import type { ConversationMessage } from "@/types/wizard";

/** Approximate token count (1 token ~ 4 characters) */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Truncate conversation history to fit within a token budget.
 * Keeps the most recent messages that fit, always preserving the latest user message.
 */
export function truncateConversationHistory(
  messages: ConversationMessage[],
  tokenBudget: number = 8000
): ConversationMessage[] {
  if (messages.length === 0) return messages;

  // Calculate total tokens
  let totalTokens = 0;
  for (const msg of messages) {
    totalTokens += estimateTokens(msg.content);
  }

  // If within budget, return as-is
  if (totalTokens <= tokenBudget) return messages;

  // Keep messages from the end until we hit the budget
  const kept: ConversationMessage[] = [];
  let usedTokens = 0;

  for (let i = messages.length - 1; i >= 0; i--) {
    const msgTokens = estimateTokens(messages[i]!.content);
    if (usedTokens + msgTokens > tokenBudget && kept.length > 0) {
      break;
    }
    kept.unshift(messages[i]!);
    usedTokens += msgTokens;
  }

  return kept;
}
