<template>
    <div>
      <div class="m-b">
          <ol class="breadcrumb">
              <li v-if="transactionPage.includes(transaction.transaction_type.code)" class="active"><router-link :to="`/bill/${transaction.transaction_type.code}`">{{transaction.transaction_type.display_name}}</router-link></li>
              <li class="active">{{transaction.transaction_type.display_name}}</li>
          </ol>
      </div>
      <div class="box">
        <div class="box-header b-b">
            <h3 class="inline">{{transaction.transaction_type.display_name}}</h3>
        </div>
        <div class="box-body">
            <div class="row">
                <div class="col-xs-6">
                    <div class="row">
                        <div class="col-xs-3 text-right v-m"><strong>{{$t('dic.amount')}}</strong></div>
                        <div class="col-xs-8">
                            <span class="text-success text-md v-m m-r">{{transaction.amount | currency('￥')}}</span>
                            <transaction-status :transaction="transaction"></transaction-status>
                        </div>
                    </div>

                    <div class="row m-t">
                        <div class="col-xs-3 text-right">{{$t('finance.order_id')}}</div>
                        <div class="col-xs-8"><span class="text-muted">{{transaction.transaction_id}}</span></div>
                    </div>

                    <div class="row m-t">
                        <div class="col-xs-3 text-right">{{$t('finance.order_detail')}}</div>
                        <div class="col-xs-8 info-box">
                            <div v-if="transaction.transaction_type.code === 'remit'" class="grey-100 p-a clearfix">
                                <div class="row">
                                    <div class="col-xs-3 text-right text-muted">{{$t('bank.account')}}</div>
                                    <div class="col-xs-9 ">{{transaction.remit_info.remit_payee.payee_name || transaction.remit_info.remit_payee.nickname}}</div>
                                </div>
                                <div class="row">
                                    <div class="col-xs-3 text-right text-muted">{{$t('finance.depositor')}}</div>
                                    <div class="col-xs-9 ">{{transaction.remit_info.depositor || '-'}}</div>
                                </div>
                                <div class="row">
                                    <div class="col-xs-3 text-right text-muted">{{$t('dic.amount')}}</div>
                                    <div class="col-xs-9 ">￥{{transaction.amount || '-'}}</div>
                                </div>
                                <div class="row">
                                    <div class="col-xs-3 text-right text-muted">{{$t('time.deposited_at')}}</div>
                                    <div class="col-xs-9 ">{{transaction.remit_info.deposited_at | moment('YYYY-MM-DD HH:mm:ss')}} &nbsp;</div>
                                </div>
                            </div>

                            <div class="grey-100 p-a clearfix" v-if="transaction.transaction_type.code === 'online_pay' && transaction.online_payee">
                                <div class="row">
                                    <div class="col-xs-3 text-right text-muted">{{$t('finance.merchant')}}</div>
                                    <div class="col-xs-9 ">
                                        <router-link :to="'/online_payee/' + transaction.online_payee.id">{{transaction.online_payee.name}}</router-link>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-xs-3 text-right text-muted">{{$t('finance.merchant_status')}}</div>
                                    <div class="col-xs-9 ">
                                        <span class="label success" v-if="transaction.merchant_status===1">{{$t('status.confirmed')}}</span>
                                        <span class="label" v-if="transaction.merchant_status===2">{{$t('status.ongoing')}}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="grey-100 p-a clearfix" v-if="transaction.transaction_type.code === 'withdraw'">
                                <div class="row">
                                    <div class="col-xs-3 text-right text-muted">{{$t('user.real_name')}}</div>
                                    <div class="col-xs-9 " v-if="transaction.member.real_name">{{transaction.member.real_name}} &nbsp;</div>
                                    <div class="col-xs-9 " v-else> - &nbsp;</div>
                                </div>
                                <div class="row">
                                    <div class="col-xs-3 text-right text-muted">{{$t('dic.bank')}}</div>
                                    <div class="col-xs-9 ">{{transaction.member.bank.name}} &nbsp;</div>
                                </div>
                                <div class="row">
                                    <div class="col-xs-3 text-right text-muted">{{$t('bank.province')}}</div>
                                    <div class="col-xs-9 ">{{transaction.member.bank.province}} &nbsp;</div>
                                </div>
                                <div class="row">
                                    <div class="col-xs-3 text-right text-muted">{{$t('bank.city')}}</div>
                                    <div class="col-xs-9 ">{{transaction.member.bank.city}} &nbsp;</div>
                                </div>
                                <div class="row">
                                    <div class="col-xs-3 text-right text-muted">{{$t('bank.account')}}</div>
                                    <div class="col-xs-9 ">{{transaction.member.bank.account}} &nbsp;</div>
                                </div>
                            </div>
                            <div class="grey-100 p-a clearfix" v-if="transaction.transaction_type.code === 'manual_operation'">
                                <div class="col-xs-3 text-right text-muted">{{$t('user.real_name')}}</div>
                                <div class="col-xs-9 ">{{transaction.member.username}} &nbsp;</div>


                                <div class="col-xs-3 text-right text-muted">{{$t('finance.audit_amount')}}</div>
                                <div class="col-xs-9" v-if="transaction.audit_amount">{{transaction.audit_amount | currency('￥')}} &nbsp;</div>
                                <div class="col-xs-9" v-else>
                                    <span>{{$t('finance.audit_free')}}</span>
                                </div>

                                <div class="col-xs-3 text-right text-muted">{{$t('dic.operator')}}</div>
                                <div class="col-xs-9 ">{{transaction.updated_by.username || '无'}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="row m-t" v-if="transaction.transaction_type.code != 'remit' && transaction.transaction_type.code != 'online_pay' && transaction.transaction_type.code != 'withdraw'">
                      <div class="col-xs-3 text-right">{{$t('dic.memo')}}</div>
                      <div class="col-xs-8" >
                        <span class="text-muted">{{transaction.memo || '无备注信息'}}</span>
                      </div>
                    </div>
                </div>
                <div class="col-xs-6">
                    <div class="row m-t">
                        <div class="col-xs-3 text-right">{{$t('dic.member')}}</div>
                        <div class="col-xs-8">
                            <router-link :to="'/member/' + transaction.member.id">{{transaction.member.username}}</router-link>
                            <router-link
                                :to="{
                                    path: '/bill/search',
                                    query: {
                                        member: transaction.member.username,
                                        member_level: transaction.member.level && transaction.member.level.id,
                                        agent: transaction.member.agent && transaction.member.agent.username,
                                    }
                                }" 
                                class="m-l text-blue"
                            >{{$t('misc.view_all_member_orders')}}
                            </router-link>
                        </div>
                    </div>
                    <div class="row m-t">
                        <div class="col-xs-3 text-right">{{$t('dic.member_level')}}</div>
                        <div class="col-xs-8">
                            <router-link :to="'/level/' + transaction.member.level.id">{{transaction.member.level.name}}</router-link>
                        </div>
                    </div>
                    <div class="row m-t">
                        <div class="col-xs-3 text-right">{{$t('time.transaction_at')}}</div>
                        <div class="col-xs-8"><span class="text-muted">{{transaction.created_at | moment('YYYY-MM-DD HH:mm:ss')}}</span></div>
                    </div>
                    <div class="row m-t">
                        <div class="col-xs-3 text-right">{{$t('dic.type')}}</div>
                        <div class="col-xs-8">
                            <span class="text-muted">
                                <span class="m-r">{{transaction.transaction_type.display_name}}</span>
                                <span v-if="transaction.related">来自交易
                                    <router-link :to="'/transaction/' + transaction.related" >{{transaction.related}}</router-link>
                                </span>
                                <span v-if="!transaction.related && transaction.transaction_type.code === 'online_pay' && transaction.payment_type">
                                    来自{{ transaction.payment_type }}
                                </span>
                                <span v-else-if="!transaction.related && transaction.transaction_type.code !== 'manual_operation' && transaction.transaction_type.code !== 'withdraw'">
                                    来自手工存提
                                </span>
                            </span>
                        </div>
                    </div>
                    <div class="row m-t" v-if="transaction.online_payer && transaction.online_payer.name">
                        <div class="col-xs-3 text-right">代付商户</div>
                        <div class="col-xs-8 text-muted">
                            {{ transaction.online_payer.name }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="m-t b-t p-t clearfix text-center">
                <div class="row m-b"  v-if="transaction.transaction_type.code ==='withdraw' || transaction.transaction_type.code === 'remit'">
                    <div class="col-xs-6">
                        <div class="row">
                            <div class="col-xs-3 text-right">{{$t('finance.audit_memo')}}</div>
                            <div class="col-xs-8">
                                <textarea v-model="transaction.memo" :disabled="transaction.status && transaction.status !== 3" class="form-control" rows="3" placeholder="编辑失败或者成功的理由，这些信息将会发送给用户">{{transaction.memo}}</textarea>
                            </div>
                        </div>
                        <div class="row m-t" v-if="transaction.status === 3 && transaction.transaction_type.code === 'remit'">
                            <div class="col-xs-3 text-right"></div>
                            <div class="col-xs-8 text-left">
                                <label class="text-danger">编辑失败或者成功的理由追加在原有备注后，这些信息将会发送给用户！</label>
                            </div>
                        </div>

                    </div>
                </div>
                <div v-if="transaction.transaction_type.code ==='remit'">
                    <div v-if="transaction.status ===5 " class="t-red">
                        {{$t('system_msg.action_object_status', {
                            action: $t('finance.remit'),
                            status: $t('status.declined')
                        })}}
                    </div>
                    <div v-if="transaction.status === 3">
                        <button
                            class="btn md-btn w-sm blue m-r"
                            @click="update('remit', 1, true, $event)"
                            v-if="$root.permissions.includes('allow_remit_transaction')"
                        >{{$t('finance.check_passed')}}
                        </button>
                        <button
                            class="md-btn w-sm btn"
                            @click="update('remit', 5, true, $event)"
                            v-if="$root.permissions.includes('refuse_remit_transaction')"
                        >{{$t('finance.remit_deny')}}
                        </button>
                    </div>
                    <div v-if="transaction.status === 1" class="t-green">
                        {{$t('status.saved')}}
                        <router-link :to="{
                            path: '/bill/search',
                            query: {
                                member: transaction.member.username,
                                member_level: transaction.member.level && transaction.member.level.id,
                                agent: transaction.member.agent && transaction.member.agent.username,
                            }
                        }" class="m-l">{{$t('misc.view_all_transactions')}}</router-link>
                        <router-link :to="{
                            path: '/bill/search',
                            query: {
                                member: transaction.member.username,
                                member_level: transaction.member.level && transaction.member.level.id,
                                agent: transaction.member.agent && transaction.member.agent.username,
                                transaction_type: 'remit,online_pay'
                            }
                        }" class="m-l">{{$t('misc.view_all_deposits')}}</router-link>
                    </div>
                </div>

                <div v-if="transaction.merchant_status === 2 && transaction.transaction_type.code ==='online_pay' && $root.permissions.includes('manual_confirm_onlinepayment')">
                    <div v-if="transaction.status === 3">
                        <div v-if="loading">
                            <i class="fa fa-spin fa-spinner"></i>
                            <b>{{ $t('system.loading') }}</b>
                        </div>
                        <button class="btn w-sm md-btn blue" v-else @click="update('onlinePay', 1, true, $event)">{{$t('finance.manual_confirm')}}</button>
                        <div  v-if="!loading" class="text-muted m-t-sm">请求状态需要时间，请耐心等待</div>

                    </div>
                </div>


                <div v-if="transaction.transaction_type.code ==='withdraw'">

                    <div v-if="transaction.status === 1" class="t-green">
                        {{$t('status.saved')}}
                        <router-link :to="{
                            path: '/bill/search',
                            query: {
                                member: transaction.member.username,
                                member_level: transaction.member.level && transaction.member.level.id,
                                agent: transaction.member.agent && transaction.member.agent.username,
                                transaction_type: 'withdraw'
                            }
                        }" class="m-l">{{$t('misc.view_all_transactions')}}</router-link>
                    </div>
                    <div v-if="transaction.status === 5 " class="t-red">
                        {{$t('system_msg.action_object_status', {
                            action: $t('finance.withdraw'),
                            status: $t('status.declined')
                        })}}
                    </div>
                    <div v-if="transaction.status === 3">
                        <button
                            class="btn md-btn w-sm blue m-r-sm"
                            @click="withdrawPayeeModalShow = true"
                            v-if="$root.permissions.includes('allow_withdraw_transaction') && transaction.available_payers && transaction.available_payers.length"
                        >{{$t('finance.withdraw_payee')}}
                        </button>
                        <button
                            class="btn md-btn w-sm blue m-r-sm"
                            @click="update('withdraw', 1, true, $event)"
                            v-if="$root.permissions.includes('allow_withdraw_transaction')"
                        >{{$t('finance.check_passed')}}
                        </button>
                        <template v-if="$root.permissions.includes('refuse_withdraw_transaction')">
                            <button class="btn md-btn m-r-sm" @click="update('withdraw', 4, true, $event)">{{$t('finance.withdraw_cancel')}}</button>
                            <button class="btn md-btn" @click="update('withdraw', 5, true, $event)">{{$t('finance.withdraw_deny')}}</button>
                        </template>
                    </div>
                    <div v-if="transaction.status === 6">
                        <button
                            class="btn md-btn w-sm blue m-r-sm"
                            @click="withdrawCheckOrder(transaction.id)"
                            v-if="$root.permissions.includes('allow_withdraw_transaction')"
                        >
                            <span v-if="!loading">{{$t('finance.manual_confirm')}}</span>
                            <i class="fa fa-spin fa-spinner" v-else></i>
                        </button>
                        <button
                            class="btn md-btn w-sm blue"
                            @click="update('withdraw', 1, true, $event)"
                            v-if="$root.permissions.includes('allow_withdraw_transaction')"
                        >{{$t('finance.check_passed')}}
                        </button>
                    </div>
                </div>
                <div v-if="transaction.transaction_type.code ==='manual_operation'" class="t-green">
                    已存入
                </div>

                <div v-if="transaction.transaction_type.code ==='discount'" class="t-green">
                    已存入
                </div>
            </div>
        </div>
    </div>
    <modal-withdraw-payee
        :show="withdrawPayeeModalShow"
        :transaction="transaction"
        @withdraw-payee-showmodal="changeWithdrawPayeeModal"
        @withdraw-payee-status="withdrawPayeeStatus"
    />
