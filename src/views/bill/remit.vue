<template>
    <div>
      <form class="form" v-on:submit.prevent="submit">
        <div class="box">
            <div class="box-body clearfix form-inline form-input-sm">
                <div class="row">
                    <div class="col-xs-12">
                        <select class="form-control w-sm c-select" v-model="remit_type">
                            <option value="">{{ $t('setting.remit_type') }}</option>
                            <option value="1">{{ $t('setting.payment_normal') }}</option>
                            <option value="2">{{ $t('setting.payment_alipay') }}</option>
                            <option value="3">{{ $t('setting.payment_wechat') }}</option>
                        </select>
                        <select class="form-control w-sm c-select" v-model="status">
                            <option value="">{{ $t('common.status') }}</option>
                            <option value="1">{{ $t('status.success') }}</option>
                            <option value="2">{{ $t('status.failed') }}</option>
                            <option value="3">{{ $t('status.ongoing') }}</option>
                            <option value="4">{{ $t('status.cancelled') }}</option>
                            <option value="5">{{ $t('status.declined') }}</option>
                        </select>
                        <level
                            class="inline"
                            :level="query.member_level"
                            @level-select="levelSelect"
                        />
                        <input
                            type="text"
                            v-model="query.member_q"
                            class="form-control w-sm"
                            :placeholder="$t('common.member')"
                        />
                        <input
                            type="text"
                            v-model="query.updated_by"
                            class="form-control inline w-sm"
                            :placeholder="$t('common.operator')"
                        />
                        <input
                            type="text"
                            class="form-control inline w-sm"
                            v-model="query.real_name_q"
                            :placeholder="$t('common.real_name')"
                        />
                        <input
                            type="text"
                            v-model="query.amount_gte"
                            class="form-control inline w-sm"
                            :placeholder="$t('common.min_amount')"
                        />
                        <span>
                            ~
                        </span>
                        <input
                            type="text"
                            v-model="query.amount_lte"
                            class="form-control inline w-sm"
                            :placeholder="$t('common.max_amount')"
                        />
                        <button class="md-btn w-xs blue pull-right" type="submit">
                            {{ $t('common.search') }}
                        </button>
                    </div>
                </div>
                <div class="row m-t-sm">
                      <div class="col-xs-12">
                        <select
                            class="pull-left form-control w-sm c-select m-r-xs"
                            v-model="selected"
                        >
                            <option value="0">{{ $t('common.applied_at') }}</option>
                            <option value="1">{{ $t('common.status_updated_at') }}</option>
                        </select>
                        <date-picker
                            width='223'
                            :not-after="today"
                            :shortcuts="shortcuts"
                            class="pull-left m-r-xs"
                            type="date"
                            v-model="created_at"
                            v-if="selected === '0'"
                            format="yyyy-MM-dd"
                            range
                        />
                        <date-picker
                            width='223'
                            :not-after="today"
                            :shortcuts="shortcuts"
                            class="pull-left m-r-xs"
                            type="date"
                            v-model="updated_at"
                            v-else
                            format="yyyy-MM-dd"
                            range
                        />
                        <input
                            style="width: 223px;"
                            type="number"
                            v-model.trim="query.transaction_id"
                            class="form-control w-sm"
                            :placeholder="$t('bill.order_id')"
                        />
                        <button
                            class="md-btn w-xs pull-right btn"
                            type="button"
                            @click="clearall"
                        >{{ $t('action.clear_all') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </form>
    <div class="row">
        <div class="col-xs-12">
            <div class="pull-right" v-if="$root.permissions.includes('export_remit_report')">
                <a :href="href" :getReport="getReport" v-if="queryset.length">
                    <span>{{  $t('action.download')  }}<i class="material-icons">&#xe2c4;</i></span>
                </a>
                <span disabled v-else>{{  $t('action.download')  }}<i class="material-icons">&#xe2c4;</i>
                </span>
            </div>
            <div class="pull-right total-amount m-r">
                <span>{{ $t('common.total') }} {{ $t('nav.remit') }}: </span>
                <span v-if="queryset.length">{{ total_amount | currency('￥') }}</span>
                <span v-else>{{ 0 | currency('￥') }}</span>
            </div>
        </div>
      </div>
      <div class="box">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>{{ $t('common.member') }}</th>
                        <th>{{ $t('member.level') }}</th>
                        <th>{{ $t('bill.created_at') }}</th>
                        <th>{{ $t('bill.depositor') }}</th>
                        <th>{{ $t('common.balance_before') }}</th>
                        <th>{{ $t('common.balance_after') }}</th>
                        <th>{{ $t('common.amount') }}</th>
                        <th>{{ $t('bank.name') }} - {{ $t('bill.remit_payee') }}</th>
                        <th>{{ $t('common.status_updated_at') }}</th>
                        <th>{{ $t('common.status') }}</th>
                        <th class="text-center">{{ $t('bill.order_detail') }}</th>
                    </tr>
                </thead>
                <tbody v-if="queryset.length >0">
                    <tr v-for="t in queryset" :key="t.id" class="v-m">
                        <td>
                            <router-link :to="'/member/' + t.member.id">{{ t.member.username }}</router-link>
                        </td>
                        <td>
                            <router-link :to="'/level/' + t.member.level.id">{{ t.member.level.name }}</router-link>
                        </td>
                        <td>
                            <span v-if="t.remit_info">{{ t.remit_info.deposited_at | moment("YYYY-MM-DD HH:mm") }}</span>
                        </td>
                        <td>
                            <span v-if="t.remit_info">{{ t.remit_info.depositor }}</span>
                        </td>
                        <td>
                            <span v-if="t.balance_before">{{ t.balance_before | currency('￥') }}</span>
                            <span v-else>-</span>
                        </td>
                        <td>
                            <span v-if="t.balance_after">{{ t.balance_after | currency('￥') }}</span>
                            <span v-else>-</span>
                        </td>
                        <td>{{ t.amount | currency('￥') }}</td>
                        <td>
                            <router-link 
                                :to="'/remit_payee/' + t.remit_info.remit_payee.id"
                                v-if="t.remit_info.remit_payee.payee_name && t.remit_info.remit_payee.bank.name"
                            >{{ t.remit_info.remit_payee.bank.name }} - {{ t.remit_info.remit_payee.payee_name }}
                            </router-link>
                            <router-link
                                :to="'/remit_payee/' + t.remit_info.remit_payee.id"
                                v-else-if="t.remit_info.remit_payee.nickname"
                            >{{ t.remit_info.remit_payee.nickname }}
                            </router-link>
                            <span v-else> - </span>
                        </td>
                        <td>{{ t.updated_at | moment("YYYY-MM-DD HH:mm") }}</td>
                        <td>
                            <span class="label success" v-if="t.status === 1">{{ $t('status.success') }}</span>
                            <span class="label danger" v-else-if="t.status === 5">{{ $t('status.declined') }}</span>
                            <span v-else-if="t.status === 3 && ($root.permissions.includes('allow_remit_transaction') || $root.permissions.includes('refuse_remit_transaction'))">
                                <button 
                                    type="button"
                                    class="btn btn-xs blue sm-btn m-b-sm"
                                    @click="update(t, 1, true, $event)"
                                    v-if="$root.permissions.includes('allow_remit_transaction')"
                                >{{ $t('bill.audit') }}
                                </button> <br>
                                <button
                                    type="button"
                                    class="btn btn-xs sm-btn"
                                    @click="update(t, 5, true, $event)"
                                    v-if="$root.permissions.includes('refuse_remit_transaction')"
                                >{{ $t('bill.audit_deny') }}
                                </button>
                            </span>
                            <span v-else>-</span>
                        </td>
                        <td class="text-center">
                            <router-link :to="'/transaction/' + t.id">{{ $t('action.view') }}</router-link>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="row m-b-lg">
            <pulling
                :queryset="queryset"
                :extra="'transaction_type=remit&report_flag=true'"
                :api="billApi"
                :query="query"
                :amount="total_amount"
                :export_query="export_query"
                @query-data="queryData"
                @query-param="queryParam"
                @amount="totalAmount"
                @export-query="exportQuery"
                ref="pulling"
            />
        </div>
    </div>
</template>
<script>
    import api from '../../api'
    import DatePicker from 'vue2-datepicker'
    import pulling from '../../components/pulling'
    import transactionStatus from '../../components/transaction_status'
    import VueCookie from 'vue-cookie'
    import date from '../../utils/date'
    import Vue from 'vue'

    const format = 'YYYY-MM-DD'
    export default {
        data () {
            return {
                queryset: [],
                billApi: api.bill,
                query: {
                    transaction_id: '',
                    remit_type: '',
                    member_q: '',
                    amount_gte: '',
                    amount_lte: '',
                    status: '',
                    member_level: '',
                    online_payee: '',
                    updated_by: '',
                    real_name_q: '',
                    created_at_0: '',
                    created_at_1: '',
                    updated_at_0: '',
                    updated_at_1: '',
                    report_flag: true
                },
                remit_type: '',
                status: '',
                created_at: ['', ''],
                updated_at: ['', ''],
                selected: '0',
                total_amount: '',
                href: '',
                export_query: [],
                today: Vue.moment().format(format),
                shortcuts: ['today', 'yesterday', 'this_week', 'this_month', 'last_month'].map(element => Object({
                    text: this.$t(`common.${element}`),
                    start: date[element][0],
                    end: date[element][1]
                }))
            }
        },
        watch: {
            '$root.remit_count' (newObj, old) {
                this.$refs.pulling.rebase()
            },
            '$route': {
                handler () {
                    this.setQueryAll()
                    this.queryset = []
                    this.$refs.pulling.rebase()
                },
                deep: true
            },
            remit_type (newObj) {
                this.query.remit_type = newObj
            },
            status (newObj) {
                this.query.status = newObj
            },
            created_at (newObj) {
                [this.query.created_at_0, this.query.created_at_1] = newObj.map(e => e && Vue.moment(e).format(format))
            },
            updated_at (newObj) {
                [this.query.updated_at_0, this.query.updated_at_1] = newObj.map(e => e && Vue.moment(e).format(format))
            },
            selected () {
                this.clearDateFilter()
            }
        },
        created () {
            this.setQueryAll()
            this.$nextTick(() => {
                this.$refs.pulling.rebase()
            })
        },
        computed: {
            getReport () {
                this.$refs.pulling.getExportQuery()
                this.href = `${api.report_deposit}?token=${VueCookie.get('access_token')}&report=remit&${this.export_query}`
                return this.queryset.length
            }
        },
        methods: {
            setQueryAll () {
                if (this.$route.query.created_at_0 || this.$route.query.created_at_1) {
                    this.selected = '0'
                    this.created_at = [this.$route.query.created_at_0, this.$route.query.created_at_1]
                } else {
                    this.selected = '1'
                    this.updated_at = [this.$route.query.updated_at_0, this.$route.query.updated_at_1]
                }
                this.status = this.$route.query.status || ''
                this.remit_type = this.$route.query.remit_type || ''
                this.query = Object.assign({}, this.$route.query)
            },
            levelSelect (val) {
                this.query.member_level = val
            },
            queryData (queryset) {
                this.queryset = queryset
            },
            queryParam (query) {
                this.query = Object.assign(this.query, query)
            },
            totalAmount (amount) {
                this.total_amount = amount
            },
            exportQuery (expor) {
                this.export_query = expor
            },
            submit () {
                this.$refs.pulling.submit()
            },
            clearall () {
                this.query = {}
                this.$nextTick(() => {
                    this.submit()
                })
            },
            clearDateFilter () {
                this.query = Object.assign(this.query, {
                    created_at_0: '',
                    created_at_1: '',
                    updated_at_0: '',
                    updated_at_1: ''
                })
                this.$nextTick(() => {
                    this.submit()
                })
            },
            update (transaction, status, confirm, event) {
                // type remit, onlinepay, withdraw
                if (confirm) {
                    if (!window.confirm(this.$t('bill.confirm_declined', {
                        action: event.target.innerText
                    }))) {
                        return
                    }
                }
                if (transaction.id) {
                    this.$http.put(api.bill + transaction.id + '/?opt_expand=bank,updated_by', {
                        status: status
                    }).then(data => {
                        transaction.status = data.status
                        transaction.balance_after = data.balance_after
                    }, error => {
                        this.errorMsg = error
                    })
                }
            }
        },
        components: {
            DatePicker,
            pulling,
            transactionStatus,
            level: require('../../components/level')
        }
    }
</script>

