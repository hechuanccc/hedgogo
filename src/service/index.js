import axios from 'axios'
import url from './url.js'
import $ from '../utils/util'

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
export const getSystemCount = () =>
    axios.get(url.count)

/**
 * 获取游戏信息 (游戏列表、玩法分类、玩法、开奖结果、期数和撤单期数)
 * Get game information (game list, category, playset, draw, schedule, and retreating schedule)
 * @param {String} type - 'list', 'category', 'playset', 'draw', 'schedule', and 'scheduleRetreat'
 */
export const getGame = (type, { id, params } = {}) =>
    axios.get(`${url.game[type]}${id ? (id + '/') : ''}`, { params })

/**
 * 更新游戏信息 (游戏列表、游戏玩法、开奖结果和撤单期数)
 * Update game information (game list, playset, result and retreating schedule)
 * @param {String} type - 'list', 'playset', 'result', and 'scheduleRetreat'
 */
export const updateGame = (type = '', { id, data, params } = {}, { action, object } = {}) =>
    axios({
        method: id ? 'put' : 'post',
        url: `${url.game[type]}${id ? (id + '/') : ''}`,
        data,
        params
    }).then(data => $.successHandler(data, { action, object }), $.errorHandler)

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
export const cancelBet = ({ id, data } = {}, { action, object } = {}) =>
    axios.put(`${url.bet.retreat}${id ? (id + '/') : ''}`, data)
    .then(data => $.successHandler(data, { action, object }), $.errorHandler)
