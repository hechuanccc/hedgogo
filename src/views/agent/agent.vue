<template>
    <div>
      <form class="form" v-on:submit.prevent="submit('agent')">
        <div class="box">
          <div class="box-body clearfix form-inline form-input-sm">
            <div class="row">
              <div class="col-xs-2">
                <label class="text-sm">{{$t('agent.account')}}</label>
                <input type="text" v-model="query.username_q" class="form-control" />
              </div>
              <div class="col-xs-2">
                <label class="m-r">{{$t('agent.promo_code')}}</label>
                <input type="text" v-model="query.promo_code" class="form-control w-sm" />
              </div>
              <div class="col-xs-2">
                <label class="m-r">{{$t('common.real_name')}}</label>
                <input type="text" v-model="query.real_name_q" class="form-control w-sm" />
              </div>
              <div class="col-xs-2">
                <label class="m-r">{{$t('agent.commission_setting')}}</label>
                <commissionsetting :commissionsetting="query.commission_settings" @myCommission="myCommission"></commissionsetting>
              </div>
              <div class="col-3">
                <button class="md-btn w-sm blue pull-right" type="submit">{{$t('common.search')}}</button>
                <button class="md-btn grey-100 pull-right m-r"  @click="showAll=!showAll">
                  <span v-if="!showAll">{{$t('member.more_options')}} <i class="fa fa-angle-double-down"></i></span>
                  <span v-else>{{$t('member.collapse_options')}} <i class="fa fa-angle-double-up"></i></span>
                </button>
              </div>

            </div>
            <div class="row m-t" v-show="showAll">
              <div class="col-xs-2">
                <label class="text-sm">{{$t('agent.parent_agent')}}</label>
                <input type="text" v-model="query.parent_agent" class="form-control w-sm" />
              </div>

              <div class="col-xs-2">
                <label class="text-sm">{{$t('common.phone')}}</label>
                <input type="text" v-model="query.phone" class="form-control w-sm" />
              </div>
              <div class="col-xs-2">
                <label class="text-sm">{{$t('common.email')}}</label>
                <input type="text" v-model="query.email" class="form-control w-sm" />
              </div>
              <div class="col-xs-2">
                <label class="text-sm">{{$t('common.qq')}}</label>
                <input type="text" v-model="query.qq" class="form-control w-sm" />
              </div>
            </div>
            <div class="row m-t" v-show="showAll">
              <div class="col-xs-2">
                <label class="text-sm">{{$t('agent.level')}}</label>
                <select class="form-control c-select w-sm" v-model="query.level" >
                  <option value="">不限</option>
                  <option value="1">大股东</option>
                  <option value="2">股东</option>
                  <option value="3">总代理</option>
                  <option value="4">代理</option>
                </select>
              </div>
              <div class="col-xs-2">
                <label class="text-sm">{{$t('common.status')}}</label>
                <select class="form-control c-select w-sm" v-model="query.status">
                  <option value="">不限</option>
                  <option value="1">{{$t('status.active')}}</option>
                  <option value="0">{{$t('status.inactive')}}</option>
                </select>
              </div>
              <div class="col-xs-2">
                <label class="text-sm">{{$t('common.wechat')}}</label>
                <input type="text" v-model="query.wechat" class="form-control w-sm" />
              </div>
              <div class="col-xs-2">
                <label class="text-sm">{{$t('agent.bank_account')}}</label>
                <input type="text" v-model="query.bank" class="form-control w-sm" />
              </div>

              <div class="col-xs-4">
                <label>{{$t('agent.joined_at')}}</label>
                <date-picker width='140' v-model="created_at_0"></date-picker>
                <span>~</span>
                <date-picker width='140' v-model="created_at_1"></date-picker>
              </div>
            </div>
          </div>
        </div>
      </form>

      <div class="box">
        <table class="table table-striped">
          <thead>
          <tr>
            <th>{{$t("agent.number")}}</th>
            <th>{{$t("agent.account")}}</th>
            <th>{{$t('common.real_name')}}</th>
            <th>{{$t("agent.joined_at")}}</th>
            <th width="240">{{$t("agent.domain")}}</th>
            <th>{{$t("agent.level")}}</th>
            <th>{{$t("common.status")}}</th>
          </tr>
          </thead>
          <tbody v-if="queryset.length">
          <tr v-for="agent in queryset">
            <td>{{agent.id}}</td>
            <td><router-link :to="'/agent/' + agent.id">{{agent.username}}</router-link></td>
            <td>{{agent.real_name}}</td>
            <td>
              <span v-if="agent.created_at">{{agent.created_at | moment("YYYY-MM-DD HH:mm")}}</span>
              <span v-else>-</span>
            </td>
            <td>
              <span v-if="isArray(agent.domain)">
                <label class="m-r deamin-label" v-for="deamin in agent.domain">{{deamin}}</label>
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
import api from '../../api'
import pulling from '../../components/pulling'

export default {
    data () {
        return {
            created_at_0: '',
            created_at_1: '',
            optexpand: 'level',
            showAll: false,
            agentApi: api.agent,
            queryset: [],
            query: {
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
                bank: ''
            },
            filter: {}
        }
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
    created () {
        this.$nextTick(() => {
            this.$refs.pulling.rebase()
        })
    },
    methods: {
        nextTickFetch () {
            let _this = this
            this.queryset = []
            setTimeout(() => {
                _this.$refs.pulling.rebase()
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
        },
        submit () {
            this.$refs.pulling.submit()
        },
        isArray (o) {
            return Object.prototype.toString.call(o) === '[object Array]'
        }

    },
    components: {
        DatePicker,
        pulling,
        commissionsetting: require('../../components/commissionsetting')
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
