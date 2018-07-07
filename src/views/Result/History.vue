<template>
<div>
    <div class="m-b-sm row">
        <div class="col-xs-2">
            <h6>{{$t('title.overview')}}</h6>
        </div>
        <div class="col-3 pull-right">
            <button class="md-btn w-sm blue loading" @click="getPeriods()">
                <i class="fa fa-spin fa-spinner" v-if="!isLatest"></i> <span>{{ $t('system.refresh')}}</span>
            </button>
        </div>
    </div>
    <div class="card" v-if="!loading">
        <table class="table table-bordered table-striped" v-if="gameDraw.length">
            <thead>
                <tr>
                    <th scope="col" width="15%" class="p-l-md">
                        {{$t('dic.game')}}
                    </th>
                    <th scope="col" class="text-center" width="15%">{{ $t('game.period_drawed') }}</th>
                    <th scope="col" class="text-center" width="15%">{{ $t('game.period_last') }}</th>
                    <th scope="col" colspan="3" class="text-center" width="55%">{{$t('game.period_abnormal')}}</th>
                </tr>
            </thead>
            <tbody>
                <template v-for="(game, index) in gameDraw">
                <tr class="v-m text-center" :key="index">
                    <td class="text-left p-l-md" style="text-transform: uppercase;">
                        <router-link
                            class="p-l-0"
                            :to="{
                                path: `/game_history/${game.game_id}/`,
                                query: {
                                    game_code: game.game_code,
                                    mode: 0
                                }
                            }"
                        >{{ game.game }}
                        </router-link>
                    </td>
                    <td><span>{{ game.drawn_periods }}</span></td>
                    <td><span>{{ game.total_periods - game.drawn_periods }}</span></td>
                    <td v-if="game.abnormal_scheds.length>0" class="p-a-0">
                        <table class="table m-a-0">
                            <thead>
                                <tr>
                                    <th class="text-center" width="33%">{{ $t('game.period_abnormal') }}</th>
                                    <th class="text-center" width="33%">{{ $t('game.period_current_bet_count') }}</th>
                                    <th
                                        class="text-center"
                                        width="33%"
                                        v-if="$root.permissions.includes('manually_draw_game_result') || $root.permissions.includes('official_no_draw')"
                                    >{{ $t('dic.operate') }}</th>
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
                                            {{ $t('game.manual_draw') }}
                                        </span>
                                        <span
                                            class="label btn blue"
                                            @click="showModal(game, sched, 'no_draw')"
                                            v-if="$root.permissions.includes('official_no_draw')"
                                        >{{ $t('game.no_draw') }}
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="3" class="text-right">
                                        <router-link
                                            class="p-l-0"
                                            :to="{
                                                path: `/game_history/${game.game_id}/`,
                                                query: {
                                                    game_code: game.game_code,
                                                    mode: 1
                                                }
                                            }"
                                        >
                                        {{ `${$t('system.show_all')}${$t('game.period_abnormal')}(${game.abnormal_count})`  }}
                                        </router-link>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                    <td v-else class="text-muted">{{ $t('game.period_no_abnormal')}}</td>
                </tr>
                </template>
            </tbody>
        </table>
    </div>
    <p v-else class="text-center">
        <i class="fa fa-spin fa-spinner"></i>
        <b>{{ $t('system.loading') }}</b>
    </p>
    <div class="modal" v-if="modal.isShow">
        <div class="modal-backdrop fade in" @click="hideModal"></div>
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <span>{{ modal.game.display_name }} - {{ $t(`game.${modal.mode}`) }}</span>
                    <button type="button" class="close" aria-hidden="true" @click="hideModal">×</button>
                </div>
                <div class="modal-body">
                    <table st-table="rowCollectionBasic" class="table b-t">
                        <thead>
                            <tr>
                                <th class="text-center">{{ $t('dic.period') }}</th>
                                <th class="text-center">{{ $t('game.period_current_bet_count') }}</th>
                                <th class="text-center" v-if="modal.mode === 'manual_draw'">{{ $t('game.draw_number') }}</th>
                            </tr>
                        </thead>
                        <tbody class="text-center">
                            <tr>
                                <td>{{ modal.scheduleResult.issue_number }}</td>
                                <td>{{ modal.bets_count }}</td>
                                <td v-if="modal.mode === 'manual_draw'">
                                    <input class="form-control" v-model="modal.scheduleResult.result_str" :disabled="!$root.permissions.includes('manually_draw_game_result')">
                                    <span>{{ $t('system_msg.draw_number_tip',{
                                            num_len: modal.game.rules.num_len,
                                            unique: modal.game.rules.unique?$t('misc.no_repeatable'):$t('misc.repeatable'),
                                            range_floor: modal.game.rules.range_value[0],
                                            range_ceil: modal.game.rules.range_value[1],
                                            separator: modal.game.rules.separator
                                        })}}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>         
                </div>
                <div class="modal-footer">
                    <div class="inline pull-left m-l-sm m-t-sm checkbox" v-if="modal.mode === 'manual_draw'">
                        <label class="check">
                            <input
                                type="checkbox"
                                v-model="modal.sureDraw"
                                :disabled="!$root.permissions.includes('manually_draw_game_result')"
                            >
                            <i class="blue"></i>
                            {{ $t('system_msg.confirm_manual_draw', {
                                bet_record_count: modal.bets_count
                            }) }}
                        </label>
                    </div>
                    <div class="inline pull-left m-l-sm m-t-sm checkbox" v-else>
                        <label class="check">
                            <input
                                type="checkbox"
                                v-model="modal.inform"
                                :disabled="!$root.permissions.includes('official_no_draw')">
                            <i class="blue"></i>
                            {{ $t('system_msg.no_draw_inform') }}
                        </label>
                        <label class="check m-l-sm" v-if="modal.bets_count">
                            <input type="checkbox" v-model="modal.retreat"/>
                            <i class="blue"></i>
                            {{$t('system_msg.retreat_schedule_all')}}
                        </label>
                    </div>
                    <button
                        type="button"
                        class="inline pull-right btn w-xs"
                        @click="hideModal"
                    >{{ $t('dic.cancel') }}
                    </button>
                    <button 
                        type="button"
                        class="inline pull-right btn m-r-xs blue w-xs"
                        @click="updateScheduleResult"
                        v-if="modal.mode === 'manual_draw'"
                        :disabled="!$root.permissions.includes('manually_draw_game_result') || !modal.sureDraw"
                    >
                        <span v-if="!modal.loading">{{ $t('dic.confirm') }}</span>
                        <i class="fa fa-spin fa-spinner" v-else></i>                        
                    </button>
                    <button
                        type="button"
                        class="inline pull-right btn m-r-xs blue w-xs"
                        @click="noDrawHandler"
                        v-else
                        :disabled="!$root.permissions.includes('official_no_draw')"
                    >
                        <span v-if="!modal.loading">{{ $t('dic.confirm') }}</span>
                        <i class="fa fa-spin fa-spinner" v-else></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
