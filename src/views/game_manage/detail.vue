<template>
    <div>
      <div class="m-b">
        <ol class="breadcrumb">
          <li class="active"><router-link to="/game_list">{{$t('nav.game_list')}}</router-link></li>
          <li class="active">{{$route.meta.title}}</li>
        </ol>
      </div>
      <div class="box">
        <div class="box-header b-b">
          <div class="row">
            <div class="col-xs-4">
              <h2><strong>{{game.display_name}}</strong></h2>
            </div>
            <div class="col-xs-8 text-right">
              <router-link class="md-btn md-flat" :to="'/game_detail/' + game.id + '/edit'">{{$t('action.edit_game')}}</router-link>
            </div>
          </div>
        </div>
        <div class="box-body">
          <div class="row b-b p-b m-b">
            <div class="col-md-4">
              <strong>
                <span class="text-muted">{{$t('game_manage.id')}}</span>
              </strong>
              <div class="text-muted">{{game.id}}</div>
            </div>
            <div class="col-md-4">
              <strong>
                <span class="text-muted">{{$t('game_manage.code')}}</span>
              </strong>
              <div class="text-muted">{{game.code}}</div>
            </div>
          </div>
          <div class="row b-b p-b m-b">
            <div class="col-md-4">
              <strong>
                <span class="text-muted">{{$t('game_manage.rank')}}</span>
              </strong>
              <div class="text-muted">{{game.rank}}</div>
            </div>
            <div class="col-md-4">
              <strong>
                <span class="text-muted">{{$t('game_manage.to_display')}}</span>
              </strong>
              <div class="text-muted">{{game.to_display}}</div>
            </div>
          </div>
          <div class="row b-b p-b m-b">
            <div class="col-md-4">
              <strong>
                <span class="text-muted">{{$t('common.remarks')}}</span>
              </strong>
              <div class="text-muted">{{game.remarks}}</div>
            </div>
            <div class="col-md-4">
              <strong>
                <span class="text-muted">{{$t('game_manage.icon')}}</span>
              </strong>
              <div>
                <img class="w-32" :src="game.icon" alt=".">
              </div>
            </div>
          </div>
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
            },
            optexpand: 'group'
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

