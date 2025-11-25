import type { IAIService, Message, AIProviderId } from "../domain/models";
import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { CALIMA_SYSTEM_PROMPT } from "./system-prompts";

class MockAIService implements IAIService {
  async sendMessage(
    messages: Message[],
    _apiKey: string,
    onToken: (token: string) => void
  ): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 600)); // Latencia red

    const lastMsg = messages[messages.length - 1].content.toLowerCase();
    let response = "";

    // Simulación de "RAG" o uso del System Prompt en el Mock
    if (lastMsg.includes("kite") || lastMsg.includes("viento")) {
      response =
        "¡Excelente pregunta! Calima es mundialmente famoso por sus vientos. Para **Kitesurf**, el mejor lugar es sin duda la **Entrada 5**. Los vientos suelen pegar fuerte (18-25 nudos) después del mediodía. ¿Te gustaría saber sobre escuelas o alquiler de equipos?";
    } else if (
      lastMsg.includes("comer") ||
      lastMsg.includes("restaurante") ||
      lastMsg.includes("comida")
    ) {
      response =
        "¡Uy, qué rico! No te podés ir sin probar un buen **Sancocho de Gallina en leña**. Te recomiendo buscar los restaurantes campestres vía al lago. También es muy popular la 'Tronquista' si te gusta el pescado frito. ¿Buscas algo económico o más elegante?";
    } else if (
      lastMsg.includes("dormir") ||
      lastMsg.includes("hotel") ||
      lastMsg.includes("hospedaje")
    ) {
      response =
        "Depende de tu presupuesto. Tenés **Glampings** hermosos con vista al lago (desde $300k), el clásico **Hotel Brisas del Lago** (rango medio), o zonas de camping en la Entrada 5 si vas en plan mochilero. ¿Qué estilo preferís?";
    } else if (lastMsg.includes("museo") || lastMsg.includes("historia")) {
      response =
        "¡El plan cultural es imperdible! El **Museo Arqueológico Calima** está en el pueblo y es fascinante. Guarda la historia de las culturas Ilama, Yotoco y Sonso. Es perfecto para visitar en la mañana.";
    } else {
      response =
        "¡Hola! Soy tu guía de Calima. Puedo ayudarte con info sobre los vientos para Kitesurf, dónde comer el mejor sancocho, o dónde hospedarte. ¿Qué tenés en mente?";
    }

    // Stream simulado
    const chunks = response.split(" ");
    for (const chunk of chunks) {
      await new Promise((r) => setTimeout(r, 50));
      onToken(chunk + " ");
    }
  }
}

class VercelSDKService implements IAIService {
  private provider: AIProviderId;

  constructor(provider: AIProviderId) {
    this.provider = provider;
  }

  async sendMessage(
    messages: Message[],
    apiKey: string,
    onToken: (token: string) => void
  ): Promise<void> {
    if (!apiKey) {
      throw new Error(`API Key no configurada para ${this.provider}`);
    }

    let model;

    try {
      switch (this.provider) {
        case "openai":
          model = createOpenAI({ apiKey }).chat("gpt-4-turbo");
          break;
        case "claude":
          model = createAnthropic({ apiKey }).chat(
            "claude-3-5-sonnet-20241022"
          );
          break;
        case "gemini":
          model = createGoogleGenerativeAI({ apiKey }).chat("gemini-2.0-flash");
          break;
        default:
          throw new Error(`Provider no soportado: ${this.provider}`);
      }

      const { textStream } = await streamText({
        model,
        system: CALIMA_SYSTEM_PROMPT,
        messages: messages.map((m) => ({
          role: m.role as "user" | "assistant" | "system",
          content: m.content,
        })),
      });

      for await (const chunk of textStream) {
        onToken(chunk);
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Error desconocido";
      throw new Error(`Error en ${this.provider}: ${errorMsg}`);
    }
  }
}

export const getAIService = (provider: AIProviderId): IAIService => {
  if (provider === "mock") return new MockAIService();
  return new VercelSDKService(provider);
};
