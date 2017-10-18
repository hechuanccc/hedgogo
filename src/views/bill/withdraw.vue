<template>
    <div>
      <form class="form" v-on:submit.prevent="submit">
          <div class="box">
              <div class="box-body clearfix form-inline form-input-sm">
                  <div class="row">
                      <div class="col-xs-2">
                          <label class="text-sm">{{$t('bill.order_id')}}</label>
                          <input type="text" v-model="order_id" @keyup="removeSpace" class="form-control w-sm" />
                      </div>
                      <div class="col-xs-2">
                          <label class="text-sm">{{$t('common.member')}}</label>
                          <input type="text" v-model="query.member_q" class="form-control w-sm" />
                      </div>
                      <div class="col-xs-2">
                          <label class="text-sm">{{$t('member.level')}}</label>
                          <level
                            :level="query.member_level"
                            @level-select="changeFromLevel">
                          </level>
                      </div>
                      <div class="col-xs-4 ">
                          <label class="text-sm">{{$t('common.amount')}}</label>
                          <input type="text" v-model="query.amount_gte" class="form-control inline w-sm" /> <span>~</span>
                          <input type="text" v-model="query.amount_lte" class="form-control inline w-sm" />
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
                      <div class="col-xs-4">
                          <label class="text-sm">{{$t('common.applied_at')}}</label>

                          <date-picker width='140' v-model="created_at_0"></date-picker>
                          <span>~</span>
                          <date-picker width='140' v-model="created_at_1"></date-picker>

                      </div>
                      <div class="col-xs-5">
                          <label class="text-sm">{{$t('common.status')}}</label>
                          <label class="md-check m-r">
                              <input type="checkbox" name="status" value="1" v-model="status" />
                              <i class="blue"></i>
                              {{$t('status.success')}}
                          </label>
                          <label class="md-check m-r">
                              <input type="checkbox" name="status" value="2" v-model="status" />
                              <i class="blue"></i>
                              {{$t('status.failed')}}
                          </label>
                          <label class="md-check m-r">
                              <input type="checkbox" name="status" value="3" v-model="status" />
                              <i class="blue"></i>
                              {{$t('status.ongoing')}}
                          </label>
                          <label class="md-check m-r">
                              <input type="checkbox" name="status" value="4" v-model="status" />
                              <i class="blue"></i>
                              {{$t('status.canceled')}}
                          </label>
                          <label class="md-check m-r">
                              <input type="checkbox" name="status" value="5" v-model="status" />
                              <i class="blue"></i>
                              {{$t('status.declined')}}
                          </label>
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
                      <th>{{$t('common.applied_at')}}</th>
                      <th>{{$t('common.balance_before')}}</th>
                      <th>{{$t('common.balance_after')}}</th>
                      <th>{{$t('common.amount')}}</th>
                      <th>{{$t('common.status')}}</th>
                      <th>{{$t('common.status_updated_at')}}</th>
                      <th>{{$t('common.operator')}}</th>
                      <th>{{$t('common.memo')}}</th>
                  </tr>
              </thead>
              <tbody>
                  <tr v-if="total_amount" class="table-amount">
                      <td class="" colspan="6">总计</td>
                      <td colspan="5">{{total_amount | currency('￥')}}</td>
                  </tr>
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
                      <td>
                          <span class="label success" v-if="t.status===1">{{$t('status.success')}}</span>
                          <span class="label danger" v-if="t.status===2">{{$t('status.failed')}}</span>
                          <router-link class="label warn pointer" v-if="t.status===3" tag="span" :to="'/transaction/' + t.id">{{$t('status.ongoing')}}</router-link>
                          <span class="label" v-if="t.status===4">{{$t('status.canceled')}}</span>
                          <span class="label danger" v-if="t.status===5">{{$t('status.declined')}}</span>
                      </td>
                      <td>{{t.updated_at | moment("YYYY-MM-DD HH:mm:ss")}}</td>
                      <td>
                          <span v-if="t.updated_by">{{t.updated_by.username}}</span>
                          <span v-else>-</span>
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
    export default {
        data () {
            return {
                created_at_0: '',
                created_at_1: '',
                queryset: [],
                billApi: api.bill,
                order_id: '',
                query: {
                    status: [],
                    id: '',
                    member_q: '',
                    created_at_0: '',
                    created_at_1: '',
                    amount_lte: '',
                    amount_gte: '',
                    member_level: '',
                    operator: '',
                    report_flag: true
                },
                status: [],
                total_amount: '',
                filter: {}
            }
        },
        watch: {
            '$root.withdraw_count' (newObj, old) {
                this.$refs.pulling.rebase()
            },
            status: function (old, newObj) {
                this.query.status = old
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
            submit () {
                this.$refs.pulling.submit()
            },
            removeSpace () {
                this.order_id = this.order_id.replace(/[^\d]+/g, '')
            },
            getAmount () {
                this.$http.get(api.bill + '?transaction_type=remit&status=' + this.status).then(response => {
                    this.remitPrompt = response.data.length
                })
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
