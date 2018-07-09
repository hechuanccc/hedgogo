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
                <i class="fa fa-download"></i>
                {{ $t('system.download_report') }}
            </span>
        </a>
        <span class="md-btn w-sm" disabled v-else>
            <i class="fa fa-download"></i>
            {{ $t('system.download_report') }}
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
            <div class="pull-left m-r-xs"  v-show="report_type === 'daily'">
              <label
                class="form-control-label p-b-0"
                :class="{'text-blue': query.start_date && query.end_date}"
              >{{ $t('dic.date') }}
              </label>
              <el-date-picker
                style="display: block;"
                v-model="date"
                size="mini"
                type="daterange"
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
              >{{ $t('dic.agent') }}
              </label>
              <selector-agent
                style="display: block;"
                :agent="agent"
                @agent-select="agentSelect"
                :placeholder="$t('dic.agent')"
              />
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
                :placeholder="$t('dic.member_level')"
              />
            </div>
              <div class="pull-left m-r-xs">
              <label
                  class="form-control-label p-b-0"
                  :class="{'text-blue': transaction_type}"
              >{{ $t('finance.transaction_type') }}
              </label>
              <selector-transaction-type
                style="display: block;"
                :transactionType="transaction_type"
                :displayList="['remit', 'online_pay']"
                @transaction-type-select="transactionTypeSelect"
                :placeholder="$t('finance.transaction_type')"
              />
            </div>
            <div class="pull-left m-r-xs">
              <label
                  class="form-control-label p-b-0"
                  :class="{'text-blue': platform}"
              >{{ $t('dic.platform') }}
              </label>
              <select
                style="display: block;"
                class="form-control w-sm c-select"
                v-model="platform"
              >
                <option value="">{{ $t('system.please_select') }}</option>
                <option value="pc">{{ $t('dic.pc') }}</option>
                <option value="mobile">{{ $t('dic.mobile') }}</option>
              </select>
            </div>
              <div class="pull-left m-r-xs">
              <label
                  class="form-control-label p-b-0"
                  :class="{'text-blue': game}"
              >{{ $t('dic.game') }}
              </label>
              <selector-game
                style="display: block;"
                :game="game"
                @game-select="gameSelect"
                :placeholder="$t('dic.game')"
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
              {{ $t('system.reset_condition') }}
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
              :to="'/report/member_report'"
              class="nav-link _500"
              :class="{ 'active': report_type === 'daily' }"
            >日报表
            </router-link>
          </li>
          <li class="nav-item" @click="report_type = 'monthly'">
            <router-link
              :to="'/report/member_report?report_type=monthly'"
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
            <th>{{ $t('dic.date') }}</th>
            <th>{{ $t('report.member.real_member_registration_count') }}</th>
            <th>{{ $t('report.member.deposit_member_count') }}</th>
            <th>{{ $t('report.member.bet_member_count') }}</th>
            <th>{{ $t('report.member.trial_member_count') }}</th>
          </tr>
        </thead>
        <tbody v-if="queryset.length > 0">
          <tr v-for="data in queryset" :key="data.time">
            <td>{{ data.time | moment(format) }}</td>
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
            url: url.report.membership,
            queryset: [],
            query: {},
            agent: '',
            member_level: '',
            transaction_type: '',
            report_type: this.$route.query.type || 'daily',
            platform: '',
            game: '',
            href: '',
            export_query: [],
            today: date.today[0],
            shortcuts: ['today', 'yesterday', 'this_week', 'this_month', 'last_month'].map(element => Object({
                text: this.$t(`time.${element}`),
                onClick (p) {
                    p.$emit('pick', date[element])
                }
            })),
            defaultDate: ['', ''],
            loading: true,
            format: 'YYYY-MM-DD'
        }
    },
    created () {
        this.setQueryAll()
        this.rebase()
    },
    watch: {
        platform (newObj, old) {
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
