<template>
  <div class="container">
    <div class="title" @click="onRefresh">
      <h1>库</h1>
      <el-tooltip
        placement="top"
        effect="light"
        :show-arrow="false"
        :offset="-5"
      >
        <span class="refresh">
          <el-icon
            class="refresh-icon"
            :style="{ transform: `rotate(${rotation}deg)` }"
            ><Refresh
          /></el-icon>
        </span>
        <template #content>
          <div
            style="
              width: 60px;
              height: 30px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 14px;
            "
          >
            刷新库
          </div>
        </template>
      </el-tooltip>
    </div>
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
    </div>
    <!-- list样式 -->
    <div v-loading="loading" class="list">
      <div
        v-for="(item, index) in tableData"
        :key="index"
        class="list-item"
        @click="viewDetail(item)"
      >
        <div class="img-box">
          <el-image
            class="img"
            :src="item.icon.includes('http') ? item.icon : 'danzhu.jpg'"
          ></el-image>
        </div>
        <div class="item-title">
          <span>{{ item.title }}</span>
        </div>
      </div>
    </div>
    <!-- table样式 -->
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
  <el-dialog v-model="detailVisible" :title="game_name" width="945" top="10vh">
    <div class="detail">
      <div
        class="detail-head"
        :style="{
          backgroundImage:
            'linear-gradient(to right, rgba(51, 54, 58, 1) 0%, rgba(51, 54, 58, 1) 40%, rgba(51, 54, 58, 0) 70%), url(' +
            (detail.icon.includes('http') ? detail.icon : '/danzhu.jpg') +
            ')',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right'
        }"
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
              v-if="gameStatus[detail.game_id] == 'unzipped'"
              size="large"
              type="success"
              :disabled="is_start_live"
              @click="onDanmuBtn"
              >连接弹幕</el-button
            >
            <el-button
              v-if="
                gameStatus[detail.game_id] == 'purchased' ||
                gameStatus[detail.game_id] == 'update'
              "
              :type="
                gameStatus[detail.game_id] == 'purchased'
                  ? 'primary'
                  : 'warning'
              "
              size="large"
              @click="downLoadGame"
              >{{
                gameStatus[detail.game_id] == 'purchased'
                  ? '下载游戏'
                  : '更新游戏'
              }}</el-button
            >
            <el-button
              v-else-if="gameStatus[detail.game_id] == 'unzipped'"
              size="large"
              type="danger"
              :disabled="is_start"
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
            <el-link
              style="margin-left: 12px"
              target="_bank"
              :href="detail.doc_url"
              :underline="false"
            >
              <el-button size="large" type="primary">使用指南</el-button>
            </el-link>
            <el-button
              style="margin-left: 12px"
              type="warning"
              size="large"
              :disabled="!detail.kefu"
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
            <div class="card-left">{{ JSON.parse(item.content).ttitle }}</div>
            <div class="card-right">
              <div>
                <span>天数：</span
                ><span>{{ JSON.parse(item.content).tdays }}</span>
              </div>
              <div>
                <span>价格：</span
                ><span>{{ JSON.parse(item.content).tprice }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 详细信息 -->
      <div class="detail-info">
        <h3>详细信息</h3>
        <div class="info-item">
          <div class="the-info-item">
            <span>开播限制:</span
            ><span>{{
              detail.min_price != '0.00' ? detail.min_price : '无'
            }}</span>
            <span v-if="detail.min_price != '0.00'" style="margin-left: 5px"
              >钻石</span
            >
          </div>
          <div class="the-info-item">
            <span>分成比例:</span>
            <span>每收到 100 礼物扣除 {{ computedDiamond() }} 钻石 </span>
            <el-tooltip
              effect="dark"
              :offset="10"
              :show-arrow="true"
              placement="right"
            >
              <template #content>
                分成比例：
                <span v-if="detail.jisuan_bl.bl_gonghui !== 0">
                  {{ detail.jisuan_bl.bl_gonghui }}%
                </span>
                <span> + </span>
                <span v-if="detail.jisuan_bl.bl_pingtai !== 0">
                  {{ detail.jisuan_bl.bl_pingtai }}%
                </span>
                <span> + </span>
                <span v-if="detail.jisuan_bl.bl_youxizuozhe !== 0">
                  {{ detail.jisuan_bl.bl_youxizuozhe }}%
                </span>
                <span> = </span>
                <span>
                  {{
                    detail.jisuan_bl.bl_gonghui +
                    detail.jisuan_bl.bl_pingtai +
                    detail.jisuan_bl.bl_youxizuozhe
                  }}%
                </span>
              </template>
              <span style="margin-left: 10px; position: relative; top: 1px"
                ><el-icon><QuestionFilled /></el-icon
              ></span>
            </el-tooltip>
          </div>
          <div class="the-info-item">
            <span>更新时间:</span><span>{{ formatTime(detail.uptime) }}</span>
          </div>
          <div class="the-info-item">
            <span>玩法分区:</span>
            <el-tag
              v-for="(item, index) in getCategoriesTitle(detail.game_cate_id)"
              :key="index"
              style="margin-right: 10px"
              >{{ item }}</el-tag
            >
          </div>
          <div class="the-info-item">
            <span>支持语言:</span>
            <el-tag
              v-for="(item, index) in getLanguageTitle(detail.game_lang_id)"
              :key="index"
              style="margin-right: 10px"
              >{{ item }}</el-tag
            >
          </div>
          <div class="the-info-item">
            <span>支持平台:</span>
            <el-tag
              v-for="(item, index) in getPlatformsTitle(detail.game_pingtai_id)"
              :key="index"
              style="margin-right: 10px"
              >{{ item }}</el-tag
            >
          </div>
          <div class="the-info-item">
            <span>电脑配置:</span>
            <span>{{ detail.xitong_yaoqiu }}</span>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
  <!-- 连接弹幕 -->
  <el-dialog v-model="barrageVisible" title="连接弹幕" width="30%">
    <el-form>
      <el-form-item label="直播间">
        <el-input v-model="liveRoom"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="barrageVisible = false">取消</el-button>
      <el-button type="primary" @click="connectLive">确定</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useDebounceFn, useTimestamp } from '@vueuse/core'
