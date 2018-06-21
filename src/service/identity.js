import qs from 'qs'
import axios from 'axios'
import url from './url.js'

/**
 * 修改密码
 * Change password
 */
export const changePassword = (user) =>
    axios.post(url.identity.changePassword, user)

/**
 * 登录
 * Login
 */
export const login = (user) =>
    axios.post(url.identity.login, qs.stringify(user), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })

/**
 * 登出
 * Logout
 */
export const logout = () => axios.post(url.identity.logout)

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
