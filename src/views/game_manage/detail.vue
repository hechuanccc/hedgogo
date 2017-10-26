<template>
    <div>
      <div class="m-b">
        <ol class="breadcrumb">
          <li class="active"><router-link to="/game_list">{{$t('nav.game_list')}}</router-link></li>
          <li class="active">{{game.display_name}}</li>
        </ol>
      </div>
      <div class="box">
        <div class="box-header b-b ">
          <h3>{{$t('game_manage.transaction_setting')}}</h3>
        </div>
        <div class="box-body">
          <table class="table table-striped b-t">
            <thead>
              <tr >
                <th>{{$t('game_manage.play')}}</th>
                <th>{{$t('game_manage.lowest_per_bet')}}</th>
                <th>{{$t('game_manage.highest_per_bet')}}</th>
                <th>{{$t('game_manage.highest_cur_sched')}}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
   </div>
</template>
<script>
import api from '../../api'

export default {
    data () {
        return {
            game: {
                id: '',
                display_name: '',
                rank: '',
                code: '',
                to_display: '',
                remarks: '',
                icon: ''
            }
        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            let id = to.params.id
            vm.getGame(id)
        })
    },
    methods: {
        getGame (id) {
            this.$http.get(api.game_list + id).then(
          response => {
              this.game = response.data
          }, response => {
                if (('' + response.status).indexOf('4') === 0) {
                    this.$router.push('/login?next=' + this.$route.path)
                }
            })
        }
    }
}
</script>

