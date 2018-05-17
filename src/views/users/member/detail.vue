<template>
    <div>
      <div class="m-b">
        <ol class="breadcrumb">
          <li class="active"><router-link to="/member">{{$t('nav.member')}}</router-link></li>
          <li class="active">{{$route.meta.title}}</li>
        </ol>
      </div>
      <div class="box">
        <div class="box-header b-b">
          <div class="alert alert-success" v-if="passwordChanged >= 1">
            <span v-if="passwordChanged === 1">{{$t('action.login_password_changed')}}</span>
            <span v-if="passwordChanged === 2">{{$t('action.withdraw_password_changed')}}</span>
            <strong>{{newPassword}}</strong>
          </div>

          <div class="alert alert-danger" v-if="passwordChanged === -1">
            修改失败：{{errorMsg}}
          </div>
          <div class="row">
            <div class="col-xs-4">
              <h2><strong>{{member.username}}</strong>
                <span class="label success text-sm" v-if="member.account_type !== 0" >{{$t('member.real_account')}}</span>
              </h2>
              <span class="text-muted text-sm" v-if="member.created_at">于 {{ member.created_at | moment("YYYY-MM-DD HH:mm")}} {{$t('common.register')}}</span>
            </div>
            <div class="col-xs-8 text-right">
              <div>
                <router-link
                  class="md-btn md-flat m-r-sm"
                  :to="`/report/betrecord/history?member=${member.username}`"
                >{{$t('action.view_history_bet_record')}}
                </router-link>
                <router-link
                  class="md-btn md-flat m-r-sm"
                  :to="`/report/betrecord/today?member=${member.username}&created_at_0=${today}&created_at_1=${today}`"
                >{{$t('action.view_todays_bet_record')}}
                </router-link>
                <template>
                  <a class="md-btn md-flat m-r-sm" v-if="$root.permissions.includes('reset_member_password')" @click="resetPassword(1, $event)">{{$t('action.reset_password')}}</a>
                  <a class="md-btn md-flat m-r-sm" v-if="$root.permissions.includes('reset_member_withdraw_password')" @click="resetPassword(2, $event)">{{$t('action.reset_withdraw_password')}}</a>
                  <router-link class="md-btn md-flat" :to="'/member/' + member.id + '/edit'">{{$t('action.update_member')}}</router-link>
                  <a class="md-btn md-flat" @click="changeAudit" v-if="$root.permissions.includes('update_member_audit')">{{$t('action.change_audit_status')}}</a>
                </template>
              </div>
            </div>
          </div>
        </div>
        <div class="box-body">
          <div class="row b-b p-b m-b" v-if="member.balance">
            <div class="col-xs-2">
              <span class="text-muted">{{$t('member.balance')}}</span>
              <div>
                <strong class="text-lg text-success">{{member.balance.balance | currency('￥')}}</strong>
              </div>
            </div>
            <div class="col-xs-2">
              <span class="text-muted">{{$t('member.sug_balance')}}</span>
              <div>
                <strong class="text-lg text-danger">{{member.suggested_balance | currency('￥')}}</strong>
              </div>
            </div>
            <div class="col-xs-2">
              <div class="m-b">
                <span class="text-muted">{{$t('member.current_audit')}}</span>
                <span class="t-red" v-if="member.balance.bet_amount < member.balance.audit_amount">{{$t('member.failed')}}</span>
                <span class="t-green" v-else>{{$t('member.pass')}}</span>
              </div>
            </div>
            <div class="col-xs-2">
              <p class="m-b-0 text-muted">{{ $t('setting.bet_amount') }} / {{ $t('bill.audit_amount') }}</p>
              <strong class="t-red">{{member.balance.bet_amount}} / {{member.balance.audit_amount}}</strong>
            </div>
            <div class="col-xs-4">
              <router-link :to="'/bill/operation?member=' + member.username"  v-if="$root.permissions.includes('manual_deposit_withdraw')" class="m-r">{{$t('member.manual_adjust')}}</router-link>
            </div>
          </div>
          <div class="row m-b b-b p-b">
            <div class="col-xs-4">
              <strong class="text-muted">{{$t('member.fund_summary')}}</strong>
              <div class="label-width-eq m-t-sm">
                <div v-for="t in member.transaction_info.confirmed">
                  <span class="text-muted">{{t.transaction_type__display_name}}</span>
                  <span class="pull-right">
                      <span class="t-red" v-if="t.transaction_type__code === 'withdraw' || parseFloat(t.amount__sum) < 0"> {{t.amount__sum}}</span>
                      <span class="t-green" v-else> + {{t.amount__sum}}</span>
                      <router-link class="link-width" :to="{
                        path: '/bill/search/',
                        query: {
                          member: member.username,
                          member_level: member.level && member.level.id,
                          agent: member.agent && member.agent.name,
                          status: 1,
                          transaction_type: t.transaction_type__code
                        }
                      }" >{{t.id__count}} 次 </router-link>
                  </span>
                </div>
                <div v-if="!member.transaction_info.confirmed || member.transaction_info.confirmed.length === 0" class="text-muted">{{$t('member.no_confirmed_transactions')}}</div>
                <div v-if="sumAmount" class="b-t p-t-sm m-t-sm">
                  <span>{{$t('member.fund_sum')}}</span>
                  <span class="pull-right">
                      <strong class="t-green">{{sumAmount | currency('￥')}}</strong>
                      <a class="link-width">&nbsp;</a>
                  </span>
                </div>
              </div>
            </div>
            <div class="col-xs-5 col-md-offset-2">
              <strong class="text-muted title">{{$t('member.audit_list')}}</strong>
              <div class="label-width-eq m-t-sm">
                <div v-for="t in member.transaction_info.ongoing">
                  <span class="text-muted">{{t.transaction_type__display_name}}</span>
                  <span class="pull-right">
                      <span class="t-grey">{{t.amount__sum | currency('￥')}}</span>
                      <router-link class="link-width" :to="{
                        path: '/bill/search/',
                        query: {
                          member: member.username,
                          member_level: member.level && member.level.id,
                          agent: member.agent && member.agent.name,
                          status: 3,
                          transaction_type: t.transaction_type__code
                        }
                      }" >{{t.id__count}} 次 </router-link>
                  </span>
                </div>
                <div v-if="!member.transaction_info.ongoing || member.transaction_info.ongoing.length === 0" class="text-muted">{{$t('member.no_ongoing_transactions')}}</div>
              </div>
            </div>

          </div>
          <div class="row p-b b-b">
            <div class="col-xs-5">
              <span class="text-muted title">{{$t('member.status')}}</span>
              <div>
                <span class="label success" v-if="member.status === 1">{{$t('status.active')}}</span>
                <span class="label" v-else >{{$t('status.inactive')}}</span>
                <template v-if="$root.permissions.includes('update_member_status')">
                  <a class="text-sm m-l" @click="toggleStatus" v-if="member.status === 1">禁用</a>
                  <a class="text-sm m-l" @click="toggleStatus" v-else>启用</a>
                  <span class="text-success text-sm m-l" v-show="statusUpdated" @click="toggleStatus">状态已更新</span>
                </template>
              </div>
            </div>
            <div class="col-xs-5 col-xs-offset-1">
              <div class="row">
                <div class="col-md-3">
                  <span class="text-muted">{{$t('common.member') + $t('betrecord.win')}}</span>
                  <div><router-link :to="'/report/betrecord/history?member=' + member.username + '&status=win&created_at_1=' + today">{{member.total_gain | currency('￥')}}</router-link></div>
                </div>
                <div class="col-md-3">
                  <span class="text-muted">{{$t('common.member') + $t('betrecord.lose')}}</span>
                  <div><router-link :to="'/report/betrecord/history?member=' + member.username + '&status=lose&created_at_1=' + today">{{member.total_loss | currency('￥')}}</router-link></div>
                </div>
                <div class="col-md-3">
                  <span class="text-muted">{{$t('returnrate.return_amount')}}</span>
                  <div>
                    <span :class="{'text-muted': !member.total_return_amount}">{{member.total_return_amount | currency('￥')}}</span>
                  </div>
                </div>
                <div class="col-md-3">
                  <span class="text-muted">{{$t('member.total_ongoing_amount')}}</span>
                  <div>
                    <span :class="{'text-muted': !member.total_ongoing_amount}">{{member.total_ongoing_amount | currency('￥')}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row p-b b-b p-t">
            <div class="col-md-5">
              <span class="text-muted">{{$t('member.agent')}}</span>
              <div><router-link :to="'/agent/' + member.agent.id">{{member.agent.name}}</router-link></div>
            </div>
          </div>

          <div class="row m-b p-t p-b b-b">
            <div class="col-xs-5">
              <span class="text-muted">{{$t('common.basic_info')}}</span>
              <div  v-if="!showDetail">
                {{$t('common.real_name')}} :
                <span v-if="member.real_name">{{member.real_name}}</span>
                <span class="label" v-else>{{$t('common.unfilled')}}</span>，{{$t('member.phone_is')}}：
                <span v-if="member.phone">{{member.phone}}</span>
                <span class="label" v-else>{{$t('common.unfilled')}}</span>
              </div>
              <div class="p-a grey-50 lh-md m-t-sm label-width-eq m-b-sm" v-else>
                <div>
                  <span class="text-muted title">{{$t('common.real_name')}}</span>
                  <span v-if="member.real_name">{{member.real_name}}</span>
                  <span v-else class="text-muted">{{$t('common.unfilled')}}</span>
                </div>
                <div>
                  <span class="text-muted title">{{$t('common.phone')}}</span>
                  <span v-if="member.phone">{{member.phone}}</span>
                  <span v-else class="text-muted">{{$t('common.unfilled')}}</span>
                </div>
                <div>
                  <span class="text-muted title">{{$t('common.gender')}}</span>
                  <span v-if="member.gender">{{member.gender}}</span>
                  <span v-else class="text-muted">{{$t('common.unfilled')}}</span>
                </div>
                <div>
                  <span class="text-muted title">{{$t('common.email')}}</span>
                  <span v-if="member.email">{{member.email}}</span>
                  <span v-else class="text-muted">{{$t('common.unfilled')}}</span>
                </div>
                <div>
                  <span class="text-muted title">{{$t('common.birthday')}}</span>
                  <span v-if="member.birthday">{{member.birthday}}</span>
                  <span v-else class="text-muted">{{$t('common.unfilled')}}</span>
                </div>
                <div>
                  <span class="text-muted title">{{$t('common.wechat')}}</span>
                  <span v-if="member.wechat">{{member.wechat}}</span>
                  <span v-else class="text-muted">{{$t('common.unfilled')}}</span>
                </div>
                <div>
                  <span class="text-muted title">QQ</span>
                  <span v-if="member.qq">{{member.qq}}</span>
                  <span v-else class="text-muted">{{$t('common.unfilled')}}</span>
                </div>
              </div>
              <a @click="showDetail = !showDetail">
                <span v-if="showDetail">{{$t('action.close_detailed_infos')}} <i class="fa fa-angle-up"></i></span>
                <span v-else>{{$t('action.view_detailed_infos')}} <i class="fa fa-angle-down"></i></span>
              </a>
            </div>
            <div class="col-xs-5 col-xs-offset-1" v-if="member.level">
              <span class="text-muted">{{$t('member.level')}}</span>
              <div>
                <router-link :to="'/level/' + member.level.id">{{member.level.name}}</router-link>
              </div>
            </div>
          </div>
          <div class="row m-b b-b p-b">
            <div class="col-xs-5">
              <span class="text-muted">{{$t('bank.bank_title')}}</span>
              <div v-if="!member.bank || (typeof member.bank === 'array' && !member.bank.length)">
                <span class="label">{{$t('common.unfilled')}}</span>
              </div>
              <div class="grey-50 p-a m-t" v-else>
                <div>{{$t('bank.name')}}：<span>{{(member.bank.bank && member.bank.bank.name) || '-'}}</span></div>
                <div>{{$t('bank.province')}}：<span>{{member.bank.province || '-'}}</span></div>
                <div>{{$t('bank.city')}}：<span>{{member.bank.city || '-'}}</span></div>
                <div>{{$t('bank.account')}}：<span>{{member.bank.account || '-'}}</span></div>
              </div>
            </div>
          </div>

          <div class="row m-b b-b p-b">
            <div class="col-xs-5">
              <span class="text-muted">{{$t('member.last_login')}}</span>
              <div v-if="member.last_login">
                <div>{{$t('member.ip')}} : {{member.last_login.ipaddr}}</div>
                <div>{{$t('member.login_platform')}}: {{member.last_login.platform}}</div>
                <div>{{member.last_login.country}} {{member.last_login.city}} {{member.last_login.isp}} </div>
                <div>{{member.last_login.login_at | moment("YYYY-MM-DD HH:mm:ss")}}</div>
              </div>
              <div v-else class="text-muted"><small>{{$t('common.no_record')}}</small></div>
            </div>
            <div class="col-xs-5 col-xs-offset-1">
              <router-link v-if="member.last_login" class="m-r" :to="'/login_record?member=' + member.username">{{$t('member.view_all_login')}}</router-link>
              <router-link v-if="member.last_login" :to="'/login_record?ipaddr=' + member.last_login.ipaddr">{{$t('member.view_login_by_ip')}}</router-link>
            </div>
          </div>

          <div class="row">
            <div class="col-xs-5">
              <span class="text-muted">{{$t('common.remarks')}}</span>
              <div v-if="member.memo">{{member.memo}}</div>
              <div class="text-muted" v-else>{{$t('common.no_remarks')}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
    import api from '../../../api'
    import Vue from 'vue'
    const format = 'YYYY-MM-DD'

    export default {
        data () {
            return {
                showDetail: false,
                showAccounts: false,
                statusUpdated: false,
                passwordChanged: false,
                newPassword: '',
                today: '',
                member: {
                    id: '',
                    account_type: '',
                    level: {},
                    balance: {
                        balance: ''
                    },
                    status: '',
                    agent: {},
                    transaction_info: {
                        ongoing: [],
                        confirmed: []
                    },
                    last_login: {}
                },
                accounts: [],
                loading: true,
                balanceLoading: true,
                providerActive: ''
            }
        },
        computed: {
            sumAmount () {
                let items = this.member.transaction_info.confirmed
                let amount = 0
                for (let x in items) {
                    if (items[x].transaction_type__code === 'withdraw') {
                        amount -= parseFloat(items[x].amount__sum)
                    } else {
                        amount += parseFloat(items[x].amount__sum)
                    }
                }
                return Math.round(amount * 100) / 100
            }
        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                let id = to.params.memberId
                vm.getMember(id)
                vm.today = Vue.moment(new Date()).format(format)
            })
        },
        watch: {
            passwordChanged (newObj, old) {
                setTimeout(() => {
                    this.passwordChanged = 0
                }, 8000)
            },
            '$route.params' (newObj, old) {
                this.getMember(this.$route.params.memberId)
            }
        },
        methods: {
            toggleProvider (account) {
                this.providerActive = account
            },
            toggleStatus () {
                this.statusUpdated = false
                this.$http.put(api.member + this.member.id + '/?opt_fields=status', {
                    status: this.member.status === 1 ? 0 : 1
                }).then(data => {
                    this.member.status = data.status
                    this.statusUpdated = true
                    setTimeout(() => {
                        this.statusUpdated = false
                    }, 2000)
                })
            },
            resetPassword (type, event) {
                // type = 1 for reset login password
                // type = 2 for reset withdraw password
                if (!window.confirm(this.$t('member.reset_confirm', {
                    action: event.target.innerText
                }))) {
                    return
                }
                let url = type === 1 ? api.resetmember : api.resetwithdraw
                this.$http.post(url, {
                    'account_id': this.member.id
                }, {emulateJSON: true}).then(data => {
                    this.passwordChanged = type
                    this.newPassword = data.new_password || data.new_withdraw_password
                }, error => {
                    this.passwordChanged = -1
                    this.errorMsg = error
                })
            },
            getMember (id) {
                this.$http.get(api.member + id + '/?opt_expand=bank&action').then(data => {
                    this.member = data
                    this.member_id = {'account_id': data.id}
                })
            },
            changeAudit () {
                let id = this.$route.params.memberId
                if (!this.member.balance.bet_amount && !this.member.balance.audit_amount) {
                    window.alert('成功修改该会员稽核!')
                    return
                } else {
                    if (!window.confirm('确定要修改该会员的稽核吗')) {
                        return
                    }
                }
                this.$http.put(api.member + id + '/?audit=' + id, {username: this.member.username, agent: this.member.agent.id, level: this.member.level.id})
                .then(data => {
                    this.member.balance.bet_amount = data.balance.bet_amount
                    this.member.balance.audit_amount = data.balance.audit_amount
                })
            }
        }
    }
</script>

<style scoped lang="scss">
.label-width-eq {
    line-height: 1.8;
    .title {
        display: inline-block;
        width: 80px;
    }
    .link-width {
        text-align: right;
        display: inline-block;
        width: 40px;
    }
}
.loading {
    text-align: center;
}
.table-striped > tbody > tr:nth-child(odd) {
  background: none;
}
.table {
  background-color: #fafafa
}
</style>
