<template>
    <div>
        <div class="m-b" v-if="$root.permissions.includes('change_promotion')">
            <router-link tag="button" class="md-btn w-md blue" to="/promotion/add">{{$t('promotion.add')}}</router-link>
        </div>
        <div class="box">
            <table st-table="rowCollectionBasic" class="table table-striped">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>{{$t('common.name')}}</th>
                        <th>{{$t('promotion.rank')}}</th>
                        <th>{{$t('member.level')}}</th>
                        <th>{{$t('promotion.start_date')}}</th>
                        <th>{{$t('promotion.end_date')}}</th>
                        <th>{{$t('common.status')}}</th>
                    </tr>
                </thead>
                <tbody v-if="queryset.length > 0">
                    <tr v-for="promotion in queryset" >
                        <td>{{promotion.id}}</td>
                        <td><router-link :to="'/promotion/' + promotion.id">{{promotion.name}}</router-link></td>
                        <td>{{promotion.rank}}</td>
                        <td>
                            <router-link class="m-r" v-for="pl in promotion.level" :to="'/level/' + pl.id">{{pl.name}}</router-link>
                        </td>
                        <td>{{promotion.start_date}}</td>
                        <td>{{promotion.end_date}}</td>
                        <td>
                            <span class="label success" v-if="promotion.status==1">{{$t('status.active')}}</span>
                            <span class="label" v-else>{{$t('status.inactive')}}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="row m-b-lg">
            <pulling :queryset="queryset" :api="api" :query="query" ref="pulling" :optexpand='optexpand' @query-data="queryData" @query-param="queryParam"></pulling>
        </div>
    </div>
</template>
<script>
    import api from '../../api'
    import pulling from '../../components/pulling'

    export default {
        data () {
            return {
                api: api.promotion,
                query: {},
                queryset: [],
                optexpand: 'level'
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
