<template>
<div>
    <div class="m-b-xs text-right" v-if="$root.permissions.includes('export_remit_report')">
        <a
            :href="href"
            :getReport="getReport"
            v-if="queryset.length"
            class="md-btn w-sm text-white-dk blue"
        >
            <span>
                {{ $t('action.download_report') }}
                <i class="fa fa-download"></i>
            </span>
        </a>
        <span class="m-t-sm m-r-sm" disabled v-else>
            {{ $t('action.download_report') }}
            <i class="fa fa-download"></i>
        </span>
    </div>
    <form class="form box m-b-sm" @submit.prevent="submit">
        <div class="box-body clearfix form-input-sm">
            <div class="row m-l-xs m-r-xs">
                <div class="pull-left m-r-xs">
                    <label
                        class="form-control-label p-b-0"
                        :class="{'text-blue': remit_type}"
                    >{{ $t('setting.remit_type') }}
                    </label>
                    <select
                        class="form-control w-sm c-select"
                        style="display: block;"
                        v-model="remit_type"
                    >
                        <option value="">{{ $t('common.please_select') }}</option>
                        <option value="1">{{ $t('setting.payment_normal') }}</option>
                        <option value="2">{{ $t('setting.payment_wechat') }}</option>
                        <option value="3">{{ $t('setting.payment_alipay') }}</option>
                    </select>
                </div>
                <div class="pull-left m-r-xs">
                    <label
                        class="form-control-label p-b-0"
                        :class="{'text-blue': status}"
                    >{{ $t('common.status') }}
                    </label>
                    <select
                        class="form-control w-sm c-select"
                        style="display: block;"
                        v-model="status"
                    >
                        <option value="">{{ $t('common.please_select') }}</option>
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
                    >{{ $t('member.level') }}
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
                    >{{ $t('common.member') }}
                    </label>
                    <input
                        v-model.trim="query.member_q"
                        class="form-control w-sm"
                        :placeholder="$t('common.member')"
                        @input="search"
                    />
                </div>
                <div class="pull-left m-r-xs">
                    <label
                        class="form-control-label p-b-0"
                        :class="{'text-blue': query.updated_by}"
                    >{{ $t('common.operator') }}
                    </label>
                    <input
                        v-model.trim="query.updated_by"
                        class="form-control w-sm"
                        :placeholder="$t('common.operator')"
                        @input="search"
                    />
                </div>
                <div class="pull-left m-r-xs">
                    <label
                        class="form-control-label p-b-0"
                        :class="{'text-blue': query.real_name_q}"
                    >{{ $t('common.real_name') }}
                    </label>
                    <input
                        v-model.trim="query.real_name_q"
                        class="form-control w-sm"
                        :placeholder="$t('common.real_name')"
                        @input="search"
                    />
                </div>
                <div class="pull-left m-r-xs">
                    <label
                        class="form-control-label p-b-0"
                        :class="{'text-blue': query.amount_lte || query.amount_gte}"
                    >{{ $t('common.amount') }}
                    </label>
                    <div style="display: block;">
                        <input
                            type="number"
                            v-model="query.amount_gte"
                            class="form-control inline w-sm"
                            :max="query.amount_lte"
                            :placeholder="$t('common.min_amount')"
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
                            :placeholder="$t('common.max_amount')"
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
                            : updated_at && (updated_at[0] || updated_at[1])
                        }"
                    >{{ $t('common.applied_at') }} / {{ $t('common.status_updated_at') }} 
                    </label>
                    <div style="display: block;">
                        <select
                            class="pull-left form-control w-sm c-select no-b-r"
                            v-model="selected"
                            @change="autoTogglePopup = true"
                        >
                            <option value="0">{{ $t('common.applied_at') }}</option>
                            <option value="1">{{ $t('common.status_updated_at') }}</option>
                        </select>
                        <date-picker
                            width="248"
                            :not-after="today"
                            :shortcuts="shortcuts"
                            type="date"
                            v-model="created_at"
                            format="yyyy-MM-dd"
                            range
                            ref="created"
                            v-show="selected === '0'"
                        />
                        <date-picker
                            width="248"
                            :not-after="today"
                            :shortcuts="shortcuts"
                            type="date"
                            v-model="updated_at"
                            format="yyyy-MM-dd"
                            range
                            ref="updated"
                            v-show="selected === '1'"
                        />
                    </div>
                </div>
                <div class="pull-left m-r-xs">
                    <label
                        class="form-control-label p-b-0"
                        :class="{'text-blue': query.transaction_id}"
                    >{{ $t('bill.order_id') }}
                    </label>
                    <input
                        style="width: 244px;"
                        v-model.trim="query.transaction_id"
                        class="form-control w-sm"
                        :placeholder="$t('bill.order_id')"
                        @input="search"
                    />
                </div>
                <button
                    class="md-btn w-xs pull-right btn m-t-md"
                    type="button"
                    @click="clearAll"
                    :disabled="isQueryEmpty"
                >
                    <i v-if="loading" class="fa fa-spin fa-spinner"></i> 
                    <i v-else class="fa fa-trash-o"></i> 
                    {{ $t('action.reset_condition') }}
                </button>
            </div>
        </div>
    </form>
    <div class="row m-l-xs m-r-xs">
        <b class="pull-right text-danger">
            {{ $t('common.total') }}&nbsp;{{ $t('nav.remit') }}:&nbsp;{{ (total_amount || 0) | currency('￥') }}
        </b>
    </div>
    <table class="table table-striped box">
        <thead>
            <tr>
                <th>{{ $t('common.member') }}</th>
                <th width="5%">{{ $t('member.level') }}</th>
                <th width="11%" class="text-center">{{ $t('bill.created_at') }}</th>
                <th>{{ $t('bill.depositor') }}</th>
                <th class="text-center">{{ $t('common.balance_before') }}</th>
                <th class="text-center">{{ $t('common.balance_after') }}</th>
                <th class="text-center">{{ $t('common.amount') }}</th>
                <th>{{ $t('bank.name') }} - {{ $t('bill.remit_payee') }}</th>
                <th width="11%" class="text-center">{{ $t('common.status_updated_at') }}</th>
                <th width="5%" class="text-center">{{ $t('common.status') }}</th>
                <th width="5%" class="text-center">{{ $t('bill.order_detail') }}</th>
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
                <td class="text-center">
                    <span v-if="t.remit_info">{{ t.remit_info.deposited_at | moment("YYYY-MM-DD HH:mm") }}</span>
                </td>
                <td>
                    {{ t.remit_info.depositor || '-' }}
                </td>
                <td class="text-right">
                    <span v-if="t.balance_before || t.balance_before === 0">{{ t.balance_before | currency('￥') }}</span>
                    <span v-else>-</span>
                </td>
                <td class="text-right">
                    <span v-if="t.balance_after || t.balance_after === 0">{{ t.balance_after | currency('￥') }}</span>
                    <span v-else>-</span>
                </td>
                <td class="text-right">{{ t.amount | currency('￥') }}</td>
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
                    <span v-else>-</span>
                </td>
                <td class="text-center">{{ t.updated_at | moment("YYYY-MM-DD HH:mm") }}</td>
                <td class="text-center">
                    <span class="label success" v-if="t.status === 1">{{ $t('status.success') }}</span>
                    <span class="label danger" v-else-if="t.status === 5">{{ $t('status.declined') }}</span>
                    <span v-else-if="t.status === 3 && ($root.permissions.includes('allow_remit_transaction') || $root.permissions.includes('refuse_remit_transaction'))">
                        <button 
                            type="button"
                            class="btn btn-xs blue sm-btn m-b-sm"
                            @click="update(t, 1, true, $event)"
                            v-if="$root.permissions.includes('allow_remit_transaction')"
                        >{{ $t('bill.audit') }}
                        </button> <br v-if="$root.permissions.includes('allow_remit_transaction')">
                        <button
                            type="button"
                            class="btn btn-xs sm-btn"
                            @click="update(t, 5, true, $event)"
                            v-if="$root.permissions.includes('refuse_remit_transaction')"
                        >{{ $t('bill.audit_deny') }}
                        </button>
                    </span>
                    <span class="label warn" v-else-if="t.status === 3">{{ $t('status.ongoing') }}</span>
                    <span v-else>-</span>
                </td>
                <td class="text-center">
                    <router-link :to="'/transaction/' + t.id">{{ $t('action.view') }}</router-link>
                </td>
            </tr>
        </tbody>
    </table>
    <div class="row m-b-lg">
        <pulling
            :queryset="queryset"
            :extra="'transaction_type=remit&report_flag=true'"
            :api="api"
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
    import Pulling from '../../components/Pulling'
    import $ from '../../utils/util'
    import SelectorMemberLevel from '../../components/SelectorMemberLevel'
    import VueCookie from 'vue-cookie'
    import date from '../../utils/date'
    import { debounce } from 'lodash'

    export default {
        data () {
            return {
                queryset: [],
                api: api.transaction.bill,
                query: {},
                remit_type: '',
                status: '',
                created_at: ['', ''],
                updated_at: ['', ''],
                selected: '0',
                total_amount: '',
                href: '',
                export_query: [],
                today: date.today[0],
                shortcuts: ['today', 'yesterday', 'this_week', 'this_month', 'last_month'].map(element => Object({
                    text: this.$t(`common.${element}`),
                    start: date[element][0],
                    end: date[element][1]
                })),
                autoTogglePopup: false,
                loading: true
            }
        },
        watch: {
            '$root.remit_count' (newObj, old) {
                this.$refs.pulling.rebase()
            },
            '$route': {
                handler () {
                    this.loading = true
                    this.setQueryAll()
                    this.queryset = []
                    this.$refs.pulling.rebase()
                },
                deep: true
            },
            remit_type (newObj) {
                this.query.remit_type = newObj
                this.submit()
            },
            status (newObj) {
                this.query.status = newObj
                this.submit()
            },
            created_at (newObj) {
                [this.query.created_at_0, this.query.created_at_1] = [...newObj]
                this.autoTogglePopup = false
                this.submit()
            },
            updated_at (newObj) {
                [this.query.updated_at_0, this.query.updated_at_1] = [...newObj]
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
                                this.$refs.updated.togglePopup()
                            } else {
                                this.$refs.created.togglePopup()
                            }
                        }
                    })
                }
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
                this.href = `${api.report.deposit}?token=${VueCookie.get('access_token')}&report=remit&${this.export_query}`
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
                this.remit_type = this.$route.query.remit_type || ''
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
                    this.$http.put(api.transaction.bill + transaction.id + '/?opt_expand=bank,updated_by', {
                        status: status
                    }).then(data => {
                        transaction.status = data.status
                        transaction.balance_after = data.balance_after
                        transaction.updated_at = data.updated_at
                    }, error => {
                        this.errorMsg = error
                    })
                }
            }
        },
        components: {
            DatePicker,
            Pulling,
            SelectorMemberLevel
        }
    }
</script>
