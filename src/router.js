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
        path: '/bill/remit',
        name: 'bill-remit',
        component: function (resolve) {
            require(['./views/bill/remit.vue'], resolve)
        },
        meta: {
            group: 'bill',
            auth: true,
            disable_tabs: true,
            title: Vue.t('bill.remit_audit'),
            permission: 'list_remit_online_withdraw_page'
        }
    },
    {
        path: '/bill/online',
        name: 'bill-online',
        component: function (resolve) {
            require(['./views/bill/online.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true,
            title: Vue.t('bill.online_payment'),
            group: 'bill',
            permission: 'list_remit_online_withdraw_page'
        }
    },
    {
        path: '/bill/withdraw',
        name: 'bill-withdraw',
        component: function (resolve) {
            require(['./views/bill/withdraw.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true,
            title: Vue.t('bill.withdrawal_audit'),
            group: 'bill',
            permission: 'list_remit_online_withdraw_page'
        }
    },
    {
        path: '/bill/search',
        name: 'bill-search',
        component: function (resolve) {
            require(['./views/bill/search.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true,
            group: 'bill',
            title: Vue.t('bill.transcations_query')
        }
    },
    {
        path: '/envelope_settings',
        component: function (resolve) {
            require(['./views/envelope/envelope_config.vue'], resolve)
        },
        meta: {
            group: 'envelopes',
            auth: true,
            title: '红包设定'
        }
    }, {
        path: '/envelope_settings/add',
        component: function (resolve) {
            require(['./views/envelope/envelope_config_form.vue'], resolve)
        },
        meta: {
            group: 'envelopes',
            auth: true,
            title: '新增红包组'
        }
    }, {
        path: '/envelope_settings/:envelopeId/edit',
        component: function (resolve) {
            require(['./views/envelope/envelope_config_form.vue'], resolve)
        },
        meta: {
            group: 'envelopes',
            auth: true,
            title: '编辑红包组'
        }
    }, {
        path: '/envelope',
        component: function (resolve) {
            require(['./views/envelope/envelope.vue'], resolve)
        },
        meta: {
            group: 'envelopes',
            auth: true,
            title: '红包'
        }
    }, {
        path: '/envelope/add',
        component: function (resolve) {
            require(['./views/envelope/envelope_form.vue'], resolve)
        },
        meta: {
            group: 'envelopes',
            auth: true,
            title: '新增红包'
        }
    }, {
        path: '/envelope/:envelopeId/edit',
        component: function (resolve) {
            require(['./views/envelope/envelope_form.vue'], resolve)
        },
        meta: {
            group: 'envelopes',
            auth: true,
            title: '编辑红包'
        }
    },
    {
        path: '/transaction/:id',
        name: 'transaction',
        component: function (resolve) {
            require(['./views/bill/detail.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true,
            group: 'bill',
            title: Vue.t('nav.transaction')
        }
    },
    {
        path: '/bill/returnrate',
        name: 'returnrate',
        component: function (resolve) {
            require(['./views/bill/returnrate.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true,
            title: Vue.t('bill.return_report'),
            group: 'bill'
        }
    },
    {
        path: '/bill/returnrate/:returnId',
        name: 'returnrate_detail',
        component: function (resolve) {
            require(['./views/bill/returnrate_detail.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true,
            title: Vue.t('nav.returnrate'),
            group: 'bill'
        }
    },
    {
        path: '/bill/operation',
        name: 'bill-operation',
        component: function (resolve) {
            require(['./views/bill/operation.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true,
            title: Vue.t('bill.operation'),
            permission: 'manual_deposit_withdraw',
            group: 'bill'
        }
    },
    {
        path: '/bill/commission',
        name: 'bill-commission',
        component: function (resolve) {
            require(['./views/bill/commission.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true,
            title: Vue.t('nav.commission'),
            permission: 'calculate_commission',
            agentPermission: 'true',
            group: 'bill'
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
            require(['./views/game_manage/list.vue'], resolve)
        },
        meta: {
            auth: true,
            title: Vue.t('nav.game_list'),
            agentPermission: 'true',
            group: 'game_manage'
        }
    },
    {
        path: '/game_detailsetting/:id',
        name: 'game_detail',
        component: function (resolve) {
            require(['./views/game_manage/detailsetting.vue'], resolve)
        },
        meta: {
            auth: true,
            title: Vue.t('nav.game_detail'),
            agentPermission: 'true',
            group: 'game_manage'
        }
    },
    {
        path: '/game_detail/:id/edit',
        name: 'game_edit',
        component: function (resolve) {
            require(['./views/game_manage/form.vue'], resolve)
        },
        meta: {
            auth: true,
            title: Vue.t('nav.edit_game'),
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
    },
    {
        path: '/agent',
        name: 'agent',
        component: function (resolve) {
            require(['./views/agent/agent.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true,
            title: Vue.t('nav.agent'),
            group: 'agent'
        }
    },
    {
        path: '/agent/add',
        name: 'agent-add',
        component: function (resolve) {
            require(['./views/agent/form.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true,
            title: Vue.t('nav.agent_add'),
            group: 'agent'
        }
    },
    {
        path: '/agent/applications',
        name: 'agent-applications',
        component: function (resolve) {
            require(['./views/agent/applications.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true,
            title: Vue.t('nav.agent_application'),
            group: 'agent'
        }
    },
    {
        path: '/agent/:agentId',
        name: 'agent-detail',
        component: function (resolve) {
            require(['./views/agent/detail.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true,
            title: Vue.t('nav.agent_detail'),
            group: 'agent'
        }
    },
    {
        path: '/agent/:agentId/edit',
        name: 'agent-edit',
        component: function (resolve) {
            require(['./views/agent/form.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true,
            title: Vue.t('nav.edit_agent'),
            group: 'agent'
        }
    },
    {
        path: '/agent_application/:agentId',
        name: 'ageapplication_detail',
        component: function (resolve) {
            require(['./views/agent/application_detail.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true,
            title: Vue.t('nav.agent_application'),
            group: 'agent'
        }
    },
    {
        path: '/level',
        component: function (resolve) {
            require(['./views/setting/level.vue'], resolve)
        },
        meta: {
            auth: true,
            group: 'setting',
            title: Vue.t('nav.setting_level')
        }
    },
    {
        path: '/level/add',
        component: function (resolve) {
            require(['./views/setting/level_form.vue'], resolve)
        },
        meta: {
            auth: true,
            title: Vue.t('nav.member_level_add'),
            group: 'setting'
        }
    },
    {
        path: '/level/:levelId',
        component: function (resolve) {
            require(['./views/setting/level_detail.vue'], resolve)
        },
        meta: {
            auth: true,
            title: Vue.t('nav.level_detail'),
            group: 'setting'
        }
    },
    {
        path: '/level/:levelId/edit',
        component: function (resolve) {
            require(['./views/setting/level_form.vue'], resolve)
        },
        meta: {
            group: 'setting',
            title: Vue.t('nav.member_level_edit'),
            auth: true
        }
    },
    {
        path: '/online_payee',
        component: function (resolve) {
            require(['./views/setting/online_payee.vue'], resolve)
        },
        meta: {
            group: 'setting',
            auth: true,
            title: Vue.t('nav.setting_online_payee')
        }
    },
    {
        path: '/online_payee/add',
        component: function (resolve) {
            require(['./views/setting/online_payee_form.vue'], resolve)
        },
        meta: {
            group: 'setting',
            title: Vue.t('setting.create_online_payee'),
            auth: true
        }
    },
    {
        path: '/online_payee/:online_payeeId',
        component: function (resolve) {
            require(['./views/setting/online_payee_detail.vue'], resolve)
        },
        meta: {
            group: 'setting',
            title: Vue.t('nav.online_payee_detail'),
            auth: true
        }
    },
    {
        path: '/online_payee/:online_payeeId/edit',
        component: function (resolve) {
            require(['./views/setting/online_payee_form.vue'], resolve)
        },
        meta: {
            group: 'setting',
            title: Vue.t('nav.online_payee_detail_edit'),
            auth: true
        }
    },
    {
        path: '/paymenttype',
        component: function (resolve) {
            require(['./views/setting/payment_type.vue'], resolve)
        },
        meta: {
            group: 'setting',
            auth: true,
            title: Vue.t('nav.payment_type_setting')
        }
    },
    {
        path: '/paymenttype/:id/edit',
        component: function (resolve) {
            require(['./views/setting/payment_form.vue'], resolve)
        },
        meta: {
            group: 'setting',
            auth: true,
            permission: 'change_paymenttype',
            title: Vue.t('nav.payment_type_setting_detail')
        }
    },
    {
        path: '/remit_payee',
        component: function (resolve) {
            require(['./views/setting/payee.vue'], resolve)
        },
        meta: {
            group: 'setting',
            auth: true,
            title: Vue.t('nav.setting_remit_payee')
        }
    },
    {
        path: '/remit_payee/add',
        component: function (resolve) {
            require(['./views/setting/payee_form.vue'], resolve)
        },
        meta: {
            group: 'setting',
            auth: true,
            title: Vue.t('nav.remit_payee_add')
        }
    },
    {
        path: '/remit_payee/:payeeId',
        component: function (resolve) {
            require(['./views/setting/payee_detail.vue'], resolve)
        },
        meta: {
            group: 'setting',
            auth: true,
            title: Vue.t('nav.remit_payee_detail')
        }
    },
    {
        path: '/remit_payee/:payeeId/edit',
        component: function (resolve) {
            require(['./views/setting/payee_form.vue'], resolve)
        },
        meta: {
            group: 'setting',
            title: Vue.t('nav.remit_payee_update'),
            auth: true
        }
    },
    {
        path: '/return',
        component: function (resolve) {
            require(['./views/setting/return.vue'], resolve)
        },
        meta: {
            group: 'setting',
            auth: true,
            title: Vue.t('nav.setting_return')
        }
    },
    {
        path: '/return/add',
        component: function (resolve) {
            require(['./views/setting/return_form.vue'], resolve)
        },
        meta: {
            group: 'setting',
            auth: true,
            title: Vue.t('nav.setting_return_add')
        }
    },
    {
        path: '/return/:returnId/edit',
        component: function (resolve) {
            require(['./views/setting/return_form.vue'], resolve)
        },
        meta: {
            group: 'setting',
            auth: true,
            title: Vue.t('nav.setting_return_edit')
        }
    },
    {
        path: '/commission',
        component: function (resolve) {
            require(['./views/setting/commission.vue'], resolve)
        },
        meta: {
            group: 'setting',
            auth: true,
            title: Vue.t('nav.setting_commission')
        }
    },
    {
        path: '/commission/add',
        component: function (resolve) {
            require(['./views/setting/commission_form.vue'], resolve)
        },
        meta: {
            group: 'setting',
            auth: true,
            title: Vue.t('nav.setting_commission_add')
        }
    },
    {
        path: '/commission/:commissionId/edit',
        component: function (resolve) {
            require(['./views/setting/commission_form.vue'], resolve)
        },
        meta: {
            group: 'setting',
            auth: true,
            title: Vue.t('nav.setting_commission_edit')
        }
    },
    {
        path: '/report/login',
        name: 'report_login',
        component: function (resolve) {
            require(['./views/report/login_record.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true,
            title: Vue.t('nav.login_record'),
            group: 'report'
        }
    },
    {
        path: '/report/actionrecord',
        name: 'action_record',
        component: function (resolve) {
            require(['./views/report/action_record.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true,
            title: Vue.t('nav.action_record'),
            group: 'report'
        }
    }
    ]
})
