<template>
    <div>
      <select class="form-control w-sm c-select" v-model="myReturnsetting">
        <option value="">{{$t('common.please_select')}}</option>
        <option class="form-control" :value="r.id" v-for="r in returnsettings">{{r.name}}</option>
      </select>
    </div>
</template>

<script>
import api from '../api'
export default {
    props: ['returnsetting', 'default', 'defaultOption'],
    data () {
        return {
            returnsettings: [],
            myReturnsetting: this.returnsetting
        }
    },
    watch: {
        returnsetting (newObj, old) {
            this.myReturnsetting = this.returnsetting
        },
        myReturnsetting (newObj, old) {
            if (newObj !== undefined) {
                this.$emit('myReturn', newObj)
            }
        }
    },
    mounted: function () {
        this.$nextTick(function () {
            this.$http.get(api.return + '?opt_fields=id,name')
            .then(response => {
                this.returnsettings = response.data
                if (this.default) {
                    this.$emit('return', this.default)
                }
                let _this = this
                setTimeout(function () {
                    _this.myReturnsetting = _this.returnsetting
                }, 500)
            })
        })
    }
}
</script>

