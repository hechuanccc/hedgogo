<template>
<div>
    <span
        class="label"
        :class="status ? 'success' : 'danger'"
    >
        <span v-if="!loading || type === 'text'">{{ options[myStatus] || defaultOptions[myStatus] }}</span>
        <span v-else-if="loading && type === 'switch'">
            &nbsp;&nbsp;<i class="fa fa-spin fa-spinner"></i>&nbsp;&nbsp;
        </span>
    </span>
    <a
        class="text-sm m-l-xs"
        @click="$emit('toggle')"
        v-if="!loading && !disabled && type === 'text'"
    >
        {{ options[myStatus ^ 1] || defaultOptions[myStatus ^ 1] }}
    </a>
    <span class="text-blue m-l-xs text-center" v-else-if="!disabled && type === 'text'">
        &nbsp;&nbsp;<i class="fa fa-spin fa-spinner"></i>&nbsp;&nbsp;
    </span>
    <label
        class="md-switch m-l-xs"
        v-if="!disabled && type === 'switch'"
    >
        <input
            type="checkbox"
            v-model="myStatus"
            @change="$emit('toggle')"
        />
        <i class="success"></i>
    </label>
</div>
</template>
<script>
export default {
    props: {
        status: {
            type: Number,
            default: 1,
            validator: (v) => (v === 1 || v === 0),
            required: true
        },
        loading: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        options: {
            type: Array,
            default: () => [],
            validator: (v) => (v.length === 0 || v.length === 2)
        },
        type: {
            type: String,
            default: 'switch',
            validator: (v) => (v === 'switch' || v === 'text')
        }
    },
    watch: {
        status () {
            this.myStatus = this.status
        }
    },
    data () {
        return {
            defaultOptions: [this.$t('status.inactive'), this.$t('status.active')],
            myStatus: this.status
        }
    }
}
</script>
