<template>
    <select class="form-control w-sm c-select" v-model="agentLevel" @change="onChange">
        <option value="">{{$t('common.please_select')}}</option>
        <option class="form-control" :value="l.id" v-for="l in levels">{{l.name}}</option>
    </select>
</template>

<script>
import api from '../api'
export default {
    props: ['level', 'default'],
    data () {
        return {
            levels: [],
            agentLevel: this.level
        }
    },
    watch: {
        agentLevel: function (old, newObj) {
            this.$emit('agentLevel', old)
        }
    },
    created () {
        this.$nextTick(() => {
            this.$http.get(api.agentlevel)
            .then(response => {
                this.levels = response.data
                if (this.default) {
                    this.agentLevel = this.default
                }
            })
        })
    },
    methods: {
        onChange: function () {
            this.$emit('level-select', this.agentLevel)
        }
    }
}
</script>

