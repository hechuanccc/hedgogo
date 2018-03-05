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
                        {{$t('game_history.periods')}}
                    </label>
                    <input
                        type="text"
                        v-model.trim="input.period"
                        :placeholder="$t('game_history.periods')"
                        class="form-control w-md"
                    >
                </div>
                <div class="pull-left" v-if="!mode">
                    <label class="form-control-label p-b-0">
                        {{$t('game_history.date')}}
                    </label>
                    <date-picker
                        style="display:block"
                        width='140'
                        v-model="input.date"
                        v-if="game.code !== 'hkl'"
                    />
                    <date-picker
                        style="display:block"
                        width="248"
                        :not-after="today"
                        :shortcuts="shortcuts"
                        type="date"
                        v-model="input.date"
                        format="yyyy-MM-dd"
                        range
                        v-else
                    />
                </div>
            </div>
        </div>
    </div>
    <div class="text-left">
        <input
            type="checkbox"
            value="1"
            name="exception"
            v-model="mode"
        >
            <i class="blue"></i>
            {{$t('game_history.abnormal_period')}}
    </div>
    <div class="card col">
        <div class="card-body">
            <table class="table table-striped table-bordered" v-show="queryset.length > 0 || retreatedScheds.length > 0">
                <thead class="text-center">
                    <tr>
                        <th
                            width="10%"
                            :class="{'p-b-md': twoRow}"
                        >
                            {{ $t('game_history.periods') }}
                        </th>
                        <th
                            width="15%"
                            :class="{'p-b-md': twoRow}"
                        >
                            {{ $t('game_history.draw_date') }}
                        </th>
                        <th class="text-center" v-if="mode">{{ $t('game_history.period_bet_record') }}</th>
                        <th
                            :width="(game.code === 'bjkl8' || game.code === 'auluck8') ? '360' : ''"
                            :class="{'p-b-md': twoRow}"
                            v-else
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
                                    <b>{{ `${resultCol.length > 3 ? '' : $t('game_history.show')}${$t('game_history.' + col)}` }}</b>
                                </span>
                            </template>
                            <span v-else>
                                {{ $t('game_history.draw_number') }}
                            </span>
                        </th>
                        <th
                            class="p-l-0 p-r-0"
                            :width="sumCol.length * 50"
                            v-if="sumCol.length > 0"
                        >
                            <div class="b-b p-b-sm">{{ sumCol1st2nd ? $t('game_history.sum_of_first_second') : $t('game_history.sum') }}</div>
                            <template v-for="col in sumCol" >
                                <div
                                    class="m-t-sm"
                                    :key="col"
                                    :style="{
                                        'display': 'inline-block',
                                        'width': `${100 / sumCol.length}%`
                                    }"
                                >
                                    {{ $t('game_history.' + col) }}
                                </div>
                            </template>
                        </th>
                        <th
                            class="p-l-0 p-r-0"
                            :width="threeBallsSumCol.length * 50"
                            v-if="threeBallsSumCol.length > 0"
                        >
                            <div class="b-b p-b-sm">{{ $t('game_history.three_balls_sum_col') }}</div>
                            <template v-for="col in threeBallsSumCol" >
                                <div
                                    class="m-t-sm"
                                    :key="col"
                                    :style="{
                                        'display': 'inline-block',
                                        'width': `${100 / threeBallsSumCol.length}%`
                                    }"
                                >
                                    {{ $t('game_history.' + col) }}
                                </div>
                            </template>
                        </th>
                        <th
                            :class="['p-l-0 p-r-0', dragonTigerCol.length > 1 ? '' : 'p-b-md']"
                            :width="dragonTigerCol.length * 50"
                            v-if="dragonTigerCol.length > 0"
                        >
                            <div :class="dragonTigerCol.length > 1 ? 'b-b p-b-sm' : ''">{{ $t('game_history.dragon') + $t('game_history.tiger') }}</div>
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
                            class="p-l-0 p-r-0"
                            :width="comparisonCol.length * 50"
                            v-if="comparisonCol.length > 0"
                        >
                            <div :class="comparisonCol.length>1 ? 'b-b p-b-sm' : ''">{{ $t('game_history.comparison') }}</div>
                            <template v-for="col in comparisonCol" v-if="comparisonCol.length>1">
                                <div
                                    class="m-t-sm"
                                    :key="col"
                                    :style="{
                                        'display': 'inline-block',
                                        'width': `${100 / comparisonCol.length}%`
                                    }"
                                >
                                    {{ $t('game_history.' + col) }}
                                </div>
                            </template>
                        </th>
                        <th
                            :class="{'p-b-md': twoRow}"
                            v-for="col in otherCol"
                            :key="col"
                            v-if="otherCol.length > 0"
                        >
                            {{ $t('game_history.' + col) }}
                        </th>
                        <th :class="{'p-b-md': twoRow}">
                            {{ $t('game_history.operating') }}
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
                        <td v-if="sched.status !== 'cancelled'">
                            <span
                                class="label btn blue"
                                @click="showModal(sched, 'retreat_sched')"
                                v-if="$root.permissions.includes('retrieve_ongoing_bets')"
                            >
                                <b>{{ $t('game_history.retreat_sched') }}</b>
                            </span>
                            <span class="label" v-else>{{ $t('game_history.ongoing') }}</span>
                        </td>
                        <td v-else></td>
                        <td v-if="sumCol.length > 0"></td>
                        <td v-if="dragonTigerCol.length > 0"></td>
                        <td v-if="comparisonCol.length > 0"></td>
                        <td
                            v-for="col in otherCol"
                            :key="'empty_' + col"
                            v-if="otherCol.length>0"
                        >
                        </td>
                        <td>
                            <span v-if="sched.status === 'cancelled'">{{ $t('game_history.schedule_cancelled') }}</span>
                        </td>
                    </tr>
                    <tr
                        v-for="result in filteredResults"
                        :key="result.schedule_result"
                    >
                        <td>
                            <span>{{ result.issue_number }}</span>
                            <br/>
                            <span class="text-muted" v-if="result.is_manual">({{ $t('game_history.manual_draw') }})</span>
                            <span class="text-muted" v-else-if="result.remarks !== 'manual_draw' && result.remarks !== null">({{ $t(`game_history.${result.remarks}`) }})</span>
                        </td>
                        <td>{{ result.schedule_result | moment("YYYY-MM-DD HH:mm:ss") }}</td>
                        <td v-if="mode">{{ result.bets_count }}</td>
                        <td v-else class="result-balls">
                            <div v-if="!resultColMode || resultColMode==='ball_num'">
                                <span
                                    v-show="result.result_str !== undefined"
                                    v-for="(resultball, index) in result.result_str.split(',')"
                                    :class="getResultClass(resultball)"
                                    :key="`${result.issue_number}_resultStr_${index}`"
                                >
                                    <b>{{ resultball }}</b>
                                </span>
                            </div>
                            <div v-else>
                                <div
                                    id="circle"
                                    v-for="index in result.result_str.split(',').length"
                                    :class="['m-r-xs inline', result.result_category[`${resultColMode}_${index}`]]"
                                    :key="`${result.issue_number}_${resultColMode}_${index}`"
                                >
                                    {{ $t('game_history.' + result.result_category[`${resultColMode}_${index}`]) }}
                                </div>
                            </div>
                        </td>
                        <td
                            class="p-l-0 p-r-0"
                            v-for="(colList, index) in allCol"
                            :key="'Col_' + index"
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
                                    {{ Number.isInteger(result.result_category[col]) ? result.result_category[col] : $t('game_history.' + result.result_category[col]) }}
                                </div>
                            </template>
                        </td>
                        <td
                            class="p-l-0 p-r-0"
                            v-for="col in otherCol"
                            :key="`${result.issue_number}_${col}_${result.result_category[col]}`"
                            v-if="otherCol.length > 0"
                        >
                            <span v-if="typeof result.result_category[col] === 'number'">{{ result.result_category[col] }}</span>
                            <span :class="`text-${result.result_category[col]}`" v-else>{{ $t('game_history.' + result.result_category[col]) }}</span>
                        </td>
                        <td>
                            <button
                                type="button"
                                :class="['label btn m-r-xs', {
                                    'blue': result.remarks !== 'manual_draw' && $root.permissions.includes('manually_draw_game_result')
                                }]"
                                @click="showModal(result, 'manual_draw')"
                                v-if="$root.permissions.includes('manually_draw_game_result')"
                                :disabled="result.remarks === 'manual_draw' || !$root.permissions.includes('manually_draw_game_result')"
                            ><b>{{ $t('game_history.manual_draw') }}</b>
                            </button>
                            <span v-else-if="!mode">-</span>
                            <span
                                class="label btn blue"
                                @click="showModal(result, 'no_draw')"
                                v-show="mode && $root.permissions.includes('official_no_draw')"
                            ><b>{{ $t('game_history.no_draw') }}</b>
                            </span>
                            <span v-show="mode && !$root.permissions.includes('manually_draw_game_result') && !$root.permissions.includes('official_no_draw')">
                                -
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
                    <span><b>{{ game.display_name }} - {{ $t(`game_history.${modal.mode}`) }}</b></span>
                    <button type="button" class="close" aria-hidden="true" @click="hideModal"><i class="fa fa-close"></i></button>
                </div>
                <div class="modal-body">
                    <table st-table="rowCollectionBasic" class="table b-t m-t v-m">
                        <thead>
                            <tr>
                                <th class="text-center">{{ $t('game_history.periods') }}</th>
                                <th class="text-center" v-if="modal.mode === 'no_draw'">{{ $t('game_history.period_bet_record') }}</th>
                                <th class="text-center">{{ $t('game_history.draw_date') }}</th>
                                <th class="text-center" v-show="modal.mode ==='manual_draw'">{{ $t('game_history.draw_number') }}</th>
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
                                    <span>{{ $t('game_history.result_str_tips', {
                                        num_len: game.rules.num_len,
                                        unique: game.rules.unique ? $t('game_history.non_repetitive') : $t('game_history.repeatable'),
                                        range_floor: game.rules.range_value[0],
                                        range_ceil: game.rules.range_value[1],
                                        separator: game.rules.separator
                                    })}}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="m-l m-r">
                        <alert-msg :msg="modal.msg" ref="alertMsg" @hide-modal="hideModal"></alert-msg>
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="inline pull-left m-l-sm m-t-sm" v-if="modal.mode === 'manual_draw' && $root.permissions.includes('manually_draw_game_result')">
                        <label class="check">
                            <input type="checkbox" v-model="modal.sureDraw"/>
                            <i class="blue"></i>
                            {{$t('game_history.sure_manual_draw', {
                                bet_record_count: modal.betrecords
                            })}}
                        </label>
                    </div>
                    <div class="inline pull-left m-l-sm m-t-sm" v-else-if="modal.mode === 'no_draw'">
                        <label class="check">
                            <input type="checkbox" v-model="modal.inform"/>
                            <i class="blue"></i>
                            {{$t('game_history.inform_no_draw')}}
                        </label>
                    </div>
                    <button type="button" class="inline pull-right btn btn-default" @click="hideModal">{{ $t('action.cancel') }}</button>
                    <button
                        type="button"
                        class="inline pull-right btn blue m-r-xs"
                        @click="updateGameResult"
                        v-if="modal.mode === 'manual_draw' && $root.permissions.includes('manually_draw_game_result')"
                        :disabled="!modal.sureDraw"
                    >{{ $t('action.confirm') }}
                    </button>
                    <button
                        type="button"
                        class="inline pull-right btn blue m-r-xs"
                        @click="noDrawHandler"
                        v-else-if="modal.mode === 'no_draw'"
                    >{{ $t('action.confirm') }}
                    </button>
                    <button
                        type="button"
                        class="inline pull-right btn blue m-r-xs"
                        @click="retreatSchedule"
                        v-else
                    >{{ $t('action.confirm') }}</button>
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
import api from '../../api.js'
import pulling from '../../components/pulling'
import alertMsg from '../../components/alertMsg'
import DatePicker from 'vue2-datepicker'
import Vue from 'vue'
import _ from 'lodash'
import date from '../../utils/date'

