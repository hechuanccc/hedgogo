<template>
    <select class="form-control w-sm c-select" v-model="myTransactionType" :required="req" :disabled="!disabled">
        <option value="">{{ $t('bill.transaction_type') }}</option>
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
            default: true
        },
        index: {
            default: 0
        },
        displayList: {
            default: ''
        },
        attribute: {
            default: 'name'
        },
        opt_fields:{
            default: ''
        }
    },
    data () {
        return {
            transactionTypes: [],
            myTransactionType: this.transactionType,
            noViewPermissions: []
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
        this.$http.get(`${api.transactiontype}${this.opt_fields !== '' ? '?opt_fields=' + this.opt_fields : ''}`).then(data => {
            if (!this.$root.permissions.includes('view_remit_transaction_page')) {
                this.noViewPermissions.push(1)
            }
            if (!this.$root.permissions.includes('view_withdraw_application_page')) {
                this.noViewPermissions.push(8)
            }
            if (this.displayList.length > 0) {
                this.transactionTypes = data.filter(e => this.displayList.includes(e.id))
            } else {
                this.transactionTypes = data
            }
            this.transactionTypes = this.transactionTypes.filter(e => !this.noViewPermissions.includes(e.id))
        })
        this.myTransactionType = this.transactionType
    }
}
</script>

