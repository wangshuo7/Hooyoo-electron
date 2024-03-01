import request from '../utils/rc4request'

// 游戏使用权
export const getGameUse = (data: any) => {
  return request.post('/zhuboduan/gameser/is_buygame', data)
}
// 是否登录
export const isLogin = () => {
  return request.post('/zhuboduan/gameser/is_login')
}

// 获取TBox最新版本信息
export const getTBoxVersion = () => {
  return request.post('/zhuboduan/gameser/get_box_new_version')
}

// 获取游戏信息
export const getGameInfo = (data: any) => {
  return request.post('/zhuboduan/gameser/get_game_info', data)
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
