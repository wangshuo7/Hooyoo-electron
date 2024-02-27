import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { ElMessage } from 'element-plus'
import router from '../router'
const baseURL =
  process.env.NODE_ENV === 'production'
    ? 'http://box-server.huyouyun.cn'
    : '/api'
const request = axios.create({
  baseURL: baseURL,
  timeout: 5000, // 请求超时时间
  headers: {
    authToken: ''
    // 'content-type': 'application/x-www-form-urlencoded '
  }
})
// 请求拦截器
request.interceptors.request.use(
  (config: AxiosRequestConfig): any => {
    const authToken = localStorage.getItem('authtoken')
    if (authToken) {
      config.headers = {
        ...config.headers,
        authtoken: authToken
      }
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    const { code, msg } = response.data
    if (code === 205) {
      // 未登录
      ElMessage.error(msg)
      router.push('/login')
    } else if (code === 200) {
      return response.data
    } else if (code === 0) {
      // 请求失败
      ElMessage.error(msg)
      return Promise.reject(msg)
    }
  },
  (error) => {
    // 处理响应错误
    return Promise.reject(error)
  }
)
// 导出Axios实例
export default request
