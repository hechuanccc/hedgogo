<template>
    <div>
      <form class="form" v-on:submit.prevent="submit">
        <div class="box">
            <div class="box-body clearfix form-inline form-input-sm">
                <div class="row">
                    <div class="col-xs-2">
                        <label class="text-sm">{{$t('bill.order_id')}}</label>
                        <input type="text" v-model="order_id" @keyup="removeSpace()" class="form-control w-sm" />
                    </div>
                    <div class="col-xs-2">
                        <label class="text-sm">{{$t('common.member')}}</label>
                        <input type="text" v-model="query.member_q" class="form-control w-sm" />
                    </div>
                    <div class="col-xs-6">
                        <label class="text-sm">{{$t('common.status')}}</label>
                        <label class="md-check md-check-md m-r">
                            <input type="checkbox" value="1" name="status" v-model="status">
                            <i class="blue"></i>
                            {{$t('status.success')}}
                        </label>
                        <label class="md-check m-r">
                            <input type="checkbox" value="2" name="status" v-model="status">
                            <i class="blue"></i>
                            {{$t('status.failed')}}
                        </label>
                        <label class="md-check m-r">
                            <input type="checkbox" value="3" name="status" v-model="status">
                            <i class="blue"></i>
                            {{$t('status.ongoing')}}
                        </label>
                        <label class="md-check m-r">
                            <input type="checkbox" value="4" name="status" v-model="status">
                            <i class="blue"></i>
                            {{$t('status.canceled')}}
                        </label>
                        <label class="md-check m-r">
                            <input type="checkbox" value="5" name="status" v-model="status">
                            <i class="blue"></i>
                            {{$t('status.declined')}}
                        </label>
                    </div>
                    <div class="col-xs-2">
                        <button class="md-btn w-sm blue pull-right" type="submit">{{$t('common.search')}}</button>
                    </div>
                </div>
                <div class="row m-t">
                    <div class="col-xs-2">
                        <label class="text-sm">{{$t('common.operator')}}</label>
                        <input type="text" v-model="query.updated_by" class="form-control w-sm" />
                    </div>
                    <div class="col-xs-2">
                        <label class="text-sm">{{$t('member.level')}}</label>
                        <level
                          :level="query.member_level"
                          @level-select="changeFromLevel">
                        </level>
                    </div>
                    <div class="col-xs-4">
                        <label class="text-sm">{{$t('common.applied_at')}}</label>
                        <date-picker width='140' v-model="created_at_0"></date-picker>
                        <span>~</span>
                        <date-picker width='140' v-model="created_at_1"></date-picker>

                    </div>
                    <div class="col-xs-4">
                        <label class="text-sm">{{$t('common.amount')}}</label>
                        <input type="text" v-model="query.amount_gte" class="form-control inline w-sm" /> <span>~</span>
                        <input type="text" v-model="query.amount_lte" class="form-control inline w-sm" />
                    </div>
                </div>
            </div>
        </div>
    </form>
      <div class="box">
          <table class="table table-striped">
              <thead>
                  <tr>
                      <th>{{$t('bill.order_id')}}</th>
                      <th>{{$t('common.member')}}</th>
                      <th>{{$t('member.level')}}</th>
                      <th>{{$t('bill.depositor')}}</th>
                      <th>{{$t('bill.deposited_at')}}</th>
                      <th>{{$t('bank.name')}} - {{$t('bill.remit_payee')}}</th>
                      <th>{{$t('common.balance_before')}}</th>
                      <th>{{$t('common.balance_after')}}</th>
                      <th>{{$t('common.amount')}}</th>
                      <th>{{$t('common.operator')}}</th>
                      <th>{{$t('common.status_updated_at')}}</th>
                      <th>{{$t('common.status')}}</th>
                  </tr>
              </thead>
              <tbody v-if="queryset.length >0">
                  <tr v-if="total_amount" class="table-amount">
                      <td colspan="8">总计</td>
                      <td colspan="4">{{total_amount | currency('￥')}}</td>
                  </tr>
                  <tr v-for="t in queryset" >
                      <td>
                        <router-link :to="'/transaction/' + t.id">{{t.id}}</router-link>
                      </td>
                      <td>
                        <router-link :to="'/member/' + t.member.id">{{t.member.username}}</router-link>
                      </td>
                      <td>
                        <router-link :to="'/level/' + t.member.level.id">{{t.member.level.name}}</router-link>
                      </td>
                      <td>{{t.remit_info.depositor}}</td>
                      <td>{{t.remit_info.deposited_at | moment("YYYY-MM-DD HH:mm")}}</td>
                      <td>
                        <router-link :to="'/remit_payee/' + t.remit_info.remit_payee.id" v-if="t.remit_info.remit_payee" >{{t.remit_info.remit_payee.bank.name}} - {{t.remit_info.remit_payee.payee_name}}</router-link>
                          <span v-else> - </span>
                      </td>
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
                          <span v-if="t.updated_by">{{t.updated_by.username}}</span>
                          <span v-else>-</span>
                      </td>
                      <td>{{t.updated_at | moment("YYYY-MM-DD HH:mm")}}</td>

                      <td>
                          <span class="label success" v-if="t.status===1">{{$t('status.success')}}</span>
                          <span class="label danger" v-if="t.status===5">{{$t('status.declined')}}</span>
                          <span v-if="t.status===3">
                              <button type="button" class="btn btn-xs blue sm-btn m-b-sm f-b" @click="update(t, 1, true, $event)">{{$t('bill.audit')}}</button> <br>
                              <button type="button" class="btn btn-xs  sm-btn f-b" v-if="$root.permissions.includes('decline_payment')" @click="update(t, 5, true, $event)">{{$t('bill.audit_deny')}}</button>
                          </span>
                      </td>
                  </tr>
              </tbody>
          </table>
          <div class="report-button" v-if="queryset.length">
              <div class="col-xs-2 pull-right">
                  <a :href="href" class="grey-400 md-btn w-sm" :getReport="getReport">{{$t('returnrate.export')}}</a>
              </div>
          </div>
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
    import { handleError } from '../../utils/handleError'
    import VueCookie from 'vue-cookie'

    export default {
        data () {
            return {
                created_at_0: '',
                created_at_1: '',
                queryset: [],
                billApi: api.bill,
                order_id: '',
                query: {
                    id: '',
                    member_q: '',
                    created_at_0: '',
                    created_at_1: '',
                    amount_gte: '',
                    amount_lte: '',
                    status: [],
                    member_level: '',
                    online_payee: '',
                    updated_by: '',
                    report_flag: true
                },
                status: [],
                total_amount: '',
                href: '',
                export_query: [],
                filter: {}
            }
        },
        watch: {
            status: function (old, newObj) {
                this.query.status = old
            },
            '$root.remit_count' (newObj, old) {
                this.$refs.pulling.rebase()
            },
            '$route': 'nextTickFetch',
            created_at_0 (newObj, old) {
                this.query.created_at_0 = newObj
            },
            created_at_1 (newObj, old) {
                this.query.created_at_1 = newObj
            },
            order_id (newObj, old) {
                this.query.id = newObj
            }
        },
        created () {
            let status = this.$route.query.status
            if (status) {
                this.status = status.split(',')
            }
            this.$nextTick(() => {
                this.$refs.pulling.rebase()
                this.$refs.pulling.getExportQuery()
            })
        },
        computed: {
            getReport () {
                this.href = `${api.report_deposit}?token=${VueCookie.get('access_token')}&report=remit&${this.export_query}`
                return this.queryset.length
            }
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
            },
            queryData (queryset) {
                this.query = Object.assign({}, this.filter)
                if (this.query.created_at_0) {
                    this.created_at_0 = this.query.created_at_0
                }
                if (this.query.created_at_1) {
                    this.created_at_1 = this.query.created_at_1
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
            exportQuery (expor) {
                this.export_query = expor
            },
            submit () {
                this.$refs.pulling.submit()
                this.$refs.pulling.getExportQuery()
            },
            removeSpace () {
                this.order_id = this.order_id.replace(/[^\d]+/g, '')
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
                    }).then(response => {
                        transaction.status = response.data.status
                        transaction.balance_after = response.data.balance_after
                    }, response => {
                        this.errorMsg = ''
                        for (let field in this.field_locales) {
                            this.errorMsg += handleError(response, field, this.field_locales)
                        }
                    })
                }
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
