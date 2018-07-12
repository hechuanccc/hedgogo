<template>
    <select
        v-model="myBank"
        class="form-control c-select"
        :class="width"
        :required="req"
        v-if="!loading && banks.length"
    >
        <option class="form-control" value="">{{$t('system.please_select')}}</option>
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
        class="p-b-xs p-t-xs form-control inline"
        :class="width"
        v-else-if="loading"
    >
        <i class="fa fa-spin fa-spinner"></i>
    </span>
    <span
        class="p-b-xs p-t-xs form-control inline"
        :class="width"
        v-else-if="!banks.length"
    >
        {{ $t('system.no_data') }}
    </span>
</template>

<script>
import { getSetting } from '../service'
export default {
    props: ['bank', 'req', 'showStatus'],
    data () {
        return {
            banks: [],
            myBank: this.bank,
            loading: true
        }
    },
    computed: {
        width () {
            return this.showStatus ? 'w-md' : 'w-sm'
        }
    },
    watch: {
        bank (newObj) {
            this.myBank = newObj
        },
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
            getSetting('bank').then(data => {
                this.showStatus && data.sort((a, b) => b.status - a.status)
                this.banks = data
                this.myBank = this.bank
            }).finally(() => {
                this.loading = false
            })
        })
    }
}
</script>

