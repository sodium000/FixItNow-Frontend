"use client";

import { FormEvent, useState } from "react";
import { Bot, LoaderCircle, MessageCircle, Send, X } from "lucide-react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type AssistantResponse = {
  answer?: string;
  error?: string;
};

export default function ServiceAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);

  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const question = message.trim();
    if (!question || isSending) return;
    if (question.length > 500) {
      setError("Please keep your question under 500 characters.");
      return;
    }

    setError("");
    setMessage("");
    setMessages((current) => [...current, { role: "user", content: question }]);
    setIsSending(true);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question }),
      });
      const data = (await response.json()) as AssistantResponse;
      if (!response.ok || !data.answer) {
        throw new Error(data.error || "The assistant could not answer right now.");
      }
      setMessages((current) => [
        ...current,
        { role: "assistant", content: data.answer! },
      ]);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "The assistant could not answer right now.",
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      {isOpen && (
        <section
          aria-label="FixItNow AI support assistant"
          className="flex h-[min(34rem,calc(100dvh-7rem))] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
        >
          <header className="flex items-center justify-between border-b border-border bg-primary px-4 py-3 text-primary-foreground">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" aria-hidden="true" />
              <div>
                <h2 className="text-sm font-semibold">FixItNow assistant</h2>
                <p className="text-xs text-primary-foreground/75">
                  Home-service guidance
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close assistant"
              className="rounded-lg p-1.5 transition hover:bg-primary-foreground/10"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          <div
            aria-live="polite"
            className="flex-1 space-y-3 overflow-y-auto p-4"
          >
            {messages.length === 0 ? (
              <p className="rounded-xl bg-muted p-3 text-sm text-muted-foreground">
                Ask about choosing a service, preparing for a visit, or basic
                maintenance. Do not share addresses, phone numbers, or other
                personal information.
              </p>
            ) : (
              messages.map((item, index) => (
                <p
                  key={`${item.role}-${index}`}
                  className={`max-w-[90%] whitespace-pre-wrap rounded-xl px-3 py-2 text-sm ${
                    item.role === "user"
                      ? "ml-auto bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {item.content}
                </p>
              ))
            )}
            {isSending && (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Preparing an answer…
              </p>
            )}
            {error && (
              <p role="alert" className="rounded-lg bg-destructive/10 p-2 text-xs text-destructive">
                {error}
              </p>
            )}
          </div>

          <form onSubmit={sendMessage} className="border-t border-border p-3">
            <label className="sr-only" htmlFor="assistant-message">
              Ask the home-service assistant
            </label>
            <div className="flex gap-2">
              <input
                id="assistant-message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                maxLength={500}
                placeholder="Ask a service question…"
                className="min-w-0 flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <button
                type="submit"
                disabled={isSending || !message.trim()}
                aria-label="Send question"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close support assistant" : "Open support assistant"}
        className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {isOpen ? (
          <X className="h-6 w-6" aria-hidden="true" />
        ) : (
          <MessageCircle className="h-6 w-6" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
