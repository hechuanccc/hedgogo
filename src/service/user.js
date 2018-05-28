import axios from 'axios'
import url from './url.js'

/**
 * 获取用户(会员、代理、代理申请、子帐号)信息
 * Get user (member, agent, agent application, and staff) information
 * @param {String} type - 'member', 'agent', 'agentApplication', and 'staff'
 */
export const getUser = (type = '', { id, params }) =>
    axios.get(`${url.user[type]}${id ? (id + '/') : ''}`, { params })

/**
 * 更新用户(会员、代理、代理申请、子帐号)信息
 * Get user (member, agent, agent application, and staff) information
 * @param {String} type - 'member', 'agent', 'agentApplication', and 'staff'
 */
export const updateUser = (type = '', { id, data, params }) => {
    return axios({
        method: id ? 'put' : 'post',
        url: `${url.user[type]}${id ? (id + '/') : ''}`,
        data,
        params
    })
}

/**
 * 快速搜索会员 by username_q
 * Quick search member by username_q
 */
export const searchMember = (params) => axios.get(url.user.memberSearch, { params })

/**
 * 确认会员是否存在 by username
 * Check if member exists by username
 */
export const checkMember = (params) => axios.get(url.user.memberCheck, { params })

/**
 * 重设会员密码 / 重设会员取款密码
 * Reset member's password / Reset member's withdrawal password
 * @param {Number} type - 1 for password / 2 for withdrawal password
 */
export const resetMemberPassword = (id, type) => {
    let _url = {
        1: url.user.resetMemberPassword,
        2: url.user.resetWithdrawPassword
    }
    return axios.post(_url[type], { account_id: id }, { emulateJSON: true })
}

/**
 * 批量禁用会员 by IP
 * Batch ban member(s) by ip
 */
export const batchBanMember = (ip) => axios.put(url.user.batchBan, { ip })

/**
 * 删除代理
 * Delete agent
 */
export const deleteAgent = (id) => axios.delete(`${url.user.agent}${id}/`)

/**
 * 重设代理密码
 * Reset Agent's password
 */
export const resetAgentPassword = (id) =>
    axios.post(url.user.resetAgentPassword, { account_id: id }, { emulateJSON: true })

/**
 * 删除子帐号
 * Delete staff
 */
export const deleteStaff = (id) => axios.delete(`${url.user.staff}${id}/`)
