<template>
<div>
    <h3>{{$t('game_history.overview')}}</h3>
    <div class="card">
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th scope="col">{{$t('game_history.game')}}</th>
                    <th scope="col">{{$t('game_history.already_result')}}</th>
                    <th scope="col">{{$t('game_history.notyet_result')}}</th>
                </tr>
            </thead>
            <transition-group name="fade" tag="tbody"> <!-- to transition the loading dalay -->
                <tr v-for = "game_period in PeriodSortById"
                    :key = "game_period.id">
                    <router-link
                    :to = "'/game_history/detail/' + game_period.id"
                    tag = "td"
                    class = "href-hover">
                    {{game_period.game}}
                    </router-link>
                    <td><span class="history-list__period">{{game_period.drawn_periods}}</span></td>
                    <td><span class="history-list__period">{{game_period.total_periods - game_period.drawn_periods}}</span></td>
                </tr>
            </transition-group>
        </table>
    </div>
</div>
</template>
<script>
import api from '../../api.js'

export default{
    data () {
        return {
            game_periods: []
        }
    },
    methods: {
        getGame () {
            return this.$http.get(api.game_list).then(response => {
                let games = response.data
                let gameIds = []
                games.forEach(game => {
                    gameIds.push(game.id)
                })
                return gameIds
            }, response => {
                this.errorCallback(response)
            })
        },
        getPeriod (gameId) {
            this.$http.get(api.game_draw + `?game=${gameId}`).then(
                response => {
                    let period = response.data[0]
                    period.id = gameId
                    this.game_periods.push(period)
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
        getLatestDrawn () {
            this.game_periods = []
            this.getGame().then(gameIds => {
                gameIds.forEach(gameId => {
                    this.getPeriod(gameId)
                })
            })
        // get the gameIds array(from game_list api),
        // then pass each id into getPeriod fn to get the target,
        // each drawn periods data(from game_draw api)
        }
    },
    computed: {
        PeriodSortById () {
            this.game_periods = this.game_periods.sort((a, b) => a.id - b.id)
            return this.game_periods
        }
    },
    created () {
        this.getLatestDrawn()
    }
}
</script>
<style lang="sass" scoped>
.history-list__period
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

.fade-enter-active, .fade-leave-active
  transition: opacity .5s

.fade-enter, .fade-leave-to
  opacity: 0
</style>
