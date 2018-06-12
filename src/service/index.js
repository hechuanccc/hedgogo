import axios from 'axios'
import url from './url.js'

export * from './identity.js'
export * from './user.js'
export * from './transaction.js'

/**
 * 获取(游戏、总览)报表
 * Get (game and general) report
 */
export const getReport = (type, { params } = {}) =>
    axios.get(`${url.report[type]}`, { params })

/**
 * 获取系统即时信息
 * Get system instant information
 */
export const getSystemCount = () => axios.get(url.count)
