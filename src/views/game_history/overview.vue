<template>
<div>
    <div class="m-b-sm row">
        <div class="col-xs-2">
            <h6>{{$t('game_history.overview')}}</h6>
        </div>
        <div class="col-3 pull-right">
            <button class="md-btn w-sm blue loading" @click="getPeriods()">
                <i class="fa fa-spin fa-spinner" v-if="!isLatest"></i> <span>{{ $t('game_history.refresh')}}</span>
            </button>
        </div>
    </div>
    <div class="card">
        <table class="table table-bordered table-striped" v-if="gameDraw.length">
            <thead>
                <tr>
                    <th scope="col" width="15%" class="p-l-md">
                        {{$t('game_history.game')}}
                    </th>
                    <th scope="col" class="text-center" width="15%">{{ $t('game_history.already_result') }}</th>
                    <th scope="col" class="text-center" width="15%">{{ $t('game_history.notyet_result') }}</th>
                    <th scope="col" colspan="3" class="text-center" width="55%">{{$t('game_history.abnormal_msg')}}</th>
                </tr>
            </thead>
            <tbody>
                <template v-for = "(game, index) in gameDraw">
                <tr class="v-m text-center" :key="index">
                    <td class="text-left p-l-md" style="text-transform: uppercase;">
                        <a class="p-l-0" @click="enterDetailPage(game.game_id, 0)">{{ game.game }}</a>
                    </td>
                    <td><span>{{ game.drawn_periods }}</span></td>
                    <td><span>{{ game.total_periods - game.drawn_periods }}</span></td>
                    <td v-if="game.abnormal_scheds.length>0" class="p-a-0">
                        <table class="table m-a-0">
                            <thead>
                                <tr>
                                    <th class="text-center" width="33%">{{ $t('game_history.abnormal_period') }}</th>
                                    <th class="text-center" width="33%">{{ $t('game_history.period_bet_record') }}</th>
                                    <th
                                        class="text-center"
                                        width="33%"
                                        v-if="$root.permissions.includes('manually_draw_game_result') || $root.permissions.includes('official_no_draw')"
                                    >{{ $t('game_history.operating') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="sched in game.abnormal_scheds" :key="sched.id">
                                    <td>{{ sched.issue_number }}</td>
                                    <td>{{ sched.bets_count }}</td>
                                    <td class="p-b-sm p-t-sm" v-if="$root.permissions.includes('manually_draw_game_result') || $root.permissions.includes('official_no_draw')">
                                        <span
                                            class="label btn blue m-r-xs"
                                            @click="showModal(game, sched)"
                                            v-if="$root.permissions.includes('manually_draw_game_result')"
                                        >
                                            {{ $t('game_history.manual_draw') }}
                                        </span>
                                        <span
                                            class="label btn blue"
                                            @click="showModal(game, sched, 'no_draw')"
                                            v-if="$root.permissions.includes('official_no_draw')"
                                        >
                                            {{ $t('game_history.no_draw') }}
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="3" class="text-right">
                                        <a @click="enterDetailPage(game.game_id, 1)">
                                        {{ `${$t('game_history.show_all')}${$t('game_history.abnormal_period')}(${game.abnormal_count})`  }}
                                        </a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                    <td v-else class="text-muted">{{ $t('game_history.no_abnormal')}}</td>
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
                    <span>{{ modal.game.display_name }} - {{ $t(`game_history.${modal.mode}`) }}</span>
                    <button type="button" class="close" aria-hidden="true" @click="hideModal">×</button>
                </div>
                <div class="modal-body">
                    <table st-table="rowCollectionBasic" class="table b-t">
                        <thead>
                            <tr>
                                <th class="text-center">{{ $t('game_history.periods') }}</th>
                                <th class="text-center">{{ $t('game_history.period_bet_record') }}</th>
                                <th class="text-center" v-if="modal.mode === 'manual_draw'">{{ $t('game_history.draw_number') }}</th>
                            </tr>
                        </thead>
                        <tbody class="text-center">
                            <tr>
                                <td>{{ modal.scheduleResult.issue_number }}</td>
                                <td>{{ modal.bets_count }}</td>
                                <td v-if="modal.mode === 'manual_draw'">
                                    <input class="form-control" v-model="modal.scheduleResult.result_str" :disabled="!$root.permissions.includes('manually_draw_game_result')">
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
                        <alert-msg :msg="modal.msg" ref="alertMsg" @hide-modal="hideModal"></alert-msg>
                    </div>                
                </div>
                <div class="modal-footer">
                    <div class="inline pull-left m-l-lg m-t-sm checkbox" v-if="modal.mode === 'manual_draw'">
                        <input
                            type="checkbox"
                            v-model="modal.sureDraw"
                            :disabled="!$root.permissions.includes('manually_draw_game_result')"
                        >
                        <i class="blue"></i>{{ $t('game_history.sure_manual_draw', {bet_record_count: modal.bets_count}) }}
                    </div>
                    <div class="inline pull-left m-l-lg m-t-sm checkbox" v-else>
                        <input
                            type="checkbox"
                            v-model="modal.inform"
                            :disabled="!$root.permissions.includes('official_no_draw')">
                        <i class="blue"></i>{{ $t('game_history.inform_no_draw') }}
                    </div>
                    <button type="button" class="inline pull-right btn btn-default" @click="hideModal">{{ $t('action.cancel') }}</button>
                    <button 
                        type="button"
                        class="inline pull-right btn btn-primary m-r-xs blue"
                        @click="updateScheduleResult"
                        v-if="modal.mode === 'manual_draw'"
                        :disabled="!$root.permissions.includes('manually_draw_game_result') || !modal.sureDraw"
                    >
                        {{ $t('action.confirm') }}
                    </button>
                    <button
                        type="button"
                        class="inline pull-right btn btn-primary m-r-xs blue"
                        @click="noDrawHandler"
                        v-else
                        :disabled="!$root.permissions.includes('official_no_draw')"
                    >
                        {{ $t('action.confirm') }}
                    </button>
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
            isLatest: false,
            modal: {
                mode: '',
                game: {
                    id: undefined,
                    display_name: undefined,
                    rules: {},
                    resultTime: ''
                },
                isShow: false,
                scheduleResult: {
                    game_code: '',
                    issue_number: '',
                    result_str: ''
                },
                msg: ''
            },
            today: Vue.moment().format(dateFormat)
        }
    },
    created () {
        this.getPeriods()
    },
    beforeMount () {
        this.timing = setInterval(() => {
            this.getPeriods()
        }, 30 * 1000)
    },
    methods: {
        getPeriods () {
            this.isLatest = false
            this.$http.get(`${api.game_draw}?abnormal=5`).then(data => {
                this.gameDraw = data
                this.isLatest = true
            })
        },
        getGameInfo (gameId) {
            return new Promise((resolve, reject) => {
                this.$http.get(api.game_list + gameId).then(data => {
                    resolve(data)
                })
            })
        },
        showModal (game, schedule, mode = 'manual_draw') {
            this.getGameInfo(game.game_id).then(data => {
                this.modal = {
                    ...this.modal,
                    mode: mode,
                    bets_count: schedule.bets_count,
                    game: {
                        game_id: game.game_id,
                        display_name: game.game,
                        rules: data.rules,
                        resultTime: schedule.schedule_result
                    },
                    scheduleResult: {
                        game_schedule: schedule.id,
                        game_code: data.code,
                        issue_number: schedule.issue_number,
                        result_str: ''
                    },
                    sureDraw: 0,
                    inform: 0,
                    isShow: true,
                    msg: this.$t(`game_history.${mode}_initial_msg`)
                }
                this.$nextTick(() => {
                    this.$refs.alertMsg.trigger('warning')
                })
            })
        },
        hideModal () {
            this.modal.isShow = false
        },
        updateScheduleResult () {
            if (this.modal.scheduleResult.result_str) {
                this.$http.post(api.game_result, this.modal.scheduleResult).then(() => {
                    this.modal.msg = this.$t('game_history.manual_draw_success')
                    this.$refs.alertMsg.trigger('success', 1, true)
                    this.getPeriods()
                }, error => {
                    this.modal.msg = this.$t('game_history.manual_draw_fail') + `（${error}）`
                    this.$refs.alertMsg.trigger('danger')
                })
            } else {
                this.modal.msg = this.$t('game_history.no_setting_draw_number')
                this.$refs.alertMsg.trigger('warning')
            }
        },
        noDrawHandler () {
            this.$http.put(`${api.game_schedretreat}${this.modal.scheduleResult.game_schedule}/`, {
                'status': 'no_draw',
                'inform': this.modal.inform ? 1 : 0
            }).then(data => {
                this.modal.msg = this.$t('common.setting') + this.$t('status.success')
                this.$refs.alertMsg.trigger('success', 1, true)
                this.getPeriods()
            }, error => {
                this.modal.msg = `${this.$t('status.failed')}（${error}）`
                this.$refs.alertMsg.trigger('danger')
            })
        },
        enterDetailPage (id, mode) {
            this.getGameInfo(id).then(game => {
                this.$router.push(`/game_history/${id}/?code=${game.code}&mode=${mode}`)
            })
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