</template>
<script>
import { getGame, updateGame } from '../../service'
import Vue from 'vue'
import $ from '../../utils/util'
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
                inform: false,
                retreat: false,
                loading: false
            },
            today: Vue.moment().format(dateFormat),
            loading: true
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
            getGame('draw', {
                params: {
                    abnormal: 5
                }
            }).then(data => {
                this.gameDraw = data
                this.isLatest = true
                this.loading = false
            })
        },
        getGameInfo (id) {
            return new Promise((resolve, reject) => {
                getGame('list', { id }).then(data => {
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
                    inform: false,
                    retreat: false,
                    isShow: true
                }
                $.notify({
                    message: this.$t(`system_msg.${mode}_alert`),
                    type: 'warning'
                })
            })
        },
        hideModal () {
            this.modal.isShow = false
        },
        updateScheduleResult () {
            if (this.modal.scheduleResult.result_str) {
                let [judgement, result] = $.validateResultStr(this.modal.scheduleResult.result_str)
                if (!judgement) {
                    $.errorNotify(this.$t('system_msg.draw_number_wrong'))
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
                    this.getPeriods()
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
        noDrawHandler () {
            this.modal.loading = true
            updateGame('scheduleRetreat', {
                id: this.modal.scheduleResult.game_schedule,
                data: {
                    status: 'no_draw',
                    inform: this.modal.inform ? 1 : 0,
                    retreat: this.modal.retreat ? 1 : 0
                }
            }, {
                action: this.$t('dic.set')
            }).then(() => {
                this.getPeriods()
                this.modal.loading = false
                this.hideModal()
            }, () => {
                this.modal.loading = false
            })
        }
    },
    beforeDestroy () {
        clearInterval(this.timing)
    }
}
</script>
<style lang="scss" scoped>
.table td{
  vertical-align: middle
}
</style>
