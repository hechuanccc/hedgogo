<template>
    <div>
        <div class="m-b-xs text-right" v-if="$root.permissions.includes('export_onlinepay_report')">
            <a
                :href="href"
                :getReport="getReport"
                v-if="queryset.length"
                class="md-btn w-sm text-white-dk blue"
            >
                <span>
                    <i class="fa fa-download"></i>
                    {{ $t('system.download_report') }}
                </span>
            </a>
            <span class="md-btn w-sm" disabled v-else>
                <i class="fa fa-download"></i>
                {{ $t('system.download_report') }}
            </span>
        </div>
        <form class="form box m-b-sm" @submit.prevent="submit">
            <div class="box-body clearfix form-input-sm">
                <div class="row m-l-xs m-r-xs">
                    <div class="pull-left m-r-xs">
                        <label
                            class="form-control-label p-b-0"
                            :class="{'text-blue': status}"
                        >{{ $t('dic.status') }}
                        </label>
                        <select
                            class="form-control w-sm c-select"
                            style="display: block;"
                            v-model="status"
                        >
                            <option value="">{{ $t('system.please_select') }}</option>
                            <option value="1">{{ $t('status.success') }}</option>
                            <option value="2">{{ $t('status.failed') }}</option>
                            <option value="3">{{ $t('status.ongoing') }}</option>
                            <option value="4">{{ $t('status.cancelled') }}</option>
                            <option value="5">{{ $t('status.declined') }}</option>
                        </select>
                    </div>
                    <div class="pull-left m-r-xs">
                        <label
                            class="form-control-label p-b-0"
                            :class="{'text-blue': query.member_level}"
                        >{{ $t('dic.member_level') }}
                        </label>
                        <selector-member-level
                            style="display: block;"
                            :level="query.member_level"
                            @level-select="levelSelect"
                        />
                    </div>
                    <div class="pull-left m-r-xs">
                        <label
                            class="form-control-label p-b-0"
                            :class="{'text-blue': query.member_q}"
                        >{{ $t('dic.member') }}
                        </label>
                        <input
                            v-model="query.member_q"
                            class="form-control w-sm"
                            :placeholder="$t('dic.member')"
                            @input="search"
                        />
                    </div>
                    <div class="pull-left m-r-xs">
                        <label
                            class="form-control-label p-b-0"
                            :class="{'text-blue': query.online_payee}"
                        >{{ $t('finance.merchant') }}
                        </label>
                        <input
                            v-model="query.online_payee"
                            class="form-control w-sm"
                            :placeholder="$t('finance.merchant')"
                            @input="search"
                        />
                    </div>
                    <div class="pull-left m-r-xs">
                        <label
                            class="form-control-label p-b-0"
                            :class="{'text-blue': query.real_name_q}"
                        >{{ $t('user.real_name') }}
                        </label>
                        <input
                            v-model="query.real_name_q"
                            class="form-control w-sm"
                            :placeholder="$t('user.real_name')"
                            @input="search"
                        />
                    </div>
                    <div class="pull-left m-r-xs">
                        <label
                            class="form-control-label p-b-0"
                            :class="{'text-blue': query.amount_lte || query.amount_gte}"
                        >{{ $t('dic.amount') }}
                        </label>
                        <div style="display: block;">
                            <input
                                type="number"
                                v-model="query.amount_gte"
                                class="form-control inline w-sm"
                                :max="query.amount_lte"
                                :placeholder="$t('misc.min_amount')"
                                @input="search"
                            />
                            <span>
                                ~
                            </span>
                            <input
                                type="number"
                                v-model="query.amount_lte"
                                class="form-control inline w-sm"
                                :min="query.amount_gte"
                                :placeholder="$t('misc.max_amount')"
                                @input="search"
                            />
                        </div>
                    </div>
                </div>
                    <div class="row m-r-xs m-l-xs m-t-sm">
                    <div class="pull-left m-r-xs">
                        <label
                            class="form-control-label p-b-0"
                            :class="{'text-blue': selected === '0'
                                ? created_at && (created_at[0] || created_at[1])
                                : updated_at && (updated_at[0] || updated_at[1])}"
                        >{{ $t('time.applied_at') }} / {{ $t('time.updated_at') }} 
                        </label>
                        <div style="display: block;">
                            <select
                                class="pull-left form-control w-sm c-select no-b-r"
                                v-model="selected"
                                @change="autoTogglePopup = true"
                            >
                                <option value="0">{{ $t('time.applied_at') }}</option>
                                <option value="1">{{ $t('time.updated_at') }}</option>
                            </select>
                            <el-date-picker
                                style="width: 248px;"
                                v-model="created_at"
                                size="mini"
                                type="daterange"
                                align="right"
                                unlink-panels
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :picker-options="{shortcuts}"
                                v-show="selected === '0'"
                                ref="created"
                            />
                            <el-date-picker
                                style="width: 248px;"
                                v-model="updated_at"
                                size="mini"
                                type="daterange"
                                align="right"
                                unlink-panels
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :picker-options="{shortcuts}"
                                v-show="selected === '1'"
                                ref="updated"
                            />
                        </div>
                    </div>
                    <div class="pull-left m-r-xs">
                        <label
                            class="form-control-label p-b-0"
                            :class="{'text-blue': query.transaction_id}"
                        >{{ $t('finance.order_id') }}
                        </label>
                        <input
                            style="width: 244px;"
                            v-model.trim="query.transaction_id"
                            class="form-control w-sm"
                            :placeholder="$t('finance.order_id')"
                            @input="search"
                        />
                    </div>
                    <div class="pull-left m-r-xs">
                        <label
                            class="form-control-label p-b-0"
                            :class="{'text-blue': period}"
                        >{{ $t('system.refresh_period') }}
                        </label>
                        <select
                            class="form-control w-sm c-select inline"
                            v-model="period"
                            style="display: block;"
                        >
                            <option value="">{{ $t('system.please_select') }}</option>
                            <option :value="10000">{{ $t('time.seconds', { number: 10 }) }}</option>
                            <option :value="30000">{{ $t('time.seconds', { number: 30 }) }}</option>
                            <option :value="60000">{{ $t('time.seconds', { number: 60 }) }}</option>
                            <option :value="120000">{{ $t('time.seconds', { number: 120 }) }}</option>
                        </select>
                    </div>
                    <button
                        class="md-btn w-xs pull-right btn m-t-md"
                        type="button"
                        @click="clearAll"
                        :disabled="isQueryEmpty"
                    >
                        <i v-if="loading" class="fa fa-spin fa-spinner"></i> 
                        <i v-else class="fa fa-trash-o"></i> 
                        {{ $t('system.reset_condition') }}
                    </button>
                </div>
            </div>
        </form>
        <div class="row m-l-xs">
            <b class="pull-right m-r text-danger">
                {{ $t('dic.total') }}&nbsp;{{ $t('finance.online_pay') }}:&nbsp;{{ (total_amount || 0) | currency('￥') }}
            </b>
        </div>
        <table class="box table table-striped">
            <thead>
                <tr>
                    <th>{{ $t('dic.member') }}</th>
                    <th class="text-center text-sm">
                        {{ $t('time.applied_at') }}&nbsp;/<br/>
                        {{ $t('time.updated_at') }}
                    </th>
                    <th>{{ $t('finance.merchant') }}</th>
                    <th class="text-right">{{ $t('user.balance_before') }}</th>
                    <th class="text-right">{{ $t('user.balance_after') }}</th>
                    <th class="text-right">{{ $t('dic.amount') }}</th>
                    <th class="text-center">{{ $t('dic.status') }}</th>
                    <th class="text-center">{{ $t('finance.order_detail') }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="t in queryset" :key="t.id">
                    <td>
                        <router-link :to="'/member/' + t.member.id">{{ t.member.username }}</router-link>
                        <br/>
                        <router-link :to="'/level/' + t.member.level.id" class="text-xs">{{ t.member.level.name }}</router-link>
                    </td>
                    <td class="text-center">
                        <span class="text-xs">{{ t.created_at | moment("YYYY-MM-DD HH:mm:ss") }}</span><br/>
                        <span class="text-xs">{{ t.updated_at | moment("YYYY-MM-DD HH:mm:ss") }}</span>
                    </td>
                    <td>
                        <router-link :to="'/online_payee/' + t.online_payee.id">{{ t.online_payee.name }}</router-link>
                    </td>
                    <td class="text-right">
                        <span v-if="t.balance_before || t.balance_before === 0">{{ t.balance_before | currency('￥') }}</span>
                        <span v-else>-</span>
                    </td>
                    <td class="text-right">
                        <span v-if="t.balance_after || t.balance_after === 0">{{ t.balance_after | currency('￥') }}</span>
                        <span v-else>-</span>
                    </td>
                    <td class="text-right">
                        {{ t.amount | currency('￥') }}
                    </td>
                    <td class="text-center">
                        <transaction-status :transaction="t"></transaction-status>
                    </td>
                    <td class="text-center">
                        <router-link :to="'/transaction/' + t.id">{{ $t('dic.view') }}</router-link>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="row m-b-lg">
            <pulling
                :api="url.transaction.bill"
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
    import url from '../../service/url'
    import Pulling from '../../components/Pulling'
    import $ from '../../utils/util'
    import SelectorMemberLevel from '../../components/SelectorMemberLevel'
    import TransactionStatus from '../../components/TransactionStatus'
    import VueCookie from 'vue-cookie'
    import date from '../../utils/date'
    import { debounce } from 'lodash'

    export default {
        data () {
            return {
                queryset: [],
                query: {},
                created_at: ['', ''],
                updated_at: ['', ''],
                selected: '0',
                status: '',
                total_amount: '',
                href: '',
                export_query: [],
                today: date.today[0],
                shortcuts: ['today', 'yesterday', 'this_week', 'this_month', 'last_month'].map(element => Object({
                    text: this.$t(`time.${element}`),
                    onClick (p) {
                        p.$emit('pick', date[element])
                    }
                })),
                autoTogglePopup: false,
                period: 30 * 1000,
                timer: undefined,
                loading: true,
                url
            }
        },
        watch: {
            '$route': {
                handler () {
                    this.loading = true
                    this.setQueryAll()
                    this.queryset = []
                    this.$refs.pulling.rebase()
                },
                deep: true
            },
            status (newObj) {
                this.query.status = newObj
                this.submit()
            },
            created_at (newObj) {
                [this.query.created_at_0, this.query.created_at_1] = [...(newObj || [])]
                this.autoTogglePopup = false
                this.submit()
            },
            updated_at (newObj) {
                [this.query.updated_at_0, this.query.updated_at_1] = [...(newObj || [])]
                this.autoTogglePopup = false
                this.submit()
            },
            selected (newObj, old) {
                this.query = Object.assign(this.query, {
                    created_at_0: undefined,
                    created_at_1: undefined,
                    updated_at_0: undefined,
                    updated_at_1: undefined
                })
                if (this.autoTogglePopup) {
                    this.$nextTick(() => {
                        if (newObj !== old) {
                            if (newObj === '1') {
                                this.$refs.updated.focus()
                            } else {
                                this.$refs.created.focus()
                            }
                        }
                    })
                }
            },
            period (newPeriod, old) {
                clearInterval(this.timer)
                if (newPeriod) {
                    this.timer = setInterval(() => {
                        this.rebase()
                    }, newPeriod)
                }
            }
        },
        created () {
            this.setQueryAll()
            this.$nextTick(() => {
                this.rebase()
                this.timer = setInterval(() => {
                    this.rebase()
                }, this.period)
            })
        },
        computed: {
            getReport () {
                this.$refs.pulling.getExportQuery()
                this.href = `${url.report.onlinepay}?token=${VueCookie.get('access_token')}&report=online_pay&${this.export_query}`
                return this.queryset.length
            },
            isQueryEmpty () {
                return $.compareQuery(this.query, {})
            }
        },
        methods: {
            setQueryAll () {
                if (this.$route.query.created_at_0 || this.$route.query.created_at_1) {
                    this.selected = '0'
                    this.created_at = [this.$route.query.created_at_0, this.$route.query.created_at_1]
                } else if (this.$route.query.updated_at_0 || this.$route.query.updated_at_1) {
                    this.selected = '1'
                    this.updated_at = [this.$route.query.updated_at_0, this.$route.query.updated_at_1]
                } else {
                    this.selected = '0'
                    this.created_at = [undefined, undefined]
                    this.updated_at = [undefined, undefined]
                }
                this.status = this.$route.query.status || ''
                this.query = Object.assign({}, this.$route.query)
            },
            levelSelect (val) {
                this.query.member_level = val
                this.submit()
            },
            queryData (queryset) {
                this.loading = false
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
                if (!$.compareQuery(this.query, this.$route.query)) {
                    this.$refs.pulling.submit()
                }
            },
            rebase () {
                this.loading = true
                this.$refs.pulling.rebase()
            },
            search:
                debounce(function () {
                    this.submit()
                },
            700),
            clearAll () {
                this.query = {}
                this.$nextTick(() => {
                    this.submit()
                })
            }
        },
        beforeDestroy () {
            clearInterval(this.timer)
        },
        components: {
            Pulling,
            TransactionStatus,
            SelectorMemberLevel
        }
    }
</script>
