<template>
  <div>
    <div class="m-b">
        <ol class="breadcrumb">
            <li class="active"><router-link to="/game_list">{{$t('nav.game_list')}}</router-link></li>
            <li class="active">{{game.display_name}}</li>
        </ol>
    </div>
    <div class="box">
      <div class="box-body">
        <div class="box">
          <div class="box-body">
            <table class="table table-striped b-t">
              <thead>
                <tr>
                  <th width="20%"></th>
                  <th width="16%">{{$t('game_manage.odds')}}</th>
                  <th width="16%">{{$t('game_manage.return_rate')}}</th>
                  <th width="16%">{{$t('game_manage.min_per_bet')}}</th>
                  <th width="16%">{{$t('game_manage.max_per_bet')}}</th>
                  <th width="16%">{{$t('game_manage.max_per_draw')}}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="playset in playsetOrderByName" :key="playset.id">
                  <td>
                    <strong>{{playset.display_name}}</strong>
                  </td>
                  <td>
                    <input type="text" :value="playset.odds" @change="changeField($event, 'odds', playset.id)">
                  </td>
                  <td>
                    <input type="text" :value="playset.return_rate" @change="changeField($event, 'return_rate', playset.id)">
                  </td>
                  <td>
                    <input type="text" :value="playset.min_per_bet" @change="changeField($event, 'min_per_bet', playset.id)">
                  </td>
                  <td>
                    <input type="text" :value="playset.max_per_bet" @change="changeField($event, 'max_per_bet', playset.id)">
                  </td>
                  <td>
                    <input type="text" :value="playset.max_per_draw" @change="changeField($event, 'max_per_draw', playset.id)">
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="box-footer text-center">
          <button class="btn btn-primary" @click="updatePlayset">{{$t('action.confirm')}}</button>
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
            playsets: [],
            playsetBuffer: {}
        }
    },
    computed: {
        playsetOrderByName () {
            return this.playsets.sort((a, b) => {
                return a.display_name.localeCompare(b.display_name)
            })
        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            let id = to.params.id
            vm.getGame(id)
            vm.getPlaySet(id)
        })
    },
    methods: {
        getGame (id) {
            this.$http.get(`${api.game_list}${id}/`).then(response => {
                this.game = response.data
            }, response => {
                if (('' + response.status).indexOf('4') === 0) {
                    this.$router.push('/login?next=' + this.$route.path)
                }
            })
        },
        getPlaySet (id) {
            this.$http.get(api.playset, {params: {game: id}}).then(
          response => {
              this.playsets = response.data
          }, response => {
                if (('' + response.status).indexOf('4') === 0) {
                    this.$router.push('/login?next=' + this.$route.path)
                }
            })
        },
        changeField (e, field, id) {
            if (!this.playsetBuffer[id]) {
                this.playsetBuffer[id] = {
                    id: id
                }
            }
            this.playsetBuffer[id][field] = e.target.value
        },
        updatePlayset () {
            let ids = Object.keys(this.playsetBuffer)
            if (ids.length > 0) {
                const playsets = []
                ids.forEach(id => {
                    playsets.push(this.playsetBuffer[id])
                })
                this.$http.post(`${api.playset}?game=${this.game.id}`, playsets).then(response => {
                    if (response.status === 200) {
                        this.playsetBuffer = {}
                    }
                })
            }
        }
    }
}
</script>