</div>
</template>
<script>
import { getTransaction, updateTransaction, withdrawCheckOrder } from '../../service'
import TransactionStatus from '../../components/TransactionStatus'
import ModalWithdrawPayee from '../../components/ModalWithdrawPayee'
import $ from '../../utils/util'

export default {
    data () {
        return {
            transactionPage: [
                'remit',
                'online_pay',
                'withdraw'
            ],
            transaction: {
                member: {
                    level: {},
                    bank: {
                        bank: {}
                    },
                    agent: {
                        username: ''
                    }
                },
                memo: '',
                transaction_type: {},
                online_payee: {},
                remit_info: {
                    online_payee: {}
                }
            },
            withdrawPayeeModalShow: false,
            loading: false
        }
    },
    watch: {
        '$route.params.id' (newObj) {
            this.getTransaction(newObj)
        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            let id = to.params.id
            id && vm.getTransaction(id)
        })
    },
    methods: {
        update (type, status, confirm, event) {
            // type remit, onlinepay, withdraw
            let message = ''
            if (confirm && type === 'withdraw' && status === 1) {
                if (!window.confirm(this.$t('misc.withdraw_audit_alert_msg'))) {
                    return
                }
            } else if (confirm) {
                if (!window.confirm(this.$t('system_msg.confirm_action_object', {
                    action: event.target.innerText
                }) + ((this.transaction.online_payee && !this.transaction.online_payee.check_order)
                    ? ` ${this.$t('misc.online_pay_dongfangkf_alert_msg')}`
                    : ''
                ))) {
                    return
                }
            }

            let routerLink = ''
            if (type === 'remit') {
                type = 'bill'
                routerLink = '/bill/remit'
                if (status === 1) {
                    message = this.$t('finance.check_passed')
                } else if (status === 5) {
                    message = this.$t('system_msg.action_object_status', {
                        action: this.$t('finance.remit_deny'),
                        status: this.$t('status.success')
                    })
                }
            } else if (type === 'onlinePay') {
                this.loading = true
                message = this.$t('system_msg.action_object_status', {
                    action: this.$t('finance.manual_confirm'),
                    status: this.$t('status.success')
                })
            } else if (type === 'withdraw') {
                routerLink = '/bill/withdraw?status=3'
                this.member = this.transaction.member.id
                this.transactiontype = parseInt(this.transaction.transaction_type.id)
                if (status === 1) {
                    message = this.$t('finance.check_passed')
                } else if (status === 4) {
                    message = this.$t('system_msg.action_object_status', {
                        action: this.$t('finance.withdraw_cancel'),
                        status: this.$t('status.success')
                    })
                } else if (status === 5) {
                    message = this.$t('system_msg.action_object_status', {
                        action: this.$t('finance.withdraw_deny'),
                        status: this.$t('status.success')
                    })
                }
            }

            if (this.transaction.id) {
                updateTransaction(type, {
                    id: this.transaction.id,
                    data: {
                        status,
                        memo: this.transaction.memo,
                        member: this.member,
                        transaction_type: this.transactiontype
                    }
                }).then(data => {
                    message && $.notify({ message })
                    this.transaction.status = data.status
                    routerLink && this.$router.push(routerLink)
                }).finally(() => {
                    this.loading = false
                })
            }
        },
        withdrawCheckOrder (id) {
            if (id) {
                this.loading = true
                withdrawCheckOrder(id, {
                    action: this.$t('finance.manual_confirm')
                }).then(data => {
                    this.transaction = data
                }).finally(() => {
                    this.loading = false
                })
            }
        },
        getTransaction (id) {
            getTransaction({
                id,
                params: {
                    opt_expand: 'bank,updated_by'
                }
            }).then(data => {
                this.transaction = data
            })
        },
        changeWithdrawPayeeModal (val) {
            this.withdrawPayeeModalShow = val
        },
        withdrawPayeeStatus (val) {
            if (val) {
                this.withdrawPayeeModalShow = false
                this.getTransaction(this.transaction.id)
            }
        }
    },
    components: {
        TransactionStatus,
        ModalWithdrawPayee
    }
}
</script>

<style scoped>
    .info-box {
        line-height: 1.8;
    }
</style>
