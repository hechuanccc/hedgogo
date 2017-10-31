<template>
<div>
    <h3>{{ game }}</h3>
    <label><input type="date" name="draw_date" v-model="input.date"></label>
    <label><input type="number" name="draw_search" v-model.number="input.period" placeholder="期數"></label>
    <div class="card col">
        <div class="card-body">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">期數</th>
                        <th scope="col">開獎日期</th>
                        <th scope="col">開獎號碼</th>
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

export default {
    data () {
        return {
            game: '',
            game_results: '',
            todayDate: '',
            input: {
                date: '',
                period: ''
            }
        }
    },
    beforeRouteEnter (to, from, next) {
        next(app => {
            let gameid = to.params.id
            app.getResult(gameid)
        })
    },
    methods: {
        getResult (gameid) {
            this.$http.get(api.game_result + `?game=${gameid}`).then(
                response => {
                    this.game_results = response.data
                    this.getGame(gameid)
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
        },
        defaultToday () {
            const today = new Date()
            const todayDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
            this.input.date = todayDate
        }
    },
    computed: {
        selectedResults () {
            if (!this.game_results.length) {
                return []
            }
            const filterdResults = this.game_results
            return filterdResults.filter(filterdResult => {
                if (filterdResult['created_at'].indexOf(this.input.date) !== -1 && filterdResult['issue_number'].indexOf(this.input.period) !== -1) {
                    return true
                }
            })
        }
    },
    filters: {
        showDate (value) {
            return value.split('T')[0]
        }
    },
    created () {
        this.defaultToday()
    }
}
</script>
<style lang="sass" scoped>
</style>
