<template>
<div>
    <div class="m-b-sm row">
        <div class="col-xs-2">
            <h3>{{$t('game_history.overview')}}</h3>
        </div>
        <div class="col-3 pull-right">
            <button class="md-btn w-sm blue" @click="getPeriods()">
                <span v-show="!isLatest">{{$t('game_history.refresh')}}</span>
                <span v-show="isLatest">{{$t('game_history.is_latest')}}</span>
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
                </tr>
            </thead>
            <tbody>
                <tr v-for = "(game_period, index) in game_periods"
                    :key = "game_period.game_id">
                    <router-link
                    :to = "'/game_history/detail/' + game_period.game_id"
                    tag = "td"
                    class = "href-hover">
                    {{game_period.game}}
                    </router-link>
                    <td><span class="table__game">{{game_period.drawn_periods}}</span></td>
                    <td><span class="table__game">{{game_period.total_periods - game_period.drawn_periods}}</span></td>
                </tr>
            </tbody>
        </table>
    </div>
    </div>
    </template>
<script>
import api from '../../api.js'

export default{
    data () {
        return {
            game_periods: '',
            isLatest: false
        }
    },
    methods: {
        getPeriods () {
            this.$http.get(api.game_draw).then(
                response => {
                    this.game_periods = response.data
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
        }
    },
    created () {
        this.getPeriods()
        setInterval(() => {
            this.getPeriods()
        }, 300000) // update data every 5 mins
    }
}
</script>
<style lang="sass" scoped>
.table__game
  padding-right: 0.7em
  padding-left: 0.7em
  padding-top: 0.5em
  padding-bottom: 0.5em
  border-radius: 5px
  background-color: #E5E5E5

.href-hover
  cursor: pointer
  &:hover
    background-color: #E7E5E5
    transition: background-color .2s
</style>
