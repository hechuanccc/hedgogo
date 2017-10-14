<template>
    <select v-model="myBank" class="form-control w-sm c-select" :required="req">
        <option class="form-control" value="">{{$t('common.please_select')}}</option>
        <option class="form-control" :value="b.id" v-for="b in banks">{{b.name}}</option>
    </select>
</template>

<script>
import api from '../api'
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
            let _this = this
            _this.$http.get(api.bank).then(response => {
                _this.banks = response.data
            })
            setTimeout(function () {
                _this.myBank = _this.bank
            }, 1500)
        })
    }
}
</script>

