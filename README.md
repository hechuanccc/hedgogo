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
    │   ├──AlertMsg.vue
    │   ├──BarChart.js
    │   ├──Header.vue
    │   ├──InputMemberSearch.vue
    │   ├──LineChart.js
    │   ├──ModalWithdrawPayee.vue
    │   ├──Nav.vue
    │   ├──Pulling.vue
    │   ├──SelectorAgent.vue
    │   ├──SelectorAgentLevel.vue
    │   ├──SelectorBank.vue
    │   ├──SelectorCommission.vue
    │   ├──SelectorGame.vue
    │   ├──SelectorMemberLevel.vue
    │   ├──SelectorOnlinePayer.vue
    │   ├──SelectorTransactionType.vue
    │   ├──Style.vue
    │   ├──Tinymce.vue
    │   └──TransactionStatus.vue
    ├──views
    │   ├──Bill
    │   │   ├──Detail.vue
    │   │   ├──OnlinePay.vue
    │   │   ├──Operation.vue
    │   │   ├──Remit.vue
    │   │   ├──Search.vue
    │   │   └──Withdraw.vue
    │   ├──Game
    │   │   ├──Game.vue
    │   │   └──GameDetail.vue
    │   ├──Log
    │   │   ├──Action.vue
    │   │   └──Login.vue
    │   ├──Marketing
    │   │   ├──Announcement.vue
    │   │   ├──Banner.vue
    │   │   ├──Envelope.vue
    │   │   ├──EnvelopeConfig.vue
    │   │   ├──EnvelopeConfigForm.vue
    │   │   ├──EnvelopeForm.vue
    │   │   ├──Message.vue
    │   │   ├──MessageDetail.vue
    │   │   ├──MessageForm.vue
    │   │   ├──Promotion.vue
    │   │   ├──PromotionDetail.vue
    │   │   ├──PromotionForm.vue
    │   │   └──Website.vue
    │   ├──Report
    │   │   ├──BetRecord.vue
    │   │   ├──BetRecordDetail.vue
    │   │   ├──Commission.vue
    │   │   ├──Finance.vue
    │   │   └──Membership.vue
    │   ├──Result
    │   │   ├──History.vue
    │   │   └──HistoryDetail.vue
    │   ├──Setting
    │   │   ├──Commission.vue
    │   │   ├──CommissionForm.vue
    │   │   ├──GlobalParameter.vue
    │   │   ├──MemberLevel.vue
    │   │   ├──MemberLevelDetail.vue
    │   │   ├──MemberLevelForm.vue
    │   │   ├──OnlinePayee.vue
    │   │   ├──OnlinePayeeDetail.vue
    │   │   ├──OnlinePayeeForm.vue
    │   │   ├──OnlinePayer.vue
    │   │   ├──OnlinePayerDetail.vue
    │   │   ├──OnlinePayerForm.vue
    │   │   ├──PaymentType.vue
    │   │   ├──PaymentTypeForm.vue
    │   │   ├──RemitPayee.vue
    │   │   ├──RemitPayeeDetail.vue
    │   │   ├──RemitPayeeForm.vue
    │   │   ├──Robot.vue
    │   │   ├──Role.vue
    │   │   ├──RoleDetail.vue
    │   │   └──RoleForm.vue
    │   ├──User
    │   │   ├──Agent.vue
    │   │   ├──AgentApplication.vue
    │   │   ├──AgentApplicationDetail.vue
    │   │   ├──AgentDetail.vue
    │   │   ├──AgentForm.vue
    │   │   ├──Member.vue
    │   │   ├──MemberDetail.vue
    │   │   ├──MemberForm.vue
    │   │   ├──Staff.vue
    │   │   ├──StaffDetail.vue
    │   │   └──StaffForm.vue
    │   ├──App.vue
    │   ├──Ban.vue
    │   ├──ChangePassword.vue
    │   ├──Error.vue
    │   ├──Login.vue
    │   └──Overview.vue
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