const dateFormat = 'YYYY-MM-DD'

export default {
    data () {
        return {
            today: Vue.moment().format(dateFormat),
            shortcuts: ['today', 'yesterday', 'this_week', 'this_month', 'last_month'].map(element => Object({
                text: this.$t(`common.${element}`),
                start: date[element][0],
                end: date[element][1]
            })),
            mode: 0,
            game: {
                id: '',
                display_name: '',
                rules: {},
                code: ''
            },
            retreatedScheds: [],
            input: {
                date: date.today,
                period: ''
            },
            inputPeriod: '',
            modal: {
                isShow: false,
                mode: '',
                time: '',
                betrecords: '',
                scheduleResult: {},
                sureDraw: false,
                inform: false,
                msg: ''
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
            this.pullingApi = api.game_schedule
        } else {
            // game result in detail
            this.extra = `date=${this.today}`
            this.pullingApi = api.game_history
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
                this.pullingApi = api.game_schedule
                clearInterval(this.timingRetreatShced)
            } else {
                this.extra = `date=${this.today}`
                this.pullingApi = api.game_history
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
            this.pullingApi = api.game_history
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
            this.$http.get(`${api.game_schedule}?game=${gameid}&ongoing=True`)
            .then(data => {
                this.retreatedScheds = data
            })
        },
        getGameInfo (gameid) {
            this.$http.get(api.game_list + gameid).then(data => {
                this.game = data
            })
        },
        showModal (sched, modalMode = 'manual_draw') {
            if (modalMode === 'manual_draw' || modalMode === 'no_draw') {
                this.modal = Object.assign({}, {
                    mode: modalMode,
                    scheduleResult: {
                        game_schedule: this.mode ? sched.id : sched.schedule_id,
                        game_code: this.$route.query.game_code,
                        result_str: '',
                        issue_number: sched.issue_number
                    },
                    time: sched.schedule_result,
                    betrecords: sched.bets_count,
                    msg: this.$t(`game_history.${modalMode}_initial_msg`),
                    sureDraw: false,
                    isShow: true,
                    inform: false
                })
                this.$nextTick(() => {
                    this.$refs.alertMsg.trigger('warning')
                })
            } else if (modalMode === 'retreat_sched') {
                this.modal = {
                    mode: modalMode,
                    time: sched.schedule_result,
                    scheduleResult: sched,
                    isShow: true
                }
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
            this.$http.put(`${api.game_schedretreat}${this.modal.scheduleResult.id}/`, {
                'status': 'cancelled'
            }).then(data => {
                this.modal.msg = this.$t('game_history.schedule_cancelled')
                this.$refs.alertMsg.trigger('success', 1, true)
                this.getRetreatedSchedules()
            }, error => {
                this.modal.msg = this.$t('game_history.retreat_sched_fail') + this.$t('game_history.try_later') + `（${error}）`
                this.$refs.alertMsg.trigger('danger')
            })
        },
        noDrawHandler () {
            this.$http.put(`${api.game_schedretreat}${this.modal.scheduleResult.game_schedule}/`, {
                'status': 'no_draw',
                'inform': this.modal.inform ? 1 : 0
            }).then(data => {
                this.modal.msg = this.$t('common.setting') + this.$t('status.success')
                this.$refs.alertMsg.trigger('success', 1, true)
                this.$refs.pulling.rebase()
            }, error => {
                this.modal.msg = `${this.$t('status.failed')}（${error}）`
                this.$refs.alertMsg.trigger('danger')
            })
        },
        updateGameResult () {
            if (this.modal.scheduleResult.result_str) {
                this.$http.post(api.game_result, this.modal.scheduleResult).then(() => {
                    this.modal.msg = this.$t('game_history.manual_draw_success')
                    this.$refs.alertMsg.trigger('success', 1, true)
                    this.$refs.pulling.rebase()
                }, error => {
                    this.modal.msg = this.$t('game_history.manual_draw_fail') + `（${error}）`
                    this.$refs.alertMsg.trigger('danger')
                })
            } else {
                this.modal.msg = this.$t('game_history.no_setting_draw_number')
                this.$refs.alertMsg.trigger('warning')
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
                    category = Object.keys(this.queryset[0].result_category).map(i => i.split('_'))
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
                        } else {
                            otherCol.add(i.join('_'))
                        }
                    })
                }
                this.resultCol = ['ball_num', ...resultCol].filter(e => this.displayResultCol.includes(e))
                this.sumCol = [...sumCol].filter(e => this.displaySumCol.includes(e))
                this.threeBallsSumCol = [...threeBallsSumCol].filter(e => this.displayThreeBallsSumCol.includes(e))
                this.dragonTigerCol = [...dragonTigerCol].sort((a, b) => a[2] - b[2]).map(e => e.join('_'))
                this.comparisonCol = [...comparisonCol]
                this.otherCol = [...otherCol].filter(e => this.displayOtherCol.includes(e))
                this.allCol = [this.sumCol, this.threeBallsSumCol, this.dragonTigerCol, this.comparisonCol].filter(e => e.length > 0)
                this.twoRow = (this.sumCol.length || this.threeBallsSumCol.length || this.dragonTigerCol.length > 1 || this.comparisonCol.length)
            } else {
                this.resultCol = this.sumCol = this.dragonTigerCol = this.comparisonCol = this.otherCol = this.allCol = []
                this.twoRow = false
            }
            return this.queryset
        },
        isShowRetreatedSched () {
            return this.$refs.pulling.isPageOne && Array.isArray(this.input.date) ? this.today === Vue.moment(this.input.date[1]).format(dateFormat) : this.today === Vue.moment(this.input.date).format(dateFormat) && !this.input.period && !this.mode
        }
    },
    components: {
        DatePicker,
        pulling,
        alertMsg
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
.modal-backdrop, .modal{
  z-index: 1;
}
.modal-dialog{
  z-index: 10;
  top: 10%;
}
.modal{
  display: block;
}
.result-balls span{
  display: inline-block;
  vertical-align: middle;
  margin-right: 5px;
}
.v-m td{
  vertical-align: middle;
}
#circle {
  color: aliceblue;
  width: 32px;
  height: 32px;
  line-height: 34px;
  border-radius: 50%;
}
</style>
