<template>
  <div class="header">
    <div class="left"></div>
    <div class="right">
      <div class="right-info">
        <!-- <el-button class="info-item" @click="onOpenBeta">
          <span style="font-size: 11px">Debug</span>
        </el-button> -->
        <!-- <el-button class="info-item" @click="onOpenManage">
          <span style="font-size: 16px">后</span>
        </el-button>
        <el-button class="info-item" @click="onExchange">
          <span style="font-size: 16px">兑</span>
        </el-button> -->
        <el-dropdown trigger="click" class="info-item" @command="changeLang">
          <el-button style="width: 40px; height: 40px; border-radius: 50%">
            <!-- <i class="iconfont" style="font-size: 24px">&#xe6ed;</i> -->
            <!-- <span style="font-size: 16px">{{ langView }}</span> -->
            <svg
              t="1710150844760"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="3443"
              width="24"
              height="24"
            >
              <path
                d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64z m0 224c-29.5 0-58.3-2.6-86.2-7.5C452 175.3 491.4 120 512 120c20.6 0 60 55.3 86.2 160.5-27.9 4.8-56.7 7.5-86.2 7.5z m140.7-20.4c-13.6-55.7-31.8-102.6-53.1-137.4 63.6 14.6 121.3 44.7 169 86.1-35.3 21.8-74.3 39.1-115.9 51.3z m-281.4 0c-41.6-12.2-80.5-29.6-115.8-51.3 47.7-41.4 105.3-71.4 168.9-86-21.3 34.7-39.4 81.6-53.1 137.3zM679.5 484c-1.3-57.5-6.7-111.9-15.4-161.4 52.5-15 101.3-37.3 144.8-65.8 53.4 62 87.5 140.7 93.7 227.2H679.5z m-558.1 0c6.2-86.4 40.2-165.1 93.5-227.1 43.5 28.5 92.4 50.6 145 65.6-8.7 49.6-14.1 104-15.4 161.5H121.4z m279.1 0c1.3-55.7 6.4-105.4 13.9-148.7 31.6 5.6 64.1 8.7 97.6 8.7 33.4 0 66-3 97.6-8.6 7.5 43.3 12.5 93 13.9 148.6h-223z m408.4 283.2c-43.5-28.5-92.3-50.8-144.8-65.8 8.7-49.6 14.1-104 15.4-161.4h223.1c-6.2 86.5-40.3 165.2-93.7 227.2z m-394.5-78.5c-7.5-43.3-12.5-93-13.9-148.7h222.9c-1.3 55.6-6.3 105.3-13.9 148.6C578 683 545.4 680 512 680c-33.4 0-66 3.1-97.6 8.7zM215 767.1c-53.3-62-87.4-140.7-93.5-227.1h223.1c1.3 57.5 6.7 111.9 15.4 161.5-52.6 15-101.5 37.1-145 65.6zM512 904c-20.6 0-60-55.3-86.2-160.5 27.9-4.8 56.7-7.5 86.2-7.5s58.3 2.7 86.2 7.5C572 848.7 532.6 904 512 904z m87.6-10.2c21.3-34.8 39.5-81.7 53.1-137.4 41.7 12.2 80.6 29.5 115.9 51.2-47.7 41.5-105.4 71.6-169 86.2z m-175.2 0c-63.6-14.6-121.2-44.6-168.9-86 35.2-21.8 74.1-39.1 115.8-51.3 13.7 55.6 31.8 102.5 53.1 137.3z"
                fill="#cdcdcd"
                p-id="3444"
              ></path>
            </svg>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu class="dropdown">
              <el-dropdown-item
                v-for="item in lang"
                :key="item.id"
                :command="item"
                >{{ item.title }}</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-button class="info-item" @click="onSetting">
          <el-icon><Setting /></el-icon>
        </el-button>
        <el-button
          v-if="!is_login"
          class="info-item"
          circle
          size="large"
          style="font-size: 14px"
          @click="onLogin"
          >{{ $t('login.login') }}</el-button
        >
        <el-dropdown
          v-else
          class="info-item"
          trigger="click"
          @visible-change="getInfo"
        >
          <el-avatar
            :size="50"
            :src="
              info?.header_img?.includes('http')
                ? info?.header_img
                : 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
            "
          >
          </el-avatar>
          <template #dropdown>
            <el-dropdown-menu class="dropdown-t">
              <div style="padding: 5px 16px; font-size: 15px">
                {{ info?.nickname }}
              </div>
              <el-dropdown-item>
                <span>{{ $t('system.price') }}：</span>
                <span>{{ info?.current_price }}</span>
              </el-dropdown-item>
              <el-dropdown-item
                >{{ $t('system.diamond') }}：{{ info?.jifen }}
              </el-dropdown-item>
              <el-dropdown-item @click="onRecharge">{{
                $t('system.recharge')
              }}</el-dropdown-item>
              <el-dropdown-item class="log" style="padding: 0"
                ><Log></Log
              ></el-dropdown-item>
              <el-dropdown-item divided @click="logOut">{{
                $t('system.logout')
              }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
  <TheRecharge
    :visible="rechargeVisible"
    @close="closeRechargeDialog"
  ></TheRecharge>
  <TheExchange
    :visible="exchangeVisible"
    @close="closeExchangeDialog"
  ></TheExchange>
  <TheSetting
    :visible="settingVisible"
    @close="closeSettingDialog"
  ></TheSetting>
  <TheLogin :visible="loginVisible" @close="closeLoginDialog"></TheLogin>
  <!-- <BetaTool :visible="toolVisible" @close="closeBetaTool"></BetaTool> -->
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, watch } from 'vue'
import { Setting } from '@element-plus/icons-vue'
// import { useRouter } from 'vue-router'
import TheExchange from '../../Home/components/exchange.vue'
import TheRecharge from '../../Other/recharge.vue'
import TheSetting from '../../Other/setting.vue'
import TheLogin from '../../Login/index.vue'
// import BetaTool from '../../Other/betaTool.vue'
import { getPersonalInfo } from '../../../api/wallet'
import { useGlobalStore } from '../../../store/globalStore'
import { useAccountStore } from '../../../store/account'
import { useLanguageStore } from '../../../store/languageStore'
import i18n from '../../../utils/i18n'
import Log from '../../Other/log.vue'

