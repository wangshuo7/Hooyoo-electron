<template>
  <el-dialog
    v-model="dialogVisible"
    :title="$t('exchange.title')"
    width="1000px"
    @close="closeExchangeDialog"
  >
    <div style="height: 400px">
      <el-form inline>
        <el-form-item :label="$t('exchange.code')">
          <el-input
            v-model.trim="code"
            style="width: 240px"
            :placeholder="$t('exchange.code_placeholder')"
            @input="viewInfo"
          ></el-input>
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
                {{
                  info.youhuiquan.is_use == 1
                    ? $t('exchange.unused')
                    : $t('exchange.used')
                }}
              </span>
              <span v-if="info.youhuiquan.is_use == 1">
                {{ $t('exchange.time') }}{{ info.youhuiquan.days
                }}{{ $t('exchange.day') }}
              </span>
            </div>
          </template>
        </el-alert>
        <div
          class="detail-head"
          :style="{
            backgroundImage:
              'linear-gradient(to right, rgba(51, 54, 58, 1) 0%, rgba(51, 54, 58, 1) 40%, rgba(51, 54, 58, 0) 70%), url(' +
              (info?.icon?.includes('http') ? info?.icon : '/danzhu-card.jpg') +
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
              <el-button size="large" type="primary" @click="onBuyGame">{{
                $t('buttons.exchange')
              }}</el-button>
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
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const code = ref<any>()
const info = ref<any>()
async function viewInfo() {
  const res = await exchangeGame({ code: code.value })
  info.value = res.data.info
  console.log(info.value)
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
      ElMessage.success(t('exchange.success_message'))
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
