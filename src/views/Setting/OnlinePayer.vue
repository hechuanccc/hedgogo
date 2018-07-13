<template>
    <div>
        <div class="p-b-sm">
            <router-link
                tag="button"
                class="md-btn blue w-sm"
                to="/online_payer/add"
            >{{ $t('dic.create') }}
            </router-link>
        </div>
        <div class="box">
            <table class="table table-striped" v-if="!loading">
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
                            <status-switch
                                :status="p.status"
                                :loading="!!statusSwitchLoading[p.id]"
                                :options="[$t('status.disabled'), '']"
                                @toggle="toggleStatus(p)"
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="row" v-else>
                <div class="text-center p-a">
                    <i class="fa fa-spin fa-spinner"></i>
                    <b>{{ $t('system.loading') }}</b>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import StatusSwitch from '../../components/StatusSwitch.vue'
import { getMerchant, updateMerchant } from '../../service'
export default {
    data () {
        return {
            onlinePayers: [],
            loading: true,
            statusSwitchLoading: {}
        }
    },
    created () {
        getMerchant('onlinePayer').then(data => {
            this.onlinePayers = data
        }).finally(() => { this.loading = false })
    },
    methods: {
        toggleStatus (payer) {
            this.$set(this.statusSwitchLoading, payer.id, true)
            updateMerchant('onlinePayer', {
                id: payer.id,
                data: Object.assign({}, payer, {
                    status: payer.status ^ 1,
                    withdraw_gateway: payer.withdraw_gateway.id
                })
            }, {
                action: this.$t('dic.update'),
                object: this.$t('dic.status')
            }).then(({ status }) => {
                payer.status = status
            }).finally(() => {
                this.$delete(this.statusSwitchLoading, payer.id)
            })
        }
    },
    components: {
        StatusSwitch
    }
}
</script>
