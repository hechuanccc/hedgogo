import Vue from 'vue'
import VueRouter from 'vue-router'
import VueI18n from 'vue-i18n'
import i18n from './i18n'
import VueCookie from 'vue-cookie'
import Moment from 'vue-moment'
import store from './vuex/store'
import { sync } from 'vuex-router-sync'
import { handleError } from './utils/handleError'
import router from './router'
import Vue2Filters from 'vue2-filters'
import axios from 'axios'
import Notifications from './plugin/NotificationPlugin'
import { DatePicker } from 'element-ui'

import App from './views/App'

let url = window.location.href
const HTTPS = process.env.HTTPS
if (HTTPS && HTTPS.replace(/"/g, '') === '1') {
    if (window.location.protocol === 'http:') {
        window.location.replace(url.replace(/http:/, 'https:'))
    }
}

const config = require('../config')
const env = process.env.NODE_ENV === 'development' ? config.dev.env : config.build.env
Vue.prototype.$http = axios
Vue.use(Vue2Filters)
Vue.use(VueRouter)
Vue.use(Moment)
Vue.use(VueI18n)
Vue.use(VueCookie)
Vue.use(Notifications)
Vue.use(DatePicker)

// if we set xhr.withCredentials = true, all xhr request will send with credential cookies
// for example (session_id, access_token, csrf_token), but not all the browser supports
// especially mobile browser
// @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials
// so we need to set a common header 'Authorization' for sending credentials
// Vue.http.options.credentials = true
if (VueCookie.get('access_token')) {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + VueCookie.get('access_token')
}

axios.interceptors.response.use(response => {
    if (response.data.code === 2000) {
        return response.data.data
    } else if (response.data.code === 9007) {
        router.push({
            path: '/login',
            query: {
                next: router.fullPath
            }
        })
    } else {
        return Promise.reject(handleError(response.data.msg))
    }
}, () => {
    return Promise.reject(i18n.t('system_msg.server_error'))
})

router.beforeEach((to, from, next) => {
    if (to.meta.auth) {
        if (VueCookie.get('access_token')) {
            next()
        } else {
            let nextPage = to.fullPath
            let target
            if (nextPage.indexOf('/login?next=') >= 0) {
                // if user want to go back, we know that transition.from is route "login"
                // so to accurately bring user to right route, we get next route from "next" query value
                target = from.query.next
            } else {
                target = '/login?next=' + nextPage
            }
            router.push(target)
        }
    } else {
        next()
    }
})

router.afterEach((route) => {
    document.title = route.meta.title + ' - ' + env.NAME
})

sync(store, router)

const app = new Vue({
    router,
    store,
    i18n,
    ...App
}).$mount('#app')

export { app, router, store }
