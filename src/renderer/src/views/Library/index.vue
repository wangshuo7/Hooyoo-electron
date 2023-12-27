<template>
  <div class="container">
    <div class="title" @click="onRefresh">
      <h1>库</h1>
      <span class="refresh">
        <el-icon
          class="refresh-icon"
          :style="{ transform: `rotate(${rotation}deg)` }"
          ><Refresh
        /></el-icon>
      </span>
    </div>
    <!-- <div class="tabs">
      <div
        class="tab"
        :class="{ active: queryForm.activeTab === 'all' }"
        @click="onChangeAll"
      >
        全部
      </div>
      <div
        class="tab"
        :class="{ active: queryForm.activeTab === 'save' }"
        @click="onChangeSave"
      >
        收藏
      </div>
    </div> -->
    <div class="sort">
      <div>
        <el-form :form="queryForm" inline label-width="70">
          <el-form-item label="游戏名称">
            <el-input
              v-model="queryForm.title"
              style="width: 200px"
              placeholder="请输入游戏名称"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="排序">
            <el-select
              v-model="queryForm.sort"
              style="width: 200px"
              clearable
              placeholder="请选择排序方式"
            >
              <el-option value="2" label="创建时间正序" />
              <el-option value="1" label="创建时间倒序" />
              <el-option value="4" label="热度正序" />
              <el-option value="3" label="热度倒序" />
              <el-option value="6" label="banner正序" />
              <el-option value="5" label="banner倒序" />
            </el-select>
          </el-form-item>
          <el-form-item label="分类">
            <el-select
              v-model="queryForm.cate"
              style="width: 200px"
              clearable
              placeholder="请选择游戏分类"
            >
              <el-option
                v-for="item in categories"
                :key="item.id"
                :label="item.title"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="margin-left: 32px" @click="query"
              >搜索</el-button
            >
            <el-button @click="viewAll">显示全部</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="sort-icon">
        <span :class="{ active: viewType === 'list' }" @click="changeViewList">
          <i class="iconfont">&#xe696;</i>
        </span>
        <span
          :class="{ active: viewType === 'table' }"
          @click="changeViewTable"
        >
          <i class="iconfont">&#xe6b5;</i>
        </span>
      </div>
    </div>
    <!-- list样式 -->
    <div v-if="viewType === 'list'" v-loading="loading" class="list">
      <div
        v-for="(item, index) in tableData"
        :key="index"
        class="list-item"
        @click="goDetail(item)"
      >
        <el-image class="img" src="danzhu.jpg"></el-image>
        <div class="item-title">
          <span>{{ item.title }}</span>
          <span>
            <el-icon><MoreFilled /></el-icon>
          </span>
        </div>
        <div class="item-download">
          <span>
            <el-icon><Download /></el-icon>
          </span>
          <span>下载</span>
        </div>
      </div>
    </div>
    <!-- table样式 -->
    <div v-else>
      <el-table v-loading="loading" :data="tableData" style="width: 100%">
        <el-table-column label="标题" min-width="200">
          <template #default="{ row }">
            <div class="table">
              <div class="table-img">
                <el-image src="danzhu.jpg"></el-image>
              </div>
              <div class="table-info">
                <span class="info-title">{{ row.title }}</span>
                <span class="info-download">
                  <i class="iconfont">&#xe600;</i>
                  <span>安装</span>
                </span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="achieve" label="成就" min-width="100" />
        <el-table-column prop="content" label="附加内容" min-width="80" />
        <el-table-column prop="time" label="游戏时间" min-width="150" />
        <el-table-column prop="size" label="大小" min-width="80" />
        <el-table-column width="100">
          <template #default>
            <span>
              <el-icon><MoreFilled /></el-icon>
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <div>显示{{ totalItems }}个结果中的{{ counts }}</div>
      <el-pagination
        :page-size="pageSize"
        :total="totalItems"
        :current-page="currentPage"
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
      />
      <div>
        <span style="color: #9a9a9a">网格视图：</span>
        <el-dropdown
          trigger="click"
          placement="top"
          @visible-change="iconChange"
          @command="selsecSize"
        >
          <div class="dropdown">
            <span>{{ pageSize }}</span>
            <el-icon class="el-icon--right" :class="{ active: is_drop }">
              <arrow-down />
            </el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item :command="12">12</el-dropdown-item>
              <el-dropdown-item :command="24">24</el-dropdown-item>
              <el-dropdown-item :command="36">36</el-dropdown-item>
              <el-dropdown-item :command="totalItems">全部</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import {
  Refresh,
  MoreFilled,
  Download,
  ArrowDown
} from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { getMyGameList } from '../../api/mine'
import { useGlobalStore } from '../../store/globalStore'
const globalStore = useGlobalStore()
const queryForm = ref<any>({})
const categories = ref<any>([]) // 获取分类
const router = useRouter()
const tableData = ref<any>([])
function goDetail(item: any) {
  console.log(item.id)
  router.push({ name: 'Detail', params: { id: item.id } })
}
const loading = ref<boolean>(false)
// 分页相关
const currentPage = ref<number>(1) // 当前页
const pageSize = ref<number>(12) // 每页显示条数
const totalItems = ref<number>(0) // 总数据条数
// 当页码发生变化时触发
function handleCurrentChange(newPage: number) {
  currentPage.value = newPage
  query()
}
function selsecSize(value: number) {
  pageSize.value = value
}
const counts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value + 1
  const end = Math.min(currentPage.value * pageSize.value, totalItems.value)
  return `${start}-${end}`
})
// 显示全部
function viewAll() {
  queryForm.value = {}
  query()
}
// 查询
async function query() {
  try {
    loading.value = true
    const response = await getMyGameList({
      page: currentPage.value,
      page_size: pageSize.value,
      title: queryForm.value.title,
      orderby: queryForm.value.sort,
      cate_id: queryForm.value.cate
    })
    tableData.value = response?.data?.list
    totalItems.value = response?.data?.count
    loading.value = false
  } catch (error) {
    console.error('Error fetching data: ', error)
  }
}
const rotation = ref<number>(0)
function debounceOnRefresh() {
  rotation.value -= 180
  query()
}
const onRefresh = useDebounceFn(debounceOnRefresh, 300)

