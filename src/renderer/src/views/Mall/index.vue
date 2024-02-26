<template>
  <div class="container">
    <div style="display: flex; justify-content: space-between">
      <el-form :form="queryForm" inline>
        <el-form-item :label="$t('search.name')">
          <el-input
            v-model="queryForm.title"
            style="width: 200px"
            :placeholder="$t('search.name_placeholder')"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('search.sort')">
          <el-select
            v-model="queryForm.sort"
            style="width: 200px"
            clearable
            :placeholder="$t('search.sort_placeholder')"
          >
            <el-option value="2" :label="$t('search.sort_ctime_up')" />
            <el-option value="1" :label="$t('search.sort_ctime_down')" />
            <el-option value="4" :label="$t('search.sort_hot_up')" />
            <el-option value="3" :label="$t('search.sort_hot_down')" />
            <el-option value="6" :label="$t('search.sort_banner_up')" />
            <el-option value="5" :label="$t('search.sort_banner_down')" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('search.cate')">
          <el-select
            v-model="queryForm.cate"
            style="width: 200px"
            clearable
            :placeholder="$t('search.cate_placeholder')"
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
          <el-button type="primary" @click="query">{{
            $t('buttons.search')
          }}</el-button>
          <el-button @click="viewAll">{{ $t('buttons.all') }}</el-button>
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
        v-for="(item, index) in tableData"
        :key="index"
        class="list-item"
        @click="openDetail(item)"
      >
        <!-- @click="openDetail(item)" -->
        <!-- v-if="hasPurchasedGame(item.game_id)" -->
        <el-tag
          v-if="gameStatus[item.game_id] !== 'nopurchased'"
          class="tag"
          effect="dark"
          :type="
            gameStatus[item.game_id] !== 'nopurchased'
              ? gameStatus[item.game_id] === 'expire'
                ? 'danger'
                : 'success'
              : ''
          "
          >{{
            gameStatus[item.game_id] !== 'nopurchased'
              ? gameStatus[item.game_id] === 'expire'
                ? $t('detail.expired')
                : $t('detail.purchased')
              : ''
          }}</el-tag
        >
        <div class="img-box">
          <el-image
            class="img"
            :src="item.icon?.includes('http') ? item.icon : 'danzhu.jpg'"
          ></el-image>
        </div>
        <div class="item-title">
          <span>{{ item.title }}</span>
        </div>
        <div class="item-price">
          <div v-if="item.price">
            <span class="price_1">{{ item.price }}</span>
            <span class="price_2">{{ item.cuxiao_price }}</span>
          </div>
          <div v-else>{{ $t('detail.free') }}</div>
        </div>
        <div class="item-percent">
          {{ $t('detail.divide') }}：{{ item.divide }}%
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
  <!-- 详情 -->
  <el-dialog v-model="detailVisible" :title="game_name" width="945" top="10vh">
    <div class="detail">
      <div
        class="detail-head"
        :style="{
          backgroundImage:
            'linear-gradient(to right, rgba(51, 54, 58, 1) 0%, rgba(51, 54, 58, 1) 40%, rgba(51, 54, 58, 0) 70%), url(' +
            (detail.icon?.includes('http') ? detail.icon : '/danzhu.jpg') +
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
              v-if="
                gameStatus[detail.game_id] == 'nopurchased' ||
                gameStatus[detail.game_id] == 'expire'
              "
              size="large"
              type="success"
              @click="onbuyGame"
              >{{ $t('buttons.buy') }}</el-button
            >
            <el-button
              v-else-if="
                gameStatus[detail.game_id] == 'purchased' ||
                gameStatus[detail.game_id] == 'update'
              "
              size="large"
              :type="
                gameStatus[detail.game_id] == 'purchased'
                  ? 'primary'
                  : 'warning'
              "
              @click="downLoadGame"
              >{{
                gameStatus[detail.game_id] == 'purchased'
                  ? $t('buttons.download')
                  : $t('buttons.update')
              }}</el-button
            >
            <el-button
              v-else-if="gameStatus[detail.game_id] == 'unzipped'"
              size="large"
              type="danger"
              :disabled="is_start"
              @click="launchGame"
              >{{ $t('buttons.start') }}</el-button
            >
            <el-button
              v-if="gameStatus[detail.game_id] == 'unzipped'"
              size="large"
              type="success"
              :disabled="is_start_live"
              @click="onDanmuBtn"
              >{{ $t('buttons.connect') }}</el-button
            >
            <div
              v-else-if="gameStatus[detail.game_id] == 'downloading'"
              style="
                width: 100px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 12px 0 0;
              "
            >
              {{ $t('buttons.downloading') }}
              {{
                isNaN(progress_test[detail.game_id])
                  ? '0%'
                  : `${Math.floor(+progress_test[detail.game_id])}%`
              }}
            </div>
            <div
              v-else-if="gameStatus[detail.game_id] == 'unzipping'"
              style="
                width: 100px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 12px 0 0;
              "
            >
              <!-- 解压中 -->
              {{ $t('buttons.installing') }}
            </div>
            <el-link
              style="margin-left: 12px"
              target="_bank"
              :href="detail.doc_url"
              :underline="false"
            >
              <el-button size="large" type="primary">{{
                $t('buttons.document')
              }}</el-button>
            </el-link>
            <el-button
              style="margin-left: 12px"
              type="warning"
              size="large"
              :disabled="!detail.kefu"
              >{{ $t('buttons.service') }}</el-button
            >
          </div>
        </div>
      </div>
      <!-- 套餐 -->
      <div class="detail-info package">
        <h3>{{ $t('detail.package') }}</h3>
        <div class="package-content">
          <div
            v-for="(item, index) in detail.taocan"
            :key="index"
            class="package-card"
          >
            <div class="card-left">{{ JSON.parse(item.content).ttitle }}</div>
            <div class="card-right">
              <div>
                <span>{{ $t('detail.days') }}：</span
                ><span>{{ JSON.parse(item.content).tdays }}</span>
              </div>
              <div>
                <span>{{ $t('detail.price') }}：</span
                ><span>{{ JSON.parse(item.content).tprice }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 详细信息 -->
      <div class="detail-info">
        <h3>{{ $t('detail.info') }}</h3>
        <div class="info-item">
          <div class="the-info-item">
            <span>{{ $t('detail.limit') }}:</span
            ><span>{{
              detail.min_price != '0.00'
                ? detail.min_price
                : $t('system.without')
            }}</span>
            <span v-if="detail.min_price != '0.00'" style="margin-left: 5px">{{
              $t('system.diamond')
            }}</span>
          </div>
          <div class="the-info-item">
            <span>{{ $t('detail.divide') }}:</span>
            <span
              >{{ $t('detail.divide_every') }} 100
              {{ $t('detail.divide_gifts') }} {{ computedDiamond() }}
              {{ $t('detail.divide_diamonds') }}
            </span>
            <!-- <span>{{ detail.divide }}</span> -->
            <el-tooltip
              effect="dark"
              :offset="10"
              :show-arrow="true"
              placement="right"
            >
              <template #content>
                {{ $t('detail.divide') }}：
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
            <span>{{ $t('detail.utime') }}:</span
            ><span>{{ formatTime(detail.uptime) }}</span>
          </div>
          <div class="the-info-item">
            <span>{{ $t('detail.partition') }}:</span>
            <el-tag
              v-for="(item, index) in getCategoriesTitle(detail.game_cate_id)"
              :key="index"
              style="margin-right: 10px"
              >{{ item }}</el-tag
            >
          </div>
          <div class="the-info-item">
            <span>{{ $t('detail.lang') }}:</span>
            <el-tag
              v-for="(item, index) in getLanguageTitle(detail.game_lang_id)"
              :key="index"
              style="margin-right: 10px"
              >{{ item }}</el-tag
            >
          </div>
          <div class="the-info-item">
            <span>{{ $t('detail.platform') }}:</span>
            <el-tag
              v-for="(item, index) in getPlatformsTitle(detail.game_pingtai_id)"
              :key="index"
              style="margin-right: 10px"
              >{{ item }}</el-tag
            >
          </div>
          <div class="the-info-item">
            <span>{{ $t('detail.config') }}:</span>
            <span>{{ detail.xitong_yaoqiu }}</span>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
  <!-- 购买 -->
  <el-dialog v-model="buyVisible" width="30%">
    <template #header>
      <div>
        <span style="margin-right: 20px">{{ $t('detail.buy') }}</span>
        <el-tag size="large">{{ game_name }}</el-tag>
      </div>
    </template>
    <div>
      <el-form ref="ruleFormRef" :model="form" label-width="150px">
        <el-form-item :label="$t('detail.package')">
          <el-select v-model="thePackage" @change="selectPackage">
            <!-- <el-option label="自定义" :value="0"></el-option> -->
            <el-option
              v-for="item in packages"
              :key="item.id"
              :label="`${item.ttitle}(${item.tdays}${$t('system.day')}，${item.tprice}${$t('system.price')})`"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="天数">
          <el-input
            v-model="form.tdays"
            type="number"
            disabled
            placeholder="请输入天数"
          ></el-input>
        </el-form-item>
        <el-form-item label="价格">
          <el-input
            v-model="form.tprice"
            type="number"
            disabled
            placeholder="请输入价格"
          ></el-input>
        </el-form-item> -->
        <el-form-item :label="$t('detail.code')">
          <el-input
            v-model="form.code"
            :placeholder="$t('detail.code_placeholder')"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="buyVisible = false">{{
          $t('buttons.cancel')
        }}</el-button>
        <el-button type="primary" @click="confirmOrder">{{
          $t('buttons.confirm')
        }}</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 确认购买 -->
  <el-dialog v-model="secondVisible" :title="$t('detail.order')" width="30%">
    <div>
      <span>{{ $t('detail.days') }}：{{ jisuanData?.days }}</span>
    </div>
    <div>
      <span>{{ $t('detail.price') }}：{{ jisuanData?.price }}</span>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="secondVisible = false">{{
          $t('buttons.cancel')
        }}</el-button>
        <el-button type="primary" @click="confirm">{{
          $t('detail.buy')
        }}</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 连接弹幕 -->
  <el-dialog
    v-model="barrageVisible"
    :title="$t('buttons.connect')"
    width="30%"
  >
    <el-form>
      <el-form-item :label="$t('detail.live')">
        <el-input
          v-model="liveRoom"
          :placeholder="$t('detail.live_placeholder')"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="barrageVisible = false">{{
        $t('buttons.cancel')
      }}</el-button>
      <el-button type="primary" @click="connectLive">{{
        $t('buttons.confirm')
      }}</el-button>
    </template>
  </el-dialog>
  <!-- <GameDetail
    :id="gameId"
    :page="mall"
    :visible="gameDetailVisible"
    @close="closeDetailDialog"
  ></GameDetail> -->
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch, watchEffect } from 'vue'
import { QuestionFilled, Refresh, ArrowDown } from '@element-plus/icons-vue'
import { useDebounceFn, useTimestamp } from '@vueuse/core'
// import GameDetail from '../Detail/index.vue'
import Moment from 'moment'
// import TheSwiper from '../../components/TheSwiper/index.vue'
// import TheSwiperCards from '../../components/TheSwiperCards/index.vue'
import { buyGame, gameInfo, getGameList } from '../../api/game'
import { useGlobalStore } from '../../store/globalStore'
import { ElMessage, FormInstance } from 'element-plus'

