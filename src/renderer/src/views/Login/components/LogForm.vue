<template>
  <el-form ref="ruleFormRef" :model="form" :rules="rules">
    <el-form-item prop="username" class="form-item">
      <div class="input-box">
        <p class="label-user" :class="{ active: user_active }">
          {{ loginType ? $t('login.account') : $t('login.phone') }}
        </p>
        <el-input
          v-model="form.username"
          class="login-input user-input"
          :class="{ active: user_border }"
          @focus="userFocus"
          @blur="userBlur"
          @keyup.enter="onSubmit"
        >
          <template #suffix>
            <el-button
              v-if="!loginType"
              color="#303030"
              :dark="true"
              size="large"
              :disabled="countdown > 0"
              style="position: relative; bottom: 10px"
              @click="onGetCode"
            >
              {{ countdown > 0 ? `${countdown}` : $t('login.get_code') }}
            </el-button>
          </template>
        </el-input>
      </div>
    </el-form-item>
    <el-form-item prop="password" class="form-item" style="margin-bottom: 10px">
      <div class="input-box">
        <p class="label-password" :class="{ active: psd_active }">
          {{ loginType ? $t('login.password') : $t('login.code') }}
        </p>
        <el-input
          v-model="form.password"
          :show-password="true"
          class="login-input psd-input"
          :class="{ active: psd_border }"
          type="password"
          @focus="psdFocus"
          @blur="psdBlur"
          @keyup.enter="onSubmit"
        ></el-input>
      </div>
    </el-form-item>
    <el-form-item>
      <div
        style="
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        "
      >
        <el-checkbox
          v-model="remember"
          :label="$t('login.remember')"
        ></el-checkbox>
        <el-link type="primary" :underline="false" @click="switchRegister">{{
          $t('login.register_account')
        }}</el-link>
      </div>
    </el-form-item>
    <el-form-item>
      <el-button
        class="login-btn"
        color="rgb(40, 138, 232)"
        type="primary"
        @click="onSubmit"
        >{{ $t('login.login') }}</el-button
      >
    </el-form-item>
    <el-divider> {{ $t('login.orther') }} </el-divider>
    <div
      style="display: flex; align-items: center; justify-content: space-around"
    >
      <el-button
        class="change-btn"
        color="rgb(40, 138, 232)"
        @click="switchLoginType"
      >
        {{ loginType ? $t('login.codelog') : $t('login.psdlog') }}
      </el-button>
      <el-button
        class="change-btn"
        color="rgb(40, 138, 232)"
        @click="switchForget"
      >
        {{ $t('login.forget') }}
      </el-button>
    </div>
  </el-form>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { login, getPhoneCode } from '../../../api/login'
import { Base64 } from 'js-base64'
import { useAccountStore } from '../../../store/account'
// import { useRouter } from 'vue-router'
// const router = useRouter()
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const accountStore = useAccountStore()

const loginType = ref<boolean>(true) // true为密码登录 | false为验证码登录

const ruleFormRef = ref<FormInstance>()

const form = reactive<any>({
  login_type: '1',
  username: '',
  password: ''
})
const rules = reactive<FormRules<any>>({
  username: [
    {
      required: true,
      message: t('login.required')
    }
  ],
  password: [
    {
      required: true,
      message: t('login.required')
    }
  ]
})
const emit = defineEmits(['loginSuccess'])
async function onSubmit() {
  let send_data: any
  if (loginType.value) {
    send_data = {
      login_type: '1',
      username: form.username,
      password: form.password
    }
  } else {
    send_data = {
      login_type: '3',
      username: form.username,
      telkey: form.telkey,
      telcode: form.password
    }
  }
  ruleFormRef.value?.validate(async (valid) => {
    if (valid) {
      const res: any = await login(send_data)
      if (res?.code === 200) {
        if (!loginType.value) {
          localStorage.setItem('authtoken', res.data.t)
          // router.push('/home')
          accountStore.setIsLogin(true)
          localStorage.setItem('is_login', 'true')
          window.api.sendToken(res.data.t)
          emit('loginSuccess')
          return ElMessage.success(t('login.msg_login_success'))
        }
        localStorage.setItem('hoo_anchor_remember', remember.value + '')
        const basePassword = Base64.encode(form.password) // 加密
        if (remember.value) {
          localStorage.setItem('hoo_anchor_username', form.username)
          localStorage.setItem('hoo_anchor_password', basePassword)
        } else {
          localStorage.removeItem('hoo_anchor_username')
          localStorage.removeItem('hoo_anchor_password')
        }
        localStorage.setItem('authtoken', res.data.t)
        accountStore.setIsLogin(true)
        localStorage.setItem('is_login', 'true')
        // router.push('/home')
        window.api.sendToken(res.data.t)
        emit('loginSuccess')
        return ElMessage.success(t('login.msg_login_success'))
      }
    } else {
      return console.log('表单验证未通过')
    }
  })
}
const countdown = ref<number>(0)
// 获取手机验证码
async function onGetCode() {
  if (!form.username) {
    return ElMessage.error(t('login.msg_phone_err'))
  }
  const res: any = await getPhoneCode({ tel: form.username })
  if (res.code === 200) {
    if (countdown.value === 0) {
      countdown.value = 60
      const timer = setInterval(() => {
        countdown.value--
        if (countdown.value === 0) {
          clearInterval(timer)
        }
      }, 1000)
    }
    return (form.telkey = res.data.telkey)
  }
}
// 用户名
const user_active = ref<boolean>(true)
function userFocus() {
  user_active.value = true
  user_border.value = true
  ruleFormRef.value?.clearValidate('username')
}
function userBlur(): any {
  user_border.value = false
  if (form.username) {
    return (user_active.value = true)
  }
  user_active.value = false
}
// 密码
const psd_active = ref<boolean>(true)
function psdFocus() {
  psd_active.value = true
  psd_border.value = true
  ruleFormRef.value?.clearValidate('password')
}
function psdBlur(): any {
  psd_border.value = false
  if (form.password) {
    return (psd_active.value = true)
  }
  psd_active.value = false
}

