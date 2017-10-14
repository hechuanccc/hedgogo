<template>
    <select class="form-control w-sm c-select" v-model="myLevel" v-if="mode==='select'" :required="req" :disabled="!disabled">
        <option value="">{{$t('common.please_select')}}</option>
        <option class="form-control" :value="l.id" v-for="l in levels">{{l.name}}</option>
    </select>
    <div v-else>
        <label class="ui-check ui-check-md m-r"  v-for="l in levels">
            <input type="checkbox" name="paymenttype" :value="l.id" v-model="myLevel">
            <i class="dark-white"></i>
            {{l.name}}
        </label>
    </div>
</template>

<script>
import api from '../api'
export default {
    props: {
        req: {
            default: false
        },
        level: '',
        mode: {
            default: 'select'
        },
        disabled: {
            default: true
        },
        index: {
            default: 0
        }
    },
    data () {
        return {
            levels: [],
            myLevel: this.level
        }
    },
    watch: {
        level (newObj, old) {
            this.myLevel = this.level
        },
        myLevel (newObj, old) {
            if (newObj !== undefined) {
                this.$emit('level-select', newObj)
                this.$emit('level-choose', this.myLevel, this.index)
            }
        }
    },
    created () {
        this.$http.get(api.level).then(response => {
            this.levels = response.data
            if (this.default) {
                this.level = this.default
            }
            let _this = this
            setTimeout(function () {
                _this.myLevel = _this.level
            }, 100)
        })
    }
}
</script>

