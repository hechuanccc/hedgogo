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
                <tr v-for="(playset, index) in playsetOrderByName" :key="playset.id">
                  <td>
                    <strong>{{playset.display_name}}</strong>
                  </td>
                  <td>
                    <input type="text" v-model="playset.odds" @change="changeField(playset)">
                  </td>
                  <td>
                    <input type="text" v-model="playset.return_rate" @change="changeField(playset)">
                  </td>
                  <td>
                    <input type="text" v-model="playset.min_per_bet" @change="changeField(playset)">
                  </td>
                  <td>
                    <input type="text" v-model="playset.max_per_bet" @change="changeField(playset)">
                  </td>
                  <td>
                    <input type="text" v-model="playset.max_per_draw" @change="changeField(playset)">
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="box-footer text-center">
          <button class="btn btn-primary" :disabled="updatedPlaysets.length === 0" @click="updatePlayset">{{$t('action.confirm')}}</button>
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
                display_name: ''
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
        },
        updatedPlaysets () {
            return this.playsets.filter(playset => {
                return playset.updated === true
            })
        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            let id = to.params.id
            vm.game.id = id
            vm.game.display_name = vm.$store.getters.getGame[id]
            vm.getPlaySet(id)
        })
    },
    methods: {
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
        changeField (playset) {
            this.$set(playset, 'updated', true)
        },
        updatePlayset () {
            this.$http.post(`${api.playset}?game=${this.game.id}`, this.updatedPlaysets).then(response => {
                if (response.status === 200) {
                    this.playsets.forEach(playset => {
                        this.$set(playset, 'updated', false)
                    })
                }
            }, response => {
                if (('' + response.status).indexOf('4') === 0) {
                    this.$router.push('/login?next=' + this.$route.path)
                }
            })
        }
    }
}
</script>

