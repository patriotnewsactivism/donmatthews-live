export interface CallSession {
  sessionId: string;
  callSid: string;
  streamSid: string;
  callerNumber: string;
  toNumber: string;
  isOwner: boolean;
  sudoVerified: boolean;
  verifyAttempts: number;
  startedAt: number;
  userTranscript: string;
  assistantTranscript: string;
  dtmfBuffer: string;
}

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

export interface FunctionCall {
  callId: string;
  name: string;
  arguments: string;
}

export interface XaiMessageHandlers {
  onAssistantAudioDelta(pcmBase64: string): void;
  onAssistantTranscriptDelta(text: string): void;
  onAssistantTranscriptDone(text: string): void;
  onUserTranscript(text: string): void;
  onError(error: string): void;
  onClose(): void;
}