<template>
  <el-form
    ref="ruleFormRef"
    :model="form"
    label-width="70px"
    :rules="rules"
    :hide-required-asterisk="true"
  >
    <el-form-item :label="$t('login.phone')" prop="mobile">
      <el-input
        v-model="form.mobile"
        class="input"
        :placeholder="$t('login.phone_placeholder')"
      >
        <template #suffix>
          <el-button
            color="#303030"
            :dark="true"
            :disabled="countdown > 0"
            @click="onGetCode"
          >
            {{ countdown > 0 ? `${countdown}` : $t('login.get_code') }}
          </el-button>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item :label="$t('login.code')" prop="telcode">
      <el-input
        v-model="form.telcode"
        class="input"
        :placeholder="$t('login.code_placeholder')"
      ></el-input>
    </el-form-item>
    <el-form-item :label="$t('login.password')" prop="password">
      <el-input
        v-model="form.password"
        class="input"
        :show-password="true"
        :placeholder="$t('login.password_placeholder')"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <div style="width: 100%">
        <el-link
          style="float: right"
          type="primary"
          :underline="false"
          @click="switchLogin"
          >{{ $t('login.back') }}</el-link
        >
      </div>
    </el-form-item>
    <el-button class="register-btn" type="primary" @click="onSubmit()">{{
      $t('buttons.confirm')
    }}</el-button>
  </el-form>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { resettingPassword, getPhoneCode } from '../../../api/login'
import { useAccountStore } from '../../../store/account'
import { Base64 } from 'js-base64'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const accountStore = useAccountStore()
const ruleFormRef = ref<FormInstance>()
const form = reactive<any>({
  mobile: '',
  telcode: '',
  password: '',
  cpassword: '',
  telkey: ''
})
const rules = reactive<FormRules<any>>({
  telcode: [{ required: true, message: t('login.required'), trigger: 'blur' }],
  cpassword: [
    { required: true, message: t('login.required'), trigger: 'blur' }
  ],
  password: [{ required: true, message: t('login.required') }],
  mobile: [
    {
      pattern: /^1[3|4|5|6|7|8|9]\d{9}$/,
      message: t('login.format'),
      trigger: 'blur'
    },
    { required: true, message: t('login.required') }
  ]
})
function onSubmit() {
  const send_data = {
    mobile: form.mobile,
    telkey: form.telkey,
    telcode: form.telcode,
    password: form.password
  }
  ruleFormRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        const res: any = await resettingPassword(send_data)
        if (res.code === 200) {
          ElMessage.success(t('login.msg_re_yes'))
          localStorage.setItem('hoo_anchor_username', send_data.mobile)
          localStorage.setItem(
            'hoo_anchor_password',
            Base64.encode(send_data.password)
          )
          switchLogin()
        }
      } catch (error: any) {
        ElMessage.error(error)
      }
    } else {
      // 表单验证未通过
    }
  })
}
// 获取手机验证码
const countdown = ref<number>(0)
async function onGetCode() {
  if (!form.mobile) {
    return ElMessage.error(t('login.msg_phone_err'))
  }
  const res: any = await getPhoneCode({ tel: form.mobile })
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

function switchLogin() {
  accountStore.setActive('login')
}
</script>

<style lang="less" scoped>
.input {
  :deep(.el-input__wrapper) {
    width: 360px;
    height: 40px;
    // padding: 30px 20px 10px;
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
.register-btn {
  width: 360px;
  height: 60px;
}
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  // transform: translateY(-20px);
  opacity: 0;
  height: 0;
}
.slide-fade-enter-to,
.slide-fade-leave-from {
  height: 232px;
}
.more-info-container {
  overflow: hidden;
}
</style>
