<template>
  <div>
    <div class="row" v-if="pageSelected === 'allMember'">
      <div class="col-md-6"  v-if="$root.permissions.includes('add_new_member')">
        <router-link
          tag="button"
          class="md-btn w-sm blue"
          to="/member/add"
        >{{ $t('title.member_add') }}
        </router-link>
      </div>
      <div class="col-md-6" v-if="$root.permissions.includes('export_member_report')">
        <a
          :href="href"
          :getReport="getReport"
          v-if="queryset.length"
          class="md-btn w-sm text-white-dk blue pull-right"
        >
          <span>
            {{ $t('system.download_report') }}
            <i class="fa fa-download"></i>
          </span>
        </a>
        <span class="pull-right m-t-sm m-r" disabled v-else>
          {{ $t('system.download_report') }}
          <i class="fa fa-download"></i>
        </span>
      </div>
    </div>
    <div class="row m-b m-r-xs m-l-xs m-b-sm" v-else>
      <label class="md-switch m-t-sm">
        <input type="checkbox" v-model="visitorFilter" class="has-value pull-right">
        <i class="blue"></i>
        <span class="pull-right p-t-xs">{{ $t('misc.filter_visitor') }}</span>
      </label>
      <button
        class="md-btn blue pull-right btn w-sm"
        type="button"
        @click="refresh"
      >
        <span>
          <i class="fa fa-spin fa-spinner" v-if="loading"></i>
          {{ $t('system.refresh') }}
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
              >{{ $t('user.username') }}
              </label>
              <input 
                v-model.trim="query.username_q"
                class="form-control w-sm"
                :placeholder="$t('user.username')"
                @input="search"
                :disabled="mode !== 'normal'"
              />
            </div>
            <div class="pull-left m-r-xs">
              <label
                class="form-control-label p-b-0"
                :class="{'text-blue': query.real_name_q}"
              >{{ $t('user.real_name') }}
              </label>
              <input 
                v-model.trim="query.real_name_q"
                class="form-control w-sm"
                :placeholder="$t('user.real_name')"
                @input="search"
                :disabled="mode !== 'normal'"
              />
            </div>
            <div class="pull-left m-r-xs">
              <label
                class="form-control-label p-b-0"
                :class="{'text-blue': query.agent_q}"
              >{{ $t('dic.agent') }}
              </label>
              <input 
                v-model.trim="query.agent_q"
                class="form-control w-sm"
                :placeholder="$t('dic.agent')"
                @input="search"
                :disabled="mode !== 'normal'"
              />
            </div>
            <div class="pull-left m-r-xs">
              <label
                  class="form-control-label p-b-0"
                  :class="{'text-blue': query.level}"
              >{{ $t('dic.member_level') }}
              </label>
              <selector-member-level
                :level="query.level"
                @level-select="levelSelect"
                style="display: block;"
                :disabled="mode !== 'normal'"
              />
            </div>
            <div class="pull-left m-r-xs">
              <label
                  class="form-control-label p-b-0"
                  :class="{'text-blue': status}"
              >{{ $t('dic.status') }}
              </label>
              <select
                class="form-control c-select w-sm"
                style="display: block;"
                v-model="status"
                :disabled="mode !== 'normal'"
              >
                <option value="">{{ $t('system.please_select') }}</option>
                <option value="1">{{ $t('status.active') }}</option>
                <option value="0">{{ $t('status.inactive') }}</option>
              </select>
            </div>
            <div class="pull-left m-r-xs">
              <label
                class="form-control-label p-b-0"
                :class="{'text-blue': query.balance_lte || query.balance_gte}"
              >{{ $t('dic.amount') }}
              </label>
              <div style="display: block;">
                <input
                  type="number"
                  v-model="query.balance_gte"
                  class="form-control inline w-sm"
                  :max="query.balance_lte"
                  :placeholder="$t('misc.min_amount')"
                  @input="search"
                  :disabled="mode !== 'normal'"
                />
                ~
                <input
                  type="number"
                  v-model="query.balance_lte"
                  class="form-control inline w-sm"
                  :min="query.balance_gte"
                  :placeholder="$t('misc.max_amount')"
                  @input="search"
                  :disabled="mode !== 'normal'"
                />
              </div>
            </div>
            <div class="pull-left m-r-xs">
              <label
                class="form-control-label p-b-0"
                :class="{'text-blue': userInfo_q}"
              >{{ $t('user.contact_info') }}
              </label>
              <div style="display: block;">
                <select
                  class="pull-left form-control w-sm c-select no-b-r"
                  v-model="userInfoSelect"
                  :disabled="mode !== 'normal'"
                >
                  <option value="">{{ $t('system.please_select') }}</option>
                  <option value="0">{{ $t('user.phone') }}</option>
                  <option value="1">{{ $t('user.email') }}</option>
                  <option value="2">{{ $t('user.qq') }}</option>
                  <option value="3">{{ $t('user.wechat') }}</option>
                </select>
                <input
                  v-model.trim="userInfo_q"
                  class="form-control w-sm"
                  style="width: 122px;"
                  :disabled="!userInfoSelect || mode !== 'normal'"
                />
              </div>
            </div>
          </div>
          <div class="row m-t-xs m-l-xs m-r-xs">
            <div class="pull-left m-r-xs">
              <label
                class="form-control-label p-b-0"
                :class="{'text-blue': created_at && (created_at[0] || created_at[1])}"
              >{{ $t('time.registered_at') }}
              </label>
              <el-date-picker
                style="display: block;"
                v-model="created_at"
                size="mini"
                type="daterange"
                unlink-panels
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="{shortcuts}"
                :disabled="mode !== 'normal'"
              />
            </div>
            <div class="pull-left m-r-xs">
              <label
                class="form-control-label p-b-0"
                :class="{'text-blue': query.register_ip}"
              >
                {{ $t('user.registered_ip') }}
                <span class="text-muted">({{ $t('system.accurate_search') }})</span>
              </label>
              <input
                v-model.trim="query.register_ip"
                class="form-control w-sm"
                style="width: 244px;"
                :placeholder="$t('user.registered_ip')"
                @input="search"
                :disabled="mode !== 'normal'"
              />
            </div>
            <div class="pull-left m-r-xs">
              <label
                class="form-control-label p-b-0"
                :class="{'text-blue': query.last_login_ip}"
              >
                {{ $t('user.loggedin_ip_history') }}
                <span class="text-muted">({{ $t('system.accurate_search') }})</span>
              </label>
              <input
                v-model.trim="query.last_login_ip"
                class="form-control w-sm"
                style="width: 244px;"
                :placeholder="$t('user.loggedin_ip_history')"
                @input="search"
              />
            </div>
            <div
              class="pull-left w-xs m-r-xs"
              style="height: 60px; position: relative;"
              v-if="mode === 'ban'"
            >
              <button
                class="md-btn w-xs btn danger"
                style="position: absolute; bottom: 0;"
                type="button"
                :disabled="!queryset.length"
                @click="mode = 'confirm-ban'"
              >
                <i class="fa fa-ban"></i> 
                <span>{{ $t('system.batch_ban') }}</span>
              </button>
            </div>
            <div
              class="pull-left w-sm m-r-xs"
              style="height: 60px; position: relative;"
              v-if="mode === 'confirm-ban'"
            >
              <button
                class="md-btn w-sm btn blue"
                style="position: absolute; bottom: 0;"
                type="button"
                @click="batchBanHandler"
              >
                <span v-if="!batchBanLoading">{{ $t('system_msg.confirm_action_object', {
                  action: $t('dic.ban')
                }) }}</span>
                <i class="fa fa-spin fa-spinner" v-else></i>
              </button>
            </div>
            <div
              class="pull-left w-xs m-r-xs"
              style="height: 60px; position: relative;"
              v-if="mode === 'confirm-ban'"
            >
              <button
                class="md-btn w-xs btn"
                style="position: absolute; bottom: 0;"
                type="button"
                @click="mode = 'ban'"
              >
                {{ $t('dic.cancel') }}
              </button>
            </div>
            <button
              class="md-btn w-xs pull-right btn m-t-md"
              type="button"
              @click="clearAll"
              :disabled="isQueryEmpty"
            >
              <i v-if="loading" class="fa fa-spin fa-spinner"></i> 
              <i v-else class="fa fa-trash-o"></i> 
              <span>{{ $t('system.reset_condition') }}</span>
            </button>
          </div>
        </div>
      </div>
    </form>
    
    <div class="box" v-if="queryset.length > 0">
      <table st-table="rowCollectionBasic" class="table table-striped b-t" v-if="pageSelected == 'onlineMember'">
        <thead>
          <tr class="text-center">
            <th>{{ $t('user.account') }}</th>
            <th>{{ $t('user.real_name') }}</th>
            <th>{{ $t('user.last_login') }}</th>
            <th>{{ $t('user.loggedin_info') }}</th>
            <th>{{ $t('dic.platform') }}</th>
            <th>{{ $t('misc.area') }}</th>
            <th>{{ $t('dic.agent') }}</th>
            <th class="text-center">{{ $t('dic.member_level') }}</th>
            <th>{{ $t('dic.balance') }}</th>
          </tr>
        </thead>
        <tbody v-if="queryset.length > 0">
          <tr v-for="member in queryset" :key="member.id">
            <td>
              <i class="text-success fa fa-circle m-r-xs" v-if="member.is_logged_in==true"></i>
              <router-link :to="'/member/' + member.id" v-if="member.account_type !== 0">{{ member.username }}</router-link>
              <span v-else>{{ $t('user.visitor') }}</span>
              <br/>
              <span class="label red m-l" v-if="member.status!==1">{{ $t('status.inactive') }}</span>
            </td>
            <td>
              <div v-if="member.account_type !== 0">
                {{ member.real_name || '-' }}
                <div v-if="member.realname_repeated">
                  <span class="label danger">{{ $t('misc.repeated') }}</span>
                </div>
              </div>
              <span v-else>-</span>
            </td>
            <td>
              <span v-if="member.last_login">{{ member.last_login.login_at | moment('YYYY-MM-DD HH:mm') }}</span>
              <span v-else>-</span>
            </td>
            <td>
              <span>{{ member.loggedin_domain || '-' }}</span>
              <br/>
              <span class="text-muted">{{ member.loggedin_ip || '-' }}</span>
            </td>
            <td>
              <span v-if="member.last_login">{{ $t('dic.' + member.last_login.platform.toLowerCase()) }}</span>
              <span v-else>-</span>
            </td>
            <td>
              <div v-if="member.last_login">{{ member.last_login.address.country }} {{ member.last_login.address.region }} {{ member.last_login.address.city }}</div>
              <div v-else>-</div>
            </td>

            <td v-if="member.agent.name">
              <router-link :to="'/agent/' + member.agent.id">{{ member.agent.name }}</router-link>
            </td>
            <td class="text-center">
              <router-link v-if="member.level && member.account_type !== 0" :to="'/level/' + member.level.id">{{ member.level.name }}</router-link>
              <span v-else>-</span>
            </td>
            <td><div v-if="member.balance" class="text-success">{{ member.balance.balance | currency('￥') }}</div></td>
          </tr>
        </tbody>
      </table>
      <table st-table="rowCollectionBasic" class="table table-striped b-t" v-else>
        <thead>
          <tr>
            <th>{{ $t('user.account') }}</th>
            <th>{{ $t('user.real_name') }}</th>
            <th>{{ $t('user.registered_ip') }}&nbsp;/&nbsp;{{ $t('dic.time') }}</th>
            <th>{{ $t('user.last_login') }}</th>
            <th>{{ $t('dic.agent') }}</th>
            <th class="text-right">{{ $t('finance.deposit_total') }}</th>
            <th class="text-right">{{ $t('finance.withdraw_total') }}</th>
            <th class="text-right" width="7%">{{ $t('bet.valid_bet') }}</th>
            <th class="text-right">{{ `${$t('dic.member')}${$t('bet.win')}${$t('bet.lose')}` }}</th>
            <th class="text-right">{{ $t('dic.balance') }}</th>
          </tr>
        </thead>
        <tbody v-if="queryset.length > 0">
          <tr v-for="member in queryset" :key="member.id">
            <td>
              <i class="fa fa-circle text-success m-r-xs" v-if="member.is_logged_in==true"></i>
              <i class="fa fa-circle text-grey-400 m-r-xs" v-else></i>
              <router-link :to="'/member/' + member.id" class="m-b-0">{{ member.username }}</router-link>
              <span class="label red m-l" v-if="member.status !== 1">{{ $t('status.inactive') }}</span>
              <br/>
              <router-link v-if="member.level" :to="'/level/' + member.level.id" class="text-xs m-l">{{ member.level.name }}</router-link>
            </td>
            <td>
              {{ member.real_name || '-' }}
              <div v-if="member.realname_repeated">
                <span class="label danger">{{ $t('misc.repeated') }}</span>
              </div>
            </td>
            <td>
            <div>
              <span>{{ member.register_ip || '-' }}</span>
              <span class="label danger" v-if="member.ip_repeated">{{ $t('misc.repeated') }}</span>
              <br/>
              <span class="text-muted text-xs">{{ member.created_at | moment('YYYY-MM-DD HH:mm') }}</span>
            </div>
            </td>
            <td>
              <p class="m-b-0" v-if="member.last_login">
                <span>{{ member.last_login.ipaddr || '-' }}</span>
                <br/>
                <span class="text-sm text-muted">{{ member.last_login.login_at | moment('YYYY-MM-DD HH:mm') }}</span>
              </p>
              <span v-else>-</span>
            </td>
            <td v-if="member.agent.name">
              <router-link :to="'/agent/' + member.agent.id">{{ member.agent.name }}</router-link>
            </td>
            <td class="text-right">
              {{ member.total_deposit | currency('￥') }}
            </td>
            <td class="text-right">
              {{ member.total_withdraw | currency('￥') }}
            </td>
            <td class="text-right">
              <p class="m-b-0">{{ member.total_betrecords }} 笔</p>
              <p class="m-b-xs">{{ member.total_amount | currency('￥') }}</p>
            </td>
            <td class="text-right">
              <span class="text-success">{{ $t('bet.win') }}: </span>
              <router-link :to="`/report/betrecord/?member=${member.username}&status=win&created_at_1=${today}`">{{ member.total_gain | currency('￥') }}</router-link><br/>
              <span class="text-danger">{{ $t('bet.lose') }}: </span>
              <router-link :to="`/report/betrecord/?member=${member.username}&status=lose&created_at_1=${today}`">{{ member.total_loss | currency('￥') }}</router-link>
            </td>
            <td class="text-right">
              <div v-if="member.balance" class="text-success">{{ member.balance.balance | currency('￥') }}</div>
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
        :api="url.user.member"
        ref="pulling"
      />
    </div>
	</div>
