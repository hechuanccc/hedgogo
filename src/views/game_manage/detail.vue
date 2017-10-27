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
                <th>{{$t('game_manage.min_per_bet')}}</th>
                <th>{{$t('game_manage.max_per_bet')}}</th>
                <th>{{$t('game_manage.max_per_draw')}}</th>
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
      <div class="box">
        <div class="box-header b-b ">
          <h3>{{$t('game_manage.handicap_setting')}}</h3>
        </div>
        <div class="box-body">
          <div class="box" v-for="key in combinationsKey" :key="key">
            <div class="box-header text-center">
              <h3>{{key === 'remains' ? '':key}}</h3>
            </div>
            <div class="box-body row">
                <div class="col-md-6">
                  <table class="table b-t">
                    <thead>
                      <tr>
                        <th width="33%"></th>
                        <th width="33%">{{$t('game_manage.odd')}}</th>
                        <th width="33%">{{$t('game_manage.return')}}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item,index) in arrayFormer(combinations[key])" :key="index">
                        <td>{{item.display_name | nameFilter(key)}}</td>
                        <td>{{item.odds}}</td>
                        <td>{{item.return}}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="col-md-6">
                  <table class="table b-t">
                    <thead>
                      <tr >
                        <th width="33%"></th>
                        <th width="33%">{{$t('game_manage.odd')}}</th>
                        <th width="33%">{{$t('game_manage.return')}}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <tr v-for="(item,index) in arrayLatter(combinations[key])" :key="index">
                        <td>{{item.display_name | nameFilter(key)}}</td>
                        <td>{{item.odds}}</td>
                        <td>{{item.return}}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
            </div>
          </div>
        </div>
        <div class="box-footer text-center">
            <button class="btn">{{$t('action.confirm')}}</button>
        </div>
      </div>
   </div>
</template>
<script>
import api from '../../api'

export default {
    filters: {
        nameFilter (value, key) {
            return value.replace(key + '-', '')
        }
    },
    data () {
        return {
            setting_mode: false,
            game: {
                id: '',
                display_name: '',
                rank: '',
                code: '',
                to_display: '',
                remarks: '',
                icon: ''
            },
            combinations: {},
            combinationsKey: []
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
              response.data.forEach(playset => {
                  let displayName = playset.display_name
                  let idx = displayName.lastIndexOf('-')
                  if (idx !== -1) {
                      let key = displayName.substring(0, idx)
                      if (this.combinations[key]) {
                          this.combinations[key].push(playset)
                      } else {
                          this.combinations[key] = [playset]
                          this.combinationsKey.push(key)
                      }
                  } else {
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
        arrayFormer (arr) {
            return arr.slice(0, Math.ceil(arr.length / 2))
        },
        arrayLatter (arr) {
            return arr.slice(Math.ceil(arr.length / 2), arr.length)
        }
    }
}
</script>

