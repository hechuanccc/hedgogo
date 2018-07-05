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
                        >{{ $t('system.refresh') }}
                        </button>
                        <button
                            class="md-btn w-sm"
                            type="submit"
                            @click="newWindow"
                        >{{ $t('system.new_window') }}
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
                                    {{ $t('dic.member') }}
                                    <span class="text-muted">({{ $t('system.accurate_search') }})</span>
                                </label>
                                <input
                                    v-model.trim="query.member"
                                    class="form-control w-sm"
                                    :placeholder="$t('dic.member')"
                                    @input="search"
                                />
                            </div>
                            <div class="pull-left m-r-xs">
                                <label
                                    class="form-control-label p-b-0"
                                    :class="{'text-blue': query.id}"
                                >{{ $t('bet.bet_id') }}
                                </label>
                                <input
                                    v-model.trim="query.id"
                                    class="form-control w-sm"
                                    :placeholder="$t('bet.bet_id')"
                                    @input="search"
                                />
                            </div>
                            <div class="pull-left m-r-xs">
                                <label
                                    class="form-control-label p-b-0"
                                    :class="{'text-blue': query.issue_number}"
                                >
                                    {{ $t('dic.period') }}
                                    <span class="text-muted">({{ $t('system.accurate_search') }})</span>
                                </label>
                                <input
                                    v-model.trim="query.issue_number"
                                    class="form-control w-sm"
                                    :placeholder="$t('dic.period')"
                                    @input="search"
                                />
                            </div>
                            <div class="pull-left m-r-xs">
                                <label
                                    class="form-control-label p-b-0"
                                    :class="{'text-blue': status && status.length}"
                                >{{ $t('dic.status') }}
                                </label>
                                <div :class="{'w-sm': !status || status.length <= 1}">
                                    <multiselect
                                        v-model="status"
                                        :options="statusOptions"
                                        :multiple="true"
                                        :close-on-select="false"
                                        :clear-on-select="false"
                                        :hide-selected="true"
                                        :preserve-search="false"
                                        :searchable="false"
                                        :placeholder="$t('system.please_select')"
                                        label="title"
                                        track-by="value" 
                                        :preselect-first="false"
                                        :selectLabel="''"
                                        @close="closeStatusSelector"
                                    >
                                        <template
                                            slot="tag"
                                            slot-scope="props"
                                        >
                                            <span
                                                class="custom__tag label m-l-xs pointer"
                                                @click="props.remove(props.option)"
                                                :class="{
                                                    'success': props.option.value === 'win',
                                                    'danger': props.option.value === 'lose',
                                                    'warn': props.option.value === 'ongoing'
                                                }"
                                            >
                                                {{ props.option.title }}
                                                <i class="fa fa-times"></i>
                                            </span>
                                        </template>
                                        <template slot="noResult">{{ $t('system.no_record') }}</template>
                                    </multiselect>
                                </div>
                            </div>
                            <div class="pull-left m-r-xs">
                                <label
                                    class="form-control-label p-b-0"
                                    :class="{'text-blue': query.bet_lte || query.bet_gte}"
                                >{{ $t('dic.amount') }}
                                </label>
                                <div style="display: block;">
                                    <input
                                        type="number"
                                        v-model="query.bet_gte"
                                        class="form-control inline w-sm"
                                        :max="query.bet_lte"
                                        :placeholder="$t('misc.min_amount')"
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
                                        :placeholder="$t('misc.max_amount')"
                                        @input="search"
                                    />
                                </div>
                            </div>
                            <div class="pull-left m-r-xs">
                                <label
                                    class="form-control-label p-b-0"
                                    :class="{'text-blue': platform}"
                                    style="display: block;"
                                >{{ $t('dic.platform') }}
                                </label>
                                <label class="sm-check m-r m-t-sm m-l">
                                    <input class="c-radio" type="radio" value="" v-model="platform">
                                    <i class="blue m-r-xs"></i>
                                    {{ $t('system.show_all') }}
                                </label>
                                <label class="sm-check m-r">
                                    <input class="c-radio" type="radio" value="pc" v-model="platform">
                                    <i class="blue m-r-xs"></i>
                                    <span>{{ $t('dic.pc') }}</span>
                                </label>
                                <label class="sm-check m-r">
                                    <input class="c-radio" type="radio" value="mobile" v-model="platform">
                                    <i class="blue m-r-xs"></i>
                                    <span>{{ $t('dic.mobile') }}</span>
                                </label>
                            </div>
                        </div>
                        <div class="row m-l-xs m-r-xs">
                            <div class="pull-left m-r-xs">
                                <label
                                    class="form-control-label p-b-0"
                                    :class="{'text-blue': timeCategory === 'created'
                                        ? created_at && (created_at[0] || created_at[1])
                                        : settled_at && (settled_at[0] || settled_at[1])
                                    }"
                                >{{ $t('time.betted_at') }} / {{ $t('time.settled_at') }} 
                                </label>
                                <div style="display: block;">
                                    <select
                                        class="pull-left form-control w-sm c-select no-b-r"
                                        v-model="timeCategory"
                                        @change="autoTogglePopup = true"
                                    >
                                        <option value="created">{{ $t('time.betted_at') }}</option>
                                        <option value="settled">{{ $t('time.settled_at') }}</option>
                                    </select>

                                    <el-date-picker
                                        style="width: 248px;"
                                        v-model="created_at"
                                        size="mini"
                                        type="daterange"
                                        unlink-panels
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                        :picker-options="{shortcuts}"
                                        ref="created"
                                        v-show="timeCategory === 'created'"
                                    />
                                    <el-date-picker
                                        style="width: 248px;"
                                        v-model="settled_at"
                                        size="mini"
                                        type="daterange"
                                        unlink-panels
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                        :picker-options="{shortcuts}"
                                        ref="settled"
                                        v-show="timeCategory === 'settled'"
                                    />
                                </div>
                            </div>
                            <div class="pull-left m-r-xs">
                                <label
                                    class="form-control-label p-b-0"
                                    :class="{'text-blue': game}"
                                >{{ $t('dic.game') }}
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
                                        <option value="">{{ $t('game.category') }}</option>
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
                            <button
                                class="md-btn w-xs pull-right btn m-t-md"
                                type="button"
                                @click="clearAll"
                                :disabled="isQueryEmpty"
                            >
                                <i v-if="loading" class="fa fa-spin fa-spinner"></i> 
                                <i v-else class="fa fa-trash-o"></i> 
                                {{ $t('system.reset_condition') }}</span>
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
                                <label class="text-sm m-r-sm m-t-xs m-b">{{ $t('dic.game') }}</label>
                                <button
                                    class="btn-md r w-xs blue no-border m-r-sm"
                                    type="button"
                                    @click="selectall"
                                >{{ $t('system.select_all') }}
                                </button>
                                <button
                                    class="btn-md r w-xs no-border grey-400"
                                    type="button"
                                    @click="deselectall"
                                >{{ $t('system.deselect_all') }}
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
                                        {{ $t('dic.member') }}
                                        <span class="text-muted">({{ $t('system.accurate_search') }})</span>
                                    </label>
                                    <input
                                        v-model="query.member"
                                        class="form-control w-sm"
                                        :placeholder="$t('dic.member')"
                                        @input="search"
                                    />
                                </div>
                                <div class="pull-left m-r-xs">
                                    <label
                                        class="form-control-label p-b-0"
                                        :class="{'text-blue': query.bet_gte}"
                                    >{{ $t('misc.min_amount') }}
                                    </label>
                                    <input
                                        type="number"
                                        v-model="query.bet_gte"
                                        class="form-control w-sm"
                                        :placeholder="$t('misc.min_amount')"
                                        @input="search"
                                    />
                                </div>
                                <div class="pull-left m-r-xs">
                                    <label
                                        class="form-control-label p-b-0"
                                        :class="{'text-blue': query.issue_number}"
                                    >
                                        {{ $t('dic.period') }}
                                        <span class="text-muted">({{ $t('system.accurate_search') }})</span>
                                    </label>
                                    <input
                                        v-model="query.issue_number"
                                        class="form-control w-sm"
                                        :placeholder="$t('dic.period')"
                                        @input="search"
                                    />
                                </div>
                                <div class="pull-left m-r-xs">
                                    <label
                                        class="form-control-label p-b-0"
                                        :class="{'text-blue': period}"
                                    >{{ $t('system.refresh_period') }}
                                    </label>
                                    <select
                                        class="form-control w-sm c-select inline"
                                        v-model="period"
                                        style="display: block;"
                                    >
                                        <option value="5000">{{ $t('time.seconds', { number: 5 }) }}</option>
                                        <option value="10000">{{ $t('time.seconds', { number: 10 }) }}</option>
                                        <option value="30000">{{ $t('time.seconds', { number: 30 }) }}</option>
                                        <option value="60000">{{ $t('time.seconds', { number: 60 }) }}</option>
                                    </select>
                                </div>
                                <div class="pull-left m-r-xs">
                                    <label
                                        class="form-control-label p-b-0"
                                        :class="{'text-blue': platform}"
                                        style="display: block;"
                                    >{{ $t('dic.platform') }}
                                    </label>
                                    <label class="sm-check m-r m-t-sm m-l">
                                        <input class="c-radio" type="radio" value="" v-model="platform">
                                        <i class="blue m-r-xs"></i>
                                        {{ $t('system.show_all') }}
                                    </label>
                                    <label class="sm-check m-r">
                                        <input class="c-radio" type="radio" value="pc" v-model="platform">
                                        <i class="blue m-r-xs"></i>
                                        <span>{{ $t('dic.pc') }}</span>
                                    </label>
                                    <label class="sm-check m-r">
                                        <input class="c-radio" type="radio" value="mobile" v-model="platform">
                                        <i class="blue m-r-xs"></i>
                                        <span>{{ $t('dic.mobile') }}</span>
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
                                    {{ $t('system.reset_condition') }}
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
                        {{ $t('misc.filter_visitor') }}
                    </label>
                </div>
                <div class="pull-right total-amount" v-show="pageSelected === 'normal'">
                    <span>{{ $t('bet.total_profit') }} : </span>
                    <span v-if="queryset.length">{{ total_profit | currency('￥') }}</span>
                    <span v-else>{{ 0 | currency('￥') }}</span>
                    <span>|</span>
                    <span>{{ $t('bet.total_bet_amount') }} : </span>
                    <span v-if="queryset.length">{{ total_amount | currency('￥') }}</span>
                    <span v-else>{{ 0 | currency('￥') }}</span>
                </div>
            </div>
        </div>
        <div class="box" v-if="pageSelected === 'normal'">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>{{ $t('bet.bet_id') }}</th>
                        <th class="text-center">
                            {{ $t('time.betted_at') }}&nbsp;/
                            <br/>
                            {{ $t('time.settled_at') }}
                        </th>
                        <th>{{ $t('dic.member') }}</th>
                        <th>{{ $t('dic.platform') }}</th>
                        <th>{{ $t('dic.game') }}</th>
                        <th>{{ $t('dic.period') }}</th>
                        <th>{{ $t('game.play') }}</th>
                        <th class="text-right">{{ $t('bet.bet_amount') }}</th>
                        <th class="text-right">{{ $t('bet.settled_amount') }}</th>
                        <th class="text-right">{{ $t('game.odds') }}&nbsp;/&nbsp;{{ $t('finance.return') }}&nbsp;(%)</th>
                        <th class="text-right">{{ $t('dic.profit') }}</th>
                        <th class="text-center" width="5%">{{ $t('dic.status') }}</th>
                        <th class="text-center">{{ $t('bet.cancel_bet') }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="t in queryset" :key="t.id">
                        <td><router-link :to="'/report/betrecord/' + t.id">{{ t.id }}</router-link></td>
                        <td class="text-center p-l-0 p-r-0">
                            <span class="text-xs">{{ t.created_at | moment("YYYY-MM-DD HH:mm:ss") }}</span><br/>
                            <span class="text-xs" v-if="t.settled_at">{{ t.settled_at | moment("YYYY-MM-DD HH:mm:ss") }}</span>
                            <span v-else>-</span>
                        </td>
                        <td><router-link :to="'/member/' + t.member.id">{{ t.member.username }}</router-link></td>
                        <td>{{ (t.platform && $t('dic.' + t.platform)) || '-' }}</td>
                        <td>{{ t.game.display_name }}</td>
                        <td>{{ t.issue_number }}</td>
                        <td>{{ t.play.play_group.display_name }} @ {{ t.play.display_name }}</td>
                        <td class="text-right">{{ t.bet_amount | currency('￥') }}</td>
                        <td class="text-right">{{ t.settlement_amount | currency('￥') }}</td>
                        <td class="text-right">{{ t.odds }}&nbsp;/&nbsp;{{ t.return_rate | fixed }}&nbsp;%</td>
                        <td class="text-right">{{ t.profit || 0 | currency('￥') }}</td>
                        <td class="text-center p-l-xs p-r-xs">
                            <div class="flex-value status">
                                <span class="label danger" v-if="t.status === 'lose'">{{ $t('bet.lose') }}</span>
                                <span class="label success" v-if="t.status === 'win'">{{ $t('bet.win') }}</span>
                                <span class="label warn" v-if="t.status === 'ongoing'">{{ $t('bet.ongoing') }}</span>
                                <span class="label ongoing" v-if="t.status === 'tie'">{{ $t('bet.tie') }}</span>
                                <span class="label ongoing" v-if="t.status === 'cancelled'">{{ $t('status.cancelled') }}</span>
                                <span class="label ongoing" v-if="t.status === 'no_draw'">{{ $t('game.no_draw') }}</span>
                            </div>
                        </td>
                        <td class="text-center p-r-xs p-l-xs">
                            <span v-if="(t.status === 'ongoing' || t.status === 'no_draw') && $root.permissions.includes('cancel_bet')">
                                <button
                                    type="button"
                                    class="btn btn-xs blue sm-btn m-b-sm f-b text-xs"
                                    @click="cancelBet(t, 'cancelled', true, $event)"
                                >{{ $t('bet.cancel_bet') }}
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
                        <th>{{ $t('bet.bet_id') }}</th>
                        <th class="text-center">{{ $t('time.betted_at') }}</th>
                        <th>{{ $t('dic.member') }}</th>
                        <th>{{ $t('dic.platform') }}</th>
                        <th>{{ $t('user.account_type') }}</th>
                        <th>{{ $t('dic.game') }}</th>
                        <th>{{ $t('dic.period') }}</th>
                        <th>{{ $t('game.play') }}</th>
                        <th>{{ $t('game.odds') }}&nbsp;/&nbsp;{{ $t('finance.return') }}&nbsp;(%)</th>
                        <th class="text-right">{{ $t('bet.bet_amount') }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="t in queryset" :key="t.id">
                        <td>
                            <router-link v-if="t.member.account_type !== 0" :to="'/report/betrecord/' + t.id">{{ t.id }}</router-link>
                            <span v-else>{{ t.id }}</span>
                        </td>
                        <td class="text-center text-sm">{{ t.created_at | moment('YYYY-MM-DD HH:mm:ss') }}</td>
                        <td>
                            <router-link :to="'/member/' + t.member.id" v-if="t.member.account_type !== 0">{{ t.member.username }}</router-link>
                            <span v-else>{{ $t('user.visitor') }}</span>
                        </td>
                        <td>{{ (t.platform && $t('dic.' + t.platform)) || '-' }}</td>
                        <td>{{ t.member.account_type !== 0 ? $t('user.real_account') : $t('user.trial_account') }}</td>
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
                :api="url.bet.record"
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
    import Multiselect from 'vue-multiselect'
    import { cancelBet, getGame } from '../../service'
    import url from '../../service/url'
    import Pulling from '../../components/Pulling'
    import SelectorGame from '../../components/SelectorGame'
    import VueCookie from 'vue-cookie'
    import date from '../../utils/date'
    import $ from '../../utils/util'
    import _ from 'lodash'

    export default {
        data () {
            return {
                pageSelected: '',
                queryset: [],
                extra: '',
                query: {},
                account_type: true,
                status: [],
                statusOptions: [{
                    value: 'ongoing',
                    title: this.$t('status.ongoing')
                }, {
                    value: 'win',
                    title: this.$t('bet.win')
                }, {
                    value: 'lose',
                    title: this.$t('bet.lose')
                }, {
                    value: 'cancelled',
                    title: this.$t('status.cancelled')
                }, {
                    value: 'tie',
                    title: this.$t('bet.tie')
                }, {
                    value: 'no_draw',
                    title: this.$t('game.no_draw')
                }],
                platform: '',
                created_at: ['', ''],
                settled_at: ['', ''],
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
                defaultDate: [],
                shortcuts: ['today', 'yesterday', 'this_week', 'this_month', 'last_month'].map(element => Object({
                    text: this.$t(`time.${element}`),
                    onClick (p) {
                        p.$emit('pick', date[element])
                    }
                })),
                timeCategory: 'created',
                loading: true,
                autoTogglePopup: false,
                url
            }
        },
        created () {
            this.defaultDate = [this.today, this.today]
            this.getGameList()
            this.getPageAccessed()
            this.rebase()
        },
        watch: {
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
                    this.query.game = ''
                } else {
                    this.query.game = newObj
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
                if (`${newObj}` === `${this.defaultDate}` && `${[this.query.created_at_0, this.query.created_at_1]}` !== `${this.defaultDate}`) {
                    [this.query.created_at_0, this.query.created_at_1] = [undefined, undefined]
                } else {
                    [this.query.created_at_0, this.query.created_at_1] = [...(newObj || [])]
                }
                this.autoTogglePopup = false
                this.submit()
            },
            settled_at (newObj) {
                if (`${newObj}` === `${this.defaultDate}` && `${[this.query.settled_at_0, this.query.settled_at_1]}` !== `${this.defaultDate}`) {
                    [this.query.settled_at_0, this.query.settled_at_1] = [undefined, undefined]
                } else {
                    [this.query.settled_at_0, this.query.settled_at_1] = [...(newObj || [])]
                }
                this.autoTogglePopup = false
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
            },
            timeCategory (newObj, old) {
                this.query = Object.assign(this.query, {
                    created_at_0: undefined,
                    created_at_1: undefined,
                    settled_at_0: undefined,
                    settled_at_1: undefined
                })
                if (this.autoTogglePopup) {
                    this.$nextTick(() => {
                        if (newObj !== old) {
                            this.$refs[newObj].focus()
                        }
                    })
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
                getGame('list').then(data => {
                    this.gamelist = data
                })
            },
            getGameCategory (game) {
                getGame('category', {
                    params: {
                        game: this.query.game,
                        opt_fields: 'id,display_name'
                    }
                }).then(data => {
                    this.categories = data
                })
            },
            gameSelect (val) {
                this.query.game = val
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
                        this.timeCategory = 'created'
                        this.created_at = [query.created_at_0, query.created_at_1]
                        this.extra = 'account_type=1,2'
                    } else if (query.settled_at_0 || query.settled_at_1) {
                        this.timeCategory = 'settled'
                        this.settled_at = [query.settled_at_0, query.settled_at_1]
                        this.extra = 'account_type=1,2'
                    } else {
                        // default date is today
                        this.timeCategory = 'created'
                        this.created_at = [this.today, this.today]
                        this.extra = `created_at_0=${this.today}&created_at_1=${this.today}&account_type=1,2`
                    }
                    this.game = query.game || ''
                    this.game_category = query.category || ''
                    if (query.status) {
                        let status = query.status.split(',')
                        this.status = this.statusOptions.filter(s => status.includes(s.value))
                    } else {
                        this.status = []
                    }
                    this.pageSelected = 'normal'
                } else if (this.$route.path === '/report/betrecord/realtime') {
                    if (query.game) {
                        this.filter_game = query.game.split(',')
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
                    if (!window.confirm(this.$t('system_msg.confirm_action_object', {
                        action: event.target.innerText
                    }))) {
                        return
                    }
                }
                if (betrecord.id) {
                    cancelBet({
                        id: betrecord.id,
                        data: { status }
                    }, {
                        action: this.$t('bet.cancel_bet')
                    }).then(data => {
                        betrecord.status = data.status
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
            },
            closeStatusSelector (value, id) {
                this.query.status = `${value.map(v => v.value)}`
                this.submit()
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
            Multiselect,
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
