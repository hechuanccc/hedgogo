<template>
    <div>
      <div class="box">
        <table class="table table-striped">
          <thead>
          <tr>
            <th>{{$t("common.username")}}</th>
            <th>{{$t("common.real_name")}}</th>
            <th>{{$t("common.phone")}}</th>
            <th>{{$t("common.status")}}</th>
            <th>{{$t("agent.domain")}}</th>
            <th>{{$t("agent.joined_at")}}</th>
            <th>{{$t("agent.ip")}}</th>
            <th>{{$t("agent.log")}}</th>
          </tr>
          </thead>
          <tbody v-if="queryset.length > 0">
          <tr v-for="agent in queryset">
            <td><router-link :to="'/agent_application/' + agent.id + '/?opt_expand=detail'">{{agent.username}}</router-link></td>
            <td>{{agent.real_name}}</td>
            <td>
              <span v-if="agent.phone">{{agent.phone}}</span>
              <span v-else>-</span>
            </td>
            <td>
              <span class="label " v-if="agent.status==0">{{$t('status.rejected')}}</span>
              <span class="label danger" v-if="agent.status==2">{{$t('status.inactive')}}</span>
              <span class="label " v-if="agent.status==3">{{$t('status.ongoing')}}</span>
            </td>
            <td>
              <span v-if="agent.domain">{{agent.domain}}</span>
              <span v-else>-</span>
            </td>
            <td>{{agent.created_at | moment("YYYY-MM-DD HH:mm") }}</td>
            <td>
              <span v-if="agent.ip">{{agent.ip}}</span>
              <span v-else>-</span>
            </td>
            <td>
              <span v-if="agent.updated_by">{{agent.updated_by.name}} / {{agent.updated_at | moment("YYYY-MM-DD HH:mm")}}</span>
              <span v-else>-</span>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="row m-b-lg">
        <pulling
          :queryset="queryset"
          :api="agentAppApi"
          :query="query"
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
                agentAppApi: api.agentapplication,
                queryset: [],
                query: {}
            }
        },
        created () {
            this.$nextTick(() => {
                this.$refs.pulling.rebase()
            })
        },
        watch: {
            '$root.agent_application' (newObj, old) {
                this.$refs.pulling.rebase()
            },
            '$route': 'nextTickFetch'
        },
        methods: {
            nextTickFetch () {
                this.$nextTick(() => {
                    this.$refs.pulling.rebase()
                })
            },
            queryData (queryset) {
                this.queryset = queryset
            },
            queryParam (query) {
                this.query = query
            },
            submit () {
                this.$refs.pulling.submit()
            },
            toggleStatus (agent, status) {
                this.$http.put(api.agentapplication + agent.id + '/', { 'status': status })
                .then((response) => {
                    agent.status = response.data.status
                })
            }
        },
        components: {
            pulling
        }
    }
</script>
