import request from '../utils/rc4request'

// 游戏使用权
export const getGameUse = (data: any) => {
  return request.post('/zhuboduan/gameser/is_buygame', data)
}
// 是否登录
export const isLogin = () => {
  return request.post('/zhuboduan/gameser/is_login')
}

// 开播
export const startLiving = (data: any) => {
  return request.post('/zhuboduan/gameser/kb', data)
}
// 下播
export const endLiving = (data: any) => {
  return request.post('/zhuboduan/gameser/xb', data)
}
// 扣除钻石
export const deductDiamond = (data: any) => {
  return request.post('/zhuboduan/gameser/del_jifen', data)
}
// ping
export const getLivePing = (data: any) => {
  return request.post('/zhuboduan/gameser/ping_pong', data)
}
