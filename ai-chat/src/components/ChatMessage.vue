<script setup lang="ts">
import type { ChatMessage } from '../services/chat/types'
import MarkdownRenderer from './MarkdownRenderer.vue'
defineProps<{ message: ChatMessage }>()
</script>
<template>
  <article class="message" :class="message.role">
    <div v-if="message.role !== 'user'" class="avatar">龟</div>
    <div class="message-body" :class="{ 'has-error': message.status === 'error' }"><span class="role">{{ message.role === 'user' ? '你' : '龟神 AI' }}</span><MarkdownRenderer :content="message.content" /><span v-if="message.status === 'streaming'" class="stream-caret" aria-label="正在生成"></span></div>
    <div v-if="message.role === 'user'" class="avatar user-avatar">你</div>
  </article>
</template>
