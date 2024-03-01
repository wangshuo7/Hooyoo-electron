<template>
  <el-dialog
    v-model="giftVisible"
    :title="$t('buttons.gift_icon')"
    @close="closeGiftDialog"
  >
    <div v-if="giftInfo.length">
      <div v-for="(item, index) in giftInfo" :key="index" class="gift">
        <div class="gift-lan">{{ getLangTitle(item.lan) }}：</div>
        <div v-for="(tu, ind) in item.tietu" :key="ind" class="gift-tu">
          <!-- <img :src="tu" alt="" style="width: 150px" /> -->
          <HImage :src="tu" style="width: 110px"></HImage>
        </div>
      </div>
    </div>
    <div v-else>
      <el-empty>
        <template #description>
          <div>{{ $t('detail.not_gift') }}</div>
        </template>
      </el-empty>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { getGiftIcon } from '../../../api/global'
import { ref, watch } from 'vue'
import HImage from '../../../components/HImage/index.vue'
import { ElMessage } from 'element-plus'
const giftVisible = ref<boolean>(false)
const giftInfo = ref<any[]>([])
function getLangTitle(id: number) {
  const foundItem = props.lang?.find((item) => item.id === id)
  return foundItem ? foundItem.title : null
}
window.api.saveImageResult((type) => {
  if (type == 'success') {
    ElMessage.success('保存图片成功')
  } else {
    ElMessage.error('保存图片失败')
  }
})
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  id: {
    type: Number
  },
  lang: {
    type: Object
  }
})
// watch(
//   () => props.id,
//   async (val) => {
//     const res: any = await getGiftIcon({ game_id: val })
//     giftInfo.value = res.data.tietu
//   }
// )
const emits = defineEmits(['close'])
function closeGiftDialog() {
  emits('close', false)
}
watch(
  () => props.visible,
  async (val) => {
    giftVisible.value = val
    if (val) {
      const res: any = await getGiftIcon({ game_id: props.id })
      giftInfo.value = res.data.tietu
    }
  },
  { immediate: true }
)
</script>

<style lang="less" scoped>
.setting-form {
  .el-input {
    width: 300px;
  }
}
.form-item-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 10px;
}
.gift {
  display: flex;
  margin-bottom: 10px;
  .gift-lan {
    width: 50px;
  }
  .gift-tu {
    margin-right: 10px;
  }
}
</style>
