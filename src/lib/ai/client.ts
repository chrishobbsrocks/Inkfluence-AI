import Anthropic from "@anthropic-ai/sdk";

let _client: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
  if (_client) return _client;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Please add it to your .env.local file."
    );
  }

  _client = new Anthropic({ apiKey });
  return _client;
}

/** For testing: allows resetting the singleton */
export function resetClient(): void {
  _client = null;
}
