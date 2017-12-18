<template>
    <div>
        <div class="m-b">
            <ol class="breadcrumb">
                <li class="active"><router-link to="/remit_payee">{{$t('nav.setting_remit_payee')}}</router-link></li>
                <li class="active">{{$route.meta.title}}</li>
            </ol>
        </div>
        <div class="box">
            <div class="box-header b-b">
                <div class="row">
                    <div class="col-md-4">
                        <h2 class="v-m m-t-sm">
                            <span v-if="remit_payee.remit_type === 1">{{remit_payee.bank.name}} {{remit_payee.payee_name}}</span>
                            <span v-else>{{remit_payee.nickname}}</span>
                        </h2>
                    </div>
                    <div class="col-md-5 col-md-offset-3 text-right" v-if="$root.permissions.includes('change_remitpayee')" >
                        <router-link class="md-btn md-flat m-r-sm" to="/remit_payee/">{{$t('action.view_remit_payees')}}</router-link>
                        <router-link class="md-btn md-flat m-r-sm" :to="'/remit_payee/' + remit_payee.id + '/edit'">{{$t('action.update_remit_payee')}}</router-link>
                        <a class="md-btn md-flat m-r-sm" @click="deletePayee(remit_payee.id, true, $event)">{{$t('action.delete')}}</a>
                    </div>
                </div>
                <div class="alert alert-danger" v-if="showDeleteError">{{$t('common.activeremit')}}</div>
            </div>
            <div class="box-body">
                <div class="row m-b p-b b-b">
                    <div class="col-xs-5">
                        <span class="text-muted">{{$t('common.basic_info')}}</span>
                        <table class="table b-a m-t-sm">
                            <tbody v-if="remit_payee.remit_type === 1">
                            <tr>
                                <th class="grey-50" width="200">{{$t('bank.name')}}</th>
                                <td>{{remit_payee.bank.name}}</td>
                            </tr>
                            <tr>
                                <th class="grey-50">{{$t('common.name')}}</th>
                                <td>{{remit_payee.payee_name}}</td>
                            </tr>
                            <tr>
                                <th class="grey-50">{{$t('bank.address')}}</th>
                                <td>{{remit_payee.address}}</td>
                            </tr>
                            <tr>
                                <th class="grey-50">{{$t('bank.account')}}</th>
                                <td>{{remit_payee.account}}</td>
                            </tr>
                            <tr>
                                <th class="grey-50">{{$t('common.memo')}}</th>
                                <td>{{remit_payee.memo}}</td>
                            </tr>
                            </tbody>
                            <tbody v-else>
                            <tr>
                                <th class="grey-50" width="200">{{$t('common.username')}}</th>
                                <td>{{remit_payee.nickname}}</td>
                            </tr>
                            <tr>
                                <th class="grey-50" width="200">{{$t('common.qr_code')}}</th>
                                <td>
                                    <img :src="remit_payee.qr_code" class="qr-code">
                                </td>
                            </tr>
                            <tr>
                                <th class="grey-50">{{$t('common.memo')}}</th>
                                <td>{{remit_payee.memo}}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="row m-b p-b b-b">
                    <div class="col-xs-5">
                        <span class="text-muted">{{$t('setting.sum_fund')}}</span>
                        <div><span v-if="remit_payee.sum_fund">{{remit_payee.sum_fund | currency('￥') }}</span><span v-else>￥0</span></div>
                    </div>
                    <div class="col-xs-5">
                    </div>
                </div>
                <div class="row p-t">
                    <div class="col-xs-5">
                        <span class="text-muted">{{$t('common.status')}}</span>
                        <div>
                            <span class="label success" v-if="remit_payee.status==1">{{$t('status.active')}}</span>
                            <span class="label" v-else>{{$t('status.inactive')}}</span>
                        </div>
                    </div>
                    <div class="col-xs-5">
                        <span class="text-muted">{{$t('nav.setting_level')}}</span>
                        <div>
                            <router-link class="m-r-sm" :to="'/level/' + l.id" v-for="l in remit_payee.level">
                                {{l.name}}
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row" v-if="errorMsg">
            <div class="col-xs-3">
                <div class="alert alert-danger">
                    {{errorMsg}}
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
                remit_payee: [],
                names: [],
                isActive: false,
                showDeleteError: false,
                errorMsg: ''
            }
        },
        // route: {
        //     data (transition) {
        //         let id = transition.to.params.payeeId
        //         this.getPayee(id)
        //         this.remitTransactions()
        //     }
        // },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                let id = to.params.payeeId
                if (id) {
                    vm.getPayee(id)
                }
            })
        },
        created () {
            this.remitTransactions()
        },
        methods: {
            getPayee (id) {
                this.$http.get(api.remitpayee + id + '/?opt_expand=1').then(data => {
                    this.remit_payee = data
                })
            },
            deletePayee (id, confirm, event) {
                if (confirm) {
                    if (!window.confirm(this.$t('common.confirm', {
                        action: event.target.innerText
                    }))) {
                        return
                    }
                }
                if (!this.isActive) {
                    this.$http.delete(api.remitpayee + id + '/').then(() => {
                        this.$router.push('/remit_payee')
                    })
                } else {
                    this.showDeleteError = true
                }
            },
            remitTransactions () {
                this.$http.get(api.bill + '?transaction_type=remit').then(data => {
                    for (let i = 0; i < data.length; i++) {
                        this.names.push(data[i].remit_info.remit_payee.payee_name)
                    }
                    if (this.names.indexOf(this.remit_payee.payee_name) !== -1) {
                        this.isActive = true
                    }
                }, error => {
                    this.errorMsg = error
                })
            }
        }
    }
</script>
<style>
    .qr-code {
        max-width: 120px;
    }
</style>
