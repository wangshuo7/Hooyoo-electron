<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
window.api.sendMessage('Hello from App.vue!')
</script>

<style lang="less">
@import './assets/css/styles.less';
</style>
