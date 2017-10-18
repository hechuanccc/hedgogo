'use strict'

export default {
    nav: {
        overview: '总览',
        bills: '财务',
        transaction: '交易',
        report: '报表',
        member: '会员',
        agent: '代理商',
        setting: '系统配置',
        cms: '网站管理',
        member_list: '会员列表',
        member_add: '增加会员',
        member_application: '试玩申请',
        agent_list: '代理商列表',
        agent_add: '增加代理商',
        agent_password: '充值代理商登录密码',
        agent_application: '代理申请',
        setting_level: '会员等级',
        setting_remit_payee: '公司入款账号',
        setting_return: '反水设定',
        setting_commission: '佣金设定',
        setting_online_payee: '线上支付管理',
        member_detail: '会员详情',
        edit_member: '编辑会员资料',
        remit_audit: '公司入款审核',
        online_payment: '线上支付看板',
        withdrawal_audit: '取款申请审核',
        transcations_query: '交易记录查询',
        return_report: '反水计算',
        commission_report: '佣金计算',
        game_report: '统计报表',
        login_record: '登录记录',
        returnrate: '反水',
        commission: '佣金',
        login: '登录',
        bet_record: '投注记录',
        transfer_record: '娱乐场转账记录',
        promotion: '优惠活动',
        message: '站内信',
        action_record: '操作记录',
        staff: '子账号管理',
        payment_type_setting: '支付方式管理',
        envelope: '红包',
        envelope_setting: '配置红包',
        title_announcement: '公告管理',
        title_banner: 'banner管理',
        title_website: '网站管理',
        game_manage: '游戏管理',
        game_list: '游戏列表',
        game_detail: '游戏详情'
    },
    member: {
        page_title: '查询条件',
        account: '账号',
        created_at: '注册日期',
        created_ip: '注册 IP',
        ip: 'IP',
        area: '地区',
        list_no: '序号',
        last_login: '最后登录',
        login_platform: '平台',
        level: '会员等级',
        status: '状态',
        balance: '余额',
        agent: '代理',
        update_agent: '修改会员代理',
        return_setting: '反水设定',
        modify_basic_info: '编辑基本资料',
        build_bank_info: '编辑银行资讯',
        banking_record: '存提款记录',
        view_remittence: '查看公司入款记录',
        view_online_payments: '查看线上支付记录',
        view_withdraw_requests: '查看提款申请',
        phone_is: '手机号码',
        application_time: '申请时间',
        operation_log: '操作日志',
        fund_summary: '已结算资金历史',
        fund_sum: '总计',
        audit_list: '未确认的交易',
        no_confirmed_transactions: '无资金记录',
        no_ongoing_transactions: '无待审核交易',
        view_all_login: '查看全部登录记录',
        view_login_by_ip: '查看此 IP 登录记录',
        manual_adjust: '手工存提',
        reset_confirm: '确认要{action}吗？',
        pullout: '全部取回',
        transfer_status: '成功转化余额',
        more_options: '更多条件',
        collapse_options: '收起条件',
        balance_providers: '娱乐城总余额',
        loggedin_domain: '登录网址',
        loggedin_ip: '登录IP',
        sug_balance: '估算额度',
        recent_action: '最近操作',
        add_bank_information: '建立银行资讯',
        edit_bank_information: '编辑银行资讯',
        current_audit: '当前稽核：',
        account_type: '帐户类型',
        trial_account: '试用账户',
        real_account: '真实账户',
        pass: '通过',
        failed: '未通过'
    },
    bill: {
        remit_audit: '公司入款审核',
        online_payment: '线上支付看板',
        withdrawal_audit: '取款申请审核',
        transcations_query: '交易记录查询',
        return_report: '反水计算',
        commission_report: '佣金计算',
        balance_after: '交易后账户余额',
        order_id: '订单号',
        order_detail: '订单详情',
        created_at: '交易时间',
        transaction_type: '交易类型',
        online_pay: '在线支付',
        remit: '公司入款',
        withdraw: '取款',
        discount: '优惠',
        manual_operation: '人工存提',
        return: '反水',
        game_settlement: '游戏结算',
        remit_payee: '入款账号',
        view_detailed: '查看详情',
        depositor: '存款人',
        deposited_at: '存款时间',
        merchant_status: '商户状态',
        manual_confirm: '补单',
        audit: '审核通过',
        audit_deny: '拒绝入款',
        audit_amount: '稽核金额',
        confirm_declined: '确认要{action}吗？',
        cancel: '打回并退还金额',
        declined: '拒绝并扣除金额',
        view_all_transactions: '查看所有交易记录',
        view_all_discounts: '查看所有存款记录',
        operator: '操作人员',
        saved: '已存入',
        deposit_declined: '入款已拒绝',
        withdraw_declined: '汇款已拒绝'
    },
    common: {
        default_password: '会员登录密码预设',
        default_withdraw_password: '取款密码预设',
        date: '日期',
        nickname: '昵称',
        register: '注册',
        name: '名称',
        save: '提交',
        send: '发送',
        attention: '注意',
        member: '会员',
        status_updated_at: '最近更新',
        merchant: '商户',
        type: '类型',
        male: '男',
        female: '女',
        phone: '电话',
        wechat: '微信',
        gender: '性别',
        qq: 'QQ',
        search: '搜索',
        email: '邮件',
        birthday: '生日',
        more_fields: '更多查询条件',
        less_fields: '隐藏高级查询条件',
        status: '状态',
        basic_info: '基本资料',
        real_name: '真实姓名',
        memo: '备注',
        no_memo: '暂无备注',
        username: '用户名',
        status_updated: '状态已更新',
        please_select: '请选择',
        applied_at: '申请日期',
        login_at: '登录时间',
        amount: '金额',
        operator: '处理人员',
        number: '数量',
        board_url: '跳板第一',
        certificate: '证书',
        all: '全部',
        logged_in: '已登录',
        unfilled: '未填写',
        agent: '代理',
        login_status: '登录状态',
        qr_code: '二维码',
        transfer: '存入',
        game: '游戏',
        settledat: '结算时间',
        betamount: '投注金额',
        valid_bet_amount: '有效投注',
        betdate: '投注时间',
        settlementamount: '结算金额',
        transferred_at: '日期',
        provider: '娱乐城',
        deposit: '存入',
        withdraw: '取回',
        today: '今日',
        yesterday: '昨天',
        this_week: '本周',
        last_week: '上周',
        this_month: '本月',
        last_month: '上月',
        gamecategory: '游戏类型',
        generate: '导出',
        onlinemember: '在线会员',
        onlinemembers: '会员',
        search_member: '搜索会员',
        submit: '提交',
        profit: '损益',
        confirm: '确认要{action}吗？',
        cancelreturn: '取消',
        confirmreturn: '确认',
        selectallreturn: '选择所有反水',
        activeremit: '该账户无法被删除，因为它有活动的交易。',
        errorPermission: '当前登录用户没有操作权限!',
        saved_successfully: '保存成功!',
        balance_before: '更新前额度',
        balance_after: '更新后额度',
        export: '下载',
        no_record: '无记录',
        remarks: '备注',
        no_remarks: '暂无备注'
    },
    bank: {
        bank_title: '银行资讯',
        name: '银行',
        province: '省份',
        address: '开户行网点',
        city: '县市',
        account: '账号'
    },
    status: {
        active: '启用',
        inactive: '禁用',
        ongoing: '待处理',
        confirmed: '已确认',
        rejected: '已拒绝',
        declined: '已拒绝',
        success: '成功',
        canceled: '已取消',
        failed: '失败'
    },
    betrecord: {
        win: '赢',
        bet: '输',
        refund: '退款',
        tie: '和局',
        void: '非法',
        reject: '未投注',
        waiting: '待确认',
        game: '游戏',
        ongoing: '待确认'
    },
    action: {
        view_today_report: '查看今日报表',
        update_agent: '修改代理商资料',
        update_member: '修改会员资料',
        view_member_record: '查看所有会员交易记录',
        add_member: '新增会员',
        reset_password: '重设密码',
        view_history: '查看历史',
        view_detailed_infos: '查看详细资料',
        close_detailed_infos: '关闭详细资料',
        view_todays_bet_record: ' 今日投注记录',
        reset_withdraw_password: '重设取款密码',
        create: '新增',
        update: '修改',
        delete: '删除',
        view_remit_payees: '查看公司入款账号',
        update_remit_payee: '更新',
        add_remit_payee: '增加公司入款账户',
        add_staff: '增加子账号',
        add_promotion: '新增活动',
        view_promotions: '查看活动',
        update_promotion: '更新活动',
        export: '输出',
        view_action_record: '查看操作记录',
        change_audit_status: '修改此会员稽核',
        login_password_changed: '登录密码已修改为：',
        withdraw_password_changed: '取款密码已修改为：'
    },
    staff: {
        roles: '角色 / 权限',
        account: '账号',
        permission: '权限',
        update_staff: '更新子账号',
        staff_info: '子账号信息',
        staff_name: '用户名',
        password: '密码',
        role: '角色',
        quick_selection: '快速选择',
        select_permission_group: '权限 快速选取',
        select_all: '全选',
        deselect_all: '清空',
        webmster_permission: '站长',
        account_permission: '帐务',
        customer_service: '客服',
        technical_customer_service: '技术客服',
        close: '关闭',
        status: '目前状态'
    },
    game_manage: {
        id: ' 游戏ID',
        name: '游戏名称',
        rank: '游戏排名',
        code: '游戏号码'
    }
}
