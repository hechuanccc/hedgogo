<template>
    <select class="form-control w-sm c-select" v-model="myAgent" :required="req" :disabled="!disabled">
        <option value="">{{ $t('member.agent') }}</option>
        <option
            class="form-control"
            :value="e[attribute]"
            v-for="e in agents"
            :key="e.id"
        >
            {{ e.username }}
        </option>
    </select>
</template>

<script>
import api from '../api'
export default {
    props: {
        req: {
            default: false
        },
        agent: '',
        disabled: {
            default: true
        },
        index: {
            default: 0
        },
        attribute: {
            default: 'id'
        },
        opt_fields: {
            default: 'id,username'
        }
    },
    data () {
        return {
            agents: [],
            myAgent: this.agent
        }
    },
    watch: {
        agent (newObj, old) {
            this.myAgent = this.agent
        },
        myAgent (newObj, old) {
            if (this.myAgent !== '0') {
                if (newObj !== undefined) {
                    this.$emit('agent-select', newObj.toString())
                }
            }
        }
    },
    created () {
        this.$http.get(`${api.agent}${this.opt_fields !== '' ? '?opt_fields=' + this.opt_fields : ''}`).then(data => {
            this.agents = data
        })
        this.myAgent = this.agent
    }
}
</script>

