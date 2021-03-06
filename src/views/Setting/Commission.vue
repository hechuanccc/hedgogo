<template>
<div>
    <div class="m-b" v-if="$root.permissions.includes('add_commission_setting')">
        <router-link
            tag="button"
            class="md-btn blue w-sm"
            to="/commission/add"
        >{{ $t('dic.create') }}
        </router-link>
    </div>
    <div class="box p-b-xs">
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>{{ $t('dic.name') }}</th>
                    <th class="text-center">{{ $t('dic.status') }}</th>
                    <th class="text-center">{{ $t('user.valid_member') }}</th>
                    <th class="text-center">{{ $t('title.commission') }}</th>
                    <th class="text-center">{{ $t('user.agent_count') }}</th>
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
                        <status-switch
                            :status="commission.status"
                            @toggle="toggleStatus(commission)"
                            :loading="!!toggleLoading[commission.id]"
                            :disabled="!updateCommissionSettingStatusPermission"
                        />
                    </td>
                    <td class="text-center">{{ commission.member_num || 0 }}</td>
                    <td class="p-a-0 text-xs text-center" v-if="commission.rates && commission.rates.length">
                        <table class="table table-condensed m-b-0">
                            <thead>
                                <tr>
                                    <th class="text-center _600" width="60%">{{ $t('finance.income_threshold') }}</th>
                                    <th class="text-center _600" width="40%">{{ $t('finance.commission_rate') }}</th>
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
                    <td class="text-center" v-else>{{ $t('system.no_setting') }}</td>
                    <td class="text-center">
                        <router-link v-if="commission.agent_count !== 0" :to="'/agent/?commission_settings=' + commission.id ">{{ commission.agent_count }}</router-link>
                        <span v-else>{{ commission.agent_count || 0 }}</span>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="row text-center p-a" v-if="loading">
            <i class="fa fa-spin fa-spinner"></i>
            <b>{{ $t('system.loading') }}</b>
        </div>
        <div class="row text-center p-a" v-if="!loading && !commissionsettings.length">
            {{ $t('system.no_record') }}
        </div>
    </div>
</div>
</template>
<script>
import StatusSwitch from '../../components/StatusSwitch.vue'
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
    computed: {
        updateCommissionSettingStatusPermission () {
            return this.$root.permissions.includes('update_commission_setting_status')
        }
    },
    methods: {
        getCommissionSetting () {
            getSetting('commission')
            .then(data => {
                data.forEach(c => {
                    c.groups && c.groups[0].rates.sort((a, b) => a.income_threshold - b.income_threshold)
                    Object.assign(c, c.groups[0], {
                        id: c.id
                    })
                })
                this.commissionsettings = data
            })
            .catch($.errorNotify)
            .finally(() => { this.loading = false })
        },
        toggleStatus (commission) {
            this.$set(this.toggleLoading, commission.id, true)
            updateSetting('commission', {
                id: commission.id,
                data: {
                    name: commission.name,
                    status: commission.status ^ 1
                }
            }, {
                action: this.$t('dic.update'),
                object: this.$t('dic.status')
            })
            .then(({ status }) => { commission.status = status })
            .finally(() => { this.$delete(this.toggleLoading, commission.id) })
        }
    },
    components: {
        StatusSwitch
    }
}
</script>
