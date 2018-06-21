<template>
  <div>
    <div class="row">
      <div class="col-md-12 text-right" v-if="$root.permissions.includes('export_agent_commission_report')">
        <a
          :href="href"
          :getReport="getReport"
          v-if="queryset.length"
          class="md-btn w-sm blue pull-right text-white"
        >
          <span class="font-weight-normal">
            {{ $t('action.download_report') }}
            <i class="fa fa-download"></i>
          </span>
        </a>
        <span disabled v-else>
          {{ $t('action.download_report') }}
          <i class="fa fa-download"></i>
        </span>
      </div>
    </div>
    <form 
      class="form"
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
                :not-after="yesterday"
                :shortcuts="shortcuts"
                v-model="date"
                type="date"
                format="yyyy-MM-dd"
                range
              />
            </div>
            <div class="pull-left m-r-xs">
              <label
                class="form-control-label p-b-0"
                :class="{'text-blue': query.agent}"
              >
                {{ $t('common.agent') }}
                <span class="text-muted">({{ $t('common.accurate_search') }})</span>
              </label>
              <input
                v-model.trim="query.agent"
                class="form-control w-sm"
                :placeholder="$t('common.agent')"
                @input="search"
              />
            </div>
            <div class="pull-left m-r-xs">
              <label
                class="form-control-label p-b-0"
                :class="{'text-blue': query.agent_level && !query.agent}"
              >{{ $t('agent.level') }}
              </label>
              <selector-agent-level
                style="display: block;"
                :level="query.agent_level"
                @level-select="agentLevelSelect"
                :placeholder="$t('agent.level')"
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
            <th>{{ $t('common.agent') }}</th>
            <th class="text-center">{{ $t('agent.level') }}</th>
            <th class="text-right">{{ $t('common.member_count') }}</th>
            <th class="text-right">{{ $t('common.valid_bet_amount') }}</th>
            <th class="text-right">{{ $t('bill.discount') }}</th>
            <th class="text-right">{{ $t('bill.return') }}</th>
            <th class="text-right">{{ $t('commission.profit') }}</th>
            <th class="text-right">{{ $t('commission.commission_rate') }}</th>
            <th class="text-right">{{ $t('nav.commission') }}</th>
          </tr>
        </thead>
        <tbody v-if="queryset.length > 0" class="text-right">
          <tr v-for="data in queryset" :key="data.time">
            <td class="text-left">
                <router-link :to="`/agent/${data.agent_id}`">
                    {{ data.agent_name }}
                </router-link>
            </td>
            <td class="text-center">{{ data.agent_level }}</td>
            <td>{{ data.member_count.toLocaleString() }}</td>
            <td>{{ data.bet_amount | currency('￥') }}</td>
            <td>{{ data.discount | currency('￥') }}</td>
            <td>{{ data.return_amount | currency('￥') }}</td>
            <td>{{ data.profit | currency('￥') }}</td>
            <td>{{ data.rate }}&nbsp;%</td>
            <td>{{ data.commission_amount | currency('￥') }}</td>
          </tr>
          <tr class="_600">
            <td colspan="8" class="text-right">{{ $t('commission.total') }}</td>
            <td>{{ totalCommissionAmount | currency('￥', 2) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="row m-b-lg">
      <pulling
        :api="url"
        :queryset="queryset"
        :query="query"
        :extra="extra"
        @query-data="queryData"
        @query-param="queryParam"
        @export-query="exportQuery"
        ref="pulling"
        @commission="(v) => totalCommissionAmount = v"
      />
    </div>
	</div>
</template>

<script>
import DatePicker from 'vue2-datepicker'
import url from '../../service/url'
import SelectorAgentLevel from '../../components/SelectorAgentLevel'
import Pulling from '../../components/Pulling'
import VueCookie from 'vue-cookie'
import Vue from 'vue'
import date from '../../utils/date'
import _ from 'lodash'
import $ from '../../utils/util'

const format = 'YYYY-MM-DD'
export default {
    data () {
        return {
            url: url.report.commission,
            date: ['', ''],
            queryset: [],
            query: {},
            extra: '',
            href: '',
            export_query: [],
            yesterday: date.yesterday[0],
            shortcuts: ['today', 'yesterday', 'this_week', 'this_month', 'last_month'].map(element => Object({
                text: this.$t(`common.${element}`),
                start: date[element][0],
                end: date[element][1]
            })),
            defaultDate: ['', ''],
            totalCommissionAmount: 0,
            loading: true
        }
    },
    created () {
        this.defaultDate = [Vue.moment(this.yesterday).subtract(6, 'days').format(format), this.yesterday]
        this.setQueryAll()
        this.rebase()
    },
    watch: {
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
            this.href = `${this.url}?token=${VueCookie.get('access_token')}&opt_expand=download_report&${this.export_query}`
            return this.queryset.length
        },
        isQueryEmpty () {
            return $.compareQuery(this.query, {})
        }
    },
    methods: {
        setQueryAll () {
            let query = this.$route.query
            if (query.start_date || query.end_date) {
                this.date = [query.start_date, query.end_date]
            } else {
                this.date = this.defaultDate
            }
            this.query = Object.assign({}, query)
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
                if (this.query.agent) {
                    this.query.agent_level = ''
                }
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
        agentLevelSelect (val) {
            this.query.agent_level = val
            if (val) {
                this.query.agent = ''
            }
            this.submit()
        }
    },
    components: {
        DatePicker,
        SelectorAgentLevel,
        Pulling
    }
}
</script>
