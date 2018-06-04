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
        <div v-if="pageSelected === 'normal'">
            <form
                class="form text-sm"
                @submit.prevent="submit"
            >
                <div class="box">
                    <div class="box-body clearfix form-input-sm">
                        <div class="row m-l-xs m-r-xs">
                            <div class="pull-left m-r-xs">
                                <label
                                    class="form-control-label p-b-0"
                                    :class="{'text-blue': query.member}"
                                >
                                    {{ $t('common.member') }}
                                    <span class="text-muted">({{ $t('common.accurate_search') }})</span>
                                </label>
                                <input
                                    v-model.trim="query.member"
                                    class="form-control w-sm"
                                    :placeholder="$t('common.member')"
                                    @input="search"
                                />
                            </div>
                            <div class="pull-left m-r-xs">
                                <label
                                    class="form-control-label p-b-0"
                                    :class="{'text-blue': query.id}"
                                >{{ $t('report.bet_record_number') }}
                                </label>
                                <input
                                    v-model.trim="query.id"
                                    class="form-control w-sm"
                                    :placeholder="$t('report.bet_record_number')"
                                    @input="search"
                                />
                            </div>
                            <div class="pull-left m-r-xs">
                                <label
                                    class="form-control-label p-b-0"
                                    :class="{'text-blue': query.issue_number}"
                                >
                                    {{ $t('game_history.periods') }}
                                    <span class="text-muted">({{ $t('common.accurate_search') }})</span>
                                </label>
                                <input
                                    v-model.trim="query.issue_number"
                                    class="form-control w-sm"
                                    :placeholder="$t('game_history.periods')"
                                    @input="search"
                                />
                            </div>
                            <div class="pull-left m-r-xs">
                                <label
                                    class="form-control-label p-b-0"
                                    :class="{'text-blue': status}"
                                >{{ $t('common.status') }}
                                </label>
                                <select
                                    class="form-control c-select w-sm"
                                    style="display: block;"
                                    v-model="status"
                                    type="search"
                                >
                                    <option value="">{{ $t('common.please_select') }} </option>
                                    <option value="ongoing">{{ $t('betrecord.ongoing') }}</option>
                                    <option value="win">{{ $t('betrecord.win') }}</option>
                                    <option value="lose">{{ $t('betrecord.lose') }}</option>
                                    <option value="cancelled">{{ $t('status.cancelled') }}</option>
                                    <option value="tie">{{ $t('betrecord.tie') }}</option>
                                    <option value="no_draw">{{ $t('game_history.no_draw') }}</option>
                                </select>
                            </div>
                            <div class="pull-left m-r-xs">
                                <label
                                    class="form-control-label p-b-0"
                                    :class="{'text-blue': query.bet_lte || query.bet_gte}"
                                >{{ $t('common.amount') }}
                                </label>
                                <div style="display: block;">
                                    <input
                                        type="number"
                                        v-model="query.bet_gte"
                                        class="form-control inline w-sm"
                                        :max="query.bet_lte"
                                        :placeholder="$t('common.min_amount')"
                                        @input="search"
                                    />
                                    <span>
                                        ~
                                    </span>
                                    <input
                                        type="number"
                                        v-model="query.bet_lte"
                                        class="form-control inline w-sm"
                                        :min="query.bet_gte"
                                        :placeholder="$t('common.max_amount')"
                                        @input="search"
                                    />
                                </div>
                            </div>
                            <div class="pull-left m-r-xs">
                                <label
                                    class="form-control-label p-b-0"
                                    :class="{'text-blue': created_at && (created_at[0] || created_at[1])}"
                                >{{ $t('common.date') }}
                                </label>
                                <date-picker
                                    width='244'
                                    style="display: block;"
                                    :shortcuts="shortcuts"
                                    type="date"
                                    v-model="created_at"
                                    format="yyyy-MM-dd"
                                    range
                                />
                            </div>
                            <div class="pull-left m-r-xs">
                                <label
                                    class="form-control-label p-b-0"
                                    :class="{'text-blue': game}"
                                >{{ $t('common.game') }}
                                </label>
                                <div style="display: block;">
                                    <selector-game
                                        class="pull-left w-sm c-select no-b-r"
                                        :attribute="'id'"
                                        :game="game"
                                        @game-select="gameSelect"
                                    />
                                    <select
                                        class="form-control c-select"
                                        style="width: 224px;"
                                        v-model="game_category" 
                                        :disabled="!game || categories.length === 0"
                                    >
                                        <option value="">{{ $t('common.gamecategory') }}</option>
                                        <option
                                            name="game"
                                            v-for="category in categories"
                                            :value="category.id"
                                            :key="category.id"
                                        >
                                            <i class="blue">{{ category.display_name }}</i>
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div class="pull-left m-r-xs">
                                <label
                                    class="form-control-label p-b-0"
                                    :class="{'text-blue': platform}"
                                    style="display: block;"
                                >{{ $t('manage.platform') }}
                                </label>
                                <label class="sm-check m-r m-t-sm m-l">
                                    <input class="c-radio" type="radio" value="" v-model="platform">
                                    <i class="blue m-r-xs"></i>
                                    {{ $t('common.show_all') }}
                                </label>
                                <label class="sm-check m-r">
                                    <input class="c-radio" type="radio" value="pc" v-model="platform">
                                    <i class="blue m-r-xs"></i>
                                    <span>{{ $t('manage.pc') }}</span>
                                </label>
                                <label class="sm-check m-r">
                                    <input class="c-radio" type="radio" value="mobile" v-model="platform">
                                    <i class="blue m-r-xs"></i>
                                    <span>{{ $t('manage.mobile') }}</span>
                                </label>
                            </div>
                            <button
                                class="md-btn w-xs pull-right btn m-t-md"
                                type="button"
                                @click="clearAll"
                                :disabled="isQueryEmpty"
                            >
                                <i v-if="loading" class="fa fa-spin fa-spinner"></i> 
                                <i v-else class="fa fa-trash-o"></i> 
                                <span>{{ $t('action.reset_condition') }}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
        <div v-else-if="pageSelected === 'realtime'">
            <form class="form text-sm">
                <div class="box">
                    <div class="box-body clearfix form-input-sm">
                        <div class="row m-l-xs m-r-xs">
                            <div class="col-xs-12">
                                <label class="text-sm m-r-sm m-t-xs m-b">{{ $t('betrecord.game_selection') }}</label>
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
                        </div>
                        <div class="row m-l-xs m-r-xs">
                            <div class="col-xs-12">
                                <label class="check m-r m-b pointer" v-for="game in gamelist" :key="game.id">
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
                                <div class="pull-left m-r-xs">
                                    <label
                                        class="form-control-label p-b-0"
                                        :class="{'text-blue': query.member}"
                                    >
                                        {{ $t('common.member') }}
                                        <span class="text-muted">({{ $t('common.accurate_search') }})</span>
                                    </label>
                                    <input
                                        v-model="query.member"
                                        class="form-control w-sm"
                                        :placeholder="$t('common.member')"
                                        @input="search"
                                    />
                                </div>
                                <div class="pull-left m-r-xs">
                                    <label
                                        class="form-control-label p-b-0"
                                        :class="{'text-blue': query.bet_gte}"
                                    >{{ $t('common.min_amount') }}
                                    </label>
                                    <input
                                        type="number"
                                        v-model="query.bet_gte"
                                        class="form-control w-sm"
                                        :placeholder="$t('common.min_amount')"
                                        @input="search"
                                    />
                                </div>
                                <div class="pull-left m-r-xs">
                                    <label
                                        class="form-control-label p-b-0"
                                        :class="{'text-blue': query.issue_number}"
                                    >
                                        {{ $t('game_history.periods') }}
                                        <span class="text-muted">({{ $t('common.accurate_search') }})</span>
                                    </label>
                                    <input
                                        v-model="query.issue_number"
                                        class="form-control w-sm"
                                        :placeholder="$t('game_history.periods')"
                                        @input="search"
                                    />
                                </div>
                                <div class="pull-left m-r-xs">
                                    <label
                                        class="form-control-label p-b-0"
                                        :class="{'text-blue': query.issue_number}"
                                    >{{ $t('common.refresh_period') }}
                                    </label>
                                    <select
                                        class="form-control w-sm c-select inline"
                                        v-model="period"
                                        style="display: block;"
                                    >
                                        <option value="5000">{{ $t('betrecord.five_seconds') }}</option>
                                        <option value="10000">{{ $t('betrecord.ten_seconds') }}</option>
                                        <option value="30000">{{ $t('betrecord.thirty_seconds') }}</option>
                                        <option value="60000">{{ $t('betrecord.sixty_seconds') }}</option>
                                    </select>
                                </div>
                                <div class="pull-left m-r-xs">
                                    <label
                                        class="form-control-label p-b-0"
                                        :class="{'text-blue': platform}"
                                        style="display: block;"
                                    >{{ $t('manage.platform') }}
                                    </label>
                                    <label class="sm-check m-r m-t-sm m-l">
                                        <input class="c-radio" type="radio" value="" v-model="platform">
                                        <i class="blue m-r-xs"></i>
                                        {{ $t('common.show_all') }}
                                    </label>
                                    <label class="sm-check m-r">
                                        <input class="c-radio" type="radio" value="pc" v-model="platform">
                                        <i class="blue m-r-xs"></i>
                                        <span>{{ $t('manage.pc') }}</span>
                                    </label>
                                    <label class="sm-check m-r">
                                        <input class="c-radio" type="radio" value="mobile" v-model="platform">
                                        <i class="blue m-r-xs"></i>
                                        <span>{{ $t('manage.mobile') }}</span>
                                    </label>
                                </div>
                                <button
                                    class="md-btn w-xs pull-right btn m-t-md"
                                    type="button"
                                    @click="clearAll"
                                    :disabled="isQueryEmpty"
                                >
                                    <i v-if="loading" class="fa fa-spin fa-spinner"></i> 
                                    <i v-else class="fa fa-trash-o"></i> 
                                    <span>{{ $t('action.reset_condition') }}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
        <div class="row">
            <div class="col-xs-12">
                <div class="pull-left" v-if="pageSelected === 'realtime'">
                    <label class="check m-b-0 pointer">
                        <input type="checkbox" value="1" name="account_type" v-model="account_type"/>
                        <i class="blue"></i>
                        {{ $t('action.filter_trial_account') }}
                    </label>
                </div>
                <div class="pull-right total-amount" v-show="pageSelected === 'normal'">
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
        <div class="box" v-if="pageSelected === 'normal'">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>{{ $t('report.bet_record_number') }}</th>
                        <th class="text-center">{{ $t('betrecord.betted_at') }}&nbsp;/&nbsp;{{ $t('common.settledat') }}</th>
                        <th>{{ $t('common.member') }}</th>
                        <th>{{ $t('manage.platform') }}</th>
                        <th>{{ $t('common.game') }}</th>
                        <th>{{ $t('game_history.periods') }}</th>
                        <th>{{ $t('game_manage.play') }}</th>
                        <th>{{ $t('common.betamount') }}</th>
                        <th>{{ $t('common.settlementamount') }}</th>
                        <th>{{ $t('game_manage.odds') }}&nbsp;/&nbsp;{{ $t('bill.return') }}&nbsp;(%)</th>
                        <th class="text-right">{{ $t('common.profit') }}</th>
                        <th class="text-center" width="5%">{{ $t('common.status') }}</th>
                        <th class="text-center">{{ $t('betrecord.cancel_bet') }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="t in queryset" :key="t.id">
                        <td><router-link :to="'/report/betrecord/' + t.id">{{ t.id }}</router-link></td>
                        <td class="text-center p-l-0 p-r-0 text-xs">
                            <span>{{ t.created_at | moment("YYYY-MM-DD HH:mm:ss") }}</span><br/>
                            <span v-if="t.settled_at">{{ t.settled_at | moment("YYYY-MM-DD HH:mm:ss") }}</span>
                            <span v-else>-</span>
                        </td>
                        <td><router-link :to="'/member/' + t.member.id">{{ t.member.username }}</router-link></td>
                        <td>{{ (t.platform && $t('manage.' + t.platform)) || '-' }}</td>
                        <td>{{ t.game.display_name }}</td>
                        <td>{{ t.issue_number }}</td>
                        <td>{{ t.play.play_group.display_name }} @ {{ t.play.display_name }}</td>
                        <td>{{ t.bet_amount | currency('￥') }}</td>
                        <td>{{ t.settlement_amount | currency('￥') }}</td>
                        <td>{{ t.odds }}&nbsp;/&nbsp;{{ t.return_rate | fixed }}&nbsp;%</td>
                        <td class="text-right">{{ t.profit || 0 | currency('￥') }}</td>
                        <td class="text-center p-l-xs p-r-xs">
                            <div class="flex-value status">
                                <span class="label danger" v-if="t.status === 'lose'">{{ $t('betrecord.lose') }}</span>
                                <span class="label success" v-if="t.status === 'win'">{{ $t('betrecord.win') }}</span>
                                <span class="label warn" v-if="t.status === 'ongoing'">{{ $t('betrecord.ongoing') }}</span>
                                <span class="label ongoing" v-if="t.status === 'tie'">{{ $t('betrecord.tie') }}</span>
                                <span class="label ongoing" v-if="t.status === 'cancelled'">{{ $t('status.cancelled') }}</span>
                                <span class="label ongoing" v-if="t.status === 'no_draw'">{{ $t('game_history.no_draw') }}</span>
                            </div>
                        </td>
                        <td class="text-center p-r-xs p-l-xs">
                            <span v-if="(t.status === 'ongoing' || t.status === 'no_draw') && $root.permissions.includes('cancel_bet')">
                                <button
                                    type="button"
                                    class="btn btn-xs blue sm-btn m-b-sm f-b text-xs"
                                    @click="cancelBet(t, 'cancelled', true, $event)"
                                >{{ $t('betrecord.cancel_bet') }}
                                </button>
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
                        <th class="text-center">{{ $t('betrecord.betted_at') }}</th>
                        <th>{{ $t('common.member') }}</th>
                        <th>{{ $t('manage.platform') }}</th>
                        <th>{{ $t('member.account_type') }}</th>
                        <th>{{ $t('common.game') }}</th>
                        <th>{{ $t('game_history.periods') }}</th>
                        <th>{{ $t('game_manage.play') }}</th>
                        <th>{{ $t('game_manage.odds') }}&nbsp;/&nbsp;{{ $t('game_manage.return_rate') }}&nbsp;(%)</th>
                        <th class="text-right">{{ $t('common.betamount') }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="t in queryset" :key="t.id">
                        <td>
                            <router-link v-if="t.member.account_type !== 0" :to="'/report/betrecord/' + t.id">{{ t.id }}</router-link>
                            <span v-else>{{ t.id }}</span>
                        </td>
                        <td class="text-center text-sm">{{ t.created_at | moment("YYYY-MM-DD HH:mm:ss") }}</td>
                        <td>
                            <router-link :to="'/member/' + t.member.id" v-if="t.member.account_type !== 0">{{ t.member.username }}</router-link>
                            <span v-else>{{ $t('member.visitor') }}</span>
                        </td>
                        <td>{{ (t.platform && $t('manage.' + t.platform)) || '-' }}</td>
                        <td>{{ t.member.account_type !== 0 ? $t('member.real_account') : $t('member.trial_account') }}</td>
                        <td>{{ t.game.display_name }}</td>
                        <td>{{ t.issue_number }}</td>
                        <td>{{ t.play.play_group.display_name }} @ {{ t.play.display_name }}</td>
                        <td>{{ t.odds }}&nbsp;/&nbsp;{{ t.return_rate | fixed }}&nbsp;%</td>
                        <td class="text-right">{{ t.bet_amount | currency('￥') }}</td>
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
    import Pulling from '../../components/Pulling'
    import SelectorGame from '../../components/SelectorGame'
    import DatePicker from 'vue2-datepicker'
    import VueCookie from 'vue-cookie'
    import date from '../../utils/date'
    import $ from '../../utils/util'
    import _ from 'lodash'

    export default {
        data () {
            return {
                pageSelected: '',
                queryset: [],
                betApi: api.bet.record,
                extra: '',
                query: {},
                account_type: true,
                status: '',
                platform: '',
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
                shortcuts: ['today', 'yesterday', 'this_week', 'this_month', 'last_month'].map(element => Object({
                    text: this.$t(`common.${element}`),
                    start: date[element][0],
                    end: date[element][1]
                })),
                loading: true
            }
        },
        created () {
            this.getGameList()
            this.getPageAccessed()
            this.rebase()
        },
        watch: {
            status (newObj) {
                this.query.status = newObj || ''
                this.submit()
            },
            account_type (newObj, old) {
                if (newObj) {
                    this.query.account_type = '1,2'
                } else {
                    this.query.account_type = ''
                }
                this.submit()
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
                this.query.category = newObj || ''
                this.submit()
            },
            platform (newObj) {
                this.query.platform = newObj || ''
                this.submit()
            },
            filter_game (newObj) {
                if (newObj.length === 0) {
                    this.query.game_q = ''
                } else {
                    this.query.game_q = newObj
                }
                this.submit()
            },
            '$route': {
                handler () {
                    this.getPageAccessed()
                    this.queryset = []
                    this.rebase()
                },
                deep: true
            },
            created_at (newObj) {
                [this.query.created_at_0, this.query.created_at_1] = [...newObj]
                this.submit()
            },
            period (newObj, old) {
                clearInterval(this.interval)
                this.interval = setInterval(this.getBetRecord, parseInt(this.period))
            },
            pageSelected (newObj, old) {
                if (old) {
                    if (newObj === 'realtime') {
                        this.query = Object.assign({}, {
                            account_type: '1,2'
                        })
                    } else if (newObj === 'normal') {
                        this.query = {}
                    }
                }
            }
        },
        computed: {
            isQueryEmpty () {
                return $.compareQuery(this.query, {})
            }
        },
        methods: {
            getGameList () {
                this.$http.get(api.game.list).then(data => {
                    this.gamelist = data
                })
            },
            getGameCategory (game) {
                this.$http.get(`${api.game.category}?game=${this.query.game_q}&opt_fields=id,display_name`).then(data => {
                    this.categories = data
                })
            },
            gameSelect (val) {
                this.query.game_q = val
                this.submit()
            },
            queryData (queryset) {
                this.queryset = queryset
                this.loading = false
            },
            queryParam (query) {
                Object.assign(this.query, query)
            },
            totalAmount (amount) {
                this.total_amount = amount
            },
            totalProfit (profit) {
                this.total_profit = profit
            },
            rebase () {
                this.$nextTick(() => {
                    this.$refs.pulling.rebase()
                })
            },
            submit () {
                if (!$.compareQuery(this.query, this.$route.query)) {
                    this.$refs.pulling.submit()
                }
            },
            getPageAccessed () {
                let query = this.$route.query
                this.platform = query.platform || ''
                if (this.$route.name === 'report_betrecord') {
                    if (query.created_at_0 || query.created_at_1) {
                        this.created_at = [query.created_at_0, query.created_at_1]
                        this.extra = 'account_type=1,2'
                    } else {
                        // default date is today
                        this.created_at = [undefined, undefined]
                        this.extra = `created_at_0=${this.today}&created_at_1=${this.today}&account_type=1,2`
                    }
                    this.game = query.game_q || ''
                    this.game_category = query.category || ''
                    this.status = query.status || ''
                    this.pageSelected = 'normal'
                } else if (this.$route.path === '/report/betrecord/realtime') {
                    if (query.game_q) {
                        this.filter_game = query.game_q.split(',')
                    } else {
                        this.filter_game = []
                    }
                    this.extra = `created_at_0=${this.today}&created_at_1=${this.today}`
                    this.account_type = (query.account_type === '1,2') || undefined
                    this.period = 10 * 1000
                    this.pageSelected = 'realtime'
                }
                this.query = Object.assign({}, query)
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
                this.rebase()
            },
            search:
                _.debounce(function () {
                    this.submit()
                },
            700),
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
                    this.$http.put(api.bet.retreat + betrecord.id + '/', {
                        status: status
                    }).then(data => {
                        betrecord.status = data.status
                    }, error => {
                        this.errorMsg = error
                    })
                }
            },
            clearAll () {
                if (this.pageSelected === 'realtime') {
                    this.query = Object.assign({}, {
                        account_type: '1,2'
                    })
                } else {
                    this.query = {}
                }
                this.$nextTick(() => {
                    this.submit()
                })
            }
        },
        filters: {
            fixed (val) {
                if (Number.isInteger(val)) {
                    return val
                } else if (val) {
                    return val.toFixed(2)
                } else {
                    return 0
                }
            }
        },
        components: {
            DatePicker,
            Pulling,
            SelectorGame
        },
        beforeDestroy () {
            if (this.pageSelected === 'realtime') {
                clearInterval(this.interval)
            }
        }
    }
</script>
