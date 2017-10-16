'use strict'

const config = require('../config')
const env = process.env.NODE_ENV === 'development' ? config.dev.env : config.build.env
const host = env.HOST
const prefix = host + '/manage/'
const managePrefix = host + '/api/v1.0/manage/'

export default {
    static: host + '/static/',
    member: managePrefix + 'member/',
    agent: managePrefix + 'agent/',
    level: managePrefix + 'level/',
    return: managePrefix + 'returnsetting/',
    bank: prefix + 'bank/',
    login: prefix + 'login/',
    resetmember: prefix + 'password/member/',
    resetwithdraw: prefix + 'withdraw_password/member/',
    betrecords: managePrefix + 'member/betrecord/',
    staff: managePrefix + 'staff/',
    managerole: managePrefix + 'group/',
    permissionsUser: managePrefix + 'permissions/user/',
    permissions: managePrefix + 'permissions/',
    staffPermissions: managePrefix + 'staff/permissions/',
    passwordstaff: prefix + 'password/staff/'
}
