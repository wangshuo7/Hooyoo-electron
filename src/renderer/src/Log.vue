<template>
  <div>
    <el-scrollbar height="700px">
      <div v-for="(item, index) in wslog" :key="index">{{ item }}</div>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const wslog = ref<any>([])

window.api.mainSendLog((res) => {
  const data = JSON.parse(res)
  let str = ''
  if (data.type === 'live_member') {
    str = `${data.data[0].nickname} 来了`
  }
  if (data.type === 'live_gift') {
    str = `${data.data[0].nickname} 送出礼物`
  }
  if (data.type === 'live_share') {
    str = `${data.data[0].nickname} 分享直播间`
  }
  if (data.type === 'live_comment') {
    str = `${data.data[0].nickname} 发送弹幕 ${data.data[0].content}`
  }
  if (data.type === 'live_follow') {
    str = `${data.data[0].nickname} 关注了`
  }
  if (data.type === 'live_like') {
    str = `${data.data[0].nickname} 点赞了`
  }
  wslog.value.unshift(str)
  if (wslog.value.length > 1000) {
    wslog.value = []
  }
})
</script>

<style lang="less"></style>
