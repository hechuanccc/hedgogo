<template>
  <div>
    <div class="m-l-xs m-t-0 row" v-if="pageSelected === 'allMember'">
      <div class="inline m-r-xs" v-if="$root.permissions.includes('add_new_member')">
        <router-link
          tag="button"
          class="md-btn w-sm blue pull-right"
          to="/member/add"
        >{{ $t('action.add_member') }}
        </router-link>
      </div>
    </div>
    <div class="row m-b-sm m-r-xs m-l-xs" v-else>
      <button
        class="md-btn blue pull-right btn w-sm"
        type="button"
        @click="refresh"
      >
        <span>
          <i class="fa fa-spin fa-spinner" v-if="loading"></i>
          {{ $t('common.refresh') }}
        </span>
      </button>
    </div>
    <form 
      class="form"
      @submit.prevent="submit"
      v-show="pageSelected === 'allMember'"
    >
      <div class="box m-t-sm m-b-sm">
        <div class="box-body clearfix form-input-sm">
          <div class="row m-l-xs m-r-xs">
            <div class="pull-left m-r-xs">
              <label
                class="form-control-label p-b-0"
                :class="{'text-blue': query.username_q}"
              >{{ $t('common.username') }}
              </label>
              <input 
                v-model.trim="query.username_q"
                class="form-control w-sm"
                :placeholder="$t('common.username')"
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
                :class="{'text-blue': query.agent_q}"
              >{{ $t('common.agent') }}
              </label>
              <input 
                v-model.trim="query.agent_q"
                class="form-control w-sm"
                :placeholder="$t('common.agent')"
                @input="search"
              />
            </div>
            <div class="pull-left m-r-xs">
              <label
                  class="form-control-label p-b-0"
                  :class="{'text-blue': query.level}"
              >{{ $t('member.level') }}
              </label>
              <level
                :level="query.level"
                @level-select="levelSelect"
                style="display: block;"
              />
            </div>
            <div class="pull-left m-r-xs">
              <label
                  class="form-control-label p-b-0"
                  :class="{'text-blue': status}"
              >{{ $t('common.status') }}
              </label>
              <select
                class="form-control c-select w-sm"
                style="display: block;"
                v-model="status"
              >
                <option value="">{{ $t('common.please_select') }}</option>
                <option value="1">{{ $t('status.active') }}</option>
                <option value="0">{{ $t('status.inactive') }}</option>
              </select>
            </div>
            <div class="pull-left m-r-xs">
              <label
                class="form-control-label p-b-0"
                :class="{'text-blue': query.balance_lte || query.balance_gte}"
              >{{ $t('common.amount') }}
              </label>
              <div style="display: block;">
                <input
                  type="number"
                  v-model="query.balance_gte"
                  class="form-control inline w-sm"
                  :max="query.balance_lte"
                  :placeholder="$t('common.min_amount')"
                  @input="search"
                />
                ~
                <input
                  type="number"
                  v-model="query.balance_lte"
                  class="form-control inline w-sm"
                  :min="query.balance_gte"
                  :placeholder="$t('common.max_amount')"
                  @input="search"
                />
              </div>
            </div>
          </div>
          <div class="row m-t-xs m-l-xs m-r-xs">
            <div class="pull-left m-r-xs">
              <label
                class="form-control-label p-b-0"
                :class="{'text-blue': userInfo_q}"
              >{{ $t('member.contact_info') }}
              </label>
              <div style="display: block;">
                <select
                  class="pull-left form-control w-sm c-select no-b-r"
                  v-model="userInfoSelect"
                >
                  <option value="">{{ $t('common.please_select') }}</option>
                  <option value="0">{{ $t('common.phone') }}</option>
                  <option value="1">{{ $t('common.email') }}</option>
                  <option value="2">{{ $t('common.qq') }}</option>
                  <option value="3">{{ $t('common.wechat') }}</option>
                </select>
                <input
                  v-model.trim="userInfo_q"
                  class="form-control w-sm"
                  style="width: 122px;"
                  :disabled="!userInfoSelect"
                />
              </div>
            </div>
            <div class="pull-left m-r-xs">
              <label
                class="form-control-label p-b-0"
                :class="{'text-blue': created_at && (created_at[0] || created_at[1])}"
              >{{ $t('member.created_at') }}
              </label>
              <date-picker
                width='244'
                style="display: block;"
                :not-after="today"
                :shortcuts="shortcuts"
                :inputClass="'input form-control'"
                type="date"
                v-model="created_at"
                format="yyyy-MM-dd"
                range
              />
            </div>
            <div class="pull-left m-r-xs">
              <label
                class="form-control-label p-b-0"
                :class="{'text-blue': query.register_ip}"
              >{{ $t('member.created_ip') }}
              </label>
              <input
                v-model.trim="query.register_ip"
                class="form-control w-sm"
                style="width: 244px;"
                :placeholder="$t('member.created_ip')"
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
              <span>{{ $t('action.clear') }}</span>
            </button>
          </div>
        </div>
      </div>
    </form>
    <div class="row" v-if="pageSelected === 'allMember'">
      <div class="col-xs-12">
        <div class="pull-right" v-if="$root.permissions.includes('export_member_report')">
          <a :href="href" :getReport="getReport" v-if="queryset.length">
            <span>
              {{ $t('action.download') }}
              <i class="material-icons">&#xe2c4;</i>
            </span>
          </a>
          <span disabled v-else>
            {{ $t('action.download') }}
            <i class="material-icons">&#xe2c4;</i>
          </span>
        </div>
      </div>
    </div>
    <div class="box m-t-xs" v-if="queryset.length > 0">
      <table st-table="rowCollectionBasic" class="table table-striped b-t" v-if="pageSelected == 'onlineMember'">
        <thead>
          <tr class="text-center">
            <th width="6%" class="text-center">{{ $t('common.login_status') }}</th>
            <th width="6%">{{ $t('member.account_type') }}</th>
            <th width="7%">{{ $t('member.account') }}</th>
            <th width="10%">{{ $t('common.real_name') }}</th>
            <th width="15%">{{ $t('member.last_login') }}</th>
            <th width="15%">{{ $t('member.loggedin_infos') }}</th>
            <th width="10%">{{ $t('member.login_platform') }}</th>
            <th width="15%">{{ $t('member.area') }}</th>
            <th width="10%">{{ $t('member.agent') }}</th>
            <th width="12%" class="text-center">{{ $t('member.level') }}</th>
            <th width="5%">{{ $t('member.balance') }}</th>
          </tr>
        </thead>
        <tbody v-if="queryset.length > 0">
          <tr v-for="member in queryset" :key="member.id">
            <td>
              <div class="circle" style="font-size: 25px; text-align: center; color:#42b72a;" v-if="member.is_logged_in==true">&#x25CF;</div>
              <div class="circle" style="font-size: 25px; text-align: center; color:#d3d3d3;" v-else>&#x25CF;</div>
            </td>
            <td>
              <span v-if="member.account_type === 1">{{ $t('member.real_account') }}</span>
              <span v-else>{{ $t('member.trial_account') }}</span>
            </td>
            <td>
              <router-link :to="'/member/' + member.id" v-if="member.account_type === 1">{{ member.username }}</router-link>
              <span v-else>{{ $t('member.visitor') }}</span>
              <br/>
              <span class="label success" v-if="member.status===1">{{ $t('status.active') }}</span>
              <span class="label" v-else>{{ $t('status.inactive') }}</span>
            </td>
            <td>
              <div v-if="member.account_type === 1">
                {{ member.real_name || '-' }}
                <div v-if="member.realname_repeated">
                  <span class="label danger">{{ $t('common.repeat') }}</span>
                </div>
              </div>
              <span v-else>-</span>
            </td>
            <td>
              <span v-if="member.last_login">{{ member.last_login.login_at | moment("YYYY-MM-DD HH:mm") }}</span>
              <span v-else>-</span>
            </td>
            <td>
              <span>{{ member.loggedin_domain || '-' }}</span>
              <br/>
              <span class="text-muted">{{ member.loggedin_ip || '-' }}</span>
            </td>
            <td>
              <span v-if="member.last_login">{{ member.last_login.platform }}</span>
              <span v-else>-</span>
            </td>
            <td>
              <div v-if="member.last_login">{{ member.last_login.address.country }} {{ member.last_login.address.region }} {{ member.last_login.address.city }}</div>
              <div v-else>-</div>
            </td>

            <td v-if="member.agent.name">
              <span>{{ member.agent.name }}</span>
            </td>
            <td class="text-center">
              <router-link v-if="member.level && member.account_type === 1" :to="'/level/' + member.level.id">{{ member.level.name }}</router-link>
              <span v-else>-</span>
            </td>
            <td><div v-if="member.balance">{{ member.balance.balance | currency('￥') }}</div></td>
          </tr>
        </tbody>
      </table>
      <table st-table="rowCollectionBasic" class="table table-striped b-t" v-else>
        <thead>
          <tr>
            <th width="5%" class="text-center">{{ $t('common.login_status') }}</th>
            <th>{{ $t('member.account') }}</th>
            <th>{{ $t('common.real_name') }}</th>
            <th>{{ $t('member.created_ip') }}</th>
            <th>{{ $t('member.last_login') }}</th>
            <th>{{ $t('member.agent') }}</th>
            <th width="5%">{{ $t('member.level') }}</th>
            <th class="text-right" width="7%">{{ $t('betrecord.total_valid_bet_amount') }}</th>
            <th class="text-right">{{ $t('betrecord.total_bet_amount') }}</th>
            <th class="text-right">{{ `${$t('common.member')}${$t('betrecord.win')}${$t('betrecord.lose')}` }}</th>
            <th class="text-right">{{ $t('member.balance') }}</th>
          </tr>
        </thead>
        <tbody v-if="queryset.length > 0">
          <tr v-for="member in queryset" :key="member.id">
            <td>
              <div class="circle" style="font-size: 25px; text-align: center; color:#42b72a;" v-if="member.is_logged_in==true">&#x25CF;</div>
              <div class="circle" style="font-size: 25px; text-align: center; color:#d3d3d3;" v-else>&#x25CF;</div>
            </td>
            <td>
              <router-link :to="'/member/' + member.id">{{ member.username }}</router-link>
              <br/>
              <span class="label success" v-if="member.status === 1">{{ $t('status.active') }}</span>
              <span class="label" v-else>{{ $t('status.inactive') }}</span>
            </td>
            <td>
              {{ member.real_name || '-' }}
              <div v-if="member.realname_repeated">
                <span class="label danger">{{ $t('common.repeat') }}</span>
              </div>
            </td>
            <td>
            <div>{{ member.register_ip || '-' }}
              <div><span class="label danger" v-if="member.ip_repeated">{{ $t('common.repeat') }}</span></div>
            </div>
            </td>
            <td>
              <span v-if="member.last_login">{{ member.last_login.login_at | moment("YYYY-MM-DD HH:mm") }}</span>
              <span v-else>-</span>
            </td>
            <td v-if="member.agent.name">
              <span>{{ member.agent.name }}</span>
            </td>
            <td>
              <router-link v-if="member.level" :to="'/level/' + member.level.id">{{ member.level.name }}</router-link>
            </td>
            <td class="text-right">{{ member.total_betrecords }} 笔</td>
            <td class="text-right">{{ member.total_amount | currency('￥') }}</td>
            <td class="text-right">
              <span class="text-success">{{ $t('betrecord.win') }}: </span>
              <router-link :to="'/report/betrecord/history?member=' + member.username + '&status=win&created_at_1=' + today">{{ member.total_gain | currency('￥') }}</router-link><br/>
              <span class="text-danger">{{ $t('betrecord.lose') }}: </span>
              <router-link :to="'/report/betrecord/history?member=' + member.username + '&status=lose&created_at_1=' + today">{{ member.total_loss | currency('￥') }}</router-link>
            </td>
            <td class="text-right">
              <div v-if="member.balance">{{ member.balance.balance | currency('￥') }}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="row m-b-lg">
      <pulling
        :queryset="queryset"
        :query="query"
        :extra="extra"
        @query-data="queryData"
        @query-param="queryParam"
        @export-query="exportQuery"
        :api="memberApi"
        ref="pulling"
      />
    </div>
	</div>
