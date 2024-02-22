<template>
  <el-dialog
    v-model="settingVisible"
    width="1200px"
    top="5vh"
    @close="closeBetaTool"
  >
    <el-form :model="form" label-width="100" inline>
      <el-form-item label="用户">
        <el-select v-model="form.user" placeholder="请选择用户" clearable>
          <el-option
            v-for="item in user"
            :key="item.uid"
            :value="item.uid"
            :label="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数量" placeholder="请选择数量">
        <el-select v-model="form.count" clearable placeholder="请选择数量">
          <div
            style="
              padding-left: 20px;
              width: 100%;
              display: flex;
              align-items: center;
            "
          >
            <span style="margin-right: 10px">自定义: </span>
            <el-input
              v-model="form.count"
              placeholder="请输入"
              style="width: 100px"
              @input="handleInput"
            ></el-input>
          </div>
          <el-option value="1" label="1" />
          <el-option value="10" label="10" />
          <el-option value="20" label="20" />
          <el-option value="66" label="66" />
          <el-option value="188" label="188" />
          <el-option value="520" label="520" />
          <el-option value="999" label="999" />
          <el-option value="1314" label="1314" />
        </el-select>
      </el-form-item>
      <el-form-item label="弹幕内容">
        <el-input
          v-model="form.content"
          placeholder="请输入弹幕内容"
          clearable
        ></el-input
        ><el-button type="primary" @click="onSendContent">发弹幕</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="margin-right: 20px" @click="onSendLike"
          >点赞</el-button
        >
        <el-button type="primary" @click="onSendFollow">关注</el-button>
        <el-button text bg @click="getGuildOemInfo">贴牌信息</el-button>
      </el-form-item>
    </el-form>
    <div class="main">
      <div class="user">
        <el-scrollbar height="700px">
          <div
            v-for="(item, index) in user"
            :key="item.uid"
            class="user-item"
            @click="onSelectUser(item)"
          >
            <span>
              <el-tag effect="dark">{{ index }}</el-tag>
            </span>
            <span class="user-head">
              <el-image
                :src="`http://www.h2t.me/cdn/huyouyun${item.head}`"
                style="width: 100%; height: 100%; display: flex"
              >
                <template #error>
                  <span
                    style="
                      width: 100%;
                      height: 100%;
                      border: 1px solid #ccc;
                      border-radius: 50%;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                    "
                  >
                    <el-icon><Picture /></el-icon>
                  </span>
                </template>
              </el-image>
            </span>
            <span>
              {{ item.name }}
            </span>
          </div>
        </el-scrollbar>
      </div>
      <div class="gift">
        <el-card
          v-for="item in cards"
          :key="item.id"
          class="card"
          shadow="hover"
          @click="onSendGift(item)"
        >
          <template #header>
            <div class="card-head">
              <span>{{ item.name }}</span>
              <span class="price">{{ item.price }}钻石</span>
            </div>
          </template>
          <img :src="item.src" alt="" />
        </el-card>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { Picture } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { ElNotification } from 'element-plus'
