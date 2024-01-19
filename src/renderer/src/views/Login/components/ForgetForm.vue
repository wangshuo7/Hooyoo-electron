<template>
  <el-form
    ref="ruleFormRef"
    :model="form"
    label-width="70px"
    :rules="rules"
    :hide-required-asterisk="true"
  >
    <el-form-item label="手机号" prop="mobile">
      <el-input v-model="form.mobile" class="input" placeholder="请输入手机号">
        <template #suffix>
          <el-button
            color="#303030"
            :dark="true"
            :disabled="countdown > 0"
            @click="onGetCode"
          >
            {{ countdown > 0 ? `${countdown}` : '获取验证码' }}
          </el-button>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="验证码" prop="telcode">
      <el-input
        v-model="form.telcode"
        class="input"
        placeholder="请输入验证码"
      ></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input
        v-model="form.password"
        class="input"
        :show-password="true"
        placeholder="请输入密码"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <div style="width: 100%">
        <el-link
          style="float: right"
          type="primary"
          :underline="false"
          @click="switchLogin"
          >返回登陆</el-link
        >
      </div>
    </el-form-item>
    <el-button class="register-btn" type="primary" @click="onSubmit()"
      >确定</el-button
    >
  </el-form>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { resettingPassword, getPhoneCode } from '../../../api/login'
import { useAccountStore } from '../../../store/account'
import { Base64 } from 'js-base64'
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
  telcode: [{ required: true, message: '必填', trigger: 'blur' }],
  cpassword: [{ required: true, message: '必填', trigger: 'blur' }],
  password: [{ required: true, message: '必填' }],
  mobile: [
    {
      pattern: /^1[3|4|5|6|7|8|9]\d{9}$/,
      message: '手机号格式不正确',
      trigger: 'blur'
    },
    { required: true, message: '必填' }
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
      const res: any = await resettingPassword(send_data)
      if (res.code === 200) {
        ElMessage.success('密码重置成功')
        localStorage.setItem('hoo_anchor_username', send_data.mobile)
        localStorage.setItem(
          'hoo_anchor_password',
          Base64.encode(send_data.password)
        )
        switchLogin()
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
    return ElMessage.error('请填写手机号后获取')
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
