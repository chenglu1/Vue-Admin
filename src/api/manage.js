/*
 * @Author: your name
 * @Date: 2020-07-28 10:45:32
 * @LastEditTime: 2020-08-13 18:13:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \my-project\src\api\manage.js
 */
import request from '@/utils/request'
// eslint-disable-next-line no-unused-vars
import { post, get } from '@/utils/util'
const api = {
  user: '/user',
  role: '/role',
  service: '/service',
  permission: '/permission',
  getMenu: 'kingdom.retl.get_dis_employee_menu',
  permissionNoPager: '/permission/no-pager',
  orgTree: '/org/tree',
  getList: 'kingdom.retl.get_schedule_info'
}

export default api

export function getUserList (parameter) {
  return request({
    url: api.user,
    method: 'get',
    params: parameter
  })
}

export function getRoleList (parameter) {
  return request({
    url: api.role,
    method: 'get',
    params: parameter
  })
}

export function getServiceList (parameter) {
  return request({
    url: api.service,
    method: 'get',
    params: parameter
  })
}

export function getPermissions (parameter) {
  return request({
    url: api.permissionNoPager,
    method: 'get',
    params: parameter
  })
}

export function getOrgTree (parameter) {
  return request({
    url: api.orgTree,
    method: 'get',
    params: parameter
  })
}

// id == 0 add     post
// id != 0 update  put
export function saveService (parameter) {
  return request({
    url: api.service,
    method: parameter.id === 0 ? 'post' : 'put',
    data: parameter
  })
}

export function saveSub (sub) {
  return request({
    url: '/sub',
    method: sub.id === 0 ? 'post' : 'put',
    data: sub
  })
}

export function getMenu (parameter) {
  return get(
    api.getMenu,
    parameter
    )
}
export function getList (parameter) {
  return get(
    api.getList,
    parameter
    )
}