const user_border = ref<boolean>(false)
const psd_border = ref<boolean>(false)
// 记住密码
const remember = ref<boolean>(false)
onMounted(() => {
  const is_remember = localStorage.getItem('hoo_anchor_remember')
  if (is_remember === 'true') {
    remember.value = true
  } else {
    remember.value = false
  }
  const username = localStorage.getItem('hoo_anchor_username')
  const password = localStorage.getItem('hoo_anchor_password')
  if (username) form.username = username
  if (password) form.password = Base64.decode(password) // 解密

  if (form.username) {
    user_active.value = true
  } else {
    user_active.value = false
  }
  if (form.password) {
    psd_active.value = true
  } else {
    psd_active.value = false
  }
})
// 切换注册
function switchRegister() {
  accountStore.setActive('register')
}
function decode(value: any) {
  if (!value) {
    return ''
  }
  return Base64.decode(value)
}
// 切换验证码登陆
function switchLoginType() {
  loginType.value = !loginType.value
  if (!loginType.value) {
    // form.username = ''
    ruleFormRef.value?.resetFields()
    user_active.value = false
    user_border.value = false
    psd_active.value = false
    psd_border.value = false
  } else {
    form.username = localStorage.getItem('hoo_anchor_username') as string
    form.password = decode(localStorage.getItem('hoo_anchor_password'))
    user_active.value = true
    user_border.value = true
    psd_active.value = true
    psd_border.value = true
  }
}
// 切换忘记密码
function switchForget() {
  accountStore.setActive('forget')
}
</script>

<style lang="less" scoped>
.login-input {
  :deep(.el-input__wrapper) {
    width: 360px;
    height: 60px;
    padding: 30px 20px 10px;
    border: 1px solid #686868;
    border-radius: 4px;
    // border: none;
    background: #202020;
    box-shadow: none;
    transition: border 0.3s ease;
    .el-input__inner {
      color: #fff !important;
    }
  }
}
.user-input.active {
  :deep(.el-input__wrapper) {
    border: 1px solid #fff;
  }
}
.psd-input.active {
  :deep(.el-input__wrapper) {
    border: 1px solid #fff;
  }
}
.input-box {
  position: relative;
  .label-user {
    color: #c1c1c1;
    font-size: 0.875rem;
    position: absolute;
    line-height: 1.4;
    pointer-events: none;
    top: 20px;
    left: 20px;
    z-index: 1;
    transition: all 0.3s ease;
  }
  .label-user.active {
    color: #c1c1c1;
    font-size: 0.875rem;
    position: absolute;
    line-height: 1.4;
    pointer-events: none;
    top: 10px;
    left: 18px;
    z-index: 1;
    scale: calc(0.8);
  }
  .label-password {
    color: #c1c1c1;
    font-size: 0.875rem;
    position: absolute;
    line-height: 1.4;
    pointer-events: none;
    top: 20px;
    left: 20px;
    z-index: 1;
    transition: all 0.3s ease;
  }
  .label-password.active {
    color: #c1c1c1;
    font-size: 0.875rem;
    position: absolute;
    line-height: 1.4;
    pointer-events: none;
    top: 10px;
    left: 18px;
    z-index: 1;
    scale: calc(0.8);
  }
}
.login-btn {
  width: 360px;
  height: 60px;
}
.form-item {
  margin-bottom: 40px;
}
:deep(.el-divider__text.is-center) {
  background-color: #202020;
  color: #bebebe;
}
.change-btn {
  width: 120px;
  border: 0;
  border-radius: 15px;
}
</style>
