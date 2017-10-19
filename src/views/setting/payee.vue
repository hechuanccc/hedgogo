<template>
    <div>
        <div class="p-b m-b" v-if="$root.permissions.includes('change_remitpayee')">
            <router-link tag="button" class="md-btn blue" to="/remit_payee/add">{{$t('action.add_remit_payee')}}</router-link>
        </div>
        <div class="box">
            <table st-table="rowCollectionBasic" class="table table-striped b-t">
                <thead>
                    <tr>
                    <th>{{$t('common.number')}}</th>
                    <th>{{$t('common.real_name')}}</th>
                    <th>{{$t('bank.name')}}</th>
                    <th>{{$t('bank.account')}}</th>
                    <th>{{$t('setting.sum_fund')}}</th>
                    <th>{{$t('member.level')}}</th>
                    <th>{{$t('common.status')}}</th>
                </tr>
                </thead>
                <tbody>
                    <tr v-for="payee in payees" >
                        <td>{{payee.id}}</td>
                        <td><router-link :to="'/remit_payee/' + payee.id">{{payee.payee_name || payee.nickname}}</router-link></td>
                        <td>
                            <span v-if="payee.bank !== null">{{payee.bank.name}}</span>
                            <span v-else>-</span>
                        </td>
                        <td>
                            <span v-if="payee.account !== null">{{payee.account}}</span>
                            <span v-else>-</span>
                        </td>
                        <td>
                            <span v-if="payee.sum_fund !== null">{{payee.sum_fund}}</span>
                            <span v-else>-</span>
                        </td>
                        <td><router-link class="m-r" v-for="l in payee.level" :to="'/level/' + l.id">{{l.name}}</router-link></td>
                        <td>
                            <span class="label success m-r" v-if="payee.status==1" @click="toggleStatus(payee)">{{$t('status.active')}}</span>
                            <span class="label danger m-r" v-if="payee.status==0" @click="toggleStatus(payee)">{{$t('status.disabled')}}</span>
                            <template v-if="$root.permissions.includes('change_remitpayee')">
                                <a @click="toggleStatus(payee)" v-if="payee.status==1">{{$t('setting.disable')}}</a>
                                <a @click="toggleStatus(payee)" v-else>{{$t('setting.enable')}}</a>
                            </template>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import api from '../../api'
export default {
    data () {
        return {
            'payees': []
        }
    },
    created () {
        this.getPayees()
    },
    methods: {
        toggleStatus (payee) {
            this.$http.put(api.remitpayee + payee.id + '/', {
                'status': payee.status === 0 ? 1 : 0
            }).then((response) => {
                payee.status = response.data.status
            })
        },
        getPayees () {
            this.$http.get(api.remitpayee + '?opt_expand=1').then((response) => {
                this.payees = response.data
            })
        }
    }
}
</script>
