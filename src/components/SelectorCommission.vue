<template>
    <select class="form-control w-sm c-select" v-model="myCommission" :required="required">
        <option value="">{{$t('common.please_select')}}</option>
        <option class="form-control" :value="r.id" v-for="r in commissionsettings">{{r.name}}</option>
    </select>
</template>

<script>
import api from '../api'
export default {
    props: ['required', 'commissionsetting', 'default'],
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
            this.$http.get(api.setting.commission + '?opt_fields=id,name')
            .then(data => {
                this.commissionsettings = data
            })
        })
    }
}
</script>

