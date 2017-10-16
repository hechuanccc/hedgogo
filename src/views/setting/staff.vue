<template>
    <div>
        <div class="p-b m-b-sm"  v-if="$root.permissions.includes('add_change_staff')">
            <router-link tag="button" class="md-btn w-sm blue"  to="/staff/add">{{$t('action.add_staff')}}</router-link>
        </div>
        <div class="box">
            <table st-table="rowCollectionBasic" class="table table-striped">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>{{$t('staff.account')}}</th>
                        <th>{{$t('common.status')}}</th>
                        <th>{{$t('staff.permission')}}</th>
                        <th>{{$t('common.memo')}}</th>
                    </tr>
                </thead>
                <tbody v-if="queryset.length > 0">
                    <tr v-for="staff in queryset" >
                        <td>{{staff.id}}</td>
                        <td><router-link :to="'/staff/' + staff.id">{{staff.username}}</router-link></td>
                        <td>
                            <span class="label success" v-if="staff.status==1">{{$t('status.active')}}</span>
                            <span class="label" v-else>{{$t('status.inactive')}}</span>
                        </td>
                        <td>{{staff.group.name}}</td>
                        <td>{{staff.memo}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="row m-b-lg">
            <pulling :queryset="queryset" :api="staffApi" :query="query" :optexpand="optexpand" ref="pulling" @query-data="queryData" @query-param="queryParam"></pulling>
        </div>
    </div>
</template>
<script>
    import api from '../../api'
    import pulling from '../../components/pulling'

    export default {
        data () {
            return {
                staffApi: api.staff,
                query: {},
                queryset: [],
                optexpand: 'group'
            }
        },
        // route: {
        //     data (transition) {
        //         this.$refs.pulling.rebase()
        //     }
        // },
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
            pulling
        }
    }

</script>
