<template>
  <router-view></router-view>
  {{ count }}
</template>

<script setup lang="ts">
import { ref } from 'vue'

const count = ref<number>(1)
window.api.sendMessage('Hello from App.vue!')
window.api.updateApp(() => {
  console.log('更新可用')
  count.value = 2
})
</script>

<style lang="less">
@import './assets/css/styles.less';
</style>
