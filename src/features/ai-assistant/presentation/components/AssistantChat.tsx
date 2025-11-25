import { useState, useRef, useEffect, type FormEvent } from "react";
import {
  Wind,
  Mountain,
  Waves,
  Settings,
  Loader2,
  Send,
  Bot,
} from "lucide-react";
import { useChatService } from "../../application/useChatService";
import ChatBubble from "./ChatBubble";
import SettingsModal from "./SettingsModal";

export default function AssistantChat() {
  const {
    messages,
    isLoading,
    sendMessage,
    config,
    updateConfig,
    notification,
    setNotification,
  } = useChatService();
  const [input, setInput] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar - Context Visual */}
      <aside className="hidden md:flex md:w-80 bg-gray-50 border-r border-gray-200 flex-col relative z-20 shadow-xl">
        <div className="p-6 border-b border-gray-200 bg-white">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Calima<span className="text-blue-600">IA</span>
          </h1>
          <p className="text-sm text-gray-600 font-medium mt-1">
            Tu guía personal en el Lago
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="bg-linear-to-br from-blue-50 to-cyan-100 rounded-2xl p-5 border border-blue-200 shadow-sm">
            <div className="flex items-center gap-2 text-blue-800 font-bold mb-3">
              <Wind size={20} className="text-blue-600" />
              <h3>Reporte Vientos</h3>
            </div>
            <div className="text-3xl font-black text-blue-700 mb-1">22 kts</div>
            <p className="text-sm text-blue-600 font-medium">
              Condiciones perfectas en Entrada 5
            </p>
            <div className="mt-3 w-full bg-blue-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-linear-to-r from-blue-500 to-cyan-500 h-full w-[80%]"></div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-wider px-1">
              Lo Imperdible
            </h3>

            <div className="flex items-start gap-3 p-3 hover:bg-emerald-50 rounded-xl transition-colors cursor-help group">
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-orange-200 to-amber-200 text-orange-700 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                <Mountain size={18} />
              </div>
              <div>
                <p className="font-bold text-gray-800 text-sm">
                  Museo Arqueológico
                </p>
                <p className="text-xs text-gray-600">
                  Historia Calima, Yotoco, Sonso
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 hover:bg-emerald-50 rounded-xl transition-colors cursor-help group">
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-cyan-200 to-blue-200 text-cyan-700 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                <Waves size={18} />
              </div>
              <div>
                <p className="font-bold text-gray-800 text-sm">
                  Kitesurf & Windsurf
                </p>
                <p className="text-xs text-gray-600">
                  Mejores vientos de América
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50/80 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-xs text-gray-600 justify-center">
            <span
              className={`w-2 h-2 rounded-full ${
                config.providerId === "mock" ? "bg-amber-500" : "bg-emerald-500"
              }`}
            ></span>
            Modo: {config.providerId.toUpperCase()}
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col h-screen relative bg-white">
        {/* Header Mobile & Desktop Actions */}
        <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
          <div className="md:hidden">
            <h1 className="font-bold text-gray-900">Calima IA</h1>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 shadow-sm rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
            >
              <Settings size={18} className="text-gray-600" />
              <span className="hidden sm:inline">Configuración</span>
            </button>
          </div>
        </header>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-3xl mx-auto w-full pb-4 min-h-full flex flex-col justify-end">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center text-gray-500 py-20">
                <Bot size={48} className="mb-4 opacity-30" />
                <p>Inicia una conversación sobre Calima</p>
              </div>
            )}
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 bg-gray-50">
          <div className="max-w-3xl mx-auto w-full">
            <form onSubmit={handleSubmit} className="relative">
              <div className="flex items-center bg-white rounded-2xl shadow-lg border border-gray-200">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Pregunta por hoteles, escuelas de kite o comida..."
                  className="w-full bg-transparent py-4 pl-6 pr-14 outline-none text-gray-900 placeholder-gray-500 text-[16px] rounded-2xl"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <Send size={20} />
                  )}
                </button>
              </div>
            </form>
            <p className="text-center text-[10px] text-gray-500 mt-3 font-medium tracking-wide">
              POWERED BY VERCEL AI SDK • CALIMA DARIÉN DEMO
            </p>
          </div>
        </div>
      </main>

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        onSave={updateConfig}
      />

      {/* Welcome Modal */}
      {showWelcome && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              ¡Bienvenido a Calima IA!
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Para usar el asistente de manera avanzada con modelos de IA como Claude, Google Gemini u OpenAI,
                necesitas agregar tu API Key en Configuración.
              </p>
              <p>
                No te preocupes: No almaceno tu API Key en ningún lugar del proyecto.
                Se envía directamente al proveedor del modelo de IA.
              </p>
              <p>
                Si te preocupa el uso de tu API Key, puedes crear una nueva en un modelo gratuito
                (como Google Gemini) donde no te cobrarán. Después de usar el asistente, puedes eliminarla.
              </p>
              <p>
                Este asistente está diseñado para mejorar tu experiencia como visitante del municipio de Calima Darién y el Lago Calima,
                resolviendo cualquier duda sobre deportes náuticos, cultura, gastronomía y lugares turísticos.
              </p>
            </div>
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setShowWelcome(false)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Modal */}
      {notification && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            className={`bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center ${
              notification.type === "success"
                ? "border border-green-200"
                : "border border-red-200"
            }`}
          >
            <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
              notification.type === "success"
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }`}>
              {notification.type === "success" ? "✓" : "✕"}
            </div>
            <p className="text-lg font-medium text-gray-900">
              {notification.message}
            </p>
            <button
              onClick={() => setNotification(null)}
              className="mt-6 px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors shadow-sm hover:shadow-md"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
