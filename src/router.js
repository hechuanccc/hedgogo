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
            require(['./views/Login.vue'], resolve)
        },
        meta: {
            title: Vue.t('nav.login'),
            auth: false
        }
    },
    {
        path: '/',
        name: 'overview',
        component: function (resolve) {
            require(['./views/Overview.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true,
            title: Vue.t('nav.overview'),
            group: 'overview'
        }
    },
    {
        path: '/bill/remit',
        name: 'bill-remit',
        component: function (resolve) {
            require(['./views/Bill/Remit.vue'], resolve)
        },
        meta: {
            group: 'financing',
            auth: true,
            disable_tabs: true,
            title: Vue.t('nav.remit'),
            permission: 'view_remit_transaction_page'
        }
    },
    {
        path: '/bill/online_pay',
        name: 'bill-online',
        component: function (resolve) {
            require(['./views/Bill/OnlinePay.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true,
            title: Vue.t('nav.online_pay_orders'),
            group: 'financing'
        }
    },
    {
        path: '/bill/withdraw',
        name: 'bill-withdraw',
        component: function (resolve) {
            require(['./views/Bill/Withdraw.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true,
            title: Vue.t('nav.withdraw_request'),
            group: 'financing',
            permission: 'view_withdraw_application_page'
        }
    },
    {
        path: '/bill/search',
        name: 'bill-search',
        component: function (resolve) {
            require(['./views/Bill/Search.vue'], resolve)
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
            require(['./views/Marketing/EnvelopeConfig.vue'], resolve)
        },
        meta: {
            group: 'setting',
            auth: true,
            title: Vue.t('nav.envelope_setting')
        }
    }, {
        path: '/envelope_settings/add',
        component: function (resolve) {
            require(['./views/Marketing/EnvelopeConfigForm.vue'], resolve)
        },
        meta: {
            group: 'setting',
            auth: true,
            title: Vue.t('envelope.add_setting'),
            permission: 'add_red_envelope'
        }
    }, {
        path: '/envelope_settings/:envelopeId/edit',
        component: function (resolve) {
            require(['./views/Marketing/EnvelopeConfigForm.vue'], resolve)
        },
        meta: {
            group: 'setting',
            auth: true,
            title: Vue.t('envelope.edit_envelope_setting')
        }
    }, {
        path: '/envelope',
        component: function (resolve) {
            require(['./views/Marketing/Envelope.vue'], resolve)
        },
        meta: {
            group: 'marketing',
            auth: true,
            title: Vue.t('nav.envelope')
        }
    }, {
        path: '/envelope/add',
        component: function (resolve) {
            require(['./views/Marketing/EnvelopeForm.vue'], resolve)
        },
        meta: {
            group: 'marketing',
            auth: true,
            title: Vue.t('envelope.add_envelope')
        }
    }, {
        path: '/envelope/:envelopeId/edit',
        component: function (resolve) {
            require(['./views/Marketing/EnvelopeForm.vue'], resolve)
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
            require(['./views/Bill/Detail.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true,
            group: 'financing',
            title: Vue.t('nav.transaction')
        }
    },
    {
        path: '/bill/operation',
        name: 'bill-operation',
        component: function (resolve) {
            require(['./views/Bill/Operation.vue'], resolve)
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
            require(['./views/Report/Commission.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true,
            title: Vue.t('nav.commission_report'),
            permission: 'export_agent_commission_report',
            group: 'agent'
        }
    },
    {
        path: '/member',
        name: 'member',
        component: function (resolve) {
            require(['./views/User/Member.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true,
            title: Vue.t('nav.member'),
            group: 'users'
        }
    },
    {
        path: '/online_member',
        name: 'online_member',
        component: function (resolve) {
            require(['./views/User/Member.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true,
            title: Vue.t('nav.online_member_list'),
            group: 'users'
        }
    },
    {
        path: '/member/add',
        name: 'member-add',
        component: function (resolve) {
            require(['./views/User/MemberForm.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true,
            title: Vue.t('nav.member_add'),
            group: 'users',
            permission: 'add_new_member'
        }
    },
    {
        path: '/member/:memberId',
        name: 'member-detail',
        component: function (resolve) {
            require(['./views/User/MemberDetail.vue'], resolve)
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
            require(['./views/User/MemberForm.vue'], resolve)
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
            require(['./views/Game/Game.vue'], resolve)
        },
        meta: {
            auth: true,
            title: Vue.t('nav.game_list'),
            group: 'game_manage'
        }
    },
    {
        path: '/game_detail/:id',
        name: 'game_detail',
        component: function (resolve) {
            require(['./views/Game/GameDetail.vue'], resolve)
        },
        meta: {
            auth: true,
            title: Vue.t('nav.game_manage'),
            group: 'game_manage'
        }
    },
    {
        path: '/game_history',
        name: 'game_history',
        component: function (resolve) {
            require(['./views/Result/History.vue'], resolve)
        },
        meta: {
            auth: true,
            title: Vue.t('nav.game_history'),
            group: 'game_history'
        }
    },
    {
        path: '/game_history/:id',
        name: 'history_detail',
        component: function (resolve) {
            require(['./views/Result/HistoryDetail.vue'], resolve)
        },
        meta: {
            auth: true,
            title: Vue.t('nav.game_history'),
            group: 'game_history'
        }
    },
    {
        path: '/staff',
        name: 'staff',
        component: function (resolve) {
            require(['./views/User/Staff.vue'], resolve)
        },
        meta: {
            group: 'users',
            auth: true,
            title: Vue.t('nav.staff'),
            permission: 'view_staff_management_page'
        }
    },
    {
        path: '/staff/add',
        name: 'staff_add',
        component: function (resolve) {
            require(['./views/User/StaffForm.vue'], resolve)
        },
        meta: {
            group: 'users',
            auth: true,
            title: Vue.t('nav.add_staff'),
            permission: 'add_new_staff'
        }
    },
    {
        path: '/staff/:staffId',
        name: 'staff_detail',
        component: function (resolve) {
            require(['./views/User/StaffDetail.vue'], resolve)
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
            require(['./views/User/StaffForm.vue'], resolve)
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
            require(['./views/User/Agent.vue'], resolve)
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
            require(['./views/User/AgentForm.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true,
            title: Vue.t('nav.agent_add'),
            group: 'users',
            permission: 'add_new_agent'
        }
    },
    {
        path: '/agent/applications',
        name: 'agent-applications',
        component: function (resolve) {
            require(['./views/User/AgentApplication.vue'], resolve)
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
            require(['./views/User/AgentDetail.vue'], resolve)
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
            require(['./views/User/AgentForm.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true,
            title: Vue.t('nav.edit_agent'),
            group: 'users'
        }
    },
    {
        path: '/agent_application/:agentId',
        name: 'ageapplication_detail',
        component: function (resolve) {
            require(['./views/User/AgentApplicationDetail.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true,
            title: Vue.t('nav.agent_application'),
            group: 'users'
        }
    },
    {
        path: '/level',
        component: function (resolve) {
            require(['./views/Setting/MemberLevel.vue'], resolve)
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
            require(['./views/Setting/MemberLevelForm.vue'], resolve)
        },
        meta: {
            auth: true,
            title: Vue.t('nav.member_level_add'),
            group: 'setting',
            permission: 'add_member_level'
        }
    },
    {
        path: '/level/:levelId',
        component: function (resolve) {
            require(['./views/Setting/MemberLevelDetail.vue'], resolve)
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
            require(['./views/Setting/MemberLevelForm.vue'], resolve)
        },
        meta: {
            group: 'setting',
            title: Vue.t('nav.member_level_edit'),
            auth: true,
            permission: 'update_memberlevel'
        }
    },
    {
        path: '/online_payee',
        component: function (resolve) {
            require(['./views/Setting/OnlinePayee.vue'], resolve)
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
            require(['./views/Setting/OnlinePayeeForm.vue'], resolve)
        },
        meta: {
            group: 'setting',
            title: Vue.t('setting.create_online_payee'),
            auth: true,
            permission: 'add_online_payee'
        }
    },
    {
        path: '/online_payee/:online_payeeId',
        component: function (resolve) {
            require(['./views/Setting/OnlinePayeeDetail.vue'], resolve)
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
            require(['./views/Setting/OnlinePayeeForm.vue'], resolve)
        },
        meta: {
            group: 'setting',
            title: Vue.t('nav.online_payee_detail_edit'),
            auth: true,
            permission: 'update_online_payee'
        }
    },

    {
        path: '/online_payer',
        component: function (resolve) {
            require(['./views/Setting/OnlinePayer.vue'], resolve)
        },
        meta: {
            group: 'setting',
            auth: true,
            title: Vue.t('nav.setting_online_payer')
        }
    },
    {
        path: '/online_payer/add',
        component: function (resolve) {
            require(['./views/Setting/OnlinePayerForm.vue'], resolve)
        },
        meta: {
            group: 'setting',
            title: Vue.t('setting.create_online_payer'),
            auth: true
        }
    },
    {
        path: '/online_payer/:online_payerId',
        component: function (resolve) {
            require(['./views/Setting/OnlinePayerDetail.vue'], resolve)
        },
        meta: {
            group: 'setting',
            title: Vue.t('nav.online_payer_detail'),
            auth: true
        }
    },
    {
        path: '/online_payer/:online_payerId/edit',
        component: function (resolve) {
            require(['./views/Setting/OnlinePayerForm.vue'], resolve)
        },
        meta: {
            group: 'setting',
            title: Vue.t('nav.online_payer_detail_edit'),
            auth: true
        }
    },
    {
        path: '/paymenttype',
        component: function (resolve) {
            require(['./views/Setting/PaymentType.vue'], resolve)
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
            require(['./views/Setting/PaymentTypeForm.vue'], resolve)
        },
        meta: {
            group: 'setting',
            auth: true,
            permission: 'update_onlinepayment',
            title: Vue.t('nav.payment_type_setting_detail')
        }
    },
    {
        path: '/remit_payee',
        component: function (resolve) {
            require(['./views/Setting/RemitPayee.vue'], resolve)
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
            require(['./views/Setting/RemitPayeeForm.vue'], resolve)
        },
        meta: {
            group: 'setting',
            auth: true,
            title: Vue.t('nav.remit_payee_add'),
            permission: 'add_remit_account'
        }
    },
    {
        path: '/remit_payee/:payeeId',
        component: function (resolve) {
            require(['./views/Setting/RemitPayeeDetail.vue'], resolve)
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
            require(['./views/Setting/RemitPayeeForm.vue'], resolve)
        },
        meta: {
            group: 'setting',
            title: Vue.t('nav.remit_payee_update'),
            auth: true,
            permission: 'update_remit_account'
        }
    },
    {
        path: '/commission',
        component: function (resolve) {
            require(['./views/Setting/Commission.vue'], resolve)
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
            require(['./views/Setting/CommissionForm.vue'], resolve)
        },
        meta: {
            group: 'setting',
            auth: true,
            title: Vue.t('nav.setting_commission_add'),
            permission: 'add_commission_setting'
        }
    },
    {
        path: '/commission/:commissionId/edit',
        component: function (resolve) {
            require(['./views/Setting/CommissionForm.vue'], resolve)
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
            require(['./views/Log/Login.vue'], resolve)
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
            require(['./views/Log/Action.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true,
            title: Vue.t('nav.action_logs'),
            group: 'logging'
        }
    },
    {
        path: '/report/betrecord',
        name: 'report_betrecord',
        component: function (resolve) {
            require(['./views/Report/BetRecord.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true,
            title: Vue.t('nav.bet_record'),
            group: 'betrecord'
        }
    },
    {
        path: '/report/betrecord/realtime',
        name: 'report_betrecord_realtime',
        component: function (resolve) {
            require(['./views/Report/BetRecord.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true,
            title: `${Vue.t('nav.bet_record')} - ${Vue.t('nav.instant_view')}`,
            group: 'betrecord'
        }
    },
    {
        path: '/report/betrecord/:betrecordId',
        name: 'betrecord_detail',
        component: function (resolve) {
            require(['./views/Report/BetRecordDetail.vue'], resolve)
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
            require(['./views/Marketing/Banner.vue'], resolve)
        },
        meta: {
            group: 'manage',
            auth: true,
            title: Vue.t('manage.title_banner')
        }
    },
    {
        path: '/announcement',
        component: function (resolve) {
            require(['./views/Marketing/Announcement.vue'], resolve)
        },
        meta: {
            group: 'manage',
            auth: true,
            title: Vue.t('manage.title_announcement')
        }
    },
    {
        path: '/website',
        component: function (resolve) {
            require(['./views/Marketing/Website.vue'], resolve)
        },
        meta: {
            group: 'manage',
            auth: true,
            title: Vue.t('manage.title_website')
        }
    },
    {
        path: '/messages',
        name: 'message',
        component: function (resolve) {
            require(['./views/Marketing/Message.vue'], resolve)
        },
        meta: {
            group: 'manage',
            title: Vue.t('nav.message'),
            auth: true
        }
    },
    {
        path: '/messages/add',
        name: 'messages_add',
        component: function (resolve) {
            require(['./views/Marketing/MessageForm.vue'], resolve)
        },
        meta: {
            group: 'marketing',
            title: Vue.t('nav.add_message'),
            auth: true,
            permission: 'add_new_message'
        }
    },
    {
        path: '/messages/:messagesId',
        name: 'messages_detail',
        component: function (resolve) {
            require(['./views/Marketing/MessageDetail.vue'], resolve)
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
            require(['./views/Marketing/Promotion.vue'], resolve)
        },
        meta: {
            group: 'manage',
            auth: true,
            title: Vue.t('promotion.title')
        }
    },
    {
        path: '/promotion/add',
        name: 'promotion_add',
        component: function (resolve) {
            require(['./views/Marketing/PromotionForm.vue'], resolve)
        },
        meta: {
            group: 'marketing',
            auth: true,
            title: Vue.t('promotion.add'),
            permission: 'add_promotion_activity'
        }
    },
    {
        path: '/promotion/:promotionId',
        name: 'promotion_detail',
        component: function (resolve) {
            require(['./views/Marketing/PromotionDetail.vue'], resolve)
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
            require(['./views/Marketing/PromotionForm.vue'], resolve)
        },
        meta: {
            group: 'marketing',
            auth: true,
            title: Vue.t('promotion.update'),
            permission: 'update_promotion_activity'
        }
    },
    {
        path: '/change_password',
        name: 'change_password',
        component: function (resolve) {
            require(['./views/ChangePassword.vue'], resolve)
        },
        meta: {
            group: 'setting',
            auth: true,
            title: Vue.t('nav.change_password')
        }
    },
    {
        path: '/report/finance_report/:agentId',
        name: 'agent_report',
        component: function (resolve) {
            require(['./views/Report/Finance.vue'], resolve)
        },
        meta: {
            group: 'reporting',
            auth: true,
            title: Vue.t('nav.agent_report')
        }
    },
    {
        path: '/report/finance_report',
        name: 'finance_report',
        component: function (resolve) {
            require(['./views/Report/Finance.vue'], resolve)
        },
        meta: {
            group: 'reporting',
            auth: true,
            title: Vue.t('nav.finance_report')
        }
    },
    {
        path: '/report/member_report',
        name: 'member_report',
        component: function (resolve) {
            require(['./views/Report/Membership.vue'], resolve)
        },
        meta: {
            group: 'reporting',
            auth: true,
            title: Vue.t('nav.member_report')
        }
    },
    {
        path: '/betrecord/instant_view',
        name: 'instant_view',
        component: function (resolve) {
            require(['./views/Report/BetRecord.vue'], resolve)
        },
        meta: {
            group: 'betrecord',
            auth: true,
            title: Vue.t('nav.instant_view')
        }
    },
    {
        path: '/lottery_draw',
        name: 'lottery_draw',
        component: function (resolve) {
            require(['./views/Game/Game.vue'], resolve)
        },
        meta: {
            group: 'game_manage',
            auth: true,
            title: Vue.t('nav.game_settings')
        }
    },
    {
        path: '/game_play',
        name: 'game_plays',
        component: function (resolve) {
            require(['./views/Game/Game.vue'], resolve)
        },
        meta: {
            group: 'game_manage',
            auth: true,
            title: Vue.t('nav.game_play_configurations')
        }
    },
    {
        path: '/odds',
        name: 'odds',
        component: function (resolve) {
            require(['./views/Game/Game.vue'], resolve)
        },
        meta: {
            group: 'game_manage',
            auth: true,
            title: Vue.t('nav.odds_management')
        }
    },
    {
        path: '/roles',
        name: 'roles',
        component: function (resolve) {
            require(['./views/Setting/Role.vue'], resolve)
        },
        meta: {
            group: 'setting',
            auth: true,
            title: Vue.t('nav.roles')
        }
    },
    {
        path: '/roles/add',
        name: 'role_add',
        component: function (resolve) {
            require(['./views/Setting/RoleForm.vue'], resolve)
        },
        meta: {
            group: 'setting',
            auth: true,
            title: Vue.t('nav.role_add'),
            permission: 'add_new_role'
        }
    },
    {
        path: '/roles/:roleId',
        name: 'role_detail',
        component: function (resolve) {
            require(['./views/Setting/RoleDetail.vue'], resolve)
        },
        meta: {
            group: 'setting',
            auth: true,
            title: Vue.t('nav.role_detail')
        }
    },
    {
        path: '/roles/:roleId/edit',
        name: 'role_edit',
        component: function (resolve) {
            require(['./views/Setting/RoleForm.vue'], resolve)
        },
        meta: {
            group: 'setting',
            auth: true,
            title: Vue.t('nav.role_edit'),
            permission: 'update_role_name_advpermission'
        }
    },
    {
        path: '/global_parameters',
        name: 'global_parameters',
        component: function (resolve) {
            require(['./views/Setting/GlobalParameter.vue'], resolve)
        },
        meta: {
            group: 'setting',
            auth: true,
            title: Vue.t('nav.global_parameters'),
            permission: 'view_global_parameters_setting'
        }
    },
    {
        path: '/chatroom',
        name: 'chatroom',
        component: function (resolve) {
            require(['./views/Setting/Chatroom.vue'], resolve)
        },
        meta: {
            group: 'setting',
            auth: true,
            title: Vue.t('nav.chatroom_management')
        }
    },
    {
        path: '/chatroom/:chatroomId/edit',
        name: 'chatroom_edit',
        component: function (resolve) {
            require(['./views/Setting/ChatroomForm.vue'], resolve)
        },
        meta: {
            group: 'setting',
            auth: true,
            title: Vue.t('nav.update_chatroom_management')
        }
    },
    {
        path: '/ban',
        name: 'ban',
        component: function (resolve) {
            require(['./views/Ban.vue'], resolve)
        },
        meta: {
            auth: true,
            disable_tabs: true
        }
    },
    {
        path: '/error/',
        name: 'error',
        component: function (resolve) {
            require(['./views/Error.vue'], resolve)
        },
        meta: {
            auth: false
        }
    }
    ]
})
