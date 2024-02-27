<template>
  <div class="main">
    <div class="login">
      <div class="login-logo">
        <el-image src="./system/hooyoo.gif" class="logo-img"></el-image>
      </div>
      <div class="login-title">开发者登录</div>
      <LogForm v-if="active === 'login'"></LogForm>
      <ForgetForm v-else></ForgetForm>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import LogForm from './components/LogForm.vue'
import ForgetForm from './components/ForgetForm.vue'
import { useDeveloperStore } from '../../../store/developer'
const developerStore = useDeveloperStore()
const active = computed(() => {
  return developerStore.is_active
})
</script>

<style lang="less" scoped>
.main {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #121212;
  // .log-box {
  //   width: 600px;
  //   height: 500px;
  // }
  .login {
    width: 470px;
    // height: 600px;
    background: #202020;
    border-radius: 4px;
    padding: 50px 55px 95px;
    .login-logo {
      width: 100%;
      height: 50px;
      margin-bottom: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
      .logo-img {
        height: 120%;
        width: auto;
        border-radius: 50%;
      }
    }
    .login-title {
      margin-bottom: 20px;
      width: 100%;
      height: 25px;
      color: #fff;
      text-align: center;
      font-size: 1.125rem;
      font-family: 'Brutal, sans-serif';
      font-weight: 700;
      line-height: 1.5625rem;
      letter-spacing: -0.2px;
    }
  }
}
</style>
