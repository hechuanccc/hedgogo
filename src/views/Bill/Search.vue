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
                        <option value="6">{{ $t('status.payment_pending') }}</option>
                        <option value="4">{{ $t('status.cancelled') }}</option>
                        <option value="5">{{ $t('status.declined') }}</option>
                    </select>
                </div>
                <div class="pull-left m-r-xs">
                    <label
                        class="form-control-label p-b-0"
                        :class="{'text-blue': !$route.query.member && query.member_level}"
                    >{{ $t('dic.member_level') }}
                    </label>
                    <selector-member-level
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
                    >{{ $t('dic.member') }}
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
                        :placeholder="$t('dic.member')"
                        @input="search"
                        v-else
                    />
                </div>
                <div class="pull-left m-r-xs">
                    <label
                        class="form-control-label p-b-0"
                        :class="{'text-blue': !$route.query.member && query.agent_q
                        }"
                    >{{ $t('dic.agent') }}
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
                        :placeholder="$t('dic.agent')"
                        @input="search"
                        v-else
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
            <div class="row m-l-xs m-r-xs">
                <div class="pull-left m-r-xs">
                    <label
                        class="form-control-label p-b-0"
                        :class="{'text-blue': created_at && (created_at[0] || created_at[1])}"
                    >{{ $t('dic.date') }}
                    </label>
                    <el-date-picker
                        style="display: block;"
                        v-model="created_at"
                        size="mini"
                        type="daterange"
                        align="right"
                        unlink-panels
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="{shortcuts}"
                    />
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
                        :class="{'text-blue': query.description_q}"
                    >{{ $t('finance.transaction_type') }}
                    </label>
                    <div :class="{
                            'w-sm': !transactionType || transactionType.length === 0
                        }">
                        <multiselect
                            v-model="transactionType"
                            :options="transactionTypeOptions"
                            :multiple="true"
                            :close-on-select="false"
                            :clear-on-select="false"
                            :hide-selected="true"
                            :preserve-search="false"
                            :searchable="false"
                            :placeholder="$t('system.please_select')"
                            label="display_name"
                            track-by="id" 
                            :preselect-first="false"
                            :selectLabel="''"
                            @close="closeTransactionTypeSelector"
                        >
                            <template
                                slot="tag"
                                slot-scope="props"
                            >
                                <span class="custom__tag label m-l-xs blue pointer" @click="props.remove(props.option)">
                                    {{ props.option.display_name }}
                                    <i class="fa fa-times"></i>
                                </span>
                            </template>
                            <template slot="noResult">{{ $t('system.no_record') }}</template>
                        </multiselect>
                    </div>
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
    <table class="box table table-striped">
        <thead>
            <tr>
                <th>{{ $t('dic.member') }}</th>
                <th>{{ $t('dic.agent') }}</th>
                <th class="text-center">{{ $t('time.transaction_at') }}</th>
                <th class="text-center">{{ $t('finance.transaction_type') }}</th>
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
                </td>
                <td><router-link :to="'/agent/' + t.member.agent.id ">{{ t.member.agent.username }}</router-link></td>
                <td class="text-center">
                    <span class="text-xs">{{ t.created_at | moment("YYYY-MM-DD HH:mm:ss") }}</span>
                </td>
                <td class="text-center">{{ t.transaction_type.display_name }}</td>
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
                    <router-link :to="'/transaction/' + t.id">{{ $t('dic.view') }}</router-link>
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
            :api="url.transaction.bill"
            ref="pulling"
        />
    </div>
</div>
</template>

<script>
    import Multiselect from 'vue-multiselect'
    import url from '../../service/url'
    import { getTransactionType } from '../../service'
    import TransactionStatus from '../../components/TransactionStatus'
    import SelectorTransactionType from '../../components/SelectorTransactionType'
    import Pulling from '../../components/Pulling'
    import $ from '../../utils/util'
    import SelectorMemberLevel from '../../components/SelectorMemberLevel'
    import VueCookie from 'vue-cookie'
    import date from '../../utils/date'
    import _ from 'lodash'

    export default {
        data () {
            return {
                queryset: [],
                created_at: ['', ''],
                order_id: '',
                query: {},
                member: {
                    username: '',
                    agent: {},
                    level: {}
                },
                status: '',
                member_level: '',
                // all of the transaction types
                transactionType: [],
                transactionTypeOptions: [],
                href: '',
                export_query: '',
                today: date.today[0],
                shortcuts: ['today', 'yesterday', 'this_week', 'this_month', 'last_month'].map(element => Object({
                    text: this.$t(`time.${element}`),
                    onClick (p) {
                        p.$emit('pick', date[element])
                    }
                })),
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
            created_at (newObj) {
                [this.query.created_at_0, this.query.created_at_1] = [...(newObj || [])]
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
                this.href = `${url.report.transaction}?token=${VueCookie.get('access_token')}&${this.export_query}`
                return this.queryset.length
            },
            isQueryEmpty () {
                return $.compareQuery(this.query, {})
            }
        },
        methods: {
            async setQueryAll () {
                this.transactionTypeOptions.length || (this.transactionTypeOptions = await getTransactionType())
                if (this.$route.query.transaction_type) {
                    let transactionType = this.$route.query.transaction_type.split(',')
                    this.transactionType = this.transactionTypeOptions.filter(d => transactionType.includes(d.code))
                } else {
                    this.transactionType = []
                }

                if (this.$route.query.created_at_0 || this.$route.query.created_at_1) {
                    this.created_at = [this.$route.query.created_at_0, this.$route.query.created_at_1]
                } else {
                    this.created_at = [undefined, undefined]
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
            },
            closeTransactionTypeSelector (value, id) {
                this.query.transaction_type = `${value.map(v => v.code)}`
                this.submit()
            }
        },
        components: {
            Multiselect,
            Pulling,
            TransactionStatus,
            SelectorTransactionType,
            SelectorMemberLevel
        }
    }
</script>
