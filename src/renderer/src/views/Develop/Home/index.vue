<template>
  <div class="main">
    <div class="develop-item" @click="onOpenDebug">
      <span class="item-icon">
        <el-icon><ChatLineRound /></el-icon>
      </span>
      <span>{{ $t('developer.moni') }}</span>
    </div>
    <div class="develop-item" @click="onOpenToken">
      <span class="item-icon">
        <el-icon style="transform: rotate(45deg)"><Key /></el-icon>
      </span>
      <span>{{ $t('developer.anchor_key') }}</span>
    </div>
    <div class="develop-item" @click="onOpenDevDocument">
      <span class="item-icon">
        <el-icon><Link /></el-icon>
      </span>
      <span>{{ $t('developer.dev_document') }}</span>
    </div>
    <div class="develop-item" @click="onOpenDevBack">
      <span class="item-icon">
        <el-icon><Compass /></el-icon>
      </span>
      <span>{{ $t('developer.dev_manage') }}</span>
    </div>
    <div class="develop-item" @click="onLogoutDeveloper">
      <span class="item-icon">
        <el-icon><Switch /></el-icon>
      </span>
      <span>{{ $t('developer.switch_account') }}</span>
    </div>
  </div>
  <el-dialog
    v-model="tokenVisible"
    title="主播密钥（Token）"
    width="600px"
    @open="openTokenDialog"
  >
    <div v-if="gameList.length" class="token-main">
      <div class="token-item">
        <span style="font-size: 16px; width: 76px">游戏：</span>
        <el-select
          v-model="game"
          class="m-2"
          placeholder="请选择游戏"
          style="width: 240px"
        >
          <el-option
            v-for="item in gameList"
            :key="item.game_id"
            :label="item.title"
            :value="item.game_id"
          />
        </el-select>
      </div>
      <div class="token-content">
        <span
          >亲爱的开发者您好,如果您的游戏使用了加密弹幕通讯,那么一定需要下面的
          Token,具体使用方法请查看：</span
        >
        <a
          style="text-decoration: underline"
          href="https://mwmbav7xpt.feishu.cn/docx/XWjjdhJALoJe7HxEfj3cpm4ZnBb?from=from_copylink"
          class="token-content-link"
          >开发者文档</a
        >
      </div>
      <div class="token-item">
        <span class="token-item-title">Token：</span>
        <el-input v-model="token"></el-input>
        <el-button type="info" @click="copyToken">复制</el-button>
      </div>
      <div class="token-item">
        <span class="token-item-title">游戏ID：</span>
        <el-input v-model="game"></el-input>
        <el-button type="info" @click="copyToken">复制</el-button>
      </div>
      <div class="token-item">
        <span class="token-item-title">PWD：</span>
        <el-input v-model="gamePwd.miyaostr"></el-input>
        <el-button type="info" @click="copyToken">复制</el-button>
      </div>
    </div>
    <div v-else>
      <span style="font-size: 16px">
        当前开发者下没有任何游戏，请先<a
          href="#"
          style="font-size: 16px; color: #409eff"
          @click="onOpenDevBack"
          >创建游戏</a
        >
      </span>
    </div>
  </el-dialog>
  <BetaTool :visible="debugVisible" @close="onCloseDebug"></BetaTool>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  ChatLineRound,
  Key,
  Link,
  Compass,
  Switch
} from '@element-plus/icons-vue'
import BetaTool from './components/betaTool.vue'
import { useDeveloperStore } from '../../../store/developer'
import { getDevloperGames } from '../../../api/developer'
const developerStore = useDeveloperStore()
const authToken = localStorage.getItem('author_authtoken')
const tokenVisible = ref<boolean>(false)
const debugVisible = ref<boolean>(false)
const token = ref<any>()
function onOpenToken() {
  tokenVisible.value = true
  token.value = localStorage.getItem('authtoken')
}
function copyToken() {
  navigator.clipboard
    .writeText(token.value)
    .then(() => {
      ElMessage.success('复制成功')
    })
    .catch((error) => {
      console.log('复制失败', error)
      ElMessage.error('无法复制到剪贴板，请手动复制')
    })
}
function onOpenDevDocument() {
  window.open(
    `https://mwmbav7xpt.feishu.cn/docx/XWjjdhJALoJe7HxEfj3cpm4ZnBb?from=from_copylink`,
    '_blank'
  )
}
function onOpenDebug() {
  debugVisible.value = true
}
function onCloseDebug() {
  debugVisible.value = false
}
function onLogoutDeveloper() {
  developerStore.setLogin(false)
}
function onOpenDevBack() {
  window.open(`http://open.huyouyun.cn/?auth=${authToken}`, '_blank')
}
const game = ref<any>()
const gameList = ref<any[]>([])
async function openTokenDialog() {
  const res: any = await getDevloperGames({})
  gameList.value = res.data.list
}
const gamePwd = computed(() => {
  return gameList.value.find((item) => game.value == item.game_id)
})
</script>

<style lang="less" scoped>
.main {
  display: flex;
}
.develop-item {
  font-size: 20px;
  line-height: 26px;
  width: 200px;
  height: 100px;
  border-radius: 15px;
  background-color: #202020;
  transition: all 0.3s linear;
  margin-right: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  .item-icon {
    font-size: 46px;
  }
}
.develop-item:hover {
  background-color: #303030;
}
.token-item {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  .token-item-title {
    display: inline-block;
    font-size: 16px;
    width: 100px;
  }
}
.token-content {
  font-size: 16px;
  margin-bottom: 5px;
  .token-content-link {
    color: #409eff;
  }
}
.token-input {
  display: flex;
}
</style>
