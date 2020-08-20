/*
 * @Author: your name
 * @Date: 2020-07-28 10:45:32
 * @LastEditTime: 2020-08-06 13:45:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \my-project\src\router\index.js
 */
import Vue from 'vue'
import Router from 'vue-router'
// eslint-disable-next-line no-unused-vars
import { BasicLayout, BlankLayout, PageView, RouteView } from '@/layouts'
import { constantRouterMap, asyncRouterMap } from '@/config/router.config'
 debugger
 console.log(constantRouterMap)
 console.log(asyncRouterMap)
// hack router push callback
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap.concat(asyncRouterMap)
})
