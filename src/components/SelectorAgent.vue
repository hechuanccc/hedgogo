<template>
    <select
        class="form-control w-sm c-select"
        v-model="myAgent"
        :required="req"
        :disabled="!disabled"
        v-if="!loading && agents.length"
    >
        <option value="">{{ $t('common.please_select') }}</option>
        <option
            class="form-control"
            :value="e[attribute]"
            v-for="e in agents"
            :key="e.id"
        >
            {{ e.username }}
        </option>
    </select>
    <span
        class="p-b-xs p-t-sm form-control w-sm inline"
        v-else-if="loading"
    >
        <i class="fa fa-spin fa-spinner"></i>
    </span>
    <span
        class="p-b-xs p-t-sm form-control w-sm inline"
        v-else-if="!agents.length"
    >
        {{ $t('common.no_record') }}
    </span>
</template>

<script>
import { getUser } from '../service'
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
            default: ''
        },
        extra: {
            default: () => {},
            type: Object
        }
    },
    data () {
        return {
            agents: [],
            myAgent: this.agent,
            default_opt_fields: 'username',
            loading: true
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
        getUser('agent', {
            params: {
                opt_fields: `${this.opt_fields && this.opt_fields + ','}${this.attribute && this.attribute + ','}${this.default_opt_fields}`,
                ...this.extra
            }
        }).then(data => {
            this.agents = data
            this.loading = false
        })
        this.myAgent = this.agent
    }
}
</script>

