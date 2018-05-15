<template>
    <div>
      <div class="box">
        <table class="table table-striped">
          <thead>
          <tr>
            <th>{{ $t("common.username") }}</th>
            <th>{{ $t("common.real_name") }}</th>
            <th>{{ $t("common.phone") }}</th>
            <th class="text-center">{{ $t("common.status") }}</th>
            <th>{{ $t("agent.domain") }}</th>
            <th class="text-center">{{ $t("agent.joined_at") }}</th>
            <th class="text-center">{{ $t("agent.ip") }}</th>
            <th>{{ $t("agent.log") }}</th>
          </tr>
          </thead>
          <tbody v-if="queryset.length > 0">
          <tr v-for="agent in queryset" :key="agent.id">
            <td><router-link :to="`/agent_application/${agent.id}/?opt_expand=detail`">{{ agent.username }}</router-link></td>
            <td>{{ agent.real_name || '-' }}</td>
            <td>{{ agent.phone || '-' }}</td>
            <td class="text-center">
              <span class="label danger" v-if="agent.status==0">{{ $t('status.rejected') }}</span>
              <span class="label" v-if="agent.status==2">{{ $t('status.inactive') }}</span>
              <span class="label warn" v-if="agent.status==3">{{ $t('status.ongoing') }}</span>
            </td>
            <td>{{ agent.domain || '-' }}</td>
            <td class="text-center">{{ agent.created_at | moment("YYYY-MM-DD HH:mm") }}</td>
            <td class="text-center">{{ agent.ip || '-' }}</td>
            <td>
              <span v-if="agent.updated_by">{{ agent.updated_by.name }} / {{ agent.updated_at | moment("YYYY-MM-DD HH:mm") }}</span>
              <span v-else>-</span>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="row m-b-lg">
        <pulling
          :queryset="queryset"
          :api="api"
          :query="query"
          ref="pulling"
          @query-data="queryData"
        />
      </div>
    </div>
</template>
<script>
import api from '../../../api'
import pulling from '../../../components/pulling'
export default {
    data () {
        return {
            api: api.agentapplication,
            queryset: [],
            query: {}
        }
    },
    created () {
        this.nextTickFetch()
    },
    watch: {
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
        }
    },
    components: {
        pulling
    }
}
</script>
