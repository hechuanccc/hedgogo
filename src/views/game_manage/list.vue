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
    <div class="row m-b-lg">
        <pulling
          :queryset="queryset"
          :query="query"
          :optexpand="optexpand"
          :api="gameApi"
          ref="pulling"
          @query-data="queryData"
          @query-param="queryParam">
        </pulling>
      </div>
  </div>
</template>
<script>
import api from '../../api'
import pulling from '../../components/pulling'

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
        this.$nextTick(() => {
            this.$refs.pulling.rebase()
        })
    },
    methods: {
        queryData (queryset) {
            this.queryset = queryset
        },
        queryParam (query) {
            this.query = query
        }
    },
    components: {
        pulling
    }
}
</script>

