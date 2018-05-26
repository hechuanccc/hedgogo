<template>
    <div>
        <div class="p-b">
            <router-link
                tag="button"
                class="md-btn blue"
                to="/online_payer/add"
            >{{$t('setting.create_online_payer')}}
            </router-link>
        </div>
        <div class="box">
            <table st-table="rowCollectionBasic" class="table table-striped" v-if="!loading">
                <thead>
                    <tr>
                        <th>{{ $t('common.name') }}</th>
                        <th>{{ $t('online_payer.sum_fund') }}</th>
                        <th>{{ $t('common.status') }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="p in onlinePayers" :key="p.id">
                        <td><router-link :to="`online_payer/${p.id}`">{{ p.name }}</router-link></td>
                        <td>{{ p.sum_fund || 0 | currency('￥') }}</td>
                        <td>
                            <span class="label success m-r-sm" v-if="p.status">{{ $t('status.active') }}</span>
                            <span class="label danger m-r-sm" v-else>{{ $t('status.inactive') }}</span>
                            <a @click="toggleStatus(p)" v-if="p.status">{{$t('status.disabled')}}</a>
                            <a @click="toggleStatus(p)" v-else>{{$t('status.active')}}</a>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="row" v-else>
                <div class="text-center p-a">
                    <i class="fa fa-spin fa-spinner"></i> <b>{{ $t('common.loading') }}...</b>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import api from '../../api'
import $ from '../../utils/util'
export default {
    data () {
        return {
            onlinePayers: [],
            loading: true
        }
    },
    created () {
        this.getPayers()
    },
    methods: {
        toggleStatus (payer) {
            this.$http.put(`${api.transaction.onlinePayer}${payer.id}/`, Object.assign({}, payer, {
                status: payer.status ^ 1,
                withdraw_gateway: payer.withdraw_gateway.id
            })).then(data => {
                $.notify({
                    message: this.$t('action.update') + this.$t('status.success')
                })
                payer.status = data.status
            }, error => {
                $.notify({
                    message: error,
                    type: 'danger'
                })
            })
        },
        getPayers () {
            this.$http.get(api.transaction.onlinePayer).then(data => {
                this.onlinePayers = data
                this.loading = false
            })
        }
    }
}
</script>
