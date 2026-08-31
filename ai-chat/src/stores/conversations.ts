import { computed, reactive, watch } from 'vue'
import type { ChatMessage, Conversation } from '../services/chat/types'

const STORAGE_KEY = 'guishen-ai-conversations-v1'
const now = Date.now()
const welcomeConversation: Conversation = {
  id: crypto.randomUUID(), title: '欢迎来到龟神 AI', createdAt: now, updatedAt: now,
  messages: [{ id: crypto.randomUUID(), role: 'assistant', content: '你好，我是你的私人 AI 助手。当前运行在 **Mock 演示模式**，你可以直接体验聊天、Markdown 与流式回复。', createdAt: now, status: 'complete' }],
}

function loadConversations(): Conversation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return [welcomeConversation]
    const parsed = JSON.parse(raw) as Conversation[]
    return Array.isArray(parsed) && parsed.length ? parsed : [welcomeConversation]
  } catch { return [welcomeConversation] }
}

const state = reactive({ conversations: loadConversations(), activeId: '' })
state.activeId = state.conversations[0]?.id ?? ''
watch(() => state.conversations, (value) => localStorage.setItem(STORAGE_KEY, JSON.stringify(value)), { deep: true })

export function useConversations() {
  const activeConversation = computed(() => state.conversations.find((item) => item.id === state.activeId) ?? state.conversations[0])
  function createConversation() {
    const createdAt = Date.now()
    const item: Conversation = { id: crypto.randomUUID(), title: '新对话', messages: [], createdAt, updatedAt: createdAt }
    state.conversations.unshift(item); state.activeId = item.id; return item
  }
  function selectConversation(id: string) { state.activeId = id }
  function deleteConversation(id: string) {
    const index = state.conversations.findIndex((item) => item.id === id)
    if (index < 0) return
    state.conversations.splice(index, 1)
    if (!state.conversations.length) createConversation()
    if (state.activeId === id) state.activeId = state.conversations[0].id
  }
  function addMessage(message: ChatMessage) {
    const item = activeConversation.value
    if (!item) return
    item.messages.push(message); item.updatedAt = Date.now()
    if (message.role === 'user' && item.title === '新对话') item.title = message.content.trim().replace(/\s+/g, ' ').slice(0, 22) || '新对话'
    // Return the proxy stored inside the reactive array. Mutating the original
    // object after push() would bypass Vue's dependency tracking.
    return item.messages[item.messages.length - 1]
  }
  return { state, activeConversation, createConversation, selectConversation, deleteConversation, addMessage }
}
