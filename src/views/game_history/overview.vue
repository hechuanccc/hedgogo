<template>
<div>
    <div class="m-b-sm row">
        <div class="col-xs-2">
            <h3>{{$t('game_history.overview')}}</h3>
        </div>
        <div class="col-3 pull-right">
            <button class="md-btn w-sm blue" @click="getPeriods()">
                <span v-if="!isLatest">{{$t('game_history.refresh')}}</span>
                <span v-else>{{$t('game_history.is_latest')}}</span>
            </button>
        </div>
    </div>
    <div class="card">
        <table class="table table-bordered" v-if="count>=gameDraw.length&&count">
            <thead>
                <tr>
                    <th scope="col" rowspan="2" width="20%" class="p-l-md">
                        {{$t('game_history.game')}}
                    </th>
                    <th scope="col" rowspan="2" class="text-center" width="15%">{{ $t('game_history.already_result') }}</th>
                    <th scope="col" rowspan="2" class="text-center" width="15%">{{ $t('game_history.notyet_result') }}</th>
                    <th scope="col" colspan="3" class="text-center p-b-xs" width="50%">{{$t('game_history.abnormal_period')}}</th>
                </tr>
                <tr>
                    <th class="p-t-0 p-b-0 text-center">{{$t('game_history.expired_period')}}</th>
                    <th class="p-t-0 p-b-0 text-center">{{$t('game_history.period_bet_record')}}</th>
                    <th class="p-t-0 p-b-0 text-center">{{$t('game_history.operating')}}</th>
                </tr>
            </thead>
            <tbody>
                <template v-for = "(game, index) in gameDraw">
                <tr class="v-m text-center" v-if="abnormalPeriods[game.game_id]" :key="index">
                    <td class="text-left p-l-md" style="text-transform: uppercase;"
                    :rowspan="abnormalPeriods[game.game_id].length+1"
                    >
                        <router-link :to="'/game_history/'+game.game_id" class="p-l-0">
                        {{ game.game }}
                        </router-link>
                    </td>
                    <td :rowspan="abnormalPeriods[game.game_id].length+1"><span class="label label-lg" style="width:60px;">{{ game.drawn_periods }}</span></td>
                    <td :rowspan="abnormalPeriods[game.game_id].length+1"><span class="label label-lg" style="width:60px;">{{ game.total_periods - game.drawn_periods }}</span></td>
                    <template v-if="abnormalPeriods[game.game_id][0]">
                        <td>{{ abnormalPeriods[game.game_id][0].issue_number }}</td>
                        <td></td>
                        <td class="p-b-sm p-t-sm">
                            <span class="label btn blue" @click="showModal(game, abnormalPeriods[game.game_id][0])">{{ $t('game_history.manual_draw') }}</span>
                        </td>
                    </template>
                    <template v-else>
                        <td colspan="3">{{ $t('game_history.no_abnormal_period')}}</td>
                    </template>
                </tr>
                <tr class="text-center v-m" v-for="(period, i) in abnormalPeriods[game.game_id]" v-if="i" :key="period.id">
                    <td class="">{{ period.issue_number }}</td>
                    <td class=""></td>
                    <td class="p-b-sm p-t-sm">
                        <span class="label btn blue" @click="showModal(game, period)">{{ $t('game_history.manual_draw') }}</span>
                    </td>
                </tr>
                <tr v-if="abnormalPeriods[game.game_id].length>0" :key="index">
                    <td colspan="3" class="text-center">
                        <router-link :to = "'/game_history/' + game.game_id + '?mode=1'"
                        class = "">
                        {{ `${$t('game_history.show_all')}(${abnormalPeriodsCount[game.game_id]})...`  }}
                        </router-link>
                    </td>
                </tr>
                </template>
            </tbody>
        </table>
    </div>
    <div class="modal" v-if="modal.isShow">
        <div class="modal-backdrop fade in" @click="hideModal"></div>
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <span>{{ modal.game.display_name }} - {{ $t('game_history.manual_draw') }}</span>
                    <button type="button" class="close" aria-hidden="true" @click="hideModal">×</button>
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
                        <td>{{ modal.game.resultTime | moment("YYYY-MM-DD HH:mm:ss") }}</td>
                        <td>
                            <input class="form-control" v-model="modal.gameResult.result_str">
                            <span>{{ $t('game_history.result_str_tips',{
                                    num_len: modal.game.rules.num_len,
                                    unique: modal.game.rules.unique?$t('game_history.non_repetitive'):$t('game_history.repeatable'),
                                    range_floor: modal.game.rules.range_value[0],
                                    range_ceil: modal.game.rules.range_value[1],
                                    separator: modal.game.rules.separator
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
                    <button type="button" class="btn btn-primary" @click="updateGameResult">{{ $t('action.create') }}</button>
                    <button type="button" class="btn btn-default" @click="hideModal">{{ $t('staff.close') }}</button>
                </div>
            </div>
        </div>
    </div>
</div>
</template>
<script>
import api from '../../api.js'
import alertMsg from '../../components/alertMsg'
import Vue from 'vue'
const dateFormat = 'YYYY-MM-DD'
export default{
    data () {
        return {
            gameDraw: [],
            abnormalPeriods: [],
            abnormalPeriodsCount: [],
            isLatest: false,
            modal: {
                game: {
                    id: undefined,
                    display_name: undefined,
                    rules: {},
                    resultTime: ''
                },
                isShow: false,
                gameResult: {
                    game_code: '',
                    issue_number: '',
                    result_str: ''
                },
                msg: ''
            },
            today: Vue.moment().format(dateFormat),
            count: 0
        }
    },
    created () {
        this.getPeriods()
    },
    beforeMount () {
        this.timing = setInterval(() => {
            this.getPeriods()
        }, 15 * 1000)
    },
    methods: {
        getPeriods () {
            this.$http.get(api.game_draw).then(response => {
                this.gameDraw = response.data.data
                this.getAbnormalPeriods(response.data.data)
            }, response => {
                this.errorCallback(response)
            })
        },
        getAbnormalPeriods (games) {
            games = games || this.gameDraw
            games.forEach(game => {
                this.$http.get(`${api.game_schedule}?game=${game.game_id}&abnormal=True&offset=0&limit=4&`).then(response => {
                    if (response.data.code === 2000) {
                        this.abnormalPeriods[game.game_id] = response.data.data.results
                        this.abnormalPeriodsCount[game.game_id] = response.data.data.count
                        this.count += 1
                    }
                })
            })
        },
        errorCallback (response) {
            if (('' + response.status).indexOf('4') === 0) {
                this.$router.push('/login?next=' + this.$route.path)
            }
        },
        getGameInfo (gameId) {
            return new Promise((resolve, reject) => {
                this.$http.get(api.game_list + gameId).then((response) => {
                    resolve(response.data.data.rules)
                })
            })
        },
        showModal (game, period) {
            this.getGameInfo(game.game_id).then(rules => {
                this.modal = {
                    ...this.modal,
                    game: {
                        id: game.game_id,
                        display_name: game.game,
                        rules: rules,
                        resultTime: period.schedule_result
                    },
                    gameResult: {
                        game_code: period.game_code,
                        issue_number: period.issue_number,
                        result_str: ''
                    },
                    isShow: true
                }
            })
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
                    } else {
                        this.modal.msg = this.$t('game_history.manual_draw_fail') + `（${response.data.msg.join(' ')}）`
                        this.$refs.alertMsg.trigger('danger', 3)
                    }
                })
            } else {
                this.modal.msg = this.$t('game_history.no_setting_draw_number')
                this.$refs.alertMsg.trigger('warning', 3)
            }
        }
    },
    beforeDestroy () {
        clearInterval(this.timing)
    },
    components: {
        alertMsg
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
.table td{
  vertical-align: middle
}
</style>
