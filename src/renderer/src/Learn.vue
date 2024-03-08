<template>
  <TitleBar></TitleBar>
  <div>{{ iframeUrl }}</div>
  <div style="width: 100vw; height: 100vh">
    <iframe
      :src="iframeUrl"
      frameborder="0"
      width="100%"
      height="100%"
    ></iframe>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TitleBar from './components/TitleBar.vue'

const iframeUrl = ref<any>()
window.api.learnSend((url) => {
  iframeUrl.value = url
  console.log(url)
})
</script>

<style lang="less"></style>
