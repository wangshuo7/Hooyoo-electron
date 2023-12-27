<template>
  <TitleBar></TitleBar>
  <router-view></router-view>
</template>

<script setup lang="ts">
import TitleBar from './components/TitleBar.vue'

window.api.sendMessage('Hello from App.vue!')
</script>

<style lang="less">
@import './assets/css/styles.less';
</style>
