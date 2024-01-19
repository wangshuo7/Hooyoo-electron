import request from '../utils/request'
// 登录
export const login = (data: any) => {
  return request.post('/zhuboduan/login/login', data)
}
// 注册
export const register = (data: any) => {
  return request.post('/zhuboduan/register/register', data)
}
// 获取手机验证码
export const getPhoneCode = (data: any) => {
  return request.post('/commpublic/yanzheng/get_code', data)
}
// 忘记密码
export const resettingPassword = (data: any) => {
  return request.post('/zhuboduan/login/zhaohuimima', data)
}
