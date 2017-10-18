<template>
  <div>
    <div class="box" v-if="queryset.length">
      <table st-table="rowCollectionBasic" class="table table-striped b-t">
          <thead>
          <tr>
            <th>{{$t('game_manage.id')}}</th>
            <th>{{$t('game_manage.name')}}</th>
            <th>{{$t('game_manage.rank')}}</th>
            <th>{{$t('game_manage.code')}}</th>
          </tr>
          </thead>
          <tbody v-if="queryset.length > 0">
          <tr v-for="game in queryset" :key="game.id">
            <td>{{game.id}}</td>
            <td>
              <router-link :to="'/game_detail/' + game.id">{{game.display_name}}</router-link>
            </td>
            <td>{{game.rank}}</td>
            <td>{{game.code}}</td>
          </tr>
          </tbody>
        </table>
    </div>
  </div>
</template>
<script>
import api from '../../api'

export default {
    data () {
        return {
            gameApi: api.game_list,
            query: {},
            queryset: [],
            optexpand: 'group'
        }
    },
    created () {
        this.$http.get(api.game_list).then(response => {
            this.queryset = response.data
        }, response => {
            if (response.status === 401) {
                this.$router.push('/login?next=' + this.$route.path)
            }
        })
    }
}
</script>

