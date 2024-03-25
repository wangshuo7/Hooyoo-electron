<template>
  <div class="menu-box">
    <div class="logo">
      <el-image
        class="logo-img"
        style="cursor: pointer"
        :src="oemData.tiepai_icon ? oemData.tiepai_icon : './system/hooyoo.gif'"
        @click="onOpenWeb"
      ></el-image>
    </div>
    <div
      style="
        height: 85%;
        display: flex;
        flex-direction: column;
        padding-bottom: 20px;
      "
    >
      <el-menu text-color="#757575" :default-active="menu_active" router>
        <el-menu-item index="/home" class="menu-item">
          <el-icon><HomeFilled /></el-icon>
          <template #title>{{ $t('menu.home') }}</template>
        </el-menu-item>
        <el-menu-item index="/mall" class="menu-item">
          <el-icon><Shop /></el-icon>
          <template #title>{{ $t('menu.mall') }}</template>
        </el-menu-item>
        <el-menu-item index="/learn" class="menu-item">
          <el-icon><Cherry /></el-icon>
          <template #title>{{ $t('menu.learn') }}</template>
        </el-menu-item>
        <el-menu-item index="/develop" class="menu-item">
          <el-icon><Avatar /></el-icon>
          <template #title>{{ $t('menu.developer') }}</template>
        </el-menu-item>
        <!-- <el-menu-item index="library">
          <el-icon><Menu /></el-icon>
          <template #title>{{ $t('menu.library') }}</template>
        </el-menu-item> -->
      </el-menu>
      <el-menu class="down" style="margin-top: auto" default-active="1">
        <el-menu-item
          index="1"
          class="live-info"
          @click="onRefresh"
          @mouseenter="openList"
          @mouseleave="closeList"
        >
          <template #title>
            <span
              class="state-title"
              :style="{
                color: live_state_before === 'yes_live' ? '#67C23A' : '#F56C6C'
              }"
              >{{ live_state }}</span
            >
            <!-- <span>{{ $t('system.diamond') }}：{{ diamond }}</span> -->
            <div style="display: flex; align-items: center">
              <DiamondSvg></DiamondSvg>
              <span style="margin: 0 10px">{{ diamond }}</span>
              <el-link
                style="font-size: 14px"
                type="primary"
                :underline="false"
                @click="onOpenRecharge"
                >{{ $t('system.recharge') }}</el-link
              >
            </div>
          </template>
        </el-menu-item>
        <div class="drop-f" style="position: relative">
          <div class="drop" :class="{ 'drop-top': theTop }">
            <!-- :style="{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'absolute',
                background: '#202020',
                borderRadius: '6px 6px 0 0',
                left: '0',
                top: theTop ? '-161px' : '-180px'
              }" -->
            <div class="drop-item" @click="onOpenRecharge">
              <div class="drop-item-content">
                <span
                  >{{ $t('recharge.title') }}&ensp;
                  {{ $t('system.diamond') }}/{{ $t('system.price') }}</span
                >
                <span>👉</span>
              </div>
            </div>
            <div class="drop-item" @click="onOpenTransfer">
              <div class="drop-item-content">
                <span
                  >{{ $t('transfer.transfer') }}&ensp;
                  {{ $t('system.price') }}/{{ $t('system.diamond') }}</span
                >
                <span>👉</span>
              </div>
            </div>
            <div class="drop-item" @click="onOpenConvert">
              <div class="drop-item-content">
                <span
                  >{{ $t('system.price') }}&ensp;
                  {{ $t('convert.convert') }}</span
                >
                <span>👉</span>
              </div>
            </div>
            <div
              class="drop-item"
              style="border-bottom: 1px solid #404040"
              @click="onOpenLiveLog"
            >
              <div class="drop-item-content" style="border-bottom: none">
                <span
                  >{{ $t('liveLog.view_button') }}&ensp;
                  {{ $t('liveLog.live_kb') }}</span
                >
                <span>👉</span>
              </div>
            </div>
          </div>
        </div>
      </el-menu>
    </div>
  </div>
  <TheRecharge
    :visible="rechargeVisible"
    @close="closeRechargeDialog"
  ></TheRecharge>
  <TheLiveRecord
    :visible="liveVisible"
    @close="closeLiveDialog"
  ></TheLiveRecord>
  <TheConvert
    :visible="convertVisible"
    @close="closeConvertDialog"
    @getdiamond="viewPrice"
  ></TheConvert>
  <TheTransfer
    :visible="transferVisible"
    @close="closeTransferDialog"
  ></TheTransfer>
