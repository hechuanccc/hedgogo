# belinda-web

> web-app

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:7878
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

## File Structure

```
├──build
├──config
├──hooks
├──node_modules
└──src
    ├──assets
    ├──components
    │   ├──AlertMsg.vue                     // 警告讯息组件（待移除）
    │   ├──AsideMenu.vue                    // 左方菜单组件
    │   ├──BarChart.js                      // 柱状图表组件
    │   ├──Header.vue                       // 页面头组件
    │   ├──InputMemberSearch.vue            // 快速搜寻会员组件
    │   ├──LineChart.js                     // 折线图组件
    │   ├──ModalWithdrawPayee.vue           // 代付弹窗组件
    │   ├──Pulling.vue                      // 分页组件
    │   ├──SelectorAgent.vue                // 代理商选择器组件
    │   ├──SelectorAgentLevel.vue           // 代理等级选择器组件
    │   ├──SelectorBank.vue                 // 银行选择器组件
    │   ├──SelectorCommission.vue           // 佣金选择器组件
    │   ├──SelectorGame.vue                 // 游戏选择器组件
    │   ├──SelectorMemberLevel.vue          // 会员等级选择器组件
    │   ├──SelectorOnlinePayer.vue          // 代付商户选择器组件
    │   ├──SelectorTransactionType.vue      // 交易类型选择器组件
    │   ├──Style.vue                        // 样式 
    │   ├──Tinymce.vue                      // TinyMCE
    │   └──TransactionStatus.vue            // 交易状态组件
    ├──views
    │   ├──Bill
    │   │   ├──Detail.vue                   // 交易详情页面
    │   │   ├──OnlinePay.vue                // 线上支付看板页面
    │   │   ├──Operation.vue                // 手工存提页面
    │   │   ├──Remit.vue                    // 转账充值审核页面
    │   │   ├──Search.vue                   // 交易记录查询页面
    │   │   └──Withdraw.vue                 // 取款申请审核页面
    │   ├──Game
    │   │   ├──Game.vue                     // 游戏列表页面
    │   │   └──GameDetail.vue               // 游戏管理页面
    │   ├──Log
    │   │   ├──Action.vue                   // 操作日志页面
    │   │   └──Login.vue                    // 登录日志页面
    │   ├──Marketing
    │   │   ├──AgentAgreement.vue           // 加盟协议页面
    │   │   ├──Announcement.vue             // 公告管理页面
    │   │   ├──Banner.vue                   // Banner管理页面
    │   │   ├──Message.vue                  // 站内信页面
    │   │   ├──MessageDetail.vue            // 站内信详细页面
    │   │   ├──MessageForm.vue              // 站内信表单页面
    │   │   ├──Promotion.vue                // 优惠活动页面
    │   │   ├──PromotionDetail.vue          // 优惠活动详细页面
    │   │   ├──PromotionForm.vue            // 优惠活动表单页面
    │   │   └──Website.vue                  // 网站管理页面
    │   ├──Report
    │   │   ├──BetRecord.vue                // 投注纪录页面
    │   │   ├──BetRecordDetail.vue          // 投注纪录详细页面
    │   │   ├──Commission.vue               // 佣金报表页面
    │   │   ├──Finance.vue                  // 财务报表页面
    │   │   ├──Game.vue                     // 游戏报表页面
    │   │   └──Membership.vue               // 会员报表页面
    │   ├──Result
    │   │   ├──History.vue                  // 历史开奖总览页面
    │   │   └──HistoryDetail.vue            // 历史开奖详细页面
    │   ├──Setting
    │   │   ├──Commission.vue               // 佣金设定页面
    │   │   ├──CommissionForm.vue           // 佣金设定表单页面
    │   │   ├──GlobalParameter.vue          // 系统参数页面
    │   │   ├──MemberLevel.vue              // 会员等级页面
    │   │   ├──MemberLevelDetail.vue        // 会员等级详细页面
    │   │   ├──MemberLevelForm.vue          // 会员等级表单页面
    │   │   ├──OnlinePayee.vue              // 支付商户管理页面
    │   │   ├──OnlinePayeeDetail.vue        // 支付商户管理详细页面
    │   │   ├──OnlinePayeeForm.vue          // 支付商户管理表单页面
    │   │   ├──OnlinePayer.vue              // 代付商户管理页面
    │   │   ├──OnlinePayerDetail.vue        // 代付商户管理详细页面
    │   │   ├──OnlinePayerForm.vue          // 代付商户管理表单页面
    │   │   ├──PaymentType.vue              // 支付方式管理页面
    │   │   ├──PaymentTypeForm.vue          // 支付方式管理表单页面
    │   │   ├──RemitPayee.vue               // 转账充值帐号页面
    │   │   ├──RemitPayeeDetail.vue         // 转账充值帐号详细页面
    │   │   ├──RemitPayeeForm.vue           // 转账充值帐号表单页面
    │   │   ├──Role.vue                     // 角色管理页面
    │   │   ├──RoleDetail.vue               // 角色管理详细页面
    │   │   └──RoleForm.vue                 // 角色管理表单页面
    │   ├──User
    │   │   ├──Agent.vue                    // 代理商页面
    │   │   ├──AgentApplication.vue         // 代理申请页面
    │   │   ├──AgentApplicationDetail.vue   // 代理申请详细页面
    │   │   ├──AgentDetail.vue              // 代理商详细页面
    │   │   ├──AgentForm.vue                // 代理商表单页面
    │   │   ├──Member.vue                   // 会员页面
    │   │   ├──MemberDetail.vue             // 会员详细页面
    │   │   ├──MemberForm.vue               // 会员申请页面
    │   │   ├──Staff.vue                    // 子帐号页面
    │   │   ├──StaffDetail.vue              // 子帐号详细页面
    │   │   └──StaffForm.vue                // 子帐号申请页面
    │   ├──App.vue                          // 根页面
    │   ├──Ban.vue                          // 无权限访问页面
    │   ├──ChangePassword.vue               // 修改密码页面
    │   ├──Error.vue                        // 报错页面（未使用）
    │   ├──Login.vue                        // 登录页面
    │   └──Overview.vue                     // 总览页面
    ├──i18n
    ├──plugin
    │   └──NotificationPlugin
    ├──main.js
    ├──utils
    ├──vuex
    ├──api.js
    └──router.js
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
