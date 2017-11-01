<template>
<div>
    <h3>{{ game.display_name }}</h3>
    <div class="box">
          <div class="box-body clearfix form-inline form-input-sm">
            <div class="row">
              <div class="col-xs-2">
                <label>{{$t('game_history.date')}}：</label>
                <date-picker width='140' v-model="input.date"></date-picker>
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
    <div class="card col">
        <div class="card-body">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">{{$t('game_history.periods')}}</th>
                        <th scope="col">{{$t('game_history.draw_date')}}</th>
                        <th scope="col">{{$t('game_history.draw_number')}}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for = "selected_result in selectedResults"
                        :key = "selected_result.game_id"
                    >
                        <td>{{selected_result.issue_number}}</td>
                        <td>{{selected_result.created_at | showDate}}</td>
                        <td>{{selected_result.result_str}}</td>
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

const dataFormat = 'YYYY-MM-DD'

export default {
    data () {
        return {
            game: {
                id: '',
                display_name: ''
            },
            game_results: '',
            input: {
                date: `${Vue.moment().format(dataFormat)}`,
                period: ''
            }
        }
    },
    beforeRouteEnter (to, from, next) {
        next(app => {
            let gameid = to.params.id
            app.game.display_name = app.$store.getters.getGame[gameid]
            app.getResult(gameid)
        })
    },
    methods: {
        getResult (gameid) {
            this.$http.get(api.game_result + `?game=${gameid}`).then(
                response => {
                    this.game_results = response.data
                },
                response => {
                    this.errorCallback(response)
                })
        },
        getGame (gameid) {
            this.$http.get(api.game_list + gameid).then(
                response => {
                    this.game = response.data.display_name
                },
                response => {
                    this.errorCallback(response)
                })
        },
        errorCallback (response) {
            if (('' + response.status).indexOf('4') === 0) {
                this.$router.push('/login?next=' + this.$route.path)
            }
        }
    },
    computed: {
        selectedResults () {
            if (!this.game_results.length) {
                return []
            }
            const selectedDate = Vue.moment(this.input.date).format(dataFormat)
            const filterdResults = this.game_results
            return filterdResults.filter(filterdResult => {
                if (filterdResult['created_at'].indexOf(selectedDate) !== -1 && filterdResult['issue_number'].indexOf(this.input.period) !== -1) {
                    return true
                }
            })
        }
    },
    filters: {
        showDate (value) {
            return Vue.moment(value).format(dataFormat)
        }
    },
    components: {
        DatePicker
    }
}
</script>
