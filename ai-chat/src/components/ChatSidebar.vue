<script setup lang="ts">
import type { Conversation } from '../services/chat/types'
defineProps<{ conversations: Conversation[]; activeId: string; open: boolean; provider: string; available: boolean }>()
const emit = defineEmits<{ create: []; select: [id: string]; delete: [id: string]; close: [] }>()
function remove(event: Event, id: string) { event.stopPropagation(); emit('delete', id) }
</script>
<template>
  <div v-if="open" class="sidebar-scrim" @click="emit('close')"></div>
  <aside class="sidebar" :class="{ open }">
    <div class="brand-row"><div class="brand-mark">龟</div><div><strong>龟神 AI</strong><span>私人智能助手</span></div><button class="close-sidebar" type="button" aria-label="关闭会话栏" @click="emit('close')">×</button></div>
    <button class="new-chat" type="button" @click="emit('create')"><span>＋</span> 新建对话</button>
    <p class="section-label">最近对话</p>
    <nav class="conversation-list" aria-label="会话列表"><div v-for="conversation in conversations" :key="conversation.id" class="conversation-item" :class="{ active: conversation.id === activeId }"><button class="conversation-select" type="button" @click="emit('select', conversation.id)"><span class="conversation-dot"></span><span class="conversation-title">{{ conversation.title }}</span></button><button class="delete-chat" type="button" aria-label="删除会话" @click="remove($event, conversation.id)">×</button></div></nav>
    <div class="sidebar-footer"><div class="status-dot" :class="{ online: available }"></div><div><strong>{{ available ? provider : 'AstrBot 未连接' }}</strong><span>{{ available ? '演示服务可用' : '请先完成接口适配' }}</span></div></div>
  </aside>
</template>
