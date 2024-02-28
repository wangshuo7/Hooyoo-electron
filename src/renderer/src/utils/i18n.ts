import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  locale: localStorage.getItem('lang') || 'zh',
  // locale: 'zh', // 默认语言
  legacy: false,
  allowComposition: true,
  messages: {
    zh: {
      lang: '中文',
      system: {
        day: '天',
        price: '余额',
        diamond: '钻石',
        recharge: '充值',
        logout: '退出登录',
        all: '全部',
        viwe: '网格视图',
        display: '显示',
        result: '个结果中的',
        without: '无',
        log: '日志',
        last_open: '上次打开',
        incomplete: '功能开发中，暂未开放'
      },
      home: {
        redeem: '兑换游戏',
        manage: '管理后台',
        livelog: '直播记录',
        recent: '最近上新'
      },
      login: {
        login: '登录',
        dev_login: '开发者登录',
        register: '注册',
        reset: '重置密码',
        account: '账号',
        phone: '手机号',
        phone_placeholder: '请输入手机号',
        password_placeholder: '请输入密码',
        code_placeholder: '请输入验证码',
        password: '密码',
        code: '验证码',
        get_code: '获取验证码',
        remember: '记住密码',
        register_account: '注册账号',
        orther: '其他操作',
        codelog: '验证码登录',
        psdlog: '密码登录',
        forget: '忘记密码',
        back: '返回登录',
        user: '用户名',
        nickname: '昵称',
        guildId: '公会ID',
        withdraw: '提现账号',
        user_placeholder: '请输入用户名',
        nickname_placeholder: '请输入昵称',
        guildId_placeholder: '请输入公会ID',
        withdraw_placeholder: '请输入提现账号',
        more: '填写更多信息',
        receive: '收起',
        required: '必填',
        format: '手机号码格式不正确'
      },
      menu: {
        mall: '商城',
        library: '库',
        home: '主页',
        developer: '开发者中心'
      },
      search: {
        name: '名称',
        sort: '排序',
        cate: '分类',
        name_placeholder: '请输入游戏名称',
        sort_placeholder: '请选择排序方式',
        cate_placeholder: '请选择游戏分类',
        sort_ctime_up: '创建时间正序',
        sort_ctime_down: '创建时间倒序',
        sort_hot_up: '热度正序',
        sort_hot_down: '热度倒序',
        sort_banner_up: 'banner 正序',
        sort_banner_down: 'banner 倒序'
      },
      setting: {
        title: '游戏设置',
        download_url: '下载地址',
        install_url: '安装地址',
        default: '恢复默认'
      },
      buttons: {
        confirm: '确定',
        cancel: '取消',
        modify: '修改',
        search: '搜索',
        all: '显示全部',
        exchange: '兑换',
        buy: '购买游戏',
        download: '下载游戏',
        update: '更新游戏',
        start: '启动游戏',
        downloading: '下载中',
        installing: '解压中',
        connect: '连接弹幕',
        document: '使用指南',
        service: '客服',
        gift_icon: '礼物贴纸'
      },
      detail: {
        package: '套餐',
        days: '天数',
        price: '价格',
        info: '详细信息',
        limit: '开播限制',
        divide: '分成比例',
        divide_every: '每收到',
        divide_gifts: '礼物，扣除',
        divide_diamonds: '钻石',
        utime: '更新时间',
        partition: '玩法分区',
        lang: '支持语言',
        platform: '支持平台',
        config: '电脑配置',
        buy: '购买',
        order: '确认订单',
        code: '折扣券或免费激活码',
        code_placeholder: '请输入折扣券或免费激活码',
        live: '直播间',
        live_placeholder: '请输入直播间',
        expired: '已过期',
        purchased: '已购买',
        free: '免费',
        unknown: '未知',
        message_success_buy: '购买成功',
        not_gift: '暂无礼物贴纸'
      },
      recharge: {
        title: '充值',
        type: '充值方式',
        key: '卡密充值',
        vx: '微信充值',
        target: '充值目标',
        tip: '钻石可用于直播收益抽成',
        card: '充值卡',
        card_placeholder: '请输入卡密',
        amount: '充值数额',
        dui: '元可兑换',
        message_success: '充值成功',
        message_vx_success: '微信充值成功',
        message_qrcode: '请扫描二维码充值',
        message_timeout: '订单超时'
      },
      exchange: {
        title: '兑换游戏',
        code: '兑换码',
        code_placeholder: '请输入兑换码',
        used: '未使用',
        unused: '已使用',
        time: '可用时长',
        day: '天',
        success_message: '游戏兑换成功'
      }
    },
    en: {
      lang: 'English',
      system: {
        day: 'day',
        price: 'Price',
        diamond: 'Diamond',
        recharge: 'Recharge',
        logout: 'Log Out',
        all: 'All',
        viwe: 'Grid View',
        display: 'Display',
        result: "results's",
        without: 'Without',
        log: 'Log',
        last_open: 'Last Open',
        incomplete: 'Under development of functions, not yet open'
      },
      home: {
        redeem: 'Redeem game',
        manage: 'Manage backend',
        livelog: 'Live recording',
        recent: 'Recently updated'
      },
      login: {
        login: 'Login',
        dev_login: 'Developer login',
        register: 'Register',
        reset: 'Reset password',
        account: 'Account',
        phone: 'Phone',
        phone_placeholder: 'Please enter phone',
        password_placeholder: 'Please enter the password',
        code_placeholder: 'Please enter the code',
        password: 'Pawword',
        code: 'Code',
        get_code: 'Get phoneCode',
        remember: 'Remember password',
        register_account: 'Registered account',
        orther: 'Other operations',
        codelog: 'Phone code login',
        psdlog: 'Password login',
        forget: 'Forget password',
        back: 'Return to login',
        user: 'User',
        nickname: 'Nickname',
        guildId: 'Guild ID',
        withdraw: 'Withdraw account',
        user_placeholder: 'Please enter a user name',
        nickname_placeholder: 'Please enter a nickname',
        guildId_placeholder: 'Please enter a guild ID',
        withdraw_placeholder: 'Please enter a withdraw account',
        more: 'Fill in more information',
        receive: 'Receive',
        required: 'Required',
        format: 'The phone number format is incorrect'
      },
      menu: {
        mall: 'Mall',
        library: 'Library',
        home: 'Home',
        developer: 'Developer Center'
      },
      search: {
        name: 'Name',
        sort: 'Sort',
        cate: 'Category',
        name_placeholder: 'Please enter the game name',
        sort_placeholder: 'Please select sorting method',
        cate_placeholder: 'Please select a game category',
        sort_ctime_up: 'Create time positive order',
        sort_ctime_down: 'Create time reverse order',
        sort_hot_up: 'Heat positive order',
        sort_hot_down: 'Heat reverse order',
        sort_banner_up: 'Banner positive order',
        sort_banner_down: 'Banner reverse order'
      },
      setting: {
        title: 'GAME SETTINGS',
        download_url: 'Download address',
        install_url: 'Installation address',
        default: 'Restore Default'
      },
      buttons: {
        confirm: 'Confirm',
        cancel: 'Cancel',
        modify: 'Modify',
        search: 'Search',
        all: 'Show All',
        exchange: 'Exchange',
        buy: 'Buy Game',
        download: 'Download Game',
        update: 'Update Game',
        start: 'Start Game',
        downloading: 'Downloading',
        installing: 'Unzipping',
        connect: 'Connect barrage',
        document: 'Operating Guide',
        service: 'Customer Service',
        gift_icon: 'Gift stickers'
      },
      detail: {
        package: 'Package',
        days: 'Days',
        price: 'Price',
        info: 'Detailed information',
        limit: 'Broadcast restriction',
        divide: 'Divide into proportions',
        divide_every: 'For every',
        divide_gifts: 'gifts received, deduct',
        divide_diamonds: 'diamonds',
        utime: 'Update time',
        partition: 'Play partition',
        lang: 'Support language',
        platform: 'Support platform',
        config: 'Computer configuration',
        buy: 'Buy',
        order: 'Confirm Order',
        code: 'Discount coupon or free activation code',
        code_placeholder:
          'Please enter discount coupon or free activation code',
        live: 'live Room',
        live_placeholder: 'Please enter the live room',
        expired: 'Expired',
        purchased: 'Purchased',
        free: 'Free',
        unknown: 'Unknown',
        message_success_buy: 'Purchase successful',
        not_gift: 'There are currently no gift stickers available'
      },
      recharge: {
        title: 'Recharge',
        type: 'Type',
        key: 'Key',
        vx: 'Wechat',
        target: 'Target',
        tip: 'Diamonds can be used for live streaming revenue commission',
        card: 'Card',
        card_placeholder: 'Please enter the key',
        amount: 'Amount',
        dui: 'RMB can be exchanged for',
        message_success: 'Recharged successfully',
        message_vx_success: 'Wechat recharge successfully',
        message_qrcode: 'Please scan the QR code to recharge',
        message_timeout: 'Order timeout'
      },
      exchange: {
        title: 'Exchange game',
        code: 'Exchange code',
        code_placeholder: 'Please enter the exchange code',
        used: 'Used',
        unused: 'Unused',
        time: 'Available for',
        day: 'day',
        success_message: 'Exchange successful'
      }
    },
    tw: {
      lang: '繁体',
      system: {
        day: '天',
        price: '餘額',
        diamond: '鑽石',
        recharge: '充值',
        logout: '退出登錄',
        all: '全部',
        viwe: '網格視圖',
        display: '顯示',
        result: '個結果中的',
        without: '無',
        log: '日誌',
        last_open: '上次打開',
        incomplete: '功能開發中，暫未開放'
      },
      home: {
        redeem: '兌換遊戲',
        manage: '管理後台',
        livelog: '直播記錄',
        recent: '最近上新'
      },
      login: {
        login: '登錄',
        dev_login: '開發者登錄',
        register: '註冊',
        reset: '重置密碼',
        account: '賬號',
        phone: '手機號',
        phone_placeholder: '請輸入手機號',
        password_placeholder: '請輸入密碼',
        code_placeholder: '請輸入驗證碼',
        password: '密碼',
        code: '驗證碼',
        get_code: '獲取驗證碼',
        remember: '記住密碼',
        register_account: '註冊賬號',
        orther: '其他操作',
        codelog: '驗證碼登錄',
        psdlog: '密碼登錄',
        forget: '忘記密碼',
        back: '返回登錄',
        user: '用戶名',
        nickname: '暱稱',
        guildId: '公會ID',
        withdraw: '提現賬號',
        user_placeholder: '請輸入用戶名',
        nickname_placeholder: '請輸入暱稱',
        guildId_placeholder: '請輸入公會ID',
        withdraw_placeholder: '請輸入提現賬號',
        more: '填寫更多信息',
        receive: '收起',
        required: '必填',
        format: '手機號碼格式不正確'
      },
      menu: {
        mall: '商城',
        library: '庫',
        home: '主頁',
        developer: '開發者中心'
      },
      search: {
        name: '名稱',
        sort: '排序',
        cate: '分類',
        name_placeholder: '請輸入遊戲名稱',
        sort_placeholder: '請選擇排序方式',
        cate_placeholder: '請選擇遊戲分類',
        sort_ctime_up: '創建時間正序',
        sort_ctime_down: '創建時間倒序',
        sort_hot_up: '熱度正序',
        sort_hot_down: '熱度倒序',
        sort_banner_up: 'banner 正序',
        sort_banner_down: 'banner 倒序'
      },
      setting: {
        title: '遊戲設置',
        download_url: '下載地址',
        install_url: '安裝地址',
        default: '恢復默認'
      },
      buttons: {
        confirm: '確定',
        cancel: '取消',
        modify: '修改',
        search: '搜索',
        all: '顯示全部',
        exchange: '兌換',
        buy: '購買遊戲',
        download: '下載遊戲',
        update: '更新遊戲',
        start: '啟動遊戲',
        downloading: '下載中',
        installing: '解壓中',
        connect: '連接彈幕',
        document: '使用指南',
        service: '客服',
        gift_icon: '禮物貼紙'
      },
      detail: {
        package: '套餐',
        days: '天數',
        price: '價格',
        info: '詳細信息',
        limit: '開播限制',
        divide: '分成比例',
        divide_every: '每收到',
        divide_gifts: '禮物，扣除',
        divide_diamonds: '鑽石',
        utime: '更新時間',
        partition: '玩法分區',
        lang: '支持語言',
        platform: '支持平台',
        config: '電腦配置',
        buy: '購買',
        order: '確認訂單',
        code: '折扣券或免費激活碼',
        code_placeholder: '請輸入折扣券或免費激活碼',
        live: '直播間',
        live_placeholder: '請輸入直播間',
        expired: '已過期',
        purchased: '已購買',
        free: '免費',
        unknown: '未知',
        message_success_buy: '購買成功',
        not_gift: '暫無禮物貼紙'
      },
      recharge: {
        title: '充值',
        type: '充值方式',
        key: '卡密充值',
        vx: '微信充值',
        target: '充值目標',
        tip: '鑽石可用於直播收益抽成',
        card: '充值卡',
        card_placeholder: '請輸入卡密',
        amount: '充值數額',
        dui: '元可兌換',
        message_success: '充值成功',
        message_vx_success: '微信充值成功',
        message_qrcode: '請掃描二維碼充值',
        message_timeout: '訂單超時'
      },
      exchange: {
        title: '兌換遊戲',
        code: '兌換碼',
        code_placeholder: '請輸入兌換碼',
        used: '已使用',
        unused: '未使用',
        time: '可用時長',
        day: '天',
        success_message: '遊戲兌換成功'
      }
    }
  }
})

export default i18n
