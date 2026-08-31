import type { ChatCallbacks, ChatRequest, ChatService } from './types'

const defaultReply = `收到。当前页面运行在 **Mock 演示模式**，我会用流式输出模拟真实 AI 回复。

你刚才的消息已经保存在浏览器的本地会话中。正式接入 AstrBot 后，界面仍会通过统一的 \`ChatService\` 工作，不需要重写聊天 UI。

### 当前能力

- 多会话管理与本地保存
- Markdown、表格和代码高亮
- 流式回复、停止生成与智能滚动
- 深色 / 浅色主题与移动端适配

> 提示：服务器上的 AstrBot API 必须先按实际版本确认，项目不会猜测接口。

\`\`\`ts
interface ChatService {
  sendMessage(request: ChatRequest, callbacks: ChatCallbacks): Promise<void>
}
\`\`\``

export class MockChatService implements ChatService {
  readonly providerName = 'Mock Assistant'
  readonly isAvailable = true
  async sendMessage(request: ChatRequest, callbacks: ChatCallbacks): Promise<void> {
    const reply = request.message.includes('工作')
      ? `我把你的工作重点整理成一个简单框架：\n\n1. **先完成最重要且有截止时间的事项**\n2. 集中处理需要深度思考的任务\n3. 把零散沟通安排在固定时段\n4. 下班前用 10 分钟做复盘\n\n如果你把具体事项贴过来，我还可以继续帮你排优先级。`
      : defaultReply
    const chunks = reply.match(/.{1,4}/gs) ?? [reply]
    try {
      for (const chunk of chunks) {
        if (request.signal?.aborted) throw new DOMException('Generation stopped', 'AbortError')
        await new Promise((resolve) => window.setTimeout(resolve, 22 + Math.random() * 34))
        callbacks.onChunk(chunk)
      }
      callbacks.onComplete()
    } catch (error) {
      callbacks.onError(error instanceof Error ? error : new Error('Mock stream failed'))
    }
  }
}
