<template>
    <div>
      <form class="form" v-on:submit.prevent="submit">
          <div class="box">
              <div class="box-body clearfix form-inline form-input-sm">
                  <div class="row">
                      <div>
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
                            <input type="text" v-model="query.id" @keyup="removeSpace()" class="form-control w-sm" v-bind:placeholder="$t('bill.order_id')"/>
                            <input type="text" v-model="query.member_q" class="form-control w-sm" v-bind:placeholder="$t('common.member')" />
                            <input type="text" v-model="query.updated_by" class="form-control inline w-sm" v-bind:placeholder="$t('common.operator')" />
                            <input type="text" v-model="query.amount_gte" class="form-control inline w-sm" v-bind:placeholder="$t('common.min_amount')"/> <span>~</span>
                            <input type="text" v-model="query.amount_lte" class="form-control inline w-sm" v-bind:placeholder="$t('common.max_amount')"/>
                            <button class="md-btn w-xs blue pull-right" type="submit">{{$t('common.search')}}</button>
                        </div>
                    </div>
                </div>
                <div class="row m-t-sm">
                    <div class="col-xs-12">
                      <select class="form-control w-sm c-select" v-model="selected" @change="updateDateFilter">
                          <option value="0">{{$t('common.applied_at')}}</option>
                          <option value="1">{{$t('common.status_updated_at')}}</option>
                      </select>
                          <date-picker width='140' v-model="query.created_at_0" v-if="selected == '0'"></date-picker>
                          <date-picker width='140' v-model="query.updated_at_0" v-else></date-picker>
                          <span>~</span>
                          <date-picker width='140' v-model="query.created_at_1" v-if="selected == '0'"></date-picker>
                          <date-picker width='140' v-model="query.updated_at_1" v-else></date-picker>
                      <div class="btn-group">
                          <button type="button" class="btn btn-sm" :class="dateRange === 0 ? 'blue-500' : 'grey-300'" @click="toggleDate(0, selected)">{{$t('common.today')}}</button>
                          <button type="button" class="btn btn-sm" :class="dateRange === 1 ? 'blue-500' : 'grey-300'" @click="toggleDate(1, selected)">{{$t('common.yesterday')}}</button>
                          <button type="button" class="btn btn-sm" :class="dateRange === 7 ? 'blue-500' : 'grey-300'" @click="toggleDate(7, selected)">{{$t('common.this_week')}}</button>
                          <button type="button" class="btn btn-sm" :class="dateRange === 31 ? 'blue-500' : 'grey-300'" @click="toggleDate(31, selected)">{{$t('common.this_month')}}</button>
                          <button type="button" class="btn btn-sm" :class="dateRange === 32 ? 'blue-500' : 'grey-300'" @click="toggleDate(32, selected)">{{$t('common.last_month')}}</button>
                      </div>
                      <button class="md-btn w-xs pull-right" type="button" @click="clearall">{{$t('action.clear_all')}}</button>
                    </div>
                </div>
            </div>
          </div>
      </form>
      <div class="row">
        <div class="col-xs-12">
          <div class="pull-left">
            <input type="checkbox" name="account_type" v-model="account_type">
            <i class="blue"></i>{{$t('action.filter_trial_account')}}
          </div>
          <div class="pull-right total-amount">
            <span>{{$t('common.total')}} {{$t('nav.withdraw_request')}}: </span>
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
                      <th>{{$t('common.balance_before')}}</th>
                      <th>{{$t('common.balance_after')}}</th>
                      <th>{{$t('common.amount')}}</th>
                      <th>{{$t('common.status_updated_at')}}</th>
                      <th>{{$t('common.operator')}}</th>
                      <th>{{$t('bank.bank_title')}}</th>
                      <th>{{$t('common.ip_info')}}</th>
                      <th>{{$t('common.status')}}</th>
                      <th>{{$t('common.memo')}}</th>
                  </tr>
              </thead>
              <tbody>
                  <tr v-for="t in queryset">
                      <td><router-link :to="'/transaction/' + t.id">{{t.id}}</router-link></td>
                      <td><router-link :to="'/member/' + t.member.id">{{t.member.username}}</router-link></td>
                      <td><router-link :to="'/level/' + t.member.level.id">{{t.member.level.name}}</router-link></td>
                      <td>{{t.created_at  | moment("YYYY-MM-DD HH:mm:ss")}}</td>
                      <td>
                        <span v-if="t.balance_before">{{t.balance_before | currency('￥')}}</span>
                        <span v-else>-</span>
                      </td>
                      <td>
                        <span v-if="t.balance_after">{{t.balance_after | currency('￥')}}</span>
                        <span v-else>-</span>
                      </td>
                      <td>{{t.amount | currency('￥')}}</td>
                      <td>{{t.updated_at | moment("YYYY-MM-DD HH:mm:ss")}}</td>
                      <td>
                            <span v-if="t.updated_by">{{t.updated_by.username}}</span>
                            <span v-else>-</span>
                      </td>
                      <td>
                            <span>{{$t('bank.bank_title')}}: {{t.member.bank.name}}</span> <br/>
                            <span>{{$t('bank.account')}}: {{t.member.bank.account}}</span> <br/>
                            <span>{{$t('bank.address')}}: {{t.member.bank.city}} , {{t.member.bank.province}}</span> <br/>
                      </td>
                      <td>
                            <span>{{$t('member.ip')}}: {{t.member.ipaddr}}</span> <br/>
                            <span>{{$t('member.area')}}: {{t.member.address}}</span> <br/>
                      </td>
                      <td>
                          <span class="label success" v-if="t.status===1">{{$t('status.success')}}</span>
                          <span class="label danger" v-if="t.status===2">{{$t('status.failed')}}</span>
                          <router-link class="label warn pointer" v-if="t.status===3" tag="span" :to="'/transaction/' + t.id">{{$t('status.ongoing')}}</router-link>
                          <span class="label" v-if="t.status===4">{{$t('status.cancelled')}}</span>
                          <span class="label danger" v-if="t.status===5">{{$t('status.declined')}}</span>
                      </td>
                      <td>{{t.memo || '-'}}</td>
                  </tr>
              </tbody>
          </table>
      </div>

      <div class="row m-b-lg">
      <pulling
        :queryset="queryset"
        :query="query"
        :total_amount="total_amount"
        @query-data="queryData"
        @query-param="queryParam"
        @amount="totalAmount"
        :api="billApi"
        ref="pulling"
        :extra="'transaction_type=withdraw'">
      </pulling>
    </div>
    </div>
