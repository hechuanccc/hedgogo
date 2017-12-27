<template>
  <div>
    <form 
      class="form"
      @submit.prevent="submit"
    >
      <div class="box m-t-sm m-b-sm">
        <div class="box-body clearfix form-inline form-input-sm">
          <div class="row">
            <div class="col-xs-12">
              <date-picker
                :not-after="yesterday"
                :shortcuts="[]"
                class="pull-left m-r-xs"
                v-model="date"
                type="date"
                format="yyyy-MM-dd"
                range
              />
              <agent-selector
                class="pull-left m-r-xs"
                :agent="agent"
                @agent-select="agentSelect"
                :placeholder="$t('member.agent')"
              />
              <level 
                class="pull-left m-r-xs"
                :level="member_level"
                @level-select="levelSelect"
                :placeholder="$t('member.level')"
              />
              <transaction-type-selector
                class="pull-left m-r-xs"
                :transactionType="transactionType"
                :displayList="[1, 2]"
                @transaction-type-select="transactionTypeSelect"
                :placeholder="$t('bill.transaction_type')"
              />
              <select class="pull-left m-r-xs form-control w-sm c-select" v-model="platform">
                <option value="">{{ $t('manage.platform') }}</option>
                <option value="pc">{{ $t('manage.pc') }}</option>
                <option value="mobile">{{ $t('manage.mobile') }}</option>
              </select>
              <game-selector
                class="pull-left m-r-xs"
                :game="game"
                @game-select="gameSelect"
                :placeholder="$t('common.game')"
              />
              <div class="pull-right">
                <button type="submit" class="md-btn w-xs blue" @keyup.enter="submit">{{$t('common.search')}}</button>
                <button class="md-btn w-xs" type="button" @click="clearAll">{{$t('action.clear_all')}}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
    <div class="row m-t-md">
        <div class="col-xs-12">
        <div class="pull-right">
            <a :href="href" :getReport="getReport" v-if="queryset.length">
                <span>{{ $t('action.download') }}<i class="material-icons">&#xe2c4;</i></span>
            </a>
            <span disabled v-else>{{ $t('action.download') }}<i class="material-icons">&#xe2c4;</i></span>
        </div>
        </div>
    </div>
    <div class="box m-t-xs" v-if="queryset.length > 0">
      <table st-table="rowCollectionBasic" class="table table-striped b-t">
        <thead>
          <tr>
            <th>{{ $t('common.date') }}</th>
            <th>{{ $t('common.overview.label.amount') }}</th>
            <th>{{ $t('common.overview.label.betrecord_count') }}</th>
            <th>{{ $t('bill.deposit_amount') }}</th>
            <th>{{ $t('common.overview.label.profit') }}</th>
          </tr>
        </thead>
        <tbody v-if="queryset.length > 0">
          <tr v-for="data in queryset" :key="data.time">
            <td>{{ data.time | moment('YYYY-MM-DD') }}</td>
            <td><i class="fa fa-rmb"></i> {{ data.amount.toLocaleString() }}</td>
            <td>{{ data.betrecord_count }}</td>
            <td><i class="fa fa-rmb"></i> {{ data.deposit_amount.toLocaleString() }}</td>
            <td :class="data.profit < 0 ? 'text-danger' : 'text-success'"><span v-if="data.profit<0">-</span> <i class="fa fa-rmb"></i> {{ data.profit | decimalFilter }}</td>
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
        :api="api"
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

const format = 'YYYY-MM-DD'
export default {
    data () {
        return {
            date: ['', ''],
            api: api.finance_report,
            queryset: [],
            query: {
                start_date: '',
                end_date: '',
                agent: '',
                member_level: '',
                transactionType: '',
                platform: '',
                game: ''
            },
            agent: '',
            member_level: '0',
            transactionType: '',
            platform: '',
            game: '',
            filter: {},
            href: '',
            export_query: [],
            yesterday: Vue.moment().subtract(1, 'days').format(format)
        }
    },
    created () {
        this.clearAll()
        this.$nextTick(() => {
            this.$refs.pulling.rebase()
            this.$refs.pulling.getExportQuery()
        })
    },
    watch: {
        platform (newObj, old) {
            this.query.platform = newObj
        },
        date (newObj, old) {
            [this.query.start_date, this.query.end_date] = newObj.map(e => Vue.moment(e).format(format))
        },
        '$route': 'nextTickFetch'
    },
    computed: {
        getReport () {
            this.href = `${this.api}?token=${VueCookie.get('access_token')}&report_flag=true&${this.export_query}`
            return this.queryset.length
        }
    },
    methods: {
        nextTickFetch () {
            this.queryset = []
            setTimeout(() => {
                this.$refs.pulling.rebase()
                this.$refs.pulling.getExportQuery()
            }, 100)
        },
        agentSelect (val) {
            this.query.agent = val
            this.agent = val
        },
        levelSelect (val) {
            this.query.member_level = val
            this.member_level = val
        },
        transactionTypeSelect (val) {
            this.query.transactionType = val
            this.transactionType = val
        },
        gameSelect (val) {
            this.query.game = val
            this.game = val
        },
        queryData (queryset) {
            this.query = Object.assign({}, this.filter)
            this.queryset = queryset
        },
        queryParam (query) {
            this.filter = query
        },
        exportQuery (expor) {
            this.export_query = expor
        },
        submit () {
            this.$refs.pulling.submit()
            this.$refs.pulling.getExportQuery()
        },
        clearAll () {
            this.query = {
                start_date: Vue.moment().subtract(7, 'days').format(format),
                end_date: Vue.moment().subtract(1, 'days').format(format),
                agent: '',
                member_level: '',
                transactionType: '',
                platform: '',
                game: ''
            }
            this.date = [this.query.start_date, this.query.end_date]
            this.agent = ''
            this.member_level = '0'
            this.transactionType = ''
            this.platform = ''
            this.game = ''
            this.$router.push({
                path: this.$route.path,
                query: {
                    start_date: this.query.start_date,
                    end_date: this.query.end_date
                }
            })
        }
    },
    filters: {
        decimalFilter (value) {
            return Math.abs(value.toFixed(2)).toLocaleString()
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
