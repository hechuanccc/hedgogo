<template>
    <div>
        <div class="m-b" v-if="pageSelected === 'realtime'">
            <div class="row">
                <div class="col-xs-12">
                    <div class="pull-right inline">
                        <button
                            class="md-btn w-sm blue m-r-xs inline"
                            type="submit"
                            @click="refresh"
                        >{{ $t('common.refresh') }}
                        </button>
                        <button
                            class="md-btn w-sm"
                            type="submit"
                            @click="newWindow"
                        >{{ $t('common.new_window') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="pageSelected === 'today' || pageSelected === 'history'">
            <form class="form text-sm" v-on:submit.prevent="submit" >
                <div class="box">
                    <div class="box-body clearfix form-inline form-input-sm">
                        <div class="row">
                            <div class="col-xs-12">
                                <input
                                    type="text"
                                    v-model="query.member_q"
                                    class="form-control w-sm pull-left m-r-xs"
                                    :placeholder="$t('common.member')"
                                />
                                <input
                                    type="text"
                                    v-model="query.id"
                                    class="form-control w-sm pull-left m-r-xs"
                                    :placeholder="$t('report.bet_record_number')"
                                />
                                <select
                                    class="form-control c-select pull-left m-r-xs"
                                    v-model="status"
                                    type="search"
                                >
                                    <option value="">{{ $t('common.status') }} </option>
                                    <option value="ongoing">{{ $t('betrecord.ongoing') }}</option>
                                    <option value="win">{{ $t('betrecord.win') }}</option>
                                    <option value="lose">{{ $t('betrecord.lose') }}</option>
                                    <option value="cancelled">{{ $t('status.cancelled') }}</option>
                                    <option value="tie">{{ $t('betrecord.tie') }}</option>
                                    <option value="no_draw">{{ $t('game_history.no_draw') }}</option>
                                </select>
                                <div class="pull-left m-r-xs">
                                    <input
                                        type="text"
                                        v-model="query.bet_gte"
                                        class="form-control w-sm"
                                        :placeholder="$t('common.min_amount')"
                                    />
                                    <span>~</span>
                                    <input
                                        type="text"
                                        v-model="query.bet_lte"
                                        class="form-control w-sm"
                                        v-bind:placeholder="$t('common.max_amount')"
                                    />
                                </div>
                                <div class="pull-left m-r-xs" v-if="pageSelected === 'history'">
                                    <date-picker
                                        width='224'
                                        :not-after="yesterday"
                                        :shortcuts="shortcuts"
                                        class="pull-left m-r-xs"
                                        type="date"
                                        v-model="created_at"
                                        format="yyyy-MM-dd"
                                        range
                                    />
                                </div>
                                <button class="md-btn w-xs blue pull-right" type="submit">
                                    {{ $t('common.search') }}
                                </button>
                            </div>
                            <div class="col-xs-12 m-t-sm">
                                <game-selector
                                    class="pull-left m-r-xs"
                                    :attribute="'id'"
                                    :game="game"
                                    @game-select="gameSelect"
                                    :placeholder="$t('common.game')"
                                    opt_fields="id,display_name,code"
                                />
                                <select
                                    class="form-control pull-left c-select"
                                    style="width: 224px;"
                                    v-model="game_category" 
                                    :disabled="!game || categories.length === 0"
                                >
                                    <option value="" hidden>{{ $t('common.gamecategory') }}</option>
                                    <option
                                        name="game"
                                        v-for="category in categories"
                                        :value="category.id"
                                        :key="category.id"
                                    >
                                        <i class="blue">{{ category.display_name }}</i>
                                    </option>
                                </select>
                                <button class="md-btn w-xs grey-400 pull-right" type="button" @click="clearall">{{ $t('action.clear_all') }}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
        <div v-else-if="pageSelected === 'realtime'">
            <form class="form text-sm">
                <div class="box">
                    <div class="box-body clearfix form-inline form-input-sm">
                        <div class="row">
                            <div class="col-xs-12">
                                <label class="text-sm m-b">{{ $t('betrecord.game_selection') }}</label>
                                <button
                                    class="btn-md r w-xs blue no-border m-r-sm"
                                    type="button"
                                    @click="selectall"
                                >{{ $t('common.select_all') }}
                                </button>
                                <button
                                    class="btn-md r w-xs no-border grey-400"
                                    type="button"
                                    @click="deselectall"
                                >{{ $t('common.deselect_all') }}
                                </button>
                            </div>
                            <div class="col-xs-12">
                                <label class="check m-r m-b" v-for="game in gamelist" :key="game.id">
                                    <input
                                        name="game"
                                        type="checkbox"
                                        :value="`${game.id}`"
                                        v-model="filter_game"
                                    />
                                    <i class="blue"></i>
                                    {{ game.display_name }}
                                </label>
                            </div>
                            <div class="col-xs-12">
                                <input
                                    type="text"
                                    v-model="query.member_q"
                                    class="form-control w-sm"
                                    :placeholder="$t('common.member')"
                                    @input="quickFilter"
                                />
                                <input
                                    type="text"
                                    v-model="query.bet_gte"
                                    class="form-control inline w-sm"
                                    :placeholder="$t('common.min_amount')"
                                    @input="quickFilter"
                                />
                                <input
                                    type="text"
                                    v-model="query.issue_number"
                                    class="form-control inline w-sm"
                                    :placeholder="$t('game_manage.issue_number')"
                                    @input="quickFilter"
                                />
                                <select class="form-control w-sm c-select inline" v-model="period">
                                    <option value="5000">{{ $t('betrecord.five_seconds') }}</option>
                                    <option value="10000">{{ $t('betrecord.ten_seconds') }}</option>
                                    <option value="30000">{{ $t('betrecord.thirty_seconds') }}</option>
                                    <option value="60000">{{ $t('betrecord.sixty_seconds') }}</option>
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
                    <label class="check">
                        <input type="checkbox" value="1" name="account_type" v-model="account_type"/>
                        <i class="blue"></i>
                        {{ $t('action.filter_trial_account') }}
                    </label>
                </div>
                <div class="pull-right total-amount" v-show="pageSelected === 'today' || pageSelected === 'history'">
                    <span>{{ $t('betrecord.total_profit') }} : </span>
                    <span v-if="queryset.length">{{ total_profit | currency('￥') }}</span>
                    <span v-else>{{ 0 | currency('￥') }}</span>
                    <span>|</span>
                    <span>{{ $t('betrecord.total_bet_amount') }} : </span>
                    <span v-if="queryset.length">{{ total_amount | currency('￥') }}</span>
                    <span v-else>{{ 0 | currency('￥') }}</span>
                </div>
            </div>
        </div>
        <div class="box" v-if="pageSelected === 'today' || pageSelected === 'history'">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>{{ $t('report.bet_record_number') }}</th>
                        <th>{{ $t('common.settledat') }}</th>
                        <th>{{ $t('common.member') }}</th>
                        <th>{{ $t('common.game') }}</th>
                        <th>{{ $t('game_manage.issue_number') }}</th>
                        <th>{{ $t('game_manage.play') }}</th>
                        <th>{{ $t('common.betamount') }}</th>
                        <th>{{ $t('common.settlementamount') }}</th>
                        <th>{{ $t('game_manage.odds') }}</th>
                        <th>{{ $t('common.profit') }}</th>
                        <th>{{ $t('common.status') }}</th>
                        <th>{{ $t('betrecord.cancel_bet') }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="t in queryset" :key="t.id">
                        <td><router-link :to="'/report/betrecord/' + t.id">{{ t.id }}</router-link></td>
                        <td>{{ t.created_at | moment("YYYY-MM-DD HH:mm:ss") }}</td>
                        <td><router-link :to="'/member/' + t.member.id">{{ t.member.username }}</router-link></td>
                        <td>{{ t.game.display_name }}</td>
                        <td>{{ t.issue_number }}</td>
                        <td>{{ t.play.play_group.display_name }} @ {{ t.play.display_name }}</td>
                        <td>{{ t.bet_amount | currency('￥') }}</td>
                        <td>{{ t.settlement_amount | currency('￥') }}</td>
                        <td>{{ t.odds }}</td>
                        <td v-if="t.profit">{{ t.profit | currency('￥') }}</td>
                        <td v-else-if="t.profit == 0">{{ 0 | currency('￥') }}</td>
                        <td v-else>-</td>
                        <td>
                            <div class="flex-value status">
                                <span class="label danger" v-if="t.status === 'lose'">{{ $t('betrecord.lose') }}</span>
                                <span class="label success" v-if="t.status === 'win'">{{ $t('betrecord.win') }}</span>
                                <span class="label ongoing" v-if="t.status === 'ongoing'">{{ $t('betrecord.ongoing') }}</span>
                                <span class="label ongoing" v-if="t.status === 'tie'">{{ $t('betrecord.tie') }}</span>
                                <span class="label ongoing" v-if="t.status === 'cancelled'">{{ $t('status.cancelled') }}</span>
                                <span class="label ongoing" v-if="t.status === 'no_draw'">{{ $t('game_history.no_draw') }}</span>
                            </div>
                        </td>
                        <td>
                            <span v-if="(t.status === 'ongoing' || t.status === 'no_draw') && $root.permissions.includes('cancel_bet')">
                                <button type="button" class="btn btn-xs blue-300 sm-btn m-b-sm f-b" @click="cancelBet(t, 'cancelled', true, $event)">{{ $t('betrecord.cancel_bet') }}</button> <br>
                            </span>
                            <span v-else>-</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="box" v-else>
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>{{ $t('report.bet_record_number') }}</th>
                        <th>{{ $t('common.settledat') }}</th>
                        <th>{{ $t('common.member') }}</th>
                        <th>{{ $t('member.account_type') }}</th>
                        <th>{{ $t('common.game') }}</th>
                        <th>{{ $t('game_manage.issue_number') }}</th>
                        <th>{{ $t('game_manage.play') }}</th>
                        <th>{{ $t('game_manage.return_rate') }}(%)</th>
                        <th>{{ $t('common.betamount') }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="t in queryset" :key="t.id">
                        <td>
                            <router-link v-if="t.member.account_type === 1" :to="'/report/betrecord/' + t.id">{{ t.id }}</router-link>
                            <span v-else>{{ t.id }}</span>
                        </td>
                        <td>{{ t.created_at | moment("YYYY-MM-DD HH:mm:ss") }}</td>
                        <td>
                            <router-link :to="'/member/' + t.member.id" v-if="t.member.account_type === 1">{{ t.member.username }}</router-link>
                            <span v-else>{{ $t('member.visitor') }}</span>
                        </td>
                        <td>{{ t.member.account_type === 1 ? $t('member.real_account') : $t('member.trial_account') }}</td>
                        <td>{{ t.game.display_name }}</td>
                        <td>{{ t.issue_number }}</td>
                        <td>{{ t.play.play_group.display_name }} @ {{ t.play.display_name }}</td>
                        <td>{{ t.return_rate }}%</td>
                        <td>{{ t.bet_amount | currency('￥') }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="row m-b-lg">
            <pulling
                :api="betApi"
                :queryset="queryset"
                :query="query"
                :total_bet_amount="total_bet_amount"
                :extra="extra"
                @query-data="queryData"
                @query-param="queryParam"
                @amount="totalAmount"
                @profit="totalProfit"
                ref="pulling"
            />
        </div>
    </div>
</template>
<script>
    import api from '../../api'
    import pulling from '../../components/pulling'
    import gameSelector from '../../components/gameSelector'
    import DatePicker from 'vue2-datepicker'
    import VueCookie from 'vue-cookie'
    import date from '../../utils/date'
    import _ from 'lodash'

    export default {
        data () {
            return {
                pageSelected: '',
                queryset: [],
                betApi: api.betrecords,
                extra: '',
                query: {},
                account_type: true,
                status: '',
                created_at: ['', ''],
                period: '',
                game: '',
                game_category: '',
                categories: [],
                gamelist: [],
                filter_game: [],
                total_amount: '',
                total_profit: '',
                total_bet_amount: '',
                today: date.today[0],
                yesterday: date.yesterday[0],
                shortcuts: ['yesterday', 'this_week', 'this_month', 'last_month'].map(element => Object({
                    text: this.$t(`common.${element}`),
                    start: date[element][0],
                    end: date[element][1]
                }))
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
            status (newObj) {
                this.query.status = newObj
            },
            account_type: function (newObj, old) {
                if (newObj === true) {
                    this.query.account_type = '1'
                } else {
                    this.query.account_type = undefined
                }
                if (this.$route.query.account_type !== this.query.account_type) {
                    this.submit()
                }
            },
            game (newObj) {
                this.categories = []
                if (newObj) {
                    this.getGameCategory()
                } else {
                    this.game_category = ''
                }
            },
            game_category (newObj) {
                this.query.category = newObj
            },
            filter_game (newObj) {
                if (newObj.length === 0) {
                    this.query.game_q = ''
                    if (this.$route.query.game_q) {
                        this.submit()
                    }
                } else {
                    this.query.game_q = newObj
                    if (`${this.$route.query.game_q}` !== `${this.query.game_q}`) {
                        this.submit()
                    }
                }
            },
            '$route': {
                handler () {
                    this.getPageAccessed()
                    this.queryset = []
                    this.$nextTick(() => {
                        this.$refs.pulling.rebase()
                    })
                },
                deep: true
            },
            created_at (newObj) {
                [this.query.created_at_0, this.query.created_at_1] = [...newObj]
                if (this.query.created_at_0 !== this.$route.query.created_at_0 || this.query.created_at_1 !== this.$route.query.created_at_1) {
                    this.submit()
                }
            },
            period (newObj, old) {
                clearInterval(this.interval)
                this.interval = setInterval(this.getBetRecord, parseInt(this.period))
            },
            pageSelected (newObj) {
                if (newObj === 'realtime') {
                    this.query = Object.assign({}, {
                        account_type: '1'
                    })
                } else {
                    this.query = {}
                }
            }
        },
        methods: {
            getGameList () {
                this.$http.get(api.game_list).then(data => {
                    this.gamelist = data
                })
            },
            getGameCategory (game) {
                this.$http.get(`${api.gamecategory}?game=${this.query.game_q}`).then(data => {
                    this.categories = data
                })
            },
            gameSelect (val) {
                this.query.game_q = val
                this.game = val
            },
            queryData (queryset) {
                this.queryset = queryset
            },
            queryParam (query) {
                this.query = Object.assign(this.query, query)
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
            getPageAccessed () {
                if (this.$route.path === '/report/betrecord/today') {
                    this.extra = `report_flag=true&account_type=1&created_at_0=${this.today}&created_at_1=${this.today}`
                    this.game = this.$route.query.game_q || ''
                    this.game_category = this.$route.query.category || ''
                    this.status = this.$route.query.status || ''
                    this.pageSelected = 'today'
                } else if (this.$route.path === '/report/betrecord/history') {
                    if (this.$route.query.created_at_0 || this.$route.query.created_at_1) {
                        this.created_at = [this.$route.query.created_at_0, this.$route.query.created_at_1]
                    } else {
                        this.created_at = [undefined, undefined]
                    }
                    this.extra = `report_flag=true&account_type=1&created_at_1=${this.yesterday}`
                    this.game = this.$route.query.game_q || ''
                    this.game_category = this.$route.query.category || ''
                    this.status = this.$route.query.status || ''
                    this.pageSelected = 'history'
                } else if (this.$route.path === '/report/betrecord/realtime') {
                    if (this.$route.query.game_q) {
                        this.filter_game = this.$route.query.game_q.split(',')
                    } else {
                        this.filter_game = []
                    }
                    this.extra = `report_flag=true&created_at_0=${this.today}&created_at_1=${this.today}`
                    this.account_type = (this.$route.query.account_type === '1') || undefined
                    this.period = 10 * 1000
                    this.pageSelected = 'realtime'
                }
                this.query = Object.assign({}, this.$route.query)
            },
            deselectall () {
                this.filter_game = []
            },
            selectall () {
                this.filter_game = this.gamelist.map(game => game.id)
            },
            newWindow () {
                window.open('#' + this.$route.fullPath)
            },
            refresh () {
                this.queryset = []
                this.$refs.pulling.rebase()
            },
            quickFilter:
                _.debounce(function () {
                    this.submit()
                },
            500),
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
            },
            clearall: function () {
                if (this.pageSelected === 'realtime') {
                    this.query = Object.assign({}, {
                        account_type: '1'
                    })
                } else {
                    this.query = {}
                }
                this.$nextTick(() => {
                    this.submit()
                })
            }
        },
        components: {
            pulling,
            DatePicker,
            gameSelector
        },
        beforeDestroy () {
            if (this.pageSelected === 'realtime') {
                clearInterval(this.interval)
            }
        }
    }
</script>
