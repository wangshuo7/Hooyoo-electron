import request from '../utils/request'

// 教程列表
export const getLearnList = (data: any) => {
  return request.post('/commpublic/param/jiaocheng_list', data)
}
// 教程分类
export const getLearnCateList = () => {
  return request.post('/commpublic/param/jiaocheng_cate')
}
// 查看教程
export const getLearnInfo = (data: any) => {
  return request.post('/zhuboduan/jiaocheng/chakanjiaocheng', data)
}
