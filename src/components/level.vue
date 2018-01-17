<template>
    <select class="form-control w-sm c-select" v-model="mySelectLevel" v-if="mode==='select'" :required="req" :disabled="!disabled">
        <option value="">{{$t('member.level')}}</option>
        <option class="form-control" :value="l.id" v-for="l in levels" :key="l.id">{{l.name}}</option>
    </select>
    <div class="checkbox" v-else>
        <label class="m-r"  v-for="l in levels" :key="l.id">
            <input type="checkbox" name="paymenttype" v-model="myCheckboxLevel[l.id]">
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
        level: {
            default: ''
        },
        mode: {
            default: 'select'
        },
        disabled: {
            default: true
        },
        index: {
            default: 0
        },
        noShowTrialMember: {
            type: Boolean,
            default: true
        },
        opt_fields: {
            default: ''
        }
    },
    data () {
        return {
            levels: [],
            mySelectLevel: '',
            myCheckboxLevel: {},
            default_opt_fields: 'id,name'
        }
    },
    watch: {
        level (newObj, old) {
            if (this.mode === 'select') {
                this.mySelectLevel = this.level || ''
            } else {
                this.level.forEach(element => {
                    this.$set(this.myCheckboxLevel, element, true)
                })
            }
        },
        mySelectLevel (newObj, old) {
            if (newObj) {
                this.$emit('level-select', newObj.toString())
            } else {
                this.$emit('level-select', newObj)
            }
            this.$emit('level-choose', this.mySelectLevel, this.index)
        },
        myCheckboxLevel: {
            handler (newObj) {
                this.$emit('level-select', Object.keys(newObj).filter(e => newObj[e]))
            },
            deep: true
        }
    },
    created () {
        this.$http.get(`${api.level}${this.noShowTrialMember ? '?account_type=1' : ''}&opt_fields=${this.opt_fields && this.opt_fields + ','}${this.default_opt_fields}`).then(data => {
            this.levels = data
        })
        if (this.mode === 'select') {
            this.mySelectLevel = this.level
        } else {
            if (this.level.length) {
                this.level.forEach(element => {
                    this.$set(this.myCheckboxLevel, element, true)
                })
            }
        }
    }
}
</script>

