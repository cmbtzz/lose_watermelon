import { AstrBotAdapter } from './astrbotAdapter'
import { MockChatService } from './mockAdapter'
import type { ChatService } from './types'

export function createChatService(): ChatService {
  return import.meta.env.VITE_CHAT_PROVIDER?.toLowerCase() === 'astrbot'
    ? new AstrBotAdapter()
    : new MockChatService()
}
