"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Send,
  AlertCircle,
  CheckCircle,
  Info,
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AIAssistantSheetProps {
  roadSegmentId?: string;
  defaultOpen?: boolean;
}

export function AIAssistantSheet({
  roadSegmentId,
  defaultOpen = false,
}: AIAssistantSheetProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! This is Roadessy Intelligence.  What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{
    message: string;
    type?: string;
    details?: {
      quotaLimit?: number;
      retryAfterSeconds?: number;
      retryTime?: string;
    };
  } | null>(null);
  const [retryCountdown, setRetryCountdown] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle retry countdown for quota errors
  useEffect(() => {
    if (retryCountdown === null) return;

    if (retryCountdown <= 0) {
      setRetryCountdown(null);
      setError(null);
      return;
    }

    const timer = setTimeout(
      () => setRetryCountdown((prev) => (prev ? prev - 1 : null)),
      1000
    );

    return () => clearTimeout(timer);
  }, [retryCountdown]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const context = roadSegmentId
        ? `\n\nContext: This question is about road segment ID: ${roadSegmentId}`
        : "";

      const response = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input + context,
          conversationHistory: messages.slice(1).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        // Handle quota errors specially
        if (
          errorData.type === "quota_exceeded" &&
          errorData.details?.retryAfterSeconds
        ) {
          setError({
            message: errorData.message || "API quota exceeded",
            type: "quota_exceeded",
            details: errorData.details,
          });
          setRetryCountdown(Math.ceil(errorData.details.retryAfterSeconds));
          throw new Error(errorData.message || "API quota exceeded");
        }

        throw new Error(
          errorData.error ||
            errorData.message ||
            "Failed to get response from assistant"
        );
      }

      const data = await response.json();

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response || data.message || "No response received",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";

      const errorAssistantMessage: Message = {
        role: "assistant",
        content: `I encountered an error: ${errorMessage}. Please try again.`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorAssistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild className="">
        <Button
          variant="outline"
          size="icon"
          className="relative dark:hover:bg-gray-200"
          title="Road Inspection AI Assistant"
        >
          <MessageCircle className="text-black h-4 w-4 dark:text-white" />
          <span className="absolute top-0 right-0 h-2 w-2 dark:invert bg-black rounded-full animate-pulse" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-full sm:w-[540px] flex flex-col p-0 z-100"
      >
        <SheetHeader className="border-b px-6 py-4">
          <SheetTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Road Inspection Assistant
          </SheetTitle>
          <SheetDescription>
            Ask me about road segments, defects, inspections, and repairs
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                    <Info className="h-4 w-4 text-black-900" />
                  </div>
                )}

                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg overflow-hidden ${
                    message.role === "user"
                      ? "bg-gray-900 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-900 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap wrap-break-word word-break">
                    {message.content}
                  </p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {message.role === "user" && (
                  <div className="h-8 w-8 rounded-full bg-black flex items-center justify-center shrink-0">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 items-center">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Spinner className="h-4 w-4" />
                </div>
                <p className="text-sm text-gray-500">
                  Assistant is thinking...
                </p>
              </div>
            )}

            {error && (
              <div
                className={`flex gap-3 items-start p-4 rounded-lg ${
                  error.type === "quota_exceeded"
                    ? "bg-amber-50 border border-amber-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <AlertCircle
                  className={`h-5 w-5 shrink-0 mt-0.5 ${
                    error.type === "quota_exceeded"
                      ? "text-amber-600"
                      : "text-red-600"
                  }`}
                />
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${
                      error.type === "quota_exceeded"
                        ? "text-amber-900"
                        : "text-red-900"
                    }`}
                  >
                    {error.message}
                  </p>
                  {error.type === "quota_exceeded" && error.details && (
                    <div className="mt-2 space-y-1 text-xs">
                      <p className="text-amber-800">
                        Daily limit: {error.details.quotaLimit} requests
                      </p>
                      {retryCountdown !== null && (
                        <p className="font-medium text-amber-700">
                          Try again in {retryCountdown}s
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="border-t px-6 py-4 space-y-3">
          {roadSegmentId && (
            <Badge variant="outline" className="w-fit">
              Road ID: {roadSegmentId}
            </Badge>
          )}

          <div className="flex gap-2">
            <Input
              placeholder="Ask about road inspections, defects, repairs..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              size="icon"
              className="shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-xs text-gray-500">
            Press Enter to send • Shift+Enter for new line
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
