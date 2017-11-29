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
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th scope="col">{{$t('game_history.game')}}</th>
                    <th scope="col">{{$t('game_history.already_result')}}</th>
                    <th scope="col">{{$t('game_history.notyet_result')}}</th>
                    <th scope="col">{{$t('game_history.manual_draw')}}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for = "(game_period, index) in game_draw"
                    :key = "game_period.game_id">
                    <td>
                        <router-link :to = "'/game_history/' + game_period.game_id"
                        class = "v-m p-l-xs">
                        {{game_period.game}}
                        </router-link>
                    </td>
                    <td><span class="label label-lg w-60">{{game_period.drawn_periods}}</span></td>
                    <td><span class="label label-lg w-60">{{game_period.total_periods - game_period.drawn_periods}}</span></td>
                    <td>
                        <button class="md-btn w-sm blue" @click="showModal(game_period.game_id)">{{ $t('game_history.manual_draw') }}</button>
                    </td>
                </tr>
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
                        <td>{{ today }}</td>
                        <td>
                            <input class="form-control" v-model="modal.gameResult.result_str">
                        </td>
                    </tr>
                    </tbody>
                    </table>
                    <div class="m-l m-r">
                        <alert-msg :msg="modal.msg" ref="alertMsg" @hide-modal="hideModal" ></alert-msg>
                    </div>                </div>
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
const dateFormat2 = 'YYYYMMDD'
export default{
    data () {
        return {
            game_draw: '',
            isLatest: false,
            modal: {
                game: {
                    id: undefined,
                    display_name: undefined
                },
                isShow: false,
                gameResult: {
                    game_code: '',
                    issue_number: '',
                    result_str: ''
                },
                newestResult: undefined,
                msg: ''
            },
            today: Vue.moment().format(dateFormat)
        }
    },
    methods: {
        getPeriods () {
            this.$http.get(api.game_draw).then(
                response => {
                    this.game_draw = response.data
                    const games = {}
                    response.data.forEach(game => {
                        games[game.game_id] = game.game
                    })
                    this.$store.dispatch('setGame', games)

                    this.isLatest = true
                    setTimeout(() => { this.isLatest = false }, 1500)
                },
                response => {
                    this.errorCallback(response)
                }
            )
        },
        errorCallback (response) {
            if (('' + response.status).indexOf('4') === 0) {
                this.$router.push('/login?next=' + this.$route.path)
            }
        },
        getGameName (gameid) {
            this.$http.get(api.game_list + gameid)
            .then(response => {
                this.modal.game.display_name = response.data.display_name
                this.modal.gameResult.game_code = response.data.code
            })
        },
        getNewestResult (gameid) {
            return new Promise((resolve, reject) => {
                this.$http.get(api.game_result + `?game=${gameid}&date=${this.today}&limit=1`)
                .then(response => {
                    if (response.data.code === 2000 && response.data.data.results.length > 0) {
                        this.modal.newestResult = Object.assign({}, this.modal.newestResult, response.data.data.results[0])
                        resolve(response.data.data.results[0])
                    } else {
                        reject()
                        this.modal.newestResult = {}
                    }
                })
            })
        },
        showModal (gameid) {
            this.modal = {
                ...this.modal,
                game: {
                    id: gameid
                },
                newestResult: undefined,
                gameResult: {
                    result_str: ''
                }
            }
            this.modal.game.id = gameid
            this.modal.newestResult = undefined
            this.modal.gameResult.result_str = ''
            this.getGameName(gameid)
            this.getNewestResult(gameid).then(result => {
                this.modal.newestResult = Object.assign({}, this.modal.newestResult, result)
                this.modal.gameResult.issue_number = parseInt(this.modal.newestResult.issue_number) + 1
            }, () => {
                this.modal.gameResult.issue_number = Vue.moment().format(dateFormat2) + '000'
            }).then(() => {
                this.modal.isShow = true
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
    created () {
        this.getPeriods()
        this.timing = setInterval(() => {
            this.getPeriods()
        }, 60000) // update data every min
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
.w-60{
    width: 60px;
}
</style>
