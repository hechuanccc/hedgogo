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
            group: 'financing',
            auth: true,
            disable_tabs: true,
            title: Vue.t('nav.remit'),
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
            title: Vue.t('nav.online_pay_orders'),
            group: 'financing',
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
            title: Vue.t('nav.withdraw_request'),
            group: 'financing',
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
            group: 'financing',
            title: Vue.t('nav.transaction')
        }
    },
    {
        path: '/envelope_settings',
        component: function (resolve) {
            require(['./views/marketing/envelope/envelope_config.vue'], resolve)
        },
        meta: {
            group: 'setting',
            auth: true,
            title: Vue.t('nav.envelope_setting')
        }
    }, {
        path: '/envelope_settings/add',
        component: function (resolve) {
            require(['./views/marketing/envelope/envelope_config_form.vue'], resolve)
        },
        meta: {
            group: 'setting',
            auth: true,
            title: Vue.t('envelope.add_setting')
        }
    }, {
        path: '/envelope_settings/:envelopeId/edit',
        component: function (resolve) {
            require(['./views/marketing/envelope/envelope_config_form.vue'], resolve)
        },
        meta: {
            group: 'setting',
            auth: true,
            title: Vue.t('envelope.edit_envelope_setting')
        }
    }, {
        path: '/envelope',
        component: function (resolve) {
            require(['./views/marketing/envelope/envelope.vue'], resolve)
        },
        meta: {
            group: 'marketing',
            auth: true,
            title: Vue.t('nav.envelope')
        }
    }, {
        path: '/envelope/add',
        component: function (resolve) {
            require(['./views/marketing/envelope/envelope_form.vue'], resolve)
        },
        meta: {
            group: 'marketing',
            auth: true,
            title: Vue.t('envelope.add_envelope')
        }
    }, {
        path: '/envelope/:envelopeId/edit',
        component: function (resolve) {
            require(['./views/marketing/envelope/envelope_form.vue'], resolve)
        },
        meta: {
            group: 'marketing',
            auth: true,
            title: Vue.t('envelope.edit_envelope')
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
            group: 'financing',
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
            title: Vue.t('nav.returnrate'),
            group: 'financing'
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
            group: 'financing'
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
            title: Vue.t('member.manual_adjust'),
            permission: 'manual_deposit_withdraw',
            group: 'financing'
        }
    },
    {
        path: '/agent/commission',
        name: 'bill-commission',
        component: function (resolve) {
            require(['./views/bill/commission.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true,
            title: Vue.t('nav.commission_report'),
            permission: 'calculate_commission',
            agentPermission: 'true',
            group: 'agent'
        }
    },
    {
        path: '/member',
        name: 'member',
        component: function (resolve) {
            require(['./views/users/member/member.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true,
            title: Vue.t('nav.member'),
            agentPermission: 'true',
            group: 'users'
        }
    },
    {
        path: '/member/add',
        name: 'member-add',
        component: function (resolve) {
            require(['./views/users/member/form.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true,
            title: Vue.t('nav.member_add'),
            group: 'users'
        }
    },
    {
        path: '/member/:memberId',
        name: 'member-detail',
        component: function (resolve) {
            require(['./views/users/member/detail.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true,
            title: Vue.t('nav.member_detail'),
            group: 'users'
        }
    },
    {
        path: '/member/:memberId/edit',
        name: 'member-edit',
        component: function (resolve) {
            require(['./views/users/member/form.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true,
            title: Vue.t('nav.edit_member'),
            group: 'users'
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
        path: '/game_detail/:id',
        name: 'game_detail',
        component: function (resolve) {
            require(['./views/game_manage/detail.vue'], resolve)
        },
        meta: {
            auth: true,
            title: Vue.t('nav.game_manage'),
            agentPermission: 'true',
            group: 'game_manage'
        }
    },
    {
        path: '/staff',
        name: 'staff',
        component: function (resolve) {
            require(['./views/users/staff/staff.vue'], resolve)
        },
        meta: {
            group: 'users',
            auth: true,
            title: Vue.t('nav.staff')
        }
    },
    {
        path: '/staff/add',
        name: 'staff_add',
        component: function (resolve) {
            require(['./views/users/staff/staff_form.vue'], resolve)
        },
        meta: {
            group: 'users',
            auth: true,
            title: Vue.t('nav.add_staff')
        }
    },
    {
        path: '/staff/:staffId',
        name: 'staff_detail',
        component: function (resolve) {
            require(['./views/users/staff/staff_detail.vue'], resolve)
        },
        meta: {
            group: 'users',
            auth: true,
            title: Vue.t('nav.staff_detail')
        }
    },
    {
        path: '/staff/:staffId/edit',
        name: 'staff_edit',
        component: function (resolve) {
            require(['./views/users/staff/staff_form.vue'], resolve)
        },
        meta: {
            group: 'users',
            auth: true,
            title: Vue.t('staff.update_staff')
        }
    },
    {
        path: '/agent',
        name: 'agent',
        component: function (resolve) {
            require(['./views/users/agent/agent.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true,
            title: Vue.t('nav.agent'),
            group: 'users'
        }
    },
    {
        path: '/agent/add',
        name: 'agent-add',
        component: function (resolve) {
            require(['./views/users/agent/form.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true,
            title: Vue.t('nav.agent_add'),
            group: 'users'
        }
    },
    {
        path: '/agent/applications',
        name: 'agent-applications',
        component: function (resolve) {
            require(['./views/users/agent/applications.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true,
            title: Vue.t('nav.agent_application'),
            group: 'users'
        }
    },
    {
        path: '/agent/:agentId',
        name: 'agent-detail',
        component: function (resolve) {
            require(['./views/users/agent/detail.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true,
            title: Vue.t('nav.agent_detail'),
            group: 'users'
        }
    },
    {
        path: '/agent/:agentId/edit',
        name: 'agent-edit',
        component: function (resolve) {
            require(['./views/users/agent/form.vue'], resolve)
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
            require(['./views/users/agent/application_detail.vue'], resolve)
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
        path: '/login_record',
        name: 'report_login',
        component: function (resolve) {
            require(['./views/logging/login_record.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true,
            title: Vue.t('nav.login_logs'),
            group: 'logging'
        }
    },
    {
        path: '/actionrecord',
        name: 'action_record',
        component: function (resolve) {
            require(['./views/logging/action_record.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true,
            title: Vue.t('nav.action_logs'),
            group: 'logging'
        }
    },
    {
        path: '/errors',
        name: 'errors',
        component: function (resolve) {
            require(['./views/logging/error.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true,
            title: Vue.t('nav.errors'),
            group: 'logging'
        }
    },
    {
        path: '/report/betrecord',
        name: 'report_betrecord',
        component: function (resolve) {
            require(['./views/betrecord/bet_record.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true,
            title: Vue.t('nav.bet_record'),
            group: 'betrecord'
        }
    },
    {
        path: '/report/betrecord/:betrecordId',
        name: 'betrecord_detail',
        component: function (resolve) {
            require(['./views/betrecord/betrecord_detail.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true,
            title: Vue.t('nav.bet_record_detail'),
            group: 'betrecord '
        }
    },
    {
        path: '/banner',
        component: function (resolve) {
            require(['./views/marketing/manage/banner.vue'], resolve)
        },
        meta: {
            group: 'marketing',
            auth: true,
            title: Vue.t('manage.title_banner')
        }
    },
    {
        path: '/announcement',
        component: function (resolve) {
            require(['./views/marketing/manage/announcement.vue'], resolve)
        },
        meta: {
            group: 'marketing',
            auth: true,
            title: Vue.t('manage.title_announcement')
        }
    },
    {
        path: '/website',
        component: function (resolve) {
            require(['./views/marketing/manage/website.vue'], resolve)
        },
        meta: {
            group: 'marketing',
            auth: true,
            title: Vue.t('manage.title_website')
        }
    },
    {
        path: '/messages',
        name: 'message',
        component: function (resolve) {
            require(['./views/marketing/message/messages.vue'], resolve)
        },
        meta: {
            group: 'marketing',
            title: Vue.t('nav.message'),
            auth: true
        }
    },
    {
        path: '/messages/add',
        name: 'messages_add',
        component: function (resolve) {
            require(['./views/marketing/message/messages_form.vue'], resolve)
        },
        meta: {
            group: 'marketing',
            title: Vue.t('nav.add_message'),
            auth: true
        }
    },
    {
        path: '/messages/:messagesId',
        name: 'messages_detail',
        component: function (resolve) {
            require(['./views/marketing/message/messages_detail.vue'], resolve)
        },
        meta: {
            group: 'marketing',
            title: Vue.t('nav.message_details'),
            auth: true
        }
    },
    {
        path: '/promotion',
        name: 'promotion',
        component: function (resolve) {
            require(['./views/marketing/promotion/promotion.vue'], resolve)
        },
        meta: {
            group: 'marketing',
            auth: true,
            title: Vue.t('promotion.title')
        }
    },
    {
        path: '/promotion/add',
        name: 'promotion_add',
        component: function (resolve) {
            require(['./views/marketing/promotion/promotion_form.vue'], resolve)
        },
        meta: {
            group: 'marketing',
            auth: true,
            title: Vue.t('promotion.add')
        }
    },
    {
        path: '/promotion/:promotionId',
        name: 'promotion_detail',
        component: function (resolve) {
            require(['./views/marketing/promotion/promotion_detail.vue'], resolve)
        },
        meta: {
            group: 'marketing',
            auth: true,
            title: Vue.t('promotion.detail')
        }
    },
    {
        path: '/promotion/:promotionId/edit',
        name: 'promotion_edit',
        component: function (resolve) {
            require(['./views/marketing/promotion/promotion_form.vue'], resolve)
        },
        meta: {
            group: 'marketing',
            auth: true,
            title: Vue.t('promotion.update')
        }
    },
    {
        path: '/change_password',
        name: 'change_password',
        component: function (resolve) {
            require(['./views/setting/change_password.vue'], resolve)
        },
        meta: {
            group: 'setting',
            auth: true,
            agentPermission: 'true',
            title: Vue.t('nav.change_password')
        }
    },
    {
        path: '/report/agent_report',
        name: 'agent_report',
        component: function (resolve) {
            require(['./views/users/agent/agent.vue'], resolve)
        },
        meta: {
            group: 'reporting',
            auth: true,
            agentPermission: 'true',
            title: Vue.t('nav.agent_report')
        }
    },
    {
        path: '/report/member_report',
        name: 'member_report',
        component: function (resolve) {
            require(['./views/users/member/member.vue'], resolve)
        },
        meta: {
            group: 'reporting',
            auth: true,
            agentPermission: 'true',
            title: Vue.t('nav.member_report')
        }
    },
    {
        path: '/report/online_member',
        name: 'online_member_report',
        component: function (resolve) {
            require(['./views/users/member/member.vue'], resolve)
        },
        meta: {
            group: 'reporting',
            auth: true,
            agentPermission: 'true',
            title: Vue.t('nav.online_member_report')
        }
    },
    {
        path: '/betrecord/recent',
        name: 'recent_bet_record',
        component: function (resolve) {
            require(['./views/betrecord/bet_record.vue'], resolve)
        },
        meta: {
            group: 'betrecord',
            auth: true,
            agentPermission: 'true',
            title: Vue.t('nav.recent_bet_records')
        }
    },
    {
        path: '/betrecord/history',
        name: 'bet_record_history',
        component: function (resolve) {
            require(['./views/betrecord/bet_record.vue'], resolve)
        },
        meta: {
            group: 'betrecord',
            auth: true,
            agentPermission: 'true',
            title: Vue.t('nav.bet_record_history')
        }
    },
    {
        path: '/betrecord/instant_view',
        name: 'instant_view',
        component: function (resolve) {
            require(['./views/betrecord/bet_record.vue'], resolve)
        },
        meta: {
            group: 'betrecord',
            auth: true,
            agentPermission: 'true',
            title: Vue.t('nav.instant_view')
        }
    },
    {
        path: '/game_settings',
        name: 'game_settings',
        component: function (resolve) {
            require(['./views/game_manage/list.vue'], resolve)
        },
        meta: {
            group: 'game_manage',
            auth: true,
            agentPermission: 'true',
            title: Vue.t('nav.game_settings')
        }
    },
    {
        path: '/game_play',
        name: 'game_plays',
        component: function (resolve) {
            require(['./views/game_manage/list.vue'], resolve)
        },
        meta: {
            group: 'game_manage',
            auth: true,
            agentPermission: 'true',
            title: Vue.t('nav.game_play_configurations')
        }
    },
    {
        path: '/odds',
        name: 'odds',
        component: function (resolve) {
            require(['./views/game_manage/list.vue'], resolve)
        },
        meta: {
            group: 'game_manage',
            auth: true,
            agentPermission: 'true',
            title: Vue.t('nav.odds_management')
        }
    },
    {
        path: '/lottery_draw',
        name: 'lottery_draw',
        component: function (resolve) {
            require(['./views/game_manage/list.vue'], resolve)
        },
        meta: {
            group: 'game_history',
            auth: true,
            agentPermission: 'true',
            title: Vue.t('nav.lottery_draw_per_game')
        }
    },
    {
        path: '/permissions',
        name: 'permissions',
        // component: function (resolve) {
        //     require(['./views/game_manage/list.vue'], resolve)
        // },
        meta: {
            group: 'setting',
            auth: true,
            agentPermission: 'true',
            title: Vue.t('nav.permissions')
        }
    },
    {
        path: '/roles',
        name: 'roles',
        // component: function (resolve) {
        //     require(['./views/game_manage/list.vue'], resolve)
        // },
        meta: {
            group: 'setting',
            auth: true,
            agentPermission: 'true',
            title: Vue.t('nav.roles')
        }
    },
    {
        path: '/global_parameters',
        name: 'global_parameters',
        // component: function (resolve) {
        //     require(['./views/game_manage/list.vue'], resolve)
        // },
        meta: {
            group: 'setting',
            auth: true,
            agentPermission: 'true',
            title: Vue.t('nav.global_parameters')
        }
    }
    ]
})
