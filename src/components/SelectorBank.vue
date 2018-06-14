<template>
    <select v-model="myBank" class="form-control w-sm c-select" :required="req" v-if="!loading && banks.length">
        <option class="form-control" value="">{{$t('common.please_select')}}</option>
        <option
            class="form-control"
            :value="b.id"
            v-for="b in banks"
            :key="b.id">
            {{b.name}}
            <span v-if="showStatus">{{ ` - ${b.status ? $t('status.active') : $t('status.disabled')}` }}</span>
        </option>
    </select>
    <span
        class="p-b-xs p-t-sm form-control w-sm inline"
        v-else-if="loading"
    >
        <i class="fa fa-spin fa-spinner"></i>
    </span>
    <span
        class="p-b-xs p-t-sm form-control w-sm inline"
        v-else-if="!banks.length"
    >
        {{ $t('common.no_data') }}
    </span>
</template>

<script>
import api from '../api'
export default {
    props: ['bank', 'req', 'showStatus'],
    data () {
        return {
            banks: [],
            myBank: this.bank,
            loading: true
        }
    },
    watch: {
        myBank (newObj, old) {
            if (newObj === undefined) {
                this.myBank = ''
            } else {
                this.$emit('bank-select', newObj)
            }
        }
    },
    created () {
        this.$nextTick(() => {
            this.$http.get(api.setting.bank).then(data => {
                this.showStatus && data.sort((a, b) => b.status - a.status)
                this.banks = data
                this.myBank = this.bank
                this.loading = false
            })
        })
    }
}
</script>

