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
      <div
        v-for="(item, index) in tableData"
        :key="index"
        class="list-item"
        @click="openDetail(item)"
      >
        <!-- v-if="hasPurchasedGame(item.game_id)" -->
        <el-tag
          v-if="tagPurchasedGame(item.game_id)"
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
            <span>{{ pageSize == totalItems ? '全部' : pageSize }}</span>
            <el-icon class="el-icon--right" :class="{ active: is_drop }">
              <ArrowDown />
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
  <!-- 详情 -->
  <el-dialog
    v-model="detailVisible"
    :title="`${game_name}${buyID}`"
    width="945"
    :close-on-click-modal="isdownloading"
    :show-close="isdownloading"
  >
    <div class="detail">
      <div
        class="detail-head"
        style="
          background-image: linear-gradient(
              to right,
              rgba(51, 54, 58, 1) 0%,
              rgba(51, 54, 58, 1) 40%,
              rgba(51, 54, 58, 0) 70%
            ),
            url('./danzhu.jpg');
          background-repeat: no-repeat;
          background-position: right;
        "
      >
        <div class="head-left">
          <div class="head-title">{{ detail.title }}</div>
          <div class="info">{{ detail.jianjie }}</div>
          <div v-if="detail.cuxiao_price" class="price">
            ￥{{ detail.price }}
          </div>
          <div class="cuxiao-price">
            ￥{{ detail.cuxiao_price ? detail.cuxiao_price : detail.price }}
          </div>
          <div class="btns">
            <el-button
              v-if="gameStatus[detail.game_id] == 'nopurchased'"
              size="large"
              type="success"
              @click="buyVisible = true"
              >购买游戏</el-button
            >
            <el-button
              v-else-if="gameStatus[detail.game_id] == 'purchased'"
              size="large"
              type="primary"
              @click="downLoadGame"
              >下载游戏</el-button
            >
            <el-button
              v-else-if="gameStatus[detail.game_id] == 'unzipped'"
              size="large"
              type="danger"
              @click="launchGame"
              >启动游戏</el-button
            >
            <div
              v-else
              style="
                width: 100px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 12px 0 0;
              "
            >
              下载中 {{ `${Math.floor(+progress_test)}%` }}
            </div>
            <el-button type="warning" size="large" :disabled="!detail.kefu"
              >客服</el-button
            >
          </div>
        </div>
      </div>
      <!-- 套餐 -->
      <div class="detail-info package">
        <h3>套餐</h3>
        <div class="package-content">
          <div
            v-for="(item, index) in detail.taocan"
            :key="index"
            class="package-card"
          >
            <div class="card-left">套餐{{ index + 1 }}</div>
            <div class="card-right">
              <div>
                <span>天数：</span><span>{{ item.tdays }}</span>
              </div>
              <div>
                <span>价格：</span><span>{{ item.tprice }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 详细信息 -->
      <div class="detail-info">
        <h3>详细信息</h3>
        <div class="info-item">
          <div>
            <span>开播余额:</span><span>{{ detail.min_price }}</span>
          </div>
          <div>
            <span>分成比例:</span><span>{{ detail.divide }}</span>
          </div>
          <div>
            <span>更新时间:</span><span>{{ formatTime(detail.uptime) }}</span>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
  <!-- 购买 -->
  <el-dialog v-model="buyVisible" width="30%">
    <template #header>
      <div>
        <span style="margin-right: 20px">购买</span>
        <el-tag size="large">{{ game_name }}</el-tag>
      </div>
    </template>
    <div>
      <el-form ref="ruleFormRef" :model="form" label-width="100px">
        <el-form-item label="套餐">
          <el-select
            v-model="thePackage"
            placeholder="请选择套餐"
            @change="selectPackage"
          >
            <el-option label="自定义" :value="0"></el-option>
            <el-option
              v-for="(item, index) in packages"
              :key="item.id"
              :label="`套餐${index + 1}(${item.tdays}天，${item.tprice}云豆)`"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="天数"
          prop="tdays"
          :rules="[
            {
              required: true,
              message: '请填写天数',
              trigger: 'blur'
            }
          ]"
        >
          <el-input
            v-model="form.tdays"
            type="number"
            :disabled="thePackage !== 0"
            placeholder="请输入天数"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="价格"
          prop="tprice"
          :rules="[
            {
              required: true,
              message: '请填写价格',
              trigger: 'blur'
            }
          ]"
        >
          <el-input
            v-model="form.tprice"
            type="number"
            :disabled="thePackage !== 0"
            placeholder="请输入价格"
          ></el-input>
        </el-form-item>
        <el-form-item label="折扣券或免费激活码">
          <el-input
            v-model="form.code"
            placeholder="请输入折扣券或免费激活码"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="buyVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmOrder">确定</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 确认购买 -->
  <el-dialog v-model="secondVisible" title="确认订单" width="30%">
    <div>
      <span>天数：</span><span>{{ jisuanData?.days }}</span>
    </div>
    <div>
      <span>价格：</span><span>{{ jisuanData?.price }}</span>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="secondVisible = false">取消</el-button>
        <el-button type="primary" @click="confirm">购买</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useDateFormat } from '@vueuse/core'
