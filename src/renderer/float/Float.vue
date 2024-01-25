<template>
  <div>{{ message }}</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ipcRenderer } from 'electron'

const message = ref<string>()
ipcRenderer.on('upload-content', (_event, content: string) => {
  message.value = content
})
</script>

<style lang="less"></style>
