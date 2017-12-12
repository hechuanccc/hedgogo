<template>
  <div>
    <div class="row">
        <div class="pull-right m-r">
            <router-link tag="button" class="md-btn w-sm blue m-b"  to="/roles/add">{{ $t('role_manage.role_add_btn') }}</router-link>
        </div>
    </div>
    <div class="box" v-if="queryset.length>0">
        <table st-table="rowCollectionBasic" class="table table-striped b-t">
            <thead>
                <tr>
                    <th>{{ $t('role_manage.id') }}</th>
                    <th>{{ $t('role_manage.name') }}</th>
                    <th>{{$t('role_manage.created_at')}}</th>
                    <th>{{ $t('role_manage.operating') }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="role in queryset" :key="role.id">
                    <td>{{ role.id }}</td>
                    <td><router-link :to="'/roles/' + role.id">{{ role.name }}</router-link></td>
                    <td>{{ role.created_at | datetimeFilter }}</td>
                    <td>
                        <router-link class="p-l-xs" :to="`/roles/${role.id}/edit`">{{ $t('action.update') }}</router-link>
                        <a class="p-l-xs" @click="deleteRole(role.id)" v-if="role.id!==4">{{ $t('action.delete') }}</a>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="row m-b-lg">
        <pulling :queryset="queryset" :api="roleApi" :query="query" ref="pulling" @query-data="queryData" @query-param="queryParam"></pulling>
    </div>
  </div>
</template>
<script>
import api from '../../api'
import Vue from 'vue'
import pulling from '../../components/pulling'

export default {
    data () {
        return {
            roleApi: api.managerole,
            queryset: [],
            query: {}
        }
    },
    created () {
        this.$nextTick(() => {
            this.$refs.pulling.rebase()
        })
    },
    methods: {
        deleteRole (id) {
            if (window.confirm(this.$t('role_manage.sure_delete_role'))) {
                this.$http.delete(api.managerole + id + '/').then(response => {
                    this.$refs.pulling.rebase()
                })
            }
        },
        queryData (queryset) {
            this.queryset = queryset
        },
        queryParam (query) {
            this.query = query
        }
    },
    filters: {
        datetimeFilter (value) {
            if (!value) {
                return Vue.t('permission_manage.no_setting')
            } else {
                return Vue.moment(value).format('YYYY-MM-DD HH:mm')
            }
        }
    },
    components: {
        pulling
    }
}
</script>
<style scoped>
</style>
