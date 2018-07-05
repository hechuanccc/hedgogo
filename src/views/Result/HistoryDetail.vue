<template>
<div>
    <div class="row m-b-sm">
        <div class="m-l"><h4>{{ game.display_name }}</h4></div>
    </div>
    <div class="box">
        <div class="box-body clearfix form-input-sm">
            <div class="row m-l-xs m-r-xs">
                <div class="pull-left m-r-xs">
                    <label class="form-control-label p-b-0">
                        {{$t('dic.period')}}
                    </label>
                    <input
                        type="text"
                        v-model.trim="input.period"
                        :placeholder="$t('dic.period')"
                        class="form-control w-md"
                    >
                </div>
                <div class="pull-left" v-if="!mode">
                    <label class="form-control-label p-b-0">
                        {{$t('dic.date')}}
                    </label>
                    <div>
                        <el-date-picker
                            v-model="input.date"
                            type="date"
                            placeholder="请输入日期"
                            v-if="!timeRangeGames.includes(game.code)"
                            :clearable="false"
                        />
                        <el-date-picker
                            v-model="input.date"
                            size="mini"
                            type="daterange"
                            unlink-panels
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :picker-options="{shortcuts}"
                            :clearable="false"
                            v-else
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="text-left">
        <label class="check m-b-0 pointer">
            <input
                type="checkbox"
                value="1"
                name="exception"
                v-model="mode"
            />
            <i class="blue"></i>
            {{$t('game.period_abnormal')}}
        </label>
    </div>
    <div class="card col">
        <div class="card-body">
            <table class="table table-striped" v-show="queryset.length > 0 || retreatedScheds.length > 0">
                <thead class="text-center">
                    <tr>
                        <th
                            width="8%"
                            :class="{'p-b-md': twoRow}"
                        >
                            {{ $t('dic.period') }}
                        </th>
                        <th
                            width="10%"
                            :class="{'p-b-md': twoRow}"
                        >
                            {{ $t('time.draw_at') }}
                        </th>
                        <th class="text-center" :class="{'p-b-md': twoRow}">{{ $t('game.period_current_bet_count') }}</th>
                        <th
                            :width="(game.code === 'bjkl8' || game.code === 'auluck8') ? '360' : ''"
                            :class="{'p-b-md': twoRow}"
                            v-if="!mode"
                        >
                            <template
                                v-for="col in resultCol"
                                v-if="resultCol.length > 1"
                            >
                                <span
                                    class="m-r-xs m-l-xs label btn blue p-a-sm"
                                    :key="col"
                                    @click="changeResultColMode(col)"
                                >
                                    <b>{{ `${resultCol.length > 3 ? '' : $t('system.show')}${$t('result.' + col)}` }}</b>
                                </span>
                            </template>
                            <span v-else>
                                {{ $t('game.draw_number') }}
                            </span>
                        </th>
                        <th
                            class="p-l-0 p-r-0"
                            :width="sumCol.length * 50"
                            v-if="sumCol.length > 0"
                        >
                            <div class="b-b p-b-sm">{{ sumCol1st2nd ? $t('result.sum_of_first_second') : $t('result.sum') }}</div>
                            <template v-for="col in sumCol" >
                                <div
                                    class="m-t-sm"
                                    :key="col"
                                    :style="{
                                        'display': 'inline-block',
                                        'width': `${100 / sumCol.length}%`
                                    }"
                                >
                                    {{ $t('result.' + col) }}
                                </div>
                            </template>
                        </th>
                        <th
                            class="p-l-0 p-r-0"
                            :width="threeBallsSumCol.length * 50"
                            v-if="threeBallsSumCol.length > 0"
                        >
                            <div class="b-b p-b-sm">{{ $t('result.three_balls_sum_col') }}</div>
                            <template v-for="col in threeBallsSumCol" >
                                <div
                                    class="m-t-sm"
                                    :key="col"
                                    :style="{
                                        'display': 'inline-block',
                                        'width': `${100 / threeBallsSumCol.length}%`
                                    }"
                                >
                                    {{ $t('result.' + col) }}
                                </div>
                            </template>
                        </th>
                        <th
                            :class="['p-l-0 p-r-0', dragonTigerCol.length > 1 ? '' : 'p-b-md']"
                            :width="dragonTigerCol.length * 50"
                            v-if="dragonTigerCol.length > 0"
                        >
                            <div :class="dragonTigerCol.length > 1 ? 'b-b p-b-sm' : ''">{{ $t('result.dragon') + $t('result.tiger') }}</div>
                            <template
                                v-for="(col, index) in dragonTigerCol"
                                v-if="dragonTigerCol.length > 1"
                            >
                                <div
                                    class="m-t-sm"
                                    :key="col"
                                    :style="{
                                        'display': 'inline-block',
                                        'width' : `${100 / dragonTigerCol.length}%`
                                    }"
                                >
                                    {{ index + 1 }}
                                </div>
                            </template>
                        </th>

                        <th
                            :class="['p-l-0 p-r-0', niouniouCol.length > 1 ? '' : 'p-b-md']"
                            :width="niouniouCol.length * 80"
                            v-if="niouniouCol.length > 0"
                        >
                            <div :class="niouniouCol.length > 1 ? 'b-b p-b-sm' : ''">
                                {{ $t('game.niouniou_col_head') }}
                            </div>
                            <template
                                v-for="(col, index) in niouniouCol"
                                v-if="niouniouCol.length > 1"
                            >
                                <div
                                    class="m-t-sm"
                                    :key="col"
                                    :style="{
                                        'display': 'inline-block',
                                        'width' : `${100 / niouniouCol.length}%`
                                    }"
                                >
                                    {{ $t(`game.niouniou_col_sub_head[${index}]`) }}
                                </div>
                            </template>
                        </th>
                        <th
                            class="p-l-0 p-r-0"
                            :width="comparisonCol.length * 50"
                            v-if="comparisonCol.length > 0"
                        >
                            <div :class="comparisonCol.length>1 ? 'b-b p-b-sm' : ''">{{ $t('result.comparison') }}</div>
                            <template v-for="col in comparisonCol" v-if="comparisonCol.length>1">
                                <div
                                    class="m-t-sm"
                                    :key="col"
                                    :style="{
                                        'display': 'inline-block',
                                        'width': `${100 / comparisonCol.length}%`
                                    }"
                                >
                                    {{ $t('result.' + col) }}
                                </div>
                            </template>
                        </th>
                        <th
                            :class="{'p-b-md': twoRow}"
                            v-for="col in otherCol"
                            :key="col"
                            v-if="otherCol.length > 0"
                        >
                            {{ $t('result.' + col) }}
                        </th>
                        <th :class="{'p-b-md': twoRow}">
                            {{ $t('dic.operate') }}
                        </th>
                    </tr>
                </thead>
                <tbody class="v-m text-center">
                    <tr
                        v-if="isShowRetreatedSched"
                        v-for="sched in retreatedScheds"
                        :key="'retreat_' + sched.id"
                    >
                        <td>{{ sched.issue_number }}</td>
                        <td>{{ sched.schedule_result | moment("YYYY-MM-DD HH:mm:ss") }}</td>
                        <td></td>
                        <td v-if="sched.status !== 'cancelled'">
                            <span
                                class="label btn blue"
                                @click="showModal(sched, 'retreat_schedule')"
                                v-if="$root.permissions.includes('retrieve_ongoing_bets')"
                            >
                                <b>{{ $t('game.retreat_schedule') }}</b>
                            </span>
                            <span class="label" v-else>{{ $t('game.ongoing') }}</span>
                        </td>
                        <td v-else></td>
                        <td v-if="sumCol.length > 0"></td>
                        <td v-if="threeBallsSumCol.length > 0"></td>
                        <td v-if="dragonTigerCol.length > 0"></td>
                        <td v-if="niouniouCol.length > 0"></td>
                        <td v-if="comparisonCol.length > 0"></td>
                        <td
                            v-for="col in otherCol"
                            :key="'empty_' + col"
                            v-if="otherCol.length>0"
                        >
                        </td>
                        <td>
                            <span v-if="sched.status === 'cancelled'">{{ $t('game.cancelled') }}</span>
                        </td>
                    </tr>
                    <tr
                        v-for="result in filteredResults"
                        :key="mode ? result.schedule_result : result.created_at"
                    >
                        <td>
                            <span>{{ result.issue_number }}</span>
                            <br/>
                            <span class="text-muted" v-if="result.is_manual">({{ $t('game.manual_draw') }})</span>
                            <span class="text-muted" v-else-if="result.status && result.status === 'cancelled'">({{ $t(`game.${result.status}`) }})</span>
                            <span class="text-muted" v-else-if="result.remarks !== 'manual_draw' && result.remarks !== null">({{ $t(`game.${result.remarks}`) }})</span>
                        </td>
                        <td>{{ mode ? result.schedule_result : result.created_at | moment("YYYY-MM-DD HH:mm:ss") }}</td>
                        <td>{{ result.bets_count }}</td>
                        <td v-if="!mode && result.result_status === 'valid'" class="result-balls">
                            <div v-if="!resultColMode || resultColMode==='ball_num'">
                                <span
                                    v-show="result.result_str !== undefined"
                                    v-for="(resultball, index) in result.result_str.split(',')"
                                    :class="getResultClass(resultball)"
                                    :key="`${result.issue_number}_resultStr_${index}`"
                                >
                                    <b>{{ parseInt(resultball) }}</b>
                                </span>
                            </div>
                            <div v-else>
                                <div
                                    v-for="index in result.result_str.split(',').length"
                                    :class="['circle', 'm-r-xs inline', result.result_category[`${resultColMode}_${index}`]]"
                                    :key="`${result.issue_number}_${resultColMode}_${index}`"
                                >
                                    {{ $t('result.' + result.result_category[`${resultColMode}_${index}`]) }}
                                </div>
                            </div>
                        </td>
                        <td v-else-if="result.result_status === 'official_invalid'">{{ $t('system_msg.official_invalid') }}</td>
                        <td
                            class="p-l-0 p-r-0"
                            v-for="(colList, index) in allCol"
                            :key="'Col_' + index"
                            v-if="result.result_status === 'valid'"
                        >
                            <template v-for="col in colList">
                                <div
                                    :style="{
                                        'display': 'inline-block',
                                        'width' : `${100 / colList.length}%`
                                    }"
                                    :class="`text-${result.result_category[col]}`"
                                    :key="`${result.issue_number}_${col}_${result.result_category[col]}`"
                                >
                                    {{ Number.isInteger(result.result_category[col]) ? result.result_category[col] : $t('result.' + result.result_category[col]) }}
                                </div>
                            </template>
                        </td>
                        <td v-else-if="result.result_status === 'official_invalid'"></td>
                        <td
                            class="p-a-0"
                            v-if="niouniouCol.length > 0 && result.result_status === 'valid'"
                        >
                            <div
                                class="p-t p-b"
                                :style="{
                                    'display': 'inline-block',
                                    'width' : `${100 / niouniouCol.length}%`
                                }"
                                :class="{'niouniou-win': result.result_category[col + '_result'] === 'win'}"
                                :key="`${result.issue_number}_${col}_${result.result_category[col]}`"
                                v-for="col in niouniouCol"
                                v-if="niouniouCol.length === 6"
                            >
                                <p class="m-b-0">{{ result.result_category[col].split(',')[0] }}</p>
                                <p class="m-b-0">{{ result.result_category[col].split(',').splice(1, 5).join(' ') }}</p>
                            </div>
                        </td>
                        <td
                            class="p-l-0 p-r-0"
                            v-for="col in otherCol"
                            :key="`${result.issue_number}_${col}_${result.result_category[col]}`"
                            v-if="otherCol.length > 0 && result.result_status === 'valid'"
                        >
                            <span v-if="typeof result.result_category[col] === 'number'">{{ result.result_category[col] }}</span>
                            <span :class="`text-${result.result_category[col]}`" v-else>{{ $t('result.' + result.result_category[col]) }}</span>
                        </td>
                        <td v-else-if="result.result_status === 'official_invalid'"></td>
                        <td>
                            <button
                                type="button"
                                :class="['label btn m-r-xs', {
                                    'blue': result.remarks !== 'manual_draw' && $root.permissions.includes('manually_draw_game_result')
                                }]"
                                @click="showModal(result, 'manual_draw')"
                                v-if="$root.permissions.includes('manually_draw_game_result')"
                                :disabled="result.remarks === 'manual_draw' || !$root.permissions.includes('manually_draw_game_result')"
                            ><b>{{ $t('game.manual_draw') }}</b>
                            </button>
                            <span v-else-if="!mode">-</span>
                            <span
                                class="label btn blue"
                                @click="showModal(result, 'no_draw')"
                                v-show="mode && $root.permissions.includes('official_no_draw')"
                            ><b>{{ $t('game.no_draw') }}</b>
                            </span>
                            <span v-show="mode && !$root.permissions.includes('manually_draw_game_result') && !$root.permissions.includes('official_no_draw')">
                                -
                            </span>
                            <span
                                class="label btn blue"
                                @click="showModal(result, 'retreat_schedule')"
                                v-if="$root.permissions.includes('retrieve_ongoing_bets') && result.bets_count && result.status !== 'cancelled' && !mode"
                            >
                                <b>{{ $t('game.retreat_schedule') }}</b>
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div class="modal" v-if="modal.isShow">
        <div class="modal-backdrop fade in" @click="hideModal"></div>
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <span><b>{{ game.display_name }} - {{ $t(`game.${modal.mode}`) }}</b></span>
                    <button type="button" class="close" aria-hidden="true" @click="hideModal"><i class="fa fa-close"></i></button>
                </div>
                <div class="modal-body p-a-md">
                    <template v-if="modal.mode === 'retreat_schedule' && modal.status === 'close'">
                        <p>
                            {{ $t('system_msg.confirm_retreat_schedule', {
                                game: game.display_name,
                                period: modal.scheduleResult.issue_number
                            }) }}
                        </p>
                        <p v-if="modal.memberAmount">
                            {{ $t('game.period_current') }}
                            {{ $t('bet.member_win') }}:
                            <span class="text-success m-r-sm">{{ modal.memberAmount[0] | currency('￥', 2) }}</span>
                            {{ $t('bet.member_lose') }}:
                            <span class="text-danger">{{ modal.memberAmount[1] | currency('￥', 2) }}</span>
                        </p>
                    </template>
                    <table st-table="rowCollectionBasic" class="table b-t m-t v-m" v-else>
                        <thead>
                            <tr>
                                <th class="text-center">{{ $t('dic.period') }}</th>
                                <th class="text-center" v-if="modal.mode === 'no_draw'">{{ $t('game.period_current_bet_count') }}</th>
                                <th class="text-center">{{ $t('time.draw_at') }}</th>
                                <th class="text-center" v-show="modal.mode ==='manual_draw'">{{ $t('game.draw_number') }}</th>
                            </tr>
                        </thead>
                        <tbody class="text-center">
                            <tr>
                                <td>{{ modal.scheduleResult.issue_number }}</td>
                                <td v-if="modal.mode === 'no_draw'">{{ modal.betrecords }}</td>
                                <td>{{ modal.time | moment("YYYY-MM-DD HH:mm:ss") }}</td>
                                <td v-show="modal.mode === 'manual_draw'">
                                    <input
                                        class="form-control"
                                        v-model="modal.scheduleResult.result_str"
                                        :disabled="!$root.permissions.includes('manually_draw_game_result')"
                                    />
                                    <span>{{ $t('system_msg.draw_number_tip', {
                                        num_len: game.rules.num_len,
                                        unique: game.rules.unique ? $t('misc.no_repeatable') : $t('misc.repeatable'),
                                        range_floor: game.rules.range_value[0],
                                        range_ceil: game.rules.range_value[1],
                                        separator: game.rules.separator
                                    })}}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <template v-if="modal.mode === 'retreat_schedule' && modal.status === 'close'">
                        <table class="table b-t m-t v-m">
                            <thead>
                                <tr>
                                    <th>{{ $t('dic.member') }}</th>
                                    <th class="text-right">{{ $t('bet.settled_amount') }}</th>
                                    <th class="text-right">{{ $t('bet.settled_balance') }}</th>
                                    <th class="text-right">{{ $t('bet.settled_retreat') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(betInfo, index) in modal.betsInfo" :key="index">
                                    <td>{{ betInfo.member }}</td>
                                    <td :class="betInfo.bets.settled_amount < 0 ? 'text-danger' : 'text-success'" class="text-right">{{ betInfo.bets.settled_amount | currency('￥', 2) }}</td>
                                    <td class="text-right">{{ betInfo.balance_before | currency('￥', 2) }}</td>
                                    <td class="text-right">{{ betInfo.balance_after | currency('￥', 2) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </template>
                </div>
                <div class="modal-footer">
                    <div class="inline pull-left m-l-sm m-t-sm" v-if="modal.mode === 'manual_draw' && $root.permissions.includes('manually_draw_game_result')">
                        <label class="check">
                            <input type="checkbox" v-model="modal.sureDraw"/>
                            <i class="blue"></i>
                            {{$t('system_msg.confirm_manual_draw', {
                                bet_record_count: modal.betrecords
                            })}}
                        </label>
                    </div>
                    <div class="inline pull-left m-l-sm m-t-sm" v-else-if="modal.mode === 'no_draw'">
                        <label class="check">
                            <input type="checkbox" v-model="modal.inform"/>
                            <i class="blue"></i>
                            {{$t('system_msg.no_draw_inform')}}
                        </label>
                        <label class="check m-l-sm" v-if="modal.betrecords">
                            <input type="checkbox" v-model="modal.retreat"/>
                            <i class="blue"></i>
                            {{$t('system_msg.retreat_schedule_all')}}
                        </label>
                    </div>
                    <button type="button" class="inline pull-right btn w-xs" @click="hideModal">{{ $t('dic.cancel') }}</button>
                    <button
                        type="button"
                        class="inline pull-right btn blue m-r-xs w-xs"
                        @click="updateGameResult"
                        v-if="modal.mode === 'manual_draw' && $root.permissions.includes('manually_draw_game_result')"
                        :disabled="!modal.sureDraw"
                    >
                        <span v-if="!modal.loading">{{ $t('dic.confirm') }}</span>
                        <i class="fa fa-spin fa-spinner" v-else></i>
                    </button>
                    <button
                        type="button"
                        class="inline pull-right btn blue m-r-xs w-xs"
                        @click="noDrawHandler"
                        v-else-if="modal.mode === 'no_draw'"
                    >
                        <span v-if="!modal.loading">{{ $t('dic.confirm') }}</span>
                        <i class="fa fa-spin fa-spinner" v-else></i>
                    </button>
                    <button
                        type="button"
                        class="inline pull-right btn blue m-r-xs w-xs"
                        @click="retreatSchedule"
                        v-else
                    >
                        <span v-if="!modal.loading">{{ $t('dic.confirm') }}</span>
                        <i class="fa fa-spin fa-spinner" v-else></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div class="row m-b-lg m-t">
        <pulling
            :queryset="queryset"
            :query="query"
            :api="pullingApi"
            :extra="extra"
            ref="pulling"
            @query-data="queryData"
            @query-param="queryParam"
        />
    </div>
</div>
</template>
<script>
import url from '../../service/url'
import Pulling from '../../components/Pulling'
import Vue from 'vue'
import _ from 'lodash'
import date from '../../utils/date'
import $ from '../../utils/util'
import { getGame, updateGame } from '../../service'

const historyURL = url.game.history
const schedURL = url.game.schedule
const dateFormat = 'YYYY-MM-DD'

export default {
    data () {
        return {
            today: Vue.moment().format(dateFormat),
            shortcuts: ['today', 'yesterday', 'this_week', 'this_month', 'last_month'].map(element => Object({
                text: this.$t(`time.${element}`),
                onClick (p) {
                    p.$emit('pick', date[element])
                }
            })),
            mode: 0,
            game: {
                id: '',
                display_name: '',
                rules: {},
                code: ''
            },
            retreatedScheds: [],
            timeRangeGames: ['hkl', 'fc3d'],
            input: {
                date: '',
                period: ''
            },
            inputPeriod: '',
            modal: {
                id: '',
                isShow: false,
                mode: '',
                time: '',
                betrecords: '',
                scheduleResult: {},
                sureDraw: false,
                inform: false,
                retreat: false,
                loading: false
            },
            extra: '',
            pullingApi: '',
            queryset: [],
            query: {},
            allCol: [],
            resultCol: [],
            resultColMode: undefined,
            displayResultCol: [
                'ball_num',
                'ball_odd_even',
                'ball_than_size',
                'ball_tail_than_size',
                'ball_of_sum_number_odd_even',
                'ball_prime_composite'
            ],
            sumCol: [],
            displaySumCol: [
                'sum_of_ball',
                'sum_of_ball_odd_even',
                'sum_of_ball_than_size',
                'sum_of_ball_five_element',
                'sum_of_ball_color_wavelength',
                'sum_of_ball_five_element',
                'sum_of_ball_tail_than_size',
                'sum_of_ball_great_tiny',
                'sum_of_1st_2st',
                'sum_of_1st_2st_odd_even',
                'sum_of_1st_2st_than_size'
            ],
            threeBallsSumCol: [],
            displayThreeBallsSumCol: [
                'three_balls_sum',
                'sum_of_ball_odd_even',
                'sum_of_ball_than_size',
                'sum_of_ball_tail_than_size',
                'sum_of_ball_prime_composite_tail'
            ],
            sumCol1st2nd: true,
            dragonTigerCol: [],
            comparisonCol: [],
            niouniouCol: [],
            otherCol: [],
            displayOtherCol: [
                'ball_max_min_diff',
                'seven_color_wavelength'
            ],
            twoRow: false
        }
    },
    created () {
        const gameid = this.$route.params.id
        this.mode = parseInt(this.$route.query.mode) || 0
        this.getGameInfo(gameid)
        this.game.id = gameid
        this.game.code = this.$route.query.game_code
        if (this.mode) {
            // abnormal message
            this.extra = `game=${gameid}&date=${this.today}&abnormal=True`
            this.pullingApi = schedURL
        } else {
            // game result in detail
            if (this.timeRangeGames.includes(this.game.code)) {
                this.input.date = date.this_month
                this.extra = `created_at_0=${this.input.date[0]}&created_at_1=${this.input.date[1]}`
            } else {
                this.input.date = this.today
                this.extra = `date=${this.today}`
            }
            this.pullingApi = historyURL
            this.getRetreatedSchedules(gameid)
        }
        this.$nextTick(() => {
            this.$refs.pulling.rebase()
        })
    },
    beforeMount () {
        this.timingPulling = setInterval(() => {
            this.$refs.pulling.rebase()
        }, 20 * 1000)
        if (!this.mode) {
            this.timingRetreatShced = setInterval(() => {
                this.getRetreatedSchedules()
            }, 5 * 1000)
        }
    },
    watch: {
        mode (newMode) {
            if (this.mode) {
                this.extra = `game=${this.game.id}&date=${this.today}&abnormal=True`
                this.pullingApi = schedURL
                clearInterval(this.timingRetreatShced)
            } else {
                if (this.timeRangeGames.includes(this.game.code)) {
                    this.input.date = date.this_month
                    this.extra = `created_at_0=${this.input.date[0]}&created_at_1=${this.input.date[1]}`
                } else {
                    this.input.date = this.today
                    this.extra = `date=${this.today}`
                }
                this.pullingApi = historyURL
                this.timingRetreatShced = setInterval(() => {
                    this.getRetreatedSchedules()
                }, 5 * 1000)
            }
            this.queryset = []
            this.$nextTick(() => {
                this.$refs.pulling.rebase()
            })
        },
        queryCondition (condition) {
            this.pullingApi = historyURL
            this.queryset = []
            clearInterval(this.timingPulling)
            this.extra = `game_code=${this.game.code}${condition}`
            this.$nextTick(() => {
                this.$refs.pulling.rebase()
                this.timingPulling = setInterval(() => {
                    this.$refs.pulling.rebase()
                }, 20 * 1000)
            })
        },
        'input.period': _.debounce(function (val) {
            this.inputPeriod = val
        }, 1000)
    },
    methods: {
        getRetreatedSchedules (gameid) {
            gameid = gameid || this.game.id
            getGame('schedule', {
                params: {
                    game: gameid,
                    ongoing: 'True'
                }
            }).then(data => {
                this.retreatedScheds = data
            })
        },
        getGameInfo (id) {
            getGame('list', { id }).then(data => {
                this.game = data
            })
        },
        showModal (sched, modalMode = 'manual_draw') {
            if (modalMode === 'manual_draw' || modalMode === 'no_draw') {
                Object.assign(this.modal, {
                    mode: modalMode,
                    scheduleResult: {
                        game_schedule: this.mode ? sched.id : sched.schedule_id,
                        game_code: this.$route.query.game_code,
                        result_str: '',
                        issue_number: sched.issue_number
                    },
                    time: this.mode ? sched.schedule_result : sched.created_at,
                    betrecords: sched.bets_count,
                    sureDraw: false,
                    isShow: true,
                    inform: false,
                    retreat: false
                })
                $.notify({
                    message: this.$t(`system_msg.${modalMode}_alert`),
                    type: 'warning'
                })
            } else if (modalMode === 'retreat_schedule') {
                let id = sched.status === 'open' ? sched.id : sched.schedule_id
                id && getGame('scheduleRetreat', { id }).then(data => {
                    let memberAmount = data.bets_info && data.bets_info
                        .map(b => [b.win_bets.settled_amount, b.lose_bets.settled_amount])
                        .reduce((acc, cur) => [cur[0] + acc[0], cur[1] + acc[1]])
                    Object.assign(this.modal, {
                        id,
                        mode: modalMode,
                        time: sched.schedule_result,
                        scheduleResult: sched,
                        isShow: true,
                        status: data.status,
                        ...(data.bets_info && { betsInfo: data.bets_info }),
                        ...(memberAmount && { memberAmount: memberAmount })
                    })
                })
            }
        },
        hideModal () {
            this.modal.isShow = false
        },
        getResultClass (resultNum) {
            let gameClass = `result-${this.game.code}`
            let resultClass = `resultnum-${parseInt(resultNum)}`
            return [gameClass, resultClass]
        },
        retreatSchedule () {
            this.modal.loading = true
            updateGame('scheduleRetreat', {
                id: this.modal.id,
                data: {
                    status: this.modal.status === 'close' ? 'force_cancelled' : 'cancelled'
                }
            }, {
                action: this.$t('game.retreat_schedule')
            }).then(data => {
                this.modal.status === 'open' ? this.getRetreatedSchedules() : this.$refs.pulling.rebase()
                this.modal.loading = false
                this.hideModal()
            }, () => {
                this.modal.loading = false
            })
        },
        noDrawHandler () {
            this.modal.loading = true
            updateGame('scheduleRetreat', {
                id: this.modal.scheduleResult.game_schedul,
                data: {
                    status: 'no_draw',
                    inform: this.modal.inform ? 1 : 0,
                    retreat: this.modal.retreat ? 1 : 0
                }
            }, {
                action: this.$t('dic.set')
            }).then(data => {
                this.$refs.pulling.rebase()
                this.modal.loading = false
                this.hideModal()
            }, () => {
                this.modal.loading = false
            })
        },
        updateGameResult () {
            if (this.modal.scheduleResult.result_str) {
                let [judgement, result] = $.validateResultStr(this.modal.scheduleResult.result_str)
                if (!judgement) {
                    $.notify({
                        message: this.$t('system_msg.draw_number_wrong'),
                        type: 'danger'
                    })
                    return
                } else {
                    this.modal.scheduleResult.result_str = result
                }
                this.modal.loading = true
                updateGame('result', {
                    data: this.modal.scheduleResult
                }, {
                    action: this.$t('game.manual_draw')
                }).then(() => {
                    this.$refs.pulling.rebase()
                    this.modal.loading = false
                    this.hideModal()
                }, () => {
                    this.modal.loading = false
                })
            } else {
                $.notify({
                    message: this.$t('game.draw_number_no_set'),
                    type: 'warning'
                })
            }
        },
        submit () {
            this.$refs.pulling.submit()
        },
        queryData (queryset) {
            this.queryset = queryset
        },
        queryParam (query) {
            this.query = query
        },
        changeResultColMode (col) {
            this.resultColMode = col
        }
    },
    computed: {
        inputDate () {
            return Array.isArray(this.input.date)
            ? [
                this.input.date[0] ? Vue.moment(this.input.date[0]).format(dateFormat) : '',
                this.input.date[1] ? Vue.moment(this.input.date[1]).format(dateFormat) : ''
            ]
            : this.input.date ? Vue.moment(this.input.date).format(dateFormat) : ''
        },
        queryCondition () {
            let condition = ''
            if (Array.isArray(this.inputDate)) {
                condition += `${this.inputDate[0] && `&created_at_0=${this.inputDate[0]}`}${this.inputDate[1] && `&created_at_1=${this.inputDate[1]}`}`
            } else {
                condition += `&created_at_0=${this.inputDate}&created_at_1=${this.inputDate}`
            }
            if (this.inputPeriod) {
                condition += `&issue_number_q=${this.inputPeriod}`
            }
            return condition
        },
        filteredResults () {
            if (!this.mode) {
                let category = []
                let resultCol = new Set()
                let sumCol = new Set()
                let threeBallsSumCol = new Set()
                let dragonTigerCol = new Set()
                let comparisonCol = new Set()
                let niouniouCol = new Set()
                let otherCol = new Set()
                if (this.queryset.length > 0) {
                    if (this.game.code === 'bjkl8') {
                        this.queryset.forEach(result => {
                            let resultStr = result.result_str.split(',')
                            if (resultStr.length <= 20) {
                                return
                            }
                            resultStr.pop()
                            result.result_str = resultStr.join(',')
                        })
                    }
                    let validResult = this.queryset.find(i => i.result_status === 'valid')
                    if (validResult) {
                        category = Object.keys(validResult.result_category).map(i => i.split('_'))
                        category.forEach(i => {
                            if (i[0] === 'ball') {
                                if (i[1] === 'max' && i[2] === 'min' && i[3] === 'diff') {
                                    otherCol.add(i.join('_'))
                                } else {
                                    i.splice(i.length - 1, 1)
                                    resultCol.add(i.join('_'))
                                }
                            } else if (i[0] === 'sum') {
                                this.sumCol1st2nd = (i[2][0] === '1' && i[3][0] === '2')
                                if (this.game.code === 'fc3d') {
                                    threeBallsSumCol.add(i.join('_'))
                                } else {
                                    sumCol.add(i.join('_'))
                                }
                            } else if (i[0] === 'three' && i[1] === 'balls') {
                                threeBallsSumCol.add(i.join('_'))
                            } else if (i[0] === 'dragon' && i[1] === 'tiger') {
                                dragonTigerCol.add(i)
                            } else if (i[i.length - 1] === 'cp') {
                                comparisonCol.add(i.join('_'))
                            } else if (i[0] === 'banker' || i[0] === 'player') {
                                if (!(i[2] && i[2] === 'result')) {
                                    niouniouCol.add(i.join('_'))
                                }
                            } else {
                                otherCol.add(i.join('_'))
                            }
                        })
                    }
                }
                this.resultCol = ['ball_num', ...resultCol].filter(e => this.displayResultCol.includes(e))
                this.sumCol = [...sumCol].filter(e => this.displaySumCol.includes(e))
                this.threeBallsSumCol = [...threeBallsSumCol].filter(e => this.displayThreeBallsSumCol.includes(e))
                this.dragonTigerCol = [...dragonTigerCol].sort((a, b) => a[2] - b[2]).map(e => e.join('_'))
                this.comparisonCol = [...comparisonCol]
                this.niouniouCol = [...niouniouCol]
                this.otherCol = [...otherCol].filter(e => this.displayOtherCol.includes(e))

                this.allCol = [this.sumCol, this.threeBallsSumCol, this.dragonTigerCol, this.comparisonCol].filter(e => e.length > 0)
                this.twoRow = (this.sumCol.length || this.threeBallsSumCol.length || this.dragonTigerCol.length > 1 || this.comparisonCol.length || this.niouniouCol.length)
            } else {
                this.resultCol = this.sumCol = this.dragonTigerCol = this.comparisonCol = this.otherCol = this.allCol = []
                this.twoRow = false
            }
            return this.queryset
        },
        isShowRetreatedSched () {
            return this.$refs.pulling.isPageOne &&
            (Array.isArray(this.input.date) ? this.today === Vue.moment(this.input.date[1]).format(dateFormat) : this.today === Vue.moment(this.input.date).format(dateFormat)) &&
            !this.input.period &&
            !this.mode
        }
    },
    components: {
        Pulling
    },
    beforeDestroy () {
        clearInterval(this.timingPulling)
        clearInterval(this.timingRetreatShced)
    }
}
</script>
<style lang="scss" scoped>
.text-center th {
    text-align: center;
}
.bigger, .even, .composite {
  background: lightsalmon;
}
.smaller, .odd, .prime {
  background: lightslategray;
}
.equal {
  background: skyblue;
}
.text-bigger, .text-even, .text-red, .text-great, .text-dragon, .text-composite {
  color: lightsalmon;
}
.text-green {
  color: lightgreen;
}
.niouniou-win {
    background-color: #d9ecff;;
}
.result-balls span{
  display: inline-block;
  vertical-align: middle;
  margin-right: 5px;
}
.v-m td{
  vertical-align: middle;
}
.circle {
  color: aliceblue;
  width: 28px;
  height: 28px;
  line-height: 30px;
  border-radius: 50%;
}
</style>
