<template>
    <div>
        <div class="m-b">
            <ol class="breadcrumb">
                <li class="active"><router-link to="/online_payee">{{$t('nav.setting_online_payee')}}</router-link></li>
                <li class="active">{{$route.meta.title}}</li>
            </ol>
        </div>
        <div class="box">
            <div class="box-header b-b">
                <div class="row">
                    <div class="col-md-4">
                        <h2 class="v-m m-t-sm">{{name}} </h2>
                    </div>
                    <div class="col-md-5 col-md-offset-3 text-right">
                        <router-link
                            class="md-btn md-flat m-r-sm"
                            to="/online_payee/add"
                            v-if="$root.permissions.includes('add_online_payee')"
                        >{{$t('action.create')}}
                        </router-link>
                        <router-link
                            class="md-btn md-flat m-r-sm"
                            :to="'/online_payee/' + id + '/edit'"
                            v-if="$root.permissions.includes('update_online_payee')"
                        >{{$t('action.update')}}
                        </router-link>
                    </div>
                </div>
            </div>
            <div class="box-body">
                <div class="row m-b p-b b-b">
                    <div class="col-xs-5">
                        <span class="text-muted">{{$t('setting.merchant_info')}}</span>
                        <table class="table b-a m-t-sm">
                            <tbody>
                                <tr>
                                    <th class="grey-50" width="200">{{$t('setting.type')}}</th>
                                    <td>{{payment_gateway.name}}</td>
                                </tr>
                                <tr>
                                    <th class="grey-50" width="200">{{$t('setting.display_name')}}</th>
                                    <td>{{display_name}}</td>
                                </tr>
                                <tr>
                                    <th class="grey-50">{{$t('setting.merchant_num')}}</th>
                                    <td>{{merchant_num}}</td>
                                </tr>
                                <tr>
                                    <th class="grey-50">{{$t('setting.certificate')}}</th>
                                    <td>{{certificate || $t('action.no_setting')}}</td>
                                </tr>
                                <tr>
                                    <th class="grey-50">{{$t('setting.board_url')}}</th>
                                    <td>{{board_url || $t('action.no_setting')}}</td>
                                </tr>
                                <tr>
                                    <th class="grey-50">{{$t('setting.payment_domain')}}</th>
                                    <td>{{domain_url || $t('action.no_setting')}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="row m-b p-b b-b">
                    <div class="col-xs-5">
                        <span class="text-muted">{{$t('setting.sum_fund')}}</span>
                        <div><span v-if="sum_fund">{{'￥' + sum_fund}}</span><span v-else>￥0</span></div>
                    </div>
                    <div class="col-xs-5">
                        <span class="text-muted">{{$t('setting.expired_in')}}</span>
                        <div>{{expired_in}}</div>
                    </div>
                </div>

                <div class="row m-b p-b b-b">
                    <div class="col-xs-5">
                        <span class="text-muted">{{$t('common.status')}}</span>
                        <div>
                            <span class="label success" v-if="status==1">{{$t('status.active')}}</span>
                            <span class="label" v-else>{{$t('status.inactive')}}</span>
                        </div>
                    </div>
                    <div class="col-xs-5">
                        <span class="text-muted">{{$t('nav.setting_level')}}</span>
                        <div>
                            <router-link class="m-r-sm" :to="'/level/' + l.id" v-for="l in level">
                            {{l.name}}
                            </router-link>
                        </div>
                    </div>
                </div>

                <div class="row p-t" v-if="memo">
                    <div class="col-xs-5">
                        <span class="text-muted">{{$t('common.memo')}}</span>
                        <div>{{memo}} </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import api from '../../api'
    export default {
        data () {
            return {
                board_url: '',
                certificate: '',
                check_url: '',
                display_name: '',
                domain_url: '',
                expired_in: '',
                id: '',
                level: [{
                    id: '',
                    name: ''
                }],
                memo: '',
                merchant_account: '',
                merchant_num: '',
                name: '',
                payment_gateway: {
                    id: '',
                    name: ''
                },
                payment_type: [],
                status: '',
                sum_fund: ''
            }
        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                let id = to.params.online_payeeId
                if (id) {
                    vm.getPayee(id)
                }
            })
        },
        methods: {
            getPayee (id) {
                this.$http.get(api.onlinepayee + id + '/?opt_expand=1').then(data => {
                    let keys = Object.keys(data)
                    for (let i = 0; i < keys.length; i++) {
                        this[keys[i]] = data[keys[i]]
                    }
                })
            }
        }
    }

</script>

<style>

</style>
