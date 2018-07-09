<template>
<div>
    <div class="m-b-xs text-right" v-if="$root.permissions.includes('export_finance_report')">
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
        <span class="md-btn w-sm" disabled v-else>
            {{ $t('action.download_report') }}
            <i class="fa fa-download"></i>
        </span>
    </div>
    <form 
      class="form m-b-sm"
      @submit.prevent="submit"
    >
      <div class="box m-t-sm m-b-sm">
        <div class="box-body clearfix form-input-sm">
          <div class="row m-l-xs m-r-xs">
            <div class="pull-left m-r-xs" v-show="report_type === 'monthly'">
              <label
                class="form-control-label p-b-0"
                :class="{'text-blue': query.start_date && query.end_date}"
              >
                <span v-show="report_type === 'monthly'">月份</span>
              </label>
              <div>
                <el-date-picker
                  v-model="date[0]"
                  type="month"
                  :editable="false"
                  :clearable="false"
                  placeholder="起始月"
                  value-format="yyyy-MM"
                />
                <span class="text-xs">-</span>
                <el-date-picker
                  v-model="date[1]"
                  type="month"
                  :editable="false"
                  :clearable="false"
                  placeholder="结束月"
                  value-format="yyyy-MM"
                />
              </div>
            </div>
            <div class="pull-left m-r-xs" v-show="report_type === 'daily'">
              <label
                class="form-control-label p-b-0"
                :class="{'text-blue': query.start_date && query.end_date}"
              >{{ $t('common.date') }}
              </label>
              <el-date-picker
                  style="display: block;"
                  v-model="date"
                  size="mini"
                  type="daterange"
                  align="right"
                  unlink-panels
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="{shortcuts}"
                  :clearable="false"
              />
            </div>
            <div class="pull-left m-r-xs">
              <label
                  class="form-control-label p-b-0"
                  :class="{'text-blue': agent}"
              >{{ $t('member.agent') }}
              </label>
              <selector-agent
                style="display: block;"
                :agent="agent"
                :attribute="'username'"
                @agent-select="agentSelect"
                :placeholder="$t('member.agent')"
              />
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
                :reportFlag="true"
                :accountType="''"
                :placeholder="$t('member.level')"
                @level-select="levelSelect"
              />
            </div>
            <div class="pull-left m-r-xs">
              <label
                  class="form-control-label p-b-0"
                  :class="{'text-blue': transaction_type}"
              >{{ $t('bill.deposit_type') }}
              </label>
              <selector-transaction-type
                style="display: block;"
                :transactionType="transaction_type"
                :displayList="['remit', 'online_pay']"
                :attribute="'code'"
                @transaction-type-select="transactionTypeSelect"
                :placeholder="$t('bill.transaction_type')"
              />
            </div>
            <div class="pull-left m-r-xs">
              <label
                  class="form-control-label p-b-0"
                  :class="{'text-blue': platform}"
              >{{ $t('manage.platform') }}
              </label>
              <select
                style="display: block;"
                class="form-control w-sm c-select"
                v-model="platform"
              >
                <option value="">{{ $t('common.please_select') }}</option>
                <option value="pc">{{ $t('manage.pc') }}</option>
                <option value="mobile">{{ $t('manage.mobile') }}</option>
              </select>
            </div>
            <div class="pull-left m-r-xs">
              <label
                  class="form-control-label p-b-0"
                  :class="{'text-blue': game}"
              >{{ $t('common.game') }}
              </label>
              <selector-game
                style="display: block;"
                :game="game"
                :attribute="'id'"
                @game-select="gameSelect"
                :placeholder="$t('common.game')"
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
      </div>
    </form>
    <div class="box m-t-xs" v-if="queryset.length > 0">
      <div class="b-b nav-active-blue p-t-sm">
        <ul class="nav nav-tabs m-l" >
          <li class="nav-item">
            <router-link
              :to="'/report/finance_report'"
              class="nav-link _500"
              :class="{ 'active': report_type === 'daily' }"
            >日报表
            </router-link>
          </li>
          <li class="nav-item" @click="report_type = 'monthly'">
            <router-link
              :to="'/report/finance_report?report_type=monthly'"
              class="nav-link _500"
              :class="{ 'active': report_type === 'monthly' }"
            >月报表
            </router-link>
          </li>
        </ul>
      </div>
      <table st-table="rowCollectionBasic" class="table table-striped b-t">
        <thead>
          <tr>
            <th class="text-center">{{ $t('common.date') }}</th>
            <th class="text-right">{{ $t('common.overview.label.amount') }}</th>
            <th class="text-right">{{ $t('common.overview.label.betrecord_count') }}</th>
            <th class="text-right">{{ $t('bill.deposit_amount') }}</th>
            <th class="text-right">{{ $t('member.manual_adjust') + $t('common.amount') }}</th>
            <th class="text-right">{{ $t('bill.withdraw') + $t('common.amount') }}</th>
            <th class="text-right">{{ $t('common.overview.label.profit') }}</th>
          </tr>
        </thead>
        <tbody v-if="queryset.length > 0" class="text-right">
          <tr v-for="data in queryset" :key="data.time">
            <td class="text-center">{{ data.time | moment(format) }}</td>
            <td @click="routerGo([data.time, data.time], 'amount')" class="pointer">
                <a>{{ data.amount | currency('￥') }}</a>
            </td>
            <td @click="routerGo([data.time, data.time], 'betrecord_count')" class="pointer">
                <a>{{ data.betrecord_count.toLocaleString() }}</a>
            </td>
            <td @click="routerGo([data.time, data.time], 'deposit_amount')" class="pointer">
                <a>{{ data.deposit_amount | currency('￥') }}</a>
            </td>
            <td @click="routerGo([data.time, data.time], 'manual_operation_amount')" class="pointer">
                <a>{{ data.manual_operation_amount | currency('￥') }}</a>
            </td>
            <td @click="routerGo([data.time, data.time], 'withdraw_amount')" class="pointer">
                <a>{{ data.withdraw_amount | currency('￥') }}</a>
            </td>
            <td @click="routerGo([data.time, data.time], 'profit')" class="pointer">
                <span :class="{
                    'text-success': data.profit >= 0,
                    'text-danger': data.profit < 0
                }">{{ data.profit | currency('￥') }}</span>
            </td>
          </tr>
          <tr class="_600">
            <td class="text-center">{{ $t('common.total') }}</td>
            <td @click="routerGo(date, 'amount')" class="pointer">
                <a>{{ totalAmount | currency('￥') }}</a>
            </td>
            <td @click="routerGo(date, 'betrecord_count')" class="pointer">
                <a>{{ totalBetCount.toLocaleString() }}</a>
            </td>
            <td @click="routerGo(date, 'deposit_amount')" class="pointer">
                <a>{{ totalDeposit | currency('￥') }}</a>
            </td>
            <td @click="routerGo(date, 'manual_operation_amount')" class="pointer">
                <a>{{ totalManualOperation | currency('￥') }}</a>
            </td>
            <td @click="routerGo(date, 'withdraw_amount')" class="pointer">
                <a>{{ totalWithdraw | currency('￥') }}</a>
            </td>
            <td @click="routerGo(date, 'profit')" class="pointer">
                <span :class="{
                    'text-success': totalProfit >= 0,
                    'text-danger': totalProfit < 0
                }">{{ totalProfit | currency('￥') }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="row m-b-lg">
      <pulling
        :api="url"
        :queryset="queryset"
        :query="query"
        @query-data="queryData"
        @query-param="queryParam"
        @export-query="exportQuery"
        @amount="(v) => totalAmount = v"
        @profit="(v) => totalProfit = v"
        @bet-count="(v) => totalBetCount = v"
        @deposit="(v) => totalDeposit = v"
        @manual-operation="(v) => totalManualOperation = v"
        @withdraw="(v) => totalWithdraw = v"
        ref="pulling"
      />
    </div>