import { Refresh, ArrowDown } from '@element-plus/icons-vue'
import { QuestionFilled } from '@element-plus/icons-vue'
import Moment from 'moment'
// import { useRouter } from 'vue-router'
import { getMyGameList } from '../../api/mine'
import { useGlobalStore } from '../../store/globalStore'
import { ElMessage } from 'element-plus'
import { getGameUse } from '../../api/rc4'
import { gameInfo } from '../../api/game'
import { useStateStore } from '../../store/state'

const timestamp = useTimestamp()
const stateStore = useStateStore()
const gameStatus = ref<any>({})
const globalStore = useGlobalStore()
const queryForm = ref<any>({})
const languages = ref<any>([]) // 获取语言
const platforms = ref<any>([]) // 获取平台
const categories = ref<any>([]) // 获取分类
const ratio = ref<any>() // 分成比例
const tableData = ref<any>([])
const loading = ref<boolean>(false)
const barrageVisible = ref<boolean>(false)
const liveRoom = ref<string>('')

// 分页相关
const currentPage = ref<number>(1) // 当前页
const pageSize = ref<number>(12) // 每页显示条数
const totalItems = ref<number>(0) // 总数据条数
const detailVisible = ref<boolean>(false) // 详情
function computedDiamond() {
  const res =
    100 *
    0.1 *
    ratio.value *
    ((detail.value.jisuan_bl.bl_gonghui +
      detail.value.jisuan_bl.bl_pingtai +
      detail.value.jisuan_bl.bl_youxizuozhe) /
      100)
  return res
}

const getLanguageTitle = (game_lang_id: any) => {
  const ids = game_lang_id.split(',').map(Number)
  const titles = ids.map((id: any) => {
    const language = languages.value.find((item: any) => item.id === id)
    return language ? language.title : '未知'
  })
  return titles
}
const getCategoriesTitle = (game_cate_id: any) => {
  const ids = game_cate_id.split(',').map(Number)
  const titles = ids.map((id: any) => {
    const category = categories.value.find((item: any) => item.id === id)
    return category ? category.title : '未知'
  })
  return titles
}
const getPlatformsTitle = (game_pingtai_id: any) => {
  const ids = game_pingtai_id.split(',').map(Number)
  const titles = ids.map((id: any) => {
    const platform = platforms.value.find((item: any) => item.id === id)
    return platform ? platform.title : '未知'
  })
  return titles
}
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
    tableData.value = response?.data?.list.filter((item: any) => {
      return item.end_time !== null && item.end_time >= timestamp.value / 1000
    })
    totalItems.value = response?.data?.count
    loading.value = false
    tableData.value.map((item) => {
      return (gameStatus.value[item.game_id] = 'purchased')
    })
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

