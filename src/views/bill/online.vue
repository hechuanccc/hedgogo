<template>
    <div>
        <form class="form" v-on:submit.prevent="submit">
            <div class="box">
                <div class="box-body clearfix form-inline form-input-sm">
                    <div class="row">
                        <div class="col-xs-12">
                            <select class="pull-left m-r-xs form-control w-sm c-select" v-model="status">
                                <option value="">{{$t('common.status')}}</option>
                                <option value="1">{{$t('status.success')}}</option>
                                <option value="2">{{$t('status.failed')}}</option>
                                <option value="3">{{$t('status.ongoing')}}</option>
                                <option value="4">{{$t('status.cancelled')}}</option>
                                <option value="5">{{$t('status.declined')}}</option>
                            </select>
                            <level
                                class="pull-left m-r-xs inline"
                                :level="query.member_level"
                                @level-select="levelSelect"
                            />
                            <input
                                type="text"
                                v-model="query.member_q"
                                class="pull-left m-r-xs form-control w-sm"
                                :placeholder="$t('common.member')"
                            />
                            <input
                                type="text"
                                v-model="query.online_payee"
                                class="pull-left m-r-xs form-control w-sm"
                                :placeholder="$t('common.merchant')"
                            />
                            <input
                                type="text"
                                class="pull-left m-r-xs form-control w-sm"
                                v-model="query.real_name_q"
                                :placeholder="$t('common.real_name')"
                            />
                            <input
                                type="text"
                                v-model="query.amount_gte"
                                class="pull-left m-r-xs form-control w-sm"
                                :placeholder="$t('common.min_amount')"
                            />
                            <span>
                                ~
                            </span>
                            <input
                                type="text"
                                v-model="query.amount_lte"
                                class="form-control w-sm"
                                :placeholder="$t('common.max_amount')"
                            />
                            <button class="md-btn w-xs blue pull-right" type="submit">
                                {{$t('common.search')}}
                            </button>
                        </div>
                    </div>
                    <div class="row m-t-sm">
                        <div class="col-xs-12">
                            <select
                                class="form-control w-sm c-select pull-left no-b-r"
                                v-model="selected"
                            >
                                <option value="0">{{$t('common.applied_at')}}</option>
                                <option value="1">{{$t('common.status_updated_at')}}</option>
                            </select>
                            <date-picker
                                width='228'
                                :not-after="today"
                                :shortcuts="shortcuts"
                                class="pull-left m-r-xs"
                                :inputClass="(query.created_at_0 || query.created_at_1) ? 'input b-blue' : 'input'"
                                type="date"
                                v-model="created_at"
                                v-if="selected === '0'"
                                format="yyyy-MM-dd"
                                range
                                ref="created"
                            />
                            <date-picker
                                width='228'
                                :not-after="today"
                                :shortcuts="shortcuts"
                                class="pull-left m-r-xs"
                                type="date"
                                v-model="updated_at"
                                v-else
                                format="yyyy-MM-dd"
                                range
                                ref="updated"
                            />
                            <input
                                style="width: 224px;"
                                type="number"
                                v-model.trim="query.transaction_id"
                                class="form-control w-sm"
                                :placeholder="$t('bill.order_id')"
                            />
                            <button
                                class="md-btn w-xs btn pull-right"
                                type="button"
                                @click="clearall"
                            >{{$t('action.clear_all')}}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
        <div class="row">
            <div class="col-xs-12">
            <div
                class="pull-right"
                v-if="$root.permissions.includes('export_onlinepay_report')"
            >
                <a :href="href" :getReport="getReport" v-if="queryset.length">
                    <span>{{ $t('action.download') }}<i class="material-icons">&#xe2c4;</i></span>
                </a>
                <span disabled v-else>{{ $t('action.download') }}<i class="material-icons">&#xe2c4;</i></span>
            </div>
            <div class="pull-right total-amount m-r-sm">
                <span>{{$t('common.total')}} {{$t('nav.online_pay_orders')}}: </span>
                <span v-if="queryset.length">{{total_amount | currency('￥')}}</span>
                <span v-else>{{0 | currency('￥')}}</span>
            </div>
            </div>
        </div>
        <div class="box">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>{{$t('common.member')}}</th>
                        <th>{{$t('member.level')}}</th>
                        <th>{{$t('common.applied_at')}}</th>
                        <th>{{$t('common.merchant')}}</th>
                        <th>{{$t('common.balance_before')}}</th>
                        <th>{{$t('common.balance_after')}}</th>
                        <th>{{$t('common.amount')}}</th>
                        <th>{{$t('common.status_updated_at')}}</th>
                        <th>{{$t('common.status')}}</th>
                        <th class="text-center">{{ $t('bill.order_detail') }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="t in queryset" :key="t.id">
                        <td>
                            <router-link :to="'/member/' + t.member.id">{{t.member.username}}</router-link>
                        </td>
                        <td>
                            <router-link :to="'/level/' + t.member.level.id">{{t.member.level.name}}</router-link>
                        </td>
                        <td>{{t.created_at | moment("YYYY-MM-DD HH:mm:ss")}}</td>
                        <td>
                            <router-link :to="'/online_payee/' + t.online_payee.id">{{t.online_payee.name}}</router-link>
                        </td>
                        <td>
                            <span v-if="t.balance_before">{{t.balance_before | currency('￥')}}</span>
                            <span v-else>-</span>
                        </td>
                        <td>
                            <span v-if="t.balance_after">{{t.balance_after | currency('￥')}}</span>
                            <span v-else>-</span>
                        </td>
                        <td>
                            {{t.amount | currency('￥')}}
                        </td>
                        <td>{{t.updated_at | moment("YYYY-MM-DD HH:mm:ss")}}</td>
                        <td>
                            <transaction-status :transaction="t"></transaction-status>
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
                :api="billApi"
                :extra="'transaction_type=online_pay&report_flag=true'"
                :queryset="queryset"
                :query="query"
                :total_amount="total_amount"
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
    import level from '../../components/level'

    export default {
        data () {
            return {
                queryset: [],
                billApi: api.bill,
                created_at: ['', ''],
                updated_at: ['', ''],
                query: {},
                selected: '0',
                status: '',
                total_amount: '',
                href: '',
                export_query: [],
                today: date.today[0],
                shortcuts: ['today', 'yesterday', 'this_week', 'this_month', 'last_month'].map(element => Object({
                    text: this.$t(`common.${element}`),
                    start: date[element][0],
                    end: date[element][1]
                }))
            }
        },
        watch: {
            '$route': {
                handler () {
                    this.setQueryAll()
                    this.queryset = []
                    this.$refs.pulling.rebase()
                },
                deep: true
            },
            status (newObj) {
                this.query.status = newObj
            },
            created_at (newObj) {
                [this.query.created_at_0, this.query.created_at_1] = [...newObj]
                if (this.query.created_at_0 !== this.$route.query.created_at_0 || this.query.created_at_1 !== this.$route.query.created_at_1) {
                    this.submit()
                }
            },
            updated_at (newObj) {
                [this.query.updated_at_0, this.query.updated_at_1] = [...newObj]
                if (this.query.updated_at_0 !== this.$route.query.updated_at_0 || this.query.updated_at_1 !== this.$route.query.updated_at_1) {
                    this.submit()
                }
            },
            selected (newObj, old) {
                this.query = Object.assign(this.query, {
                    created_at_0: undefined,
                    created_at_1: undefined,
                    updated_at_0: undefined,
                    updated_at_1: undefined
                })
                this.$nextTick(() => {
                    if (newObj !== old) {
                        if (newObj === '1') {
                            this.$refs.updated.togglePopup()
                        } else {
                            this.$refs.created.togglePopup()
                        }
                    }
                })
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
                this.href = `${api.report_onlinepay}?token=${VueCookie.get('access_token')}&report=online_pay&${this.export_query}`
                return this.queryset.length
            }
        },
        methods: {
            setQueryAll () {
                if (this.$route.query.created_at_0 || this.$route.query.created_at_1) {
                    this.selected = '0'
                    this.created_at = [this.$route.query.created_at_0, this.$route.query.created_at_1]
                } else {
                    this.created_at = [undefined, undefined]
                }
                if (this.$route.query.updated_at_0 || this.$route.query.updated_at_1) {
                    this.selected = '1'
                    this.updated_at = [this.$route.query.updated_at_0, this.$route.query.updated_at_1]
                } else {
                    this.updated_at = [undefined, undefined]
                }
                this.status = this.$route.query.status || ''
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
                this.selected = '0'
                this.$nextTick(() => {
                    this.submit()
                })
            }
        },
        components: {
            DatePicker,
            pulling,
            transactionStatus,
            level
        }
    }
</script>
