<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import ElTooltip from 'element-plus/es/components/tooltip/index.mjs'
import 'element-plus/es/components/tooltip/style/css'
import ChatInput from '../components/ChatInput.vue'
import ChatMessage from '../components/ChatMessage.vue'
import ChatSidebar from '../components/ChatSidebar.vue'
import { createChatService } from '../services/chat/chatService'
import type { ChatMessage as Message } from '../services/chat/types'
import { useConversations } from '../stores/conversations'

const chatService = createChatService()
const { state, activeConversation, createConversation, selectConversation, deleteConversation, addMessage } = useConversations()
const scrollArea = ref<HTMLElement>()
const generating = ref(false)
const sidebarOpen = ref(false)
const shouldFollow = ref(true)
const abortController = ref<AbortController>()
const statusMessage = ref('')
const theme = ref<'dark' | 'light'>((localStorage.getItem('guishen-theme') as 'dark' | 'light') || 'dark')
const messages = computed(() => activeConversation.value?.messages ?? [])

function setTheme(value: 'dark' | 'light') { theme.value = value; document.documentElement.dataset.theme = value; localStorage.setItem('guishen-theme', value) }
function toggleTheme() { setTheme(theme.value === 'dark' ? 'light' : 'dark') }
function openConversation(id: string) { selectConversation(id); sidebarOpen.value = false; shouldFollow.value = true; nextTick(scrollToBottom) }
function newConversation() { if (generating.value) stopGeneration(); createConversation(); sidebarOpen.value = false }
function removeConversation(id: string) { if (generating.value && id === state.activeId) stopGeneration(); deleteConversation(id) }
function onScroll() { if (scrollArea.value) shouldFollow.value = scrollArea.value.scrollHeight - scrollArea.value.scrollTop - scrollArea.value.clientHeight < 90 }
function scrollToBottom() { if (scrollArea.value && shouldFollow.value) scrollArea.value.scrollTop = scrollArea.value.scrollHeight }
function friendlyError(error: Error) {
  if (error.name === 'AbortError') return '已停止生成。'
  const text = error.message.toLowerCase()
  if (text.includes('429') || text.includes('rate') || text.includes('quota')) return '当前模型请求过于频繁，请稍后重试。'
  if (text.includes('astrbot')) return 'AstrBot 当前不可用，请检查服务器接口配置。'
  if (text.includes('network') || text.includes('fetch')) return '连接失败，请检查网络后重试。'
  return '请求失败，服务器暂时无法完成响应。'
}

async function sendMessage(content: string) {
  if (generating.value) return
  const conversationId = activeConversation.value?.id ?? createConversation().id
  addMessage({ id: crypto.randomUUID(), role: 'user', content, createdAt: Date.now(), status: 'complete' })
  const assistant: Message = { id: crypto.randomUUID(), role: 'assistant', content: '', createdAt: Date.now(), status: 'streaming' }
  const streamedAssistant = addMessage(assistant) ?? assistant
  generating.value = true; shouldFollow.value = true; statusMessage.value = '正在生成…'; abortController.value = new AbortController(); await nextTick(scrollToBottom)
  await chatService.sendMessage({ conversationId, message: content, signal: abortController.value.signal }, {
    onChunk(chunk) { streamedAssistant.content += chunk; nextTick(scrollToBottom) },
    onComplete() { streamedAssistant.status = 'complete'; generating.value = false; statusMessage.value = '' },
    onError(error) { streamedAssistant.status = error.name === 'AbortError' ? 'complete' : 'error'; if (!streamedAssistant.content) streamedAssistant.content = friendlyError(error); generating.value = false; statusMessage.value = error.name === 'AbortError' ? '已停止生成' : friendlyError(error); window.setTimeout(() => { statusMessage.value = '' }, 3500) },
  })
}

function stopGeneration() { abortController.value?.abort() }
watch(messages, () => nextTick(scrollToBottom), { deep: true })
onMounted(() => { setTheme(theme.value); nextTick(scrollToBottom) })
</script>

<template><main class="app-shell">
  <ChatSidebar :conversations="state.conversations" :active-id="state.activeId" :open="sidebarOpen" :provider="chatService.providerName" :available="chatService.isAvailable" @create="newConversation" @select="openConversation" @delete="removeConversation" @close="sidebarOpen = false" />
  <section class="chat-panel">
    <header class="topbar"><button class="menu-button" type="button" aria-label="打开会话栏" @click="sidebarOpen = true">☰</button><div class="title-block"><h1>{{ activeConversation?.title || '新对话' }}</h1><p>本地会话 · 自动保存</p></div><div class="top-actions"><span class="model-pill"><i :class="{ online: chatService.isAvailable }"></i>{{ chatService.providerName }}</span><ElTooltip :content="theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'" placement="bottom"><button class="theme-button" type="button" :aria-label="theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'" @click="toggleTheme">{{ theme === 'dark' ? '☀' : '☾' }}</button></ElTooltip></div></header>
    <div ref="scrollArea" class="message-scroll" @scroll="onScroll"><div v-if="messages.length" class="messages"><ChatMessage v-for="message in messages" :key="message.id" :message="message" /></div><div v-else class="empty-state"><div class="empty-mark">龟</div><h2>今天想聊点什么？</h2><p>可以问问题、整理思路，或让它帮你写一段代码。</p><div class="suggestions"><button type="button" @click="sendMessage('帮我整理一下今天的工作重点')">整理今天的工作重点</button><button type="button" @click="sendMessage('给我展示一段 TypeScript 示例')">展示 TypeScript 示例</button></div></div></div>
    <footer class="composer-wrap"><p v-if="statusMessage" class="generation-status" role="status"><span></span>{{ statusMessage }}</p><ChatInput :generating="generating" @send="sendMessage" @stop="stopGeneration" /><p class="disclaimer">AI 可能会犯错，请核对重要信息。</p></footer>
  </section>
</main></template>
