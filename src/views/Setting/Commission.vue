<template>
<div>
    <div class="m-b" v-if="$root.permissions.includes('add_commission_setting')">
        <router-link
            tag="button"
            class="md-btn blue w-sm"
            to="/commission/add"
        >{{ $t('setting.setting_commission_add_btn') }}
        </router-link>
    </div>
    <div class="box p-b-xs">
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>{{ $t('common.name') }}</th>
                    <th class="text-center">{{ $t('common.status') }}</th>
                    <th class="text-center">{{ $t('commission.member_threshold') }}</th>
                    <th class="text-center">{{ $t('commission.name') }}</th>
                    <th class="text-center">{{ $t('common.agent_count') }}</th>
                </tr>
            </thead>
            <tbody v-if="!loading">
                <tr v-for="(commission, index) in commissionsettings" :key="index">
                    <td>
                        <router-link :to="`/commission/${commission.id}/edit`">
                            {{ commission.name }}
                        </router-link>
                    </td>
                    <td class="text-center text-sm">
                        <span class="label success" v-if="commission.status === 1">{{ $t('status.active') }}</span>
                        <span class="label danger" v-if="commission.status === 0">{{ $t('status.disabled') }}</span>
                        <template v-if="$root.permissions.includes('update_commission_setting_status')">
                            <a class="m-l-sm" @click="toggleStatus(index, commission)" v-if="!toggleLoading[index] && commission.status == 1">{{ $t('status.inactive') }}</a>
                            <a class="m-l-sm" @click="toggleStatus(index, commission)" v-else-if="!toggleLoading[index]">{{ $t('status.active') }}</a>
                            <span class="m-l-sm text-blue" v-else>
                                &nbsp;&nbsp;<i class="fa fa-spin fa-spinner"></i>&nbsp;&nbsp;
                            </span>
                        </template>
                    </td>
                    <td class="text-center">{{ commission.member_num || 0 }}</td>
                    <td class="p-a-0 text-xs text-center" v-if="commission.rates && commission.rates.length">
                        <table class="table table-condensed m-b-0">
                            <thead>
                                <tr>
                                    <th class="text-center _600" width="60%">{{ $t('commission.income_threshold') }}</th>
                                    <th class="text-center _600" width="40%">{{ $t('commission.commission_rate') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="(r, i) in commission.rates"
                                    :key="i"
                                    class="b-t-0"
                                >
                                    <td class="p-t-xs p-b-xs">
                                        <span>{{ r.income_threshold | currency('￥', 0) }}</span>
                                        &nbsp;~&nbsp;
                                        <span v-if="i + 1 < commission.rates.length">{{ commission.rates[i+1].income_threshold - 0.01 | currency('￥', 2) }}</span>
                                    </td>
                                    <td class="p-t-xs p-b-xs">{{ r.rate }}&nbsp;%</td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                    <td class="text-center" v-else>{{ $t('action.no_setting') }}</td>
                    <td class="text-center">
                        <router-link v-if="commission.agent_count !== 0" :to="'/agent/?commission_settings=' + commission.id ">{{ commission.agent_count }}</router-link>
                        <span v-else>{{ commission.agent_count || 0 }}</span>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="row text-center p-a" v-if="loading">
            <i class="fa fa-spin fa-spinner"></i>
            <b>{{ $t('common.loading') }}&nbsp;...</b>
        </div>
        <div class="row text-center p-a" v-if="!loading && !commissionsettings.length">
            {{ $t('common.no_record') }}
        </div>
    </div>
</div>
</template>
<script>
import { getSetting, updateSetting } from '../../service'
import $ from '../../utils/util'
export default {
    data () {
        return {
            commissionsettings: [],
            deposit_fee_max: '',
            withdraw_fee_max: '',
            toggleLoading: {},
            loading: true
        }
    },
    created () {
        this.getCommissionSetting()
    },
    methods: {
        getCommissionSetting () {
            getSetting('commission').then(data => {
                data.forEach(c => {
                    c.groups && c.groups[0].rates.sort((a, b) => a.income_threshold - b.income_threshold)
                    Object.assign(c, c.groups[0], {
                        id: c.id
                    })
                })
                this.commissionsettings = data
                this.loading = false
            }, error => {
                $.notify({
                    message: error,
                    type: 'danger'
                })
                this.loading = false
            })
        },
        toggleStatus (index, commission) {
            this.$set(this.toggleLoading, index, true)
            updateSetting('commission', {
                id: commission.id,
                data: {
                    status: `${commission.status ^ 1}`
                }
            }).then(data => {
                commission.status = data.status
                $.notify({
                    message: this.$t('action.update') + this.$t('common.status') + this.$t('status.success')
                })
                this.$delete(this.toggleLoading, index)
            }, error => {
                $.notify({
                    message: error,
                    type: 'danger'
                })
                this.$delete(this.toggleLoading, index)
            })
        }
    }
}
</script>
