<template>
    <div>
      <div class="m-b-sm">
        <div class="row">
          <div class="col-xs-12">
            <div class="h6 inline">{{$t('nav.agent')}}</div>
            <div class="pull-right inline"  v-if="$root.permissions.includes('add_change_staff')">
              <router-link tag="button" class="md-btn w-sm blue"  to="/agent/add">{{$t('nav.agent_add')}}</router-link>
            </div>
          </div>
        </div>
      </div>
      <form class="form" v-on:submit.prevent="submit('agent')">
        <div class="box">
          <div class="box-body clearfix form-inline form-input-sm">
            <div class="row">
              <div class="col-xs-12">
                <input type="text" v-model="query.username_q" class="form-control" v-bind:placeholder="$t('agent.account')"/>
                <input type="text" v-model="query.promo_code" class="form-control w-sm"  v-bind:placeholder="$t('agent.promo_code')"/>
                <input type="text" v-model="query.real_name_q" class="form-control w-sm" v-bind:placeholder="$t('common.real_name')" />
                <input type="text" v-model="query.parent_agent_q" class="form-control w-sm" v-bind:placeholder="$t('agent.parent_agent')" />
                <select class="form-control c-select w-sm" v-model="level" >
                  <option value="0">{{$t('agent.level')}}</option>
                  <option value="1">大股东</option>
                  <option value="2">股东</option>
                  <option value="3">总代理</option>
                  <option value="4">代理</option>
                </select>
                <commissionsetting :commissionsetting="commission_settings" @myCommission="myCommission"/>
                <button class="md-btn w-xs blue pull-right" type="submit">{{$t('common.search')}}</button>
                <button class="md-btn grey-100 pull-right m-r"  @click="showAll=!showAll">
                  <span v-if="!showAll">{{$t('member.more_options')}} <i class="fa fa-angle-double-down"></i></span>
                  <span v-else>{{$t('member.collapse_options')}} <i class="fa fa-angle-double-up"></i></span>
                </button>
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
                <input v-show="selected == '0'" type="text" class="form-control inline" :disabled="selected == '0'"/>
                <input v-if="selected == 1" type="text" v-model="query.phone" class="form-control w-sm" v-bind:placeholder="$t('common.input') + ' ' + $t('common.phone')" />
                <input v-if="selected == 2" type="text" v-model="query.email" class="form-control w-sm" v-bind:placeholder="$t('common.input') + ' ' + $t('common.email')" />
                <input v-if="selected == 3" type="text" v-model="query.qq" class="form-control w-sm" v-bind:placeholder="$t('common.input') + ' ' + $t('common.qq')" />
                <input v-if="selected == 4" type="text" v-model="query.wechat" class="form-control w-sm" v-bind:placeholder="$t('common.input') + ' ' + $t('common.wechat')" />
                <select class="form-control c-select w-sm" v-model="status">
                  <option value="">{{$t('common.status')}}</option>
                  <option value="1">{{$t('status.active')}}</option>
                  <option value="0">{{$t('status.inactive')}}</option>
                </select>
                <input type="text" v-model="query.bank" class="form-control w-sm" v-bind:placeholder="$t('agent.bank_account')"/>
                <date-picker width='140' v-model="created_at_0" v-bind:placeholder="$t('agent.joined_at')"></date-picker>
                <span>~</span>
                <date-picker width='140' v-model="created_at_1" v-bind:placeholder="$t('agent.joined_at')"></date-picker>
                <button class="md-btn w-xs grey-400 pull-right" type="button" @click="clearall">{{$t('action.clear_all')}}</button>
              </div>
            </div>
          </div>
        </div>
      </form>

      <div class="box">
        <table class="table table-striped">
          <thead>
          <tr>
            <th class="text-center">{{$t("common.login_status")}}</th>
            <th>{{$t("agent.parent_agent")}}</th>
            <th>{{$t("agent.account")}}</th>
            <th>{{$t('common.real_name')}}</th>
            <th>{{$t("agent.member_count")}}</th>
            <th>{{$t("agent.joined_at")}}</th>
            <th width="240">{{$t("agent.domain")}}</th>
            <th>{{$t("agent.level")}}</th>
            <th>{{$t("common.status")}}</th>
            <th>{{$t("common.memo")}}</th>
          </tr>
          </thead>
          <tbody v-if="queryset.length">
          <tr v-for="agent in queryset">
            <td>
              <div class="circle" style="font-size: 25px; text-align: center; color:#42b72a;" v-if="agent.is_logged_in==true">&#x25CF;</div>
              <div class="circle" style="font-size: 25px; text-align: center; color:#d3d3d3;" v-else>&#x25CF;</div>
            </td>
            <td v-if="agent.parent_agent">{{agent.parent_agent.name}}</td><td v-else>-</td>
            <td><router-link :to="'/agent/' + agent.id">{{agent.username}}</router-link></td>
            <td><span v-if="agent.real_name">{{agent.real_name}}</span><span v-else>-</span></td>
            <td><router-link :to="'/member/?agent=' + agent.username">{{agent.member_count}}</router-link></td>
            <td>
              <span v-if="agent.created_at">{{agent.created_at | moment("YYYY-MM-DD HH:mm")}}</span>
              <span v-else>-</span>
            </td>
            <td>
              <span v-if="agent.domain && isArray(agent.domain.split(','))">
                <label class="m-r-sm deamin-label" v-for="deamin in agent.domain.split(',')">{{deamin}}</label>
              </span>
              <span  v-else-if="agent.domain">{{agent.domain}}</span>
              <span  v-else>-</span>
            </td>
            <td>
              <span v-if="agent.level">{{agent.level.name}}</span>
              <span v-else>-</span>
            </td>
            <td>
              <span class="label success" v-if="agent.status==1">{{$t('status.active')}}</span>
              <span class="label" v-else>{{$t('status.inactive')}}</span>
            </td>
            <td v-if="agent.memo">{{agent.memo}}</td><td v-else>-</td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="row m-b-lg">
        <pulling
          :queryset="queryset"
          :api="agentApi"
          :query="query"
          :optexpand="optexpand"
          ref="pulling"
          @query-data="queryData"
          @query-param="queryParam"
          >
        </pulling>
      </div>
    </div>
