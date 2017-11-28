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
                    <td><a class="p-l-xs">
                        <router-link :to = "'/game_history/' + game_period.game_id"
                        class = "v-m">
                        {{game_period.game}}</router-link>
                        </a>
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
                        <th>{{ $t('game_history.draw_number') }}
                            <span class="n-strong">{{'请输入'+amountOfValues+'个数字('+rangeOfValue.join('~')+')使用逗号(,)分隔'}}</span></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>{{ modal.gameResult.issue_number }}</td>
                        <td>{{ today }}</td>
                        <td><input class="form-control" v-model="modal.gameResult.result_str"></td>
                    </tr>
                    </tbody>
                    </table>
                    <div class="m-r m-l alert alert-danger" v-for="(msg, index) in modal.errorMsgs" :key="index">{{msg}}</div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" @click="updateGameResult">{{ $t('action.create') }}</button>
                    <button type="button" class="btn btn-default" @click="hideModal">{{ $t('staff.close') }}</button>
                </div>
            </div>
        </div>
    </div>
</div>
</template>
<script>
import api from '../../api.js'
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
                newest_result: undefined,
                errorMsgs: []
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
            this.$http.get(api.game_result + `?game=${gameid}&date=${this.today}&limit=1`)
            .then(response => {
                if (response.data.code === 2000 && response.data.data.results.length > 0) {
                    this.modal.newest_result = Object.assign({}, this.modal.newest_result, response.data.data.results[0])
                } else {
                    this.modal.newest_result = {}
                }
            })
        },
        showModal (gameid) {
            this.modal.errorMsgs = []
            this.modal.game.id = gameid
            this.modal.newest_result = undefined
            this.modal.gameResult.result_str = ''
            this.getGameName(gameid)
            this.getNewestResult(gameid)
            this.timing = setInterval(() => {
                if (this.modal.newest_result !== undefined) {
                    if (this.modal.newest_result.issue_number === undefined) {
                        this.modal.gameResult.issue_number = Vue.moment().format(dateFormat2) + '000'
                    } else {
                        this.modal.gameResult.issue_number = parseInt(this.modal.newest_result.issue_number) + 1
                    }
                    this.modal.isShow = true
                    clearInterval(this.timing)
                }
            }, 100)
        },
        hideModal () {
            this.modal.isShow = false
        },
        updateGameResult () {
            this.modal.errorMsgs = []
            this.$http.post(api.game_result, this.modal.gameResult)
            .then((response) => {
                if (response.data.code === 2000) {
                    this.hideModal()
                } else {
                    this.modal.errorMsgs = response.data.msg
                }
            })
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
    computed: {
        amountOfValues () {
            switch (parseInt(this.modal.game.id)) {
            case 155:
            case 162:
            case 163:
                return 10
            case 157:
            case 158:
            case 161:
            case 164:
            case 167:
                return 5
            case 156:
            case 169:
                return 8
            case 160:
            case 166:
                return 3
            case 170:
                return 21
            case 159:
                return 6
            default:
                return undefined
            }
        },
        rangeOfValue () {
            switch (parseInt(this.modal.game.id)) {
            case 155:
            case 162:
            case 163:
                return [1, 10]
            case 157:
            case 161:
            case 164:
            case 166:
            case 167:
                return [0, 9]
            case 156:
                return [1, 20]
            case 158:
                return [1, 11]
            case 160:
                return [1, 6]
            case 169:
                return [1, 11]
            case 170:
                return [1, 80]
            case 159:
                return [1, 45]
            default:
                return undefined
            }
        }
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
.n-strong{
    font-weight: normal;
}
</style>
