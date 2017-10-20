<template>
  <div>

    <form class="form text-sm" v-on:submit.prevent="submit">
      <div class="box">
        <div class="box-body clearfix form-inline form-input-sm">
          <div class="row ">
            <div class="col-xs-2">
              <label class="m-r">{{$t('member.account')}}</label>
              <input type="text" v-model="query.member_q" class="form-control w-sm" />
            </div>

            <div class="col-xs-2">
              <label class="m-r">IP</label>
              <input type="text" v-model="query.ipaddr_q" @keyup="removeSpace" class="form-control w-sm" />
            </div>
            <div class="col-xs-5">
              <label class="m-r">{{$t('common.login_at')}}</label>
              <date-picker width='140' v-model="query.logindate_0"></date-picker>
              <span>~</span>
              <date-picker width='140' v-model="query.logindate_1"></date-picker>

            </div>
            <div class="col-xs-3">
              <button class="pull-right md-btn blue-500 w-sm" type="submit">{{$t('common.search')}}</button>
            </div>
          </div>
        </div>
      </div>
    </form>
    <div class="box">
      <table class="table table-striped b-t">
        <thead>
        <tr>
          <th>{{$t('report.number_login')}}</th>
          <th>{{$t('member.account')}}</th>
          <th>{{$t('common.login_at')}}</th>
          <th>{{$t('member.ip')}}</th>
          <th>{{$t('member.login_platform')}}</th>
          <th>{{$t('member.area')}}</th>
        </tr>
        </thead>
        <tbody v-if="queryset.length > 0">
        <tr v-for="report in queryset" >
          <td>{{report.id}}</td>
          <td><router-link :to="'/report/login?member_q=' + report.member.username">{{report.member.username}}</router-link></td>
          <td>{{report.logindate | moment("YYYY-MM-DD HH:mm:ss")}}</td>
          <td><router-link :to="'/report/login?ipaddr_q=' + report.ipaddr">{{report.ipaddr}} {{report.isp}}</router-link></td>
          <td>
            <span v-if="report.platform">{{report.platform}}</span>
            <span v-else>-</span>
          </td>
          <td>{{report.address.country}} {{report.address.city}} {{report.isp}}</td>
        </tr>
        </tbody>
        <tbody v-else>
        <tr><td colspan="5">{{$t('report.no_record_found')}}</td></tr>
        </tbody>
      </table>
    </div>

    <div class="row m-b-lg">
      <pulling :queryset="queryset" :api="loginrecordApi" :query="query" ref="pulling" @query-data="queryData" @query-param="queryParam"></pulling>
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
            loginrecordApi: api.loginrecord,
            query: {
                member_q: '',
                logindate_0: '',
                logindate_1: '',
                ipaddr_q: '',
                report_flag: true
            },
            queryset: [],
            filter: {}
        }
    },
    watch: {
        '$route' (to, from) {
            this.$refs.pulling.rebase()
        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            vm.queryset = []
            vm.$refs.pulling.rebase()
        })
    },
    methods: {
        submit () {
            this.$refs.pulling.submit()
        },
        removeSpace () {
            this.query.ipaddr_q = this.query.ipaddr_q.replace(/[^\d\.]+/g, '')
        },
        queryData (queryset) {
            this.query = Object.assign({}, this.filter)
            this.queryset = queryset
        },
        queryParam (query) {
            this.filter = query
        }
    },
    components: {
        DatePicker,
        pulling
    }
}
</script>
