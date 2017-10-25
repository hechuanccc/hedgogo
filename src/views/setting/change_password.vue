<template>
    <div class="box  ">
        <div class="box-body">
            <form class="form m-a" v-on:submit.prevent="onSubmit" enctype="multipart/form-data">
                <div class="row b-b p-b m-b">
                    <div class="col-md-10">
                        <div>
                            <div class="form-group">
                                <label  class="label-width col-xs-1">{{$t('manage.prev_password')}} </label>
                                <div class="inline-form-control">
                                    <input type="password" class="form-control w-lg inline" placeholder="请输入旧密码" v-model="user.prev_password" required/>
                                </div>
                            </div>
                            <div class="form-group">
                                <label  class="label-width col-xs-1">{{$t('manage.new_password')}} </label>
                                <div class="inline-form-control">
                                    <input type="password" class="form-control w-lg inline" placeholder="至少包含一个字符，数字或符号" v-model="user.new_password" required/>
                                </div>
                            </div>
                            <div class="form-group">
                                <label  class="label-width col-xs-1">{{$t('manage.repeat_password')}} </label>
                                <div class="inline-form-control">
                                    <input type="password" class="form-control w-lg inline" placeholder="重复输入新密码" v-model="user.repeat_password" required/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="m-t">
                    <div class="alert alert-danger" v-if="responseError">{{responseError}}</div>
                    <button type="" class="md-btn w-sm blue">{{$t('common.save')}}</button>
                    <label class="text-success m-l" v-if="success">密码设置成功，需要重新登录，即将跳转至登录页</label>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
    import api from '../../api'
    import { handleError } from '../../utils/handleError'
    export default {
        data () {
            return {
                user: {
                    prev_password: '',
                    new_password: '',
                    repeat_password: ''
                },
                field_locales: {
                    'previous_password_field': '原密码输入有误：',
                    'new_password': '新密码输入有误：',
                    'password_field': '密码输入有误：'
                },
                responseError: '',
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
                this.$http.post(api.changePassword, this.user).then(response => {
                    if (response.status === 200) {
                        this.responseError = ''
                        this.success = true
                    }
                }, response => {
                    this.responseError = ''
                    for (let field in this.field_locales) {
                        this.responseError += handleError(response, field, this.field_locales)
                    }
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
