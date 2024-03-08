<template>
  <div class="container">
    <div>
      <div style="display: flex; justify-content: space-between">
        <el-form>
          <el-form-item :label="$t('search.cate')">
            <el-radio-group v-model="queryForm.cate_id" @change="query">
              <el-radio border :value="0">{{ $t('system.all') }}</el-radio>
              <el-radio
                v-for="item in learnCate"
                :key="item.id"
                border
                :value="item.id"
                >{{ item.title }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
        </el-form>
        <span class="refresh" @click="onRefresh">
          <el-icon
            class="refresh-icon"
            :style="{ transform: `rotate(${rotation}deg)` }"
            ><Refresh
          /></el-icon>
        </span>
      </div>
      <div v-loading="loading" class="list">
        <div
          v-for="(item, index) in listData"
          :key="index"
          class="list-item"
          @click="onViewLearn(item)"
        >
          <div class="img-box">
            <el-image class="img" :src="item.fengmian"></el-image>
          </div>
          <div class="item-title">
            <span>{{ item.title }}</span>
          </div>
          <div class="item-price">
            <span v-if="+item.yundou == 0">{{ $t('detail.free') }}</span>
            <span v-else>价格：{{ +item.yundou }}</span>
          </div>
          <div class="item-percent"></div>
        </div>
      </div>
    </div>
    <div class="pagination">
      <div class="pagination-view">
        <span>{{ $t('system.display') }}</span>
        <span>&nbsp;{{ totalItems }}&nbsp;</span>
        <span>{{ $t('system.result') }}&nbsp;</span>
        <span>{{ counts }}</span>
      </div>
      <el-pagination
        :page-size="pageSize"
        :total="totalItems"
        :current-page="currentPage"
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
      />
      <div>
        <span style="color: #9a9a9a">{{ $t('system.viwe') }}：</span>
        <el-dropdown
          trigger="click"
          placement="top"
          @visible-change="iconChange"
          @command="selsecSize"
        >
          <div class="dropdown">
            <span>{{
              pageSize == totalItems ? $t('system.all') : pageSize
            }}</span>
            <el-icon class="el-icon--right" :class="{ active: is_drop }">
              <ArrowDown />
            </el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item :command="12">12</el-dropdown-item>
              <el-dropdown-item :command="24">24</el-dropdown-item>
              <el-dropdown-item :command="36">36</el-dropdown-item>
              <el-dropdown-item :command="totalItems">{{
                $t('system.all')
              }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
  <el-dialog
    v-model="dialogVisible"
    :title="$t('buttons.confirm')"
    width="500px"
  >
    <div>{{ $t('learn.tip') }}{{ teachPrice }}{{ $t('system.price') }}</div>
    <template #footer>
      <el-button @click="dialogVisible = false">{{
        $t('buttons.cancel')
      }}</el-button>
      <el-button type="primary" @click="onConfirm">{{
        $t('buttons.confirm')
      }}</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { getLearnList, getLearnCateList, getLearnInfo } from '../../api/learn'
import { Refresh, ArrowDown } from '@element-plus/icons-vue'
import { useDebounceFn } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
const { t } = useI18n()
const is_start = ref<any>(false)
const dialogVisible = ref<any>(false)
const teachPrice = ref<any>()
const teachId = ref<any>()
const loading = ref<boolean>(false) // 加载
const is_drop = ref<boolean>(false) // 换每页条数的箭头变化
const currentPage = ref<number>(1) // 当前页
const pageSize = ref<number>(12) // 每页显示条数
const totalItems = ref<number>(0) // 总数据条数
// 计算显示具体条数
const counts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value + 1
  const end = Math.min(currentPage.value * pageSize.value, totalItems.value)
  return `${start}-${end}`
})
// 当页码发生变化时触发
function handleCurrentChange(newPage: number) {
  currentPage.value = newPage
  query()
}
// 选择每页条数
function selsecSize(value: number) {
  pageSize.value = value
}
function iconChange(e: boolean) {
  is_drop.value = e
}
/**
 * 刷新icon
 */
