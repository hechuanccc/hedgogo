<template>
<div>
    <div class="m-b-xs text-right" v-if="$root.permissions.includes('export_membership_report')">
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
                v-model="date"
                type="date"
                format="yyyy-MM-dd"
                range
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
                @level-select="levelSelect"
                :placeholder="$t('member.level')"
              />
            </div>
              <div class="pull-left m-r-xs">
              <label
                  class="form-control-label p-b-0"
                  :class="{'text-blue': transaction_type}"
              >{{ $t('bill.transaction_type') }}
              </label>
              <selector-transaction-type
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
              <selector-game
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
            <th>{{ $t('common.date') }}</th>
            <th>{{ $t('member.real_member_registration') }}</th>
            <th>{{ $t('member.deposit_member_count') }}</th>
            <th>{{ $t('member.bet_member_count') }}</th>
            <th>{{ $t('member.trial_member_count') }}</th>
          </tr>
        </thead>
        <tbody v-if="queryset.length > 0">
          <tr v-for="data in queryset" :key="data.time">
            <td>{{ data.time | moment('YYYY-MM-DD') }}</td>
            <td>{{ data.real_member_registration }}</td>
            <td>{{ data.deposit_member_count }}</td>
            <td>{{ data.bet_member_count }}</td>
            <td>{{ data.trial_member_count }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="row m-b-lg">
      <pulling
        :queryset="queryset"
        :query="query"
        @query-data="queryData"
        @query-param="queryParam"
        @export-query="exportQuery"
        :api="url"
        ref="pulling"
      />
    </div>
</div>
</template>

<script>
import DatePicker from 'vue2-datepicker'
import _ from 'lodash'
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

const format = 'YYYY-MM-DD'
export default {
    data () {
        return {
            date: ['', ''],
            url: url.report.membership,
            queryset: [],
            query: {},
            agent: '',
            member_level: '',
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
            loading: true
        }
    },
    created () {
        this.defaultDate = [Vue.moment(this.today).subtract(6, 'days').format(format), this.today]
        this.setQueryAll()
        this.rebase()
    },
    watch: {
        platform (newObj, old) {
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
            this.href = `${this.url}?token=${VueCookie.get('access_token')}&opt_expand=download_report&${this.export_query}`
            return this.queryset.length
        },
        isQueryEmpty () {
            return $.compareQuery(this.query, {})
        }
    },
    methods: {
        setQueryAll () {
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
            this.query = {}
            this.$nextTick(() => {
                this.submit()
            })
        }
    },
    components: {
        DatePicker,
        SelectorMemberLevel,
        SelectorTransactionType,
        SelectorGame,
        SelectorAgent,
        Pulling
    }
}
</script>
