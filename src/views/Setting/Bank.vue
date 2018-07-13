<template>
<div>
    <div class="col-md-6" v-for="(banks, i) in bankList" :key="i">
        <div class="box">
            <table st-table="rowCollectionBasic" class="table table-striped">
                <thead>
                    <tr>
                        <th width="60%">{{ $t('dic.name') }}</th>
                        <th width="40%" class="text-center">{{ $t('dic.status') }}</th>
                    </tr>
                </thead>
                <tbody v-if="!loading">
                    <tr :key="bank.id" v-for="bank in banks">
                        <td>{{ bank.name }}</td>
                        <td class="text-center b-r-2x">
                            <status-switch
                                :status="bank.status"
                                @toggle="toggleStatus(bank)"
                                :loading="!!toggleLoading[bank.id]"
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div class="row text-center" v-if="!loading && !bankList[0].length && !bankList[1].length">
        <b>{{ $t('system.no_data') }}</b>
    </div>
    <div class="row text-center" v-else-if="loading">
        <i class="fa fa-spin fa-spinner"></i>
        <b>{{ $t('system.loading') }}...</b>
    </div>
</div>
</template>
<script>
import StatusSwitch from '../../components/StatusSwitch.vue'
import { getSetting, updateSetting } from '../../service'

export default {
    data () {
        return {
            bankList: [[], []],
            toggleLoading: {},
            loading: true
        }
    },
    created () {
        this.getBanks()
    },
    methods: {
        getBanks () {
            getSetting('bank').then(data => {
                for (let index = 0; index < data.length; index += 2) {
                    data[index] && this.bankList[0].push(data[index])
                    data[index + 1] && this.bankList[1].push(data[index + 1])
                }
            }).finally(() => { this.loading = false })
        },
        toggleStatus (bank = {}) {
            this.$set(this.toggleLoading, bank.id, true)
            bank.id && updateSetting('bank', {
                id: bank.id,
                data: {
                    status: bank.status ^ 1
                }
            }, {
                action: this.$t('dic.update'),
                object: this.$t('dic.status')
            })
            .then(({ status }) => { bank.status = status })
            .finally(() => { this.$delete(this.toggleLoading, bank.id) })
        }
    },
    components: {
        StatusSwitch
    }
}
</script>
