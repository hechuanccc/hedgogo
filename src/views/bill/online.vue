<template>
    <div>
      <form class="form" v-on:submit.prevent="submit">
          <div class="box">
              <div class="box-body clearfix form-inline form-input-sm">
                  <div class="row">
                        <div class="col-xs-12">
                            <select class="form-control w-sm c-select" v-model="status">
                              <option value="0">{{$t('common.status')}}</option>
                              <option value="1">{{$t('status.success')}}</option>
                              <option value="2">{{$t('status.failed')}}</option>
                              <option value="3">{{$t('status.ongoing')}}</option>
                              <option value="4">{{$t('status.cancelled')}}</option>
                              <option value="5">{{$t('status.declined')}}</option>
                            </select>
                          <level class="inline" :level="member_level" @level-select="changeFromLevel"></level>
                          <input type="number" v-model.trim="query.transaction_id" class="form-control w-sm" v-bind:placeholder="$t('bill.order_id')"/>
                          <input type="text" v-model="query.member_q" class="form-control w-sm" v-bind:placeholder="$t('common.member')" />
                          <input type="text" v-model="query.online_payee" class="form-control w-sm" v-bind:placeholder="$t('common.merchant')" />
                          <input type="text" class="form-control inline w-sm" v-model="query.real_name_q" v-bind:placeholder="$t('common.real_name')" />
                          <input type="text" v-model="query.amount_gte" class="form-control inline w-sm" v-bind:placeholder="$t('common.min_amount')"/> <span>~</span>
                          <input type="text" v-model="query.amount_lte" class="form-control inline w-sm" v-bind:placeholder="$t('common.max_amount')"/>
                          <button class="md-btn w-xs blue pull-right" type="submit">{{$t('common.search')}}</button>
                        </div>
                  </div>
                  <div class="row m-t-sm">
                      <div class="col-xs-12">
                          <select class="form-control w-sm c-select pull-left m-r-xs" v-model="selected" @change="updateDateFilter">
                              <option value="0">{{$t('common.applied_at')}}</option>
                              <option value="1">{{$t('common.status_updated_at')}}</option>
                          </select>
                          <div class="pull-left m-r-xs">
                              <date-picker width='140' v-model="query.created_at_0" v-if="selected == '0'"></date-picker>
                              <date-picker width='140' v-model="query.updated_at_0" v-else></date-picker>
                              <span>~</span>
                              <date-picker width='140' v-model="query.created_at_1" v-if="selected == '0'"></date-picker>
                              <date-picker width='140' v-model="query.updated_at_1" v-else></date-picker>
                          </div>
                          <div class="btn-group pull-left m-r-xs">
                              <button type="button" class="btn btn-sm" :class="dateRange === 0 ? 'blue-500' : 'grey-300'" @click="toggleDate(0, selected)">{{$t('common.today')}}</button>
                              <button type="button" class="btn btn-sm" :class="dateRange === 1 ? 'blue-500' : 'grey-300'" @click="toggleDate(1, selected)">{{$t('common.yesterday')}}</button>
                              <button type="button" class="btn btn-sm" :class="dateRange === 7 ? 'blue-500' : 'grey-300'" @click="toggleDate(7, selected)">{{$t('common.this_week')}}</button>
                              <button type="button" class="btn btn-sm" :class="dateRange === 31 ? 'blue-500' : 'grey-300'" @click="toggleDate(31, selected)">{{$t('common.this_month')}}</button>
                              <button type="button" class="btn btn-sm" :class="dateRange === 32 ? 'blue-500' : 'grey-300'" @click="toggleDate(32, selected)">{{$t('common.last_month')}}</button>
                          </div>
                          <button class="md-btn w-xs btn pull-right" type="button" @click="clearall">{{$t('action.clear_all')}}</button>
                    </div>
                </div>
              </div>
          </div>
      </form>
      <div class="row">
        <div class="col-xs-12">
          <div class="pull-right" v-if="$root.permissions.includes('export_onlinepay_report')">
            <a :href="href" :getReport="getReport" v-if="queryset.length">
              <span>{{ $t('action.download') }}<i class="material-icons">&#xe2c4;</i></span>
            </a>
            <span disabled v-else>{{ $t('action.download') }}<i class="material-icons">&#xe2c4;</i></span>
          </div>
          <div class="pull-right total-amount m-r-sm">
            <span>{{$t('common.total')}} {{$t('nav.online_pay_orders')}}: </span>
            <span v-if="queryset.length">{{total_amount | currency('￥')}}</span>
            <span v-else>{{0 | currency('￥')}}</span>
          </div>
        </div>
      </div>
      <div class="box">
          <table class="table table-striped">
              <thead>
                  <tr>
                      <th>{{$t('bill.order_id')}}</th>
                      <th>{{$t('common.member')}}</th>
                      <th>{{$t('member.level')}}</th>
                      <th>{{$t('common.applied_at')}}</th>
                      <th>{{$t('common.merchant')}}</th>
                      <th>{{$t('common.balance_before')}}</th>
                      <th>{{$t('common.balance_after')}}</th>
                      <th>{{$t('common.amount')}}</th>
                      <th>{{$t('common.status_updated_at')}}</th>
                      <th>{{$t('common.status')}}</th>
                  </tr>
              </thead>
              <tbody>
                  <tr v-for="t in queryset">
                      <td>
                          <router-link :to="'/transaction/' + t.id">{{t.transaction_id}}</router-link>
                      </td>
                      <td>
                          <router-link :to="'/member/' + t.member.id">{{t.member.username}}</router-link>
                      </td>
                      <td>
                          <router-link :to="'/level/' + t.member.level.id">{{t.member.level.name}}</router-link>
                      </td>
                      <td>{{t.created_at | moment("YYYY-MM-DD HH:mm:ss")}}</td>
                      <td>
                          <router-link :to="'/online_payee/' + t.online_payee.id">{{t.online_payee.name}}</router-link>
                      </td>
                      <td>
                        <span v-if="t.balance_before">{{t.balance_before | currency('￥')}}</span>
                        <span v-else>-</span>
                      </td>
                      <td>
                        <span v-if="t.balance_after">{{t.balance_after | currency('￥')}}</span>
                        <span v-else>-</span>
                      </td>
                      <td>
                          {{t.amount | currency('￥')}}
                      </td>
                      <td>{{t.updated_at | moment("YYYY-MM-DD HH:mm:ss")}}</td>
                      <td>
                          <transaction-status :transaction="t"></transaction-status>
                      </td>
                  </tr>
              </tbody>
          </table>
      </div>
      <div class="row m-b-lg">
        <pulling
          :queryset="queryset"
          :query="query"
          :total_amount="total_amount"
          :export_query="export_query"
          @query-data="queryData"
          @query-param="queryParam"
          @amount="totalAmount"
          @export-query="exportQuery"
          :api="billApi"
          ref="pulling"
          :extra="'transaction_type=online_pay'">
        </pulling>
    </div>
    </div>
