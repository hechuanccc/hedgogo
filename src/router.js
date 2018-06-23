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

const i18n = new VueI18n({
    locale: Vue.config.lang,
    messages: locales
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
            title: i18n.t('title.login'),
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
            title: i18n.t('title.overview'),
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
            title: i18n.t('title.finance_remit'),
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
            title: i18n.t('title.finance_online_pay'),
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
            title: i18n.t('title.finance_withdraw'),
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
            title: i18n.t('title.finance_search')
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
            title: i18n.t('title.finance_search')
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
            title: i18n.t('title.finance_operation'),
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
            title: i18n.t('title.report_commission'),
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
            title: i18n.t('dic.member'),
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
            title: i18n.t('title.online_member'),
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
            title: i18n.t('title.member_add'),
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
            title: i18n.t('title.member_detail'),
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
            title: i18n.t('title.member_edit'),
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
            title: i18n.t('title.game_list'),
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
            title: i18n.t('title.game_management'),
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
            title: i18n.t('title.drawing_history'),
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
            title: i18n.t('title.drawing_history'),
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
            title: i18n.t('title.staff_list'),
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
            title: i18n.t('title.staff_add'),
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
            title: i18n.t('title.staff_detail')
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
            title: i18n.t('title.staff_edit')
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
            title: i18n.t('dic.agent'),
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
            title: i18n.t('title.agent_add'),
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
            title: i18n.t('title.agent_application'),
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
            title: i18n.t('title.agent_detail'),
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
            title: i18n.t('title.agent_edit'),
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
            title: i18n.t('title.agent_application'),
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
            title: i18n.t('title.member_level')
        }
    },
    {
        path: '/level/add',
        component: function (resolve) {
            require(['./views/Setting/MemberLevelForm.vue'], resolve)
        },
        meta: {
            auth: true,
            title: i18n.t('title.member_level_add'),
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
            title: i18n.t('title.member_level_detail'),
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
            title: i18n.t('title.member_level_edit'),
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
            group: 'transaction',
            auth: true,
            title: i18n.t('title.online_payee_management')
        }
    },
    {
        path: '/online_payee/add',
        component: function (resolve) {
            require(['./views/Setting/OnlinePayeeForm.vue'], resolve)
        },
        meta: {
            group: 'transaction',
            title: i18n.t('title.online_payee_add'),
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
            group: 'transaction',
            title: i18n.t('title.online_payee_detail'),
            auth: true
        }
    },
    {
        path: '/online_payee/:online_payeeId/edit',
        component: function (resolve) {
            require(['./views/Setting/OnlinePayeeForm.vue'], resolve)
        },
        meta: {
            group: 'transaction',
            title: i18n.t('title.online_payee_edit'),
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
            group: 'transaction',
            auth: true,
            title: i18n.t('title.online_payer_management')
        }
    },
    {
        path: '/online_payer/add',
        component: function (resolve) {
            require(['./views/Setting/OnlinePayerForm.vue'], resolve)
        },
        meta: {
            group: 'transaction',
            title: i18n.t('title.online_payer_add'),
            auth: true
        }
    },
    {
        path: '/online_payer/:online_payerId',
        component: function (resolve) {
            require(['./views/Setting/OnlinePayerDetail.vue'], resolve)
        },
        meta: {
            group: 'transaction',
            title: i18n.t('title.online_payer_detail'),
            auth: true
        }
    },
    {
        path: '/online_payer/:online_payerId/edit',
        component: function (resolve) {
            require(['./views/Setting/OnlinePayerForm.vue'], resolve)
        },
        meta: {
            group: 'transaction',
            title: i18n.t('title.online_payer_edit'),
            auth: true
        }
    },
    {
        path: '/bank',
        component: function (resolve) {
            require(['./views/Setting/Bank.vue'], resolve)
        },
        meta: {
            group: 'transaction',
            title: i18n.t('title.setting_bank'),
            auth: true
        }
    },
    {
        path: '/paymenttype',
        component: function (resolve) {
            require(['./views/Setting/PaymentType.vue'], resolve)
        },
        meta: {
            group: 'transaction',
            auth: true,
            title: i18n.t('title.payment_type_management')
        }
    },
    {
        path: '/paymenttype/:id/edit',
        component: function (resolve) {
            require(['./views/Setting/PaymentTypeForm.vue'], resolve)
        },
        meta: {
            group: 'transaction',
            auth: true,
            permission: 'update_onlinepayment',
            title: i18n.t('title.payment_type_detail')
        }
    },
    {
        path: '/remit_payee',
        component: function (resolve) {
            require(['./views/Setting/RemitPayee.vue'], resolve)
        },
        meta: {
            group: 'transaction',
            auth: true,
            title: i18n.t('title.remit_payee')
        }
    },
    {
        path: '/remit_payee/add',
        component: function (resolve) {
            require(['./views/Setting/RemitPayeeForm.vue'], resolve)
        },
        meta: {
            group: 'transaction',
            auth: true,
            title: i18n.t('title.remit_payee_add'),
            permission: 'add_remit_account'
        }
    },
    {
        path: '/remit_payee/:payeeId',
        component: function (resolve) {
            require(['./views/Setting/RemitPayeeDetail.vue'], resolve)
        },
        meta: {
            group: 'transaction',
            auth: true,
            title: i18n.t('title.remit_payee_detail')
        }
    },
    {
        path: '/remit_payee/:payeeId/edit',
        component: function (resolve) {
            require(['./views/Setting/RemitPayeeForm.vue'], resolve)
        },
        meta: {
            group: 'transaction',
            title: i18n.t('title.remit_payee_edit'),
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
            title: i18n.t('title.commission')
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
            title: i18n.t('title.commission_add'),
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
            title: i18n.t('title.commission_edit')
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
            title: i18n.t('title.log_login'),
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
            title: i18n.t('title.log_action'),
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
            title: i18n.t('title.betting_record'),
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
            title: `${i18n.t('title.betting_record')} - ${i18n.t('title.betting_record_instant')}`,
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
            title: i18n.t('title.betting_record_detail'),
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
            title: i18n.t('title.marketing_banner')
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
            title: i18n.t('title.announcement_management')
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
            title: i18n.t('title.marketing_website')
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
            title: i18n.t('title.message'),
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
            title: i18n.t('title.message_add'),
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
            title: i18n.t('title.message_detail'),
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
            title: i18n.t('title.promotion_management')
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
            title: i18n.t('title.promotion_add'),
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
            title: i18n.t('title.promotion_detail')
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
            title: i18n.t('title.promotion_edit'),
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
            title: i18n.t('title.change_password')
        }
    },
    {
        path: '/report/finance_report/:agentId',
        name: 'agent_report',
        component: function (resolve) {
            require(['./views/Report/Finance.vue'], resolve)
        },
        meta: {
            group: 'report',
            auth: true,
            title: i18n.t('title.report_agent')
        }
    },
    {
        path: '/report/finance_report',
        name: 'finance_report',
        component: function (resolve) {
            require(['./views/Report/Finance.vue'], resolve)
        },
        meta: {
            group: 'report',
            auth: true,
            title: i18n.t('title.report_finance')
        }
    },
    {
        path: '/report/member_report',
        name: 'member_report',
        component: function (resolve) {
            require(['./views/Report/Membership.vue'], resolve)
        },
        meta: {
            group: 'report',
            auth: true,
            title: i18n.t('title.report_member')
        }
    },
    {
        path: '/report/game',
        name: 'game_report',
        component: function (resolve) {
            require(['./views/Report/Game.vue'], resolve)
        },
        meta: {
            group: 'report',
            auth: true,
            title: i18n.t('title.report_game')
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
            title: i18n.t('title.betting_record_instant')
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
            title: i18n.t('title.role_management')
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
            title: i18n.t('title.role_add'),
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
            title: i18n.t('title.role_detail')
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
            title: i18n.t('title.role_edit'),
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
            title: i18n.t('title.setting_global_parameter'),
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
            title: i18n.t('title.setting_chatroom')
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
            title: i18n.t('title.setting_chatroom_edit')
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
