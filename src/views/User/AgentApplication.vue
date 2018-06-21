<template>
    <div>
      <div class="box">
        <table class="table table-striped">
          <thead>
          <tr>
            <th>{{ $t('user.username') }}</th>
            <th>{{ $t('user.real_name') }}</th>
            <th>{{ $t('user.phone') }}</th>
            <th class="text-center">{{ $t('dic.status') }}</th>
            <th>{{ $t('user.domain') }}</th>
            <th class="text-center">{{ $t('time.joined_at') }}</th>
            <th class="text-center">{{ $t('misc.ip') }}</th>
            <th>{{ $t('title.log_action') }}</th>
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
            <td class="text-center">{{ agent.created_at | moment('YYYY-MM-DD HH:mm') }}</td>
            <td class="text-center">{{ agent.ip || '-' }}</td>
            <td>
              <span v-if="agent.updated_by">{{ agent.updated_by.name }} / {{ agent.updated_at | moment('YYYY-MM-DD HH:mm') }}</span>
              <span v-else>-</span>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="row m-b-lg">
        <pulling
          :queryset="queryset"
          :api="url.user.agentApplication"
          :query="query"
          ref="pulling"
          @query-data="queryData"
        />
      </div>
    </div>
</template>
<script>
import url from '../../service/url'
import Pulling from '../../components/Pulling'

export default {
    data () {
        return {
            url,
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
        Pulling
    }
}
</script>
