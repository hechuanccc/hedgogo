<template>
<div>
    <h3>{{game_test.display_name}}</h3>
    <label><input type="date" name="draw_date" v-model="test" :value = "20170606"></label><label><input type="text" name="draw_search" :placeholder="$t('game_history.draw_period')"></label>
    <div class="card col">
        <div class="card-body">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">其數</th>
                        <th scope="col">開獎時間</th>
                        <th scope="col">開講號碼</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>gaining...</td>
                        <td>gaining...</td>
                        <td>gaining...</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>
</template>
<script>
// import api from '../../api.js'
export default {
    data () {
        return {
            game_test: '',
            schedules: '',
            test: ''
        }
    }
}
</script>
<style lang="sass" scoped>
    
</style>
