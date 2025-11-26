/**
 * ==============================================================================
 * CAPA 1: DOMAIN (src/features/ai-assistant/domain/)
 * El núcleo de la lógica de negocio, agnóstico a frameworks y herramientas externas.
 * ==============================================================================
 */

export type Role = "system" | "user" | "assistant";

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
}

// Actualizado: Soporte para los 3 grandes + Mock
export type AIProviderId = "openai" | "claude" | "gemini" | "mock";

// Actualizado: Estructura para múltiples keys
export interface AIConfig {
  providerId: AIProviderId;
  openaiKey?: string;
  claudeKey?: string;
  geminiKey?: string;
}

export interface IAIService {
  sendMessage(
    messages: Message[],
    apiKey: string,
    onToken: (token: string) => void
  ): Promise<void>;
}
