<template>
    <select v-model="myBank" class="form-control w-sm c-select" :required="req">
        <option class="form-control" value="">{{$t('common.please_select')}}</option>
        <option class="form-control" :value="b.id" v-for="b in banks">{{b.name}}</option>
    </select>
</template>

<script>
import { getSetting } from '../service'
export default {
    props: ['bank', 'req'],
    data () {
        return {
            banks: [],
            myBank: this.bank
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
            getSetting('bank').then(data => {
                this.banks = data
                this.myBank = this.bank
            })
        })
    }
}
</script>

