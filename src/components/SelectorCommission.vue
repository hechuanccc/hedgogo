<template>
    <select
        class="form-control c-select"
        v-model="myCommission"
        :required="required"
    >
        <option value="">{{$t('common.please_select')}}</option>
        <option
            class="form-control"
            :key="c.id"
            :value="c.id"
            v-for="c in commissionsettings"
        >
            {{c.name}}
            <span v-if="showStatus">- {{ c.status ? $t('status.active') : $t('status.inactive') }}</span>
        </option>
    </select>
</template>

<script>
import { getSetting } from '../service'
export default {
    props: ['required', 'commissionsetting', 'default', 'showStatus'],
    data () {
        return {
            commissionsettings: [],
            myCommission: this.commissionsetting
        }
    },
    watch: {
        commissionsetting (newObj) {
            this.myCommission = newObj || ''
        },
        myCommission (newObj) {
            this.$emit('myCommission', newObj)
        }
    },
    created () {
        this.$nextTick(() => {
            getSetting('commission', {
                params: {
                    opt_field: 'id,name'
                }
            }).then(data => {
                this.commissionsettings = data
            })
        })
    }
}
</script>

