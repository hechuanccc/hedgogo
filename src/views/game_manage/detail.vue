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
              <span class="text-md text-muted">{{$t('game_manage.id')}}</span>
              <div>
                <strong class="text-md text-muted">{{game.id}}</strong>
              </div>
            </div>
            <div class="col-md-4">
              <span class="text-md text-muted">{{$t('game_manage.code')}}</span>
              <div>
                <strong class="text-md text-muted">{{game.code}}</strong>
              </div>
            </div>
          </div>
          <div class="row b-b p-b m-b">
            <div class="col-md-4">
              <span class="text-md text-muted">{{$t('game_manage.rank')}}</span>
              <div>
                <strong class="text-md text-muted">{{game.rank}}</strong>
              </div>
            </div>
            <div class="col-md-4">
              <span class="text-md text-muted">to_display</span>
              <div>
                <strong class="text-md text-muted">{{game.to_display}}</strong>
              </div>
            </div>
          </div>
          <div class="row b-b p-b m-b">
            <div class="col-md-4">
              <span class="text-md text-muted">remarks</span>
              <div>
                <strong class="text-md text-muted">{{game.remarks}}</strong>
              </div>
            </div>
            <div class="col-md-4">
              <span class="text-md text-muted">icon</span>
              <div>
                <img :src="game.icon" alt=".">
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>
<script>
import api from '../../api'
import pulling from '../../components/pulling'

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
    created () {

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
    },
    components: {
        pulling
    }
}
</script>

