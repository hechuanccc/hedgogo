'use strict'

const config = require('../config')
const env = process.env.NODE_ENV === 'development' ? config.dev.env : config.build.env
const host = env.HOST
const prefix = host + '/manage/'
const managePrefix = host + '/api/v1.0/manage/'

export default {
    my: prefix + 'my/',
    logout: host + '/logout/',
    static: host + '/static/',
    member: managePrefix + 'member/',
    agent: managePrefix + 'agent/',
    agentapplication: managePrefix + 'agentapplication/',
    level: managePrefix + 'level/',
    return: managePrefix + 'returnsetting/',
    bank: prefix + 'bank/',
    agentlevel: managePrefix + 'agentlevel/',
    commission: managePrefix + 'commissionsetting/',
    login: prefix + 'login/',
    resetmember: prefix + 'password/member/',
    resetagent: prefix + 'password/agent/',
    resetwithdraw: prefix + 'withdraw_password/member/',
    betrecords: managePrefix + 'member/betrecord/',
    staff: managePrefix + 'staff/',
    managerole: managePrefix + 'group/',
    permissionsUser: managePrefix + 'permissions/user/',
    passwordstaff: prefix + 'password/staff/',
    permissions: managePrefix + 'permissions/',
    staffPermissions: managePrefix + 'staff/permissions/'
}
