<template>
    <div>
        <div class="m-b">
            <ol class="breadcrumb">
                <li class="active"><router-link to="/level">{{$t('nav.setting_level')}}</router-link></li>
                <li class="active">{{$route.meta.title}}</li>
            </ol>
        </div>
        <div class="box">
            <div class="box-header b-b">
                <div class="row">
                    <div class="col-md-3">
                        <h2 class="v-m  m-t-sm">{{$t('nav.setting_level')}}：{{name}}</h2>
                    </div>
                    <div class="col-md-6 col-md-offset-3 text-right">
                        <router-link class="md-btn md-flat m-r-sm" to="/level/add" v-if="$root.permissions.includes('add_member_level')">{{$t('action.add_level')}}</router-link>
                        <router-link class="md-btn md-flat" v-if="$root.permissions.includes('update_member_level')" :to="'/level/' + id + '/edit'">{{$t('action.edit_level')}}</router-link>
                        <a class="md-btn md-flat" v-if="$root.permissions.includes('delete_member_level')" @click="deleteLevel(id, $event)">{{$t('action.delete_level')}}</a>
                    </div>
                </div>
                <div class="alert alert-danger" v-if="errorMsg">{{errorMsg}}</div>
            </div>
            <div class="box-body">
                <div class="row m-b p-b b-b">
                    <div class="col-md-4">
                        <span class="text-muted">{{$t('level.remit_limit')}}</span>
                        <div v-if="remit_limit && (remit_limit.lower || remit_limit.upper)">
                            <div  v-if="remit_limit.lower == ''">不高于{{remit_limit.upper}}</div>
                            <div  v-if="remit_limit.upper == ''">不低于{{remit_limit.lower}}</div>
                            <div v-if="(remit_limit.upper != '') && (remit_limit.lower != '')">{{remit_limit.lower}} 至 {{remit_limit.upper}}</div>
                        </div>
                        <div v-else>
                            <span>{{$t('common.not_set')}}</span>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <span class="text-muted">{{$t('level.online_pay_limit')}}</span>
                        <div v-if="online_limit && (online_limit.lower || online_limit.upper)">
                            <div  v-if="!online_limit.lower">不高于{{online_limit.upper}}</div>
                            <div  v-if="!online_limit.upper">不低于{{online_limit.lower}}</div>
                            <div v-if="online_limit.upper && online_limit.lower">{{online_limit.lower}} 至 {{online_limit.upper}}</div>
                        </div>
                        <div v-else>
                            <span>{{$t('common.not_set')}}</span>
                        </div>
                    </div>
                    <div class="col-xs-4">
                        <span class="text-muted">{{$t('level.withdraw_limit')}}</span>
                        <div v-if="withdraw_limit && (withdraw_limit.lower || withdraw_limit.upper)">
                            <div  v-if="!withdraw_limit.lower">不高于{{withdraw_limit.upper}}</div>
                            <div  v-if="!withdraw_limit.upper">不低于{{withdraw_limit.lower}}</div>
                            <div v-if="withdraw_limit.upper && withdraw_limit.lower">{{withdraw_limit.lower}} 至 {{withdraw_limit.upper}}</div>
                        </div>
                        <div v-else>
                            <span>{{$t('common.not_set')}}</span>
                        </div>
                    </div>
                </div>
                <div class="row m-b p-b b-b" v-if="withdraw_fee">
                    <div class="col-xs-5">
                        <span class="text-muted">{{$t('level.withdraw_fee_rate')}}</span>
                        <div>{{'¥' + withdraw_fee.rate}}</div>
                    </div>
                    <div class="col-xs-5">
                        <span class="text-muted">{{$t('level.withdraw_fee_type')}}</span>
                        <div v-if="withdraw_fee.type==0">{{$t('level.free')}}</div>
                        <div v-if="withdraw_fee.type==2">{{withdraw_fee.hour}} {{$t('level.hour')}} {{withdraw_fee.times}} {{$t('level.times')}}</div>
                        <div v-if="withdraw_fee.type==1">{{$t('level.everytime')}}</div>
                    </div>
                </div>
                <div class="row m-b p-b b-b">
                    <div class="col-xs-5">
                        <span class="text-muted">{{$t('level.display_report')}}</span>
                        <div>
                            <span class="label success" v-if="report_flag">{{$t('status.active')}}</span>
                            <span class="label danger" v-else>{{$t('status.inactive')}}</span>
                        </div>
                    </div>
                </div>

                <div class="row m-b b-b p-b" >
                    <div class="col-xs-5" >
                        <span class="text-muted">{{$t('level.remit_offer')}}</span>
                        <table class="table table-sm  light-blue-50 m-t" v-if="remit_discounts.length > 0">
                            <thead>
                                <tr>
                                    <th>{{$t('level.threshold')}}</th>
                                    <th>{{$t('level.rate')}}</th>
                                    <th>{{$t('level.check_rate')}}</th>
                                    <th>{{$t('level.discount_limit')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="d in remit_discounts" >
                                    <td>{{d.threshold}}</td>
                                    <td>{{d.rate}}</td>
                                    <td>{{d.check_rate}}</td>
                                    <td><span v-if="d.limit">{{d.limit}}</span><span v-else class="text-muted">{{$t('level.no_limit')}}</span></td>
                                </tr>
                            </tbody>
                        </table>
                        <div v-else>
                            <span class="label" >{{$t('level.no_remit_offer')}}</span>
                        </div>
                    </div>

                    <div class="col-xs-5">
                        <span class="text-muted">{{$t('level.online_pay_offer')}}</span>
                        <table class="table table-sm light-blue-50 m-t" v-if="online_discounts.length > 0">
                            <thead>
                                <tr>
                                    <th>{{$t('level.threshold')}}</th>
                                    <th>{{$t('level.rate')}}</th>
                                    <th>{{$t('level.check_rate')}}</th>
                                    <th>{{$t('level.discount_limit')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="d in online_discounts" >
                                    <td>{{d.threshold}}</td>
                                    <td>{{d.rate}}</td>
                                    <td>{{d.check_rate}}</td>
                                    <td><span v-if="d.limit">{{d.limit}}</span><span v-else class="text-muted">{{$t('level.no_limit')}}</span></td>
                                </tr>
                            </tbody>
                        </table>
                        <div v-else ><span class="label">{{$t('level.no_online_payment_offer')}}</span></div>
                    </div>

                </div>

                <div class="row m-b b-b p-b">
                    <div class="col-xs-5">
                        <span class="text-muted">{{$t('level.reg_present')}}</span>
                        <table class="table table-sm  light-blue-50 m-t" v-if="reg_present">
                            <thead>
                                <tr>
                                    <th>{{$t('level.reg_present_status')}}</th>
                                    <th>{{$t('level.reg_present_allow_add')}}</th>
                                    <th>{{$t('level.reg_present_amount')}}</th>
                                    <th>{{$t('level.reg_present_check_amount')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr >
                                    <td>
                                        <span class="label rounded success" v-if="reg_present.status ==1">{{$t('status.active')}}</span>
                                        <span class="label rounded danger" v-else>{{$t('status.disabled')}}</span>
                                    </td>
                                    <td>
                                        <span class="label rounded success" v-if="reg_present.allow_add ==1">{{$t('level.allowed')}}</span>
                                        <span class="label rounded danger" v-else>{{$t('level.not_allowed')}}</span>
                                    </td>
                                    <td>{{reg_present.amount}}</td>
                                    <td>{{reg_present.check_amount}}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div v-else>
                            <span class="label">{{$t('common.not_set')}}</span>
                        </div>
                    </div>
                    <div class="col-xs-5">
                        <span class="text-muted">{{$t('level.deposit_audit_ratio')}}</span>
                        <table class="table table-sm light-blue-50 m-t" v-if="deposit_check">
                            <thead>
                                <tr>
                                    <th>{{$t('bill.remit')}}</th>
                                    <th>{{$t('bill.onlinepay')}}</th>
                                    <th>{{$t('bill.card_pay')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr >
                                    <td>
                                        <span v-if="deposit_check.remit_pay">{{deposit_check.remit_pay}}%</span>
                                        <span v-else class="label">{{$t('common.not_set')}}</span>
                                    </td>
                                    <td>
                                        <span v-if="deposit_check.online_pay">{{deposit_check.online_pay}}%</span>
                                        <span v-else class="label">{{$t('common.not_set')}}</span>
                                    </td>
                                    <td>
                                        <span v-if="deposit_check.card_pay">{{deposit_check.card_pay}}%</span>
                                        <span v-else class="label">{{$t('common.not_set')}}</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div v-else>
                            <span class="label">{{$t('common.not_set')}}</span>
                        </div>
                    </div>
                </div>

                <div class="row m-b b-b p-b">
                    <div class="col-xs-5">
                        <span class="text-muted">{{$t('level.service_rate')}}</span>
                        <div  v-if="service_rate">{{service_rate}}%</div>
                    </div>
                    <div class="col-xs-5">
                        <span class="text-muted">{{$t('common.memo')}}</span>
                        <div  v-if="memo">{{memo}}</div>
                        <div  v-else>{{$t('common.no_memo')}}</div>
                    </div>
                </div>

                <div class="row p-b b-b">
                    <div class="col-xs-5">
                        <span class="text-muted">{{$t('level.available_remit_acct_lbl')}} 共 {{remit_payee.length}} 个</span>
                        <div>
                            <router-link :to="'/remit_payee/' + p.id" v-for="p in remit_payee" class="m-r text-blue">{{p.payee_name}}</router-link>
                        </div>
                    </div>
                    <div class="col-xs-4">
                        <span class="text-muted">{{$t('level.available_onlinepay_acct_lbl')}} 共 {{online_payee.length}}  个</span>
                        <div>
                            <router-link :to="'/online_payee/' + p.id" v-for="p in online_payee" class="m-r text-blue">{{p.name}}</router-link>
                        </div>
                    </div>
                </div>

                <div class="row p-t">
                    <div class="col-xs-5">
                        <span class="text-muted">{{$t('common.member_count')}}：{{member_count}} </span>
                        <div>
                            <router-link to="/member?level=1">{{$t('level.view_all_members')}}</router-link>
                        </div>
                    </div>
                    <div class="col-xs-5">
                        <span class="text-muted">{{$t('common.agent_count')}}：{{agent_count}}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import api from '../../api'

export default {
    data () {
        return {
            remit_discounts: [{
                threshold: '',
                rate: '',
                checkRate: '',
                limit: ''
            }],
            online_discounts: [{
                threshold: '',
                rate: '',
                checkRate: '',
                limit: ''
            }],
            online_discount: [],
            id: '',
            name: '',
            remit_limit: {
                lower: '',
                upper: ''
            },
            online_limit: {
                lower: '',
                upper: ''
            },
            withdraw_limit: {
                lower: '',
                upper: ''
            },
            withdraw_fee: {
                rate: '',
                type: '',
                hour: '',
                times: ''
            },
            memo: '',
            service_rate: '',
            reg_present: {
                status: 0,
                allowAdd: 0,
                amount: '',
                checkAmount: ''
            },
            deposit_check: {
                company: '',
                online: '',
                card: ''
            },
            remit_payee: [],
            errorMsg: '',
            online_payee: [],
            report_flag: '',
            member_count: '',
            agent_count: ''
        }
    },
    // route: {
    //     data (transition) {
    //         this.id = transition.to.params.levelId
    //         this.getLevel(this.id)
    //     }
    // },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            vm.id = to.params.levelId
            vm.getLevel(vm.id)
        })
    },
    methods: {
        deleteLevel (id, event) {
            if (!window.confirm(this.$t('common.confirm', {
                action: event.target.innerText
            }))) {
                return
            }
            this.$http.delete(api.level + id).then(() => {
                this.$router.push('/level')
            }, error => {
                this.errorMsg = error
            })
        },
        getLevel (id) {
            this.$http.get(api.level + id).then(data => {
                let keys = Object.keys(data)
                for (let i = 0; i < keys.length; i++) {
                    this[keys[i]] = data[keys[i]]
                }
            })
        }
    }
}
</script>
