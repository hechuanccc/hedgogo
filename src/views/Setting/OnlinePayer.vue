<template>
    <div>
        <div class="p-b">
            <router-link
                tag="button"
                class="md-btn blue w-sm"
                to="/online_payer/add"
            >{{$t('dic.create')}}
            </router-link>
        </div>
        <div class="box">
            <table st-table="rowCollectionBasic" class="table table-striped" v-if="!loading">
                <thead>
                    <tr>
                        <th>{{ $t('dic.name') }}</th>
                        <th>{{ $t('finance.sum_fund') }}</th>
                        <th>{{ $t('dic.status') }}</th>
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
                    <i class="fa fa-spin fa-spinner"></i> <b>{{ $t('system.loading') }}</b>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { getMerchant, updateMerchant } from '../../service'
export default {
    data () {
        return {
            onlinePayers: [],
            loading: true
        }
    },
    created () {
        getMerchant('onlinePayer').then(data => {
            this.onlinePayers = data
            this.loading = false
        })
    },
    methods: {
        toggleStatus (payer) {
            updateMerchant('onlinePayer', {
                id: payer.id,
                data: Object.assign({}, payer, {
                    status: payer.status ^ 1,
                    withdraw_gateway: payer.withdraw_gateway.id
                })
            }, {
                action: this.$t('dic.update'),
                object: this.$t('dic.status')
            }).then(data => {
                payer.status = data.status
            }, () => {})
        }
    }
}
</script>
