export type MessageRole = 'user' | 'assistant' | 'system'
export interface ChatMessage { id: string; role: MessageRole; content: string; createdAt: number; status?: 'streaming' | 'complete' | 'error' }
export interface Conversation { id: string; title: string; messages: ChatMessage[]; createdAt: number; updatedAt: number }
export interface ChatRequest { conversationId: string; message: string; signal?: AbortSignal }
export interface ChatCallbacks { onChunk: (text: string) => void; onComplete: () => void; onError: (error: Error) => void }
export interface ChatService { readonly providerName: string; readonly isAvailable: boolean; sendMessage(request: ChatRequest, callbacks: ChatCallbacks): Promise<void> }
