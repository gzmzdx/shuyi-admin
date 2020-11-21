import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/library',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/library/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/library',
    method: 'put',
    data
  })
}

export default { add, edit, del }
