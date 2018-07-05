import axios from 'axios'
import url from './url.js'
import $ from '../utils/util'

/**
 * 获取配置(代理等级、会员等级、公告、银行、佣金、Banner、站内信、优惠活动、网站管理、聊天室、角色、权限)信息
 * Get management setting (agent level, member level, announcement, bank, commission, banner, message, promotion, website, chat room, role, and permission) information
 * @param {String} type - 'agentLevel', 'memberLevel', 'announcement', 'bank', 'commission', 'banner', message', 'promotion', 'website', 'chatroom', 'role', and 'permission'
 */
export const getSetting = (type, { id, params } = {}) =>
    axios.get(`${url.setting[type]}${id ? (id + '/') : ''}`, { params })

/**
 * 更新配置(代理等级、会员等级、公告、银行、佣金、Banner、站内信、优惠活动、网站管理、聊天室、角色、权限)信息
 * Update management setting (agent level, member level, announcement, bank, commission, banner, message, promotion, website, chat room, robot, role, and permission) information
 * @param {String} type - 'agentLevel', 'memberLevel', 'announcement', 'bank', 'commission', 'banner', message', 'promotion', 'website', 'chatroom', 'robot', 'role', and 'permission'
 */
export const updateSetting = (type, { id, data, params } = {}, { action, object } = {}) =>
    axios({
        method: id ? 'put' : 'post',
        url: `${url.setting[type]}${id ? (id + '/') : ''}`,
        data,
        params
    }).then(data => {
        $.notify({}, { action, object })
        return Promise.resolve(data)
    }, error => {
        $.errorNotify(error)
        return Promise.reject()
    })

/**
 * 删除配置信息(公告、Banner、优惠活动、网站描述、佣金、会员等级、角色)
 * Delete management setting (announcement, banner, promotion, website description, commission, member level, and role) information
 * @param {String} type - 'announcement', 'banner', 'promotion', 'websiteDescription', 'commission', 'memberLevel', and 'role'
 */
export const deleteSetting = (type, id, { action, object } = {}) =>
    axios.delete(`${url.setting[type]}${id ? (id + '/') : ''}`).then(data => {
        $.notify({}, { action, object })
        return Promise.resolve(data)
    }, error => {
        $.errorNotify(error)
        return Promise.reject()
    })

/**
 * 更新系统参数
 * Update system parameters
 */
export const updateSystemParameter = ({ key, data } = {}, { action, object } = {}) =>
    axios.patch(`${url.setting.parameter}${key ? (key + '/') : ''}`, data).then(data => {
        $.notify({}, { action, object })
        return Promise.resolve(data)
    }, error => {
        $.errorNotify(error)
        return Promise.reject()
    })

/**
 * 更新网站、网站加盟合作文
 * Update website and agreement
 */
export const updateWebsite = (type, data, { action, object } = {}) =>
    axios.put(url.setting[type], data).then(data => {
        $.notify({}, { action, object })
        return Promise.resolve(data)
    }, error => {
        $.errorNotify(error)
        return Promise.reject()
    })
