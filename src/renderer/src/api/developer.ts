import request from '../utils/devrequest'
// 登录
export const developerLogin = (data: any) => {
  return request.post('/youxizuozhe/login/login', data)
}

// 获取手机验证码
export const getPhoneCode = (data: any) => {
  return request.post('/commpublic/yanzheng/get_code', data)
}

// 忘记密码
export const developerResetPsd = (data: any) => {
  return request.post('/youxizuozhe/login/zhaohuimima', data)
}

// 游戏列表
export const getDevloperGames = (data: any) => {
  return request.post('/youxizuozhe/game/index', data)
}