</div>
</template>

<script>
import { debounce } from 'lodash'
import VueCookie from 'vue-cookie'
import Vue from 'vue'
import url from '../../service/url'
import Pulling from '../../components/Pulling'
import SelectorTransactionType from '../../components/SelectorTransactionType'
import SelectorGame from '../../components/SelectorGame'
import SelectorAgent from '../../components/SelectorAgent'
import SelectorMemberLevel from '../../components/SelectorMemberLevel'
import date from '../../utils/date'
import $ from '../../utils/util'

export default {
    data () {
        return {
            date: ['', ''],
            url: url.report.finance,
            queryset: [],
            query: {},
            agent: '',
            transaction_type: '',
            report_type: this.$route.query.type || 'daily',
            platform: '',
            game: '',
            href: '',
            export_query: [],
            today: date.today[0],
            shortcuts: ['today', 'yesterday', 'this_week', 'this_month', 'last_month'].map(element => Object({
                text: this.$t(`common.${element}`),
                onClick (p) {
                    p.$emit('pick', date[element])
                }
            })),
            defaultDate: ['', ''],
            loading: true,
            totalAmount: 0,
            totalBetCount: 0,
            totalDeposit: 0,
            totalManualOperation: 0,
            totalWithdraw: 0,
            totalProfit: 0,
            bet: [ 'amount', 'betrecord_count', 'profit' ],
            transaction: [ 'deposit_amount', 'manual_operation_amount', 'withdraw_amount' ],
            format: 'YYYY-MM-DD'
        }
    },
    created () {
        this.setQueryAll()
        this.rebase()
    },
    watch: {
        platform (newObj) {
            this.query.platform = newObj || ''
            this.submit()
        },
        date (newObj, old) {
            if (newObj && Vue.moment(newObj[0]).diff(newObj[1]) > 0) {
                [...newObj] = [newObj[1], newObj[0]]
            }
            if (`${newObj}` === `${this.defaultDate}`) {
                [this.query.start_date, this.query.end_date] = [undefined, undefined]
            } else {
                [this.query.start_date, this.query.end_date] = [...(newObj || [])]
            }
            this.submit()
        },
        '$route': {
            handler () {
                this.setQueryAll()
                this.queryset = []
                this.rebase()
            },
            deep: true
        }
    },
    computed: {
        getReport () {
            this.$refs.pulling.getExportQuery()
            this.href = `${this.url}?token=${VueCookie.get('access_token')}&opt_expand=download_report&${this.export_query}`
            return this.queryset.length
        },
        isQueryEmpty () {
            return $.compareQuery(this.query, { ...(this.report_type && this.report_type !== 'daily' && { report_type: this.report_type }) })
        }
    },
    methods: {
        setQueryAll () {
            this.report_type = this.$route.query.report_type || 'daily'
            if (this.report_type === 'daily') {
                this.format = 'YYYY-MM-DD'
                this.defaultDate = [Vue.moment().subtract(6, 'days').format(this.format), Vue.moment().format(this.format)]
            } else if (this.report_type === 'monthly') {
                this.format = 'YYYY-MM'
                this.defaultDate = [Vue.moment().subtract(5, 'months').format(this.format), Vue.moment().format(this.format)]
            }

            if (this.$route.query.start_date || this.$route.query.end_date) {
                this.date = [this.$route.query.start_date, this.$route.query.end_date]
            } else {
                this.date = [...this.defaultDate]
            }
            this.agent = this.$route.query.agent || ''
            this.transaction_type = this.$route.query.transaction_type || ''
            this.platform = this.$route.query.platform || ''
            this.game = this.$route.query.game || ''
            this.query = Object.assign({}, this.$route.query)
        },
        agentSelect (val) {
            this.query.agent = val
            this.submit()
        },
        levelSelect (val) {
            this.query.member_level = val
            this.submit()
        },
        transactionTypeSelect (val) {
            this.query.transaction_type = val
            this.submit()
        },
        gameSelect (val) {
            this.query.game = val
            this.submit()
        },
        queryData (queryset) {
            this.queryset = queryset
            this.loading = false
        },
        rebase () {
            this.$nextTick(() => {
                this.$refs.pulling.rebase()
            })
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
            debounce(function () {
                this.submit()
            },
        700),
        clearAll () {
            this.query = {
                ...(this.report_type && this.report_type !== 'daily' && { report_type: this.report_type })
            }
            this.$nextTick(() => {
                this.submit()
            })
        },
        routerGo (date, category) {
            let [startDate, endDate] = date
            if (this.report_type === 'monthly') {
                startDate = Vue.moment(startDate).startOf('month').format('YYYY-MM-DD')
                endDate = Vue.moment(endDate).endOf('month').format('YYYY-MM-DD')
            }
            if (this.bet.includes(category)) {
                this.$router.push({
                    path: '/report/betrecord',
                    query: {
                        settled_at_0: startDate,
                        settled_at_1: endDate,
                        status: 'win,lose,tie',
                        ...(this.query.game && { game: this.query.game }),
                        ...(this.platform && { platform: this.platform })
                    }
                })
            }
            if (this.transaction.includes(category)) {
                this.$router.push({
                    path: '/bill/search',
                    query: {
                        updated_at_0: startDate,
                        updated_at_1: endDate,
                        status: 1,
                        ...(this.query.transaction_type
                            ? { transaction_type: this.query.transaction_type }
                            : { transaction_type: category === 'deposit_amount' ? 'remit,online_pay' : (category === 'manual_operation_amount' ? 'manual_operation' : 'withdraw') }
                        ),
                        ...(this.query.agent && { agent_q: this.query.agent }),
                        ...(this.query.member_level && { member_level: this.query.member_level })
                    }
                })
            }
        }
    },
    components: {
        SelectorMemberLevel,
        SelectorTransactionType,
        SelectorGame,
        SelectorAgent,
        Pulling
    }
}
</script>
