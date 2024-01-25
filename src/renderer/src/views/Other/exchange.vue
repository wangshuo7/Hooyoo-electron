<template>
  <el-dialog
    v-model="dialogVisible"
    title="兑换游戏"
    width="1000px"
    @close="closeExchangeDialog"
  >
    <div style="height: 400px">
      <el-form inline>
        <el-form-item label="兑换码">
          <el-input
            v-model.trim="code"
            style="width: 220px"
            placeholder="请输入兑换码"
            @input="viewInfo"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onBuyGame">兑换</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="clear">取消</el-button>
        </el-form-item>
      </el-form>
      <div v-if="info">
        <el-alert
          style="margin-bottom: 20px; width: 900px"
          :type="info.youhuiquan.is_use == 1 ? 'success' : 'error'"
          effect="dark"
          :closable="false"
        >
          <template #default>
            <div style="font-size: 14px; position: relative; bottom: 2px">
              <span style="margin-right: 20px">
                {{ info.youhuiquan.is_use == 1 ? '未使用' : '已使用' }}
              </span>
              <span v-if="info.youhuiquan.is_use == 1">
                可用时长{{ info.youhuiquan.days }}天
              </span>
            </div>
          </template>
        </el-alert>
        <div
          class="detail-head"
          :style="{
            backgroundImage:
              'linear-gradient(to right, rgba(51, 54, 58, 1) 0%, rgba(51, 54, 58, 1) 40%, rgba(51, 54, 58, 0) 70%), url(' +
              (info?.icon.includes('http') ? info?.icon : '/danzhu-card.jpg') +
              ')',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right'
          }"
        >
          <div class="head-left">
            <div class="head-title">{{ info?.title }}</div>
            <div class="info">{{ info?.jianjie }}</div>
            <div v-if="info?.cuxiao_price" class="price">
              ￥{{ info?.price }}
            </div>
            <div class="cuxiao-price">
              ￥{{ info?.cuxiao_price ? info?.cuxiao_price : info?.price }}
            </div>
            <div class="btns">
              <el-link
                style="margin-left: 12px"
                target="_bank"
                :href="info?.doc_url"
                :underline="false"
              >
                <el-button size="large" type="primary">使用指南</el-button>
              </el-link>
              <el-button
                style="margin-left: 12px"
                type="success"
                size="large"
                :disabled="!info.kefu"
              >
                客服
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { buyGame, exchangeGame } from '../../api/game'
import { ElMessage } from 'element-plus'
const code = ref<any>()
const info = ref<any>()
async function viewInfo() {
  const res = await exchangeGame({ code: code.value })
  info.value = res.data.info
  console.log(info.value)
}
function clear() {
  code.value = ''
  info.value = null
}
// 兑换游戏
async function onBuyGame() {
  try {
    let send_data: any
    if (info.value.youhuiquan.type === 2) {
      send_data = {
        game_id: info.value.game_id,
        code: code.value
      }
    } else {
      send_data = {
        game_id: info.value.game_id,
        taocan_id: info.value.youhuiquan.taocan_id,
        code: code.value
      }
    }
    const res: any = await buyGame(send_data)
    if (res.code === 200) {
      ElMessage.success('游戏兑换成功')
    }
  } catch (error) {
    console.log('catch error', error)
  }
}
const dialogVisible = ref<boolean>(false)
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})
const emits = defineEmits(['close'])
function closeExchangeDialog() {
  emits('close', false)
}
watch(
  () => props.visible,
  (val) => {
    dialogVisible.value = val
    code.value = ''
    info.value = null
  },
  { immediate: true }
)
</script>

<style lang="less" scoped>
.detail-head {
  width: 900px;
  height: 260px;
  position: relative;
  border-radius: 15px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  .head-left {
    flex: 1;
    color: #fff;
    .head-title {
      font-size: 20px;
      margin-bottom: 20px;
    }
    .info {
      height: 20px;
      margin-bottom: 20px;
    }
    .price {
      text-decoration: line-through;
      height: 18px;
      color: #f5f5f599;
    }
    .cuxiao-price {
      font-size: 18px;
      height: 18px;
      margin-bottom: 50px;
      color: #f5f5f5;
    }
    .btns {
      .el-button {
        width: 100px;
      }
    }
  }
}
</style>
