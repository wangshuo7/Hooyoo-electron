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
        <el-button
          v-if="is_login && oemData.lianxifangshi"
          class="info-item"
          @click="oemVisible = true"
        >
          <el-icon><Phone /></el-icon>
        </el-button>
        <el-dropdown trigger="click" class="info-item" @command="changeLang">
          <el-button style="width: 40px; height: 40px; border-radius: 50%">
            <!-- <i class="iconfont" style="font-size: 24px">&#xe6ed;</i> -->
            <!-- <span style="font-size: 16px">{{ langView }}</span> -->
            <EarthSvg></EarthSvg>
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
  <el-dialog v-model="oemVisible" width="500" :title="$t('system.kefu')">
    <span>{{ $t('system.lianxifangshi') }}：</span>
    <span>{{ oemData.lianxifangshi }}</span>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, watch } from 'vue'
import { Setting, Phone } from '@element-plus/icons-vue'
import EarthSvg from '../svg/earth.vue'
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
const oemData = computed(() => {
  return accountStore.oem
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
  accountStore.setOem({
    guanwang: '',
    hezigonggao: '',
    lianxifangshi: '',
    tiepai_icon: '',
    tiepai_name: ''
  })
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
const oemVisible = ref<boolean>(false)
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
