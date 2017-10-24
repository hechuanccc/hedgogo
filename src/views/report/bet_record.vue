<template>
    <div>
      <form class="form text-sm" v-on:submit.prevent="submit">
        <div class="box">
          <div class="box-body clearfix form-inline form-input-sm">
            <div class="row">
              <div class="col-xs-2">
                <label class="text-sm m-r">{{$t('common.member')}}</label>
                <input type="text" v-model="query.member_q" class="form-control w-sm" />
              </div>
              <div class="col-xs-2">
                <label class="text-sm m-r">{{$t('common.game')}}</label>
                <input type="text" v-model="query.game_q" class="form-control w-sm" />
              </div>
              <div class="col-xs-6">
                <label class="text-sm">{{$t('common.status')}}</label>
                <label class="md-check md-check-md m-r">
                  <input type="checkbox" value="3" name="status" v-model="bet_status">
                  <i class="blue"></i>
                  {{$t('betrecord.bet')}}
                </label>
                <label class="md-check md-check-md m-r">
                  <input type="checkbox" value="2" name="status" v-model="bet_status">
                  <i class="blue"></i>
                  {{$t('betrecord.win')}}
                </label>
                <label class="md-check md-check-md m-r">
                  <input type="checkbox" value="1" name="status" v-model="bet_status">
                  <i class="blue"></i>
                  {{$t('betrecord.ongoing')}}
                </label>
              </div>
              <div class="col-xs-2">
                <button class="md-btn w-sm blue pull-right" type="submit">{{$t('common.search')}}</button>
              </div>
            </div>
            <div class="row m-t">
              <div class="col-xs-4">
                <label class="m-r ">{{$t('common.betdate')}}</label>
                <date-picker width='140' v-model="created_at_0"></date-picker>
                <span>~</span>
                <date-picker width='140' v-model="created_at_1"></date-picker>
              </div>
              <div class="col-xs-4">
                <label class="m-r">{{$t('common.betamount')}}</label>
                <input type="text" v-model="query.bet_gte" class="form-control inline w-sm" />
                <span>~</span>
                <input type="text" v-model="query.bet_lte" class="form-control inline w-sm" />
              </div>
            </div>
          </div>
        </div>
      </form>
      <div class="box">
        <table class="table table-striped">
          <thead>
          <tr>
            <th>{{$t('report.bet_record_number')}}</th>
            <th>{{$t('common.member')}}</th>
            <th>{{$t('common.game')}}</th>
            <th>{{$t('common.settledat')}}</th>
            <th>{{$t('common.betamount')}}</th>
            <th>{{$t('common.settlementamount')}}</th>
            <th>{{$t('common.profit')}}</th>
            <th>{{$t('common.status')}}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="total_amount || total_profit || total_bet_amount" class="table-amount">
            <td class="" colspan="5">总计</td>
            <td>{{total_bet_amount | currency('￥')}}</td>
            <td colspan="2">{{total_amount | currency('￥')}}</td>
            <td colspan="2">{{total_profit | currency('￥')}}</td>
          </tr>
          <tr v-for="t in queryset">
            <td>
              <router-link :to="'/report/betrecord/' + t.id">{{t.id}}</router-link>
            </td>
            <td>
              <router-link :to="'/member/' + t.member.id">{{t.member}}</router-link>
            </td>
            <td>
              {{t.game_play}}
            </td>
            <td>
              {{t.created_at | moment("YYYY-MM-DD HH:mm")}}
            </td>
            <td>
              {{t.bet_amount | currency('￥')}}
            </td>
            <td>
              {{t.settlement_amount | currency('￥')}}
            </td>
            <td>
              {{t.profit | currency('￥')}}
            </td>
            <td>
              <div class="flex-value status">
                <span class="label danger" v-if="t.bet_status === 3">{{$t('betrecord.bet')}}</span>
                <span class="label success" v-if="t.bet_status === 2">{{$t('betrecord.win')}}</span>
                <span class="label ongoing" v-if="t.bet_status === 1">{{$t('betrecord.ongoing')}}</span>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="row m-b-lg">
        <pulling
          :queryset="queryset"
          :query="query"
          :total_bet_amount="total_bet_amount"
          @query-data="queryData"
          @query-param="queryParam"
          @amount="totalAmount"
          @profit="totalProfit"
          @totalBet="totalBet"
          :api="betApi"
          ref="pulling">
        </pulling>
      </div>
    </div>
</template>
<script>
    import api from '../../api'
    import pulling from '../../components/pulling'
    import DatePicker from 'vue2-datepicker'
    export default {
        data () {
            return {
                created_at_0: '',
                created_at_1: '',
                queryset: [],
                betApi: api.betrecords,
                query: {
                    member_q: '',
                    game_q: '',
                    bet_gte: '',
                    bet_lte: '',
                    created_at_0: '',
                    created_at_1: '',
                    settlement_gte: '',
                    settlement_lte: '',
                    bet_status: [],
                    report_flag: true
                },
                filter: {},
                bet_status: [],
                total_amount: '',
                total_profit: '',
                total_bet_amount: ''
            }
        },
        created () {
            let results = this.$route.query.result
            if (results) {
                this.result = results.split(',')
            }
            this.$nextTick(() => {
                this.$refs.pulling.rebase()
                // this.getGameFilter()
            })
        },
        watch: {
            bet_status: function (old, newObj) {
                this.query.bet_status = old
            },
            '$route': 'nextTickFetch',
            created_at_0 (newObj, old) {
                this.query.created_at_0 = newObj
            },
            created_at_1 (newObj, old) {
                this.query.created_at_1 = newObj
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
            totalAmount (amount) {
                this.total_amount = amount
            },
            totalProfit (profit) {
                this.total_profit = profit
            },
            totalBet (val) {
                this.total_bet_amount = val
            },
            submit () {
                this.$refs.pulling.submit()
            }
            // getGameFilter () {
            //     this.$http.get(api.gamecategory).then(response => {
            //         this.categories = response.data
            //     })
            // }
        },
        components: {
            pulling,
            DatePicker
        }
    }
</script>
