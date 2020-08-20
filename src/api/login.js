/*
 * @Author: your name
 * @Date: 2020-07-28 10:45:32
 * @LastEditTime: 2020-07-31 15:03:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \my-project\src\api\login.js
 */
import { post, get } from '@/utils/util'

const userApi = {
  Login: 'kingdom.retl.set_dis_employee_login',
  Logout: 'kingdom.retl.set_sys_logout',
  ForgePassword: '/auth/forge-password',
  Register: '/auth/register',
  twoStepCode: '/auth/2step-code',
  SendSms: '/account/sms',
  SendSmsErr: '/account/sms_err',
  // get my info
  UserInfo: 'kingdom.retl.get_user_info',
  UserMenu: '/user/nav'
}

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
export function login (parameter) {
  return post(
     userApi.Login,
     parameter
  )
}

export function getInfo (parameter) {
  return get(
    userApi.UserInfo,
    parameter
    )
}

export function logout (parameter) {
  return get(
    userApi.Logout,
    parameter
    )
}
