<template>
  <!-- <TheSwiper></TheSwiper> -->
  <!-- <br /> -->
  <!-- <TheSwiperCards></TheSwiperCards> -->

  <div class="container">
    <el-form :form="queryForm" inline label-width="70">
      <el-form-item label="名称">
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
    <div v-loading="loading" class="list">
      <div v-for="(item, index) in tableData" :key="index" class="list-item">
        <el-tag
          v-if="hasPurchasedGame(item.game_id)"
          class="tag"
          effect="dark"
          type="success"
          >已购买</el-tag
        >
        <el-image class="img" src="danzhu.jpg"></el-image>
        <div class="item-title">
          <span>{{ item.title }}</span>
        </div>
        <div class="item-price">
          <div v-if="item.price">
            <span class="price_1">{{ item.price }}</span>
            <span class="price_2">{{ item.cuxiao_price }}云豆</span>
          </div>
          <div v-else>免费</div>
        </div>
        <div class="item-percent">抽成比例：{{ item.divide }}%</div>
        <!-- <div class="item-download">
          <span>
            <el-icon><Download /></el-icon>
          </span>
          <span>下载</span>
        </div> -->
      </div>
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
// import TheSwiper from '../../components/TheSwiper/index.vue'
// import TheSwiperCards from '../../components/TheSwiperCards/index.vue'
import { ArrowDown } from '@element-plus/icons-vue'
import { getGameList } from '../../api/game'
import { getMyGameList } from '../../api/mine'
import { useGlobalStore } from '../../store/globalStore'
const globalStore = useGlobalStore()
const queryForm = ref<any>({})
const categories = ref<any>([]) // 获取分类
const tableData = ref<any>([]) // 所有数据
const my_game = ref<any>() // 我的游戏
const is_drop = ref<boolean>(false) // 换每页条数的箭头变化
const loading = ref<boolean>(false) // 加载
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
// 显示全部
function viewAll() {
  queryForm.value = {}
  query()
}
// 查询
async function query() {
  try {
    loading.value = true
    const response = await getGameList({
      page: currentPage.value,
      page_size: pageSize.value,
      title: queryForm.value.title,
      orderby: queryForm.value.sort,
      cate_id: queryForm.value.cate
    })
    tableData.value = response?.data?.list
    totalItems.value = response?.data?.count
    console.log(tableData.value)
    loading.value = false
  } catch (error) {
    console.error('Error fetching data: ', error)
  }
}

function iconChange(e: boolean) {
  is_drop.value = e
}
// 检查是否已购买游戏
function hasPurchasedGame(gameId: number) {
  return my_game.value?.includes(gameId)
}
// 更新我的游戏
async function updateMyGame() {
  const res = await getMyGameList({})
  my_game.value = res.data.list.map((item: any) => item.mg_game_id)
}
onMounted(async () => {
  updateMyGame()
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
    .img {
      border-radius: 4px;
      margin-bottom: 10px;
    }
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
