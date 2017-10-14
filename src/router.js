import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Router from 'vue-router'
import locales from './i18n/locales'

Vue.use(Router)
Vue.use(VueI18n)

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

export default new Router({
    scrollBehavior: () => ({ y: 0 }),
    routes: [{
        name: 'login',
        path: '/login',
        component: function (resolve) {
            require(['./views/login.vue'], resolve)
        },
        meta: {
            agentPermission: 'true',
            title: Vue.t('nav.login'),
            auth: false
        }
    },
    {
        path: '/',
        name: 'overview',
        component: function (resolve) {
            require(['./views/overview.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true,
            agentPermission: 'true',
            title: Vue.t('nav.overview'),
            group: 'overview'
        }
    },
    {
        path: '/member',
        name: 'member',
        component: function (resolve) {
            require(['./views/member/member.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true,
            title: Vue.t('nav.member'),
            agentPermission: 'true',
            group: 'member'
        }
    },
    {
        path: '/member/add',
        name: 'member-add',
        component: function (resolve) {
            require(['./views/member/form.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true,
            title: Vue.t('nav.member_add'),
            group: 'member'
        }
    },
    {
        path: '/member/:memberId',
        name: 'member-detail',
        component: function (resolve) {
            require(['./views/member/detail.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true,
            title: Vue.t('nav.member_detail'),
            group: 'member'
        }
    },
    {
        path: '/member/:memberId/edit',
        name: 'member-edit',
        component: function (resolve) {
            require(['./views/member/form.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true,
            title: Vue.t('nav.edit_member'),
            group: 'member'
        }
    }
    ]
})
