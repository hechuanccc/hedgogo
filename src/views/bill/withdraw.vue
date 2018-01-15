<template>
    <div>
        <form class="form" v-on:submit.prevent="submit">
            <div class="box">
                <div class="box-body clearfix form-inline form-input-sm">
                    <div class="row">
                        <div class="col-xs-12">
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
                            <button
                                class="md-btn w-xs blue pull-right"
                                type="submit"
                            >{{ $t('common.search') }}
                            </button>
                        </div>
                    </div>
                    <div class="row m-t-sm">
                        <div class="col-xs-12">
                            <select class="form-control w-sm c-select pull-left m-r-xs" v-model="selected">
                                <option value="0">{{ $t('common.applied_at') }}</option>
                                <option value="1">{{ $t('common.status_updated_at') }}</option>
                            </select>
                            <date-picker
                                width="223"
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
                                width="223"
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
                            <button class="md-btn w-xs btn pull-right" type="button" @click="clearall">{{ $t('action.clear_all') }}</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
        <div class="row">
            <div class="col-xs-12">
            <div class="pull-right total-amount">
                <span>{{ `${$t('common.total')} ${ $t('nav.withdraw_request')} :` }}</span>
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
                        <th>{{ $t('common.applied_at') }}</th>
                        <th>{{ $t('common.balance_before') }}</th>
                        <th>{{ $t('common.balance_after') }}</th>
                        <th>{{ $t('common.amount') }}</th>
                        <th>{{ $t('common.status_updated_at') }}</th>
                        <th>{{ $t('bank.bank_title') }}</th>
                        <th class="text-center">{{ $t('common.status') }}</th>
                        <th class="text-center">{{$t('bill.order_detail')}}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="t in queryset" :key="t.id">
                        <td><router-link :to="'/member/' + t.member.id">{{ t.member.username }}</router-link></td>
                        <td><router-link :to="'/level/' + t.member.level.id">{{ t.member.level.name }}</router-link></td>
                        <td>{{ t.created_at  | moment("YYYY-MM-DD HH:mm:ss") }}</td>
                        <td>
                            <span v-if="t.balance_before">{{ t.balance_before | currency('￥') }}</span>
                            <span v-else>-</span>
                        </td>
                        <td>
                            <span v-if="t.balance_after">{{ t.balance_after | currency('￥') }}</span>
                            <span v-else>-</span>
                        </td>
                        <td>{{ t.amount | currency('￥') }}</td>
                        <td>{{ t.updated_at | moment("YYYY-MM-DD HH:mm:ss") }}</td>
                        <td>
                            <span>{{ `${$t('bank.name')}: ${t.member.bank.name}` }}</span><br/>
                            <span>{{ `${$t('bank.account')}: ${t.member.bank.account}` }} </span><br/>
                            <span>{{ `${$t('bank.address')}: ${t.member.bank.city}, ${t.member.bank.province}` }}</span>
                        </td>
                        <td class="text-center">
                            <span class="label success" v-if="t.status === 1">{{ $t('status.success') }}</span>
                            <span class="label danger" v-else-if="t.status === 2">{{ $t('status.failed') }}</span>
                            <span class="label warn" v-else-if="t.status === 3">{{ $t('status.ongoing') }}</span>
                            <span class="label" v-else-if="t.status === 4">{{ $t('status.cancelled') }}</span>
                            <span class="label danger" v-else-if="t.status === 5">{{ $t('status.declined') }}</span>
                        </td>
                        <td class="text-center">
                            <router-link :to="'/transaction/' + t.id">{{$t('action.view')}}</router-link>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="row m-b-lg">
            <pulling
                :extra="'transaction_type=withdraw&report_flag=true'"
                :api="billApi"
                :queryset="queryset"
                :query="query"
                :total_amount="total_amount"
                @query-data="queryData"
                @query-param="queryParam"
                @amount="totalAmount"
                ref="pulling"
            />
        </div>
    </div>
</template>
<script>
    import api from '../../api'
    import pulling from '../../components/pulling'
    import transactionStatus from '../../components/transaction_status'
    import DatePicker from 'vue2-datepicker'
    import date from '../../utils/date'
    import Vue from 'vue'

    const format = 'YYYY-MM-DD'
    export default {
        data () {
            return {
                queryset: [],
                billApi: api.bill,
                query: {},
                status: '',
                created_at: ['', ''],
                updated_at: ['', ''],
                selected: '0',
                total_amount: '',
                today: Vue.moment().format(format),
                shortcuts: ['today', 'yesterday', 'this_week', 'this_month', 'last_month'].map(element => Object({
                    text: this.$t(`common.${element}`),
                    start: date[element][0],
                    end: date[element][1]
                }))
            }
        },
        watch: {
            '$root.withdraw_count' (newObj, old) {
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
