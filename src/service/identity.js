import qs from 'qs'
import axios from 'axios'
import url from './url.js'
import $ from '../utils/util'

/**
 * 修改密码
 * Change password
 */
export const changePassword = (user, { action } = {}) =>
    axios.post(url.identity.changePassword, user).then(() => {
        return Promise.resolve()
    }, $.errorHandler)

/**
 * 登录
 * Login
 */
export const login = (user, { action } = {}) =>
    axios.post(url.identity.login, qs.stringify(user), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(data => $.successHandler(data, { action }), $.errorHandler)

/**
 * 登出
 * Logout
 */
export const logout = ({ action } = {}) =>
    axios.post(url.identity.logout)
    .then(data => $.successHandler(data, { action }), $.errorHandler)

/**
 * 取得使用者身份
 * Get user's identity
 */
export const identity = () => axios.get(url.identity.my)

/**
 * 取得使用者权限
 * Get user's permission
 */
export const permission = () => axios.get(url.identity.permission)

/**
 * 刷新令牌
 * Refresh Token
 */
export const refresh = ({ token: refresh_token }) =>
    axios.post(url.identity.refresh, {
        refresh_token
    })
