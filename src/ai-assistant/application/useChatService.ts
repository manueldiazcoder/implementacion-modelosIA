/**
 * ==============================================================================
 * CAPA 3: APPLICATION (src/features/ai-assistant/application/)
 * Gestión del estado y lógica de la aplicación (Hooks).
 * ==============================================================================
 */

import { useState } from "react";
import type { Message, AIConfig } from "../domain/models";
import { getAIService } from "../infrastructure/ai-service-adapter";

export const useChatService = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "¡Ve, mirá! Bienvenido a Calima. Soy tu guía experto. ¿Querés saber cómo estan los vientos hoy, dónde comer sancocho o qué museos visitar?",
      timestamp: Date.now(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<AIConfig>({
    providerId: "mock",
    openaiKey: "",
    claudeKey: "",
    geminiKey: "",
  });
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);

    const assistantMsgId = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      {
        id: assistantMsgId,
        role: "assistant",
        content: "",
        timestamp: Date.now(),
      },
    ]);

    try {
      const service = getAIService(config.providerId);

      // Validación básica antes de enviar
      if (config.providerId !== "mock") {
        const keyMap = {
          openai: config.openaiKey,
          claude: config.claudeKey,
          gemini: config.geminiKey,
        };
        if (!keyMap[config.providerId]) {
          throw new Error(
            `Por favor ingresa tu API Key para ${config.providerId.toUpperCase()} en Configuración.`
          );
        }
      }

      const apiKey =
        config.providerId === "openai"
          ? config.openaiKey || ""
          : config.providerId === "claude"
          ? config.claudeKey || ""
          : config.providerId === "gemini"
          ? config.geminiKey || ""
          : "";

      await service.sendMessage(newMessages, apiKey, (token) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId
              ? { ...msg, content: msg.content + token }
              : msg
          )
        );
      });
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Error desconocido";
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "system",
          content: `Error: ${errorMsg}`,
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateConfig = (newConfig: AIConfig) => {
    const wasProvider = config.providerId;
    const isProvider = newConfig.providerId;
    const isMock = isProvider === "mock";

    // Check if provider changed
    const providerChanged = wasProvider !== isProvider;

    // Check if API key changed for current provider
    const keyChanged = (() => {
      if (isProvider === "openai") return config.openaiKey !== newConfig.openaiKey;
      if (isProvider === "claude") return config.claudeKey !== newConfig.claudeKey;
      if (isProvider === "gemini") return config.geminiKey !== newConfig.geminiKey;
      return false;
    })();

    setConfig(newConfig);

    // Show notification based on changes
    if (providerChanged || keyChanged) {
      if (providerChanged) {
        if (isMock) {
          setNotification({
            type: "success",
            message: "✓ Cambiado a modo Demo (Mock)",
          });
        } else {
          const keyMap = {
            openai: newConfig.openaiKey,
            claude: newConfig.claudeKey,
            gemini: newConfig.geminiKey,
          };
          const hasKey = keyMap[isProvider as keyof typeof keyMap];
          if (hasKey) {
            setNotification({
              type: "success",
              message: `✓ Conectado a ${isProvider.toUpperCase()}`,
            });
          } else {
            setNotification({
              type: "error",
              message: `⚠ API Key faltante para ${isProvider.toUpperCase()}`,
            });
          }
        }
      } else if (keyChanged) {
        setNotification({
          type: "success",
          message: `✓ API Key de ${isProvider.toUpperCase()} guardada`,
        });
      }
      setTimeout(() => setNotification(null), 3000);
    } else {
      // Always show confirmation on save
      setNotification({
        type: "success",
        message: "✓ Configuración guardada",
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return {
    messages,
    isLoading,
    sendMessage,
    config,
    updateConfig,
    notification,
    setNotification,
  };
};
