<template>
    <select
        class="form-control w-sm c-select"
        v-model="mySelectLevel"
        v-if="!loading && mode === 'select'"
        :required="req"
        :disabled="disabled"
    >
        <option value="">{{$t('system.please_select')}}</option>
        <option class="form-control" :value="l.id" v-for="l in levels" :key="l.id">{{l.name}}</option>
    </select>
    <div class="checkbox" v-else-if="!loading && mode === 'checkbox'">
        <label class="m-r"  v-for="l in levels" :key="l.id">
            <input type="checkbox" name="paymenttype" v-model="myCheckboxLevel[l.id]">
            <i class="dark-white"></i>
            {{l.name}}
        </label>
    </div>
    <span
        class="p-b-xs p-t-sm w-sm"
        :class="{'form-control': mode === 'select'}"
        v-else-if="loading"
    >
        <i class="fa fa-spin fa-spinner"></i>
    </span>
</template>

<script>
import { getSetting } from '../service'
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
            default: false
        },
        index: {
            default: 0
        },
        accountType: {
            default: '1'
        },
        reportFlag: {
            default: false
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
            default_opt_fields: 'id,name',
            loading: true
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
        let params = {}
        this.accountType && (params['account_type'] = this.accountType)
        this.reportFlag && (params['report_flag'] = 'True')
        params['opt_fields'] = (this.opt_fields && this.opt_fields + ',') + this.default_opt_fields

        getSetting('memberLevel', {
            params
        }).then(data => {
            this.levels = data
            this.loading = false
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

