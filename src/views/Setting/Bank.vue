<template>
<div>
    <div class="col-md-6" v-for="(banks, i) in bankList" :key="i">
        <div class="box">
            <table st-table="rowCollectionBasic" class="table table-striped">
                <thead>
                    <tr>
                        <th width="60%">{{ $t('common.name') }}</th>
                        <th width="40%" class="text-center">{{ $t('common.status') }}</th>
                    </tr>
                </thead>
                <tbody v-if="!loading">
                    <tr :key="bank.id" v-for="bank in banks">
                        <td>{{ bank.name }}</td>
                        <td class="text-center b-r-2x">
                            <span v-if="bank.status === 1" class="label success">{{ $t('status.active') }}</span>
                            <span v-else class="label danger">{{ $t('status.inactive') }}</span>
                            <a class="m-l-xs" @click="toggleStatus(bank)" v-if="!toggleLoading[bank.id] && bank.status === 1">{{ $t('status.disabled') }}</a>
                            <a class="m-l-xs" @click="toggleStatus(bank)" v-else-if="!toggleLoading[bank.id]">{{ $t('status.active') }}</a>
                            <span class="text-blue m-l-xs" v-else>
                                &nbsp;&nbsp;<i class="fa fa-spin fa-spinner"></i>&nbsp;&nbsp;
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div class="row text-center" v-if="!loading && !bankList[0].length && !bankList[1].length">
        <b>{{ $t('common.no_data') }}</b>
    </div>
    <div class="row text-center" v-else-if="loading">
        <i class="fa fa-spin fa-spinner"></i>
        <b>{{ $t('common.loading') }}...</b>
    </div>
</div>
</template>
<script>
import api from '../../api'
import $ from '../../utils/util'

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
            this.$http.get(api.setting.bank).then(data => {
                for (let index = 0; index < data.length; index += 2) {
                    data[index] && this.bankList[0].push(data[index])
                    data[index + 1] && this.bankList[1].push(data[index + 1])
                }
                this.loading = false
            })
        },
        toggleStatus (bank = {}) {
            this.$set(this.toggleLoading, bank.id, true)
            bank.id && this.$http.put(`${api.setting.bank}${bank.id}/`, {
                status: bank.status ^ 1
            }).then(data => {
                bank.status = data.status
                $.notify({
                    message: this.$t('action.update') + this.$t('status.success')
                })
                this.$delete(this.toggleLoading, bank.id)
            }, error => {
                $.notify({
                    message: error,
                    type: 'danger'
                })
                this.$delete(this.toggleLoading, bank.id)
            })
        }
    }
}
</script>
