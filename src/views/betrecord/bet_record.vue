<template>
    <div>
      <div class="m-b">
        <div v-show="pageSelected == 'today'" class="h6">{{$t('nav.recent_bet_records')}}</div>
        <div v-show="pageSelected == 'history'" class="h6">{{$t('nav.bet_record_history')}}</div>
        <div v-show="pageSelected == 'realtime'">
          <div class="row">
            <div class="col-xs-12">
              <div class="h6 inline">{{$t('nav.instant_view')}}</div> 
              <div class="pull-right inline">
                <button class="md-btn w-sm blue m-r-sm inline" type="submit" @click="refresh">{{$t('common.refresh')}}</button>
                <button class="md-btn w-sm" type="submit" @click="newWindow">{{$t('common.new_window')}}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="pageSelected == 'today' || pageSelected == 'history'">
        <form class="form text-sm" v-on:submit.prevent="submit" >
          <div class="box">
            <div class="box-body clearfix form-inline form-input-sm">
              <div class="row">
                <div class="col-xs-12">
                  <input type="text" v-model="query.member_q" class="form-control w-sm pull-left m-r-xs" v-bind:placeholder="$t('common.member')"/>
                  <input type="text" v-model="query.id" class="form-control w-sm pull-left m-r-xs" v-bind:placeholder="$t('report.bet_record_number')"/>
                  <select class="form-control c-select pull-left m-r-xs" v-model="status" type="search">
                    <option value="0">{{$t('common.status')}} </option>
                    <option value="ongoing">{{$t('betrecord.ongoing')}}</option>
                    <option value="win">{{$t('betrecord.win')}}</option>
                    <option value="lose">{{$t('betrecord.lose')}}</option>
                    <option value="cancelled">{{$t('status.cancelled')}}</option>
                    <option value="tie">{{$t('betrecord.tie')}}</option>
                  </select>
                  <div class="pull-left m-r-xs">
                    <input type="text" v-model="query.bet_gte" class="form-control w-sm" v-bind:placeholder="$t('common.min_amount')"/>
                    <span>~</span>
                    <input type="text" v-model="query.bet_lte" class="form-control w-sm" v-bind:placeholder="$t('common.max_amount')"/>
                  </div>
                  <div class="pull-left m-r-xs" v-if="pageSelected === 'history'">
                    <date-picker width='140' v-model="created_at_0"></date-picker>
                    <span>~</span>
                    <date-picker width='140' v-model="created_at_1"></date-picker>
                    </div>
                  <button class="md-btn w-xs blue pull-right" type="submit">{{$t('common.search')}}</button>
                </div>
                <div class="col-xs-12 m-t-sm">
                    <select class="col-xs-2 w-md c-select m-r-xs" v-model="game">
                    <option value="0">{{$t('common.game')}}</option>
                    <option name="game" :value="game.id" v-for="(game, index) in gamelist" :key="game.id">
                        <i class="blue">{{game.display_name}}</i>
                    </option>
                  </select>
                  <select class="form-control c-select" width="240" v-model="game_category" :disabled="game == '0'">
                    <option value="0" hidden>{{$t('common.gamecategory')}}</option>
                    <option name="game" :value="category.id" v-for="(category, index) in categories" :key="category.id">
                        <i class="blue">{{category.display_name}}</i>
                    </option>
                  </select>
                    <button class="md-btn w-xs grey-400 pull-right" type="button" @click="clearall">{{$t('action.clear_all')}}</button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div v-else>
        <form class="form text-sm">
          <div class="box">
            <div class="box-body clearfix form-inline form-input-sm">
              <div class="row">
                <div class="col-xs-12">
                  <label class="text-sm m-b">游戏选择:</label>
                  <button class="btn-md r w-xs blue no-border m-r-sm" type="button" @click="selectall">{{$t('common.select_all')}}</button>
                  <button class="btn-md r w-xs no-border grey-400" type="button" @click="deselectall">{{$t('common.deselect_all')}}</button>
                </div>
                <div class="col-xs-12">
                  <label class="check m-r m-b" v-for="game in gamelist">
                    <input name="game" type="checkbox" :value="game.id" v-model="filter_game">
                      <i class="blue"></i>
                      {{game.display_name}}
                  </label>
                </div>
                <div class="col-xs-12">
                    <input type="text" v-model="query.member_q" class="form-control w-sm" v-bind:placeholder="$t('common.member')" @input="quickFilter"/>
                    <input type="text" v-model="query.bet_gte" class="form-control inline w-sm" v-bind:placeholder="$t('common.min_amount')"@input="quickFilter"/>
                    <input type="text" v-model="query.issue_number" class="form-control inline w-sm" v-bind:placeholder="$t('game_manage.issue_number')"@input="quickFilter"/>
                    <select class="form-control w-sm c-select inline" v-model="period">
                      <option value="5000">{{$t('betrecord.five_seconds')}}</option>
                      <option value="10000">{{$t('betrecord.ten_seconds')}}</option>
                      <option value="30000">{{$t('betrecord.thirty_seconds')}}</option>
                      <option value="60000">{{$t('betrecord.sixty_seconds')}}</option>
                    </select>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div class="row">
            <div class="col-xs-12">
              <div class="pull-left" v-if="pageSelected === 'realtime'">
                <input type="checkbox" value="1" name="account_type" v-model="account_type">
                <i class="blue"></i>{{$t('action.filter_trial_account')}}
              </div>
              <div class="pull-right total-amount" v-show="pageSelected == 'today' || pageSelected == 'history'">
                <span>{{$t('betrecord.total_profit')}} : </span>
                <span v-if="queryset.length">{{total_profit | currency('￥')}}</span>
                <span v-else>{{0 | currency('￥')}}</span>
              </div>
              <div class="pull-right total-amount m-r" v-show="pageSelected == 'today' || pageSelected == 'history'">
                <span>{{$t('betrecord.total_bet_amount')}} : </span>
                <span v-if="queryset.length">{{total_amount | currency('￥')}}</span>
                <span v-else>{{0 | currency('￥')}}</span>
              </div>
            </div>
          </div>
      <div class="box" v-if="pageSelected == 'today' || pageSelected == 'history'">
        <table class="table table-striped">
          <thead>
          <tr>
            <th>{{$t('report.bet_record_number')}}</th>
            <th>{{$t('common.settledat')}}</th>
            <th>{{$t('common.member')}}</th>
            <th>{{$t('common.game')}}</th>
            <th>{{$t('game_manage.issue_number')}}</th>
            <th>{{$t('game_manage.play')}}</th>
            <th>{{$t('common.betamount')}}</th>
            <th>{{$t('common.settlementamount')}}</th>
            <th>{{$t('game_manage.odds')}}</th>
            <th>{{$t('common.profit')}}</th>
            <th>{{$t('common.status')}}</th>
            <th>{{$t('betrecord.cancel_bet')}}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="t in queryset">
            <td>
              <router-link :to="'/report/betrecord/' + t.id">{{t.id}}</router-link>
            </td>
            <td>
              {{t.created_at | moment("YYYY-MM-DD HH:mm:ss")}}
            </td>
            <td>
              <router-link :to="'/member/' + t.member.id">{{t.member.username}}</router-link>
            </td>
            <td>
              {{t.game.display_name}}
            </td>
            <td>
              {{t.issue_number}}
            </td>
            <td>
              {{t.play.play_group.display_name}} @ {{t.play.display_name}}
            </td>
            <td>
              {{t.bet_amount | currency('￥')}}
            </td>
            <td>
              {{t.settlement_amount | currency('￥')}}
            </td>
            <td>
              {{t.odds}}
            </td>
            <td v-if="t.profit">{{t.profit | currency('￥')}}</td>
            <td v-else-if="t.profit == 0">{{0 | currency('￥')}}</td>
            <td v-else>-</td>
            <td>
              <div class="flex-value status">
                <span class="label danger" v-if="t.status === 'lose'">{{$t('betrecord.lose')}}</span>
                <span class="label success" v-if="t.status === 'win'">{{$t('betrecord.win')}}</span>
                <span class="label ongoing" v-if="t.status === 'ongoing'">{{$t('betrecord.ongoing')}}</span>
                <span class="label ongoing" v-if="t.status === 'tie'">{{$t('betrecord.tie')}}</span>
                <span class="label ongoing" v-if="t.status === 'cancelled'">{{$t('status.cancelled')}}</span>
              </div>
            </td>
            <td>
              <span v-if="t.status === 'ongoing'">
              <button type="button" class="btn btn-xs blue-300 sm-btn m-b-sm f-b" @click="cancelBet(t, 'cancelled', true, $event)">{{$t('betrecord.cancel_bet')}}</button> <br>
              </span>
              <span v-else>-
              </span>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="box" v-else>
        <table class="table table-striped">
          <thead>
          <tr>
            <th>{{$t('report.bet_record_number')}}</th>
            <th>{{$t('common.settledat')}}</th>
            <th>{{$t('common.member')}}</th>
            <th>{{$t('member.account_type')}}</th>
            <th>{{$t('common.game')}}</th>
            <th>{{$t('game_manage.issue_number')}}</th>
            <th>{{$t('game_manage.play')}}</th>
            <th>{{$t('game_manage.return_rate')}}(%)</th>
            <th>{{$t('common.betamount')}}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="t in queryset">
            <td>
              <router-link :to="'/report/betrecord/' + t.id">{{t.id}}</router-link>
            </td>
            <td>
              {{t.created_at | moment("YYYY-MM-DD HH:mm:ss")}}
            </td>
            <td>
              <router-link :to="'/member/' + t.member.id" v-if="t.member.account_type===1">{{t.member.username}}</router-link>
              <span v-else>{{ $t('member.visitor') }}</span>
            </td>
            <td>
              {{ t.member.account_type === 1 ? $t('member.real_account') : $t('member.trial_account') }}
            </td>
            <td>
              {{t.game.display_name}}
            </td>
            <td>
              {{t.issue_number}}
            </td>
            <td>
              {{t.play.play_group.display_name}} @ {{t.play.display_name}}
            </td>
            <td>
              {{t.return_rate}}%
            </td>
            <td>
              {{t.bet_amount | currency('￥')}}
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
    import Vue from 'vue'
    import VueCookie from 'vue-cookie'

    const format = 'YYYY-MM-DD'
    export default {
        data () {
            return {
                created_at_0: '',
                created_at_1: '',
                queryset: [],
                betApi: api.betrecords,
                query: {
                    betrecord_id: '',
                    member_q: '',
                    game_q: [],
                    bet_gte: '',
                    bet_lte: '',
                    created_at_0: '',
                    created_at_1: '',
                    settlement_gte: '',
                    settlement_lte: '',
                    status: '',
                    category: '',
                    report_flag: true,
                    account_type: '1'
                },
                account_type: '1',
                period: undefined,
                pageSelected: '',
                game_category: '0',
                categories: [],
                gamelist: [],
                game: '0',
                filter_game: [],
                filter: {},
                status: '0',
                total_amount: '',
                total_profit: '',
                total_bet_amount: '',
                today: Vue.moment().format(format),
                yesterday: Vue.moment().subtract(1, 'days').format(format)
            }
        },
        created () {
            this.getGameList()
            this.getPageAccessed()
            this.$nextTick(() => {
                this.$refs.pulling.rebase()
            })
        },
        watch: {
            account_type: function (newObj, old) {
                if (newObj === true) {
                    this.query.account_type = '1'
                } else {
                    this.query.account_type = ''
                }
                this.submit()
            },
            status: function (newObj, old) {
                if (this.status === '0') {
                    this.query.status = ''
                } else {
                    this.query.status = newObj
                }
            },
            game: function (newObj, old) {
                if (this.game === '0') {
                    this.query.game_q = ''
                } else {
                    this.query.game_q = newObj
                    this.game_category = '0'
                    this.getGameCategory()
                }
            },
            game_category: function (newObj, old) {
                this.query.category = newObj
            },
            filter_game: function (newObj, old) {
                if (this.filter_game !== []) {
                    this.query.game_q = newObj
                    this.submit()
                }
            },
            '$route': 'nextTickFetch',
            created_at_0 (newObj, old) {
                this.query.created_at_0 = newObj
            },
            created_at_1 (newObj, old) {
                this.query.created_at_1 = newObj
            },
            period (newObj, old) {
                clearInterval(this.interval)
                this.period = newObj
                this.interval = setInterval(this.getBetRecord, parseInt(this.period))
            },
            pageSelected (newObj, old) {
                this.filter_game = []
                this.game = '0'
                this.game_category = '0'
            }
        },
        methods: {
            nextTickFetch () {
                this.queryset = []
                setTimeout(() => {
                    this.getPageAccessed()
                    this.$router.push({
                        path: this.$route.path + '?report_flag=true',
                        query: this.query
                    })
                    this.$refs.pulling.rebase()
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
            submit () {
                this.$refs.pulling.submit()
            },
            clearall: function () {
                this.status = '0'
                this.game = '0'
                this.query = {}
                if (this.pageSelected === 'today') {
                    this.query.created_at_0 = this.created_at_0
                    this.query.created_at_1 = this.created_at_1
                } else if (this.pageSelected === 'history') {
                    this.query.created_at_1 = this.created_at_1
                } else {
                    this.created_at_0 = ''
                    this.created_at_1 = ''
                }
                this.quickFilter()
            },
            getGameList () {
                this.$http.get(api.game_list).then(data => {
                    this.gamelist = data
                })
            },
            getPageAccessed () {
                this.router_path = this.$route.path
                if (this.router_path === '/report/betrecord/today') {
                    this.created_at_0 = this.today
                    this.created_at_1 = this.today
                    if (this.$route.query.member && this.$route.query.created_at_0 && this.$route.query.created_at_1) {
                        this.query.member = this.$route.query.member
                    }
                    this.pageSelected = 'today'
                } else if (this.router_path === '/report/betrecord/history') {
                    this.created_at_0 = ''
                    this.created_at_1 = this.yesterday
                    if (this.$route.query.member && this.$route.query.status && this.$route.query.created_at_1) {
                        this.query.member = this.$route.query.member
                        this.query.status = this.$route.query.status
                        this.status = this.query.status
                        this.query.created_at_1 = this.$route.query.created_at_1
                        this.created_at_1 = this.query.created_at_1
                    }
                    this.pageSelected = 'history'
                } else if (this.router_path === '/report/betrecord/realtime') {
                    this.created_at_0 = this.today
                    this.created_at_1 = this.today
                    this.pageSelected = 'realtime'
                    this.period = 10 * 1000
                }
            },
            deselectall () {
                this.filter_game = []
                this.query.game_q = ''
                this.submit()
            },
            selectall () {
                this.filter_game = []
                this.filter_game = this.gamelist.map(game => game.id)
            },
            getGameCategory (game) {
                this.$http.get(api.gamecategory + '?game=' + this.query.game_q).then(data => {
                    this.categories = data
                })
            },
            newWindow () {
                window.open('#' + this.$route.fullPath)
            },
            refresh () {
                this.$router.push({
                    path: this.$route.path + '?report_flag=true'
                })
                this.created_at_1 = this.$route.query.created_at_1
                this.quickFilter()
            },
            quickFilter () {
                this.$router.push({
                    path: this.$route.path + '?report_flag=true',
                    query: this.query
                })
            },
            getBetRecord () {
                if (this.pageSelected === 'realtime') {
                    let authenticationCookie = this.$http.defaults.headers.common['Authorization']
                    if (authenticationCookie) {
                        authenticationCookie = authenticationCookie.split(' ').pop()
                    }
                    let userCookie = VueCookie.get('access_token')
                    if (authenticationCookie === userCookie) {
                        this.queryset = []
                        this.created_at_0 = this.$route.query.created_at_0
                        this.created_at_1 = this.$route.query.created_at_1
                        this.$refs.pulling.rebase()
                    }
                }
            },
            cancelBet (betrecord, status, confirm, event) {
                if (confirm) {
                    if (!window.confirm(this.$t('bill.confirm_declined', {
                        action: event.target.innerText
                    }))) {
                        return
                    }
                }
                if (betrecord.id) {
                    this.$http.put(api.cancel_bet + betrecord.id + '/', {
                        status: status
                    }).then(data => {
                        betrecord.status = data.status
                    }, error => {
                        this.errorMsg = error
                    })
                }
            }
        },
        components: {
            pulling,
            DatePicker
        },
        beforeDestroy () {
            if (this.pageSelected === 'realtime') {
                clearInterval(this.interval)
            }
        }
    }
</script>