</template>

<script lang="ts" setup>
import { ref, onMounted, watchEffect, computed, watch } from 'vue'
import { Avatar, HomeFilled, Shop, Cherry } from '@element-plus/icons-vue'
// import { Refresh } from '@element-plus/icons-vue'
import DiamondSvg from '../svg/diamond.vue'
import { getGuildOem } from '../../../api/global'
import { getPersonalInfo } from '../../../api/wallet'
import { useRoute } from 'vue-router'
import { useLiveStore } from '../../../store/live'
import { useLanguageStore } from '../../../store/languageStore'
import { useAccountStore } from '../../../store/account'
import TheRecharge from '../../Other/recharge.vue'
import TheLiveRecord from '../../Home/components/liveRecord.vue'
import TheConvert from '../../Other/convert.vue'
import TheTransfer from '../../Other/transfer.vue'
import { useWindowSizeStore } from '../../../store/window'
import 'animate.css'
const windowSize = useWindowSizeStore()
window.addEventListener('resize', () => {
  windowSize.updateWindowSize()
})
const theTop = computed(() => {
  if (windowSize.width <= 1280) {
    return true
  } else {
    return false
  }
})
const listLock = ref<boolean>(false)
const openList = () => {
  listLock.value = true
}
const closeList = () => {
  listLock.value = false
}
const transferVisible = ref<boolean>()
function onOpenTransfer() {
  transferVisible.value = true
}
function closeTransferDialog() {
  transferVisible.value = false
}
const convertVisible = ref<boolean>(false)
function onOpenConvert() {
  convertVisible.value = true
}
function closeConvertDialog() {
  convertVisible.value = false
}
const liveVisible = ref<boolean>(false)
function onOpenLiveLog() {
  liveVisible.value = true
}
function closeLiveDialog() {
  liveVisible.value = false
}
const rechargeVisible = ref<boolean>(false)
function onOpenRecharge() {
  rechargeVisible.value = true
}
function closeRechargeDialog() {
  rechargeVisible.value = false
}
const accountStore = useAccountStore()
const is_login = computed(() => {
  return accountStore.is_login
})
const oemData = computed(() => {
  return accountStore.oem
})
const languageStore = useLanguageStore()
const liveStore = useLiveStore()
const live_state_before = computed(() => {
  return liveStore.state
})
const live_state = computed(() => {
  if (languageStore.locale == 'zh') {
    return liveStore.state == 'no_live' ? '未开播' : '已开播'
  } else if (languageStore.locale == 'tw') {
    return liveStore.state == 'no_live' ? '未開播' : '已開播'
  }
  return liveStore.state == 'no_live' ? 'Ending' : 'Live'
})
const diamond = computed(() => {
  return liveStore.diamond
})
const route = useRoute()
const menu_active = ref<any>('/home')
const logo = ref<any>()
async function viewPersonal() {
  const res: any = await getPersonalInfo()
  liveStore.setDiamond(res?.data?.one.jifen)
  window.api.sendAnchor(res?.data?.one)
  const result: any = await getGuildOem({ id: res?.data.one.gonghui_id })
  accountStore.setOem(result?.data?.list[0])
  logo.value = result?.data?.list[0]?.tiepai_icon
}
async function viewPrice() {
  const res: any = await getPersonalInfo()
  liveStore.setDiamond(res?.data?.one?.jifen)
}
function onRefresh() {
  viewPrice()
}
function onOpenWeb() {
  if (!is_login.value) {
    window.open('http://www.game888.cn', '_blank')
    return
  }
  if (is_login.value && oemData.value.guanwang) {
    window.open(oemData.value.guanwang, '_blank')
  }
}
watchEffect(() => {
  menu_active.value = route.path
})
onMounted(() => {
  viewPersonal()
  liveStore.setState('no_live')
})
watch(
  () => is_login.value,
  (val) => {
    if (val) {
      viewPrice()
    }
  }
)
</script>

