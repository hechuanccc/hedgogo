<template>
    <div>
      <form class="form" v-on:submit.prevent="submit" ref="form">
        <div class="box">
            <div class="box-body clearfix form-inline form-input-sm">
                <div class="row">
                    <div class="col-xs-12">
                        <select class="form-control w-sm c-select" v-model="remit_type">
                            <option value="0">{{$t('setting.remit_type')}}</option>
                            <option value="1">{{$t('setting.payment_normal')}}</option>
                            <option value="2">{{$t('setting.payment_alipay')}}</option>
                            <option value="3">{{$t('setting.payment_wechat')}}</option>
                        </select>
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
                        <input type="text" v-model="query.updated_by" class="form-control inline w-sm" v-bind:placeholder="$t('common.operator')" />
                        <input type="text" class="form-control inline w-sm" v-model="query.real_name_q" v-bind:placeholder="$t('common.real_name')" />
                        <input type="text" v-model="query.amount_gte" class="form-control inline w-sm" v-bind:placeholder="$t('common.min_amount')"/> <span>~</span>
                        <input type="text" v-model="query.amount_lte" class="form-control inline w-sm" v-bind:placeholder="$t('common.max_amount')"/>
                        <button class="md-btn w-xs blue pull-right" type="submit" ref="submitButton">{{$t('common.search')}}</button>
                    </div>
                </div>
                <div class="row m-t-sm">
                      <div class="col-xs-12">
                        <select class="pull-left form-control w-sm c-select m-r-xs" v-model="selected" @change="updateDateFilter" ref="selected">
                            <option value="0">{{$t('common.applied_at')}}</option>
                            <option value="1">{{$t('common.status_updated_at')}}</option>
                        </select>
                        <date-picker
                            :ref="created_at"
                            width='222'
                            :not-after="today"
                            :shortcuts="shortcuts"
                            class="pull-left m-r-xs"
                            type="date"
                            v-model="created_at"
                            v-if="selected === '0'"
                            format="yyyy-MM-dd"
                            range
                        />
                        <date-picker
                            width='222'
                            :not-after="today"
                            :shortcuts="shortcuts"
                            class="pull-left m-r-xs"
                            type="date"
                            v-model="updated_at"
                            v-else
                            format="yyyy-MM-dd"
                            range
                        />
                        <button class="md-btn w-xs pull-right btn" type="button" @click="clearall">{{$t('action.clear_all')}}</button>
                      </div>
                </div>
            </div>
        </div>
    </form>
      <div class="row">
        <div class="col-xs-12">
          <div class="pull-right" v-if="$root.permissions.includes('export_remit_report')">
          <a :href="href" :getReport="getReport" v-if="queryset.length">
            <span>{{ $t('action.download') }}<i class="material-icons">&#xe2c4;</i></span>
          </a>
          <span disabled v-else>{{ $t('action.download') }}<i class="material-icons">&#xe2c4;</i></span>
          </div>
          <div class="pull-right total-amount m-r">
            <span>{{$t('common.total')}} {{$t('nav.remit')}}: </span>
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
                      <th>{{$t('bill.created_at')}}</th>
                      <th>{{$t('bill.depositor')}}</th>
                      <th>{{$t('common.balance_before')}}</th>
                      <th>{{$t('common.balance_after')}}</th>
                      <th>{{$t('common.amount')}}</th>
                      <th>{{$t('bank.name')}} - {{$t('bill.remit_payee')}}</th>
                      <th>{{$t('common.memo')}}</th>
                      <th>{{$t('common.status_updated_at')}}</th>
                      <th>{{$t('common.operator')}}</th>
                      <th>{{$t('common.status')}}</th>
                  </tr>
              </thead>
              <tbody v-if="queryset.length >0">
                  <tr v-for="t in queryset" :key="t.id">
                      <td>
                        <router-link :to="'/transaction/' + t.id">{{t.transaction_id}}</router-link>
                      </td>
                      <td>
                        <router-link :to="'/member/' + t.member.id">{{t.member.username}}</router-link>
                      </td>
                      <td>
                        <router-link :to="'/level/' + t.member.level.id">{{t.member.level.name}}</router-link>
                      </td>
                      <td><span v-if="t.remit_info">{{t.remit_info.deposited_at | moment("YYYY-MM-DD HH:mm")}}</span></td>
                      <td><span v-if="t.remit_info">{{t.remit_info.depositor}}</span></td>
                      <td>
                        <span v-if="t.balance_before">{{t.balance_before | currency('￥')}}</span>
                        <span v-else>-</span>
                      </td>
                      <td>
                        <span v-if="t.balance_after">{{t.balance_after | currency('￥')}}</span>
                        <span v-else>-</span>
                      </td>
                      <td>{{t.amount | currency('￥')}}</td>
                      <td>
                        <router-link :to="'/remit_payee/' + t.remit_info.remit_payee.id" v-if="t.remit_info.remit_payee.payee_name && t.remit_info.remit_payee.bank.name">
                          {{t.remit_info.remit_payee.bank.name}} - {{t.remit_info.remit_payee.payee_name}}
                        </router-link>
                        <router-link :to="'/remit_payee/' + t.remit_info.remit_payee.id" v-else-if="t.remit_info.remit_payee.nickname">
                          {{t.remit_info.remit_payee.nickname}}
                        </router-link>
                          <span v-else> - </span>
                      </td>
                      <td>{{t.memo}}</td>
                      <td>{{t.updated_at | moment("YYYY-MM-DD HH:mm")}}</td>
                      <td>
                          <span v-if="t.updated_by">{{t.updated_by.username}}</span>
                          <span v-else>-</span>
                      </td>
                      <td>
                          <span class="label success" v-if="t.status===1">{{$t('status.success')}}</span>
                          <span class="label danger" v-else-if="t.status===5">{{$t('status.declined')}}</span>
                          <span v-else-if="t.status === 3 && ($root.permissions.includes('allow_remit_transaction') || $root.permissions.includes('refuse_remit_transaction'))">
                              <button 
                                type="button"
                                class="btn btn-xs blue sm-btn m-b-sm f-b"
                                @click="update(t, 1, true, $event)"
                                v-if="$root.permissions.includes('allow_remit_transaction')"
                              >{{$t('bill.audit')}}
                              </button> <br>
                              <button
                                type="button"
                                class="btn btn-xs sm-btn f-b"
                                @click="update(t, 5, true, $event)"
                                v-if="$root.permissions.includes('refuse_remit_transaction')"
                              >{{$t('bill.audit_deny')}}
                              </button>
                          </span>
                          <span v-else>-</span>
                      </td>
                  </tr>
              </tbody>
          </table>
      </div>
      <div class="row m-b-lg">
          <pulling
            :queryset="queryset"
            :extra="'transaction_type=remit'"
            :api="billApi"
            :query="query"
            :amount="total_amount"
            :export_query="export_query"
            @query-data="queryData"
            @query-param="queryParam"
            @amount="totalAmount"
            @export-query="exportQuery"
            ref="pulling" >
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
                query: {
                    id: '',
                    remit_type: '',
                    member_q: '',
                    created_at_0: '',
                    created_at_1: '',
                    amount_gte: '',
                    amount_lte: '',
                    status: '',
                    member_level: '',
                    online_payee: '',
                    updated_by: '',
                    real_name_q: '',
                    updated_at_0: '',
                    updated_at_1: '',
                    report_flag: true
                },
                created_at: ['', ''],
                updated_at: ['', ''],
                member_level: '',
                selected: '0',
                status: '',
                remit_type: '0',
                memo: '',
                total_amount: '',
                href: '',
                export_query: [],
                filter: {
                    created_at_0: Vue.moment().subtract(7, 'days').format(format),
                    created_at_1: Vue.moment().subtract(1, 'days').format(format),
                    updated_at_0: Vue.moment().subtract(7, 'days').format(format),
                    updated_at_1: Vue.moment().subtract(1, 'days').format(format),
                    report_flag: 'True'
                },
                today: Vue.moment().format(format)
            }
        },
        watch: {
            remit_type: function (newObj, old) {
                if (newObj === '0') {
                    this.query.remit_type = ''
                } else {
                    this.query.remit_type = newObj
                }
            },
            status: function (newObj, old) {
                if (newObj === '0') {
                    this.query.status = ''
                } else {
                    this.query.status = newObj
                }
            },
            '$root.remit_count' (newObj, old) {
                this.$refs.pulling.rebase()
            },
            '$route': {
                handler () {
                    this.checkRouteQuery()
                    this.queryset = []
                    this.$refs.pulling.rebase()
                },
                deep: true
            },
            id (newObj, old) {
                this.query.transaction_id = newObj
            },
            created_at (newObj) {
                [this.query.created_at_0, this.query.created_at_1] = newObj.map(e => e && Vue.moment(e).format(format))
            },
            updated_at (newObj) {
                [this.query.updated_at_0, this.query.updated_at_1] = newObj.map(e => e && Vue.moment(e).format(format))
            }
        },
        created () {
            this.setStatus()
            this.checkRouteQuery()
            this.$nextTick(() => {
                this.$refs.pulling.rebase()
            })
        },
        computed: {
            getReport () {
                this.$refs.pulling.getExportQuery()
                this.href = `${api.report_deposit}?token=${VueCookie.get('access_token')}&report=remit&${this.export_query}`
                return this.queryset.length
            },
            shortcuts () {
                return ['today', 'yesterday', 'this_week', 'this_month', 'last_month'].map(element => Object({
                    text: this.$t(`common.${element}`),
                    start: date[element][0],
                    end: date[element][1]
                }))
            }
        },
        methods: {
            nextTickFetch () {
                this.setStatus()
                this.queryset = []
                this.$refs.pulling.rebase()
            },
            checkRouteQuery () {
                this.created_at = [this.$route.query.created_at_0, this.$route.query.created_at_1]
                this.updated_at = [this.$route.query.updated_at_0, this.$route.query.updated_at_1]
            },
            changeFromLevel (val) {
                this.query.member_level = val
                this.member_level = val
            },
            queryData (queryset) {
                this.query = Object.assign({}, this.filter)
                if (this.query.transaction_id) {
                    this.query.id = this.query.transaction_id
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
            clearall: function () {
                this.query = {}
                this.status = '0'
                this.remit_type = '0'
                this.member_level = ''
                this.selected = '0'
                this.$router.push({
                    path: this.$route.path
                })
            },
            updateDateFilter: function () {
                this.clearDateFilter()
                return this.selected
            },
            clearDateFilter () {
                this.query = {
                    ...this.query,
                    created_at_0: '',
                    created_at_1: '',
                    updated_at_0: '',
                    updated_at_1: ''
                }
                this.$nextTick(() => {
                    this.$router.push({
                        path: this.$route.path,
                        query: this.query
                    })
                })
            },
            update (transaction, status, confirm, event) {
                // type remit, onlinepay, withdraw
                if (confirm) {
                    if (!window.confirm(this.$t('bill.confirm_declined', {
                        action: event.target.innerText
                    }))) {
                        return
                    }
                }
                if (transaction.id) {
                    this.$http.put(api.bill + transaction.id + '/?opt_expand=bank,updated_by', {
                        status: status
                    }).then(data => {
                        transaction.status = data.status
                        transaction.balance_after = data.balance_after
                    }, error => {
                        this.errorMsg = error
                    })
                }
            },
            setStatus () {
                let status = this.$route.query.status
                this.status = status || '0'
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

<style scoped lang="scss">
    .f-b{font-weight: bold}
</style>
