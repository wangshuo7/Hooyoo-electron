<template>
  <TitleBar></TitleBar>
  <router-view></router-view>
  <Update />
</template>

<script setup lang="ts">
import TitleBar from './components/TitleBar.vue'
import Update from './components/Update.vue'
</script>

<style lang="less">
@import './assets/css/styles.less';
</style>
