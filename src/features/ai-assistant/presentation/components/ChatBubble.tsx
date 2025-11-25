import type { Message } from "../../domain/models";
import { User, Bot, AlertTriangle } from "lucide-react";

/**
 * ==============================================================================
 * CAPA 4: PRESENTATION (src/features/ai-assistant/presentation/)
 * Componentes de UI.
 * ==============================================================================
 */

export default function ChatBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";

  if (isSystem) {
    return (
      <div className="flex justify-center my-4 animate-in fade-in slide-in-from-bottom-2">
        <span className="bg-red-50 text-red-600 text-xs py-1 px-3 rounded-full border border-red-200 flex items-center gap-1">
          <AlertTriangle size={12} /> {message.content}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`flex w-full mb-6 ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`flex max-w-[85%] md:max-w-[75%] ${
          isUser ? "flex-row-reverse" : "flex-row"
        } items-start gap-3`}
      >
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm mt-1
          ${
            isUser
              ? "bg-blue-600 text-white"
              : "bg-white text-blue-600 border border-blue-200"
          }`}
        >
          {isUser ? <User size={16} /> : <Bot size={18} />}
        </div>

        <div
          className={`p-4 rounded-2xl text-[17px] leading-relaxed shadow-sm
          ${
            isUser
              ? "bg-blue-600 text-white rounded-tr-none"
              : "bg-white text-gray-800 border border-blue-200 rounded-tl-none"
          }`}
        >
          {message.content.split("\n").map((line, i) => (
            <div key={i}>
              {line}
              {i < message.content.split("\n").length - 1 && <br />}
            </div>
          )) || (
            <span className="animate-pulse flex gap-1">
              <span className="w-1 h-1 bg-gray-400 rounded-full" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
