<template>
<div>
    <div class="row m-b">
        <div class="col-xs-3 text-left"><h3>{{ game.display_name }}</h3></div>
        <div class="col-xs-9 text-right">
            <button class="md-btn w-sm blue" @click="showModal">{{ $t('game_history.manual_draw') }}</button>
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
    <div class="card col">
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
                <tbody class="v-m">
                    <tr v-if="isPageOne">
                        <td>{{ parseInt(newest_result.issue_number) + 1 }}</td>
                        <td>{{ $t('game_history.no_draw') }}</td>
                        <td><button class="md-btn blue w-s" @click="deleteSheet">{{ $t('game_history.del_sheet') }}</button></td>
                        <td></td>
                    </tr>
                    <tr v-for = "selected_result in filteredResults" :key = "selected_result.game_id">
                        <td>{{selected_result.issue_number}}</td>
                        <td>{{selected_result.created_at | moment("YYYY-MM-DD HH:mm:ss")}}</td>
                        <td class="result-balls">
                            <span v-for="result in selected_result.result_str.split(',')" :class="getResultClass(result)">
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
            input: {
                date: Vue.moment().format(dateFormat),
                period: ''
            },
            modal: {
                isShow: false,
                gameResult: {
                    game_code: '',
                    issue_number: '',
                    result_str: ''
                }
            },
            gameResultApi: api.game_result,
            queryset: [],
            query: {},
            extra: ''
        }
    },
    beforeRouteEnter (to, from, next) {
        next(app => {
            let gameid = to.params.id
            let time = Vue.moment(app.input.date).format(dateFormat)
            app.game.id = to.params.id
            app.getGameName(gameid)
            app.game.display_name = app.$store.getters.getGame[gameid]
            app.extra = `game=${gameid}&date=${time}`
            app.$nextTick(() => {
                app.$refs.pulling.rebase()
                app.getNewestResult(gameid, time)
            })
        })
    },
    created () {
        this.timing = setInterval(() => {
            this.$refs.pulling.rebase()
            this.getNewestResult(this.game.id, Vue.moment().format(dateFormat))
        }, 30000)
    },
    methods: {
        setDate () {
            this.extra = `game=${this.game.id}&date=${Vue.moment(this.input.date).format(dateFormat)}`
            this.$nextTick(() => {
                this.$refs.pulling.rebase()
                this.getNewestResult(this.game.id, Vue.moment().format(dateFormat))
            })
        },
        getNewestResult (gameid, time) {
            this.$http.get(api.game_result + '?game=' + gameid + '&date=' + time + '&limit=1')
            .then(response => {
                this.newest_result = Object.assign({}, this.newest_result, response.data.results[0])
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
        showModal () {
            if (this.queryset.length === 0) {
                this.modal.gameResult.issue_number = Vue.moment().format(dateFormat2) + '000'
            } else {
                this.modal.gameResult.issue_number = parseInt(this.newest_result.issue_number) + 1
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
                    this.$refs.pulling.rebase()
                }
            })
        },
        getResultClass (resultNum) {
            let gameClass = 'result-' + this.game.game_code
            let resultClass
            if (this.game.game_code === 'jsssc') {
                resultClass = 'resultnum-' + parseInt(resultNum)
            } else if (this.game.game_code === 'mlaft' || this.game.game_code === 'jspk10') {
                if (parseInt(resultNum) < 10) {
                    resultClass = 'resultnum-0' + parseInt(resultNum)
                } else {
                    resultClass = 'resultnum-' + resultNum
                }
            } else {
                resultClass = 'resultnum-' + resultNum
            }
            return [gameClass, resultClass]
        },
        deleteSheet () {
            if (window.confirm('确定撤单？')) {
                console.log('delete Sheet no api QAQ')
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
            if (this.queryset.length > 0 && this.queryset[0].issue_number === this.newest_result.issue_number) {
                return true
            } else {
                return false
            }
        }
    },
    components: {
        DatePicker,
        pulling
    },
    beforeDestroy () {
        clearInterval(this.timing)
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
    margin-right: 5px;
}

.v-m td{
    vertical-align: middle;
}
</style>
