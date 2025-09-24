"use client";

import { useState } from "react";
import { Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
}

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Ask me about your finances",
      isUser: false,
    },
  ]);
  const [input, setInput] = useState("");

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I can help you analyze your spending patterns and financial data.",
        isUser: false,
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <div className="flex-1 overflow-auto space-y-4 mb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex items-start space-x-3",
              message.isUser && "flex-row-reverse space-x-reverse"
            )}
          >
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
              {message.isUser ? (
                <User className="w-3 h-3 text-white" />
              ) : (
                <Bot className="w-3 h-3 text-white" />
              )}
            </div>
            
            <div className="glass-input p-3 rounded-lg max-w-[80%]">
              <p className="text-white text-sm">{message.content}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex space-x-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything..."
          className="glass-input text-white placeholder:text-white/50 resize-none min-h-[44px] max-h-32"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <Button
          onClick={handleSendMessage}
          disabled={!input.trim()}
          className="glass-button px-4 py-2 bg-white/10 hover:bg-white/20"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}