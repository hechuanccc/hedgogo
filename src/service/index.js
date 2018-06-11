import axios from 'axios'
import url from './url.js'

export * from './identity.js'
export * from './user.js'
export * from './transaction.js'
export * from './setting.js'

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

/**
 * 获取下注纪录
 * Get bet record
 */
export const getBetRecord = ({ id, params } = {}) =>
    axios.get(`${url.bet.record}${id ? (id + '/') : ''}`, { params })

/**
 * 取消押注
 * Cancel a bet
 */
export const cancelBet = ({ id, data } = {}) =>
    axios.put(`${url.bet.retreat}${id ? (id + '/') : ''}`, data)