</template>

<script>
import DatePicker from 'vue2-datepicker'
import api from '../../../api'
import pulling from '../../../components/pulling'
import VueCookie from 'vue-cookie'
import date from '../../../utils/date'
import _ from 'lodash'
import $ from '../../../utils/util'

export default {
    data () {
        return {
            memberApi: api.member,
            queryset: [],
            query: {},
            created_at: ['', ''],
            extra: '',
            status: '',
            level: '',
            href: '',
            export_query: [],
            pageSelected: '',
            today: date.today[0],
            shortcuts: ['today', 'yesterday', 'this_week', 'this_month', 'last_month'].map(element => Object({
                text: this.$t(`common.${element}`),
                start: date[element][0],
                end: date[element][1]
            })),
            userInfos: [
                'phone',
                'email',
                'qq',
                'wechat'
            ],
            userInfoSelect: '',
            userInfo_q: '',
            loading: true
        }
    },
    created () {
        this.setQueryAll()
        this.rebase()
    },
    watch: {
        status (newObj) {
            this.query.status = newObj || ''
            this.submit()
        },
        '$route': {
            handler () {
                this.loading = true
                this.setQueryAll()
                this.queryset = []
                this.rebase()
            },
            deep: true
        },
        created_at (newObj) {
            [this.query.created_at_0, this.query.created_at_1] = [...newObj]
            this.submit()
        },
        userInfo_q (newObj) {
            this.setUserInfo()
        },
        userInfoSelect (newObj) {
            this.setUserInfo()
        }
    },
    computed: {
        getReport () {
            this.$refs.pulling.getExportQuery()
            this.href = `${api.report_member}?token=${VueCookie.get('access_token')}&report_flag=true&${this.export_query}`
            return this.queryset.length
        },
        isQueryEmpty () {
            return $.compareQuery(this.query, {})
        }
    },
    methods: {
        setQueryAll () {
            if (this.$route.path === '/online_member') {
                this.extra = `report_flag=True&logined=1`
                this.pageSelected = 'onlineMember'
            } else {
                this.extra = `report_flag=True&account_type=1`
                this.pageSelected = 'allMember'
            }
            if (this.$route.query.created_at_0 || this.$route.query.created_at_1) {
                this.created_at = [this.$route.query.created_at_0, this.$route.query.created_at_1]
            } else {
                this.created_at = [undefined, undefined]
            }
            this.userInfoSelect = this.userInfos.findIndex(element => this.$route.query[element + '_q']).toString()
            if (this.userInfoSelect !== '-1') {
                let key = this.userInfos[this.userInfoSelect]
                this.userInfo_q = this.$route.query[key + '_q']
            } else {
                this.userInfoSelect = '0'
                this.userInfo_q = ''
            }
            this.status = this.$route.query.status || ''
            this.query = Object.assign({}, this.$route.query)
        },
        levelSelect (val) {
            this.query.level = val
            this.submit()
        },
        queryData (queryset) {
            this.queryset = queryset
            this.loading = false
        },
        queryParam (query) {
            this.query = Object.assign(this.query, query)
        },
        exportQuery (expor) {
            this.export_query = expor
        },
        rebase () {
            this.$nextTick(() => {
                this.$refs.pulling.rebase()
            })
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
        refresh () {
            this.loading = true
            this.rebase()
        },
        setUserInfo () {
            let key = this.userInfos[this.userInfoSelect]
            this.userInfos.forEach(element => {
                this.query[element + '_q'] = element === key ? this.userInfo_q : ''
            })
            this.search()
        }
    },
    components: {
        DatePicker,
        level: require('../../../components/level'),
        pulling
    }
}
</script>

<style lang="sass" scoped>
</style>
