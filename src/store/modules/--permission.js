/*
 * @Author: your name
 * @Date: 2020-07-28 10:45:32
 * @LastEditTime: 2020-08-10 17:08:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \my-project\src\store\modules\permission.js
 */
/* eslint-disable no-unused-vars */
import { asyncRouterMap, constantRouterMap } from '@/config/router.config'
import { getMenu } from '@/api/manage'
/**
 * 过滤账户是否拥有某一个权限，并将菜单从加载列表移除
 *
 * @param permission
 * @param route
 * @returns {boolean}
 */
function hasPermission (permission, route) {
  if (route.meta && route.meta.permission) {
    let flag = false
    for (let i = 0, len = permission.length; i < len; i++) {
      flag = route.meta.permission.includes(permission[i])
      if (flag) {
        return true
      }
    }
    return false
  }
  return true
}

/**
 * 单账户多角色时，使用该方法可过滤角色不存在的菜单
 *
 * @param roles
 * @param route
 * @returns {*}
 */
// eslint-disable-next-line
function hasRole(roles, route) {
  if (route.meta && route.meta.roles) {
    return route.meta.roles.includes(roles.id)
  } else {
    return true
  }
}

// function filterAsyncRouter (routerMap) {
//   const accessedRouters = routerMap.filter(route => {
//       if (route.children && route.children.length) {
//         route.children = filterAsyncRouter(route.children)
//       }

//     return false
//   })
//   return accessedRouters
// }

const permission = {
  state: {
    routers: constantRouterMap.concat(asyncRouterMap),
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap
    }
  },
  actions: {
    GenerateRoutes ({ commit }, data) {
      return new Promise((resolve, reject) => {
        getMenu().then(response => {
          const { items = [] } = response.kdjson
          commit('SET_ROUTERS', items)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default permission