</template>
<script>
    import api from '../../api'
    import DatePicker from 'vue2-datepicker'
    import pulling from '../../components/pulling'
    import transactionStatus from '../../components/transaction_status'
    import VueCookie from 'vue-cookie'
    import date from '../../utils/date'
    import Vue from 'vue'

    const format = 'YYYY-MM-DD'
    export default {
        data () {
            return {
                queryset: [],
                billApi: api.bill,
                order_id: '',
                query: {
                    transaction_id: '',
                    member_q: '',
                    created_at_0: '',
                    created_at_1: '',
                    amount_lte: '',
                    amount_gte: '',
                    status: [],
                    member_level: '',
                    online_paye: '',
                    updated_by: '',
                    real_name_q: '',
                    updated_at_0: '',
                    updated_at_1: '',
                    report_flag: true
                },
                member_level: '',
                selected: '0',
                status: '0',
                dateRange: -1,
                total_amount: '',
                href: '',
                export_query: [],
                filter: {
                    created_at_0: Vue.moment().subtract(7, 'days').format(format),
                    created_at_1: Vue.moment().subtract(1, 'days').format(format),
                    updated_at_0: Vue.moment().subtract(7, 'days').format(format),
                    updated_at_1: Vue.moment().subtract(1, 'days').format(format),
                    report_flag: 'True'
                }
            }
        },
        watch: {
            status: function (newObj, old) {
                if (newObj === '0') {
                    this.query.status = ''
                } else {
                    this.query.status = newObj
                }
            },
            '$route': 'nextTickFetch',
            created_at_0 (newObj, old) {
                this.query.created_at_0 = newObj
            },
            created_at_1 (newObj, old) {
                this.query.created_at_1 = newObj
            },
            updated_at_0 (newObj, old) {
                this.query.updated_at_0 = newObj
            },
            updated_at_1 (newObj, old) {
                this.query.updated_at_1 = newObj
            },
            order_id (newObj, old) {
                this.query.transaction_id = newObj
            }
        },
        created () {
            let status = this.$route.query.status
            if (status) {
                this.status = status.split(',')
            }
            this.$nextTick(() => {
                this.$refs.pulling.rebase()
            })
        },
        computed: {
            getReport () {
                this.$refs.pulling.getExportQuery()
                this.href = `${api.report_onlinepay}?token=${VueCookie.get('access_token')}&report=online_pay&${this.export_query}`
                return this.queryset.length
            }
        },
        methods: {
            nextTickFetch () {
                this.queryset = []
                this.$nextTick(() => {
                    this.$refs.pulling.rebase()
                })
            },
            changeFromLevel (val) {
                this.query.member_level = val
                this.member_level = val
            },
            queryData (queryset) {
                this.query = Object.assign({}, this.filter)
                if (this.query.created_at_0) {
                    this.created_at_0 = this.query.created_at_0
                }
                if (this.query.created_at_1) {
                    this.created_at_1 = this.query.created_at_1
                }
                if (this.query.updated_at_0) {
                    this.updated_at_0 = this.query.updated_at_0
                }
                if (this.query.updated_at_1) {
                    this.updated_at_1 = this.query.updated_at_1
                }
                if (this.query.id) {
                    this.query.id = this.query.id
                }
                if (this.query.transaction_id) {
                    this.order_id = this.query.transaction_id
                }
                this.queryset = queryset
            },
            queryParam (query) {
                this.filter = query
            },
            totalAmount (amount) {
                this.total_amount = amount
            },
            exportQuery (expor) {
                this.export_query = expor
            },
            submit () {
                this.$refs.pulling.submit()
            },
            quick_select () {
                this.$refs.pulling.submit()
                let query = this.filter
                this.$router.push({
                    path: this.$route.path,
                    query: query
                })
            },
            clearall: function () {
                this.query = {}
                this.status = '0'
                this.dateRange = -1
                this.query.created_at_0 = ''
                this.query.created_at_1 = ''
                this.query.updated_at_0 = ''
                this.query.updated_at_1 = ''
                this.member_level = ''
                this.selected = '0'
                this.$router.push({
                    path: this.$route.path + '?report_flag=true'
                })
            },
            updateDateFilter: function () {
                this.clearDateFilter()
                return this.selected
            },
            clearDateFilter () {
                if (this.selected === '0') {
                    this.updated_at_0 = ''
                    this.updated_at_1 = ''
                    this.query.updated_at_0 = ''
                    this.query.updated_at_1 = ''
                } else {
                    this.created_at_0 = ''
                    this.created_at_1 = ''
                    this.query.created_at_0 = ''
                    this.query.created_at_1 = ''
                }
                this.$router.push({
                    path: this.$route.path + '?report_flag=true',
                    query: this.query
                })
            },
            getDateRange (flag) {
                switch (flag) {
                case 'today':
                    this.dateRange = 0
                    break
                case 'yesterday':
                    this.dateRange = 1
                    break
                case 'this_week':
                    this.dateRange = 7
                    break
                case 'last_week':
                    this.dateRange = 8
                    break
                case 'this_month':
                    this.dateRange = 31
                    break
                case 'last_month':
                    this.dateRange = 32
                    break
                }
            },
            toggleDate (flag, filterDateType) {
                this.dateRange = flag
                switch (flag) {
                case 0:
                    this.startDate = date.today[0]
                    this.endDate = date.today[1]
                    break
                case 1:
                    this.startDate = date.yesterday[0]
                    this.endDate = date.yesterday[1]
                    break
                case 7:
                    this.startDate = date.this_week[0]
                    this.endDate = date.this_week[1]
                    break
                case 8:
                    this.startDate = date.last_week[0]
                    this.endDate = date.last_week[1]
                    break
                case 31:
                    this.startDate = date.this_month[0]
                    this.endDate = date.this_month[1]
                    break
                case 32:
                    this.startDate = date.last_month[0]
                    this.endDate = date.last_month[1]
                    break
                }
                if (filterDateType === '0') {
                    this.filter.created_at_0 = this.startDate
                    this.filter.created_at_1 = this.endDate
                } else {
                    this.filter.updated_at_0 = this.startDate
                    this.filter.updated_at_1 = this.endDate
                }
                this.quick_select()
            }
        },
        components: {
            DatePicker,
            pulling,
            transactionStatus,
            level: require('../../components/level')
        }
    }
</script>
