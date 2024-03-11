<template>
  <el-config-provider :locale="locale">
    <TitleBar></TitleBar>
    <router-view></router-view>
    <Update />
  </el-config-provider>
  <TheLogin :visible="loginVisible" @close="closeLoginDialog"></TheLogin>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import TitleBar from './components/TitleBar.vue'
import Update from './components/Update.vue'
import TheLogin from './views/Login/index.vue'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import zhTw from 'element-plus/es/locale/lang/zh-tw'
import en from 'element-plus/es/locale/lang/en'
import { isLogin } from './api/rc4'
import { useLanguageStore } from './store/languageStore'
import { useAccountStore } from './store/account'
const accountStore = useAccountStore()
const languageStore = useLanguageStore()
const locale = computed(() =>
  languageStore.locale == 'zh' ? zhCn : languageStore.locale == 'en' ? en : zhTw
)

window.api.sendToken(localStorage.getItem('authtoken') || '')

const loginVisible = ref<boolean>(false)
function closeLoginDialog() {
  loginVisible.value = false
}
onMounted(async () => {
  try {
    const res: any = await isLogin()
    if (res.code === 200) {
      accountStore.setIsLogin(true)
    } else {
      loginVisible.value = true
      accountStore.setIsLogin(false)
    }
  } catch (error) {
    console.error('Error:', error)
    loginVisible.value = true
    localStorage.setItem('is_login', 'false')
  }
})
</script>

<style lang="less">
@import './assets/css/styles.less';
</style>
