'use strict'

const autoAddTitle = {}
const titleList = [
    'game',
    'member',
    'agent',
    'staff',
    'member_level',
    'announcement',
    'role',
    'message',
    'commission',
    'promotion',
    'online_payee',
    'online_payer',
    'payment_type',
    'remit_payee'
]
titleList.forEach(e => {
    Object.assign(autoAddTitle, {
        [e]: `@:dic.${e}`,
        [`${e}_name`]: `@:dic.${e} @:dic.name`,
        [`${e}_list`]: `@:dic.${e} @:dic.list`,
        [`${e}_add`]: `@:dic.create @:dic.${e}`,
        [`${e}_edit`]: `@:dic.update @:dic.${e}@:dic.info`,
        [`${e}_detail`]: `@:dic.${e} @:dic.detail`,
        [`${e}_management`]: `@:dic.${e} @:dic.management`
    })
})

export default {
    dic: {
        name: 'Name',
        type: 'Type',
        member: 'Member',
        agent: 'Agent',
        staff: 'Staff',
        member_level: 'Member Level',
        operator: 'Operator',
        status: 'Status',
        game: 'Game',
        date: 'Date',
        time: 'Time',
        set: 'Setting',
        view: 'View',
        submit: 'Submit',
        confirm: 'Confirm',
        cancel: 'Cancel',
        create: 'Create',
        update: 'Update',
        delete: 'Delete',
        close: 'Close',
        operate: 'Operate',
        ban: 'Ban',
        announcement: 'Announcement',
        platform: 'Platform',
        pc: 'PC',
        mobile: 'Mobile',
        memo: 'Memo',
        no_memo: 'No @:dic.memo',
        total: 'Total',
        amount: 'Amount',
        balance: 'Balance',
        count: 'Count',
        register: 'Register',
        info: 'Info',
        bank: 'Bank',
        profit: 'Profit',
        period: 'Period',
        list: 'List',
        detail: 'Detail',
        management: 'MNGT',
        role: 'Role',
        permission: 'Permission',
        message: 'Message',
        commission: 'Commission',
        promotion: 'Promotion',
        online_payee: 'Online Payee',
        online_payer: 'Online Payer',
        payment_type: 'Payment Type',
        remit_payee: 'Remit Payee',
        chatroom: 'Chatroom'
    },
    user: {
        account: 'Account',
        username: 'Username',
        nickname: 'Nickname',
        real_name: 'Real Name',
        password: 'Password',
        prev_password: 'Previous Password',
        new_password: 'New Password',
        repeat_password: 'Repeat Password',
        account_type: 'Account @:dic.type',
        trial_account: 'Trial Account',
        real_account: 'Real Account',
        default_member_level: 'Default @:dic.member_level',
        visitor: 'Visitor',
        phone: 'Phone',
        wechat: 'Wechat',
        gender: 'Gender',
        email: 'E-mail',
        birthday: 'Birthday',
        qq: 'QQ',
        male: 'Male',
        female: 'Female',
        balance_before: 'Balance Before',
        balance_after: 'Balance After',
        contact_info: 'Contact @:dic.info',
        account_info: 'Account @:dic.info',
        registered_ip: '@:dic.register IP',
        last_login: 'Last Login',
        loggedin_domain: 'Logged In Domain',
        loggedin_info: 'Logged In @:dic.info',
        loggedin_ip_history: 'Logged In IP History',
        suggested_balance: 'Suggestion Balance',
        bet_amount: 'Bet Amount',
        current_audit: 'Current Audit',
        funds_summary: 'Transaction Summary',
        ongoing_transactions: 'Ongoing Transations',
        member_count: '@:dic.member @:dic.count',
        agent_count: '@:dic.agent @:dic.count',
        reset_password: 'Reset Password',
        reset_withdraw_password: 'Reset Withdraw Password',
        default_agent_password: 'Default Agent Password',
        default_password: 'Default Password',
        default_withdraw_password: 'Default Withdraw Password',
        update_member_audit: 'Update Member Audit',
        search_member: 'Search @:dic.member',
        agent_level: '@:dic.agent Level',
        parent_agent: 'Parent Agent',
        no_parent_agent: 'No parent agent',
        promo_code: 'Promo Code',
        promo_link: 'Promo Address',
        domain: 'Domain',
        no_domain: 'No agent domain name',
        domain_label: 'Multiple Domains should be @:system_msg.separated_by_comma',
        valid_member: 'Valid @:dic.member'
    },
    finance: {
        check_passed: 'Pass',
        transaction_type: 'Transaction @:dic.type',
        order_id: 'Order ID',
        order_detail: 'Order @:dic.detail',
        audit: 'Audit',
        audit_memo: 'Audit @:dic.memo',
        audit_amount: '@:finance.audit @:dic.amount',
        audit_type: '@:finance.audit Type',
        audit_free: 'Free',
        audit_deposit: 'Deposit @:finance.audit',
        audit_discount: 'Discount @:finance.audit',
        audit_multiple: '@:finance.audit Multiple',
        deposit: 'Deposit',
        deposit_discount: 'Deposit Discount',
        deposit_type: 'Deposit @:dic.type',
        deposit_amount: 'Deposit @:dic.amount',
        deposit_total: 'Total Deposit',
        deposit_audit_ratio: 'Deposit @:finance.audit比',
        depositor: 'Depositor',
        payer_type: 'Payer Type',
        remit: 'Remit',
        remit_account_available: 'Available Remit Account(s)',
        remit_deny: 'Deny',
        remit_discount: 'Remit Discount',
        remit_discount_no_set: 'No set remit discount',
        remit_type: 'Remit @:dic.type',
        remit_limit: 'Remit Limit',
        online_pay: 'Online Payment',
        online_pay_available: 'Available @:finance.online_pay Merchant(s)',
        online_pay_discount: '@:finance.online_pay discount',
        online_pay_discount_no_set: 'No set @:finance.online_pay discount',
        online_pay_limit: '@:finance.online_pay Limit',
        return: 'Return',
        discount: 'Discount',
        discount_rate: '@:finance.discount Rate',
        discount_limit: '@:finance.discount Limit',
        game_settlement: '@:dic.game Settlement',
        payment_alipay: 'Alipay',
        payment_wechat: 'Wechat',
        payment_normal: 'Normal',
        payment_domain: 'Payment Domain',
        payment_gateway: 'Payment Gateway',
        no_payment_gateway: 'No set payment gateway',
        merchant: 'Merchant',
        merchant_id: '@:finance.merchant ID',
        merchant_status: '@:finance.merchant @:dic.status',
        merchant_info: '@:finance.merchant @:dic.info',
        merchant_public_key: '@:finance.merchant Public Key',
        merchant_private_key: '@:finance.merchant Private Key',
        commission: 'Commission',
        commission_name: '@:finance.commission @:dic.name',
        commission_rate: '@:finance.commission Rate',
        commission_total: '@:dic.total @:finance.commission',
        manual_adjust: 'Manually Adjust Balance',
        manual_operation: 'Manual Operation',
        manual_withdraw: 'Manual Withdraw',
        manual_confirm: 'Manual Confirm',
        withdraw: 'Withdraw',
        withdraw_cancel: 'Cancel',
        withdraw_deny: 'Deny',
        withdraw_gateway: 'Withdraw Gateway',
        withdraw_payee: 'Withdraw Payee',
        withdraw_payee_info: 'Payee @:dic.info',
        withdraw_total: 'Total Withdraw',
        withdraw_limit: 'Withdraw Limit',
        withdraw_limit_count_per_day: 'Withdraw Limit Per Day',
        register_present: '@:dic.register Present',
        register_present_bank_info: 'Need Bank @:dic.info',
        register_present_amount: 'Present @:dic.amount',
        client_memo: 'Client @:dic.memo',
        dashboard_memo: 'Dashboard @:dic.memo',
        certificate: 'Certificate',
        public_key: 'Public Key',
        private_key: 'Private Key',
        board_url: 'Board URL',
        sum_fund: 'Sum Fund',
        income_threshold: '@:dic.profit Threshold',
        expired_in: 'Expired in',
        domain_label: 'Note: Add "/" at the end of the URL'
    },
    misc: {
        avatar: 'Avatar',
        logo: 'LOGO',
        ip: 'IP',
        isp: 'ISP',
        icon: 'Icon',
        qr_code: 'QR Code',
        area: 'Area',
        parameter: 'Parameter',
        repeated: 'Repeated',
        repeatable: 'repeatable',
        no_repeatable: 'not repeatable',
        img: 'Image',
        text: 'Text',
        no_limit: 'No limit',
        group_setting: 'groups',
        min_amount: 'Min @:dic.amount',
        max_amount: 'Max @:dic.amount',
        parameter_value: 'Value',
        display_name: 'Display @:dic.name',
        filter_visitor: 'Visitor Filter',
        view_all_transactions: 'View All Transactions',
        view_all_deposits: 'View All Deposits',
        view_all_member_orders: 'View @:dic.member Orders',
        view_all_logins: 'View Logged In Logs',
        view_all_member_transactions: 'View @:dic.member Transactions',
        view_today_report: 'View Today Report',
        view_agent_report: 'View @:dic.agent Report',
        view_history_betting_record: '@:dic.view History Betting Record',
        view_betting_record: '@:dic.view Today Betting Record',
        view_login_by_ip: 'View Login Records through this IP',
        others: 'Others',
        separated_by_spaces: 'separated by spaces',
        username_validation_msg: '{digit} letters or numbers',
        withdraw_audit_alert_msg: '确认此笔取款交易申请要直接审核通过吗？',
        online_pay_dongfangkf_alert_msg: '此操作会直接将订单状态更改为成功，请确认是否收到款项后再执行此操作',
        manual_adjust_suggested_balance: 'Include in Suggested Balance',
        manual_adjust_suggested_balance_alert_msg: 'If for lost amount, choose no.',
        manual_adjust_deposit_amount_alert_msg: 'A negative value means chargeback.',
        manual_adjust_submit_alert_msg: 'Note: Submitting the transaction will directly update the member account balance.'
    },
    system: {
        attention: 'Attention',
        loading: 'loading...',
        refresh: 'Refresh',
        refresh_period: 'Refresh period',
        please_select: 'Select',
        select_platform: '@:dic.platform select',
        select_remit_type: 'Remit @:dic.type select',
        select_all: 'Select all',
        deselect_all: 'Deselect all',
        no_setting: 'No @:dic.set',
        reset_condition: 'Reset',
        no_record: 'No record',
        no_data: 'No data',
        required: 'Required',
        not_required: 'Optional',
        new_window: 'New Window',
        no_permission: 'No Permission',
        accurate_search: 'Accurate search',
        fill_object: 'Please fill {object}',
        unfilled: 'Unfill',
        adjust_rank: 'Adjust Rank',
        batch_ban: 'Batch Ban',
        enabled_status: 'Enabled @:dic.status',
        download_report: 'Download',
        enter_keywords: 'Enter Keywords',
        show: 'Show',
        show_all: 'Show all',
        back_page: 'Go Back To The Last Page',
        hide: 'Hide',
        inform: 'Inform',
        add_group: 'Add group',
        dimension_displaying: 'Dimension displaying'
    },
    bet: {
        bet_id: 'Bet ID',
        win: 'Win',
        lose: 'Loss',
        tie: 'Tie',
        ongoing: 'Ongoing',
        valid_bet: 'Valid Bet',
        cancel_bet: 'Cancel',
        bet_amount: 'Bet @:dic.amount',
        total_bet_amount: '@:dic.total Bet @:dic.amount',
        total_profit: '@:dic.total@:dic.profit',
        settled_amount: 'Settled @:dic.amount',
        settled_balance: 'Settled @:dic.balance',
        settled_retreat: '@:dic.balance After retreating',
        member_win: '@:dic.member win',
        member_lose: '@:dic.member loss'
    },
    system_msg: {
        server_error: 'An error occured. Please try again later.',
        confirm_action_object: 'Are you sure you wanna {action} {object}?',
        confirm_retreat_schedule: 'Are you sure you wanna retreat all {game} {period} settled bets？',
        confirm_manual_draw: 'Please check if manual draw. This operation affects {bet_record_count} bet record(s).',
        action_object_status: '{action} {object} {status}！',
        no_select_object: 'You haven\'t select {object}！',
        click_submit_and_clear: 'Please click submit button and save.',
        remit_payee_delete_error: 'This remit payee cannot be deleted because it has active transaction.',
        agent_login_error: 'You\'re an agent. Please log in Agent Dashboard.',
        error_occurred: 'An error occurred. Please contact support.',
        file_size_too_large: 'File size is too large, please select another one.',
        password_changed: 'The password has been modified to: ',
        withdraw_password_changed: 'The withdraw password has been modified to: ',
        password_changed_success: 'The password has been modified successfully. It is routing to login page.',
        agent_password_changed: 'The agent password has been modified to: ',
        separated_by_comma: 'separated by \',\'',
        no_change: 'No change.',
        draw_number_tip: '%{num_len} %{unique} numbers (%{range_floor}~%{range_ceil}) separated by \'%{separator}\'',
        manual_draw_alert: '未开期数可能为官方未开奖，请谨慎使用手动开奖',
        no_draw_alert: '将此期注单状态标注为官方未开奖？',
        no_draw_inform: 'Send message to the members bet this period.',
        official_invalid: 'Official no draw.',
        draw_number_wrong: 'Drawing numbers are wrong format',
        retreat_schedule_all: 'Retreat all bets in the schedule.'
    },
    status: {
        active: 'Active',
        inactive: 'Inactive',
        ongoing: 'Ongoing',
        confirmed: 'Confirmed',
        rejected: 'Rejected',
        declined: 'Declined',
        success: 'Success',
        cancelled: 'Cancelled',
        failed: 'Failed',
        disabled: 'Disabled',
        payment_pending: 'Pending',
        handled: 'Handled',
        yes: 'Yes',
        no: 'No',
        pass: 'Pass',
        no_pass: 'Not passed',
        saved: 'Saved',
        updated: 'Updated'
    },
    time: {
        created_at: 'Created at',
        registered_at: '@:dic.register at',
        transaction_at: 'Transaction at',
        updated_at: 'Updated at',
        operated_at: 'Operated at',
        betted_at: 'Betted at',
        draw_at: 'Drew at',
        settled_at: 'Settled at',
        joined_at: 'Joined at',
        applied_at: 'Applied at',
        deposited_at: 'Deposited at',
        login_at: 'Logged in at',
        logout_at: 'Logged out at',
        today: 'Today',
        yesterday: 'Yesterday',
        this_week: 'This week',
        last_week: 'Last week',
        this_month: 'This month',
        last_month: 'Last month',
        seconds: '{number} seconds',
        minute: 'Minute',
        week: 'Week: ',
        weeks: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    },
    title: {
        basic_info: 'Basic Information',
        basic_setting: 'Basic Setting',
        login: 'Log in',
        logout: 'Log out',
        change_password: 'Change Password',
        overview: 'Overview',
        finance_management: 'Finance',
        finance_remit: 'Remit',
        finance_withdraw: 'Withdraw Requests',
        finance_online_pay: 'Online Pay Orders',
        finance_search: 'Search',
        finance_operation: 'Manual Operation',
        report_management: 'Report',
        report_finance: 'Finance Report',
        report_member: 'Membership Report',
        report_game: 'Game Report',
        report_agent: 'Agent Report',
        betting_record: 'Bet Record',
        betting_record_detail: 'Bet Record @:dic.detail',
        betting_record_instant: 'Real Time Bet Record',
        user_management: 'User @:dic.management',
        agent_application: '@:dic.agent Application',
        online_member: 'Online @:dic.member',
        game_setting: 'Game @:dic.management',
        drawing_history: 'Draw Result',
        transaction_setting: 'Transaction',
        setting: 'System',
        setting_global_parameter: 'Global Parameter',
        setting_chatroom: 'Chatroom',
        setting_chatroom_edit: '@:dic.update Chatroom Setting',
        setting_bank: 'Bank @:dic.management',
        log_management: 'Logging',
        log_login: 'Login Log',
        log_action: 'Action Log',
        agent_commission: 'Commission',
        report_commission: 'Commission Report',
        marketing_management: 'Marketing',
        marketing_banner: 'Banner @:dic.management',
        marketing_website: 'Website @:dic.management',
        marketing_agreement: 'Agent Agreement',
        operation_guide: 'Operation Guide',
        action_object: '{action}{object}',
        ...autoAddTitle
    },
    game: {
        category: 'Category',
        play: 'Play',
        odds: 'Odds',
        standard_odds: 'Standard Odds',
        set_icon: 'Set Icon',
        no_set_icon: 'No set icon',
        set_holiday: 'Set holiday',
        holiday: 'Holiday',
        holiday_start_at: 'Holiday Start at',
        holiday_end_at: 'Holiday End at',
        closed_status: 'Closed @:dic.status',
        closed: 'Closed',
        open: 'Open',
        min_per_bet: 'Lowest Amount Per Bet',
        max_per_bet: 'highest Amount Per Bet',
        max_per_draw: 'highest Amount Currently',
        period_drawed: 'Today Drew @:dic.period',
        period_last: 'Today Lasy @:dic.period',
        period_abnormal: 'Abnormal @:dic.period',
        period_no_abnormal: 'No Abnormal @:dic.period',
        period_current: 'Current Period',
        period_current_bet_count: 'Bet Count',
        draw_number: 'Drawing Result',
        draw_number_no_set: 'No set drawing result',
        manual_draw: 'Manual Draw',
        retreat_schedule: 'Retreat Schedule',
        no_draw: 'No draw',
        ongoing: 'Ongoing',
        cancelled: 'Cancelled',
        niouniou_col_head: '庄闲 (背景有颜色代表闲家赢)',
        niouniou_col_sub_head: ['庄', '闲一', '闲二', '闲三', '闲四', '闲五']
    },
    result: {
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
        three_balls_sum_col: '佰拾个和数',
        three_balls_sum: '和数',
        three_balls_sum_tail: '和数尾',
        seven_color_wavelength: '7色波',
        balls_odd_even_cp: '单双比',
        balls_front_rear_count_cp: '前后比',
        weird_chinese_dice_rules_1_3: '前三',
        weird_chinese_dice_rules_2_4: '中三',
        weird_chinese_dice_rules_3_5: '后三',
        comparison: '比数量',
        dragon: '龙',
        tiger: '虎',
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
    promotion: {
        banner: 'Banner',
        banner_mobile: '@:dic.mobile Banner',
        desc: '@:dic.pc @:dic.promotion @:dic.detail',
        desc_mobile: '@:dic.mobile @:dic.promotion @:dic.detail',
        rank: '@:dic.promotion Order',
        availability: 'Availability',
        start_date: 'Start @:dic.date',
        end_date: 'End @:dic.date',
        end_date_not_before_start_date: 'End date can\'t be earlier than start date.',
        copy_promotion: 'Copy @:dic.promotion'
    },
    action: {
        action_type: 'Action @:dic.type',
        action_types: {
            finance: 'Finance', // Back-end key
            configuration: 'Configuration', // Back-end key
            member_information: '@:dic.member @:dic.info', // Back-end key
            game: '@:dic.game' // Back-end key
        },
        description: 'Description'
    },
    report: {
        game: {
            amount: 'Bet Amount', // Back-end key
            member_count: 'Member Count', // Back-end key
            avg_amount: 'Average Amount Per Bet', // Back-end key
            profit: '@:dic.profit' // Back-end key
        },
        member: {
            real_member_registration_count: 'Member Registration Count',
            deposit_member_count: 'Deposit Member Count',
            bet_member_count: 'Bet Member Count',
            trial_member_count: 'Trial Member Count'
        }
    },
    chatroom: {
        preference_setting: '@:dic.chatroom Parameter Setting',
        setting: '@:dic.chatroom Setting',
        list: '@:dic.chatroom List',
        default_chatroom: 'Default @:dic.chatroom',
        game_room: '@:dic.game Room',
        manager: 'Manager',
        plan_maker: 'Plan Maker',
        keyin_tips: 'Please key in member username @:system_msg.separated_by_comma',
        plan_robot: '@:dic.chatroom Plan Robot',
        bulletin: '@:dic.chatroom Announcement',
        bulletin_content: 'Announcement Content'
    },
    robot: {
        nickname: '@:user.nickname',
        manager: '管理员', // Back-end parameter
        member: '普通会员', // Back-end parameter
        online_time: 'Online @:dic.time',
        speak_interval: 'Speak Interval',
        on_time: 'On @:dic.time',
        off_time: 'Off @:dic.time'
    },
    bank: {
        bank_info: 'Bank Information',
        province: 'Province',
        address: 'Branch',
        city: 'City',
        account: 'Account'
    },
    message: {
        title: 'Title',
        receiver: 'Receiver',
        receiver_group: 'Group',
        content: 'Content',
        sent_at: 'Sent at',
        sender: 'Sender'
    },
    overview: {
        label: {
            amount: 'Bet @:dic.amount',
            betrecord_count: 'Bet Count',
            bet_amount: 'Bet Amount',
            profit: '@:dic.profit',
            register_count: '@:dic.register人数'
        },
        title: {
            amount: 'Bet Amount of past 7 days',
            game: 'Game Activity of past 7 days',
            profit: 'Profit of Agent over the past 7 days',
            register_count: 'Register Count of past 7 days'
        }
    },
    website: {
        _: 'Website',
        name: '@:website._ @:dic.name',
        second_name: '@:website._ 2nd Name',
        header_img: 'Header Image',
        main_content: 'Main Content',
        advertisement: '@:website._ Advertisement',
        agent_joining_agreement: 'Agent Joining Agreement',
        right_float_img: 'Right Floating Image'
    }
}