import { v4 as uuidv4 } from 'uuid'
import { getGuildOem } from '../../api/global'
import { useGlobalStore } from '../../store/globalStore'
const globalStore = useGlobalStore()
const settingVisible = ref<boolean>(false)
const user = ref<any>([
  { uid: '10001', name: '清水煮岁月', head: '0.jpg' },
  { uid: '10002', name: '神爱世人', head: '1.jpg' },
  { uid: '10003', name: '旧楼天台', head: '2.jpg' },
  { uid: '10004', name: '川长思鸟来', head: '3.jpg' },
  { uid: '10005', name: '时笙', head: '4.jpg' },
  { uid: '10006', name: '搅散一池星光', head: '5.jpg' },
  { uid: '10007', name: '雪姬', head: '6.jpg' },
  { uid: '10008', name: '夕颜', head: '7.jpg' },
  { uid: '10009', name: '内心独白', head: '8.jpg' },
  { uid: '10010', name: '木浔与森', head: '9.jpg' },
  { uid: '10011', name: '沉睡在你心底的光', head: '10.jpg' },
  { uid: '10012', name: '软气猫', head: '11.jpg' },
  { uid: '10013', name: '沉没落日', head: '12.jpg' },
  { uid: '10014', name: '笙清初扇离', head: '13.jpg' },
  { uid: '10015', name: '像雾若雨又如风', head: '14.jpg' },
  { uid: '10016', name: '阳光的耀眼', head: '15.jpg' },
  { uid: '10017', name: '猫性小仙女', head: '16.jpg' },
  { uid: '10018', name: '巡音流歌', head: '17.jpg' },
  { uid: '10019', name: '有你在的温暖', head: '18.jpg' },
  { uid: '10020', name: '第七种人', head: '19.jpg' },
  { uid: '10021', name: '趁还年轻', head: '20.jpg' },
  { uid: '10022', name: '西施小姐', head: '21.jpg' },
  { uid: '10023', name: '于你悸动', head: '22.jpg' },
  { uid: '10024', name: '半世晨光', head: '23.jpg' },
  { uid: '10025', name: '白鹿饮清溪', head: '24.jpg' },
  { uid: '10026', name: '不觉晴光老', head: '25.jpg' },
  { uid: '10027', name: '浅唱蝶舞', head: '26.jpg' },
  { uid: '10028', name: '海棠花开', head: '27.jpg' },
  { uid: '10029', name: '初恋栀子花', head: '28.jpg' },
  { uid: '10030', name: '仙气中的可爱', head: '29.jpg' },
  { uid: '10031', name: '甜味拾荒者', head: '30.jpg' },
  { uid: '10032', name: '飞花似梦', head: '31.jpg' },
  { uid: '10033', name: '一袖清风', head: '32.jpg' },
  { uid: '10034', name: '小子,你的高傲呢', head: '33.jpg' },
  { uid: '10035', name: '谱写自己的人生', head: '34.jpg' },
  { uid: '10036', name: '浅唱心依', head: '35.jpg' },
  { uid: '10037', name: '不倦', head: '36.jpg' },
  { uid: '10038', name: '种一个月亮', head: '37.jpg' },
  { uid: '10039', name: '只撩干净人', head: '38.jpg' },
  { uid: '10040', name: '染墨绘君衣', head: '39.jpg' },
  { uid: '10041', name: '岁月添我愁', head: '40.jpg' },
  { uid: '10042', name: '那抹熟悉气息', head: '41.jpg' },
  { uid: '10043', name: '绿格杉', head: '42.jpg' },
  { uid: '10044', name: '怡然似梦', head: '43.jpg' },
  { uid: '10045', name: '愿风裁尘', head: '44.jpg' },
  { uid: '10046', name: '互游云', head: '45.jpg' },
  { uid: '10047', name: '嫣然的回眸一笑。', head: '46.jpg' },
  { uid: '10048', name: '眼眸里的光', head: '47.jpg' },
  { uid: '10049', name: '孤魂伴野鬼', head: '48.jpg' },
  { uid: '10050', name: '不屑', head: '49.jpg' },
  { uid: '10051', name: '深染樱花色', head: '50.jpg' },
  { uid: '10052', name: '简若', head: '51.jpg' },
  { uid: '10053', name: '梦想如花般盛开', head: '52.jpg' },
  { uid: '10054', name: '树飘摇', head: '53.jpg' },
  { uid: '10055', name: '甜的很正常', head: '54.jpg' },
  { uid: '10056', name: "Solitude'", head: '55.jpg' },
  { uid: '10057', name: 'Palpitate', head: '56.jpg' },
  { uid: '10058', name: 'Crush', head: '57.jpg' },
  { uid: '10059', name: 'Ethereal', head: '58.jpg' },
  { uid: '10060', name: 'Petrichor', head: '59.jpg' },
  { uid: '10061', name: 'Limerence', head: '60.jpg' },
  { uid: '10062', name: 'Habseligkeit', head: '61.jpg' },
  { uid: '10063', name: 'Lime', head: '62.jpg' },
  { uid: '10064', name: 'Lime青柠', head: '63.jpg' },
  { uid: '10065', name: 'Aurora', head: '64.jpg' },
  { uid: '10066', name: 'Flipped', head: '65.jpg' },
  { uid: '10067', name: 'Frangipane', head: '66.jpg' },
  { uid: '10068', name: '芒果不加冰', head: '67.jpg' },
  { uid: '10069', name: '怦然心动', head: '68.jpg' },
  { uid: '10070', name: '极光', head: '69.jpg' },
  { uid: '10071', name: '杏仁奶油', head: '70.jpg' },
  { uid: '10072', name: '靠天靠地不如靠自己.', head: '71.jpg' },
  { uid: '10073', name: '命运の我手中', head: '72.jpg' },
  { uid: '10074', name: '咬一口西瓜', head: '73.jpg' },
  { uid: '10075', name: '米老鼠', head: '74.jpg' },
  { uid: '10076', name: '柯南', head: '75.jpg' },
  { uid: '10077', name: '壹杆禽兽狙', head: '76.jpg' },
  { uid: '10078', name: '屹立在这世上', head: '77.jpg' },
  { uid: '10079', name: '小酒馆', head: '78.jpg' },
  { uid: '10080', name: '掌握梦想', head: '79.jpg' },
  { uid: '10081', name: '做你的小妖精', head: '80.jpg' },
  { uid: '10082', name: '用笑宣泄悲伤', head: '81.jpg' },
  { uid: '10083', name: '一袭可爱风', head: '82.jpg' },
  { uid: '10084', name: '风追烟花雨', head: '83.jpg' },
  { uid: '10085', name: '一万个舍不得·', head: '84.jpg' },
  { uid: '10086', name: '岛是海的一块疤', head: '85.jpg' },
  { uid: '10087', name: '雪后初暖阳*', head: '86.jpg' },
  { uid: '10088', name: '雨落伊人', head: '87.jpg' },
  { uid: '10089', name: '追随向日葵', head: '88.jpg' },
  { uid: '10090', name: '悦心自足', head: '89.jpg' },
  { uid: '10091', name: '活给自己看', head: '90.jpg' },
  { uid: '10092', name: '荡于旧街', head: '91.jpg' },
  { uid: '10093', name: '妄生', head: '92.jpg' },
  { uid: '10094', name: '蜜兔', head: '93.jpg' },
  { uid: '10095', name: '寒暄ら', head: '94.jpg' },
  { uid: '10096', name: '学会坚强', head: '95.jpg' },
  { uid: '10097', name: '粉色西装', head: '96.jpg' },
  { uid: '10098', name: '白丝妖娆', head: '97.jpg' },
  { uid: '10099', name: '浅灰色、邂逅', head: '98.jpg' },
  { uid: '10100', name: '软喵酱メ', head: '99.jpg' }
])
const cards = ref([
  {
    id: 'yLjFwPlx3UpVlNYXfXAyO2s6ygSwdcUOGcrzLsCrvN2bAuAvZgdHpg5M7Tk=',
    src: 'gift/10001.png',
    name: '小心心',
    price: 1
  },
  {
    id: 'n1/Dg1905sj1FyoBlQBvmbaDZFBNaKuKZH6zxHkv8Lg5x2cRfrKUTb8gzMs=',
    src: 'gift/10003.png',
    name: '仙女棒',
    price: 1
  },
  {
    id: '28rYzVFNyXEXFC8HI+f/WG+I7a6lfl3OyZZjUS+CVuwCgYZrPrUdytGHu0c=',
    src: 'gift/10004.png',
    name: '能力药丸',
    price: 10
  },
  {
    id: 'fJs8HKQ0xlPRixn8JAUiL2gFRiLD9S6IFCFdvZODSnhyo9YN8q7xUuVVyZI=',
    src: 'gift/10005.png',
    name: '魔法镜',
    price: 19
  },
  {
    id: 'PJ0FFeaDzXUreuUBZH6Hs+b56Jh0tQjrq0bIrrlZmv13GSAL9Q1hf59fjGk=',
    src: 'gift/10006.png',
    name: '甜甜圈',
    price: 52
  },
  {
    id: 'IkkadLfz7O/a5UR45p/OOCCG6ewAWVbsuzR/Z+v1v76CBU+mTG/wPjqdpfg=',
    src: 'gift/10007.png',
    name: '能量电池',
    price: 99
  },
  {
    id: 'gx7pmjQfhBaDOG2XkWI2peZ66YFWkCWRjZXpTqb23O/epru+sxWyTV/3Ufs=',
    src: 'gift/10008.png',
    name: '恶魔炸弹',
    price: 199
  },
  {
    id: 'pGLo7HKNk1i4djkicmJXf6iWEyd+pfPBjbsHmd3WcX0Ierm2UdnRR7UINvI=',
    src: 'gift/10009.png',
    name: '神秘空投',
    price: 299
  },
  {
    id: 'lsEGaeC++k/yZbzTU2ST64EukfpPENQmqEZxaK9v1+7etK+qnCRKOnDyjsE=',
    src: 'gift/10010.png',
    name: '超级空投',
    price: 666
  },
  {
    id: 'P7zDZzpeO215SpUptB+aURb1+zC14UC9MY1+MHszKoF0p5gzYk8CNEbey60=',
    src: 'gift/10011.png',
    name: '超能喷射',
    price: 999
  }
])
const form = ref<any>({
  user: null,
  count: null,
  content: ''
})
function findUser(id) {
  return user.value.find((item) => item.uid === id)
}
function handleInput() {
  form.value.count = form.value.count.replace(/[^\d]/g, '')
}
function onSelectUser(item) {
  form.value.user = item.uid
}
// 发弹幕
function onSendContent() {
  if (!form.value.user) {
    return ElMessage.error('请选择用户')
  }
  if (!form.value.content) {
    return ElMessage.error('请输入弹幕内容')
  }
  const data = {
    type: 'live_comment',
    data: [
      {
        msg_id: uuidv4(),
        sec_openid: findUser(form.value.user).uid,
        content: form.value.content,
        avatar_url: `http://www.h2t.me/cdn/huyouyun${findUser(form.value.user).head}`,
        nickname: findUser(form.value.user).name,
        timestamp: new Date().getTime()
      }
    ]
  }
  window.api.sendBetaWs(data)
  ElNotification({
    message: `${findUser(form.value.user).name} 发送弹幕 ${form.value.content}`,
    type: 'success'
  })
  console.log('弹幕', data)
  return
}
// 点赞
function onSendLike() {
  if (!form.value.user) {
    return ElMessage.error('请选择用户')
  }
  const data = {
    type: 'live_like',
    data: [
      {
        msg_id: uuidv4(),
        nickname: findUser(form.value.user).name,
        sec_openid: findUser(form.value.user).uid,
        avatar_url: `http://www.h2t.me/cdn/huyouyun${findUser(form.value.user).head}`,
        like_num: +form.value.count || 1,
        timestamp: new Date().getTime()
      }
    ]
  }
  window.api.sendBetaWs(data)
  ElNotification({
    message: `${findUser(form.value.user).name} 点赞 x ${form.value.count || 1}`,
    type: 'success'
  })
  console.log('点赞', data)
  return
}
// 关注
function onSendFollow() {
  if (!form.value.user) {
    return ElMessage.error('请选择用户')
  }
  const data = {
    type: 'live_follow',
    data: [
      {
        msg_id: uuidv4(),
        sec_openid: findUser(form.value.user).uid,
        avatar_url: `http://www.h2t.me/cdn/huyouyun${findUser(form.value.user).head}`,
        nickname: findUser(form.value.user).name,
        timestamp: new Date().getTime()
      }
    ]
  }
  window.api.sendBetaWs(data)
  ElNotification({
    message: `${findUser(form.value.user).name} 关注了`,
    type: 'success'
  })
  console.log('关注', data)
  return
}
// 礼物
function onSendGift(item) {
  if (!form.value.user) {
    return ElMessage.error('请选择用户')
  }
  const data = {
    type: 'live_gift',
    data: [
      {
        msg_id: uuidv4(),
        sec_openid: findUser(form.value.user).uid,
        avatar_url: `http://www.h2t.me/cdn/huyouyun${findUser(form.value.user).head}`,
        nickname: findUser(form.value.user).name,
        timestamp: new Date().getTime(),
        sec_gift_id: item.id,
        gift_num: form.value.count || 1,
        gift_value: item.price * form.value.count || 1
      }
    ]
  }
  window.api.sendBetaWs(data)
  ElNotification({
    message: `${findUser(form.value.user).name} 送出礼物 ${item.name} x ${form.value.count || 1}`,
    type: 'success'
  })
  console.log('礼物', data)
  return
}
async function getGuildOemInfo() {
  const send_data = {
    id: globalStore.guildId
  }
  console.log(send_data)
  await getGuildOem(send_data)
}
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})
const emits = defineEmits(['close'])
function closeBetaTool() {
  emits('close', false)
}
watch(
  () => props.visible,
  (val) => {
    settingVisible.value = val
  },
  { immediate: true }
)
</script>

<style lang="less" scoped>
.el-select {
  width: 240px;
}
.el-input {
  width: 240px;
}
.main {
  width: 100%;
  display: flex;
}
.user {
  width: 30%;
  margin-left: 30px;
  overflow: auto;
  .user-item {
    width: 95%;
    border: 1px solid rgba(0, 0, 0, 0);
    padding: 10px;
    display: flex;
    align-items: center;
    margin: 2px;
  }
  .user-item:hover {
    border: 1px solid skyblue;
    border-radius: 6px;
    // box-shadow: 0 0 5px 2px #888888;
  }
  .user-head {
    height: 35px;
    width: 35px;
    min-height: 35px;
    min-width: 35px;
    border-radius: 50%;
    margin: 0 20px;
    overflow: hidden;
  }
}
.gift {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  .card {
    // width: 18%;
    width: 170px;
    height: 210px;
    margin: 10px;
    img {
      width: 100%;
      height: 100%;
    }
    .card-head {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .price {
      margin-left: 10px;
      color: #ff7300;
    }
  }
  .card:hover {
    border: 1px solid #409eff;
  }
}
</style>
