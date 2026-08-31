import type { ChatCallbacks, ChatRequest, ChatService } from './types'

/** Safe placeholder: no AstrBot endpoint, body, auth, or stream format is guessed. */
export class AstrBotAdapter implements ChatService {
  readonly providerName = 'AstrBot'
  readonly isAvailable = false
  async sendMessage(_request: ChatRequest, callbacks: ChatCallbacks): Promise<void> {
    callbacks.onError(new Error('ASTRBOT_UNVERIFIED: 当前 AstrBot 接口尚未经过服务器实测，请先完成 API 探测与适配。'))
  }
}
