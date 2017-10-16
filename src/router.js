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
    },
    {
        path: '/game_list',
        name: 'game_list',
        component: function (resolve) {
            require(['./views/game_manage/game_list.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true,
            title: Vue.t('nav.game_list'),
            agentPermission: 'true',
            group: 'game_manage'
        }
    },
    {
        path: '/staff',
        name: 'staff',
        component: function (resolve) {
            require(['./views/setting/staff.vue'], resolve)
        },
        meta: {
            group: 'setting',
            auth: true,
            title: Vue.t('nav.staff')
        }
    },
    {
        path: '/staff/add',
        name: 'staff_add',
        component: function (resolve) {
            require(['./views/setting/staff_form.vue'], resolve)
        },
        meta: {
            group: 'setting',
            auth: true,
            title: Vue.t('nav.add_staff')
        }
    },
    {
        path: '/staff/:staffId',
        name: 'staff_detail',
        component: function (resolve) {
            require(['./views/setting/staff_detail.vue'], resolve)
        },
        meta: {
            group: 'setting',
            auth: true,
            title: Vue.t('nav.staff_detail')
        }
    },
    {
        path: '/staff/:staffId/edit',
        name: 'staff_edit',
        component: function (resolve) {
            require(['./views/setting/staff_form.vue'], resolve)
        },
        meta: {
            group: 'setting',
            auth: true,
            title: Vue.t('staff.update_staff')
        }
    }
    ]
})
