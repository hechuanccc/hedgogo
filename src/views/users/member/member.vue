<template>
  <div>
    <div class="m-l-xs row" v-if="pageSelected == 'all_members'">
      <div class="inline m-r-xs" v-if="$root.permissions.includes('add_new_member')">
        <router-link tag="button" class="md-btn w-sm blue pull-right" to="/member/add">{{$t('action.add_member')}}</router-link>
      </div>
      <div class="alert alert-danger" v-else>
        {{$t('common.errorPermission')}}
      </div>
    </div>
    <div class="row" v-else>
      <div class="loading text-center" v-if="loading"><i class='fa fa-spinner '></i>   <b class="">正在加载中...</b>
      </div>
      <button class="md-btn blue w-xs pull-right m-r" type="button" @click="refresh">{{$t('common.refresh')}}</button>
    </div>
    <form 
      class="form"
      v-on:submit.prevent="submit"
      v-show="pageSelected == 'all_members'"
    >
      <div class="box m-t-sm m-b-sm">
        <div class="box-body clearfix form-inline form-input-sm">
          <div class="row">
            <div class="col-xs-12">
              <input 
                type="text" 
                v-model="query.username_q" 
                class="form-control" 
                :placeholder="$t('member.account')"
              />
              <level 
                :level="level"
                @level-select="levelSelect"
                :placeholder="$t('member.level')"
              />
              <input 
                type="text"
                v-model="query.agent_q"
                class="form-control"
                :placeholder="$t('member.agent')"
              />
              <input 
                type="text"
                v-model="query.real_name_q"
                class="form-control"
                :placeholder="$t('common.real_name')"
              />
              <select class="form-control c-select w-sm" v-model="status">
                <option value="">{{$t('common.status')}}</option>
                <option value="1">{{$t('status.active')}}</option>
                <option value="0">{{$t('status.inactive')}}</option>
              </select>
              <select class="form-control w-sm c-select" v-model="member_logged_in">
                <option value="">{{$t('common.login_status')}}</option>
                <option value="1">{{$t('common.logged_in')}}</option>
                <option value="0">{{$t('common.all')}}</option>
              </select>
              <div class="pull-right">
                <button class="md-btn grey-100 m-r-xs" type="button" @click="showAll=!showAll">
                  <span v-if="!showAll">{{$t('member.more_options')}} <i class="fa fa-angle-double-down"></i></span>
                  <span v-else>{{$t('member.collapse_options')}} <i class="fa fa-angle-double-up"></i></span>
                </button>
                <button type="submit" class="md-btn w-xs blue">{{$t('common.search')}}</button>
              </div>
            </div>
          </div>
          <div class="row m-t" v-show="showAll">
            <div class="col-xs-12">
              <select class="form-control w-sm c-select inline" v-model="selected" @change="filterUserContactInfo">
                <option value="0">{{$t('common.please_select')}}</option>
                <option value="1">{{$t('common.phone')}}</option>
                <option value="2">{{$t('common.email')}}</option>
                <option value="3">{{$t('common.qq')}}</option>
                <option value="4">{{$t('common.wechat')}}</option>
              </select>
              <input v-show="selected == '0' || selected == '-1'" type="text" class="form-control inline" :disabled="selected == '0'"/>
              <input v-if="selected == '1'" type="text" v-model="query.phone_q" class="form-control w-sm" v-bind:placeholder="$t('common.input') + ' ' + $t('common.phone')"/>
              <input v-if="selected == '2'" type="text" v-model="query.email_q" class="form-control w-sm" v-bind:placeholder="$t('common.input') + ' ' + $t('common.email')"/>
              <input v-if="selected == '3'" type="text" v-model="query.qq_q" class="form-control w-sm" v-bind:placeholder="$t('common.input') + ' ' + $t('common.qq')"/>
              <input v-if="selected == '4'" type="text" v-model="query.wechat_q" class="form-control w-sm " v-bind:placeholder="$t('common.input') + ' ' + $t('common.wechat')"/>
              <input type="text" v-model="query.register_ip" class="form-control w-sm " v-bind:placeholder="$t('member.created_ip')"/>
              <input type="text" v-model="query.balance_gte" class="form-control inline w-sm" v-bind:placeholder="$t('common.min_amount')"/> <span>~</span>
              <input type="text" v-model="query.balance_lte" class="form-control inline w-sm" v-bind:placeholder="$t('common.max_amount')"/>
              <date-picker width='140' v-model="created_at_0" v-bind:placeholder="$t('member.created_at')"></date-picker>
              <span>~</span>
              <date-picker width='140' v-model="created_at_1" v-bind:placeholder="$t('member.created_at')"></date-picker>
              <button class="md-btn w-xs grey-400 pull-right" type="button" @click="clearall">{{$t('action.clear_all')}}</button>
            </div>
          </div>
        </div>
      </div>
    </form>
    <div class="row m-t-md" v-if="pageSelected === 'all_members'">
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
      <table st-table="rowCollectionBasic" class="table table-striped b-t" v-if="pageSelected == 'online_member'">
        <thead>
          <tr >
            <th class="text-center">{{$t('common.login_status')}}</th>
            <th>{{$t('member.account_type')}}</th>
            <th>{{$t('member.account')}}</th>
            <th>{{$t('common.real_name')}}</th>
            <th>{{$t('member.last_login')}}</th>
            <th>{{$t('member.loggedin_domain')}}</th>
            <th>{{$t('member.loggedin_ip')}}</th>
            <th>{{$t('member.login_platform')}}</th>
            <th>{{$t('member.area')}}</th>
            <th>{{$t('member.agent')}}</th>
            <th>{{$t('member.level')}}</th>
            <th>{{$t('member.status')}}</th>
            <th>{{$t('member.balance')}}</th>
          </tr>
        </thead>
        <tbody v-if="queryset.length > 0">
          <tr v-for="member in queryset" :key="member.id">
            <td>
              <div class="circle" style="font-size: 25px; text-align: center; color:#42b72a;" v-if="member.is_logged_in==true">&#x25CF;</div>
              <div class="circle" style="font-size: 25px; text-align: center; color:#d3d3d3;" v-else>&#x25CF;</div>
            </td>
            <td>
              <div v-if="member.account_type===1">{{$t('member.real_account')}}</div>
              <div v-else>{{$t('member.trial_account')}}</div>
            </td>
            <td>
              <router-link :to="'/member/' + member.id" v-if="member.account_type===1">{{member.username}}</router-link>
              <span v-else>{{ $t('member.visitor') }}</span>
            </td>
            <td>
              {{member.real_name || '-'}}
              <div v-if="member.realname_repeated">
                <span class="label danger">{{$t('common.repeat')}}</span>
              </div>
            </td>
            <td>
              <span v-if="member.last_login">{{member.last_login.login_at | moment("YYYY-MM-DD HH:mm")}}</span>
              <span v-else>-</span>
            </td>
            <td>
              <div>{{member.loggedin_domain || '-'}}</div>
            </td>
            <td>
              <div>{{member.loggedin_ip || '-'}}</div>
            </td>
            <td>
              <span v-if="member.last_login">{{member.last_login.platform}}</span>
              <span v-else>-</span>
            </td>
            <td>
              <div v-if="member.last_login">{{member.last_login.address.country}} {{member.last_login.address.region}} {{member.last_login.address.city}}</div>
              <div v-else>-</div>
            </td>

            <td v-if="member.agent.name">
              <span>{{member.agent.name}}</span>
            </td>
            <td>
              <router-link v-if="member.level" :to="'/level/' + member.level.id">{{member.level.name}}</router-link>
            </td>
            <td>
              <span class="label success" v-if="member.status==1">{{$t('status.active')}}</span>
              <span class="label" v-else>{{$t('status.inactive')}}</span>
            </td>
            <td><div v-if="member.balance">{{member.balance.balance | currency('￥')}}</div></td>
          </tr>
        </tbody>
      </table>
      <table st-table="rowCollectionBasic" class="table table-striped b-t" v-else>
        <thead>
          <tr>
            <th class="text-center">{{$t('common.login_status')}}</th>
            <th>{{$t('member.account')}}</th>
            <th>{{$t('common.real_name')}}</th>
            <th>{{$t('member.created_ip')}}</th>
            <th>{{$t('member.last_login')}}</th>
            <th>{{$t('member.agent')}}</th>
            <th>{{$t('member.level')}}</th>
            <th>{{$t('member.status')}}</th>
            <th>{{$t('betrecord.total_valid_bet_amount')}}</th>
            <th>{{$t('betrecord.total_bet_amount')}}</th>
            <th>{{$t('common.member') + $t('betrecord.win') + $t('betrecord.lose')}}</th>
            <th>{{$t('member.balance')}}</th>
          </tr>
        </thead>
        <tbody v-if="queryset.length > 0">
          <tr v-for="member in queryset">
            <td>
              <div class="circle" style="font-size: 25px; text-align: center; color:#42b72a;" v-if="member.is_logged_in==true">&#x25CF;</div>
              <div class="circle" style="font-size: 25px; text-align: center; color:#d3d3d3;" v-else>&#x25CF;</div>
            </td>
            <td>
              <router-link :to="'/member/' + member.id">{{member.username}}</router-link>
            </td>
            <td>
              {{member.real_name || '-'}}
              <div v-if="member.realname_repeated">
                <span class="label danger">{{$t('common.repeat')}}</span>
              </div>
            </td>
            <td>
            <div>{{member.register_ip || '-'}}
              <div><span class="label danger" v-if="member.ip_repeated">{{$t('common.repeat')}}</span></div>
            </div>
            </td>
            <td>
              <span v-if="member.last_login">{{member.last_login.login_at | moment("YYYY-MM-DD HH:mm")}}</span>
              <span v-else>-</span>
            </td>
            <td v-if="member.agent.name">
              <span>{{member.agent.name}}</span>
            </td>
            <td>
              <router-link v-if="member.level" :to="'/level/' + member.level.id">{{member.level.name}}</router-link>
            </td>
            <td>
              <span class="label success" v-if="member.status==1">{{$t('status.active')}}</span>
              <span class="label" v-else>{{$t('status.inactive')}}</span>
            </td>
            <td>{{member.total_amount | currency('￥')}}</td>
            <td>{{member.total_betrecords | currency('￥')}}</td>
            <td>
              <span class="text-success">{{$t('betrecord.win')}}: </span>
              <router-link :to="'/report/betrecord/history?member=' + member.username + '&status=win&created_at_1=' + today">{{member.total_gain | currency('￥')}}</router-link> <br/>
              <span class="text-danger">{{$t('betrecord.lose')}}: </span>
              <router-link :to="'/report/betrecord/history?member=' + member.username + '&status=lose&created_at_1=' + today">{{member.total_loss | currency('￥')}}</router-link>
            </td>
            <td><div v-if="member.balance">{{member.balance.balance | currency('￥')}}</div></td>
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
import Vue from 'vue'

