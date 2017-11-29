<template>
<div>
    <div class="row m-b">
        <div class="col-xs-3 text-left"><h3>{{ game.display_name }}</h3></div>
        <div class="col-xs-9 text-right">
            <button class="md-btn w-sm blue" @click="showModal(0)">{{ $t('game_history.manual_draw') }}</button>
        </div>
    </div>
    <div class="box">
        <div class="box-body clearfix form-inline form-input-sm">
            <div class="row">
                <div class="col-xs-3">
                    <label>{{$t('game_history.date')}}：</label>
                    <date-picker width='140' 
                    v-model="input.date" 
                    @input="setDate"></date-picker>
                </div>
                <div class="col-xs-3">
                    <label>{{$t('game_history.periods')}}：</label>
                    <input type="number" 
                    v-model.number="input.period" 
                    :placeholder="$t('game_history.periods')" 
                    class="form-control">
                </div>
            </div>
        </div>
    </div>
    <div class="modal" v-if="modal.isShow">
        <div class="modal-backdrop fade in" @click="hideModal"></div>
        <div class="modal-dialog">
            <div class="modal-content" v-if="modal.mode===0">
                <div class="modal-header">
                    <span>{{ game.display_name }} - {{ $t('game_history.manual_draw') }}</span>
                    <button type="button" class="close" aria-hidden="true" @click="hideModal"><i class="fa fa-close"></i></button>
                </div>
                <div class="modal-body">
                    <table st-table="rowCollectionBasic" class="table b-t">
                        <thead>
                            <tr>
                                <th>{{ $t('game_history.periods') }}</th>
                                <th>{{ $t('game_history.draw_date') }}</th>
                                <th>{{ $t('game_history.draw_number') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{{ modal.gameResult.issue_number }}</td>
                                <td>{{ today }}</td>
                                <td>
                                    <input class="form-control" v-model="modal.gameResult.result_str">
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="m-l m-r">
                        <alert-msg :msg="modal.msg" ref="alertMsg" @hide-modal="hideModal" ></alert-msg>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" @click="updateGameResult">{{ $t('action.create') }}</button>
                    <button type="button" class="btn btn-default" @click="hideModal">{{ $t('staff.close') }}</button>
                </div>
            </div>
            <div class="modal-content" v-if="modal.mode===1">
                <div class="modal-header">
                    <span><strong>{{ game.display_name }} - {{ '确定撤单吗？'}}</strong></span>
                    <button type="button" class="close" aria-hidden="true" @click="hideModal"><i class="fa fa-close"></i></button>
                </div>
                <div class="modal-body">
                    <table st-table="rowCollectionBasic" class="table b-t m-t text-center">
                        <thead>
                            <tr>
                                <th class="text-center">{{ $t('game_history.periods') }}</th>
                                <th class="text-center">{{ $t('game_history.draw_date') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{{ modal.retreat_sched.issue_number }}</td>
                                <td>{{ modal.retreat_sched.schedule_result | moment("YYYY-MM-DD HH:mm:ss") }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="m-l m-r">
                        <alert-msg :msg="modal.msg" ref="alertMsg" @hide-modal="hideModal" ></alert-msg>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" @click="retreatSchedule">{{ $t('action.confirm') }}</button>
                    <button type="button" class="btn btn-default" @click="hideModal">{{ $t('staff.close') }}</button>
                </div>
            </div>
        </div>
    </div>
    <div class="card col">
        <div class="card-body">
            <table class="table table-hover" v-show="queryset.length>0">
                <thead>
                    <tr>
                        <th scope="col">{{$t('game_history.periods')}}</th>
                        <th scope="col">{{$t('game_history.draw_date')}}</th>
                        <th scope="col">{{$t('game_history.draw_number')}}</th>
                        <th scope="col">{{$t('game_history.memo')}}</th>
                    </tr>
                </thead>
                <tbody class="v-m">
                    <tr v-if="isPageOne" v-for="sched in retreat_scheds" :key="sched.id">
                        <td>{{ sched.issue_number }}</td>
                        <td>{{ sched.schedule_result | moment("YYYY-MM-DD HH:mm:ss") }}</td>
                        <td>
                            <button class="md-btn blue w-s" @click="showModal(1, sched)" v-show="sched.status!=='cancelled'">{{ $t('game_history.retreat_sched') }}</button>
                        </td>
                        <td>
                            <span v-if="sched.status==='cancelled'">{{ $t('game_history.cancelled') }}</span>
                        </td>
                    </tr>
                    <tr v-for = "selected_result in filteredResults" :key = "selected_result.game_id">
                        <td>{{selected_result.issue_number}}</td>
                        <td>{{selected_result.created_at | moment("YYYY-MM-DD HH:mm:ss")}}</td>
                        <td class="result-balls">
                            <span v-for="(result, index) in selected_result.result_str.split(',')" :class="getResultClass(result)" :key="index">
                                <b> {{result}} </b>
                            </span>
                        </td>
                        <td>{{selected_result.created_by === null ? '' : $t('game_history.manual_draw')}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div class="row m-b-lg m-t">
        <pulling 
        :queryset="queryset"
        :query="query"
        :api="gameResultApi"
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
const dateFormat2 = 'YYYYMMDD'

export default {
    data () {
        return {
            game: {
                id: '',
                display_name: '',
                game_code: ''
            },
            newest_result: undefined,
            retreat_scheds: [],
            input: {
                date: Vue.moment().format(dateFormat),
                period: ''
            },
            modal: {
                mode: 0,
                // 0-> manual draw; 1-> retreat schedule
                isShow: false,
                gameResult: {
                    game_code: '',
                    issue_number: '',
                    result_str: ''
                },
                retreat_sched: {},
                msg: ''
            },
            gameResultApi: api.game_result,
            queryset: [],
            query: {},
            extra: '',
            today: Vue.moment().format(dateFormat)
        }
    },
    created () {
        const gameid = this.$route.params.id
        this.game.id = gameid
        this.extra = `game=${gameid}&date=${this.today}`
        this.getGameName(gameid)
        this.getNewestResult(gameid)
        this.getRetreatSchedules(gameid)

        this.$nextTick(() => {
            this.$refs.pulling.rebase()
        })
    },
    beforeMount () {
        this.timing = setInterval(() => {
            this.$refs.pulling.rebase()
            this.getNewestResult()
            this.getRetreatSchedules()
        }, 1000)
        this.timing_retreat_shced = setInterval(() => {
            this.getRetreatSchedules()
        }, 1000)
    },
    methods: {
        setDate () {
            const date = Vue.moment(this.input.date).format(dateFormat)
            this.extra = `game=${this.game.id}&date=${date}`
            if (date !== this.today) {
                clearInterval(this.timing)
            } else {
                this.timing = setInterval(() => {
                    this.$refs.pulling.rebase()
                    this.getNewestResult()
                    this.getRetreatSchedules()
                }, 20000)
            }
            this.$nextTick(() => {
                this.$refs.pulling.rebase()
            })
        },
        getRetreatSchedules (gameid) {
            gameid = gameid || this.game.id
            this.$http.get(api.game_schedule + `?game=${gameid}&ongoing=True`)
            .then(response => {
                this.retreat_scheds = response.data
            })
        },
        getNewestResult (gameid) {
            gameid = gameid || this.game.id
            this.$http.get(api.game_result + `?game=${gameid}&date=${this.today}&limit=1`)
            .then(response => {
                this.newest_result = Object.assign({}, this.newest_result, response.data.data.results[0])
            })
        },
        getGameName (gameid) {
            this.$http.get(api.game_list + gameid)
            .then(response => {
                this.game.display_name = response.data.display_name
                this.game.game_code = response.data.code
                this.modal.gameResult.game_code = response.data.code
            })
        },
        showModal (mode, sched) {
            this.modal.mode = mode
            if (mode === 0) {
                if (this.queryset.length === 0) {
                    this.modal.gameResult.issue_number = Vue.moment().format(dateFormat2) + '000'
                } else {
                    this.modal.gameResult.issue_number = parseInt(this.newest_result.issue_number) + 1
                }
            } else {
                this.modal.retreat_sched = Object.assign({}, this.modal.retreat_sched, sched)
            }
            this.modal.isShow = true
        },
        hideModal () {
            this.modal.isShow = false
        },
        updateGameResult () {
            if (this.modal.gameResult.result_str) {
                this.$http.post(api.game_result, this.modal.gameResult)
                .then((response) => {
                    if (response.data.code === 2000) {
                        this.modal.msg = this.$t('game_history.manual_draw_success')
                        this.$refs.alertMsg.trigger('success', 1, true)
                        this.$refs.pulling.rebase()
                    } else {
                        this.modal.msg = this.$t('game_history.manual_draw_fail') + ` (${response.data.msg.join(' ')})`
                        this.$refs.alertMsg.trigger('danger')
                    }
                })
            } else {
                this.modal.msg = this.$t('game_history.no_setting_draw_number')
                this.$refs.alertMsg.trigger('warning', 3)
            }
        },
        getResultClass (resultNum) {
            let gameClass = 'result-' + this.game.game_code
            let resultClass = 'resultnum-' + parseInt(resultNum)
            return [gameClass, resultClass]
        },
        retreatSchedule () {
            this.$http.put(api.game_schedretreat + `${this.modal.retreat_sched.id}/`, { 'status': 'cancelled' })
            .then(response => {
                this.modal.msg = this.$t('game_history.cancelled')
                this.$refs.alertMsg.trigger('success', 1, true)
                this.getRetreatSchedules()
            }, response => {
                let errMsg = ''
                if (response.status === 400) {
                    for (let index in response.data.error) {
                        for (let property in response.data.error[index]) {
                            errMsg += `${property} : ${response.data.error[index][property]}`
                        }
                    }
                    this.modal.msg = this.$t('game_history.retreat_sched_fail') + this.$t('game_history.later_try') + `（${errMsg}）`
                    this.$refs.alertMsg.trigger('danger')
                }
            })
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
            if (!this.queryset.length) {
                return []
            }
            const rawResults = this.queryset
            return rawResults.filter(rawResult => {
                if (rawResult['issue_number'].indexOf(this.input.period) !== -1) {
                    return true
                }
            })
        },
        isPageOne () {
            return this.queryset.length > 0 && this.newest_result && this.queryset[0].issue_number === this.newest_result.issue_number
        }
    },
    components: {
        DatePicker,
        pulling,
        alertMsg
    },
    beforeDestroy () {
        clearInterval(this.timing)
        clearInterval(this.timing_retreat_shced)
    }
}
</script>
<style lang="scss" scoped>
@import '../../assets/resultsball.sass';
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
