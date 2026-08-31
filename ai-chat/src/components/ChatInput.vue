<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
const props = defineProps<{ generating: boolean }>()
const emit = defineEmits<{ send: [message: string]; stop: [] }>()
const value = ref('')
const input = ref<HTMLTextAreaElement>()
function resize() { if (input.value) { input.value.style.height = 'auto'; input.value.style.height = `${Math.min(input.value.scrollHeight, 180)}px` } }
function send() { const message = value.value.trim(); if (!message || props.generating) return; emit('send', message); value.value = ''; nextTick(resize) }
function onKeydown(event: KeyboardEvent) { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); send() } }
watch(value, resize)
</script>
<template><div class="composer"><textarea ref="input" v-model="value" rows="1" :disabled="generating" placeholder="给龟神 AI 发送消息…" aria-label="消息内容" @keydown="onKeydown"></textarea><div class="composer-bottom"><span>Enter 发送 · Shift + Enter 换行</span><button v-if="generating" class="stop-button" type="button" aria-label="停止生成" @click="emit('stop')"><i></i></button><button v-else class="send-button" type="button" :disabled="!value.trim()" aria-label="发送消息" @click="send">↑</button></div></div></template>
