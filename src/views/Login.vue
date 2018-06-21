<template>
    <div class="bg-auto w-full ">
        <div class="fade-in-right-big smooth pos-rlt p-t-lg">
            <div class="center-block w-xxl w-auto-xs p-y-xlg">
                <div class="navbar ">
                    <div class="pull-center ">
                        <a class="navbar-brand">
                            <img src="../../static/images/logo.png" alt="." >
                        </a>
                    </div>
                </div>
                <div class="p-a-md box-color r box-shadow-z1 text-color m-a ">
                    <div class="m-b text-sm ng-binding">
                    管理后台 · 登录
                    </div>
                    <form @submit.prevent="loginHandler" class="form">
                        <div class="md-form-group">
                            <input type="text" class="md-input" v-model="user.username" name="username" ref="input">
                            <label>Username</label>
                        </div>
                        <div class="md-form-group">
                            <input type="password" class="md-input" v-model="user.password" name="password">
                            <label>Password</label>
                        </div>
                        <div v-show="errorMsg" class="text-danger m-b-sm"> {{errorMsg}} </div>
                        <button type="submit" class="btn primary btn-block p-x-md" @keyup.enter="loginHandler">登录</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import { login } from '../service'
    import $ from '../utils/util'
    import axios from 'axios'
    export default {
        data () {
            return {
                user: {
                    username: '',
                    password: ''
                },
                errorMsg: ''
            }
        },
        watch: {
            'user': {
                handler () {
                    this.errorMsg = ''
                },
                deep: true
            }
        },
        created () {
            this.$nextTick(() => {
                this.$refs.input.focus()
            })
        },
        methods: {
            loginHandler () {
                login(this.user).then(data => {
                    if (data.type === 'agent') {
                        this.errorMsg = this.$t('system_msg.agent_login_error')
                        return
                    }
                    $.storage.save({type: data.type})
                    let d = new Date(data.expires_in)
                    // Vue.http.headers.common['Authorization'] = 'Bearer ' + data.access_token
                    // use access_token to access APIs
                    if (data.access_token) {
                        window.document.cookie = 'access_token=' + data.access_token + ';path=/;expires=' + d.toGMTString()
                        axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.access_token
                    }
                    // use refresh_token to fetch new access_token
                    if (data.refresh_token) {
                        window.document.cookie = 'refresh_token=' + data.refresh_token + ';path=/;expires=' + d.toGMTString()
                    }
                    this.$root.userType = data.type
                    this.$root.getMy()
                    let url = this.$route.query.next
                    url = url ? decodeURIComponent(url.split('?')[0]) : '/'
                    this.$router.push(url)
                }, error => {
                    this.errorMsg = (typeof error === 'string') ? error : this.$t('system_msg.error_occurred')
                })
            }
        },
        components: {
            'commonStyle': require('../components/style.vue')
        }
    }
</script>