</template>
<script>
    import api from '../../api'
    import pulling from '../../components/pulling'
    import transactionStatus from '../../components/transaction_status'
    import DatePicker from 'vue2-datepicker'
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
                    account_type: '',
                    status: '',
                    id: '',
                    member_q: '',
                    created_at_0: '',
                    created_at_1: '',
                    amount_lte: '',
                    amount_gte: '',
                    member_level: '',
                    operator: '',
                    updated_at_0: '',
                    updated_at_1: '',
                    report_flag: true
                },
                member_level: '0',
                selected: '0',
                status: '0',
                dateRange: -1,
                memo: '',
                account_type: true,
                total_amount: '',
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
            account_type: function (newObj, old) {
                if (newObj === true) {
                    this.query.account_type = '1'
                } else {
                    this.query.account_type = '0'
                }
                this.submit()
            },
            '$root.withdraw_count' (newObj, old) {
                this.$refs.pulling.rebase()
            },
            status: function (newObj, old) {
                if (newObj === '0') {
                    this.query.status = ''
                } else {
                    this.query.status = newObj
                }
            },
            '$route' (to, from) {
                this.queryset = []
                this.$refs.pulling.rebase()
                this.$refs.pulling.getExportQuery()
            },
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
                this.query.id = newObj
            }
        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                vm.queryset = []
                vm.$refs.pulling.rebase()
                vm.$refs.pulling.getExportQuery()
            })
        },
        created () {
            let results = this.$route.query.status
            if (results) {
                this.status = results.split(',')
            }
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
                    _this.$refs.pulling.getExportQuery()
                }, 100)
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
                    this.order_id = this.query.id
                }
                this.queryset = queryset
            },
            queryParam (query) {
                this.filter = query
            },
            totalAmount (amount) {
                this.total_amount = amount
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
                this.member_level = 0
                this.selected = '0'
                this.account_type = true
                this.$router.push({
                    path: this.$route.path + '?report_flag=true&account_type=1'
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
                    path: this.$route.path + '?report_flag=true&account_type=1',
                    query: this.query
                })
            },
            removeSpace () {
                this.order_id = this.order_id.replace(/[^\d]+/g, '')
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
