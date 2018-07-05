<template>
    <div class="box  ">
        <div class="box-body">
            <form class="form m-a" v-on:submit.prevent="onSubmit" enctype="multipart/form-data">
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
                <div class="m-t">
                    <div class="alert alert-danger" v-if="errorMsg">{{errorMsg}}</div>
                    <button type="" class="md-btn w-sm blue">{{$t('dic.submit')}}</button>
                    <label class="text-success m-l" v-if="success">密码设置成功，需要重新登录，即将跳转至登录页</label>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
    import { changePassword } from '../service'
    export default {
        data () {
            return {
                user: {
                    prev_password: '',
                    new_password: '',
                    repeat_password: ''
                },
                errorMsg: '',
                success: false
            }
        },
        watch: {
            success (newObj, old) {
                setTimeout(() => {
                    this.$router.go('/login')
                }, 4000)
            }
        },
        methods: {
            onSubmit (e) {
                changePassword(this.user).then(data => {
                    this.errorMsg = ''
                    this.success = true
                }, error => {
                    this.errorMsg = error
                })
            }
        }
    }
</script>

<style>
    .row .website-text{
        padding:0
    }
</style>
