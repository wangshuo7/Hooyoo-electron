<template>
  <div class="container">
    <div class="top">
      <div class="banner">
        <swiper
          class="carousel"
          :loop="true"
          :css-mode="true"
          :mousewheel="true"
          :keyboard="true"
          :pagination="{
            clickable: true
          }"
          :navigation="true"
          :modules="modules"
          :autoplay="{ delay: 5000, disableOnInteraction: false }"
          :allow-touch-move="false"
        >
          <swiper-slide
            v-for="item in bannerData"
            :key="item.banner_id"
            class="slide"
          >
            <a :href="item.tourl" target="_blank" class="banner-a">
              <img :src="item.img" :alt="item.title" />
            </a>
          </swiper-slide>
        </swiper>
      </div>
      <div class="side">
        <div class="side-item" @click="onOpenLiveRecord">
          <span class="icon">
            <el-icon><VideoCamera /></el-icon>
          </span>
          <div class="side-item-title">{{ $t('home.livelog') }}</div>
        </div>
        <div class="side-item" @click="onExchange">
          <span class="icon">
            <el-icon><SwitchFilled /></el-icon>
          </span>
          <div class="side-item-title">{{ $t('home.redeem') }}</div>
        </div>
        <div class="side-item" @click="onOpenManage">
          <span class="icon">
            <el-icon><Compass /></el-icon>
          </span>
          <div class="side-item-title">{{ $t('home.manage') }}</div>
        </div>
      </div>
    </div>
    <div v-if="is_login && oemData.hezigonggao" class="post">
      <!-- <HornSvg></HornSvg> -->
      <Vue3Marquee :pause-on-hover="true">{{
        oemData.hezigonggao
      }}</Vue3Marquee>
    </div>
    <!-- 热门 -->
    <div v-if="remenData.length > 0" class="game" style="margin-bottom: 5px">
      <div class="game-title">
        <div class="title">
          <HotSvg></HotSvg>
          <span>{{ $t('home.hot') }}</span>
        </div>
        <div class="refresh" @click="onRemenRefresh">
          <el-icon
            class="refresh-icon"
            :style="{ transform: `rotate(${remenRotation}deg)` }"
            ><Refresh
          /></el-icon>
        </div>
      </div>
      <el-scrollbar>
        <div class="game-content">
          <div v-loading="remen_loading" class="hot-list">
            <div
              v-for="(item, index) in remenData"
              :key="index"
              class="hot-list-item"
              @click="onGoDetail(item)"
            >
              <div v-if="is_login">
                <el-tag
                  v-if="gameStatus[item?.game_id] !== 'nopurchased'"
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
                <el-tag
                  v-if="item.game_id == start_id"
                  class="pre-tag"
                  effect="dark"
                >
                  {{ $t('system.last_open') }}
                </el-tag>
              </div>
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
                {{ $t('detail.divide') }}：
                <span v-if="!is_login">--</span>
                <span v-else
                  >{{
                    item.jisuan_bl?.bl_gonghui +
                    item.jisuan_bl?.bl_pingtai +
                    item.jisuan_bl?.bl_youxizuozhe
                  }}%</span
                >
              </div>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <!-- 最近 -->
    <div class="game">
      <div class="game-title">
        <div class="title">
          <RecentSvg></RecentSvg>
          <span>{{ $t('home.recent') }}</span>
        </div>
        <div class="refresh" @click="onRefresh">
          <el-icon
            class="refresh-icon"
            :style="{ transform: `rotate(${rotation}deg)` }"
            ><Refresh
          /></el-icon>
        </div>
      </div>
      <div class="game-content">
        <div v-loading="loading" class="list">
          <div
            v-for="(item, index) in tableData"
            :key="index"
            class="list-item"
            @click="onGoDetail(item)"
          >
            <div v-if="is_login">
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
              <el-tag
                v-if="item.game_id == start_id"
                class="pre-tag"
                effect="dark"
              >
                {{ $t('system.last_open') }}
              </el-tag>
            </div>
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
              {{ $t('detail.divide') }}：
              <span v-if="!is_login">--</span>
              <span v-else
                >{{
                  item.jisuan_bl?.bl_gonghui +
                  item.jisuan_bl?.bl_pingtai +
                  item.jisuan_bl?.bl_youxizuozhe
                }}%</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <TheExchange
    :visible="exchangeVisible"
    @close="closeExchangeDialog"
  ></TheExchange>
  <TheLiveRecord
    :visible="liveVisible"
    @close="closeLiveRecordDialog"
  ></TheLiveRecord>
  <TheLogin :visible="loginVisible" @close="closeLoginDialog"></TheLogin>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
// import HornSvg from './svg/horn.vue'
import {
  SwitchFilled,
  Compass,
  VideoCamera,
  Refresh
} from '@element-plus/icons-vue'
import HotSvg from './svg/hot.vue'
import RecentSvg from './svg/recent.vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import {
  Autoplay,
  Navigation,
  Pagination,
  Mousewheel,
  Keyboard
} from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import TheExchange from './components/exchange.vue'
import TheLiveRecord from './components/liveRecord.vue'
import TheLogin from '../Login/index.vue'
import { useDebounceFn, useTimestamp } from '@vueuse/core'
import { getBannerList, getGameList, getGameListUnlogin } from '../../api/game'
import { useRouter } from 'vue-router'
import { useAccountStore } from '../../store/account'
const accountStore = useAccountStore()
const is_login = computed(() => {
  return accountStore.is_login
})
const oemData = computed(() => {
  return accountStore.oem
})
const router = useRouter()
const modules = [Autoplay, Pagination, Navigation, Mousewheel, Keyboard]
const start_id = localStorage.getItem('start-pre')

