/*
 * @Author: your name
 * @Date: 2020-07-28 18:10:47
 * @LastEditTime: 2020-07-29 17:42:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \my-project\src\utils\api.js
 */
import { get } from './request'
export const getSystemPlatInfo = p => get('kingdom.retl.get_sys_platform_info', p)
