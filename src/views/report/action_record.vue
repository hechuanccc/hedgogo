<template>
    <div>
      <form class="form text-sm" v-on:submit.prevent="submit">
        <div class="box">
          <div class="box-body clearfix form-inline form-input-sm">
            <div class="row ">
              <div class="col-xs-2">
                <label class="text-sm m-r">{{$t('actionrecord.action_username')}}</label>
                <input type="text" v-model="query.action_username_q" class="form-control w-sm" />
              </div>

              <div class="col-xs-2">
                <label class="text-sm m-r">{{$t('actionrecord.username')}}</label>
                <input type="text" v-model="query.username_q"  class="form-control w-sm" />
              </div>
              <div class="col-xs-5">
                <label class="text-sm m-r">{{$t('actionrecord.action_time')}}</label>
                <date-picker width='140' v-model="action_time_0"></date-picker>
                <span>~</span>
                <date-picker width='140' v-model="action_time_1"></date-picker>
              </div>

              <div class="col-xs-3">
                <button class="pull-right md-btn blue-500 w-sm" type="submit">{{$t('common.search')}}</button>
              </div>
            </div>
            <div class="row m-t">
              <div class="col-xs-2">
                <label class="text-sm m-r">{{$t('actionrecord.ipaddr')}}</label>
                <input type="text" v-model="query.ipaddr_q"  @keyup="removeSpace" class="form-control w-sm" />
              </div>
              <div class="col-xs-2">
                <label class="text-sm m-r">{{$t('actionrecord.action_type')}}</label>
                <select class="form-control c-select" v-model="query.action_type">
                  <option value="">{{$t('common.please_select')}}</option>
                  <option class="form-control" value="0">{{$t('actionrecord.login')}}</option>
                  <option class="form-control" value="1">{{$t('actionrecord.change_password')}}</option>
                  <option class="form-control" value="2">{{$t('actionrecord.change_withdraw_password')}}</option>
                  <option class="form-control" value="3">{{$t('actionrecord.launch_game')}}</option>
                </select>
              </div>
              <div class="col-xs-4">
                <label class="text-sm">{{$t('actionrecord.action_result')}}</label>
                <label class="md-check md-check-md m-r">
                  <input type="checkbox" value="1" name="status" v-model="action_result">
                  <i class="blue"></i>
                  {{$t('status.success')}}
                </label>
                <label class="md-check m-r">
                  <input type="checkbox" value="0" name="status" v-model="action_result">
                  <i class="blue"></i>
                  {{$t('status.failed')}}
                </label>
              </div>
            </div>
          </div>
        </div>
      </form>
      <div class="box">
        <table class="table table-striped b-t">
          <thead>
          <tr>
            <th>{{$t('actionrecord.id')}}</th>
            <th>{{$t('actionrecord.action_username')}}</th>
            <th>{{$t('actionrecord.username')}}</th>
            <th>{{$t('actionrecord.action_time')}}</th>
            <th>{{$t('actionrecord.ipaddr')}}</th>
            <th>{{$t('actionrecord.action_type')}}</th>
            <th>{{$t('actionrecord.game_name')}}</th>
            <th>{{$t('actionrecord.action_result')}}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="report in queryset" >
            <td>{{report.id}}</td>
            <td>{{report.action_username || '-'}}</td>
            <td>{{report.username}}</td>
            <td>{{report.action_time | moment("YYYY-MM-DD HH:mm:ss")}}</td>
            <td>{{report.ipaddr}}</td>
            <td>
              <span v-if="report.action_type == '0'">{{$t('actionrecord.login')}}</span>
              <span v-if="report.action_type == '1'">{{$t('actionrecord.change_password')}}</span>
              <span v-if="report.action_type == '2'">{{$t('actionrecord.change_withdraw_password')}}</span>
              <span v-if="report.action_type == '3'">{{$t('actionrecord.launch_game')}}</span>
            </td>
            <td>
              <span v-if="report.game_name">{{report.game_name}}</span>
              <span v-else>-</span>
            </td>
            <td>
              <span v-if="report.action_result" class="label success">{{$t('status.success')}}</span>

              <span v-else class="label  danger">{{$t('status.failed')}}</span>
            </td>
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
          :api="actionrecordApi"
          ref="pulling">
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
            actionrecordApi: api.action_record,
            action_time_0: '',
            action_time_1: '',
            query: {
                action_username_q: '',
                username_q: '',
                action_time_0: '',
                action_time_1: '',
                ipaddr_q: '',
                game_name: '',
                action_result: [],
                action_type: [],
                report_flag: true
            },
            queryset: [],
            action_result: [],
            action_type: '',
            filter: {}
        }
    },
    created () {
        let actionResult = this.$route.query.action_result
        if (actionResult) {
            this.action_result = actionResult.split(',')
        }
        this.$nextTick(() => {
            this.$refs.pulling.rebase()
        })
    },
    watch: {
        action_result: function (old, newObj) {
            this.query.action_result = old
        },
        '$route': 'nextTickFetch',
        action_time_0 (newObj, old) {
            this.query.action_time_0 = newObj
        },
        action_time_1 (newObj, old) {
            this.query.action_time_1 = newObj
        }
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
            if (this.query.action_time_0) {
                this.action_time_0 = this.query.action_time_0
            }
            if (this.query.action_time_1) {
                this.action_time_1 = this.query.action_time_1
            }
            this.queryset = queryset
        },
        removeSpace () {
            this.query.ipaddr_q = this.query.ipaddr_q.replace(/[^\d\.]+/g, '')
        },
        queryParam (query) {
            this.filter = query
        },
        submit () {
            this.$refs.pulling.submit()
        }
    },
    components: {
        DatePicker,
        pulling
    }
}
</script>