const rotation = ref<number>(0)
function debounceOnRefresh() {
  rotation.value -= 180
  viewAll()
}
const onRefresh = useDebounceFn(debounceOnRefresh, 300)
const queryForm = ref<any>({
  cate_id: 0
})
// 显示全部
function viewAll() {
  queryForm.value.cate_id = 0
  query()
}
async function onViewLearn(row: any) {
  if (is_start.value) {
    ElMessage.warning(t('learn.warn'))
    return
  }
  teachId.value = row.id
  teachPrice.value = row.yundou
  if (row.yundou == '0.00') {
    onConfirm()
    return
  }
  const res: any = await getLearnInfo({
    check_is_read: 1,
    jiaocheng_id: row.id
  })
  if (!res.data.is_read) {
    dialogVisible.value = true
    return
  }
  onConfirm()
}
async function onConfirm() {
  const res: any = await getLearnInfo({ jiaocheng_id: teachId.value })
  window.api.openLearnWindow(res.data.jiaocheng.dizhi)
  is_start.value = true
  // window.open(res.dizhi, '_blank')
}
window.api.mainCloseLearn(() => {
  is_start.value = false
})
const listData = ref<any>()
const learnCate = ref<any>()
// 查询
async function query() {
  try {
    loading.value = true
    const send_data = {
      page: 1,
      page_size: 10,
      cate_id:
        queryForm.value.cate_id == 0 ? undefined : queryForm.value.cate_id
    }
    const res: any = await getLearnList(send_data)
    listData.value = res.data.list
    totalItems.value = res?.data?.count
    loading.value = false
  } catch (error) {
    console.error('Error fetching data: ', error)
  }
}
async function getLearnCate() {
  const res: any = await getLearnCateList()
  learnCate.value = res.data.list
}
onMounted(() => {
  query()
  getLearnCate()
})
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
@media screen and (max-width: 1280px) {
  .container {
    width: 100%;
  }
  .list {
    grid-template-columns: 33.3% 33.3% 33.3%;
    .list-item {
      height: 230px;
    }
  }
}
@media screen and (min-width: 1281px) and (max-width: 1600px) {
  .container {
    width: 100%;
  }
  .list {
    grid-template-columns: 25% 25% 25% 25%;
    .list-item {
      height: 250px;
    }
  }
}
@media screen and (min-width: 1601px) and (max-width: 2001px) {
  .container {
    width: 100%;
  }
  .list {
    grid-template-columns: 25% 25% 25% 25%;
    .list-item {
      height: 260px;
    }
  }
}
@media screen and (min-width: 2000px) {
  .container {
    width: 100rem;
    margin: 0 auto;
  }
  .list {
    grid-template-columns: 16.66% 16.66% 16.66% 16.66% 16.66% 16.66%;
    .list-item {
      height: 280px;
    }
  }
}
.list {
  display: grid;
  .list-item {
    padding: 16px 16px 0;
    border-radius: 6px;
    transition: all 0.2s linear;
    // height: 342px;
    position: relative;
    .tag {
      position: absolute;
      top: 10px;
      right: 10px;
      z-index: 999;
    }
    .pre-tag {
      position: absolute;
      top: 10px;
      left: 10px;
      z-index: 999;
    }
    .img-box {
      width: 100%;
      aspect-ratio: 547/260;
      border-radius: 4px;
      margin-bottom: 10px;
      overflow: hidden;
    }
    // .img {
    //   // max-height: 145px;
    //   // width: 100%;
    //   // height: 45%;
    //   // border-radius: 4px;
    //   // margin-bottom: 10px;
    // }
    .item-title {
      display: flex;
      justify-content: space-between;
      text-indent: 5px;
    }
    .item-price {
      display: flex;
      margin: 3px 0;

      .price_1 {
        color: rgba(245, 245, 245, 0.6);
        text-decoration: line-through;
        margin: 0 7px;
        font-size: 14px;
      }
      .price_2 {
        color: #f5f5f5;
      }
    }
    .item-percent {
      font-size: 16px;
      color: #9a9a9a;
      text-indent: 5px;
    }
  }
  .item-download {
    margin-top: 5px;
    display: flex;
    // align-items: center;
    color: #9a9a9a;
    span {
      margin-right: 10px;
    }
    span:last-child {
      line-height: 16px;
    }
  }
}
.list-item::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #fff;
  opacity: 0;
  pointer-events: none;
  z-index: 1;
  border-radius: 6px;
  transition: opacity 0.3s ease;
}
.list-item:hover::after {
  opacity: 0.1;
}

.pagination {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .pagination-view {
    width: 200px;
  }
  :deep(.el-pagination) {
    button {
      width: 58px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #121212;
      color: #f7f7f7;
      font-weight: 900;
    }
    button:hover {
      background: #373737;
    }
    ul li {
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #121212;
      color: #9a9a9a;
    }
    ul li.is-active {
      color: #f5f5f5 !important;
    }
    ul li:hover {
      background: #373737;
    }
  }
  div:first-child {
    color: #9a9a9a;
  }
  div:last-child {
    display: flex;
    align-items: center;
    .dropdown {
      color: #f5f5f5;
      position: relative;
      top: 2px;
      .el-icon--right {
        transition: all 0.2s linear;
      }
      .el-icon--right.active {
        transform: rotate(-180deg);
      }
    }
  }
}
// 刷新
.refresh {
  display: block;
  border-radius: 5px;
  background: #2e2e2e;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  // color: #9b9a9a;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s linear;
  .refresh-icon {
    transform: rotate(0deg);
    transition: all 0.5s linear;
  }
}
.refresh:hover {
  color: #f5f5f5;
  background: #444444;
}
</style>
