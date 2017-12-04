<template>
<div>
    <div class="row m-b">
        <div class="m-l"><h3>{{ game.display_name }}</h3></div>
    </div>
    <div class="box">
        <div class="box-body clearfix form-inline form-input-sm">
            <div class="row">
                <div class="col-xs-3">
                    <label>{{$t('game_history.date')}}：</label>
                    <date-picker 
                    width='140' 
                    v-model="input.date" 
                    @input="setDate"
                    ></date-picker>
                </div>
                <div class="col-xs-3">
                    <label>{{$t('game_history.periods')}}：</label>
                    <input 
                    type="number" 
                    v-model.number="input.period" 
                    :placeholder="$t('game_history.periods')" 
                    class="form-control"
                    >
                </div>
                <div class="col-xs-3 m-t-xs">
                    <input 
                    type="checkbox"
                    value="1" 
                    name="exception" 
                    v-model="mode"
                    >
                    <i class="blue"></i>
                    {{$t('game_history.abnormal_period')}}
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
                                <th>{{ $t('game_history.draw_date') }}</th>
                                <th v-show="mode">{{ $t('game_history.draw_number') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{{ modal.scheduleResult.issue_number }}</td>
                                <td>{{ modal.scheduleResult.schedule_result | moment("YYYY-MM-DD HH:mm:ss") }}</td>
                                <td v-show="mode">
                                    <input class="form-control" v-model="modal.scheduleResult.result_str">
                                    <span>{{ $t('game_history.result_str_tips',{
                                    num_len: game.rules.num_len,
                                    unique: game.rules.unique?$t('game_history.non_repetitive'):$t('game_history.repeatable'),
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
                    <button type="button" class="btn btn-primary" @click="updateGameResult" v-if="mode">{{ $t('action.confirm') }}</button>                    
                    <button type="button" class="btn btn-primary" @click="retreatSchedule" v-else>{{ $t('action.confirm') }}</button>
                    <button type="button" class="btn btn-default" @click="hideModal">{{ $t('staff.close') }}</button>
                </div>
            </div>
        </div>
    </div>
    <div class="card col">
        <div class="card-body">
            <table class="table" v-show="queryset.length>0">
                <thead>
                    <tr>
                        <th scope="col">{{$t('game_history.periods')}}</th>
                        <th scope="col">{{$t('game_history.draw_date')}}</th>
                        <th scope="col" v-if="mode">{{ $t('game_history.period_bet_record') }}</th>
                        <th scope="col" v-else>
                            <button class="btn btn-xs blue">{{ $t('game_history.show_number') }}</button>
                            <button class="btn btn-xs blue">{{ $t('game_history.show_big_small') }}</button>
                            <button class="btn btn-xs blue">{{ $t('game_history.show_odd_even') }}</button>
                        </th>
                        <th scope="col">{{ mode ? $t('game_history.operating') : $t('game_history.memo')}}</th>
                    </tr>
                </thead>
                <tbody class="v-m">
                    <tr v-if="isPageOne" v-for="sched in retreatedScheds" :key="sched.id">
                        <td>{{ sched.issue_number }}</td>
                        <td>{{ sched.schedule_result | moment("YYYY-MM-DD HH:mm:ss") }}</td>
                        <td>
                            <button class="md-btn blue" @click="showModal(sched)" v-show="sched.status!=='cancelled'">{{ $t('game_history.retreat_sched') }}</button>
                        </td>
                        <td>
                            <span v-if="sched.status==='cancelled'">{{ $t('game_history.cancelled') }}</span>
                        </td>
                    </tr>
                    <tr v-for = "result in filteredResults" :key = "result.game_id">
                        <td>{{ result.issue_number }}</td>
                        <td>{{ (mode ? result.schedule_result : result.created_at) | moment("YYYY-MM-DD HH:mm:ss") }}</td>
                        <td v-if="mode"></td>
                        <td v-else class="result-balls">
                            <!-- <span v-show="result.result_str!==undefined" v-for="(resultball, index) in result.result_str.split(',')" :class="getResultClass(resultball)" :key="index">
                                <b>{{ resultball }}</b>
                            </span> -->
                            <span class="label label-warning">{{ $t('game_history.big') }}</span>
                        </td>
                        <td v-if="mode">
                            <span class="label btn blue" @click="showModal(result)">{{ $t('game_history.manual_draw') }}</span>
                        </td>
                        <td v-else>{{ result.created_by === null ? '' : $t('game_history.manual_draw') }}</td>
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
        >
        </pulling>
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
                game_code: '',
                rules: {}
            },
            retreatedScheds: [],
            input: {
                date: Vue.moment().format(dateFormat),
                period: ''
            },
            modal: {
                isShow: false,
                scheduleResult: {},
                msg: ''
            },
            extra: '',
            pullingApi: '',
            queryset: [],
            query: {},
            today: Vue.moment().format(dateFormat)
        }
    },
    created () {
        const gameid = this.$route.params.id
        this.mode = this.$route.query.mode || 0
        this.game.id = gameid
        this.extra = `game=${this.game.id}&date=${this.today}&${this.mode ? 'abnormal=True' : ''}`
        this.pullingApi = this.mode ? api.game_schedule : api.game_result
        this.getGameName(gameid)
        this.getRetreatedSchedules(gameid)

        this.$nextTick(() => {
            this.$refs.pulling.rebase()
        })
    },
    beforeMount () {
        this.timingPulling = setInterval(() => {
            this.$refs.pulling.rebase()
        }, 20 * 1000)
        this.timingRetreatShced = setInterval(() => {
            this.getRetreatedSchedules()
        }, 5 * 1000)
    },
    watch: {
        mode (newMode) {
            if (!this.mode) {
                clearInterval(this.timingRetreatShced)
            } else {
                this.timingRetreatShced = setInterval(() => {
                    this.getRetreatedSchedules()
                }, 5 * 1000)
            }
            this.queryset = []
            this.extra = `game=${this.game.id}&date=${this.today}${this.mode ? '&abnormal=True' : ''}`
            this.pullingApi = this.mode ? api.game_schedule : api.game_result
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
            .then(response => {
                this.retreatedScheds = response.data
            })
        },
        getGameName (gameid) {
            this.$http.get(api.game_list + gameid)
            .then(response => {
                this.game.display_name = response.data.display_name
                this.game.game_code = response.data.code
                this.game.rules = response.data.rules
            })
        },
        showModal (sched) {
            if (this.mode) {
                this.modal.scheduleResult = {
                    ...this.modal.scheduleResult,
                    game_code: sched.game_code,
                    result_str: '',
                    issue_number: sched.issue_number
                }
            } else {
                this.modal.scheduleResult = sched
            }
            this.modal.isShow = true
        },
        hideModal () {
            this.modal.isShow = false
        },
        getResultClass (resultNum) {
            let gameClass = `result-${this.game.game_code}`
            let resultClass = `resultnum-${parseInt(resultNum)}`
            return [gameClass, resultClass]
        },
        retreatSchedule () {
            this.$http.put(`${api.game_schedretreat}${this.modal.scheduleResult.id}/`, { 'status': 'cancelled' })
            .then(response => {
                this.modal.msg = this.$t('game_history.cancelled')
                this.$refs.alertMsg.trigger('success', 1, true)
                this.getRetreatedSchedules()
            }, response => {
                let errMsg = ''
                if (response.status === 400) {
                    for (let index in response.data.error) {
                        for (let property in response.data.error[index]) {
                            errMsg += `${property} : ${response.data.error[index][property]}`
                        }
                    }
                    this.modal.msg = this.$t('game_history.retreat_sched_fail') + this.$t('game_history.try_later') + `（${errMsg}）`
                    this.$refs.alertMsg.trigger('danger')
                }
            })
        },
        updateGameResult () {
            if (this.modal.scheduleResult.result_str) {
                this.$http.post(api.game_result, this.modal.scheduleResult)
                .then((response) => {
                    if (response.data.code === 2000) {
                        this.modal.msg = this.$t('game_history.manual_draw_success')
                        this.$refs.alertMsg.trigger('success', 1, true)
                    } else {
                        this.modal.msg = this.$t('game_history.manual_draw_fail') + `（${response.data.msg.join(' ')}）`
                        this.$refs.alertMsg.trigger('danger', 3)
                    }
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
        }
    },
    computed: {
        filteredResults () {
            return this.queryset.filter(result => {
                return result['issue_number'].indexOf(this.input.period) !== -1
            })
        },
        isPageOne () {
            return this.$refs.pulling.isPageOne && this.today === Vue.moment(this.input.date).format(dateFormat) && !this.mode
        },
        numColGroup () {

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
  margin-right: 2px;
}
.v-m td{
  vertical-align: middle;
}
</style>
