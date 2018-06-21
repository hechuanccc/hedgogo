<template>
  <div>
    <div class="row">
        <div class="pull-left m-l" v-if="$root.permissions.includes('add_new_role')">
            <router-link tag="button" class="md-btn w-sm blue m-b" to="/roles/add">{{ $t('title.role_add') }}</router-link>
        </div>
    </div>
    <div class="box" v-if="queryset.length>0">
        <table st-table="rowCollectionBasic" class="table table-striped b-t">
            <thead>
                <tr>
                    <th>{{ $t('title.role_name') }}</th>
                    <th>{{ $t('time.created_at') }}</th>
                    <th v-if="$root.permissions.includes('update_role_name_advpermission') || $root.permissions.includes('remove_role')">
                        {{ $t('dic.operate') }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="role in queryset" :key="role.id">
                    <td><router-link :to="'/roles/' + role.id">{{ role.name }}</router-link></td>
                    <td>{{ role.created_at | datetimeFilter }}</td>
                    <td v-if="$root.permissions.includes('update_role_name_advpermission') || $root.permissions.includes('remove_role')">
                        <router-link class="p-l-xs" :to="`/roles/${role.id}/edit`" v-if="$root.permissions.includes('update_role_name_advpermission')">{{ $t('dic.update') }}</router-link>
                        <a class="p-l-xs" @click="deleteRole(role.id)" v-if="role.id!==4 && $root.permissions.includes('remove_role')">{{ $t('dic.delete') }}</a>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="row m-b-lg">
        <pulling
            :queryset="queryset"
            :api="url.setting.role"
            :query="query"
            ref="pulling"
            @query-data="queryData"
            @query-param="queryParam"
        />
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import url from '../../service/url'
import { deleteSetting } from '../../service'
import Pulling from '../../components/Pulling'

export default {
    data () {
        return {
            queryset: [],
            query: {},
            url
        }
    },
    created () {
        this.$nextTick(() => {
            this.$refs.pulling.rebase()
        })
    },
    methods: {
        deleteRole (id) {
            if (window.confirm(this.$t('system_msg.confirm_action_object', {
                action: this.$t('dic.delete'),
                object: this.$t('dic.role')
            }))) {
                deleteSetting('role', id).then(() => {
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
                return Vue.t('system.no_setting')
            } else {
                return Vue.moment(value).format('YYYY-MM-DD HH:mm')
            }
        }
    },
    components: {
        Pulling
    }
}
</script>
<style scoped>
</style>