import {
  // deductDiamond,
  // endLiving,
  getGameUse
  // getLivePing,
  // startLiving
} from '../../api/rc4'
import { useStateStore } from '../../store/state'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

// const gameDetailVisible = ref<boolean>(false)
// const gameId = ref<any>()
// function openGameDetail(item: any) {
//   gameId.value = item.game_id
//   gameDetailVisible.value = true
// }
// function closeDetailDialog() {
//   gameDetailVisible.value = false
// }
const timestamp = useTimestamp()
const stateStore = useStateStore()
const globalStore = useGlobalStore()
const queryForm = ref<any>({})
const languages = ref<any>([]) // 获取语言
const platforms = ref<any>([]) // 获取平台
const categories = ref<any>([]) // 获取分类
const tableData = ref<any>([]) // 所有数据
const is_drop = ref<boolean>(false) // 换每页条数的箭头变化
const loading = ref<boolean>(false) // 加载
const currentPage = ref<number>(1) // 当前页
const pageSize = ref<number>(12) // 每页显示条数
const totalItems = ref<number>(0) // 总数据条数
const detailVisible = ref<boolean>(false)
const buyID = ref<any>()
const taocanID = ref<number>() // 购买时所用套餐id
const game_name = ref<any>()
const detail = ref<any>()
const buyVisible = ref<boolean>(false)
const secondVisible = ref<boolean>(false)
const barrageVisible = ref<boolean>(false)
const liveRoom = ref<string>('')
const ruleFormRef = ref<FormInstance>()
const ratio = ref<any>()
/**
 * 刷新icon
 */
