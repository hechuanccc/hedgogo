'use strict'

const config = require('../config')
const env = process.env.NODE_ENV === 'development' ? config.dev.env : config.build.env
const host = env.HOST.replace(/"/g, '')
const chatHost = env.CHATHOST.replace(/"/g, '') + '/v1/'
const prefix = host + '/manage/'
const managePrefix = host + '/v1/manage/'
const memberPrefix = host + '/v1/member/'

export default {
    my: prefix + 'my/',
    logout: host + '/logout/',
    static: host + '/static/',
    bill: managePrefix + 'transaction/',
    report_deposit: managePrefix + 'report/deposit/',
    report_transaction: managePrefix + 'report/transaction/',
    report_onlinepay: managePrefix + 'report/online_pay/',
    transactiontype: managePrefix + 'transaction_type/',
    online_payer: managePrefix + 'onlinepayer/',
    returnrate: prefix + 'report/returnrate/',
    envelope_settings: managePrefix + 'envelope/settings/',
    envelope: managePrefix + 'envelope/',
    member: managePrefix + 'member/',
    report_member: managePrefix + 'report/member/',
    agent: managePrefix + 'agent/',
    game_list: managePrefix + 'game/',
    game_play: managePrefix + 'game/play/',
    game_draw: managePrefix + 'draw/',
    game_schedule: managePrefix + 'game/schedule/',
    game_schedretreat: managePrefix + 'game/schedretreat/',
    game_result: managePrefix + 'result/',
    game_history: managePrefix + 'history/',
    playset: managePrefix + 'game/playset/',
    level: managePrefix + 'level/',
    return: managePrefix + 'returnsetting/',
    bank: managePrefix + 'bank/',
    agentlevel: managePrefix + 'agentlevel/',
    commission: managePrefix + 'commissionsetting/',
    login: prefix + 'login/',
    resetmember: prefix + 'password/member/',
    resetagent: prefix + 'password/agent/',
    resetwithdraw: prefix + 'withdraw_password/member/',
    betrecords: managePrefix + 'betrecord/',
    staff: managePrefix + 'staff/',
    returnhistory: managePrefix + 'report/returnrate/history/',
    managerole: managePrefix + 'group/',
    permissionsUser: managePrefix + 'permissions/user/',
    passwordstaff: prefix + 'password/staff/',
    permissions: managePrefix + 'permissions/',
    advpermissions: managePrefix + 'advpermissions/',
    staffPermissions: managePrefix + 'staff/permissions/',
    agentapplication: managePrefix + 'agentapplication/',
    onlinepayee: managePrefix + 'onlinepayee/',
    paymenttype: managePrefix + 'paymenttype/',
    remitpayee: managePrefix + 'remitpayee/',
    paymentgateway: managePrefix + 'paymentgateway/',
    loginrecord: managePrefix + 'loginrecord/',
    action_record: managePrefix + 'actionrecord/',
    banner: managePrefix + 'banner/',
    announcement: managePrefix + 'announcement/',
    messages: managePrefix + 'message/',
    website: managePrefix + 'website/home-page/',
    onlinemembers: managePrefix + 'online_member/',
    promotion: managePrefix + 'promotion/',
    changePassword: prefix + 'password/',
    metrics_count: managePrefix + 'metrics/count/',
    manual_transaction: managePrefix + 'manual_transaction/',
    report_commission: managePrefix + 'report/commission/',
    gamecategory: managePrefix + 'game/category/',
    cancel_bet: managePrefix + 'betretreat/',
    transaction_withdraw: managePrefix + 'transaction/withdraw/',
    transaction_onlinepay: managePrefix + 'transaction/onlinepayment/',
    refresh_token: prefix + 'login/refresh/',
    global_preferences: managePrefix + 'global-preferences/',
    website_descriptions: managePrefix + 'website/descriptions/',
    website_descriptions_ranks: managePrefix + 'website/descriptions_ranks/',
    website_agreement: managePrefix + 'website/franchising-program-page/',
    report_overview: managePrefix + 'report/overview/',
    member_report: managePrefix + 'report/count/membership/',
    finance_report: managePrefix + 'report/assets/finance/',
    check_member: host + '/v1/member/username/',
    search_member: memberPrefix + 'search_member/',
    robot: chatHost + 'robot/'
}
