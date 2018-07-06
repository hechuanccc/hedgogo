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
└──src
    ├──assets
    ├──components
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
    │   │   ├──Detail.vue                   // 交易详情页
    │   │   ├──OnlinePay.vue                // 线上支付看板页
    │   │   ├──Operation.vue                // 手工存提页
    │   │   ├──Remit.vue                    // 转账充值审核页
    │   │   ├──Search.vue                   // 交易记录查询页
    │   │   └──Withdraw.vue                 // 取款申请审核页
    │   ├──Game
    │   │   ├──Game.vue                     // 游戏列表页
    │   │   └──GameDetail.vue               // 游戏管理页
    │   ├──Log
    │   │   ├──Action.vue                   // 操作日志页
    │   │   └──Login.vue                    // 登录日志页
    │   ├──Marketing
    │   │   ├──AgentAgreement.vue           // 加盟协议页
    │   │   ├──Announcement.vue             // 公告管理页
    │   │   ├──Banner.vue                   // Banner管理页
    │   │   ├──Message.vue                  // 站内信页
    │   │   ├──MessageDetail.vue            // 站内信详细页
    │   │   ├──MessageForm.vue              // 站内信表单页
    │   │   ├──Promotion.vue                // 优惠活动页
    │   │   ├──PromotionDetail.vue          // 优惠活动详细页
    │   │   ├──PromotionForm.vue            // 优惠活动表单页
    │   │   └──Website.vue                  // 网站管理页
    │   ├──Report
    │   │   ├──BetRecord.vue                // 投注纪录页
    │   │   ├──BetRecordDetail.vue          // 投注纪录详细页
    │   │   ├──Commission.vue               // 佣金报表页
    │   │   ├──Finance.vue                  // 财务报表页
    │   │   ├──Game.vue                     // 游戏报表页
    │   │   └──Membership.vue               // 会员报表页
    │   ├──Result
    │   │   ├──History.vue                  // 历史开奖总览页
    │   │   └──HistoryDetail.vue            // 历史开奖详细页
    │   ├──Setting
    │   │   ├──Bank.vue                     // 银行管理页
    │   │   ├──Commission.vue               // 佣金设定页
    │   │   ├──CommissionForm.vue           // 佣金设定表单页
    │   │   ├──GlobalParameter.vue          // 系统参数页
    │   │   ├──MemberLevel.vue              // 会员等级页
    │   │   ├──MemberLevelDetail.vue        // 会员等级详细页
    │   │   ├──MemberLevelForm.vue          // 会员等级表单页
    │   │   ├──OnlinePayee.vue              // 支付商户管理页
    │   │   ├──OnlinePayeeDetail.vue        // 支付商户管理详细页
    │   │   ├──OnlinePayeeForm.vue          // 支付商户管理表单页
    │   │   ├──OnlinePayer.vue              // 代付商户管理页
    │   │   ├──OnlinePayerDetail.vue        // 代付商户管理详细页
    │   │   ├──OnlinePayerForm.vue          // 代付商户管理表单页
    │   │   ├──PaymentType.vue              // 支付方式管理页
    │   │   ├──PaymentTypeForm.vue          // 支付方式管理表单页
    │   │   ├──RemitPayee.vue               // 转账充值帐号页
    │   │   ├──RemitPayeeDetail.vue         // 转账充值帐号详细页
    │   │   ├──RemitPayeeForm.vue           // 转账充值帐号表单页
    │   │   ├──Role.vue                     // 角色管理页
    │   │   ├──RoleDetail.vue               // 角色管理详细页
    │   │   └──RoleForm.vue                 // 角色管理表单页
    │   ├──User
    │   │   ├──Agent.vue                    // 代理商页
    │   │   ├──AgentApplication.vue         // 代理申请页
    │   │   ├──AgentApplicationDetail.vue   // 代理申请详细页
    │   │   ├──AgentDetail.vue              // 代理商详细页
    │   │   ├──AgentForm.vue                // 代理商表单页
    │   │   ├──Member.vue                   // 会员页
    │   │   ├──MemberDetail.vue             // 会员详细页
    │   │   ├──MemberForm.vue               // 会员申请页
    │   │   ├──Staff.vue                    // 子帐号页
    │   │   ├──StaffDetail.vue              // 子帐号详细页
    │   │   └──StaffForm.vue                // 子帐号申请页
    │   ├──App.vue                          // 根页
    │   ├──Ban.vue                          // 无权限访问页
    │   ├──ChangePassword.vue               // 修改密码页
    │   ├──Error.vue                        // 报错页（未使用）
    │   ├──Login.vue                        // 登录页
    │   └──Overview.vue                     // 总览页
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
