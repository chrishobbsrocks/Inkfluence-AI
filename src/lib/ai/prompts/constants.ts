export const AI_MODEL = "claude-sonnet-4-5-20250929";
export const MAX_TOKENS = 4096;
export const STREAM_MAX_TOKENS = 2048;
export const GENERATION_MAX_TOKENS = 8192;
export const TARGET_QUESTION_COUNT = 12;
export const CHAT_TEMPERATURE = 0.7;
export const OUTLINE_TEMPERATURE = 0.3;
export const GENERATION_TEMPERATURE = 0.7;
export const QA_TEMPERATURE = 0.2;
export const QA_MAX_TOKENS = 4096;
export const QA_CONSISTENCY_MAX_TOKENS = 2048;
export const METADATA_MAX_TOKENS = 1024;
export const METADATA_TEMPERATURE = 0.3;

/**
 * Anti-AI voice rules injected into all content generation prompts.
 * These ensure generated text sounds like a human expert wrote it.
 */
export const HUMAN_VOICE_RULES = `## Voice and Style Rules (CRITICAL)
The content must read like a human expert wrote it. Follow these rules strictly:

- NEVER use em dashes (\u2014). If a pause is needed, use a regular dash (-) or restructure the sentence.
- NEVER use these AI-giveaway phrases: "In today's world", "It's important to note", "Let's dive in", "In conclusion", "It's worth mentioning that".
- NEVER chain filler transitions like "Furthermore", "Moreover", "Additionally" in sequence. One per section max, and prefer shorter connectors like "And", "Plus", "Also", or just start the next thought.
- Use contractions naturally (don't, won't, can't, it's, you're). Real people use them.
- Mix short, punchy sentences with longer ones. That's natural rhythm.
- Write like a knowledgeable friend explaining something, not a formal report.
- No bullet point lists unless the user's outline specifically calls for them.
- Avoid hedging phrases like "It could be argued that" or "One might consider". Just say the thing.
- Start some paragraphs with "But", "And", or "So" when it fits. That's how people actually write.`;
