<template>
    <div>
      <div class="m-b">
        <ol class="breadcrumb">
          <li class="active"><router-link to="/game_list">{{$t('nav.game_list')}}</router-link></li>
          <li class="active">{{game.display_name}}</li>
        </ol>
      </div>
      <div v-if="playsets.length>100">
        <ul class="nav nav-tabs nav-inline">
          <li class="nav-link nav-item active">{{$t('game_manage.transaction_setting')}}</li>
          <li class="nav-link nav-item">{{$t('game_manage.handicap_setting')}}</li>
        </ul>
        <div class="tab-content">
        </div>
      </div>
      <div v-else>
        <transaction :combinations="combinations" :combinationsKey="combinationsKey" @update="updatePlayset"></transaction>
        <handicap :combinations="combinations" :combinationsKey="combinationsKey" @update="updatePlayset"></handicap>
      </div>
    </div>
</template>
<script>
import api from '../../api'
import Vue from 'vue'
export default {
    components: {
        Transaction: require('./transaction'),
        Handicap: require('./handicap')
    },
    filters: {
        nameFilter (value, key) {
            return value.replace(key + '-', '')
        }
    },
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
            combinations: {},
            combinationsKey: [],
            changePlaySetBuffer: {},
            transaction: {
                heads: [Vue.t('game_manage.min_per_bet'), Vue.t('game_manage.max_per_bet'), Vue.t('game_manage.max_per_draw')],
                fields: ['min_per_bet', 'max_per_bet', 'max_per_draw']
            },
            handicap: {
                heads: [Vue.t('game_manage.odd'), Vue.t('game_manage.return')],
                fields: ['odds', 'return_rate']
            }
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
            this.$http.get(api.game_list + id + '/').then(response => {
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
              let remains = []
              this.playsets = response.data
              this.playsets.forEach((playset, index) => {
                  let displayName = playset.display_name
                  let idx = displayName.indexOf('-')

                  if (idx !== -1) {
                      let key = displayName.substring(0, idx)
                      playset.parent = key
                      if (!this.combinations[key]) {
                          this.combinations[key] = []
                          this.combinationsKey.push(key)
                      }
                      let playsets = this.combinations[key]
                      playset.index = playsets.length
                      playsets.push(playset)
                  } else {
                      playset.parent = 'remains'
                      playset.index = remains.length
                      remains.push(playset)
                  }
              })
              if (remains.length > 0) {
                  this.combinations['remains'] = remains
                  this.combinationsKey.push('remains')
              }
          }, response => {
                if (('' + response.status).indexOf('4') === 0) {
                    this.$router.push('/login?next=' + this.$route.path)
                }
            })
        },
        changeField (config) {
            const playset = config.playset
            const id = playset.id
            if (!this.changePlaySetBuffer[id]) {
                this.changePlaySetBuffer[id] = {
                    id: id,
                    index: playset.index,
                    parent: playset.parent
                }
            }
            this.changePlaySetBuffer[id][config.key] = config.value
        },
        updatePlayset () {
            const playsetBuffer = this.$store.getters['gameManage/getPlaysetBuffer']
            let ids = Object.keys(playsetBuffer)
            if (ids.length > 0) {
                const playsets = []
                ids.forEach(id => {
                    playsets.push(playsetBuffer[id])
                })
                this.$http.post(`${api.playset}?game=${this.game.id}`, playsets).then(response => {
                    if (response.status === 200) {
                        response.data.forEach(newPlayset => {
                            let oldPlayset = playsetBuffer[newPlayset.id]
                            this.combinations[oldPlayset.parent][oldPlayset.index] = newPlayset
                        })
                        this.$store.dispatch('gameManage/clearBuffer')
                    }
                })
            }
        }
    }
}
</script>

