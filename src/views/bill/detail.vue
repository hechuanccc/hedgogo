<template>
    <div>
      <div class="m-b">
          <ol class="breadcrumb">
              <li v-if="transaction.transaction_type.code ==='remit'" class="active"><router-link :to="'/bill/remit?report_flag=True'">{{transaction.transaction_type.display_name}}</router-link></li>
              <li v-if="transaction.transaction_type.code ==='online_pay'" class="active"><router-link :to="'/bill/online?report_flag=True'">{{transaction.transaction_type.display_name}}</router-link></li>
              <li v-if="transaction.transaction_type.code ==='withdraw'" class="active"><router-link :to="'/bill/withdraw?report_flag=True'">{{transaction.transaction_type.display_name}}</router-link></li>
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
                        <div class="col-xs-3 text-right v-m"><strong>{{$t('common.amount')}}</strong></div>
                        <div class="col-xs-8">
                            <span class="text-success text-md v-m m-r">{{transaction.amount | currency('￥')}}</span>
                            <transaction-status :transaction="transaction"></transaction-status>
                        </div>
                    </div>

                    <div class="row m-t">
                        <div class="col-xs-3 text-right">{{$t('bill.order_id')}}</div>
                        <div class="col-xs-8" v-if="transaction.transaction_type.code ==='online_pay'"><span class="text-muted">{{transaction.transaction_id}}</span></div>
                        <div class="col-xs-8" v-else><span class="text-muted">{{transaction.id}}</span></div>
                    </div>

                    <div class="row m-t">
                        <div class="col-xs-3 text-right">{{$t('bill.order_detail')}}</div>
                        <div class="col-xs-8 info-box">
                            <div v-if="transaction.transaction_type.code === 'remit'" class="grey-100 p-a clearfix">
                                <div class="row">
                                    <div class="col-xs-3 text-right text-muted">{{$t('bill.remit_payee')}}</div>
                                    <div class="col-xs-9 ">{{transaction.remit_info.remit_payee.payee_name || '-'}}</div>
                                </div>
                                <div class="row">
                                    <div class="col-xs-3 text-right text-muted">{{$t('bill.depositor')}}</div>
                                    <div class="col-xs-9 ">{{transaction.remit_info.depositor || '-'}}</div>
                                </div>
                                <div class="row">
                                    <div class="col-xs-3 text-right text-muted">{{$t('common.amount')}}</div>
                                    <div class="col-xs-9 ">￥{{transaction.amount || '-'}}</div>
                                </div>
                                <div class="row">
                                    <div class="col-xs-3 text-right text-muted">{{$t('bill.deposited_at')}}</div>
                                    <div class="col-xs-9 ">{{transaction.remit_info.deposited_at | moment("YYYY-MM-DD HH:mm:ss")}} &nbsp;</div>
                                </div>
                            </div>

                            <div class="grey-100 p-a clearfix" v-if="transaction.transaction_type.code === 'online_pay' && transaction.online_payee">
                                <div class="row">
                                    <div class="col-xs-3 text-right text-muted">{{$t('common.merchant')}}</div>
                                    <div class="col-xs-9 ">
                                        <router-link :to="'/online_payee/' + transaction.online_payee.id">{{transaction.online_payee.name}}</router-link>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-xs-3 text-right text-muted">{{$t('bill.merchant_status')}}</div>
                                    <div class="col-xs-9 ">
                                        <span class="label success" v-if="transaction.merchant_status===1">{{$t('status.confirmed')}}</span>
                                        <span class="label" v-if="transaction.merchant_status===2">{{$t('status.ongoing')}}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="grey-100 p-a clearfix" v-if="transaction.transaction_type.code === 'withdraw'">
                                <div class="row">
                                    <div class="col-xs-3 text-right text-muted">{{$t('member.realname')}}</div>
                                    <div class="col-xs-9 ">{{transaction.member.real_name}} &nbsp;</div>
                                </div>
                                <div class="row">
                                    <div class="col-xs-3 text-right text-muted">{{$t('bank.name')}}</div>
                                    <div class="col-xs-9 ">{{transaction.member.bank.bank.name}} &nbsp;</div>
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
                                <div class="row">
                                    <div class="col-xs-3 text-right text-muted">手续费</div>
                                    <div class="col-xs-9 "></div>
                                </div>
                                <div class="row">
                                    <div class="col-xs-3 text-right text-muted">优惠扣除</div>
                                    <div class="col-xs-9 "></div>
                                </div>

                            </div>
                            <div class="grey-100 p-a clearfix" v-if="transaction.transaction_type.code === 'manual_operation'">
                                <div class="col-xs-3 text-right text-muted">{{$t('member.realname')}}</div>
                                <div class="col-xs-9 ">{{transaction.member.real_name}} &nbsp;</div>


                                <div class="col-xs-3 text-right text-muted">{{$t('bill.audit_amount')}}</div>
                                <div class="col-xs-9" v-if="transaction.audit_amount">{{transaction.audit_amount | currency('￥')}} &nbsp;</div>
                                <div class="col-xs-9" v-else>
                                    <span>免稽核</span>
                                </div>

                                <div class="col-xs-3 text-right text-muted">{{$t('bill.operator')}}</div>
                                <div class="col-xs-9 ">{{transaction.updated_by.username || '无'}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="row m-t" v-if="transaction.transaction_type.code != 'remit' && transaction.transaction_type.code != 'online_pay' && transaction.transaction_type.code != 'withdraw'">
                      <div class="col-xs-3 text-right">{{$t('common.memo')}}</div>
                      <div class="col-xs-8" >
                        <span class="text-muted">{{transaction.memo || '无备注信息'}}</span>
                      </div>
                    </div>
                </div>
                <div class="col-xs-6">
                    <div class="row m-t">
                        <div class="col-xs-3 text-right">{{$t('common.member')}}</div>
                        <div class="col-xs-8">
                            <router-link :to="'/member/' + transaction.member.id">{{transaction.member.username}}</router-link>
                            <router-link :to="'/bill/search?member=' + transaction.member.username" class="m-l text-blue">查看会员所有订单</router-link>
                        </div>
                    </div>
                    <div class="row m-t">
                        <div class="col-xs-3 text-right">{{$t('member.level')}}</div>
                        <div class="col-xs-8">
                            <router-link :to="'/level/' + transaction.member.level.id">{{transaction.member.level.name}}</router-link>
                        </div>
                    </div>
                    <div class="row m-t">
                        <div class="col-xs-3 text-right">{{$t('bill.created_at')}}</div>
                        <div class="col-xs-8"><span class="text-muted">{{transaction.created_at | moment("YYYY-MM-DD HH:mm:ss")}}</span></div>
                    </div>
                    <div class="row m-t">
                        <div class="col-xs-3 text-right">{{$t('common.type')}}</div>
                        <div class="col-xs-8">
                            <span class="text-muted">
                                <span class="m-r">{{transaction.transaction_type.display_name}}</span>
                                <span v-if="transaction.related">来自交易
                                    <router-link :to="'/transaction/' + transaction.related" >{{transaction.related}}</router-link>
                                </span>
                                <span v-if="!transaction.related && transaction.transaction_type.code !== 'manual_operation'">
                                    来自手工存提
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="m-t b-t p-t clearfix text-center">
                <div class="row m-b"  v-if="transaction.transaction_type.code ==='withdraw' || transaction.transaction_type.code === 'remit'">
                    <div class="col-xs-6">
                        <div class="row">
                            <div class="col-xs-3 text-right">审核备注</div>
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
                <div class="text-danger p-t p-b" v-if="errorMsg">{{errorMsg}}</div>
                <div v-if="transaction.transaction_type.code ==='remit'">
                    <div v-if="transaction.status ===5 " class="t-red">
                        {{$t('bill.deposit_declined')}}
                    </div>
                    <div v-if="transaction.status === 3 & $root.permissions.includes('approve_remit_online_withdraw_update_auditing')">
                        <button class="md-btn w-sm grey m-r" @click="update('remit', 1, true, $event)">{{$t('bill.audit')}}</button>
                        <button v-if="$root.permissions.includes('decline_payment')" class="md-btn w-sm grey-300" @click="update('remit', 5, true, $event)">{{$t('bill.audit_deny')}}</button>
                    </div>
                    <div v-if="transaction.status === 1" class="t-green">
                        {{$t('bill.saved')}}
                        <router-link :to="'/bill/search?member=' + transaction.member.username " class="m-l">{{$t('bill.view_all_transactions')}}</router-link>
                        <router-link :to="'/bill/search?transaction_type=remit,online_pay&member=' + transaction.member.username " class="m-l">{{$t('bill.view_all_discounts')}}</router-link>
                    </div>
                </div>

                <div v-if="transaction.merchant_status === 2 && transaction.transaction_type.code ==='online_pay' && $root.permissions.includes('approve_remit_online_withdraw_update_auditing')">
                    <div v-if="transaction.status === 3">
                        <div  v-if="loading"><i class='fa fa-spinner'></i>   <b class="">正在加载中...</b></div>
                        <button class="md-btn red" v-else @click="update('onlinepay', 1, true, $event)">{{$t('bill.manual_confirm')}}</button>
                        <div  v-if="!loading && !errorMsg" class="text-muted m-t-sm">请求状态需要时间，请耐心等待</div>

                    </div>
                </div>


                <div v-if="transaction.transaction_type.code ==='withdraw'">

                    <div v-if="transaction.status === 1" class="t-green">
                        {{$t('bill.saved')}}
                        <router-link :to="'/bill/search?transaction_type=withdraw&member=' + transaction.member.username " class="m-l">{{$t('bill.view_all_transactions')}}</router-link>
                    </div>
                    <div v-if="transaction.status === 5 " class="t-red">
                        {{$t('bill.withdraw_declined')}}
                    </div>
                    <div v-if="transaction.status === 3 && $root.permissions.includes('approve_remit_online_withdraw_update_auditing')">
                        <button class="md-btn w-sm grey m-r" @click="update('withdraw', 1, true, $event)">{{$t('bill.audit')}}</button>
                        <template v-if="$root.permissions.includes('decline_payment')">
                            <button class="md-btn grey-300 m-r" @click="update('withdraw', 4, true, $event)">{{$t('bill.cancel')}}</button>
                            <button class="md-btn grey-300" @click="update('withdraw', 5, true, $event)">{{$t('bill.declined')}}</button>
                        </template>
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
    </div>
</template>
<script>
    import api from '../../api'
    import transactionStatus from '../../components/transaction_status'
    import { handleError } from '../../utils/handleError'
    export default {
        data () {
            return {
                errorMsg: '',
                field_locales: {
                    'order_status': '',
                    'balance': '',
                    'audit': ''
                },
                transaction: {
                    member: {
                        level: {},
                        bank: {
                            bank: {}
                        }
                    },
                    memo: '',
                    transaction_type: {},
                    online_payee: {},
                    remit_info: {
                        online_payee: {}
                    }
                },
                loading: false
            }
        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                let id = to.params.id
                if (id) {
                    vm.getTransaction(id)
                }
            })
        },
        methods: {
            update (type, status, confirm, event) {
                // type remit, onlinepay, withdraw
                if (confirm) {
                    if (!window.confirm(this.$t('bill.confirm_declined', {
                        action: event.target.innerText
                    }))) {
                        return
                    }
                }

                let url
                let routerLink
                if (type === 'remit') {
                    url = api.bill
                    routerLink = '/bill/remit'
                } else if (type === 'onlinepay') {
                    this.loading = true
                    url = api.transactiononlinepay
                } else {
                    url = api.transactionwithdraw
                    routerLink = '/bill/withdraw?status=3'
                }

                if (this.transaction.id) {
                    this.$http.put(url + this.transaction.id + '/', { status: status, memo: this.transaction.memo }).then(response => {
                        this.transaction.status = response.data.status
                        this.loading = false
                        if (routerLink) {
                            this.$router.go(routerLink)
                        }
                    }, response => {
                        this.loading = false
                        this.errorMsg = ''
                        for (let field in this.field_locales) {
                            this.errorMsg += handleError(response, field, this.field_locales)
                        }
                    })
                }
            },
            getTransaction (id) {
                this.$http.get(api.bill + id + '/?opt_expand=bank,updated_by').then((response) => {
                    this.transaction = response.data
                })
            }
        },
        components: {
            transactionStatus
        }
    }
</script>

<style scoped>
    .info-box {
        line-height: 1.8;
    }
</style>
