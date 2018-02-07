'use strict'

export default {
    nav: {
        overview: '总览',
        transaction: '交易記錄查詢',
        financing: '財務管理',
        report: '报表',
        users: '用戶管理',
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
        agent_application: '代理商申请',
        setting_level: '会员等级',
        setting_remit_payee: '公司入款账号',
        setting_return: '反水设定',
        setting_commission: '佣金设定',
        setting_online_payee: '线上支付管理',
        member_detail: '会员详情',
        edit_member: '编辑会员资料',
        agent_detail: '代理商详情',
        edit_agent: '编辑代理商',
        remit: '公司入款審核',
        online_pay_orders: '線上支付看板',
        withdraw_request: '取款申請審核',
        transcations_query: '交易记录查询',
        return_report: '反水計算',
        commission_report: '佣金计算',
        game_report: '统计报表',
        returnrate: '反水',
        commission: '佣金',
        login: '登录',
        bet_record: '投注记录',
        transfer_record: '娱乐场转账记录',
        promotion: '优惠活动',
        message: '站内信',
        staff: '子账号管理',
        add_staff: '新增账号',
        staff_detail: '子账号详情',
        payment_type_setting: '支付方式',
        envelope: '红包',
        envelope_setting: '配置红包',
        title_announcement: '公告管理',
        title_banner: 'Banner管理',
        title_website: '网站管理',
        game_manage: '游戏管理',
        game_history: '历史开奖',
        game_list: '游戏列表',
        game_detail: '游戏详情',
        level_detail: '会员等级详细资料',
        member_level_edit: '修改会员等级',
        member_level_add: '增加会员等级',
        remit_payee_detail: '公司入款账号详情',
        remit_payee_add: '增加公司入款账户',
        remit_payee_update: '更新公司入款账号',
        setting_return_add: '增加反水设定',
        setting_return_edit: '修改反水设定',
        setting_commission_add: '增加佣金设定',
        setting_commission_edit: '修改佣金设定',
        online_payee_detail: '线上支付商户',
        online_payee_detail_edit: '线上支付商户修改',
        payment_type_setting_detail: '支付方式管理',
        bet_record_detail: '投注记录详情',
        add_message: '新增站内信',
        message_details: '站内信详情',
        change_password: '修改密码',
        agent_report: '代理報表',
        member_report: '會員報表',
        finance_report: '财务报表',
        online_member_report: '在線報表',
        recent_bet_records: '今日注單',
        bet_record_history: '歷史注單',
        instant_view: '實時滾單',
        general_agent_list: '總代理',
        online_member_list: '在線會員',
        system_configuration: '系統配置',
        permissions: '權限管理',
        roles: '角色管理',
        role_detail: '角色详情',
        role_add: '新增角色',
        role_edit: '修改角色',
        global_parameters: '系統參數配置',
        logging: '日誌管理',
        login_logs: '登錄日誌',
        action_logs: '操作日誌',
        errors: '異常日誌',
        marketing: '運營管理',
        game_settings: '遊戲設定',
        game_play_configurations: '交易設定',
        odds_management: '盤口設定'
    },
    envelope: {
        name: '名称',
        member_level: '会员等级',
        bet_amount: '下注金额',
        status: '状态',
        envelope_name: '红包名称',
        add_envelope: '新增红包',
        min_money: '红包最小金额',
        max_money: '红包最大金额',
        envelope_config: '红包配置',
        deposit_threshold: '存款金额大于等于',
        envelope_count: '红包个数',
        select_envelope: '选择红包',
        bet_threshold: '投注金额大于等于',
        condition: '达成条件',
        and: '同时满足',
        or: '存款或下注',
        envelope_setting: '配置红包',
        envelope: '红包',
        add_setting: '添加红包设置',
        edit_envelope: '编辑红包',
        edit_envelope_setting: '编辑红包组'
    },
    returnrate: {
        created_at: '反水生成时间',
        created_by: '注册人员',
        history_id: '历史 ID',
        member_count: '成员数量',
        total_return: '总反水',
        success: '反水成功确认',
        export: '下载',
        generate: '生成',
        cycle: '反水计算周期'
    },
    member: {
        contact_info: '联络资料',
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
        loggedin_infos: '登录信息',
        sug_balance: '估算额度',
        recent_action: '最近操作',
        current_audit: '当前稽核：',
        account_type: '帐户类型',
        trial_account: '试玩账户',
        real_account: '真实账户',
        pass: '通过',
        failed: '未通过',
        logout_at: '注销时间',
        isp: 'ISP',
        real_member_registration: '真实会员注册人数',
        deposit_member_count: '存款会员人数',
        bet_member_count: '下注会员人数',
        trial_member_count: '试玩会员人数',
        visitor: '游客'
    },
    bill: {
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
        withdraw_declined: '汇款已拒绝',
        onlinepay: '线上支付',
        card_pay: '点卡支付',
        deposit_amount: '存款金额',
        others: '其他',
        audit_type: '稽核方式',
        free_audit: '免稽核',
        deposit_audit: '存款稽核',
        preferential_audit: '优惠稽核',
        suggested_balance: '是否记入审查记录',
        sug_balance_alert: '用于补偿额度丢失，选否',
        deposit_amount_alert: '输入负数即为扣款',
        submit_alert: '注意：提交该交易将直接更新会员账户余额',
        view_all_orders: '查看会员所有订单',
        fee: '手续费',
        discount_deduction: '优惠扣除'
    },
    common: {
        default_agent_password: '代理商登录密码预设',
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
        status_updated_at: '最近更新时间',
        merchant: '商户',
        type: '类型',
        male: '男',
        female: '女',
        yes: '是',
        no: '否',
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
        applied_at: '申请时间',
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
        no_remarks: '暂无备注',
        add_bank_information: '建立银行资讯',
        edit_bank_information: '编辑银行资讯',
        member_count: '会员数量',
        agent_count: '目前代理人数',
        not_set: '未设定',
        repeat: '重复',
        online: '在线',
        offline: '离线',
        total: '总计',
        min_amount: '最低金额',
        max_amount: '最高金额',
        ip_info: 'IP 信息',
        specify_date_range: '指定日期范围',
        input: '键入',
        refresh: '刷新数据',
        refresh_period: '刷新周期',
        show_all: '显示所有',
        select_all: '全选',
        deselect_all: '清空',
        new_window: '新窗口打开',
        updated_at: '状态更新于',
        no_permission: '无权限访问',
        error_occurred_msg: '发生错误。请联系客服人员。',
        overview: {
            label: {
                amount: '下注金额',
                betrecord_count: '注单数量',
                profit: '损益情况',
                register_count: '注册人数'
            },
            title: {
                amount: '过去7日下注金额',
                betrecord_count: '过去7日注单数量',
                profit: '过去7日营运商损益情况',
                register_count: '过去7日注册人数'
            }
        },
        loading: '载入中',
        setting: '设置',
        file_size_too_large: '文件太大，请选择另一个',
        agent_login_error: '您是代理商，请登入代理后台'
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
        cancelled: '已取消',
        failed: '失败',
        disabled: '停用'
    },
    betrecord: {
        win: '赢',
        lose: '输',
        refund: '退款',
        tie: '和局',
        reject: '未投注',
        waiting: '待确认',
        game: '游戏',
        ongoing: '待确认',
        total_profit: '总计 损益',
        total_bet_amount: '总计 投注金额',
        game_selection: '游戏选择',
        five_seconds: '5 秒',
        ten_seconds: '10 秒',
        thirty_seconds: '30 秒',
        sixty_seconds: '60 秒',
        cancel_bet: '取消押注',
        cancelled_bets: '赌注被取消了',
        total_valid_bet_amount: '有效投注总笔数',
        options: '投注选项',
        opts_combos_count: '组合选项计数'
    },
    action: {
        view_today_report: '查看今日报表',
        view_agent_report: '查看代理報表',
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
        setting: '设定',
        confirm: '确定',
        cancel: '取消',
        download: '下载报表',
        view_remit_payees: '查看公司入款账号',
        update_remit_payee: '更新',
        add_remit_payee: '增加公司入款账户',
        add_staff: '增加子账号',
        add_promotion: '新增活动',
        view_promotions: '查看活动',
        update_promotion: '更新活动',
        view_action_record: '查看操作记录',
        change_audit_status: '修改此会员稽核',
        login_password_changed: '登录密码已修改为：',
        withdraw_password_changed: '取款密码已修改为：',
        add_level: '新增会员等级',
        edit_level: '修改会员等级',
        delete_level: '删除会员等级',
        logout: '退出登录',
        clear: '清除',
        filter_trial_account: '过滤试玩用户',
        no_setting: '未设置',
        back_page: '返回上一页',
        hide: '隐藏',
        view: '查看',
        inform: '通知'
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
        status: '目前状态',
        created_at: '注册日期',
        updated_at: '最后修改日期',
        email: '邮箱',
        no_setting: '未设置',
        enabled: '启用',
        disabled: '停用',
        status_updated: '状态已更新！',
        no_select_group: '尚未选择角色！'
    },
    game_manage: {
        id: ' 游戏ID',
        name: '游戏名称',
        rank: '排序',
        code: '游戏号码',
        enabled_status: '启用状态',
        icon: '图标',
        holiday: '公休',
        holiday_start_time: '公休开始时间',
        holiday_end_time: '公休结束时间',
        closed_status: '封盘状态',
        operating: '操作',
        enabled: '启用',
        disabled: '停用',
        closed: '封盘',
        openning: '开盘',
        no_setting: '未设置',
        setting: '设置',
        handicap_setting: '盘口设定',
        transaction_setting: '交易设定',
        play: '玩法',
        min_per_bet: '单注最低金额',
        max_per_bet: '单注最高金额',
        max_per_draw: '当期最高金额',
        return_rate: '反水',
        odds: '赔率',
        issue_number: '发行数量',
        setting_holiday: '设置公休开始结束时间',
        setting_icon: '设置图标',
        setting_icon_background: '设置图标背景',
        no_setting_icon: '未设置图标',
        no_setting_icon_background: '未设置图标背景',
        no_setting_holiday: '未设置公休开始结束时间',
        modify_success: '修改成功！',
        modify_fail: '修改失败！',
        adjust_rank: '调整排序',
        no_change: '未侦测到修改'
    },
    game_history: {
        game: '游戏名称',
        already_result: '当日已开期数',
        notyet_result: '当日剩余期数',
        draw_period: '期数',
        refresh: '刷新数据',
        overview: '总览',
        is_latest: '已是最新数据',
        periods: '期数',
        draw_date: '开奖时间',
        draw_number: '开奖号码',
        no_setting_draw_number: '未设置开奖号码',
        date: '日期',
        loading: '正在加载中...',
        auto_draw: '自动开奖',
        manual_draw: '手动开奖',
        manual_draw_success: '手动开奖成功！',
        manual_draw_fail: '手动开奖失败！',
        sure_manual_draw: '请确认是否手动开奖，该操作将会影响%{bet_record_count}个注单',
        inform_no_draw: '寄送系统站内信通知下单会员',
        memo: '备注',
        no_draw: '官方未开',
        ongoing: '进行中',
        retreat_sched_sure: '确定撤单吗？',
        retreat_sched: '撤单',
        retreat_sched_fail: '撤单失败！',
        created: '已创建',
        open: '已开放',
        schedule_cancelled: '已撤单',
        operating: '操作',
        try_later: '请稍后再试',
        abnormal_period: '未开期数',
        abnormal_msg: '未开期数',
        no_abnormal: '无未开期数',
        period_bet_record: '当期单量',
        show_all: '显示全部',
        result_str_tips: '请输入%{num_len}个%{unique}数字(%{range_floor}~%{range_ceil})使用\'%{separator}\'分隔',
        manual_draw_initial_msg: '未开期数可能为官方未开奖，请谨慎使用手动开奖',
        no_draw_initial_msg: '将此期注单状态标注为官方未开奖？',
        repeatable: '可重复',
        non_repetitive: '不重复',
        ball_num: '号码',
        ball_than_size: '大小',
        ball_odd_even: '单双',
        ball_tail_than_size: '尾大小',
        ball_of_sum_number_odd_even: '合单双',
        ball_prime_composite: '质合',
        sum_of_ball: '号码',
        sum_of_ball_odd_even: '单双',
        sum_of_ball_than_size: '大小',
        sum_of_ball_tail_than_size: '尾大小',
        sum_of_first_second: '冠亚和',
        sum_of_1st_2st: '号码',
        sum_of_1st_2st_odd_even: '单双',
        sum_of_1st_2st_than_size: '大小',
        sum_of_ball_great_tiny: '极值',
        sum_of_ball_color_wavelength: '色波',
        sum_of_ball_five_element: '五行',
        sum_of_ball_prime_composite_tail: '尾质合',
        three_balls_sum_col: '佰拾个和數',
        three_balls_sum: '和數',
        three_balls_sum_tail: '和數尾',
        seven_color_wavelength: '7色波',
        balls_odd_even_cp: '单双比',
        balls_front_rear_count_cp: '前后比',
        weird_chinese_dice_rules_1_3: '前三',
        weird_chinese_dice_rules_2_4: '中三',
        weird_chinese_dice_rules_3_5: '后三',
        comparison: '比数量',
        dragon: '龙',
        tiger: '虎',
        show: '显示',
        sum: '总和',
        bigger: '大',
        smaller: '小',
        equal: '和',
        odd: '单',
        even: '双',
        red: '红波',
        green: '绿波',
        blue: '蓝波',
        outOfDefinition: '--',
        great: '极大',
        tiny: '极小',
        gold: '金',
        wood: '木',
        water: '水',
        fire: '火',
        earth: '土',
        odd_more: '单多',
        even_more: '双多',
        front_part_more: '前多',
        rear_part_more: '后多',
        pair: '对子',
        straight: '顺子',
        half_straight: '半顺',
        misc_six: '杂六',
        leopard: '豹子',
        prime: '质',
        composite: '合',
        ball_max_min_diff: '跨度'
    },
    agent: {
        number: '编号',
        joined_at: '加盟日期',
        no_agent: '查无代理',
        level: '代理等级',
        account: '账号',
        parent_agent: '上线',
        bank_account: '银行账号',
        promo_code: '推广码',
        commission_setting: '佣金设定',
        no_parent: '无上线',
        dft_member_lv: '预设会员等级',
        dft_return_setting: '预设反水设定',
        member_count: '会员数量',
        reset_confirm: '确认要{action}吗？',
        ip: 'IP 地址',
        updated_by: '操作人',
        log: '操作日志',
        status_update: '详细资料已储存',
        domain: '代理域名',
        unDomain: '暂无代理域名',
        link: '推广地址',
        account_type: '帐户类型',
        reset_agent_password: '代理登录密码已修改为:',
        domain_label: '多个域名请用 “英文逗号” 隔开'
    },
    level: {
        remit_limit: '公司入款限额',
        online_pay_limit: '线上支付限额',
        withdraw_limit: '单次取款限额',
        withdraw_fee_rate: '取款手续费',
        withdraw_fee_type: '取款手续费收取方式',
        discount: '入款优惠',
        report_flag: '显示会员报表',
        display_report: '是否显示该等级会员的所有报表',
        service_rate: '行政费用比',
        free: '免手续费',
        preset: '视具体情况',
        everytime: '每次皆收',
        hour: '小时内取款',
        times: '次免收',
        withdraw_fee_type_danger: '会员申请取款时，若有任何一笔存款稽核未通过，都将强制收取手续费',
        remit_offer: '公司入款优惠',
        threshold: '存款金额',
        rate: '优惠比例',
        check_rate: '稽核倍数',
        discount_limit: '优惠上限',
        no_limit: '无上限',
        online_pay_offer: '线上支付优惠',
        deposit_audit_ratio: '存款稽核比',
        reg_present: '注册送彩金',
        reg_present_status: '是否启用',
        reg_present_allow_add: '管端新增',
        reg_present_amount: '赠送金额',
        reg_present_check_amount: '稽核金额',
        no_online_payment_offer: '未设定线上支付优惠',
        no_remit_offer: '未设置公司入款优惠',
        level_settings: '组设定',
        available_onlinepay_acct_lbl: '可使用的线上支付商户',
        available_remit_acct_lbl: '可使用的公司入款账号',
        view_all_members: '查看该等级所有会员',
        allowed: '允许',
        not_allowed: '不允许'
    },
    setting: {
        sum_fund: '目前累计',
        payment_type: '支付方式',
        remit_type: '汇款类型',
        payment_alipay: '支付宝',
        payment_wechat: '微信',
        payment_normal: '普通支付',
        expired_in: '有效分钟数',
        merchant_info: '商户资料',
        type: '类型',
        merchant_num: '商户号',
        certificate: '密钥',
        board_url: '跳板地址',
        payment_domain: '支付域名',
        create_online_payee: '新增线上支付商户',
        staff_info: '子账号信息',
        display_name: '显示名称',
        paymenttype: '支付方式管理',
        payment_gateway: '支付网关',
        enable: '启用商户',
        disable: '停用商户',
        domain_label: '提醒:修改域名时请记得在网址结尾加上反斜线, "/"',
        no_payment_gateway: '没有付款网关设置',
        select_one_level: '请至少选择一个会员等级',
        setting_return_add_btn: '增加反水设定',
        setting_return_ratio_count: '反水比组数',
        deleted_return_setting: '反水设定已删除',
        delete_return_setting: '删除反水设定',
        group_threshold: '打码量',
        check_amount: '稽核',
        group_max: '反水金额上限',
        return_setting_ratio: '反水比',
        setting_commission_add_btn: '新增佣金设定',
        min_member_bet_amt: '有效会员最低投注金额',
        max_deposit: '单笔存款手续费',
        max_withdraw: '单笔取款手续费',
        deleted_commission_setting: '佣金设置已被删除',
        delete_commission_setting: '删除佣金设定',
        com_deposit_max: '单笔存款手续费上限',
        com_min_bet: '有效会员最低投注额',
        com_deposit_fee: '单笔存款手续费',
        com_withdraw_max: '单笔取款手续费上限',
        com_withdraw_fee: '单笔取款手续费',
        com_group_threshold: '派彩',
        com_discount_rate: '优惠',
        valid_member: '有效会员'
    },
    report: {
        number_login: '序号',
        no_record_found: '查无记录，请更换条件再查询',
        bet_record_number: '注单号',
        no_bet_details: '无投注详细信息',
        select_remit_type: '选择汇款类型'
    },
    actionrecord: {
        id: '序号',
        action_time: '操作时间',
        action_username: '操作账户',
        action_user_type: '角色',
        action_ip: 'IP',
        action_type: '操作类型',
        action_types: {
            finance: '财务',
            configuration: '配置',
            member_information: '会员资料',
            game: '游戏'
        },
        action_result: '状态',
        description: '操作说明',
        username: '用户名',
        enter_keywords: '输入关键字',
        separated_by_spaces: '以空格隔开'
    },
    manage: {
        platform: '平台',
        platform_select: '平台选择',
        img: '图片',
        text: '文字',
        operate: '操作',
        sequence: '排序',
        add_announcement: '新增公告',
        title_announcement: '公告管理',
        title_banner: 'Banner管理',
        title_website: '网站管理',
        pc: '电脑',
        mobile: '手机',
        all: '全部',
        name: '网站名称',
        second_name: '网站别名',
        logo: 'logo',
        description: '网站简介',
        link: '推广地址',
        prev_password: '原密码',
        new_password: '新密码',
        repeat_password: '重复密码',
        header_img: '标题图片',
        main: '描述内容',
        advertisement: '网站广告',
        adjust_rank: '调整排序',
        agent_joining_agreement: '代理加盟协议'
    },
    cms: {
        pctitle: '电脑网页管理',
        mobiletitle: '手机网页管理',
        banner: '旗帜',
        announcement: '公告'
    },
    messages: {
        number: '编号',
        title: '标题',
        receiver: '接收人',
        receiver_group: '接收群组',
        members: '群发',
        transaction: '相关交易',
        text: '发送内容',
        time: '发送时间',
        sender: '寄件人'
    },
    promotion: {
        title: '优惠活动管理',
        add: '新增优惠活动',
        update: '更新优惠活动',
        promotion_detail: '优惠活动详情',
        banner: '题图',
        mobileBanner: '手机端题图',
        desc: '电脑优惠活动详情',
        desc_mobile: '手机优惠活动详情',
        level: '适用的会员等级',
        rank: '优惠活动排序',
        availability: '有效期',
        detail: '优惠活动详情',
        start_date: '起始日期',
        end_date: '结束日期',
        copy_promotion: '复制优惠活动'
    },
    header: {
        deposit: '入款',
        withdraw: '取款'
    },
    permission_manage: {
        id: '权限ID',
        name: '权限名称',
        description: '权限描述',
        group_id: '权限分组',
        created_at: '添加时间',
        operating: '操作',
        modify: '修改',
        delete: '删除',
        no_setting: '未设置',
        permission_add_btn: '添加权限',
        select_group: '选择分组'
    },
    global_parameters: {
        name: '参数说明',
        value: '参数值',
        operating: '操作',
        modify: '修改',
        delete: '删除',
        parameter_add_btn: '添加参数',
        sure_update_parameter: '确定修改参数？',
        cancel: '取消'
    },
    role_manage: {
        id: '角色ID',
        name: '角色名称',
        created_at: '添加时间',
        type: '类型',
        role_add_btn: '新增角色',
        role_info: '角色信息',
        operating: '操作',
        role_permission: '角色权限',
        sure_delete_role: '确定删除该角色吗？'
    }
}
