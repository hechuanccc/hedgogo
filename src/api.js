'use strict'

const config = require('../config')
const env = process.env.NODE_ENV === 'development' ? config.dev.env : config.build.env
const host = env.HOST
const prefix = host + '/manage/'
const managePrefix = host + '/v1/manage/'

export default {
    my: prefix + 'my/',
    logout: host + '/logout/',
    static: host + '/static/',
    bill: managePrefix + 'transaction/',
    report_deposit: host + '/report/deposit/',
    transactiontype: managePrefix + 'transaction_type/',
    returnrate: prefix + 'report/returnrate/',
    envelope_settings: managePrefix + 'envelope/settings/',
    envelope: managePrefix + 'envelope/',
    member: managePrefix + 'member/',
    agent: managePrefix + 'agent/',
    game_list: managePrefix + 'game/',
    game_play: managePrefix + 'game/play/',
    game_schedule: managePrefix + 'game/schedule/',
    gameplay_odds: managePrefix + '/game/odds/',
    level: managePrefix + 'level/',
    return: managePrefix + 'returnsetting/',
    bank: prefix + 'bank/',
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
    returnreport: host + '/report/'
}
