<template>
    <div class="app">
        <aside-menu :show-nav="showNav"></aside-menu>
        <div id="content" :class="['content app-content box-shadow-z2 box-radius-1x', showNav ? '' : 'm-l-0']">
            <page-header :show-nav="showNav"></page-header>
            <div class="app-body">
                <div class="padding">
                    <div v-if="authErrors.length" class="alert alert-danger">
                        <span>无权限访问</span>
                        <ul>
                            <li v-for="error in authErrors" :key="error+index">{{error}}</li>
                        </ul>
                    </div>
                    <transition name="fade">
                        <router-view></router-view>
                    </transition>
                </div>
                <div class="loading-layer" v-show="routerLoading">
                    <div class="icon">
                        <div class="floating-circles">
                            <div class="f-circle frotate-01"></div>
                            <div class="f-circle frotate-02"></div>
                            <div class="f-circle frotate-03"></div>
                            <div class="f-circle frotate-04"></div>
                            <div class="f-circle frotate-05"></div>
                            <div class="f-circle frotate-06"></div>
                            <div class="f-circle frotate-07"></div>
                            <div class="f-circle frotate-08"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import $ from '../utils/util'
import api from '../api'
import axios from 'axios'
export default {
    data () {
        return {
            authErrors: [],
            userType: '',
            routerLoading: false,
            permissions: [],
            username: '',
            dropdown: false,
            remit_count: '',
            withdraw_count: '',
            agent_application: ''
        }
    },
    computed: {
        showNav () {
            return this.$route.name !== 'login' && this.$route.name !== 'error'
        }
    },
    // created hook: DOM compilation has not been started, so we can
    // do something before sub-components are ready to be compile
    // BTW, ready() hook won't do
    created () {
        this.getMy()
        // setup an event for login.vue to call when login successfully
        // this.$emit('initAuthentication', function (cb) {
        //     console.log('in emit initAuthentication')
        //     this.getPermissions(cb)
        // })
    },
    methods: {
        /**
         * before every router can be reached, authentication and permissions
         * should be checked
         */
        agentPermission () {
            this.$router.beforeEach((to, from, next) => {
                this.dropdown = false
                if (!to.meta.agentPermission) {
                    this.$router.push('/')
                } else {
                    next()
                }
            })
        },
        setUpRouterHooks () {
            this.$router.beforeEach((to, from, next) => {
                this.dropdown = false
                this.routerLoading = true
                // need to reset all errors everytime we go to other routers
                this.authErrors = []
                // if the router require permission which is defined in routers.js,
                // and the permission is not in the user's permission list
                // have to redirect to a 'Fobidden' page
                if (to.meta.permission && !this.permissions.includes(to.meta.permission)) {
                    this.$router.push('/ban')
                } else {
                    next()
                }
            })

            this.$router.afterEach(() => {
                this.routerLoading = false
            })
        },
        setUpAuth () {
            let refreshTokenInterval
            // refresh access token every 5 mins
            $.setIndicator(() => {
                refreshTokenInterval = window.setInterval(() => {
                    this.refresh()
                }, 300000)
            }, () => {
                window.clearInterval(refreshTokenInterval)
            })
        },
        getMy () {
            if (!this.$cookie.get('access_token')) {
                return
            }
            this.$http.get(api.my).then(data => {
                if (data) {
                    this.username = data.username
                    this.userType = data.type
                    if (this.userType === 'agent') {
                        this.agentPermission()
                    }
                    this.getPermissions()
                } else {
                    this.$router.push('/login?next=' + this.$route.path)
                }
            }, () => {
                this.$router.push('/login?next=' + this.$route.path)
            })
        },
        refresh () {
            let refreshToken = this.$cookie.get('refresh_token')
            if (!refreshToken) {
                return
            }
            this.$http.post(api.refresh_token, {
                refresh_token: this.$cookie.get('refresh_token')
            }).then(data => {
                let d = new Date(data.expires_in)
                // use access_token to access APIs
                window.document.cookie = 'access_token=' + data.access_token + ';path=/;expires=' + d.toGMTString()
                // use refresh_token to fetch new access_token
                window.document.cookie = 'refresh_token=' + data.refresh_token + ';path=/;expires=' + d.toGMTString()
                axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.access_token
            })
        },
        getPermissions () {
            if (this.userType !== 'agent') {
                this.$http.get(api.permissionsUser).then(data => {
                    this.permissions = data
                    // permissions must be loaded before we can handle other data
                    this.setUpAuth()
                    this.setUpRouterHooks()
                })
            } else {
                this.setUpAuth()
            }
        }
    },
    components: {
        pageStyle: require('../components/style.vue'),
        asideMenu: require('../components/nav.vue'),
        pageHeader: require('../components/header.vue')
    }
}
</script>
<style scoped lang="scss">
    .loading-layer {
        display: block;
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        background-color: rgba(0,0,0,0.3);
        .icon {
            border-radius: 5px;
            background: #fff;
            width: 100px;
            padding: 5px;
            margin: 30% auto;
            text-align: center;
        }
    }
    .floating-circles {
        position: relative;
        width: 86px;
        height: 86px;
        margin: auto;
        transform: scale(0.6);
    }

    .f-circle {
        position: absolute;
        background-color: rgb(255,255,255);
        height: 16px;
        width: 16px;
        border-radius: 12px;
        animation-name: fadeG;
        animation-duration: 1.2s;
        animation-iteration-count: infinite;
        animation-direction: normal;
    }

    .frotate-01 {
        left: 0;
        top: 35px;
        animation-delay: 0.05s;
    }

    .frotate-02 {
        left: 10px;
        top: 10px;
        animation-delay: 0.2s;
    }

    .frotate-03 {
        left: 35px;
        top: 0;
        animation-delay: 0.35s;
    }

    .frotate-04 {
        right: 10px;
        top: 10px;
        animation-delay: 0.5s;
    }

    .frotate-05 {
        right: 0;
        top: 35px;
        animation-delay: 0.65s;
    }

    .frotate-06 {
        right: 10px;
        bottom: 10px;
        animation-delay: 0.8s;
    }

    .frotate-07 {
        left: 35px;
        bottom: 0;
        animation-delay: 0.95s;
    }

    .frotate-08 {
        left: 10px;
        bottom: 10px;
        animation-delay: 1.2s;
    }

    @keyframes fadeG{
        0% {
            background-color:rgb(0,0,0);
        }

        100% {
            background-color:rgb(255,255,255);
        }
    }
    #content{
        margin-left: 7rem;
    }

    .fade-enter-active, .fade-leave-active{
    transition: opacity .3s
    }

    .fade-enter, .fade-leave-to{
    opacity: 0
    }
</style>
