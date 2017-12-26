<template>
    <select class="form-control w-sm c-select" v-model="myTransactionType" :required="req" :disabled="!disabled">
        <option value="">{{ $t('bill.transaction_type') }}</option>
        <option
            class="form-control"
            :value="e.name"
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
            default: true
        },
        index: {
            default: 0
        },
        displayList: {
            default: []
        }
    },
    data () {
        return {
            transactionTypes: [],
            myTransactionType: this.transactionType
        }
    },
    watch: {
        transactionType (newObj, old) {
            this.myTransactionType = this.transactionType
        },
        myTransactionType (newObj, old) {
            if (this.myTransactionType !== '0') {
                if (newObj !== undefined) {
                    this.$emit('transaction-type-select', newObj)
                }
            }
        }
    },
    created () {
        this.$http.get(api.transactiontype).then(data => {
            if (this.displayList.length > 0) {
                this.transactionTypes = data.filter(e => this.displayList.includes(e.id))
            } else {
                this.transactionTypes = data
            }
        })
        this.myTransactionType = this.transactionType
    }
}
</script>

