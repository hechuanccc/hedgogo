<template>
<div>
    <div class="m-b-xs text-right" v-if="$root.permissions.includes('export_transaction_report')">
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
                        :class="{'text-blue': created_at && (created_at[0] || created_at[1])}"
                    >{{ $t('common.date') }}
                    </label>
                    <date-picker
                        width='244'
                        style="display: block;"
                        :not-after="today"
                        :shortcuts="shortcuts"
                        type="date"
                        v-model="created_at"
                        format="yyyy-MM-dd"
                        range
                    />
                </div>
                <div class="pull-left m-r-xs">
                    <label
                        class="form-control-label p-b-0"
                        :class="{'text-blue': transaction_type}"
                    >{{ $t('bill.transaction_type') }}
                    </label>
                    <transaction-type-selector
                        style="display: block;"
                        :transactionType="transaction_type"
                        :attribute="'code'"
                        @transaction-type-select="transactionTypeSelect"
                    />
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
                        :class="{'text-blue': !$route.query.member && query.member_level}"
                    >{{ $t('member.level') }}
                    </label>
                    <level
                        style="display: block;"
                        :level="query.member_level"
                        :disabled="$route.query.member"
                        @level-select="levelSelect"
                    />
                </div>
                <div class="pull-left m-r-xs">
                    <label
                        class="form-control-label p-b-0"
                        :class="{'text-blue': !$route.query.member && query.member_q
                        }"
                    >{{ $t('common.member') }}
                    </label>
                    <input
                        v-model="query.member"
                        class="form-control w-sm"
                        disabled
                        v-if="$route.query.member"
                    />
                    <input
                        v-model="query.member_q"
                        class="form-control w-sm"
                        :placeholder="$t('common.member')"
                        @input="search"
                        v-else
                    />
                </div>
                <div class="pull-left m-r-xs">
                    <label
                        class="form-control-label p-b-0"
                        :class="{'text-blue': !$route.query.member && query.agent_q
                        }"
                    >{{ $t('common.agent') }}
                    </label>
                    <input
                        v-model="query.agent"
                        class="form-control w-sm"
                        disabled
                        v-if="$route.query.member"
                    />
                    <input
                        v-model="query.agent_q"
                        class="form-control w-sm"
                        :placeholder="$t('common.agent')"
                        @input="search"
                        v-else
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
    <table class="box table table-striped">
        <thead>
            <tr>
                <th>{{ $t('common.member') }}</th>
                <th>{{ $t('common.agent') }}</th>
                <th class="text-center">{{ $t('bill.created_at') }}</th>
                <th>{{ $t('bill.transaction_type') }}</th>
                <th class="text-center">{{ $t('common.balance_before') }}</th>
                <th class="text-center">{{ $t('common.balance_after') }}</th>
                <th class="text-center">{{ $t('common.amount') }}</th>
                <th class="text-center">{{ $t('common.status') }}</th>
                <th class="text-center">{{ $t('bill.order_detail') }}</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="t in queryset" :key="t.id">
                <td>
                    <router-link :to="'/member/' + t.member.id">{{ t.member.username }}</router-link>
                </td>
                <td><router-link :to="'/agent/' + t.member.agent.id ">{{ t.member.agent.username }}</router-link></td>
                <td class="text-center">{{ t.created_at | moment("YYYY-MM-DD HH:mm:ss") }}</td>
                <td>{{ t.transaction_type.display_name }}</td>
                <td class="text-right">
                    <span v-if="t.balance_before || t.balance_before === 0">{{ t.balance_before | currency('￥') }}</span>
                    <span v-else>-</span>
                </td>
                <td class="text-right">
                    <span v-if="t.balance_after || t.balance_after === 0">{{ t.balance_after | currency('￥') }}</span>
                    <span v-else>-</span>
                </td>
                <td class="text-right">{{ t.amount | currency('￥') }} <label v-if="t.withdraw_fee"> - 手续费：{{ t.withdraw_fee }}</label></td>
                <td class="text-center">
                    <transaction-status :transaction="t"></transaction-status>
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
            :query="query"
            :extra="'report_flag=true'"
            :export_query="export_query"
            @query-data="queryData"
            @query-param="queryParam"
            @export-query="exportQuery"
            :api="api"
            ref="pulling"
        />
    </div>
</div>
</template>

<script>
    import api from '../../api'
    import DatePicker from 'vue2-datepicker'
    import transactionStatus from '../../components/transaction_status'
    import transactionTypeSelector from '../../components/transactionTypeSelector'
    import pulling from '../../components/pulling'
    import $ from '../../utils/util'
    import level from '../../components/level'
    import VueCookie from 'vue-cookie'
    import date from '../../utils/date'
    import _ from 'lodash'

    export default {
        data () {
            return {
                queryset: [],
                created_at: ['', ''],
                api: api.bill,
                order_id: '',
                query: {},
                member: {
                    username: '',
                    agent: {},
                    level: {}
                },
                status: '',
                member_level: '',
                // use selectd transaction types
                transaction_type: '',
                // all of the transaction types
                trans_type: [],
                href: '',
                export_query: '',
                today: date.today[0],
                shortcuts: ['today', 'yesterday', 'this_week', 'this_month', 'last_month'].map(element => Object({
                    text: this.$t(`common.${element}`),
                    start: date[element][0],
                    end: date[element][1]
                })),
                loading: true
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
            created_at (newObj) {
                [this.query.created_at_0, this.query.created_at_1] = [...newObj]
                this.submit()
            },
            status (newObj) {
                this.query.status = newObj
                this.submit()
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
                this.href = `${api.report_transaction}?token=${VueCookie.get('access_token')}&${this.export_query}`
                return this.queryset.length
            },
            isQueryEmpty () {
                return $.compareQuery(this.query, {})
            }
        },
        methods: {
            setQueryAll () {
                if (this.$route.query.created_at_0 || this.$route.query.created_at_1) {
                    this.created_at = [this.$route.query.created_at_0, this.$route.query.created_at_1]
                } else {
                    this.created_at = [undefined, undefined]
                }
                this.status = this.$route.query.status || ''
                this.transaction_type = this.$route.query.transaction_type || ''
                this.query = Object.assign({}, this.$route.query)
            },
            levelSelect (val) {
                this.query.member_level = val
                this.submit()
            },
            transactionTypeSelect (val) {
                this.query.transaction_type = val
                this.submit()
            },
            queryData (queryset) {
                this.loading = false
                this.queryset = queryset
            },
            queryParam (query) {
                this.query = Object.assign(this.query, query)
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
                _.debounce(function () {
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
        components: {
            DatePicker,
            pulling,
            transactionStatus,
            transactionTypeSelector,
            level
        }
    }
</script>
