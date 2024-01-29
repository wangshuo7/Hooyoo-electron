import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import md5 from 'md5'
import { rc4Encrypt, rc4Decrypt } from './rc4'

const request = axios.create({
  baseURL: '/api',
  timeout: 5000, // 请求超时时间
  headers: {
    authtoken: '',
    authtoken2: '1',
    authtokentype: 'tstr',
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

// 请求拦截器
request.interceptors.request.use(
  (config: AxiosRequestConfig): any => {
    const authToken = localStorage.getItem('authtoken')
    const salt =
      'fdsjfkdj7789附件是777744164878#%*(*&%@打开哦怕,,8飞弹8风是9放到7是否8'
    const rc4Key = md5(authToken + salt)
      .split('')
      .reverse()
      .join('')

    if (config.data) {
      const encryptedData = rc4Encrypt(rc4Key, JSON.stringify(config.data))
      config.data = { ciphertext: encryptedData }
    }
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
    const authToken = localStorage.getItem('authtoken')
    const salt =
      'fdsjfkdj7789附件是777744164878#%*(*&%@打开哦怕,,8飞弹8风是9放到7是否8'
    const rc4Key = md5(authToken + salt)
      .split('')
      .reverse()
      .join('')

    const decryptedData = rc4Decrypt(rc4Key, response.data)
    response.data = JSON.parse(decryptedData)
    return response.data
  },
  (error) => {
    // 处理响应错误
    return Promise.reject(error)
  }
)
// 导出Axios实例
export default request
