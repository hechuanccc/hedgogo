<template>
  <select
    class="form-control c-select w-sm"
    v-model="selectedLevel"
    v-if="!loading && levels.length"
  >
    <option value="">{{ $t('system.please_select') }}</option>
    <option
      class="form-control"
      :value="l.id"
      v-for="(l, i) in levels"
      :key="i"
    >{{ l.name }}
    </option>
  </select>
  <span
    class="p-b-xs p-t-sm form-control w-sm"
    v-else-if="loading"
  >
    <i class="fa fa-spin fa-spinner"></i>
  </span>
  <span
    class="p-b-xs p-t-sm form-control w-sm"
    v-else-if="!levels.length"
  >
    {{ $t('system.no_record') }}
  </span>
</template>

<script>
import { getSetting } from '../service'
export default {
    props: {
        level: ''
    },
    data () {
        return {
            levels: [],
            selectedLevel: '',
            loading: true
        }
    },
    watch: {
        level (newObj) {
            this.selectedLevel = newObj || ''
        },
        selectedLevel (newObj, old) {
            if (newObj) {
                this.$emit('level-select', newObj.toString())
            } else {
                this.$emit('level-select', '')
            }
        }
    },
    created () {
        getSetting('agentLevel').then(data => {
            this.levels = data
            this.selectedLevel = this.level || ''
            this.loading = false
        })
    }
}
</script>