</template>

<script>
import VueCookie from 'vue-cookie'
import _ from 'lodash'
import url from '../../service/url'
import { batchBanMember } from '../../service'
import Pulling from '../../components/Pulling'
import SelectorMemberLevel from '../../components/SelectorMemberLevel'
import date from '../../utils/date'
import $ from '../../utils/util'

export default {
    data () {
        return {
            url,
            queryset: [],
            query: {},
            created_at: ['', ''],
            extra: '',
            status: '',
            level: '',
            href: '',
            export_query: [],
            pageSelected: '',
            mode: 'normal',
            today: date.today[0],
            shortcuts: ['today', 'yesterday', 'this_week', 'this_month', 'last_month'].map(element => Object({
                text: this.$t(`time.${element}`),
                onClick (p) {
                    p.$emit('pick', date[element])
                }
            })),
            userInfos: [
                'phone',
                'email',
                'qq',
                'wechat'
            ],
            userInfoSelect: '',
            userInfo_q: '',
            visitorFilter: true,
            loading: true,
            batchBanLoading: false
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
            [this.query.created_at_0, this.query.created_at_1] = [...(newObj || [])]
            this.submit()
        },
        userInfo_q (newObj) {
            this.setUserInfo()
        },
        userInfoSelect (newObj) {
            this.setUserInfo()
        },
        visitorFilter (newObj) {
            if (newObj) {
                this.extra = `logined=1&account_type=1,2`
            } else {
                this.extra = `logined=1`
            }
            this.rebase()
        },
        'query.last_login_ip' (newObj) {
            if (newObj) {
                this.query = Object.assign({}, {
                    last_login_ip: newObj
                })
                this.mode = 'ban'
            } else {
                this.mode = 'normal'
            }
        }
    },
    computed: {
        getReport () {
            this.$refs.pulling.getExportQuery()
            this.href = `${url.report.member}?token=${VueCookie.get('access_token')}&report_flag=true&${this.export_query}`
            return this.queryset.length
        },
        isQueryEmpty () {
            return $.compareQuery(this.query, {})
        }
    },
    methods: {
        setQueryAll () {
            if (this.$route.path === '/online_member') {
                if (this.visitorFilter) {
                    this.extra = `logined=1&account_type=1,2`
                } else {
                    this.extra = `logined=1`
                }
                this.pageSelected = 'onlineMember'
            } else {
                this.extra = `account_type=1,2`
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
        },
        batchBanHandler () {
            if (!this.batchBanLoading && this.query.last_login_ip && this.queryset.length) {
                this.batchBanLoading = true
                batchBanMember(this.query.last_login_ip).then(data => {
                    $.notify({
                        message: this.$t('system.batch_ban') + this.$t('status.success')
                    })
                    this.refresh()
                    this.batchBanLoading = false
                }, error => {
                    $.notify({
                        message: error,
                        type: 'danger'
                    })
                    this.batchBanLoading = false
                })
            }
        }
    },
    components: {
        SelectorMemberLevel,
        Pulling
    }
}
</script>

<style lang="sass" scoped>
</style>
