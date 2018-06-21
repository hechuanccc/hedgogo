<template>
    <select
        class="form-control w-sm c-select"
        v-model="myTransactionType"
        :required="req"
        :disabled="disabled"
        v-if="!loading"
    >
        <option value="">{{ $t('system.please_select') }}</option>
        <option
            class="form-control"
            :value="e[attribute]"
            v-for="e in transactionTypes"
            :key="e.id"
        >
            {{ e.display_name }}
        </option>
    </select>
    <span
        class="p-b-xs p-t-sm w-sm form-control"
        v-else
    >
        <i class="fa fa-spin fa-spinner"></i>
    </span>
</template>

<script>
import { getTransactionType } from '../service'
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
            default_opt_fields: 'id,display_name',
            loading: true
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
        getTransactionType({
            opt_fields: `${this.opt_fields && this.opt_fields + ','}${this.attribute && this.attribute + ','}${this.default_opt_fields}`
        }).then(data => {
            if (this.displayList.length > 0) {
                this.transactionTypes = data.filter(e => this.displayList.includes(e.code))
            } else {
                this.transactionTypes = data
            }
            this.loading = false
        })
        this.myTransactionType = this.transactionType
    }
}
</script>

