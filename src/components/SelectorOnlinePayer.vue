<template>
  <select
    class="form-control c-select w-sm"
    v-model="selectedPayer"
    v-if="!loading && mode === 'selector' && payerList.length"
  >
    <option value="" v-if="clearable">{{ $t('common.please_select') }}</option>
    <option
      class="form-control"
      :value="p.id"
      v-for="(p, i) in payerList"
      :key="i"
    >{{ p.name }}
    </option>
  </select>
  <div v-else-if="!loading && mode === 'linklist' && payerList.length">
    <a
      v-for="(p, i) in payerList"
      :key="i"
      :class="{'m-r-xs': i < payerList.length - 1}"
      @click="selectPayer(p.id)"
    >{{ p.name }}
    </a>
  </div>
  <span
    class="p-b-xs p-t-sm form-control w-sm"
    v-else-if="loading && mode === 'selector'"
  >
    <i class="fa fa-spin fa-spinner"></i>
  </span>
  <span
    class="p-b-xs p-t-sm form-control w-sm"
    v-else-if="!payerList.length && mode === 'selector'"
  >
    {{ $t('common.no_record') }}
  </span>
</template>

<script>
import api from '../api'
export default {
    props: {
        clearable: {
            default: false,
            type: Boolean
        },
        member: {
            default: ''
        },
        mode: {
            default: 'selector'
        },
        payer: {
            default: ''
        },
        transaction: {
            default: ''
        },
        addOptions: {
            default: () => [],
            type: Array
        }
    },
    data () {
        return {
            payerList: [],
            selectedPayer: this.payer,
            loading: true
        }
    },
    watch: {
        member (newObj) {
            if (newObj) {
                this.getPayer(newObj)
            }
        },
        selectedPayer (newObj, old) {
            if (newObj !== old) {
                if (newObj) {
                    this.$emit('payer-select', newObj)
                } else {
                    this.$emit('payer-select', '')
                }
            }
        },
        payer (newObj) {
            this.selectedPayer = newObj
        }
    },
    created () {
        this.getPayer(this.member)
    },
    methods: {
        getPayer (id) {
            this.$http.get(`${api.online_payer}?${id ? `member=${id}` : ''}`).then(data => {
                if (data.length && this.mode === 'selector' && !this.payer && !this.clearable) {
                    this.selectedPayer = data[0].id
                }
                this.payerList = data
                if (this.addOptions.length) {
                    this.payerList = [...this.payerList, ...this.addOptions]
                }
                this.$emit('no-payer', !data.length)
                this.loading = false
            })
        },
        selectPayer (id) {
            this.selectedPayer = id
            this.transaction && this.$emit('get-transaction', this.transaction)
        }
    }
}
</script>
