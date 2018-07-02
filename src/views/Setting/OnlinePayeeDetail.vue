<template>
    <div>
        <div class="m-b">
            <ol class="breadcrumb">
                <li class="active"><router-link to="/online_payee">{{$t('title.online_payee_management')}}</router-link></li>
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
                        >{{$t('dic.create')}}
                        </router-link>
                        <router-link
                            class="md-btn md-flat m-r-sm"
                            :to="'/online_payee/' + id + '/edit'"
                            v-if="$root.permissions.includes('update_online_payee')"
                        >{{$t('dic.update')}}
                        </router-link>
                    </div>
                </div>
            </div>
            <div class="box-body">
                <div class="row m-b p-b b-b">
                    <div class="col-xs-7">
                        <span class="text-muted">{{$t('finance.merchant_info')}}</span>
                        <table class="table b-a m-t-sm">
                            <tbody>
                                <tr>
                                    <th class="grey-50" width="150">{{$t('dic.type')}}</th>
                                    <td>{{payment_gateway.name}}</td>
                                </tr>
                                <tr>
                                    <th class="grey-50" width="150">{{$t('misc.display_name')}}</th>
                                    <td>{{display_name}}</td>
                                </tr>
                                <tr>
                                    <th class="grey-50">{{$t('finance.payment_gateway')}}</th>
                                    <td>{{payment_gateway.name || $t('system.no_setting')}}</td>
                                </tr>
                                <tr>
                                    <th class="grey-50">{{$t('title.payment_type')}} - {{$t('dic.pc')}}</th>
                                    <td>{{filteredPaymentType(0) || $t('system.no_setting')}}</td>
                                </tr>
                                <tr>
                                    <th class="grey-50">{{$t('title.payment_type')}} - {{$t('dic.mobile')}}</th>
                                    <td>{{filteredPaymentType(1) || $t('system.no_setting')}}</td>
                                </tr>
                                <tr>
                                    <th class="grey-50">{{$t('finance.merchant_id')}}</th>
                                    <td>{{merchant_num}}</td>
                                </tr>
                                <tr>
                                    <th class="grey-50">{{$t('finance.certificate')}}</th>
                                    <td>{{certificate || $t('system.no_setting')}}</td>
                                </tr>
                                <tr>
                                    <th class="grey-50">{{$t('finance.public_key')}}</th>
                                    <td class="text-break-all" v-if="public_key" v-html="htmlTransform(public_key)"></td>
                                    <td v-else>{{$t('system.no_setting')}}</td>
                                </tr>
                                <tr>
                                    <th class="grey-50">{{$t('finance.private_key')}}</th>
                                    <td class="text-break-all" v-if="private_key" v-html="htmlTransform(private_key)"></td>
                                    <td v-else>{{$t('system.no_setting')}}</td>
                                </tr>
                                <tr>
                                    <th class="grey-50">{{$t('finance.merchant_public_key')}}</th>
                                    <td class="text-break-all" v-if="merchant_public_key" v-html="htmlTransform(merchant_public_key)"></td>
                                    <td v-else>{{$t('system.no_setting')}}</td>
                                </tr>
                                <tr>
                                    <th class="grey-50">{{$t('finance.merchant_private_key')}}</th>
                                    <td class="text-break-all" v-if="merchant_private_key" v-html="htmlTransform(merchant_private_key)"></td>
                                    <td v-else>{{$t('system.no_setting')}}</td>
                                </tr>
                                <tr>
                                    <th class="grey-50">{{$t('finance.board_url')}}</th>
                                    <td>{{board_url || $t('system.no_setting')}}</td>
                                </tr>
                                <tr>
                                    <th class="grey-50">{{$t('finance.payment_domain')}}</th>
                                    <td>{{domain_url || $t('system.no_setting')}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="row m-b p-b b-b">
                    <div class="col-xs-5">
                        <span class="text-muted">{{$t('finance.sum_fund')}}</span>
                        <div><span v-if="sum_fund">{{'￥' + sum_fund}}</span><span v-else>￥0</span></div>
                    </div>
                    <div class="col-xs-5">
                        <span class="text-muted">{{$t('finance.expired_in')}}</span>
                        <div>{{expired_in}}</div>
                    </div>
                </div>

                <div class="row m-b p-b b-b">
                    <div class="col-xs-5">
                        <span class="text-muted">{{$t('dic.status')}}</span>
                        <div>
                            <span class="label success" v-if="status==1">{{$t('status.active')}}</span>
                            <span class="label" v-else>{{$t('status.inactive')}}</span>
                        </div>
                    </div>
                    <div class="col-xs-5">
                        <span class="text-muted">{{$t('title.member_level')}}</span>
                        <div>
                            <router-link class="m-r-sm" :to="'/level/' + l.id" v-for="l in level" :key="l.id">
                            {{l.name}}
                            </router-link>
                        </div>
                    </div>
                </div>

                <div class="row" v-if="memo">
                    <div class="col-xs-5">
                        <span class="text-muted">{{$t('dic.memo')}}</span>
                        <div>{{memo}} </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { getMerchant } from '../../service'
    import $ from '../../utils/util'
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
                sum_fund: '',
                private_key: '',
                public_key: '',
                merchant_private_key: '',
                merchant_public_key: ''
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
                getMerchant('onlinePayee', {
                    id,
                    params: {
                        opt_expand: 1,
                        embed: 'payment_type'
                    }
                }).then(data => {
                    Object.keys(data).forEach(key => {
                        this[key] = data[key]
                    })
                })
            },
            'htmlTransform': $.htmlTransform,
            filteredPaymentType (platform) {
                return this.payment_type.filter(pt => pt.platform === platform).map(pt => pt.name).join(', ')
            }
        }
    }

</script>

<style>

</style>