const rotation = ref<number>(0)
function debounceOnRefresh() {
  rotation.value -= 180
  viewAll()
}
const onRefresh = useDebounceFn(debounceOnRefresh, 300)
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
// 套餐
const thePackage = ref<number>()
const packages = computed(() => {
  const item =
    tableData.value.find((game: any) => game.game_id === buyID.value) || {}
  return item.taocan?.map((item: any, index: number) => {
    return Object.assign({}, JSON.parse(item.content), {
      id: index,
      game_id: item.game_id,
      taocan_id: item.taocan_id
    })
  })
})
const getLanguageTitle = (game_lang_id: any) => {
  const ids = game_lang_id.split(',')?.map(Number)
  const titles = ids?.map((id: any) => {
    const language = languages.value.find((item: any) => item.id === id)
    return language ? language.title : t('detail.unknown')
  })
  return titles
}
const getCategoriesTitle = (game_cate_id: any) => {
  const ids = game_cate_id.split(',')?.map(Number)
  const titles = ids?.map((id: any) => {
    const category = categories.value.find((item: any) => item.id === id)
    return category ? category.title : t('detail.unknown')
  })
  return titles
}
const getPlatformsTitle = (game_pingtai_id: any) => {
  const ids = game_pingtai_id.split(',')?.map(Number)
  const titles = ids?.map((id: any) => {
    const platform = platforms.value.find((item: any) => item.id === id)
    return platform ? platform.title : t('detail.unknown')
  })
  return titles
}
function onbuyGame() {
  buyVisible.value = true
  thePackage.value = packages.value[0]?.id
}
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
    // console.log('now', timestamp.value / 1000)
    tableData.value?.map((item: any) => {
      if (item.game_buy_end_time === null) {
        return (gameStatus.value[item.game_id] = 'nopurchased')
      } else if (item.game_buy_end_time >= timestamp.value / 1000) {
        return (gameStatus.value[item.game_id] = 'purchased')
      } else if (
        item.game_buy_end_time > 0 &&
        item.game_buy_end_time < timestamp.value
      ) {
        return (gameStatus.value[item.game_id] = 'expire')
      }
      return
    })
    loading.value = false
  } catch (error) {
    console.error('Error fetching data: ', error)
  }
}