// 换页
const is_drop = ref<boolean>(false)
function iconChange(e: boolean) {
  is_drop.value = e
}
const buyID = ref<any>()
const game_name = ref<any>()
const detail = ref<any>()
// 打开详情
async function viewDetail(item: any) {
  const res: any = await gameInfo({ id: item.game_id })
  detail.value = res.data.info
  detailVisible.value = true
  buyID.value = item.game_id
  game_name.value = item.title
  gameStatus.value[buyID.value] = 'purchased'
  window.api.checkGame(item.mg_game_id, item.xiazai_url)
  // console.log(gameStatus.value)
}
window.api.updateGameStatus((id, status) => {
  gameStatus.value[id] = status
})
const progress_test = ref<any>(0)
window.api.downloadProgress((progress) => {
  progress_test.value = progress
})
// 下载游戏
function downLoadGame() {
  if (detail.value.xiazai_url) {
    window.api.download(detail.value.mg_game_id, detail.value.xiazai_url)
  } else {
    ElMessage.error('暂无游戏地址')
  }
}
function areLastThreeEqual(strArray: string[]) {
  if (strArray.length < 3) {
    return false
  }
  const lastThree = strArray.slice(-3)
  return new Set(lastThree).size === 1
}
const intervalId = ref<any>()
const is_start = ref<boolean>(false) // 是否启动游戏
const is_start_live = ref<boolean>(false) // 是否启动直播间
const start_id = ref<any>() // 启动游戏id
const salts = reactive<string[]>([])
// 启动游戏
async function launchGame() {
  if (!is_start.value) {
    window.api.removeAllListeners()
    const res: any = await getGameUse({ game_id: buyID.value })
    // console.log('res', res)
    if (res.data.status === 'yes') {
      // if (liveRoom.value) {
      //   window.api.startLive(liveRoom.value)
      // }
      salts.push(res.salt)
      console.log('salts', salts)
      window.api.startGame(
        buyID.value,
        localStorage.getItem('lang'),
        detail.value.v_main,
        detail.value.miyaostr,
        detail.value.is_jiami
      )
      is_start.value = true
      start_id.value = buyID.value
      window.api.startGameFailReply(() => {
        is_start.value = false
        start_id.value = ''
        return ElMessage.error(
          `未找到游戏入口文件${detail.value.v_main} 启动失败`
        )
      })
    }
    intervalId.value = setInterval(
      async () => {
        const res: any = await getGameUse({ game_id: buyID.value })
        if (res.code !== 200) {
          // 弹幕礼物失效 链接弹幕
          return console.log('code !== 200')
        }
        if (res.data.status === 'no') {
          return console.log('status == no')
        }
        salts.push(res.salt)
        const result = areLastThreeEqual(salts)
        if (!result) {
          //
        }
      },
      2 * 60 * 1000
    )
  } else {
    ElMessage.error('请先关闭已打开的游戏')
  }
}
window.api.mainCloseGame(() => {
  is_start.value = false
  clearInterval(intervalId.value)
  stateStore.setState({ success: '', message: '' })
})
// // 下载中不允许关闭对话框
// const isdownloading = computed(() => {
//   if (gameStatus.value[buyID.value] == 'downloading') {
//     return false
//   } else {
//     return true
//   }
// })
const is_barrage = ref<boolean>(false) // true打开 false关闭
function onDanmuBtn() {
  barrageVisible.value = true
  if (localStorage.getItem('liveUrl')) {
    liveRoom.value = localStorage.getItem('liveUrl') + ''
  }
}
// 连接弹幕
function connectLive() {
  if (is_barrage.value) {
    return ElMessage.error('清先关闭已打开的直播间')
  }
  // barrageVisible.value = true
  // 如果已打开游戏
  if (is_start.value) {
    if (!liveRoom.value) {
      return ElMessage.error('请填写直播间地址')
    }
    if (start_id.value != buyID.value) {
      return ElMessage.error('请连接已打开游戏的直播间弹幕')
    }
    is_barrage.value = true
    window.api.startLive(liveRoom.value)
    localStorage.setItem('liveUrl', liveRoom.value)
    is_start_live.value = true
    barrageVisible.value = false
    return
  } else {
    is_barrage.value = true
    window.api.startLive(liveRoom.value)
    localStorage.setItem('liveUrl', liveRoom.value)
    is_start_live.value = true
    barrageVisible.value = false
    return
  }
}
window.api.mainCloseLive(() => {
  is_start_live.value = false
  is_barrage.value = false
})
onMounted(async () => {
  query()
  await globalStore.setLanguage()
  await globalStore.setCategory()
  await globalStore.setPlatform()
  await globalStore.getRatio()
  languages.value = globalStore.language
  categories.value = globalStore.category
  platforms.value = globalStore.platform
  ratio.value = globalStore.ratio
})
// 格式化时间
function formatTime(time: any) {
  return time ? Moment(time * 1000).format('YYYY-MM-DD HH:mm:ss') : '-'
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
    grid-template-columns: 25% 25% 25% 25%;
    .list-item {
      height: 270px;
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
      transition: all 1s linear;
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
    .img-box {
      width: 100%;
      aspect-ratio: 547/260;
      border-radius: 4px;
      margin-bottom: 10px;
      overflow: hidden;
    }
    // .img {
    //   border-radius: 4px;
    //   margin-bottom: 10px;
    // }
    .item-title {
      display: flex;
      justify-content: space-between;
      // span:last-child {
      //   width: 32px;
      //   height: 22px;
      //   border-radius: 4px;
      //   display: flex;
      //   align-items: center;
      //   justify-content: center;
      //   transition: background 0.3s linear;
      // }
      // span:last-child:hover {
      //   background: #373737;
      // }
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
.el-popper {
  border: none;
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
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .the-info-item {
        margin-bottom: 15px;
      }
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
        border-radius: 10px;
        display: flex;
        background-color: #396ea3;
        box-shadow: 8px 8px 0px rgba(140, 154, 216, 0.1);
        // border: 2px solid #79bbff;
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
