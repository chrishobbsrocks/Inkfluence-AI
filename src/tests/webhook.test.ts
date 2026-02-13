import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/webhooks/clerk/route";

// Mock svix with a proper class
vi.mock("svix", () => {
  return {
    Webhook: class MockWebhook {
      verify() {
        return {
          type: "user.created",
          data: {
            id: "user_test123",
            email_addresses: [
              {
                email_address: "test@example.com",
                id: "email_1",
              },
            ],
            primary_email_address_id: "email_1",
            first_name: "Test",
            last_name: "User",
            image_url: "https://example.com/avatar.jpg",
          },
        };
      }
    },
  };
});

// Mock user queries
vi.mock("@/server/queries/users", () => ({
  upsertUser: vi.fn().mockResolvedValue({
    id: "uuid-123",
    clerkId: "user_test123",
    email: "test@example.com",
    name: "Test User",
  }),
}));

// Mock next/headers
vi.mock("next/headers", () => ({
  headers: vi.fn().mockResolvedValue({
    get: (name: string) => {
      const map: Record<string, string> = {
        "svix-id": "msg_test123",
        "svix-timestamp": "1234567890",
        "svix-signature": "v1,test_signature",
      };
      return map[name] ?? null;
    },
  }),
}));

describe("Clerk webhook handler", () => {
  beforeEach(() => {
    vi.stubEnv("CLERK_WEBHOOK_SECRET", "whsec_test123");
  });

  it("returns 400 when svix headers are missing", async () => {
    const { headers: headersMock } = await import("next/headers");
    vi.mocked(headersMock).mockResolvedValueOnce({
      get: () => null,
    } as ReturnType<typeof headersMock> extends Promise<infer T> ? T : never);

    const request = new Request("http://localhost:3000/api/webhooks/clerk", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it("processes user.created event successfully", async () => {
    const request = new Request("http://localhost:3000/api/webhooks/clerk", {
      method: "POST",
      body: JSON.stringify({
        type: "user.created",
        data: { id: "user_test123" },
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.received).toBe(true);
  });

  it("returns 500 when webhook secret is missing", async () => {
    vi.stubEnv("CLERK_WEBHOOK_SECRET", "");
    delete process.env.CLERK_WEBHOOK_SECRET;

    const request = new Request("http://localhost:3000/api/webhooks/clerk", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    expect(response.status).toBe(500);
  });
});
