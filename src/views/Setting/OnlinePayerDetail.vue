<template>
    <div>
        <div class="m-b">
            <ol class="breadcrumb">
                <li class="active"><router-link to="/online_payer">{{$t('title.online_payer_management')}}</router-link></li>
                <li class="active">{{$route.meta.title}}</li>
            </ol>
        </div>
        <div class="box">
            <div class="box-header b-b p-b-sm">
                <div class="row">
                    <div class="col-md-4">
                        <h2 class="v-m m-t-sm">{{name}} </h2>
                    </div>
                    <div class="col-md-5 col-md-offset-3 text-right">
                        <router-link
                            class="md-btn md-flat m-r-sm"
                            to="/online_payer/add"
                        >{{$t('dic.create')}}
                        </router-link>
                        <router-link
                            class="md-btn md-flat m-r-sm"
                            :to="`/online_payer/${id}/edit`"
                        >{{$t('dic.update')}}
                        </router-link>
                    </div>
                </div>
            </div>
            <div class="box-body">
                <div class="row m-b">
                    <div class="col-xs-7">
                        <span class="text-muted">{{$t('finance.merchant_info')}}</span>
                        <table class="table b-a m-t-sm">
                            <tbody>
                                <tr>
                                    <th class="grey-50" width="200">{{$t('finance.withdraw_gateway')}}</th>
                                    <td>{{withdraw_gateway.name || '-'}}</td>
                                </tr>
                                <tr>
                                    <th class="grey-50">{{$t('finance.merchant_id')}}</th>
                                    <td>{{merchant_num || '-'}}</td>
                                </tr>
                                <tr>
                                    <th class="grey-50">{{$t('finance.certificate')}}</th>
                                    <td>{{certificate || '-'}}</td>
                                </tr>
                                <tr>
                                    <th class="grey-50">{{$t('finance.public_key')}}</th>
                                    <td class="text-break-all" v-if="public_key" v-html="htmlTransform(public_key)"></td>
                                    <td v-else>{{$t('system.no_setting')}}</td>
                                </tr>
                                <tr>
                                    <th class="grey-50">{{$t('finance.public_key')}}</th>
                                    <td class="text-break-all" v-if="private_key" v-html="htmlTransform(private_key)"></td>
                                    <td v-else>{{$t('system.no_setting')}}</td>
                                </tr>
                                <tr>
                                    <th class="grey-50">{{$t('finance.board_url')}}</th>
                                    <td>{{board_url || '-'}}</td>
                                </tr>
                                <tr>
                                    <th class="grey-50">{{$t('finance.sum_fund')}}</th>
                                    <td>{{sum_fund || 0 | currency('￥')}}</td>
                                </tr>
                                <tr>
                                    <th class="grey-50">{{$t('dic.status')}}</th>
                                    <td>
                                        <span class="label success" v-if="status">{{$t('status.active')}}</span>
                                        <span class="label" v-else>{{$t('status.inactive')}}</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
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
                id: '',
                name: '',
                withdraw_gateway: '',
                merchant_num: '',
                certificate: '',
                private_key: '',
                public_key: '',
                board_url: '',
                status: '',
                sum_fund: ''
            }
        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                let id = to.params.online_payerId
                if (id) {
                    vm.getPayer(id)
                }
            })
        },
        methods: {
            getPayer (id) {
                getMerchant('onlinePayer', { id }).then(data => {
                    for (let key in data) {
                        this[key] = data[key]
                    }
                })
            },
            'htmlTransform': $.htmlTransform
        }
    }
</script>
