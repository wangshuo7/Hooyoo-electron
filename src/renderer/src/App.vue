<template>
  <el-config-provider :locale="locale">
    <TitleBar></TitleBar>
    <router-view></router-view>
    <Update />
  </el-config-provider>
</template>

<script setup lang="ts">
import TitleBar from './components/TitleBar.vue'
import Update from './components/Update.vue'
import { computed } from 'vue'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import zhTw from 'element-plus/es/locale/lang/zh-tw'
import en from 'element-plus/es/locale/lang/en'

import { useLanguageStore } from './store/languageStore'
const languageStore = useLanguageStore()
const locale = computed(() =>
  languageStore.locale == 'zh' ? zhCn : languageStore.locale == 'en' ? en : zhTw
)

window.api.sendToken(localStorage.getItem('authtoken') || '')
</script>

<style lang="less">
@import './assets/css/styles.less';
</style>
