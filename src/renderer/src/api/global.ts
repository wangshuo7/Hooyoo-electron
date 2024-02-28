import request from '../utils/request'

// 语言
export const getLanguage = (data: any) => {
  return request.post('/commpublic/param/lang', data)
}
// 分类
export const getCategory = (data: any) => {
  return request.post('/commpublic/param/cate', data)
}
// 平台
export const getPlatform = (data: any) => {
  return request.post('/commpublic/param/pingtai', data)
}
// 配置信息
export const getConfig = () => {
  return request.post('/commpublic/param/getconf')
}
// 贴牌信息
export const getGuildOem = (data: any) => {
  return request.post('/commpublic/param/tiepai', data)
}
// 礼物贴纸
export const getGiftIcon = (data: any) => {
  return request.post('/commpublic/param/game_conf_tt', data)
}