const langView = ref<any>('中')
const accountStore = useAccountStore()
const is_login = computed(() => {
  return accountStore.is_login
})
const globalStore = useGlobalStore()
const languageStore = useLanguageStore()
const lang = ref<any>()
// const token = localStorage.getItem('authtoken')
const info = ref<any>()
// const router = useRouter()
const settingVisible = ref<boolean>(false)
const rechargeVisible = ref<boolean>(false)
const exchangeVisible = ref<boolean>(false)
const loginVisible = ref<boolean>(false)
// const toolVisible = ref<boolean>(false)
// 退出登录
function logOut() {
  // router.push('/login')
  localStorage.setItem('authtoken', '')
  accountStore.setIsLogin(false)
}
async function viewPersonal() {
  const res = await getPersonalInfo()
  info.value = res?.data?.one
  globalStore.setGuildId(info.value?.gonghui_id)
}
function getInfo(visible: boolean) {
  visible && viewPersonal()
}
function onSetting() {
  settingVisible.value = true
  window.api.getPath()
}
function closeSettingDialog() {
  settingVisible.value = false
}
// function onExchange() {
//   exchangeVisible.value = true
// }
function closeExchangeDialog() {
  exchangeVisible.value = false
}
// function onOpenBeta() {
//   toolVisible.value = true
// }
// function closeBetaTool() {
//   toolVisible.value = false
// }
function onRecharge() {
  rechargeVisible.value = true
}
function closeRechargeDialog() {
  rechargeVisible.value = false
}
function onLogin() {
  loginVisible.value = true
}
function closeLoginDialog() {
  loginVisible.value = false
}
// function onOpenManage() {
//   window.open(`http://box.huyouyun.cn/?auth=${token}`, '_blank')
// }

function changeLang(item: any) {
  if (item.id == 13) {
    localStorage.setItem('lang', 'en')
    i18n.global.locale.value = 'en'
    window.api.sendLanguage(13)
    langView.value = 'En'
    languageStore.setLocale('en')
  }
  if (item.id == 39) {
    localStorage.setItem('lang', 'tw')
    i18n.global.locale.value = 'tw'
    window.api.sendLanguage(39)
    langView.value = '繁'
    languageStore.setLocale('tw')
  }
  if (item.id == 11) {
    localStorage.setItem('lang', 'zh')
    i18n.global.locale.value = 'zh'
    window.api.sendLanguage(11)
    langView.value = '中'
    languageStore.setLocale('zh')
  }
}
onMounted(async () => {
  viewPersonal()
  await globalStore.setLanguage()
  lang.value = globalStore.language
  if (!localStorage.getItem('lang')) {
    localStorage.setItem('lang', 'zh')
    window.api.sendLanguage(11)
    langView.value = '中'
  }
  if (localStorage.getItem('lang') == 'en') {
    langView.value = 'En'
  }
  if (localStorage.getItem('lang') == 'zh') {
    langView.value = '中'
  }
  if (localStorage.getItem('lang') == 'tw') {
    langView.value = '繁'
  }
})
watch(
  () => is_login.value,
  (val) => {
    if (val) {
      viewPersonal()
    }
  }
)
</script>

<style lang="less" scoped>
@media screen and (min-width: 2001px) {
  .header {
    width: 100rem;
    margin: 0 auto;
    // padding: 0 2%;
  }
}
@media screen and (max-width: 2000px) {
  .header {
    padding: 0 5%;
  }
}
.header {
  display: flex;
  justify-content: space-between;
  // overflow: hidden;
  .el-form-item {
    margin: 0;
  }
  .left {
    display: flex;
    align-items: center;
    .search {
      width: 230px;
      border-radius: 30px;
      overflow: hidden;
      background: #202020;
      display: flex;
      align-items: center;
      margin: 0 30px 0 22px;
      .search-icon {
        width: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #757575;
      }
      .search-input {
        // width: 230px;
        height: 40px;
        border: none;
        outline: none;
        background: transparent;
      }
    }
    .dropdown {
      display: flex;
      align-items: center;
      cursor: pointer;
      color: #f5f5f5;
      .el-icon--right {
        transition: all 0.2s linear;
      }
      .el-icon--right.active {
        transform: rotate(-180deg);
      }
    }
  }
  .right {
    display: flex;
    // align-items: center;
    justify-content: flex-end;
    .right-info {
      // width: 155px;
      // border-left: 1px solid #202020;
      .info-item {
        float: left;
        margin-left: 35px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        font-size: 20px;
        background: #202020;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        .el-avatar {
          width: 100%;
          height: 100%;
        }
      }
      .info-item:hover {
        background: #2b2b2b;
      }
    }
    .right-link {
      width: 210px;
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      font-size: 14px;
      color: var(--text-menu-color);
      div {
        cursor: pointer;
      }
      div:hover {
        color: #f5f5f5;
      }
    }
  }
}
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
:deep(.log) {
  padding: 0;
  height: 32px;
  text-indent: 16px;
}
</style>
