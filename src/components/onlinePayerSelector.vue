<template>
  <select
    class="form-control c-select"
    v-model="selectedPayer"
    v-if="!loading && payerList.length"
  >
    <option
      class="form-control"
      :value="p.id"
      v-for="(p, i) in payerList"
      :key="i"
    >{{ p.name }}
    </option>
  </select>
  <span
    class="p-b-xs p-t-sm form-control"
    v-else-if="loading"
  >
    <i class="fa fa-spin fa-spinner"></i>
  </span>
  <span
    class="p-b-xs p-t-sm form-control"
    v-else-if="!payerList.length"
  >
    {{ $t('common.no_record') }}
  </span>
</template>

<script>
import api from '../api'
export default {
    props: {
        member: {
            default: ''
        }
    },
    data () {
        return {
            payer: '',
            payerList: [],
            selectedPayer: '',
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
            if (newObj) {
                this.$emit('payer-select', newObj)
            } else {
                this.$emit('payer-select', '')
            }
        }
    },
    created () {
        this.getPayer(this.member)
    },
    methods: {
        getPayer (id) {
            this.$http.get(`${api.online_payer}?member=${id}`).then(data => {
                this.payerList = data
                if (data.length) {
                    this.selectedPayer = data[0].id
                }
                this.loading = false
            })
        }
    }
}
</script>
