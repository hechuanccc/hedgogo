'use strict'

const config = require('../config')
const env = process.env.NODE_ENV === 'development' ? config.dev.env : config.build.env
const host = env.HOST
const prefix = host + '/manage/'

export default {
    static: host + '/static/',
    login: prefix + 'login/'
}
