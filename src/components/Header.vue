<template>
    <div class="app-header white box-shadow" v-if="showNav">
        <div class="navbar">
            <div class="navbar-item pull-left h5 ng-binding" id="pageTitle">{{$route.meta.title}}</div>

            <div class="dropdown pull-right my">
                <button class="btn white btn-sm dropdown-toggle" @click="$root.dropdown=!$root.dropdown">
                    <span class="dropdown-label">{{$root.username}}</span>
                    <span class="caret"></span>
                </button>
                <div class="dropdown-menu text-left text-sm" v-show="$root.dropdown">
                    <router-link  class="dropdown-item" to="/change_password/">{{$t('nav.change_password')}}</router-link>
                    <a class="dropdown-item" @click="logoutHandler">{{$t('action.logout')}}</a>
                </div>
            </div>
            <div class="collapse navbar-toggleable-sm" id="collapse">
                <div class="navbar-form form-inline pull-right pull-none-sm navbar-item v-m">
                    <input-member-search/>
                </div>
            </div>

            <div class="navbar-nav pull-right m-r">
                <ul class="nav navbar-nav pull-left prompt">
                    <router-link tag="li" class="nav-item dropdown pos-stc-xs pointer"  :to="'/game_history'" >
                        <a class="nav-link" >
                            <label class="pointer label">{{$t('game_history.abnormal_period')}}</label>
                            <span v-if="abnormal_count" class="label label-sm up warn">{{abnormal_count}}</span>
                            <span v-else class="label label-sm up ">{{abnormal_count}}</span>
                        </a>
                    </router-link>
                    <li class="nav-item dropdown pos-stc-xs pointer" >
                        <router-link
                            class="nav-link"
                            :to="'/bill/remit?status=' + status"
                            v-if="$root.permissions.includes('view_remit_transaction_page')"
                        >
                            <label class="label pointer">{{$t('header.deposit')}}</label>
                            <span v-if="remit_count" class="label label-sm up warn">{{remit_count}}</span>
                            <span v-else class="label label-sm up">{{remit_count}} </span>
                        </router-link>
                        <div class="nav-link disabled" v-else>
                            <label class="label">{{$t('header.deposit')}}</label>
                            <span v-if="remit_count" class="label label-sm up warn">{{remit_count}}</span>
                            <span v-else class="label label-sm up">{{remit_count}} </span>
                        </div>
                    </li>
                    <li class="nav-item dropdown pos-stc-xs pointer" >
                        <router-link
                            class="nav-link"
                            :to="'/bill/withdraw?status=' + status"
                            v-if="$root.permissions.includes('view_withdraw_application_page')"
                        >
                            <label class="label pointer">{{$t('header.withdraw')}}</label>
                            <span v-if="withdraw_count" class="label label-sm up warn">{{withdraw_count}}</span>
                            <span v-else class="label label-sm up">{{withdraw_count}} </span>
                        </router-link>
                        <div class="nav-link disabled" v-else>
                            <label class="label">{{$t('header.withdraw')}}</label>
                            <span v-if="withdraw_count" class="label label-sm up warn">{{withdraw_count}}</span>
                            <span v-else class="label label-sm up">{{withdraw_count}} </span>
                        </div>
                    </li>
                    <li class="nav-item dropdown pos-stc-xs pointer" >
                        <router-link class="nav-link" to="/online_member">
                            <label class=" label pointer" >{{$t('common.onlinemembers')}}</label>
                            <span v-if="online_member" class="label label-sm up warn">{{online_member}} </span>
                            <span v-else class="label label-sm up">{{online_member}} </span>
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
    import { logout, getSystemCount } from '../service'
    import VueCookie from 'vue-cookie'
    import INotify from 'title-notify'
    import axios from 'axios'
    import InputMemberSearch from './InputMemberSearch'

    export default {
        data () {
            return {
                query: {
                    username_q: ''
                },
                status: '3',
                members_count: '',
                iNotify: '',
                oldTitle: '',
                online_member: '',
                num: 0,
                remit_count: '',
                withdraw_count: '',
                abnormal_count: ''
            }
        },
        props: {
            showNav: {
                default: true
            }
        },
        created () {
            this.getCount()
            setInterval(this.getCount, 5000)
        },
        computed: {
            count: function () {
                return this.remit_count + this.withdraw_count
            }
        },
        watch: {
            count (newObj, old) {
                let vm = this
                if (newObj) {
                    if (!vm.iNotify) {
                        vm.createINotify()
                    }
                    setTimeout(function () {
                        vm.iNotify.setFavicon(newObj)
                    }, 200)
                }
                if (!newObj && vm.iNotify) {
                    vm.iNotify.setTitle().title = vm.oldTitle
                    vm.iNotify.setTitle()
                    vm.iNotify.faviconClear()
                }
            },
            abnormal_count (newObj, old) {
                if (this.iNotify) {
                    if (newObj > old) {
                        if (old) {
                            this.$root.$data.abnormal_count = this.abnormal_count
                        }
                        this.message(newObj, 'abnormal')
                        this.iNotify.player()
                    } else if (old !== '') {
                        this.iNotify.setFavicon(newObj)
                    }
                }
            },
            remit_count (newObj, old) {
                if (this.iNotify) {
                    if (newObj > old) {
                        if (old) {
                            this.$root.$data.remit_count = this.remit_count
                        }
                        if (this.$root.permissions.includes('view_remit_transaction_page')) {
                            this.message(newObj, 'remit')
                            this.iNotify.player()
                        }
                    } else if (old !== '') {
                        this.iNotify.setFavicon(newObj)
                    }
                }
            },
            withdraw_count (newObj, old) {
                if (this.iNotify) {
                    if (newObj > old) {
                        if (old) {
                            this.$root.$data.withdraw_count = this.withdraw_count
                        }
                        if (this.$root.permissions.includes('view_withdraw_application_page')) {
                            this.message(newObj, 'withdraw')
                            this.iNotify.player()
                        }
                    } else if (old !== '') {
                        this.iNotify.setFavicon(newObj)
                    }
                }
            }
        },
        methods: {
            createINotify () {
                this.iNotify = new INotify().init({
                    effect: 'flash',
                    interval: 1800,
                    message: '有消息拉！',
                    updateFavicon: {
                    // favicon 字体颜色
                        textColor: '#fff',
                        // 背景颜色，设置背景颜色透明，将值设置为“transparent”
                        backgroundColor: '#ff0000'
                    },
                    audio: {
                        file: 'audio/system.wav' // 可以使用数组传多种格式的声音文件
                    }
                })
                this.iNotify.setTitle(true)
            },
            logoutHandler () {
                logout().then(data => {
                    this.$root.dropdown = false
                    this.loading = true
                    this.$router.push('/login')
                    this.$cookie.delete('access_token')
                    this.$cookie.delete('refresh_token')
                }, error => {
                    this.loading = false
                    this.errorMsg = error
                })
            },
            message (num, messageType) {
                let vm = this
                let url = ''
                let title = ''
                if (messageType === 'remit') {
                    url = '/bill/remit?status=' + vm.status
                    title = '转帐充值通知'
                } else if (messageType === 'withdraw') {
                    url = '/bill/withdraw?status=' + vm.status
                    title = '取款通知'
                } else if (messageType === 'abnormal') {
                    url = '/game_history' + vm.status
                    title = this.$t('game_history.abnormal_period') + this.$t('action.inform')
                }
                let titleD = vm.iNotify.setTitle()
                this.oldTitle = titleD.title
                vm.iNotify.setTitle('有消息啦！' + title)
                titleD.title = '...'
                this.iNotify.setFavicon(num)
                vm.iNotify.notify({
                    title: title,
                    body: '您有信息待处理',
                    onclick: function () {
                        vm.$router.push(url)
                    }
                })
            },
            getCount () {
                if (this.$route.name !== 'login') {
                    let authenticationCookie = axios.defaults.headers.common['Authorization']
                    if (authenticationCookie) {
                        authenticationCookie = authenticationCookie.split(' ').pop()
                    }

                    let userCookie = VueCookie.get('access_token')
                    if (authenticationCookie === userCookie) {
                        getSystemCount().then(data => {
                            if (data) {
                                this.remit_count = data.remit_count
                                this.withdraw_count = data.withdraw_count
                                this.online_member = data.online_member
                                this.abnormal_count = data.abnormal_count
                            }
                        })
                    } else {
                        this.$root.toLoginPage()
                    }
                } else if (this.iNotify) {
                    this.iNotify.faviconClear()
                    this.iNotify.setTitle().title = this.oldTitle
                    this.iNotify.setTitle()
                }
            }
        },
        filters: {
            limit: function (arr, limit) {
                return arr.slice(0, Number(limit))
            }
        },
        components: {
            InputMemberSearch
        }
    }
</script>
<style scoped lang="scss">
    .dropdown-menu {
        display: block;
    }
    .my {
        margin: 12px 0;
    }
    .close {
        display: flex;
        justify-content: flex-end;
        padding: 5px 8px;
    }
    .prompt label.label{
        font-size: 13px;
        padding: 6px 8px;
    }
</style>
