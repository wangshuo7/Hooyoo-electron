<template>
  <el-form
    ref="ruleFormRef"
    :model="form"
    label-width="70px"
    :rules="rules"
    :hide-required-asterisk="true"
  >
    <el-form-item label="用户名" prop="username">
      <el-input
        v-model="form.username"
        class="input"
        placeholder="请输入用户名"
      ></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input
        v-model="form.password"
        class="input"
        type="password"
        placeholder="请输入密码"
      ></el-input>
    </el-form-item>
    <transition name="slide-fade">
      <div v-if="more_info" class="more-info-container">
        <el-form-item label="手机号" prop="mobile">
          <el-input
            v-model="form.mobile"
            class="input"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input
            v-model="form.nickname"
            class="input"
            placeholder="请输入昵称"
          ></el-input>
        </el-form-item>
        <el-form-item label="公会ID" prop="union_id">
          <el-input
            v-model="form.union_id"
            class="input"
            placeholder="请输入工会ID"
          ></el-input>
        </el-form-item>
        <el-form-item label="提现账户" prop="tx_card">
          <el-input
            v-model="form.tx_card"
            class="input"
            placeholder="请输入提现账户"
          ></el-input>
        </el-form-item>
      </div>
    </transition>

    <div
      style="
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      "
    >
      <el-link type="primary" :underline="false" @click="onGetMoreInfo">{{
        !more_info ? '填写更多信息' : '收起'
      }}</el-link>
    </div>
    <el-form-item>
      <div
        style="
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          align-items: center;
        "
      >
        <el-link type="primary" :underline="false" @click="switchLogin">
          返回登录
        </el-link>
      </div>
    </el-form-item>
    <el-button class="register-btn" type="primary" @click="onSubmit()"
      >注册</el-button
    >
  </el-form>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { register } from '../../../api/login'
// import HUpload from '../../../components/HUpload/index.vue'
import { useAccountStore } from '../../../store/account'
import { Base64 } from 'js-base64'
const accountStore = useAccountStore()
const ruleFormRef = ref<FormInstance>()
const form = reactive<any>({
  username: '',
  password: '',
  mobile: '',
  nickname: '',
  union_id: '',
  tx_card: ''
})
const rules = reactive<FormRules<any>>({
  username: [{ required: true, message: '必填', trigger: 'blur' }],
  password: [
    {
      required: true,
      message: '必填'
    }
  ],
  mobile: [
    // {
    //   required: true,
    //   message: '手机号不能为空'
    //   // trigger: 'change'
    // },
    {
      pattern: /^1[3|4|5|6|7|8|9]\d{9}$/,
      message: '手机号格式不正确',
      trigger: 'blur'
    }
  ]
  // nickname: [{ required: true, message: '昵称不能为空', trigger: 'blur' }],
  // union_id: [{ required: true, message: '公会ID不能为空', trigger: 'blur' }],
  // tx_card: [{ required: true, message: '提现账号不能为空', trigger: 'blur' }]
})
function onSubmit() {
  const send_data = {
    username: form.username,
    password: form.password,
    mobile: form.mobile,
    nickname: form.nickname,
    union_id: form.union_id,
    tx_card: form.tx_card
  }
  ruleFormRef.value?.validate(async (valid) => {
    if (valid) {
      const res: any = await register(send_data)
      if (res.code === 200) {
        ElMessage.success('注册成功')
        localStorage.setItem('hoo_anchor_username', send_data.username)
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
function switchLogin() {
  accountStore.setActive('login')
}
const more_info = ref<boolean>(false)
function onGetMoreInfo() {
  more_info.value = !more_info.value
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
