<template>
    <div>
        <div class="box" v-if="$root.permissions.includes('calculate_returnrate')">
            <div class="box-body clearfix form-inline form-input-sm">
                <div class="row">
                    <div class="col-xs-4">
                        <label class="m-r">{{$t('common.date')}}</label>
                        <date-picker width='140' v-model="report.date_0"></date-picker>
                        <span>~</span>
                        <date-picker width='140' v-model="report.date_1"></date-picker>

                    </div>
                    <div class="col-xs-6">
                        <label class="text-sm">{{$t('member.agent')}}</label>
                        <input type="text" v-model="report.agent" class="form-control" />
                    </div>

                    <div class="col-xs-12 m-t" >
                        <button class="md-btn w-sm blue" @click="generateReport">{{$t('returnrate.generate')}}</button>
                        <span class="text-danger m-l" v-if="returnMessage">当前周期内没有数据！</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="box">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>{{$t('returnrate.cycle')}}</th>
                        <th>{{$t('returnrate.created_at')}}</th>
                        <th>{{$t('returnrate.member_count')}}</th>
                        <th>{{$t('returnrate.created_by')}}</th>
                        <th>{{$t('returnrate.total_return')}}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="t in queryset">
                        <td>{{t.id}}</td>
                        <td> <router-link :to="'/bill/returnrate/' + t.history_id">{{t.report_range}}</router-link></td>
                        <td>
                            <span v-if="!t.created_at">-</span>
                            <span v-else>{{t.created_at | moment("YYYY-MM-DD HH:mm")}}</span>
                        </td>
                        <td>{{t.member_count}}</td>
                        <td>{{t.created_by.name|| '-'}}</td>
                        <td>{{t.total_return | currency('￥')}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="row m-b">
            <pulling
              :queryset="queryset"
              :query="query"
              :optexpand="optexpand"
              @query-data="queryData"
              :api="api"
              ref="pulling">
            </pulling>
        </div>
        <div class="row" v-if="errorMsg">
          <div class="col-xs-3">
              <div class="alert alert-danger">
                  {{errorMsg}}
              </div>
          </div>
      </div>
    </div>
</template>
<script>
    import api from '../../api'
    import pulling from '../../components/pulling'
    import DatePicker from 'vue2-datepicker'
    import Vue from 'vue'
    const format = 'YYYY-MM-DD'

    export default {
        data () {
            return {
                api: api.returnhistory,
                queryset: [],
                query: {},
                optexpand: 'created_by',
                errorMsg: '',
                returnMessage: false,
                report: {
                    agent: '',
                    date_0: Vue.moment().format(format),
                    date_1: Vue.moment().format(format)
                }
            }
        },
        watch: {
            returnMessage (newObj, old) {
                setTimeout(() => {
                    this.returnMessage = false
                }, 5000)
            },
            '$route' (to, from) {
                this.queryset = []
                this.$refs.pulling.rebase()
            },
            'report.date_0' (newObj, old) {
                this.report.date_0 = Vue.moment(this.report.date_0).format(format)
            },
            'report.date_1' (newObj, old) {
                this.report.date_1 = Vue.moment(this.report.date_1).format(format)
            }

        },
        created () {
            this.$nextTick(() => {
                this.$refs.pulling.rebase()
            })
        },
        methods: {
            queryData (queryset) {
                this.queryset = queryset
            },
            generateReport () {
                this.$http.post(api.returnrate, this.report, {emulateJSON: true}).then((response) => {
                    this.$refs.pulling.rebase()
                    this.returnMessage = response.data.length === 0
                }, response => {
                    this.errorMsg = response.data.error
                })
            }
        },
        components: {
            DatePicker,
            pulling
        }
    }
</script>
