<template>
  <div>

    <form class="form text-sm" v-on:submit.prevent="submit">
      <div class="box">
        <div class="box-body clearfix form-inline form-input-sm">
          <div class="row ">
            <div class="col-xs-12">
              <date-picker width='140' v-model="query.logindate_0"></date-picker>
              <span>~</span>
              <date-picker width='140' v-model="query.logindate_1"></date-picker>
              <input type="text" v-model="query.member_q" class="form-control w-sm" v-bind:placeholder="$t('member.account')"/>
              <input type="text" v-model.trim="query.ipaddr_q" class="form-control w-sm" v-bind:placeholder="$t('member.ip')"/>
              <input type="text" v-model.trim="query.domain_q" class="form-control w-sm" v-bind:placeholder="$t('member.loggedin_domain')"/>
              <button class="pull-right md-btn blue-500 w-xs" type="submit">{{$t('common.search')}}</button>
            </div>
          </div>
        </div>
      </div>
    </form>
    <div class="box">
      <table class="table table-striped b-t">
        <thead>
        <tr>
          <th>{{$t('member.account')}}</th>
          <th>{{$t('common.login_at')}}</th>
          <th>{{$t('member.ip')}}</th>
          <th>{{$t('member.isp')}}</th>
          <th width="240">{{$t('member.area')}}</th>
          <th>{{$t('member.login_platform')}}</th>
          <th>{{$t('member.loggedin_domain')}}</th>
          <th>{{$t('member.logout_at')}}</th>
        </tr>
        </thead>
        <tbody v-if="queryset.length > 0">
        <tr v-for="report in queryset" >
          <td><router-link :to="'/login_record?member_q=' + report.member.username">{{report.member.username}}</router-link></td>
          <td>{{report.logindate | moment("YYYY-MM-DD HH:mm:ss")}}</td>
          <td><router-link :to="'/login_record?ipaddr_q=' + report.ipaddr">{{report.ipaddr}}</router-link></td>
          <td>
            <span v-if="report.isp">{{report.isp}}</span>
            <span v-else>-</span>
          </td>
          <td>{{report.address.country}} {{report.address.region}} {{report.address.city}}</td>
          <td>
            <span v-if="report.platform">{{report.platform}}</span>
            <span v-else>-</span>
          </td>
          <td>
            <span v-if="report.domain">{{report.domain}}</span>
            <span v-else>-</span>
          </td>
          <td>
            <span v-if="report.logoutdate">{{report.logoutdate | moment("YYYY-MM-DD HH:mm:ss")}}</span>
            <span v-else>-</span>
          </td>
        </tr>
        </tbody>
        <tbody v-else>
        <tr><td colspan="7">{{$t('report.no_record_found')}}</td></tr>
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
                domain_q: '',
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
