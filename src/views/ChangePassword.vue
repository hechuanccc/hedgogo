<template>
    <div class="box">
        <div class="box-body">
            <form class="form m-a" @submit.prevent="onSubmit">
                <div class="row b-b p-b m-b">
                    <div class="form-group">
                        <label class="m-b-0">{{$t('user.prev_password')}}</label>
                        <input type="password" class="form-control w-lg" v-model="user.prev_password" required/>
                    </div>
                    <div class="form-group">
                        <label class="m-b-0">{{$t('user.new_password')}}</label>
                        <input type="password" class="form-control w-lg" v-model="user.new_password" required/>
                    </div>
                    <div class="form-group">
                        <label class="m-b-0">{{$t('user.repeat_password')}}</label>
                        <input type="password" class="form-control w-lg" v-model="user.repeat_password" required/>
                    </div>
                </div>
                <button type="submit" class="md-btn w-sm blue">
                    <span v-if="!loading">{{$t('dic.submit')}}</span>
                    <i class="fa fa-spin fa-spinner" v-else></i>
                </button>
            </form>
        </div>
    </div>
</template>

<script>
    import { changePassword } from '../service'
    import $ from '../utils/util'
    export default {
        data () {
            return {
                user: {
                    prev_password: '',
                    new_password: '',
                    repeat_password: ''
                },
                loading: false
            }
        },
        methods: {
            onSubmit (e) {
                this.loading = true
                changePassword(this.user).then(() => {
                    this.loading = false
                    $.notify({
                        message: this.$t('system_msg.password_changed_success')
                    })
                    setTimeout(() => {
                        this.$router.push('/login')
                    }, 3000)
                }, () => {
                    this.loading = false
                })
            }
        }
    }
</script>
