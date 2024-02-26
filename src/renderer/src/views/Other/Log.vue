<template>
  <el-popover
    placement="top"
    trigger="click"
    class="log"
    width="200px"
    :show-arrow="false"
  >
    <template #reference>
      <!-- <el-button text bg type="primary">日志</el-button> -->
      <div
        style="width: 100%; height: 100%; display: flex; align-items: center"
      >
        {{ $t('system.log') }}
      </div>
    </template>
    <div
      v-if="!wslog.length"
      style="
        height: 300px;
        display: flex;
        align-items: center;
        justify-content: center;
      "
    >
      <span>暂无日志输出</span>
    </div>
    <el-scrollbar v-else height="300px">
      <div v-for="(item, index) in wslog" :key="index">{{ item }}</div>
    </el-scrollbar>
  </el-popover>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const wslog = ref<any>([])

window.api.mainSendLog((res) => {
  const data = JSON.parse(res)
  let str = ''
  if (data.type === 'live_member') {
    str = `${data.data[0].nickname} 来了`
    // str = data.data[0].sec_openid
  }
  if (data.type === 'live_gift') {
    str = `${data.data[0].nickname} 送出礼物`
    // str = data.data[0].sec_openid
  }
  if (data.type === 'live_share') {
    str = `${data.data[0].nickname} 分享直播间`
    // str = data.data[0].sec_openid
  }
  if (data.type === 'live_comment') {
    str = `${data.data[0].nickname} 发送弹幕 ${data.data[0].content}`
    // str = data.data[0].sec_openid
  }
  if (data.type === 'live_follow') {
    str = `${data.data[0].nickname} 关注了`
    // str = data.data[0].sec_openid
  }
  if (data.type === 'live_like') {
    str = `${data.data[0].nickname} 点赞了`
    // str = data.data[0].sec_openid
  }
  wslog.value.unshift(str)
  if (wslog.value.length > 1000) {
    wslog.value = []
  }
})
</script>

<style lang="less" scoped>
.el-button {
  float: right;
}
</style>
