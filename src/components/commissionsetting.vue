<template>
    <select class="form-control w-sm c-select" v-model="myCommission">
        <option value="">{{$t('common.please_select')}}</option>
        <option class="form-control" :value="r.id" v-for="r in commissionsettings">{{r.name}}</option>
    </select>
</template>

<script>
import api from '../api'
export default {
    props: ['commissionsetting', 'default'],
    data () {
        return {
            commissionsettings: [],
            myCommission: this.commissionsetting
        }
    },
    watch: {
        myCommission: function (old, newObj) {
            this.$emit('myCommission', old)
        }
    },
    created () {
        this.$nextTick(() => {
            this.$http.get(api.commission + '?opt_fields=id,name')
            .then(response => {
                this.commissionsettings = response.data
                if (this.default) {
                    this.commissionsetting = this.default
                }
                let _this = this
                setTimeout(function () {
                    _this.myCommission = _this.commissionsetting
                }, 500)
            })
        })
    }
}
</script>

