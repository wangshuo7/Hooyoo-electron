<template>
  <el-dialog
    v-model="loginVisible"
    modal-class="login-dialog"
    top="10vh"
    width="500"
    style="background: #202020"
    @close="closeLoginDialog"
  >
    <div class="main">
      <div class="login">
        <div class="login-logo">
          <el-image src="./system/hooyoo.gif" class="logo-img"></el-image>
        </div>
        <div class="login-title">
          {{
            active === 'login'
              ? $t('login.login')
              : active === 'register'
                ? $t('login.register')
                : $t('login.reset')
          }}
        </div>
        <LogForm v-if="active === 'login'" @login-success="onLogin"></LogForm>
        <RegisterForm v-else-if="active === 'register'"></RegisterForm>
        <ForgetForm v-else></ForgetForm>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import LogForm from './components/LogForm.vue'
import RegisterForm from './components/RegisterForm.vue'
import ForgetForm from './components/ForgetForm.vue'
import { useAccountStore } from '../../store/account'
const accountStore = useAccountStore()
const active = computed(() => {
  return accountStore.login_active
})
function onLogin() {
  loginVisible.value = false
}
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})
const loginVisible = ref<any>(false)
const emits = defineEmits(['close'])
function closeLoginDialog() {
  emits('close', false)
}
watch(
  () => props.visible,
  (val: boolean) => {
    loginVisible.value = val
    if (val) {
      accountStore.setActive('login')
    }
  },
  { immediate: true }
)
</script>

<style lang="less" scoped>
// .main {
// width: 100vw;
// height: 80vh;
// display: flex;
// align-items: center;
// justify-content: center;
// background: #121212;
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
:deep(.el-dialog) {
  background: red;
}
// }
</style>