// 视图方式
const viewType = ref<string>('list')
function changeViewList() {
  viewType.value = 'list'
}
function changeViewTable() {
  viewType.value = 'table'
}
// 换页
const is_drop = ref<boolean>(false)
function iconChange(e: boolean) {
  is_drop.value = e
}
onMounted(async () => {
  query()
  await globalStore.setCategory()
  categories.value = globalStore.category
})
</script>

<style lang="less" scoped>
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
    grid-template-columns: 20% 20% 20% 20% 20%;
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

.title {
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  h1 {
    font-size: 30px;
    font-weight: 400;
    margin-right: 10px;
  }
  .refresh {
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #565656;
    cursor: pointer;
    transition: all 0.2s linear;
    .refresh-icon {
      transform: rotate(0deg);
      transition: all 0.6s linear;
    }
  }
  .refresh:hover {
    color: #f5f5f5;
  }
}
.tabs {
  display: flex;
  margin: 30px 0 30px;
  .tab {
    font-size: 18px;
    margin-right: 30px;
    line-height: 30px;
    color: #9a9a9a;
    cursor: pointer;
  }
  .tab.active {
    color: #f5f5f5;
    border-bottom: 2px solid #f5f5f5;
  }
}
.sort {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  .sort-icon {
    display: flex;
    span {
      cursor: pointer;
      width: 30px;
      height: 30px;
      margin-left: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
    }
    span.active {
      background: #2a2a2a;
    }
    span:hover i {
      color: #fff;
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

    .img {
      border-radius: 4px;
      margin-bottom: 10px;
    }
    .item-title {
      display: flex;
      justify-content: space-between;
      span:last-child {
        width: 32px;
        height: 22px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.3s linear;
      }
      span:last-child:hover {
        background: #373737;
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
}
.table {
  display: flex;
  align-items: center;
  .table-img {
    width: 85px;
    height: 40px;
    margin-right: 10px;
    .el-image {
      width: 100%;
      height: 100%;
    }
  }
  .table-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    .info-download {
      display: flex;
      align-items: baseline;
      color: #9a9a9a;
      font-size: 12px;
      .iconfont {
        font-size: 10px;
        color: #9a9a9a;
        margin-right: 5px;
      }
    }
  }
}
.pagination {
  margin-top: 20px;
  width: 100%;
  display: flex;
  justify-content: space-between;
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
</style>