// import TheSwiper from '../../components/TheSwiper/index.vue'
// import TheSwiperCards from '../../components/TheSwiperCards/index.vue'
import { ArrowDown } from '@element-plus/icons-vue'
import { buyGame, getGameList } from '../../api/game'
import { getMyGameList } from '../../api/mine'
import { useGlobalStore } from '../../store/globalStore'
import { ElMessage, FormInstance } from 'element-plus'
// import { fs } from 'nodejs'
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
const detailVisible = ref<boolean>(false)
const buyID = ref<any>()
const game_name = ref<any>()
const detail = ref<any>()
const buyVisible = ref<boolean>(false)
const secondVisible = ref<boolean>(false)
const ruleFormRef = ref<FormInstance>()

// 套餐
const thePackage = ref<number>(0)
const packages = computed(() => {
  const item =
    tableData.value.find((game: any) => game.game_id === buyID.value) || {}
  return item.taocan.map((i: any, index: number) => {
    return Object.assign({}, i, { id: index + 1 })
  })
})
// 添加表单
const form = ref<{
  tdays: string
  tprice: string
  code: string
}>({
  tdays: '',
  tprice: '',
  code: ''
})
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
    loading.value = false
  } catch (error) {
    console.error('Error fetching data: ', error)
  }
}

function iconChange(e: boolean) {
  is_drop.value = e
}
// 检查是否已购买游戏
function tagPurchasedGame(gameId: number) {
  return my_game.value?.includes(gameId)
}

