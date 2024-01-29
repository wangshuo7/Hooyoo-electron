import request from '../utils/rc4request'

// 游戏使用权
export const getGameUse = (data: any) => {
  return request.post('/zhuboduan/gameser/is_buygame', data)
}
// 是否登录
export const isLogin = () => {
  return request.post('/zhuboduan/gameser/is_login')
}
