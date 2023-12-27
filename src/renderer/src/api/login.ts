import request from '../utils/request'
// 登录
export const login = (data: any) => {
  return request.post('/zhuboduan/login/login', data)
}
// 注册
export const register = (data: any) => {
  return request.post('/zhuboduan/register/register', data)
}
