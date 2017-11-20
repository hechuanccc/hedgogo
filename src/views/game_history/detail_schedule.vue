<template>
<div>
    <h3>{{ game.display_name }}</h3>
    <div class="box">
        <div class="box-body clearfix form-inline form-input-sm">
            <div class="row">
                <div class="col-xs-2">
                    <label>{{$t('game_history.date')}}：</label>
                    <date-picker width='140' 
                    v-model="input.date" 
                    @input="getResult(game.id, input.date)"></date-picker>
                </div>
                <div class="col-xs-2">
                    <label>{{$t('game_history.periods')}}：</label>
                    <input type="number" 
                    v-model.number="input.period" 
                    :placeholder="$t('game_history.periods')" 
                    class="form-control">
                </div>
            </div>
        </div>
    </div>
    <div class="text-right m-b">
        <button class="md-btn w-sm blue" @click="showModal">{{ $t('game_history.manual_draw') }}</button>
    </div>
    <div class="modal" v-if="modal.isShow">
        <div class="modal-backdrop fade in" @click="hideModal"></div>
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
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
                        <td>{{ input.date | moment("YYYY-MM-DD") }}</td>
                        <td><input class="form-control" v-model="modal.gameResult.result_str"></td>
                    </tr>
                    </tbody>
                    </table>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" @click="updateGameResult">{{ $t('action.create') }}</button>
                    <button type="button" class="btn btn-default" @click="hideModal">{{ $t('staff.close') }}</button>
                </div>
            </div>
        </div>
    </div>
    <div class="text-center" v-show="loading"><i class='fa fa-spinner '></i><b>{{$t('game_history.loading')}}</b></div>
    <div v-if="!loading" class="card col">
        <div class="card-body">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">{{$t('game_history.periods')}}</th>
                        <th scope="col">{{$t('game_history.draw_date')}}</th>
                        <th scope="col">{{$t('game_history.draw_number')}}</th>
                        <th scope="col">{{$t('game_history.memo')}}</th>
                    </tr>
                </thead>
                <tbody>
                    
                    <tr v-for = "selected_result in filteredResults"
                        :key = "selected_result.game_id"
                    >
                        <td>{{selected_result.issue_number}}</td>
                        <td>{{selected_result.created_at | moment("YYYY-MM-DD")}}</td>
                        <td>{{selected_result.result_str}}</td>
                        <td>{{selected_result.created_by === null ? '' : $t('game_history.manual_draw')}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>
</template>
<script>
import api from '../../api.js'
import DatePicker from 'vue2-datepicker'
import Vue from 'vue'

const dateFormat = 'YYYY-MM-DD'
const dateFormat2 = 'YYYYMMDD'

export default {
    data () {
        return {
            game: {
                id: '',
                display_name: ''
            },
            game_results: '',
            input: {
                date: Vue.moment().format(dateFormat),
                period: ''
            },
            loading: false,
            modal: {
                isShow: false,
                gameResult: {
                    game_code: '',
                    issue_number: '',
                    result_str: ''
                }
            }
        }
    },
    beforeRouteEnter (to, from, next) {
        next(app => {
            let gameid = to.params.id
            app.game.id = gameid
            if (!app.$store.state.game.display_name) {  // to avoid missing game name after refreshing
                app.getGameName(gameid)
            }
            app.game.display_name = app.$store.getters.getGame[gameid]
            app.getResult(gameid, app.input.date)
        })
    },
    methods: {
        getResult (gameid, createdat) {
            const formatedTime = Vue.moment(createdat).format(dateFormat)
            this.loading = true
            this.$http.get(api.game_result + `?game=${gameid}&date=${formatedTime}`).then(
                response => {
                    this.loading = false
                    this.game_results = response.data
                },
                response => {
                    this.errorCallback(response)
                })
        },
        getGameName (gameid) {
            this.$http.get(api.game_list + gameid).then(
                response => {
                    this.game.display_name = response.data.display_name
                    this.modal.gameResult.game_code = response.data.code
                },
                response => {
                    this.errorCallback(response)
                })
        },
        errorCallback (response) {
            if (('' + response.status).indexOf('4') === 0) {
                this.$router.push('/login?next=' + this.$route.path)
            }
        },
        showModal () {
            if (this.game_results === undefined || this.game_results[0] === undefined) {
                this.modal.gameResult.issue_number = Vue.moment().format(dateFormat2) + '000'
            } else {
                this.modal.gameResult.issue_number = parseInt(this.game_results[0].issue_number) + 1
            }

            this.modal.isShow = true
        },
        hideModal () {
            this.modal.isShow = false
        },
        updateGameResult () {
            this.$http.post(api.game_result, this.modal.gameResult)
            .then((response) => {
                if (response.status === 201) {
                    this.hideModal()
                    location.reload()
                }
            })
        }
    },
    computed: {
        filteredResults () {
            if (!this.game_results.length) {
                return []
            }
            const rawResults = this.game_results
            return rawResults.filter(rawResult => {
                if (rawResult['issue_number'].indexOf(this.input.period) !== -1) {
                    return true
                }
            })
        }
    },
    components: {
        DatePicker
    }
}
</script>
<style scoped>
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
</style>
