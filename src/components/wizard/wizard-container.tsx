"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { WizardHeader } from "./wizard-header";
import { WizardStartForm } from "./wizard-start-form";
import { ChatMessageList } from "./chat-message-list";
import { ChatInput } from "./chat-input";
import { OutlinePreview } from "./outline-preview";
import { useStreamingChat } from "@/hooks/use-streaming-chat";
import { deriveWizardState } from "@/lib/ai/wizard-state";
import type { ConversationMessage } from "@/types/wizard";

interface OutlineData {
  id: string;
  conversationHistory: ConversationMessage[];
  topic: string;
  audience: string | null;
  expertiseLevel: string | null;
}

interface WizardContainerProps {
  bookId: string;
  bookTitle: string;
  outline: OutlineData | null;
  userInitial: string;
}

export function WizardContainer({
  bookId,
  bookTitle,
  outline: initialOutline,
  userInitial,
}: WizardContainerProps) {
  const router = useRouter();
  const [outline, setOutline] = useState<OutlineData | null>(initialOutline);
  const [showOutlinePreview, setShowOutlinePreview] = useState(false);

  // Derive initial wizard state from existing conversation
  const initialWizardState = outline
    ? deriveWizardState(
        outline.conversationHistory,
        outline.topic,
        outline.audience,
        outline.expertiseLevel
      )
    : null;

  const {
    messages,
    wizardState,
    streamingText,
    isStreaming,
    error,
    sendMessage,
  } = useStreamingChat({
    outlineId: outline?.id ?? "",
    initialMessages: outline?.conversationHistory ?? [],
    initialWizardState,
  });

  const currentPhase = wizardState?.phase ?? "topic_exploration";
  const isReadyForOutline = wizardState?.isReadyForOutline ?? false;

  const handleSaveAndExit = useCallback(() => {
    router.push(`/books/${bookId}/outline`);
    router.refresh();
  }, [router, bookId]);

  const handleWizardStarted = useCallback(
    (newOutline: OutlineData) => {
      setOutline(newOutline);
    },
    []
  );

  const handleOutlineAccepted = useCallback(() => {
    router.refresh();
  }, [router]);

  // Show outline preview when ready
  const handleShowOutlinePreview = useCallback(() => {
    setShowOutlinePreview(true);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      <WizardHeader
        currentPhase={currentPhase}
        showingOutlinePreview={showOutlinePreview}
        onSaveAndExit={handleSaveAndExit}
      />

      {/* Wizard start form — no outline yet */}
      {!outline && (
        <WizardStartForm
          bookId={bookId}
          bookTitle={bookTitle}
          onWizardStarted={handleWizardStarted}
        />
      )}

      {/* Chat interface — outline exists */}
      {outline && !showOutlinePreview && (
        <>
          <div className="flex-1 bg-stone-50/50 overflow-hidden flex flex-col">
            <ChatMessageList
              messages={messages}
              streamingText={streamingText}
              isStreaming={isStreaming}
              userInitial={userInitial}
            />
          </div>

          <div className="border-t border-stone-200 bg-white px-4 py-3">
            {isReadyForOutline && !isStreaming ? (
              <div className="max-w-xl mx-auto text-center py-2">
                <p className="text-sm text-stone-600 mb-3">
                  Great! We have enough information to generate your outline.
                </p>
                <button
                  onClick={handleShowOutlinePreview}
                  className="inline-flex items-center gap-2 h-10 px-6 rounded-md bg-stone-900 hover:bg-stone-800 text-white text-sm font-medium transition-colors"
                >
                  Generate Outline
                </button>
              </div>
            ) : (
              <ChatInput
                onSendMessage={sendMessage}
                isStreaming={isStreaming}
                questionCount={wizardState?.questionCount ?? 0}
                totalQuestions={wizardState?.totalQuestions ?? 12}
              />
            )}
            {error && (
              <p className="text-center text-sm text-red-600 mt-2">{error}</p>
            )}
          </div>
        </>
      )}

      {/* Outline preview — generating/reviewing outline */}
      {outline && showOutlinePreview && (
        <div className="flex-1 bg-stone-50/50 overflow-y-auto">
          <OutlinePreview
            outlineId={outline.id}
            bookId={bookId}
            onOutlineAccepted={handleOutlineAccepted}
          />
        </div>
      )}
    </div>
  );
}