// 更新我的游戏
async function updateMyGame() {
  const res = await getMyGameList({})
  my_game.value = res.data.list.map((item: any) => item.mg_game_id)
}
// 打开详情
function openDetail(item: any) {
  detailVisible.value = true
  buyID.value = item.game_id
  game_name.value = item.title
  detail.value = item
  hasPurchasedGame(item.game_id)
  window.api.checkGame(item.game_id)
  // console.log('bbbbbb', gameStatus.value)
  // const exeFiles = fs
  //   .readdirSync(`D:\\hooyoo\\game${buyID.value}`)
  //   .filter((file) => /\.(exe)$/i.test(file) && !/Unity/i.test(file))
  // if (exeFiles.length > 0) {
  //   gameStatus.value[buyID.value] = 'unzipped'
  // }
}
window.api.checkGameReply((id) => {
  hasPurchasedGame(id)
})
// 更改安装路径后重置游戏状态
window.api.initGameStatus(() => {
  gameStatus.value = {}
})
// 检查是否已购买游戏
function hasPurchasedGame(gameId: number) {
  if (gameStatus.value[gameId]) {
    return
  }
  if (my_game.value?.includes(gameId)) {
    gameStatus.value[gameId] = 'purchased' // 已购买
  } else {
    gameStatus.value[gameId] = 'nopurchased' // 未购买
  }
}
// 选择套餐
function selectPackage() {
  if (thePackage.value === 0) {
    ruleFormRef.value?.resetFields()
    return
  }
  ruleFormRef.value?.clearValidate(['tprice', 'tdays'])
  const selectedPackageItem = packages.value.find(
    (item: any) => item.id === thePackage.value
  )
  // 检查选中的套餐对象是否存在
  if (selectedPackageItem) {
    const { tdays, tprice } = selectedPackageItem
    form.value.tdays = tdays
    form.value.tprice = tprice
  }
}
function confirmOrder() {
  ruleFormRef.value?.validate((valid, filed) => {
    if (valid) {
      // secondVisible.value = true
      onComputed()
    } else {
      // 表单验证未通过
      console.log('filed', filed)
    }
  })
}
// 计算
const jisuanData = ref<any>()
async function onComputed() {
  const res: any = await buyGame({
    game_id: buyID.value,
    tdays: form.value.tdays,
    tprice: form.value.tprice,
    code: form.value.code,
    is_jisuan: 1
  })
  jisuanData.value = res.data
  if (res.code === 200) {
    secondVisible.value = true
  }
}
// 弹出框确定
async function confirm() {
  const res: any = await buyGame({
    game_id: buyID.value,
    tdays: form.value.tdays,
    tprice: form.value.tprice,
    code: form.value.code
  })
  if (res.code === 200) {
    ElMessage.success('购买成功')
    buyVisible.value = false
    secondVisible.value = false
    updateMyGame()
    query()
  }
}
const progress_test = ref<any>(0)
window.api.downloadProgress((progress) => {
  progress_test.value = progress
})
const gameStatus = ref<any>({})
window.api.updateGameStatus((id, status) => {
  gameStatus.value[id] = status
})

// 下载游戏
function downLoadGame() {
  if (detail.value.xiazai_url && detail.value.xiazai_url.indexOf('zip') >= 0) {
    window.api.download(detail.value.game_id, detail.value.xiazai_url)
  } else {
    ElMessage.error('暂无游戏地址')
  }
}
const gamePath = ref<any>({})

window.api.launchGame((id, path) => {
  gamePath.value[id] = path
})
// 启动游戏
function launchGame() {
  window.api.startGame(buyID.value)
  // if (gameStatus.value[buyID.value] == 'noexist') {
  //   ElMessage.warning('未找到游戏入口文件main.exe 启动失败')
  // }
  // window.api.startGameReply(buyID.value)
}
window.api.startGameFailReply(() => {
  ElMessage.error('未找到游戏入口文件main.exe 启动失败')
})
// 下载中不允许关闭对话框
const isdownloading = computed(() => {
  if (gameStatus.value[buyID.value] == 'downloading') {
    return false
  } else {
    return true
  }
})
onMounted(async () => {
  updateMyGame()
  query()
  await globalStore.setCategory()
  categories.value = globalStore.category
})
// 格式化时间
function formatTime(time: any) {
  return useDateFormat(time * 1000, 'YYYY-MM-DD HH:mm:ss')
}
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
// 详情-弹出框
.detail {
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
        display: flex;
        align-items: center;
        .el-button {
          width: 100px;
        }
      }
    }
  }
  .detail-info {
    padding-left: 10px;
    display: flex;
    flex-direction: column;
    h3 {
      // color: #000;
      height: 40px;
    }
    .info-item {
      height: 80px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      span:first-child {
        margin-right: 20px;
      }
    }
  }
  .package {
    margin-bottom: 20px;
    width: 100%;
    .package-content {
      display: flex;
      flex-wrap: wrap;
      .package-card {
        width: 170px;
        height: 80px;
        margin: 0 20px 20px 0;
        // border: 2px solid #caa3a3;
        border-radius: 10px;
        display: flex;
        // background: #dcdfe6;
        // background: #f56c6c;
        border: 2px solid #79bbff;
        .card-left {
          width: 50px;
          height: 100%;
          border-right: 2px solid #79bbff;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .card-right {
          padding: 10px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          // align-items: center;
        }
      }
    }
  }
}
</style>
