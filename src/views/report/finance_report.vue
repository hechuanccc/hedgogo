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
        <span class="m-t-sm m-r-sm" disabled v-else>
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
            <div class="pull-left m-r-xs">
              <label
                class="form-control-label p-b-0"
                :class="{'text-blue': query.start_date && query.end_date}"
              >{{ $t('common.date') }}
              </label>
              <date-picker
                width='244'
                style="display: block;"
                :not-after="today"
                :shortcuts="shortcuts"
                :inputClass="'input form-control'"
                v-model="date"
                type="date"
                format="yyyy-MM-dd"
                range
              />
            </div>
            <div class="pull-left m-r-xs">
              <label
                  class="form-control-label p-b-0"
                  :class="{'text-blue': agent && !agentReport}"
              >{{ $t('member.agent') }}
              </label>
              <agent-selector
                style="display: block;"
                :agent="agent"
                @agent-select="agentSelect"
                :placeholder="$t('member.agent')"
                :disabled="!agentReport"
              />
            </div>
            <div class="pull-left m-r-xs">
              <label
                  class="form-control-label p-b-0"
                  :class="{'text-blue': query.member_level && !agentReport}"
              >{{ $t('member.level') }}
              </label>
              <level
                style="display: block;"
                :level="query.member_level"
                :reportFlag="true"
                :accountType="''"
                :placeholder="$t('member.level')"
                :disabled="agentReport"
                @level-select="levelSelect"
              />
            </div>
            <div class="pull-left m-r-xs">
              <label
                  class="form-control-label p-b-0"
                  :class="{'text-blue': transaction_type}"
              >{{ $t('bill.deposit_type') }}
              </label>
              <transaction-type-selector
                style="display: block;"
                :transactionType="transaction_type"
                :displayList="['remit', 'online_pay']"
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
              <game-selector
                style="display: block;"
                :game="game"
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
              <span>{{ $t('action.reset_condition') }}</span>
            </button>
          </div>
        </div>
      </div>
    </form>
    <div class="box m-t-xs" v-if="queryset.length > 0">
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
            <td class="text-center">{{ data.time | moment('YYYY-MM-DD') }}</td>
            <td>{{ data.amount | currency('￥') }}</td>
            <td>{{ data.betrecord_count.toLocaleString() }}</td>
            <td>{{ data.deposit_amount | currency('￥') }}</td>
            <td>{{ data.manual_operation_amount | currency('￥') }}</td>
            <td>{{ data.withdraw_amount | currency('￥') }}</td>
            <td :class="data.profit < 0 ? 'text-danger' : 'text-success'">{{ data.profit | currency('￥') }}</td>
          </tr>
          <tr class="_600">
              <td class="text-center">{{ $t('common.total') }}</td>
              <td>{{ totalAmount | currency('￥') }}</td>
              <td>{{ totalBetCount.toLocaleString() }}</td>
              <td>{{ totalDeposit | currency('￥') }}</td>
              <td>{{ totalManualOperation | currency('￥') }}</td>
              <td>{{ totalWithdraw | currency('￥') }}</td>
              <td :class="totalProfit < 0 ? 'text-danger' : 'text-success'">{{ totalProfit | currency('￥') }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="row m-b-lg">
      <pulling
        :api="api"
        :queryset="queryset"
        :query="query"
        :extra="extra"
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
import DatePicker from 'vue2-datepicker'
import api from '../../api'
import pulling from '../../components/pulling'
import transactionTypeSelector from '../../components/transactionTypeSelector'
import gameSelector from '../../components/gameSelector'
import agentSelector from '../../components/agentSelector'
import VueCookie from 'vue-cookie'
import Vue from 'vue'
import date from '../../utils/date'
import _ from 'lodash'
import $ from '../../utils/util'

const format = 'YYYY-MM-DD'
export default {
    data () {
        return {
            agentReport: false,
            date: ['', ''],
            api: api.finance_report,
            queryset: [],
            query: {},
            extra: '',
            agent: '',
            transaction_type: '',
            platform: '',
            game: '',
            href: '',
            export_query: [],
            today: date.today[0],
            shortcuts: ['today', 'yesterday', 'this_week', 'this_month', 'last_month'].map(element => Object({
                text: this.$t(`common.${element}`),
                start: date[element][0],
                end: date[element][1]
            })),
            defaultDate: ['', ''],
            loading: true,
            totalAmount: 0,
            totalBetCount: 0,
            totalDeposit: 0,
            totalManualOperation: 0,
            totalWithdraw: 0,
            totalProfit: 0
        }
    },
    created () {
        this.defaultDate = [Vue.moment(this.today).subtract(6, 'days').format(format), this.today]
        this.setQueryAll()
        this.rebase()
    },
    watch: {
        platform (newObj) {
            this.query.platform = newObj || ''
            this.submit()
        },
        date (newObj, old) {
            if (`${newObj}` === `${this.defaultDate}`) {
                [this.query.start_date, this.query.end_date] = [undefined, undefined]
            } else {
                [this.query.start_date, this.query.end_date] = [...newObj]
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
            this.href = `${this.api}?token=${VueCookie.get('access_token')}${this.agentReport ? `&agent=${this.agent}` : ''}&opt_expand=download_report&${this.export_query}`
            return this.queryset.length
        },
        isQueryEmpty () {
            return $.compareQuery(this.query, {})
        }
    },
    methods: {
        setQueryAll () {
            if (this.$route.params.agentId) {
                this.agentReport = true
                this.extra = `agent=${this.$route.params.agentId}`
                this.agent = this.$route.params.agentId
            } else {
                this.agentReport = false
                this.extra = ''
                this.agent = this.$route.query.agent || ''
            }
            if (this.$route.query.start_date || this.$route.query.end_date) {
                this.date = [this.$route.query.start_date, this.$route.query.end_date]
            } else {
                this.date = this.defaultDate
            }
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
            _.debounce(function () {
                this.submit()
            },
        700),
        clearAll () {
            if (this.agentReport) {
                this.query = {
                    member_level: this.query.member_level
                }
            } else {
                this.query = {}
            }
            this.$nextTick(() => {
                this.submit()
            })
        }
    },
    components: {
        DatePicker,
        level: require('../../components/level'),
        transactionTypeSelector,
        gameSelector,
        agentSelector,
        pulling
    }
}
</script>
