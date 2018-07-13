<template>
    <div>
      <div class="row">
        <div class="pull-left m-l" v-if="$root.permissions.includes('add_new_staff')">
            <router-link tag="button" class="md-btn w-sm blue m-b" to="/staff/add">{{$t('title.staff_add')}}</router-link>
        </div>
      </div>
        <div class="box">
            <table st-table="rowCollectionBasic" class="table table-striped">
                <thead>
                    <tr>
                      <th>{{$t('user.account')}}</th>
                      <th>{{$t('dic.status')}}</th>
                      <th>{{$t('dic.role')}}</th>
                      <th>{{$t('time.registered_at')}}</th>
                      <th>{{$t('time.updated_at')}}</th>
                      <th>{{$t('dic.memo')}}</th>
                    </tr>
                </thead>
                <tbody v-if="queryset.length > 0">
                    <tr v-for="staff in queryset" :key="staff.id">
                        <td>
                          <i class="fa fa-circle text-success m-r-xs" v-if="staff.is_logged_in"></i>
                          <i class="fa fa-circle text-grey-400 m-r-xs" v-else></i>
                          <router-link :to="'/staff/' + staff.id">{{staff.username}}</router-link>
                        </td>
                        <td>
                            <span class="label success" v-if="staff.status === 1">{{$t('status.active')}}</span>
                            <span class="label danger" v-else>{{$t('status.inactive')}}</span>
                        </td>
                        <td>
                            <span v-if="staff.user_group">{{staff.user_group.name}}</span>
                            <span v-else>{{$t('system.no_setting')}}</span>
                        </td>
                        <td>{{staff.created_at | moment('YYYY-MM-DD HH:mm')}}</td>
                        <td>{{staff.updated_at | moment('YYYY-MM-DD HH:mm')}}</td>
                        <td>{{staff.memo || '-'}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="row m-b-lg">
            <pulling
                :queryset="queryset"
                :api="url.user.staff"
                :query="query"
                :optexpand="optexpand"
                ref="pulling"
                @query-data="queryData"
                @query-param="queryParam"
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
        submit () {
            this.$refs.pulling.submit()
        },
        queryData (queryset) {
            this.queryset = queryset
        },
        queryParam (query) {
            this.query = query
        }
    },
    components: {
        Pulling
    }
}
</script>
