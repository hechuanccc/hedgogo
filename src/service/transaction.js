import axios from 'axios'
import url from './url.js'

/**
 * 获取交易信息
 * Get transaction information
 */
export const getTransaction = ({ id, params } = {}) =>
    axios.get(`${url.transaction.bill}${id ? (id + '/') : ''}`, { params })

/**
 * 更新交易信息（包含转帐充值、取款和线上支付）
 * Update transaction information, including remit, withdraw, and online pay
 * @param {String} type - 'bill', 'withdraw', and 'onlinePay'
 */
export const updateTransaction = (type, { id, data, params } = {}) =>
    axios({
        method: id ? 'put' : 'post',
        url: `${url.transaction[type]}${id ? (id + '/') : ''}`,
        data,
        params
    })

/**
 * 获取所有交易类型
 * Get all transaction types
 */
export const getTransactionType = (params = {}) =>
    axios.get(url.transaction.type, { params })

/**
 * 获取商户信息（包含支付方式、支付类型、支付商户、代付商户和转帐充值帐号）
 * Get merchant's information (including payment type, payment gateway, online payee, online payer, and remit payee)
 * @param {String} type - 'paymentType', 'paymentGateway' 'onlinePayee', 'onlinePayer', 'remitPayee'
 */
export const getMerchant = (type, { id, params } = {}) =>
    axios.get(`${url.transaction[type]}${id ? (id + '/') : ''}`, { params })

/**
 * 更新商户信息（包含支付方式、支付商户、代付商户和转帐充值帐号）
 * Update merchant's information (including payment type, online payee, online payer, and remit payee)
 * @param {String} type - 'paymentType', 'onlinePayee', 'onlinePayer', 'remitPayee'
 */
export const updateMerchant = (type, { id, data, params } = {}) =>
    axios({
        method: id ? 'put' : 'post',
        url: `${url.transaction[type]}${id ? (id + '/') : ''}`,
        data,
        params
    })
/**
 * 删除商户（包含转帐充值帐号）
 * Delete merchant (including remit payee)
 * @param {String} type - 'remitPayee'
 */
export const deleteMerchant = (type, id) =>
    axios.delete(`${url.transaction[type]}${id ? (id + '/') : ''}`)

/**
 * 调整支付方式顺序
 * Adjust payment type order
 */
export const adjustPaymentTypeOrder = ({ data, params } = {}) =>
    axios({
        method: 'post',
        url: `${url.transaction.paymentType}rank/`,
        data,
        params
    })

/**
 * 手工存提
 * Manually adjust member's balance
 */
export const manuallyAdjust = (transaction = {}) =>
    axios.post(url.transaction.manualAdjust, transaction)

/**
 * 取款补单
 * Check order (withdraw)
 */
export const withdrawCheckOrder = (id) =>
    axios.put(`${url.transaction.withdraw}${id}/refresh/`)

/**
 * 用户取款，代付商户自动出款
 * Withdraw throgh online payer
 */
export const autoWithdraw = ({ id, data } = {}) =>
    axios.put(`${url.transaction.withdraw}${id}/`, data)
