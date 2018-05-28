'use strict'

const config = require('../../config')
const env = process.env.NODE_ENV === 'development' ? config.dev.env : config.build.env
const host = env.HOST.replace(/"/g, '')
const chatHost = env.CHATHOST.replace(/"/g, '') + '/v1/'
const prefix = host + '/manage/'
const managePrefix = host + '/v1/manage/'
const memberPrefix = host + '/v1/member/'

export default {
    bet: {
        record: managePrefix + 'betrecord/',
        retreat: managePrefix + 'betretreat/'
    },
    count: managePrefix + 'metrics/count/',
    game: {
        category: managePrefix + 'game/category/',
        draw: managePrefix + 'draw/',
        history: managePrefix + 'history/',
        list: managePrefix + 'game/',
        playset: managePrefix + 'game/playset/',
        result: managePrefix + 'result/',
        schedule: managePrefix + 'game/schedule/',
        scheduleRetreat: managePrefix + 'game/schedretreat/'
    },
    identity: {
        changePassword: prefix + 'password/',
        login: prefix + 'login/',
        logout: host + '/logout/',
        my: prefix + 'my/',
        permission: managePrefix + 'permissions/user/',
        refresh: prefix + 'login/refresh/'
    },
    log: {
        login: managePrefix + 'loginrecord/',
        action: managePrefix + 'actionrecord/'
    },
    report: {
        commission: managePrefix + 'report/agent/profit/',
        deposit: managePrefix + 'report/deposit/',
        finance: managePrefix + 'report/assets/finance/',
        member: managePrefix + 'report/member/',
        membership: managePrefix + 'report/count/membership/',
        onlinepay: managePrefix + 'report/online_pay/',
        overview: managePrefix + 'report/overview/',
        transaction: managePrefix + 'report/transaction/',
        withdraw: managePrefix + 'report/withdraw/'
    },
    setting: {
        agentLevel: managePrefix + 'agent_level/',
        announcement: managePrefix + 'announcement/',
        advpermission: managePrefix + 'advpermissions/',
        bank: managePrefix + 'bank/',
        banner: managePrefix + 'banner/',
        chatroom: chatHost + 'manage/room/',
        commission: managePrefix + 'commissionsetting/',
        envelope: managePrefix + 'envelope/',
        envelopeConfig: managePrefix + 'envelope/settings/',
        memberLevel: managePrefix + 'level/',
        message: managePrefix + 'message/',
        parameter: managePrefix + 'global-preferences/',
        permission: managePrefix + 'permissions/',
        promotion: managePrefix + 'promotion/',
        robot: chatHost + 'robot/',
        role: managePrefix + 'group/',
        website: managePrefix + 'website/home-page/',
        websiteDescription: managePrefix + 'website/descriptions/',
        websiteDescriptionRank: managePrefix + 'website/descriptions_ranks/',
        websiteAgreement: managePrefix + 'website/franchising-program-page/'
    },
    transaction: {
        bill: managePrefix + 'transaction/',
        type: managePrefix + 'transaction_type/',
        manualAdjust: managePrefix + 'manual_transaction/',
        onlinePay: managePrefix + 'transaction/onlinepayment/',
        onlinePayee: managePrefix + 'onlinepayee/',
        onlinePayer: managePrefix + 'onlinepayer/',
        paymentGateway: managePrefix + 'paymentgateway/',
        paymentType: managePrefix + 'paymenttype/',
        remitPayee: managePrefix + 'remitpayee/',
        withdraw: managePrefix + 'transaction/withdraw/',
        withdrawGateway: managePrefix + 'withdrawgateway/'
    },
    user: {
        agent: managePrefix + 'agent/',
        agentApplication: managePrefix + 'agentapplication/',
        batchBan: managePrefix + 'member/batch_ban/',
        member: managePrefix + 'member/',
        memberCheck: host + '/v1/member/username/',
        memberSearch: memberPrefix + 'search_member/',
        resetAgentPassword: prefix + 'password/agent/',
        resetMemberPassword: prefix + 'password/member/',
        resetWithdrawPassword: prefix + 'withdraw_password/member/',
        staff: managePrefix + 'staff/'
    }
}