const format = 'YYYY-MM-DD'
export default {
    data () {
        return {
            created_at_0: '',
            created_at_1: '',
            showAll: false,
            memberApi: api.member,
            queryset: [],
            query: {
                time1: '',
                username_q: '',
                created_at_0: '',
                created_at_1: '',
                balance_gte: '',
                balance_lte: '',
                status: '',
                return_settings: '',
                agent_q: '',
                real_name_q: '',
                phone_q: '',
                email_q: '',
                qq_q: '',
                wechat_q: '',
                logined: '',
                register_ip: '',
                level: '',
                report_flag: true,
                is_logged_in: '',
                account_type: '1'
            },
            extra: '',
            status: '',
            level: '',
            selected: '0',
            filter: {},
            href: '',
            member_logged_in: '',
            loading: false,
            export_query: [],
            today: Vue.moment().format(format),
            pageSelected: ''
        }
    },
    created () {
        this.getPageAccessed()
        this.$nextTick(() => {
            this.$refs.pulling.rebase()
            this.$refs.pulling.getExportQuery()
        })
    },
    watch: {
        status: function (newObj, old) {
            if (newObj === '0') {
                this.query.status = ''
            } else {
                this.query.status = newObj
            }
        },
        member_logged_in: function (newObj, old) {
            if (newObj === '') {
                this.query.logined = ''
            } else {
                this.query.logined = newObj
            }
        },
        '$route': 'nextTickFetch',
        created_at_0 (newObj, old) {
            this.query.created_at_0 = newObj
        },
        created_at_1 (newObj, old) {
            this.query.created_at_1 = newObj
        }
    },
    computed: {
        getReport () {
            this.href = `${api.report_member}?token=${VueCookie.get('access_token')}&report_flag=true&${this.export_query}`
            return this.queryset.length
        }
    },
    methods: {
        nextTickFetch () {
            this.queryset = []
            this.getPageAccessed()
            setTimeout(() => {
                this.$refs.pulling.rebase()
                this.$refs.pulling.getExportQuery()
            }, 100)
        },
        levelSelect (val) {
            this.query.level = val
            this.level = val
        },
        queryData (queryset) {
            this.query = Object.assign({}, this.filter)
            this.created_at_0 = ''
            this.created_at_1 = ''
            if (this.query.created_at_0) {
                this.created_at_0 = this.query.created_at_0
            }
            if (this.query.created_at_1) {
                this.created_at_1 = this.query.created_at_1
            }
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
        clearall: function () {
            this.query = {}
            this.status = ''
            this.member_logged_in = ''
            this.created_at_0 = ''
            this.created_at_1 = ''
            this.level = 0
            this.selected = '0'
            this.$router.push({
                path: this.$route.path + '?report_flag=true'
            })
        },
        refresh: function () {
            this.loading = true
            this.$router.push({
                path: this.$route.path + '?report_flag=true'
            })
            this.$router.push({
                path: this.$route.path + '?logined=1'
            })
            this.loading = false
        },
        filterUserContactInfo () {
            this.query.phone_q = ''
            this.query.email_q = ''
            this.query.wechat_q = ''
            this.query.qq_q = ''
            switch (this.selected) {
            case '1':
                this.query.phone_q = this.query.phone_q
                break
            case '2':
                this.query.email_q = this.query.email_q
                break
            case '3':
                this.query.qq_q = this.query.qq_q
                break
            case '4':
                this.query.wechat_q = this.query.wechat_q
                break
            }
            this.$refs.pulling.submit()
        },
        getPageAccessed () {
            this.router_path = this.$route.path
            if (this.router_path === '/online_member') {
                this.extra = `report_flag=True&logined=1`
                this.pageSelected = 'online_member'
            } else {
                this.extra = `account_type=1`
                this.pageSelected = 'all_members'
            }
        }
    },
    components: {
        DatePicker,
        level: require('../../../components/level'),
        pulling
    }
}
</script>