<style lang="less" scoped>
// .drop {
//   animation-duration: 3s;
//   animation-name: slidein;
// }

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-to,
.v-leave-from {
  opacity: 1;
  // transform: translate(0, -50px);
}

// .v-enter-active {
//   animation: run-slide 1s linear 0s;
// }
// .v-leave-active {
//   animation: run-slide 1s linear 0s reverse;
// }

// @keyframes run-slide {
//   0% {
//     transform: translate(0, 0px);
//   }
//   100% {
//     transform: translate(0, -50px);
//   }
// }
// .drop-top {
//   top: -157px !important;
// }
.drop {
  // transition: all 0.5s linear;
  .drop-item {
    padding: 0 20px;
    width: 100%;
    line-height: 2.8;
    .drop-item-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 95%;
      border-bottom: 1px solid #404040;
    }
  }
}
.refresh {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 25px;
  height: 25px;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 5px;
  .refresh-icon {
    position: relative;
    left: 2px;
    transition: color 0.1s linear;
  }
}
.refresh .refresh-icon:hover {
  color: #e6a23c;
}

.state-title {
  display: block;
  line-height: 1;
}
.live-info {
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;
}
.drop {
  width: 100%;
  display: flex;
  flex-direction: column;
  position: absolute;
  background: #202020;
  border-radius: 6px 6px 0 0;
  left: 0;
  // top: -300px;
  bottom: 0;
}
.drop-f {
  position: relative;
  width: 100%;
  // height: 200px;
  animation-fill-mode: forwards;
  top: -50px;
  background-color: blue;
}
.live-info:hover + .drop-f .drop {
  animation-duration: 3s;
  animation-name: slidein;
  background-color: red;
  // top: -100px;
}
@keyframes slidein {
  from {
    height: 0;
    overflow: hidden;
  }

  to {
    height: 200px;
    overflow: hidden;
  }
}
@media screen and (max-width: 1280px) {
  .live-info {
    font-size: 14px;
  }
  .logo {
    height: 40px;
    .logo-img {
      width: 40px;
    }
  }
  .el-menu {
    .el-menu-item {
      height: 50px;
    }
  }
}
@media screen and (min-width: 1281px) and (max-width: 1600px) {
  .logo {
    height: 60px;
    .logo-img {
      width: 60px;
    }
  }
  .el-menu {
    .el-menu-item {
      height: 60px;
    }
  }
}
@media screen and (min-width: 1601px) {
  .logo {
    height: 60px;
    .logo-img {
      width: 60px;
    }
  }
  .el-menu {
    .el-menu-item {
      height: 70px;
      font-size: 16px;
    }
  }
}

.menu-box {
  display: flex;
  flex-direction: column;
  height: 100%;
  // border: 1px solid #ccc;
  position: relative;
}

.logo {
  display: flex;
  // height: 40px;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
  .logo-img {
    border-radius: 50%;
    // width: 40px;
  }
}
.el-menu {
  background: #121212;
  // color: var(--text-menu-color);
  border: none;
  .el-menu-item {
    margin: 0 auto;
    width: 90%;
    // height: 60px;
    border-radius: 6px;
    margin-bottom: 3px;
  }
  .menu-item:hover {
    background-color: var(--text-menu-background-hover);
  }
  .el-menu-item.is-active {
    color: var(--text-menu-color-active);
    background: var(--text-menu-background-active);
  }
  .menu-item.is-active:hover {
    background-color: var(--text-menu-background-active-hover);
  }
}
// .menu {
//   flex: 1;
//   color: var(--text-menu-color);
//   .menu-item {
//     margin: 0 auto;
//     width: 90%;
//     height: 50px;
//     border-radius: 6px;
//     display: flex;
//     align-items: center;
//     // justify-content: center;
//     padding-left: 25px;
//     .item-icon {
//       margin-right: 25px;
//     }
//   }
//   .menu-item:hover {
//     background: #202020;
//     color: var(--text-menu-color-active);
//   }
// }
.list-item {
  margin: 0 auto;
  background-color: #202020;
  // border: 1px solid #ccc;
  width: 600px;
  height: 70px;
  border-radius: 10px;
  padding: 10px;
}
</style>
