<template>
<div>
    <label>日期：<input type="date" name="draw_date"></label>
    <div class="card col">
        <div class="card-body">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">其數</th>
                        <th scope="col">開獎時間</th>
                        <th scope="col">開講號碼</th>
                        <th scope="col">冠雅和</th>
                        <th scope="col">1-5龍虎</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{game_test.display_name}}</td>
                        <td>schedule close? {{game_test.holidates.schedule_close}}</td>
                        <td>schedule open? {{game_test.holidates.schedule_open}}</td>
                        <td>display? {{game_test.to_display}}</td>
                        <td>id? {{game_test.id}}</td>
                        <td>rank? {{game_test.rank}}</td>
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
            game_test: '',
            schedules: ''
        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            let id = to.params.id
            vm.getGameDetail(id)
        })
    },
    methods: {
        getGameDetail (id) {
            this.$http.get(api.game_list + id).then(
                response => {
                    this.game_test = response.data
                    console.log(this.game_test)
                },
                response => {
                    console.log('fuck u!')
                })
        }
    }
}
</script>
<style lang="sass" scoped>
    
</style>
