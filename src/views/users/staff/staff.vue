<template>
    <div>
      <div class="row">
        <div class="pull-right m-r">
            <router-link tag="button" class="md-btn w-sm blue m-b"  to="/staff/add">{{$t('action.add_staff')}}</router-link>
        </div>
      </div>
        <div class="box m-t-sm">
            <table st-table="rowCollectionBasic" class="table table-striped">
                <thead>
                    <tr>
                      <th class="text-center">{{$t('common.login_status')}}</th>
                      <th>{{$t('staff.account')}}</th>
                      <th>{{$t('common.status')}}</th>
                      <th>{{$t('staff.permission')}}</th>
                      <th>{{$t('staff.created_at')}}</th>
                      <th>{{$t('staff.updated_at')}}</th>
                      <th>{{$t('common.memo')}}</th>
                    </tr>
                </thead>
                <tbody v-if="queryset.length > 0">
                    <tr v-for="staff in queryset" >
                        <td>
                          <div class="circle" style="font-size: 25px; text-align: center; color:#42b72a;" v-if="staff.is_logged_in==true">&#x25CF;</div>
                          <div class="circle" style="font-size: 25px; text-align: center; color:#d3d3d3;" v-else>&#x25CF;</div>
                        </td>
                        <td><router-link :to="'/staff/' + staff.id">{{staff.username}}</router-link></td>
                        <td>
                            <span class="label success" v-if="staff.status==1">{{$t('status.active')}}</span>
                            <span class="label" v-else>{{$t('status.inactive')}}</span>
                        </td>
                        <td>{{staff.user_group.name}}</td>
                        <td>{{staff.created_at | moment("YYYY-MM-DD HH:mm")}}</td>
                        <td>{{staff.updated_at | moment("YYYY-MM-DD HH:mm")}}</td>
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
    import api from '../../../api'
    import pulling from '../../../components/pulling'

    export default {
        data () {
            return {
                staffApi: api.staff,
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
            pulling
        }
    }

</script>
