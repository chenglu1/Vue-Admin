/*
 * @Author: your name
 * @Date: 2020-07-28 10:45:32
 * @LastEditTime: 2020-08-14 18:50:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \my-project\src\utils\request.js
 */
import axios from 'axios'
import { md5 } from 'md5js'
import { v4 as UUID } from 'uuid'
import store from '@/store'
import storage from 'store'
import notification from 'ant-design-vue/es/notification'

import { message } from 'ant-design-vue'
import { VueAxios } from './axios'

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: '/api',
  timeout: 10000 // 请求超时时间
})
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
// 异常拦截处理器
const errorHandler = (error) => {
  try {
  if (error.data) {
    const data = error.data
    // 从 localstorage 获取 token
    // eslint-disable-next-line camelcase
    const x_trace_user_id = storage.get('x_trace_user_id')
    if (error.status === 403) {
      notification.error({
        message: '登录过期，请重新登录',
        $description: data.kdjson.message
      })
    }
    // 401: 未登录
    // 未登录则跳转登录页面，并携带当前页面的路径
    // 在登录成功后返回当前页面，这一步需要在登录页操作。
    if (error.status === 401) {
      notification.error({
        message: '未登录',
        description: data.kdjson.message
      })
      // eslint-disable-next-line camelcase
      if (x_trace_user_id) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
      }
    }
    if (data.kdjson.flag === '001') {
      store.dispatch('Logout').then(() => {
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      })
      return
    }
    if (data.kdjson.flag === '0000') {
      notification.error({
        message: '请求错误',
        description: data.kdjson.msg
      })
      return
    }
    if (data.kdjson.flag === '0') {
      message.error(data.kdjson.msg)
    }
  }
} catch (error) {
  console.log(error)
}
}

// request interceptor
request.interceptors.request.use(config => {
 // 头部请求封装
 // eslint-disable-next-line camelcase
 let x_trace_user_id = storage.get('x-trace-user-id')
 // eslint-disable-next-line camelcase
 if (!x_trace_user_id) {
   // eslint-disable-next-line camelcase
   x_trace_user_id = UUID()
   storage.set('x-trace-user-id', x_trace_user_id)
 }
 // eslint-disable-next-line camelcase
 let { x_trace_page_id } = window
 // eslint-disable-next-line camelcase
 if (!x_trace_page_id) {
   // eslint-disable-next-line camelcase
   x_trace_page_id = UUID()
   // eslint-disable-next-line camelcase
   window.x_trace_page_id = x_trace_page_id
 }
 const headers = {
   'X-Kweb-Menu-Id': document.location.href,
   'X-Kweb-Trace-Req-Id': UUID(),
   'X-Kweb-Trace-Page-Id': x_trace_page_id,
   'X-Kweb-Trace-User-Id': x_trace_user_id,
   'X-Kweb-Location-Href': document.location.href,
   'X-Kweb-Timestamp': `${new Date().getTime()}`,
   'X-Kweb-Sign': md5(document.location.href),
   'X-Kweb-Api-Name': '',
   'X-Kweb-Api-Version': '4.0'
 }
 config.headers = Object.assign(config.headers, headers)
  return config
}, errorHandler)

// response interceptor
request.interceptors.response.use((response) => {
    // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
    // 否则的话抛出错误
    if (response.status === 200) {
      try {
        const val = response.data
        if (val.kdjson.flag === '1') {
          return response
        } else {
          errorHandler(response)
        }
      } catch (error) {
        // console.log(error);
      }
      return response
  } else {
    errorHandler(response)
  }
}, errorHandler)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, request)
  }
}
export default request
export {
  installer as VueAxios,
  request as axios
}
