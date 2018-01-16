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
        level: '',
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
        }
    },
    data () {
        return {
            levels: [],
            mySelectLevel: '',
            myCheckboxLevel: {}
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
            this.$emit('level-select', newObj && newObj.toString())
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
        this.$http.get(`${api.level_filter}${this.noShowTrialMember ? '?account_type=1' : ''}`).then(data => {
            this.levels = data
            if (this.mode === 'select') {
                this.mySelectLevel = this.level || ''
            } else {
                if (this.level.length) {
                    this.level.forEach(element => {
                        this.$set(this.myCheckboxLevel, element, true)
                    })
                }
            }
        })
    }
}
</script>

