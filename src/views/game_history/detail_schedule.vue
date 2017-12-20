<template>
<div>
    <div class="row m-b">
        <div class="m-l"><h3>{{ game.display_name }}</h3></div>
    </div>
    <div class="box">
        <div class="box-body clearfix form-inline form-input-sm">
            <div class="row">
                <div class="col-xs-3">
                    <label>{{$t('game_history.periods')}}：</label>
                    <input 
                    type="number" 
                    v-model.number="input.period" 
                    :placeholder="$t('game_history.periods')" 
                    class="form-control"
                    >
                </div>
                <div class="col-xs-3" v-if="!mode">
                    <label>{{$t('game_history.date')}}：</label>
                    <date-picker
                    width='140'
                    v-model="input.date" 
                    @input="setDate"
                    ></date-picker>
                </div>
            </div>
        </div>
    </div>
    <div class="modal" v-if="modal.isShow">
        <div class="modal-backdrop fade in" @click="hideModal"></div>
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <span><strong>{{ game.display_name }} - {{ mode ? $t('game_history.manual_draw') : $t('game_history.retreat_sched_sure') }}</strong></span>
                    <button type="button" class="close" aria-hidden="true" @click="hideModal"><i class="fa fa-close"></i></button>
                </div>
                <div class="modal-body">
                    <table st-table="rowCollectionBasic" class="table b-t m-t">
                        <thead>
                            <tr>
                                <th>{{ $t('game_history.periods') }}</th>
                                <th>{{ mode ? $t('game_history.period_bet_record') : $t('game_history.draw_date') }}</th>
                                <th v-show="mode">{{ $t('game_history.draw_number') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{{ modal.scheduleResult.issue_number }}</td>
                                <td v-if="mode">{{ modal.betrecords }}</td>
                                <td v-else>{{ modal.scheduleResult.schedule_result | moment("YYYY-MM-DD HH:mm:ss") }}</td>
                                <td v-show="mode">
                                    <input class="form-control" v-model="modal.scheduleResult.result_str">
                                    <span>{{ $t('game_history.result_str_tips',{
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
                        <alert-msg :msg="modal.msg" ref="alertMsg" @hide-modal="hideModal" ></alert-msg>
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="inline m-r-xs checkbox" v-if="mode">
                        <input type="checkbox" v-model="modal.sureDraw">
                        <i class="blue"></i>{{$t('game_history.sure_manual_draw', {bet_record_count: modal.betrecords})}}
                    </div>
                    <button type="button" class="btn btn-primary" @click="updateGameResult" v-if="mode" :disabled="!modal.sureDraw">{{ $t('action.confirm') }}</button>                    
                    <button type="button" class="btn btn-primary" @click="retreatSchedule" v-else>{{ $t('action.confirm') }}</button>
                    <button type="button" class="btn btn-default" @click="hideModal">{{ $t('staff.close') }}</button>
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
                        :class="twoRow ? 'p-b-md' : ''"
                        >{{ $t('game_history.periods') }}
                        </th>
                        <th 
                        width="15%"
                        :class="twoRow ? 'p-b-md' : ''"
                        >{{ $t('game_history.draw_date') }}
                        </th>
                        <th class="text-center" v-if="mode">{{ $t('game_history.period_bet_record') }}</th>
                        <th
                        :width="game.code === 'bjkl8' ? '360' : ''"
                        :class="twoRow ? 'p-b-md' : ''"
                        v-else>
                            <template 
                            v-for="col in resultCol" 
                            v-if="resultCol.length > 1"
                            >
                                <span 
                                class="m-r-xs m-l-xs label btn blue p-a-sm" 
                                :key="col" 
                                @click="changeResultColMode(col)"
                                ><b>{{ `${resultCol.length > 3 ? '' : $t('game_history.show')}${$t('game_history.' + col)}` }}</b>
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
                                >{{ $t('game_history.' + col) }}
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
                                >{{ index + 1 }}
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
                                    'width': `${100/comparisonCol.length}%`
                                }"
                                >{{ $t('game_history.' + col) }}
                                </div>
                            </template>
                        </th>
                        <th
                        :class="twoRow ? 'p-b-md' : ''"
                        v-for="col in otherCol"
                        :key="col"
                        v-if="otherCol.length > 0"
                        >{{ $t('game_history.' + col) }}
                        </th>
                        <th :class="twoRow ? 'p-b-md' : ''">
                            {{ mode ? $t('game_history.operating') : $t('game_history.memo')}}
                        </th>
                    </tr>
                </thead>
                <tbody class="v-m text-center">
                    <tr 
                    v-if="isPageOne"
                    v-for="sched in retreatedScheds"
                    :key="sched.id"
                    >
                        <td>{{ sched.issue_number }}</td>
                        <td>{{ sched.schedule_result | moment("YYYY-MM-DD HH:mm:ss") }}</td>
                        <td>
                            <span
                            class="label btn blue"
                            @click="showModal(sched)"
                            v-show="sched.status !== 'cancelled'"
                            ><b>{{ $t('game_history.retreat_sched') }}</b>
                            </span>
                        </td>
                        <td v-if="sumCol.length > 0"></td>
                        <td v-if="dragonTigerCol.length > 0"></td>
                        <td v-if="comparisonCol.length > 0"></td>
                        <td 
                        v-for="col in otherCol"
                        :key="'retreat_'+col"
                        v-if="otherCol.length>0"
                        ></td>
                        <td>
                            <span v-if="sched.status === 'cancelled'">{{ $t('game_history.cancelled') }}</span>
                        </td>
                    </tr>
                    <tr 
                    v-for="result in filteredResults"
                    :key="result.schedule_result">
                        <td>{{ result.issue_number }}</td>
                        <td>{{ result.schedule_result | moment("YYYY-MM-DD HH:mm:ss") }}</td>
                        <td v-if="mode">{{ result.betrecords }}</td>
                        <td v-else class="result-balls">
                            <div v-if="!resultColMode || resultColMode==='ball_num'">
                                <span
                                v-show="result.result_str !== undefined"
                                v-for="(resultball, index) in result.result_str.split(',')"
                                :class="getResultClass(resultball)"
                                :key="`${result.issue_number}_resultStr_${index}`">
                                    <b>{{ resultball }}</b>
                                </span>
                            </div>
                            <div v-else>
                                <div id="circle" 
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
                            <template
                            v-for="col in colList"
                            >
                                <div 
                                :style="{
                                    'display': 'inline-block',
                                    'width' : `${100 / colList.length}%`
                                }"
                                :class="`text-${result.result_category[col]}`"
                                :key="`${result.issue_number}_${col}_${result.result_category[col]}`"
                                >{{ Number.isInteger(result.result_category[col]) ? result.result_category[col] : $t('game_history.' + result.result_category[col]) }}
                                </div>
                            </template>
                        </td>
                        <td
                        class="p-l-0 p-r-0"
                        v-for="col in otherCol"
                        :key="`${result.issue_number}_${col}_${result.result_category[col]}`"
                        v-if="otherCol.length > 0"
                        > {{ $t('game_history.' + result.result_category[col]) }}
                        </td>
                        <td v-if="mode">
                            <span class="label btn blue" @click="showModal(result)">{{ $t('game_history.manual_draw') }}</span>
                        </td>
                        <td v-else>{{ result.created_by === null ? '' : '' }}</td>
                    </tr>
                </tbody>
            </table>
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

const dateFormat = 'YYYY-MM-DD'

export default {
    data () {
        return {
            mode: 0,
            game: {
                id: '',
                display_name: '',
                rules: {},
                code: ''
            },
            retreatedScheds: [],
            input: {
                date: Vue.moment().format(dateFormat),
                period: ''
            },
            modal: {
                isShow: false,
                scheduleResult: {},
                betrecords: '',
                sureDraw: false,
                time: '',
                msg: ''
            },
            extra: '',
            pullingApi: '',
            queryset: [],
            query: {},
            today: Vue.moment().format(dateFormat),
            allCol: [],
            resultCol: [],
            resultColMode: undefined,
            displayResultCol: [
                'ball_num',
                'ball_odd_even',
                'ball_than_size',
                'ball_tail_than_size',
                'ball_of_sum_number_odd_even'
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
            sumCol1st2nd: true,
            dragonTigerCol: [],
            comparisonCol: [],
            otherCol: [],
            twoRow: false
        }
    },
    created () {
        const gameid = this.$route.params.id
        this.mode = parseInt(this.$route.query.mode) || 0
        this.getGameInfo(gameid)
        this.game.id = gameid
        this.game.code = this.$route.query.code
        if (this.mode) {
            // abnormal message
            this.extra = `game=${gameid}&date=${this.today}&abnormal=True`
            this.pullingApi = api.game_schedule
        } else {
            // game result in detail
            this.extra = `game_code=${this.game.code}&date=${this.today}`
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
                this.extra = `game_code=${this.game.code}&date=${this.today}`
                this.pullingApi = api.game_history
                this.timingRetreatShced = setInterval(() => {
                    this.getRetreatedSchedules()
                }, 5 * 1000)
            }
            this.queryset = []
            this.$nextTick(() => {
                this.$refs.pulling.rebase()
            })
        }
    },
    methods: {
        setDate () {
            const date = Vue.moment(this.input.date).format(dateFormat)
            this.extra = `game=${this.game.id}&date=${date}${this.mode ? '&abnormal=True' : ''}`
            if (date !== this.today) {
                clearInterval(this.timingPulling)
            } else {
                this.timingPulling = setInterval(() => {
                    this.$refs.pulling.rebase()
                    this.getRetreatedSchedules()
                }, 20000)
            }
            this.$nextTick(() => {
                this.$refs.pulling.rebase()
            })
        },
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
        showModal (sched) {
            if (this.mode) {
                this.modal.scheduleResult = {
                    game_schedule: sched.id,
                    game_code: sched.game_code,
                    result_str: '',
                    issue_number: sched.issue_number
                }
                this.modal.time = sched.schedule_result
                this.modal.sureDraw = false
                this.modal.betrecords = sched.betrecords
            } else {
                this.modal.scheduleResult = sched
            }
            this.modal.isShow = true
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
            this.$http.put(`${api.game_schedretreat}${this.modal.scheduleResult.id}/`, { 'status': 'cancelled' })
            .then(data => {
                this.modal.msg = this.$t('game_history.cancelled')
                this.$refs.alertMsg.trigger('success', 1, true)
                this.getRetreatedSchedules()
            }, error => {
                this.modal.msg = this.$t('game_history.retreat_sched_fail') + this.$t('game_history.try_later') + `（${error}）`
                this.$refs.alertMsg.trigger('danger')
            })
        },
        updateGameResult () {
            if (this.modal.scheduleResult.result_str) {
                this.$http.post(api.game_result, this.modal.scheduleResult)
                .then(() => {
                    this.modal.msg = this.$t('game_history.manual_draw_success')
                    this.$refs.alertMsg.trigger('success', 1, true)
                    this.$refs.pulling.rebase()
                }, error => {
                    this.modal.msg = this.$t('game_history.manual_draw_fail') + `（${error.join(' ')}）`
                    this.$refs.alertMsg.trigger('danger', 3)
                })
            } else {
                this.modal.msg = this.$t('game_history.no_setting_draw_number')
                this.$refs.alertMsg.trigger('warning', 3)
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
        filteredResults () {
            if (!this.mode) {
                let category = []
                let resultCol = new Set()
                let sumCol = new Set()
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
                            i.splice(i.length - 1, 1)
                            resultCol.add(i.join('_'))
                        } else if (i[0] === 'sum') {
                            this.sumCol1st2nd = (i[2][0] === '1' && i[3][0] === '2')
                            sumCol.add(i.join('_'))
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
                this.dragonTigerCol = [...dragonTigerCol].sort((a, b) => a[2] - b[2]).map(e => e.join('_'))
                this.comparisonCol = [...comparisonCol]
                this.otherCol = [...otherCol]
                this.allCol = [this.sumCol, this.dragonTigerCol, this.comparisonCol].filter(e => e.length > 0)
                this.twoRow = (this.sumCol.length > 0 || this.dragonTigerCol.length > 1 || this.comparisonCol.length > 0)
            } else {
                this.resultCol = this.sumCol = this.dragonTigerCol = this.comparisonCol = this.otherCol = this.allCol = []
                this.twoRow = false
            }
            return this.queryset.filter(result => {
                return result.issue_number.indexOf(this.input.period) !== -1
            })
        },
        isPageOne () {
            return this.$refs.pulling.isPageOne && this.today === Vue.moment(this.input.date).format(dateFormat) && !this.mode
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
.bigger, .even {
  background: lightsalmon;
}
.smaller, .odd {
  background: lightslategray;
}
.equal {
  background: skyblue;
}
.text-bigger, .text-even, .text-red, .text-great, .text-dragon {
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
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  border-radius: 50%;
}
</style>
