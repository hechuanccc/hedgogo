import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import VueI18n from 'vue-i18n'
import locales from './i18n/locales'
import VueCookie from 'vue-cookie'
import Moment from 'vue-moment'
import store from './vuex/store'
import { sync } from 'vuex-router-sync'
import router from './router'
import Vue2Filters from 'vue2-filters'

import App from './views/App'

const config = require('../config')
const env = process.env.NODE_ENV === 'development' ? config.dev.env : config.build.env

Vue.use(Vue2Filters)
Vue.use(VueResource)
Vue.use(VueRouter)
Vue.use(Moment)
Vue.use(VueI18n)
Vue.use(VueCookie)

// if we set xhr.withCredentials = true, all xhr request will send with credential cookies
// for example (session_id, access_token, csrf_token), but not all the browser supports
// especially mobile browser
// @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials
// so we need to set a common header 'Authorization' for sending credentials
Vue.http.options.credentials = true
if (VueCookie.get('access_token')) {
    Vue.http.headers.common['Authorization'] = 'Bearer ' + VueCookie.get('access_token')
}

let navLang = navigator.language || navigator.userLanguage
if (navLang === 'zh-CN' || navLang === 'zh-cn') {
    Vue.config.lang = 'cn'
} else if (navLang === 'en-US' || navLang === 'en-us') {
    Vue.config.lang = 'en'
} else {
    Vue.config.lang = 'cn'
}

Object.keys(locales).forEach(lang => {
    Vue.locale(lang, locales[lang])
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
    ...App
}).$mount('#app')

export { app, router, store }
