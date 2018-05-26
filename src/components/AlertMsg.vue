<template>
    <transition name="fade">
        <div class="alert" :class="['alert', alertClass]" v-if="showMsg">
            <i :class="['fa', iconClass]"></i>{{ ` ${msg}` }}
        </div>
    </transition>
</template>
<script>
export default {
    props: {
        msg: {
            default: '',
            type: String
        }
    },
    data () {
        return {
            alertClass: '',
            iconClass: '',
            showMsg: false,
            classMapping: {
                success: ['alert-success', 'fa-check'],
                warning: ['alert-warning', 'fa-warning'],
                danger: ['alert-danger', 'fa-close']
            }
        }
    },
    methods: {
        trigger (type, timeout, hideModal) {
            this.showMsg = false
            if (type) {
                [this.alertClass, this.iconClass] = this.classMapping[type]
                this.showMsg = true
                if (timeout) {
                    setTimeout(() => {
                        if (hideModal) {
                            this.$emit('hide-modal')
                        }
                        this.showMsg = false
                    }, timeout * 1000)
                }
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.fade-enter-active, .fade-leave-active{
  transition: opacity .5s
}
.fade-enter, .fade-leave-to{
  opacity: 0
}
</style>

