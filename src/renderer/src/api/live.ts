import request from '../utils/request'

// 直播记录
export const getLiveRecording = (data: any) => {
  return request.post('/zhuboduan/my/zblog', data)
}

// 直播扣钻记录
export const deductDiamond = (data: any) => {
  return request.post('/zhuboduan/my/zblog_jifen', data)
}

// 下载礼物记录
export const downloadGiftLog = (data: {
  zhibo_id: number
  is_down: number
}) => {
  return request.post('/zhuboduan/gameser/download_zhibo_log', data)
}
