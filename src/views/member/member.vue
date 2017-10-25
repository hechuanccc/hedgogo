<template>
    <div>
      <form class="form" v-on:submit.prevent="submit">
        <div class="box">
          <div class="box-body clearfix form-inline form-input-sm">
            <div class="row">
              <div class="col-xs-2">
                <label class="text-sm" >{{$t('member.account')}}</label>
                <input type="text" v-model="query.username_q" class="form-control" />
              </div>

              <div class="col-xs-2">
                <label class="text-sm" >{{$t('member.level')}}</label>
                <level :level="query.level" @level-select="levelSelect"></level>
              </div>

              <div class="col-xs-2">
                <label class="text-sm">{{$t('member.agent')}}</label>
                <input type="text" v-model="query.agent_q" class="form-control" />
              </div>

              <div class="col-xs-2">
                <label class="text-sm">{{$t('common.real_name')}}</label>
                <input type="text" v-model="query.real_name_q" class="form-control" />
              </div>
              <div class="col-xs-3">
                <div class="pull-right">
                  <button class="md-btn grey-100 m-r" type="button" @click="showAll=!showAll">
                    <span v-if="!showAll">{{$t('member.more_options')}} <i class="fa fa-angle-double-down"></i></span>
                    <span v-else>{{$t('member.collapse_options')}} <i class="fa fa-angle-double-up"></i></span>
                  </button>

                  <button type="submit" class="md-btn w-sm blue">{{$t('common.search')}}</button>
                </div>
              </div>
            </div>
            <div class="row m-t" v-show="showAll">
              <div class="col-xs-2">
                <label class="text-sm">{{$t('common.phone')}}</label>
                <input type="text" v-model="query.phone_q" class="form-control w-sm" />
              </div>

              <div class="col-xs-2">
                <label class="text-sm">{{$t('common.email')}}</label>
                <input type="text" v-model="query.email_q" class="form-control w-sm" />
              </div>
              <div class="col-xs-2">
                <label class="text-sm">{{$t('common.qq')}}</label>
                <input type="text" v-model="query.qq_q" class="form-control w-sm" />
              </div>
              <div class="col-xs-2">
                <label class="text-sm">{{$t('member.return_setting')}}</label>
                <returnsetting :returnsetting="query.return_settings" @myReturn="returnData"></returnsetting>
              </div>

              <div class="col-xs-2">
                <label class="text-sm">{{$t('common.wechat')}}</label>
                <input type="text" v-model="query.wechat_q" class="form-control w-sm " />
              </div>
              <div class="col-xs-2">
                <label class="text-sm">{{$t('member.created_ip')}}</label>
                <input type="text" v-model="query.register_ip" class="form-control w-sm " />
              </div>
            </div>
            <div class="row m-t" v-show="showAll">
              <div class="col-xs-2">
                <label class="text-sm">{{$t('common.login_status')}}</label>
                <select class="form-control c-select" v-model="query.logined">
                  <option value="">{{$t('common.please_select')}}</option>
                  <option value="1">{{$t('common.logged_in')}}</option>
                  <option value="0">{{$t('common.all')}}</option>
                </select>
              </div>

              <div class="col-xs-2">
                <label class="text-sm">{{$t('common.status')}}</label>
                <select class="form-control c-select w-sm" v-model="query.status">
                  <option value="">{{$t('common.please_select')}}</option>
                  <option value="1">{{$t('status.active')}}</option>
                  <option value="0">{{$t('status.inactive')}}</option>
                </select>
              </div>

              <div class="col-xs-4">
                <label class="text-sm">{{$t('member.balance')}}</label>
                <input type="text" v-model="query.balance_gte" class="form-control inline w-sm" /> <span>~</span>
                <input type="text" v-model="query.balance_lte" class="form-control inline w-sm" />
              </div>
              <div class="col-xs-4">
                <label class="text-sm">{{$t('member.created_at')}}</label>
                <date-picker width='140' v-model="created_at_0"></date-picker>
                <span>~</span>
                <date-picker width='140' v-model="created_at_1"></date-picker>
              </div>
            </div>
          </div>
        </div>
      </form>
      <div class="box"  v-if="queryset.length > 0">
        <table st-table="rowCollectionBasic" class="table table-striped b-t" v-if="logined">
          <thead>
          <tr >
            <th>{{$t('member.list_no')}}</th>
            <th>{{$t('member.account')}}</th>
            <th>{{$t('common.real_name')}}</th>
            <th>{{$t('member.last_login')}}</th>
            <th>{{$t('member.loggedin_domain')}}</th>
            <th>{{$t('member.loggedin_ip')}}</th>
            <th>{{$t('member.login_platform')}}</th>
            <th>{{$t('member.agent')}}</th>
            <th>{{$t('member.level')}}</th>
            <th>{{$t('member.status')}}</th>
            <th>{{$t('member.balance')}}</th>
          </tr>

          </thead>
          <tbody v-if="queryset.length > 0">
          <tr v-for="member in queryset">
            <td>{{member.id}}</td>
            <td>
              <router-link :to="'/member/' + member.id">{{member.username}}</router-link>
            </td>
            <td>
              {{member.real_name || '-'}}
              <div v-if="member.realname_repeated">
                <span class="label danger">重复</span>
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
            <th>{{$t('member.list_no')}}</th>
            <th>{{$t('member.account')}}</th>
            <th>{{$t('common.real_name')}}</th>
            <th>{{$t('member.created_at')}}</th>
            <th>{{$t('member.created_ip')}}</th>
            <th>{{$t('member.last_login')}}</th>
            <th>{{$t('member.login_platform')}}</th>
            <th>{{$t('member.agent')}}</th>
            <th>{{$t('member.level')}}</th>
            <th>{{$t('member.status')}}</th>
            <th>{{$t('member.balance')}}</th>
          </tr>
          </thead>
          <tbody v-if="queryset.length > 0">
          <tr v-for="member in queryset">
            <td>{{member.id}}</td>
            <td>
              <router-link :to="'/member/' + member.id">{{member.username}}</router-link>
            </td>
            <td>
              {{member.real_name || '-'}}
              <div v-if="member.realname_repeated">
                <span class="label danger">重复</span>
              </div>
            </td>
            <td class="text-sm">
              {{member.created_at | moment("YYYY-MM-DD HH:mm") }}
            </td>
            <td>
              <div>{{member.register_ip || '-'}}
                <div><span class="label danger" v-if="member.ip_repeated">重复</span></div>
              </div>
            </td>
            <td>
              <span v-if="member.last_login">{{member.last_login.login_at | moment("YYYY-MM-DD HH:mm")}}</span>
              <span v-else>-</span>
            </td>
            <td>
              <span v-if="member.last_login">{{member.last_login.platform}}</span>
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
            <td><div v-if="member.balance">{{member.balance.balance | currency('￥')}}</div></td>
          </tr>
          </tbody>
        </table>
        <div class="report-button" v-if="queryset.length && logined !== 1 ">
          <div class="col-xs-2 pull-right">
            <a :href="href" class="md-btn w-sm grey-400" :getReport="getReport">{{$t('common.export')}}</a>
          </div>
        </div>
      </div>
      <div class="row m-b-lg">
        <pulling
          :queryset="queryset"
          :query="query"
          @query-data="queryData"
          @query-param="queryParam"
          @export-query="exportQuery"
          :api="memberApi"
          ref="pulling">
        </pulling>
      </div>
    </div>
</template>

<script>
import DatePicker from 'vue2-datepicker'
import api from '../../api'
import pulling from '../../components/pulling'
import VueCookie from 'vue-cookie'

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
                report_flag: true
            },
            filter: {},
            href: '',
            logined: false,
            export_query: []
        }
    },
    created () {
        this.$nextTick(() => {
            this.logined = this.$route.query.logined
            this.$refs.pulling.rebase()
            this.$refs.pulling.getExportQuery()
        })
    },
    watch: {
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
            this.href = `${api.report_member}?token=${VueCookie.get('access_token')}&${this.export_query}`
            return this.queryset.length
        }
    },
    methods: {
        nextTickFetch () {
            let _this = this
            this.queryset = []
            setTimeout(() => {
                _this.logined = _this.$route.query.logined
                _this.$refs.pulling.rebase()
                _this.$refs.pulling.getExportQuery()
            }, 100)
        },
        levelSelect (val) {
            this.query.level = val
        },
        returnData (data) {
            this.query.return_settings = data
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
        }
    },
    components: {
        DatePicker,
        level: require('../../components/level'),
        pulling,
        returnsetting: require('../../components/returnsetting')
    }
}
</script>
