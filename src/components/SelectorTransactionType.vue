<template>
    <select
        class="form-control w-sm c-select"
        v-model="myTransactionType"
        :required="req"
        :disabled="disabled"
    >
        <option value="">{{ $t('common.please_select') }}</option>
        <option
            class="form-control"
            :value="e[attribute]"
            v-for="e in transactionTypes"
            :key="e.id"
        >
            {{ e.display_name }}
        </option>
    </select>
</template>

<script>
import api from '../api'
export default {
    props: {
        req: {
            default: false
        },
        transactionType: '',
        disabled: {
            default: false
        },
        displayList: {
            default: ''
        },
        attribute: {
            default: 'name'
        },
        opt_fields: {
            default: ''
        }
    },
    data () {
        return {
            transactionTypes: [],
            myTransactionType: this.transactionType,
            default_opt_fields: 'id,display_name'
        }
    },
    watch: {
        transactionType (newObj, old) {
            this.myTransactionType = this.transactionType
        },
        myTransactionType (newObj, old) {
            this.$emit('transaction-type-select', newObj)
        }
    },
    created () {
        this.$http.get(`${api.transaction.type}?opt_fields=${this.opt_fields && this.opt_fields + ','}${this.attribute && this.attribute + ','}${this.default_opt_fields}`).then(data => {
            if (this.displayList.length > 0) {
                this.transactionTypes = data.filter(e => this.displayList.includes(e.code))
            } else {
                this.transactionTypes = data
            }
        })
        this.myTransactionType = this.transactionType
    }
}
</script>