/**
 * 刷新icon
 */
const rotation = ref<number>(0)
function debounceOnRefresh() {
  rotation.value -= 180
  query()
}
const onRefresh = useDebounceFn(debounceOnRefresh, 300)
const remenRotation = ref<number>(0)
const onRemenRefresh = useDebounceFn(() => {
  remenRotation.value -= 180
  queryRemen()
}, 300)
/**
 * 兑换游戏
 */
const exchangeVisible = ref<boolean>(false)
function onExchange() {
  if (!is_login.value) {
    loginVisible.value = true
    return
  }
  exchangeVisible.value = true
}
function closeExchangeDialog() {
  exchangeVisible.value = false
}
/**
 * 直播记录
 */
const liveVisible = ref<boolean>(false)
function onOpenLiveRecord() {
  if (!is_login.value) {
    loginVisible.value = true
    return
  }
  liveVisible.value = true
}
function closeLiveRecordDialog() {
  liveVisible.value = false
}
/**
 * 管理后台
 */
const token = localStorage.getItem('authtoken')
function onOpenManage() {
  if (!is_login.value) {
    loginVisible.value = true
    return
  }
  window.open(`http://box.huyouyun.cn/?auth=${token}`, '_blank')
}
/**
 *  登录窗口
 */
const loginVisible = ref<boolean>(false)
function closeLoginDialog() {
  loginVisible.value = false
}

/**
 *  最近游戏
 */
const loading = ref<boolean>(false) // 加载
const tableData = ref<any>() // 列表数据
const gameStatus = ref<any>({}) // 游戏状态
const timestamp = useTimestamp()
async function query() {
  loading.value = true
  let res: any
  if (!is_login.value) {
    res = await getGameListUnlogin({})
  } else {
    res = await getGameList({})
  }
  tableData.value = res?.data?.list.slice(0, 8) // 前八条
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
}
/**
 * 热门游戏
 */
const remen_loading = ref<boolean>(false) // 加载
const remenData = ref<any[]>([])
async function queryRemen() {
  remen_loading.value = true
  let res: any
  if (!is_login.value) {
    res = await getGameListUnlogin({ is_remen: 1 })
  } else {
    res = await getGameList({ is_remen: 1, req_game_id: start_id })
  }
  remenData.value = res.data.list
  remenData.value?.map((item: any) => {
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
  remen_loading.value = false
}
const gameId = ref<any>()
function onGoDetail(item) {
  if (!is_login.value) {
    loginVisible.value = true
    return
  }
  const obj = {
    game_id: item.game_id,
    title: item.title
  }
  gameId.value = item.game_id
  router.push({
    path: '/mall',
    query: obj
  })
}
const bannerData = ref<any>()
async function queryBanner() {
  const res: any = await getBannerList()
  bannerData.value = res?.data?.list
}

onMounted(async () => {
  await query()
  await queryBanner()
  await queryRemen()
})
watch(
  () => is_login.value,
  () => {
    query()
    queryRemen()
  }
)
</script>

<style lang="less" scoped>
.post {
  width: 100%;
  height: 40px;
  border-radius: 10px;
  background: #2d2d2d;
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding: 0 10px;
}
.top {
  display: flex;
  margin-bottom: 15px;
  .banner {
    width: 81%;
    height: 100%;
    aspect-ratio: 1920/600;
    border-radius: 10px;
    margin-right: 15px;
    overflow: hidden;
    .carousel {
      height: 100%;
      .banner-a {
        display: block;
      }
      img {
        width: 100%;
        height: auto;
      }
    }
  }
  .side {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .side-item {
      width: 100%;
      height: 31%;
      border-radius: 10px;
      background: #202020;
      transition: all 0.3s linear;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .side-item:hover {
      background: #303030;
    }
  }
}
.game {
  min-height: 200px;
  .game-title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
    .title {
      display: flex;
      align-items: center;
      font-size: 18px;
      .icon {
        font-size: 24px;
      }
    }
  }
}
@media screen and (max-width: 1280px) {
  .container {
    width: 100%;
  }
  .list {
    grid-template-columns: 33.3% 33.3% 33.3%;
    .list-item {
      height: 240px;
    }
  }
  .hot-list-item {
    width: 287px;
  }
  .icon {
    font-size: 25px;
  }
  .side-item-title {
    font-size: 14px;
  }
}
@media screen and (min-width: 1281px) and (max-width: 1600px) {
  .container {
    width: 100%;
  }
  .list {
    grid-template-columns: 25% 25% 25% 25%;
    .list-item {
      height: 240px;
    }
  }
  .hot-list-item {
    width: 298px;
  }
  .icon {
    font-size: 30px;
  }
  .side-item-title {
    font-size: 16px;
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
  .hot-list-item {
    width: 335px;
  }
  .icon {
    font-size: 35px;
  }
}
@media screen and (min-width: 2000px) {
  .container {
    width: 100rem;
    margin: 0 auto;
  }
  .list {
    grid-template-columns: 16.66% 16.66% 16.66% 16.66% 16.66% 16.66%;
    // grid-template-columns: 25% 25% 25% 25%;

    .list-item {
      height: 220px;
    }
  }
  .hot-list-item {
    width: 266px;
  }
  .icon {
    font-size: 35px;
  }
}
.game-content {
  padding-bottom: 10px;
  .hot-list {
    display: flex;
    flex-wrap: nowrap;
    .hot-list-item {
      flex-shrink: 0;
      // width: 3px;
      padding: 16px;
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
.list {
  display: grid;
  .list-item {
    padding: 16px;
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
.list-item::after,
.hot-list-item::after {
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
.list-item:hover::after,
.hot-list-item:hover::after {
  opacity: 0.1;
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
