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
                :not-after="today"
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
                :transactionType="transaction_type"
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
                <button class="md-btn w-xs" type="button" @click="clearAll">{{$t('action.clear')}}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
    <div class="row m-t-md">
        <div class="col-xs-12">
        <div class="pull-right" v-if="$root.permissions.includes('export_membership_report')">
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
            api: api.member_report,
            queryset: [],
            query: {
                start_date: '',
                end_date: '',
                agent: '',
                member_level: '',
                transaction_type: '',
                platform: '',
                game: ''
            },
            agent: '',
            member_level: '',
            transaction_type: '',
            platform: '',
            game: '',
            filter: {},
            href: '',
            export_query: [],
            today: Vue.moment().format(format)
        }
    },
    created () {
        if (this.$route.query.start_date || this.$route.query.end_date) {
            this.date = [this.$route.query.start_date, this.$route.query.end_date]
        } else {
            this.date = [Vue.moment(this.today).subtract(6, 'days'), this.today]
        }
        this.query = {
            ...this.query,
            ...this.$route.query
        }
        this.$nextTick(() => {
            this.$refs.pulling.rebase()
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
            this.$refs.pulling.getExportQuery()
            this.href = `${this.api}?token=${VueCookie.get('access_token')}&opt_expand=download_report&${this.export_query}`
            return this.queryset.length
        }
    },
    methods: {
        nextTickFetch () {
            if (this.$route.query.start_date || this.$route.query.end_date) {
                this.date = [this.$route.query.start_date, this.$route.query.end_date]
            } else {
                this.date = [Vue.moment(this.today).subtract(6, 'days'), this.today]
            }
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
            this.query.transaction_type = val
            this.transaction_type = val
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
                start_date: '',
                end_date: '',
                agent: '',
                member_level: '',
                transactionType: '',
                platform: '',
                game: ''
            }
            this.date = [Vue.moment(this.today).subtract(6, 'days'), this.today]
            this.agent = ''
            this.member_level = ''
            this.transactionType = ''
            this.platform = ''
            this.game = ''
            this.$router.push({
                path: this.$route.path
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
