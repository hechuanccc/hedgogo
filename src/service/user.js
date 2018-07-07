import axios from 'axios'
import url from './url.js'
import $ from '../utils/util'

/**
 * 获取用户(会员、代理、代理申请、子帐号)信息
 * Get user (member, agent, agent application, and staff) information
 * @param {String} type - 'member', 'agent', 'agentApplication', and 'staff'
 */
export const getUser = (type = '', { id, params } = {}) =>
    axios.get(`${url.user[type]}${id ? (id + '/') : ''}`, { params })

/**
 * 更新用户(会员、代理、代理申请、子帐号)信息
 * Get user (member, agent, agent application, and staff) information
 * @param {String} type - 'member', 'agent', 'agentApplication', and 'staff'
 */
export const updateUser = (type = '', { id, data, params } = {}, { action, object } = {}) =>
    axios({
        method: id ? 'put' : 'post',
        url: `${url.user[type]}${id ? (id + '/') : ''}`,
        data,
        params
    }).then(data => $.successHandler(data, { action, object }), $.errorHandler)

/**
 * 快速搜索会员 by username_q
 * Quick search member by username_q
 */
export const searchMember = (params = {}) => axios.get(url.user.memberSearch, { params })

/**
 * 确认会员是否存在 by username
 * Check if member exists by username
 */
export const checkMember = (params = {}) => axios.get(url.user.memberCheck, { params })

/**
 * 重设会员密码 / 重设会员取款密码
 * Reset member's password / Reset member's withdrawal password / Reset agnet's password
 * @param {Number} type - member / withdraw / agent
 */
export const resetPassword = (id, type) => {
    let _url = {
        member: url.user.resetMemberPassword,
        withdraw: url.user.resetWithdrawPassword,
        agent: url.user.resetAgentPassword
    }
    return axios.post(_url[type], { account_id: id }, { emulateJSON: true }).then(data => {
        return Promise.resolve(data)
    }, $.errorHandler)
}

/**
 * 批量禁用会员 by IP
 * Batch ban member(s) by ip
 */
export const batchBanMember = (ip, { action, object } = {}) =>
    axios.put(url.user.batchBan, { ip })
    .then(data => $.successHandler(data, { action, object }), $.errorHandler)

/**
 * 删除代理
 * Delete agent
 */
export const deleteAgent = (id, { action, object } = {}) =>
    axios.delete(`${url.user.agent}${id}/`)
    .then(data => $.successHandler(data, { action, object }), $.errorHandler)

/**
 * 删除子帐号
 * Delete staff
 */
export const deleteStaff = (id, { action, object } = {}) => axios.delete(`${url.user.staff}${id}/`)
.then(data => $.successHandler(data, { action, object }), $.errorHandler)