function iconChange(e: boolean) {
  is_drop.value = e
}
// 检查是否已购买游戏
// function checkBuyGame(id) {
//   if (gameStatus.value[id] !== 'nopurchased') {
//     return true
//   }
//   return false
// }

// // 更新我的游戏
// async function updateMyGame() {
//   const res = await getMyGameList({})
//   my_game.value = res.data.list.map((item: any) => item.mg_game_id)
// }
// 打开详情
async function openDetail(item: any) {
  const res: any = await gameInfo({ id: item.game_id })
  detail.value = res?.data?.info
  detailVisible.value = true
  buyID.value = item.game_id
  game_name.value = item.title
  // 如果这个游戏已购买，检查游戏是否存在
  if (gameStatus.value[buyID.value] === 'purchased') {
    window.api.checkGame(item.game_id, item.xiazai_url)
  }
}
// 更改安装路径后重置游戏状态
window.api.initGameStatus(() => {
  gameStatus.value = {}
  query()
})

// 选择套餐
function selectPackage() {
  ruleFormRef.value?.clearValidate(['tprice', 'tdays'])
  const selectedPackageItem = packages.value.find(
    (item: any) => item.id === thePackage.value
  )
  taocanID.value = selectedPackageItem.taocan_id
  // 检查选中的套餐对象是否存在
  if (selectedPackageItem) {
    const { tdays, tprice } = selectedPackageItem
    form.value.tdays = tdays
    form.value.tprice = tprice
  }
}
function confirmOrder() {
  onComputed()
}
// 计算
const jisuanData = ref<any>()
async function onComputed() {
  const res: any = await buyGame({
    game_id: buyID.value,
    taocan_id: taocanID.value,
    // tdays: form.value.tdays,
    // tprice: form.value.tprice,
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
    taocan_id: taocanID.value,
    code: form.value.code
  })
  if (res.code === 200) {
    ElMessage.success(t('detail.message_success_buy'))
    buyVisible.value = false
    secondVisible.value = false
    detailVisible.value = false
    query()
    // openDetail(detail.value)
    // 检测是否存在游戏
    // window.api.checkGame(detail.value.game_id, detail.value.xiazai_url)
    // console.log(gameStatus.value[detail.value.game_id])
    // updateMyGame()
    // gameStatus.value[buyID.value] = 'purchased'
  }
}
// 以对象的形式保存下载进度 {id:progress, id1:progress1}
const progress_test = reactive<any>({})
window.api.downloadProgress((obj) => {
  progress_test[obj.id] = obj.progress ? obj.progress : 0
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
const pingInterval = ref<any>(null)
// const live_id = ref<any>()
const kaibo = ref<boolean>(false) // 是否开播
let salts = reactive<string[]>([])
// 启动游戏
async function launchGame() {
  if (!is_start.value) {
    window.api.removeAllListeners()
    const res: any = await getGameUse({ game_id: buyID.value })
    console.log('res', res)
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
        detail.value.miyaostr
      )
      // window.api.startFloat(res)
      stateStore.setState({ success: 'success', message: '游戏状态正常' })
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
          // 弹幕礼物失效
          return console.log('code !== 200')
        }
        if (res.data.status === 'no') {
          return console.log('status == no')
        }
        salts.push(res.salt)
        const result = areLastThreeEqual(salts) // 3次一样为true
        if (!result) {
          stateStore.setState({ success: 'error', message: '游戏状态正常' })
        } else {
          stateStore.setState({ success: 'error', message: '游戏状态异常' })
        }
        console.log(salts)
      },
      2 * 60 * 1000
      // 5000
    )
  } else {
    ElMessage.error('请先关闭已打开的游戏')
  }
}
const gift_data = ref<any[]>([])
window.api.getGift((res) => {
  gift_data.value.push(res)
  // console.log(gift_data.value)
})
const deductInterval = ref<any>(null)
// watchEffect(() => {
//   // if (kaibo.value && gift_data.value.length >= 1) {
//   if (kaibo.value) {
//     // const gift_num = gift_data.value.length
//     if (!deductInterval.value) {
//       deductInterval.value = setInterval(async () => {
//         let diamond = 0
//         gift_data.value.forEach((item) => {
//           diamond += item.gift_value
//         })
//         // const bili =
//         //   detail.value.jisuan_bl.bl_gonghui +
//         //   detail.value.jisuan_bl.bl_pingtai +
//         //   detail.value.jisuan_bl.bl_youxizuozhe
//         const send_data = {
//           zhibo_id: live_id.value,
//           // jifen: (diamond / 100) * bili * ratio.value
//           jifen: diamond
//         }
//         if (!gift_data.value.length) {
//           // 没有收到礼物就不走扣钻接口
//           return console.log('没有收到礼物就不走扣钻接口')
//         }
//         const res: any = await deductDiamond(send_data)
//         console.log('扣钻res', res)
//         console.log('礼物列表', gift_data.value)
//         const kouDiamond = send_data.jifen
//         // 没有积分或者欠费
//         if (res?.data?.is_do !== 'yes') {
//           theEndLiving() // 下播
//           // window.api.rendererCloseGame() // 关游戏
//           clearInterval(deductInterval.value) // 清除扣钻计时器
//         } else {
//           // 扣除成功
//           if (res.data.jifen - kouDiamond * 3 <= 0) {
//             // window.api.showNotification('提醒', '钻石不足，剩余钻石约可再扣3次')
//           }
//         }
//         gift_data.value = []
//       }, 60 * 1000)
//     }
//   }
// })
// 关闭游戏
window.api.mainCloseGame(() => {
  is_start.value = false
  clearInterval(intervalId.value)
  clearInterval(pingInterval.value)
  clearInterval(deductInterval.value)
  salts = []
  stateStore.setState({ success: '', message: '' })
  kaibo.value = false
  gift_data.value = []
})
// window.api.getAnchorFail(() => {
//   window.api.showNotification('提示', '获取主播信息失败，请重新打开直播间')
// })
// async function sendStartLivingRequest() {
//   try {
//     const send_data = {
//       header_img: anchorInfo.value?.avatar_thumb.url_list[0],
//       zhubo_name: anchorInfo.value?.nickname,
//       zhubo_uid: anchorInfo.value?.sec_uid,
//       game_id: detail.value.game_id
//     }
//     const res: any = await startLiving(send_data)
//     console.log('开播res', res)
//     if (res.code === 200) {
//       kaibo.value = true
//       ElMessage.success('开播')
//       live_id.value = res.data.zhibo_id
//       // 开播成功每分钟发一次ping
//       pingInterval.value = setInterval(async () => {
//         const response: any = await getLivePing({ zhibo_id: live_id.value })
//         console.log('ping-res', response)
//         if (response.code !== 200) {
//           // 结束游戏
//           // window.api.rendererCloseGame()
//         }
//       }, 60 * 1000)
//     }
//   } catch (error) {
//     console.error('发送开播请求时出错：', error)
//   }
// }
const lock = ref<boolean>(true)
watchEffect(async () => {
  if (lock.value) {
    if (is_start.value && gift_data.value.length >= 1) {
      lock.value = false
      // sendStartLivingRequest()
    }
  }
})
// 下播
// async function theEndLiving() {
//   const res: any = await endLiving({ zhibo_id: live_id.value })
//   if (res.code === 200) {
//     // clearInterval(pingInterval.value) // 下播关掉ping
//     // window.api.showNotification('下播', '下播成功')
//     // kaibo.value = false
//     console.log('下播', res)
//   }
// }
watch(
  () => is_start.value,
  (val) => {
    if (!val) {
      // theEndLiving() // 下播
      clearInterval(pingInterval.value)
      clearInterval(intervalId.value)
      clearInterval(deductInterval.value)
      gift_data.value = []
      lock.value = true
    }
  }
)
watch(
  () => buyVisible.value,
  () => {
    // thePackage.value = undefined
    // thePackage.value = packages.value[0]?.id
    taocanID.value = packages.value[0]?.taocan_id
    form.value = {
      tdays: packages.value[0]?.tdays,
      tprice: packages.value[0]?.tprice,
      code: ''
    }
  }
)
const is_barrage = ref<boolean>(false) // true打开 false关闭
function onDanmuBtn() {
  barrageVisible.value = true
  if (localStorage.getItem('liveUrl')) {
    liveRoom.value = localStorage.getItem('liveUrl') + ''
  }
}
// 检查字符串没有@也没有http
// 连接弹幕
async function connectLive() {
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
    if (liveRoom.value.includes('@') && liveRoom.value.includes('http')) {
      window.api.startLive(liveRoom.value)
      localStorage.setItem('liveUrl', liveRoom.value)
    }
    if (liveRoom.value.includes('@') && !liveRoom.value.includes('http')) {
      window.api.startLive(`https://www.tiktok.com/${liveRoom.value}/live`)
      localStorage.setItem(
        'liveUrl',
        `https://www.tiktok.com/${liveRoom.value}/live`
      )
    }
    if (!liveRoom.value.includes('@') && !liveRoom.value.includes('http')) {
      window.api.startLive(`https://www.tiktok.com/@${liveRoom.value}/live`)
      localStorage.setItem(
        'liveUrl',
        `https://www.tiktok.com/@${liveRoom.value}/live`
      )
    }
    is_barrage.value = true
    is_start_live.value = true
    barrageVisible.value = false
    return
  } else {
    is_barrage.value = true
    if (liveRoom.value.includes('@') && liveRoom.value.includes('http')) {
      window.api.startLive(liveRoom.value)
      localStorage.setItem('liveUrl', liveRoom.value)
    }
    if (liveRoom.value.includes('@') && !liveRoom.value.includes('http')) {
      window.api.startLive(`https://www.tiktok.com/${liveRoom.value}/live`)
      localStorage.setItem(
        'liveUrl',
        `https://www.tiktok.com/${liveRoom.value}/live`
      )
    }
    if (!liveRoom.value.includes('@') && !liveRoom.value.includes('http')) {
      window.api.startLive(`https://www.tiktok.com/@${liveRoom.value}/live`)
      localStorage.setItem(
        'liveUrl',
        `https://www.tiktok.com/@${liveRoom.value}/live`
      )
    }
    // window.api.startLive(liveRoom.value)
    // localStorage.setItem('liveUrl', liveRoom.value)
    is_start_live.value = true
    barrageVisible.value = false
    return
  }
}
// 关闭直播间
window.api.mainCloseLive(() => {
  is_start_live.value = false
  is_barrage.value = false
  gift_data.value = []
  kaibo.value = false
  salts = []
})

const anchorInfo = ref<any>({})
window.api.sendAnchorData((res) => {
  anchorInfo.value = res
  console.log(anchorInfo.value)
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
  margin-top: 20px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  .pagination-view {
    width: 180px;
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
          width: 120px;
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
        }
      }
    }
  }
}
// 刷新
.refresh {
  display: block;
  border-radius: 5px;
  background: #2e2e2e;
  width: 42px;
  height: 42px;
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
