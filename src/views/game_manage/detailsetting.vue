<template>
<div>
  <!-- <div class="m-b">
    <ol class="breadcrumb">
      <li class="active"><router-link to="/game_list">{{$t('nav.game_list')}}</router-link></li>
      <li class="active">{{$route.meta.title}}</li>
    </ol>
  </div> -->
  <!-- <div class="box">
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
          <span class="text-md text-muted">{{$t('game_manage.id')}}</span>
          </strong>
          <div class="text-md text-muted">{{game.id}}</div>
        </div>
        <div class="col-md-4">
          <strong>
          <span class="text-md text-muted">{{$t('game_manage.code')}}</span>
          </strong>
          <div class="text-md text-muted">{{game.code}}</div>
        </div>
      </div>
      <div class="row b-b p-b m-b">
        <div class="col-md-4">
          <strong>
          <span class="text-md text-muted">{{$t('game_manage.rank')}}</span>
          </strong>
          <div class="text-md text-muted">{{game.rank}}</div>
        </div>
        <div class="col-md-4">
          <strong>
          <span class="text-md text-muted">{{$t('game_manage.to_display')}}</span>
          </strong>
          <div class="text-md text-muted">{{game.to_display}}</div>
        </div>
      </div>
      <div class="row b-b p-b m-b">
        <div class="col-md-4">
          <strong>
          <span class="text-md text-muted">{{$t('common.remarks')}}</span>
          </strong>
          <div class="text-md text-muted">{{game.remarks}}</div>
        </div>
        <div class="col-md-4">
          <strong>
          <span class="text-md text-muted">{{$t('game_manage.icon')}}</span>
          </strong>
          <div>
            <img class="w-32" :src="game.icon" alt=".">
          </div>
        </div>
      </div>
    </div>
  </div> -->
  <button class="btn btn-primary">交易設定</button>
  <div class="setting__quickset">
    快捷設置 單注最低金額： <input type="" name=""> 單注最高金額： <input type="" name=""> 單期最大金額： <input type="" name="">
  </div>
  <div class="box">
    <table class="table table-bordered">
      <thead>
        <tr>
          <th scope="col">玩法</th>
          <th scope="col">單注最低金額</th>
          <th scope="col">單注最高金額</th>
          <th scope="col">單期最大金額</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(gameplay, index) in gameplays"
          :keys="index">
          <th scope="row">{{gameplay.display_name}}</th>
          <td><input type="text" name="onetime_min"></td>
          <td><input type="text" name="onetime_max"></td>
          <td><input type="text" name="oneperiod_min"></td>
        </tr>
      </tbody>
    </table>
  </div>
  <button class="btn btn-primary">盤口設定</button>
  <div class="setting__quickset">
    快捷設置反水： <input type="" name="">
  </div>
  <div class="box">
    <table class="table table-bordered">
      <thead>
        <tr>
          <th scope="col">玩法</th>
          <th scope="col">賠率</th>
          <th scope="col">退水</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(gameplay, index) in gameplays"
          :keys="index">
          <th scope="row">{{gameplay.display_name}}</th>
          <td>賠率</td>
          <td>退水</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
<!--  the switch-able tabs
<ul class="nav nav-tabs">
  <li class="nav-item"
    v-for="(tab, index) in tabs_title"
    :key="index"
    @click="switchContent($event, index)">
    <a  :class="{'active' : index === now_index, 'nav-link': true}">{{ tab }}</a>
  </li>
</ul>
-->
  
</template>

<script>
import api from '../../api'

export default {
    data () {
        return {
            showContent: true,
            tabs_title: ['高頻彩', '六合彩'], // $t(...)
            now_index: 0, // for tabs
            gameplays: {
                id: '',
                display_name: ''
            },
            optexpand: 'group'
        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            let gameid = to.params.id
            vm.getGameplay(gameid)
        })
    },
    methods: {
        getGameplay (gameid) {
            this.$http.get(api.game_play + `?game=${gameid}`).then(
          response => {
              this.gameplays = response.data
              console.log(this.gameplay)
          }, response => {
                if (('' + response.status).indexOf('4') === 0) {
                    this.$router.push('/login?next=' + this.$route.path)
                }
            })
        },
        getGameplayOdd (schedulid, gameplayid, gameid) {
            gameplayid = this.gameplays.id
            this.$http.get(api.game_schedule + `?game=${gameid}`).then(
          response => {
              this.test.scheduleid = response.data.id
              console.log(response)
          }, response => {
                if (('' + response.status).indexOf('4') === 0) {
                    this.$router.push('/login?next=' + this.$route.path)
                }
            })
        },
        switchContent (el, index) { // switch the tab & content by the data
            this.now_index = index
        }
    }
}
</script>
<style lang="sass" scoped>
.setting__quickset
  margin: 0.3em

</style>
