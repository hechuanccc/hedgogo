<template>
    <div>
        <div class="m-b">
            <ol class="breadcrumb">
                <li class="active"><router-link to="/remit_payee">{{$t('title.remit_payee')}}</router-link></li>
                <li class="active">{{$route.meta.title}}</li>
            </ol>
        </div>
        <div class="box">
            <div class="box-header b-b">
                <div class="row">
                    <div class="col-md-4">
                        <h2 class="v-m m-t-sm">
                            <span v-if="remit_payee.remit_type === 1">{{remit_payee.bank && remit_payee.bank.name}} {{remit_payee.payee_name}}</span>
                            <span v-else>{{remit_payee.nickname}}</span>
                        </h2>
                    </div>
                    <div class="col-md-5 col-md-offset-3 text-right">
                        <router-link
                            class="md-btn md-flat m-r-sm"
                            :to="'/remit_payee/' + remit_payee.id + '/edit'"
                            v-if="$root.permissions.includes('update_remit_account')"
                        >{{$t('dic.update')}}
                        </router-link>
                        <a
                            class="md-btn md-flat m-r-sm"
                            @click="deletePayee(remit_payee.id, true, $event)"
                            v-if="$root.permissions.includes('delete_remit_account')"
                        >{{$t('dic.delete')}}
                        </a>
                    </div>
                </div>
                <div class="alert alert-danger" v-if="showDeleteError">{{$t('system_msg.remit_payee_delete_error')}}</div>
            </div>
            <div class="box-body">
                <div class="row m-b p-b b-b">
                    <div class="col-xs-5">
                        <span class="text-muted">{{$t('title.basic_info')}}</span>
                        <table class="table b-a m-t-sm">
                            <tbody v-if="remit_payee.remit_type === 1">
                            <tr>
                                <th class="grey-50" width="200">{{$t('dic.bank')}}</th>
                                <td v-if="remit_payee.bank">{{remit_payee.bank.name}}</td>
                                <td v-else>-</td>
                            </tr>
                            <tr>
                                <th class="grey-50">{{$t('dic.name')}}</th>
                                <td>{{remit_payee.payee_name || '-'}}</td>
                            </tr>
                            <tr>
                                <th class="grey-50">{{$t('bank.address')}}</th>
                                <td>{{remit_payee.address || '-'}}</td>
                            </tr>
                            <tr>
                                <th class="grey-50">{{$t('bank.account')}}</th>
                                <td>{{remit_payee.account || '-'}}</td>
                            </tr>
                            <tr>
                                <th class="grey-50">{{$t('finance.dashboard_memo')}}</th>
                                <td>{{remit_payee.memo || '-'}}</td>
                            </tr>
                            <tr>
                                <th class="grey-50">{{$t('finance.client_memo')}}</th>
                                <td>{{remit_payee.client_description || '-'}}</td>
                            </tr>
                            </tbody>
                            <tbody v-else>
                            <tr>
                                <th class="grey-50" width="200">{{$t('user.username')}}</th>
                                <td>{{remit_payee.nickname || '-'}}</td>
                            </tr>
                            <tr>
                                <th class="grey-50" width="200">{{$t('misc.qr_code')}}</th>
                                <td>
                                    <img :src="remit_payee.qr_code" class="qr-code">
                                </td>
                            </tr>
                            <tr>
                                <th class="grey-50">{{$t('dic.memo')}}</th>
                                <td>{{remit_payee.memo || '-'}}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="row m-b p-b b-b">
                    <div class="col-xs-5">
                        <span class="text-muted">{{$t('finance.sum_fund')}}</span>
                        <div><span v-if="remit_payee.sum_fund">{{remit_payee.sum_fund | currency('￥') }}</span><span v-else>￥0</span></div>
                    </div>
                    <div class="col-xs-5">
                    </div>
                </div>
                <div class="row p-t">
                    <div class="col-xs-5">
                        <span class="text-muted">{{$t('dic.status')}}</span>
                        <div>
                            <span class="label success" v-if="remit_payee.status==1">{{$t('status.active')}}</span>
                            <span class="label" v-else>{{$t('status.inactive')}}</span>
                        </div>
                    </div>
                    <div class="col-xs-5">
                        <span class="text-muted">{{$t('title.member_level')}}</span>
                        <div>
                            <router-link class="m-r-sm" :to="'/level/' + l.id" v-for="l in remit_payee.level" :key="l.id">
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
    import { getMerchant, deleteMerchant } from '../../service'
    export default {
        data () {
            return {
                remit_payee: [],
                isActive: false,
                showDeleteError: false,
                errorMsg: ''
            }
        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                let id = to.params.payeeId
                id && vm.getPayee(id)
            })
        },
        methods: {
            getPayee (id) {
                getMerchant('remitPayee', {
                    id,
                    params: {
                        opt_expand: 1
                    }
                }).then(data => {
                    this.remit_payee = data
                })
            },
            deletePayee (id, confirm, event) {
                if (confirm) {
                    if (!window.confirm(this.$t('system_msg.confirm_action_object', {
                        action: event.target.innerText
                    }))) {
                        return
                    }
                }
                if (!this.isActive) {
                    deleteMerchant('remitPayee', id).then(() => {
                        this.$router.push('/remit_payee')
                    })
                } else {
                    this.showDeleteError = true
                }
            }
        }
    }
</script>
<style>
    .qr-code {
        max-width: 120px;
    }
</style>