</template>

<script>
import DatePicker from 'vue2-datepicker'
import api from '../../../api'
import pulling from '../../../components/pulling'

export default {
    data () {
        return {
            created_at_0: '',
            created_at_1: '',
            optexpand: 'level,parent_agent',
            showAll: false,
            agentApi: api.agent,
            queryset: [],
            query: {
                id: '',
                username_q: '',
                created_at_0: '',
                created_at_1: '',
                status: '',
                level: '',
                parent_agent: '',
                commission_settings: '',
                promo_code: '',
                real_name_q: '',
                phone: '',
                email: '',
                qq: '',
                wechat: '',
                bank: '',
                member_count: '',
                agent_count: '',
                memo: ''
            },
            status: '',
            level: '0',
            commission_settings: '0',
            selected: '0',
            filter: {}
        }
    },
    watch: {
        '$route': 'nextTickFetch',
        status: function (newObj, old) {
            if (newObj === '') {
                this.query.status = ''
            } else {
                this.query.status = newObj
            }
        },
        level: function (newObj, old) {
            if (newObj === '0') {
                this.query.level = ''
            } else {
                this.query.level = newObj
            }
        },
        created_at_0 (newObj, old) {
            this.query.created_at_0 = newObj
        },
        created_at_1 (newObj, old) {
            this.query.created_at_1 = newObj
        }
    },
    created () {
        this.$nextTick(() => {
            this.level = this.$route.query.level
            this.$refs.pulling.rebase()
        })
    },
    methods: {
        nextTickFetch () {
            this.queryset = []
            setTimeout(() => {
                this.level = this.$route.query.level
                this.$refs.pulling.rebase()
            }, 100)
        },
        queryData (queryset) {
            this.query = Object.assign({}, this.filter)
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
        myCommission (val) {
            this.query.commission_settings = val
            this.commission_settings = val
        },
        submit () {
            this.$refs.pulling.submit()
        },
        isArray (o) {
            return Object.prototype.toString.call(o) === '[object Array]'
        },
        filterUserContactInfo () {
            this.query.phone = ''
            this.query.email = ''
            this.query.wechat = ''
            this.query.qq = ''
            switch (this.selected) {
            case '-1':
                this.selected = '0'
                break
            case '1':
                this.query.phone = this.query.phone
                break
            case '2':
                this.query.email = this.query.email
                break
            case '3':
                this.query.qq = this.query.qq
                break
            case '4':
                this.query.wechat = this.query.wechat
                break
            }
            this.$refs.pulling.submit()
        },
        clearall: function () {
            this.query = {}
            this.status = ''
            this.created_at_0 = ''
            this.created_at_1 = ''
            this.level = '0'
            this.commission_settings = '0'
            this.selected = '0'
            this.$router.push({
                path: this.$route.path
            })
        }
    },
    components: {
        DatePicker,
        pulling,
        commissionsetting: require('../../../components/commissionsetting')
    }
}
</script>
<style scoped lang="scss">
    table {
        table-layout: fixed;
    }
    td{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    td .deamin-label{
        display: inline;
    }
</style>
