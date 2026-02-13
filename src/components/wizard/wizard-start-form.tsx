"use client";

import { useState, type FormEvent } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { startWizardAction } from "@/server/actions/wizard";

interface WizardStartFormProps {
  bookId: string;
  bookTitle: string;
  onWizardStarted: (outline: {
    id: string;
    conversationHistory: Array<{ role: "user" | "assistant"; content: string }>;
    topic: string;
    audience: string | null;
    expertiseLevel: string | null;
  }) => void;
}

export function WizardStartForm({
  bookId,
  bookTitle,
  onWizardStarted,
}: WizardStartFormProps) {
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("");
  const [expertiseLevel, setExpertiseLevel] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsSubmitting(true);
    setError(null);

    const result = await startWizardAction({
      bookId,
      topic: topic.trim(),
      audience: audience.trim() || undefined,
      expertiseLevel: expertiseLevel || undefined,
    });

    if (!result.success) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    onWizardStarted({
      id: result.data.id,
      conversationHistory: (result.data.conversationHistory ?? []) as Array<{
        role: "user" | "assistant";
        content: string;
      }>,
      topic: result.data.topic,
      audience: result.data.audience,
      expertiseLevel: result.data.expertiseLevel,
    });
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-stone-50/50">
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-stone-900 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-stone-900 font-heading mb-2">
            Let&apos;s create your outline
          </h1>
          <p className="text-sm text-stone-500">
            for <span className="font-medium text-stone-700">{bookTitle}</span>
          </p>
          <p className="text-sm text-stone-400 mt-1">
            I&apos;ll interview you to extract your expertise and build a
            structured book outline.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="topic" className="text-sm font-medium text-stone-700">
              What is your book about? *
            </Label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Growth strategies for SaaS startups"
              className="mt-1.5"
              required
              maxLength={500}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label
              htmlFor="audience"
              className="text-sm font-medium text-stone-700"
            >
              Target audience{" "}
              <span className="text-stone-400 font-normal">(optional)</span>
            </Label>
            <Input
              id="audience"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="e.g., Early-stage founders and product managers"
              className="mt-1.5"
              maxLength={500}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label
              htmlFor="expertise"
              className="text-sm font-medium text-stone-700"
            >
              Your expertise level{" "}
              <span className="text-stone-400 font-normal">(optional)</span>
            </Label>
            <select
              id="expertise"
              value={expertiseLevel}
              onChange={(e) => setExpertiseLevel(e.target.value)}
              className="mt-1.5 w-full h-9 rounded-md border border-stone-200 bg-white px-3 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-300"
              disabled={isSubmitting}
            >
              <option value="">Select level...</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <Button
            type="submit"
            className="w-full h-10 bg-stone-900 hover:bg-stone-800 gap-2"
            disabled={isSubmitting || !topic.trim()}
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Starting interview...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Start Interview
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
