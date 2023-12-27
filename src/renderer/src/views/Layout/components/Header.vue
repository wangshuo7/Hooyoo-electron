<template>
  <div class="header">
    <div class="left">
      <!-- <el-icon @click="goBack"><ArrowLeftBold /></el-icon> -->
      <!-- <div class="search">
        <div class="search-icon">
          <el-icon><Search /></el-icon>
        </div>
        <input class="search-input" placeholder="搜索商城" />
      </div> -->
      <!-- <div v-if="route.path === '/mall'">
        <el-dropdown
          trigger="click"
          placement="bottom-start"
          @visible-change="iconChange"
        >
          <div class="dropdown">
            <span>探索</span>
            <el-icon class="el-icon--right" :class="{ active: is_drop }">
              <arrow-down />
            </el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>探索</el-dropdown-item>
              <el-dropdown-item>浏览</el-dropdown-item>
              <el-dropdown-item>新闻</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div> -->
      <!-- <el-form :form="form" inline label-width="70">
        <el-form-item label="游戏名称">
          <el-input
            v-model="form.title"
            placeholder="请输入游戏名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-select v-model="form.sort" clearable placeholder="请选择排序方式">
            <el-option value="2" label="创建时间正序" />
            <el-option value="1" label="创建时间倒序" />
            <el-option value="4" label="热度正序" />
            <el-option value="3" label="热度倒序" />
            <el-option value="6" label="banner正序" />
            <el-option value="5" label="banner倒序" />
          </el-select>
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="form.cate" clearable placeholder="请选择游戏分类">
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
      </el-form> -->
    </div>
    <div class="right">
      <!-- <div class="right-link">
        <div>愿望清单</div>
        <div>购物车</div>
      </div> -->
      <div class="right-info">
        <!-- <div class="info-item">斗</div> -->
        <el-dropdown class="info-item">
          <el-avatar
            :size="50"
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          >
          </el-avatar>
          <template #dropdown>
            <el-dropdown-menu class="dropdown-t">
              <el-dropdown-item @click="logOut">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <!-- <div class="info-item">豆</div> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// import { onMounted, ref } from 'vue'
// import { ArrowLeftBold, Search, ArrowDown } from '@element-plus/icons-vue'
// import { Search } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
// import { useGlobalStore } from '../../../store/globalStore'
// const globalStore = useGlobalStore()
const router = useRouter()
// const route = useRoute()
// const is_drop = ref<boolean>(false)
// function iconChange(e: boolean) {
//   is_drop.value = e
// }
// function goBack() {
//   router.go(-1)
// }
// const form = ref<any>({})
// const categories = ref<any>([]) // 获取分类
// 搜索
// function query() {
//   //
// }
// 显示全部
// function viewAll() {
// form.value = {}
// }
// 退出登录
function logOut() {
  router.push('/login')
  localStorage.setItem('authtoken', '')
}
// onMounted(async () => {
//   await globalStore.setCategory()
//   categories.value = globalStore.category
// })
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
        float: right;
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
</style>
