<template>
    <div>
        <div class="p-b" v-if="$root.permissions.includes('add_online_payee')" >
            <router-link tag="button" class="md-btn blue" to="/online_payee/add">{{$t('setting.create_online_payee')}}</router-link>
        </div>
        <div class="box">
            <table st-table="rowCollectionBasic" class="table table-striped">
                <thead>
                    <tr>
                    <th>{{$t('common.name')}}</th>
                    <th>{{$t('setting.sum_fund')}}</th>
                    <th>{{$t('setting.expired_in')}}</th>
                    <th>{{$t('setting.display_name')}}</th>
                    <th>{{$t('common.status')}}</th>
                    <th>{{$t('member.level')}}</th>
                </tr>
                </thead>
                <tbody>
                    <tr v-for="payee in online_payees" >
                        <td><router-link :to="'/online_payee/' + payee.id">{{payee.name}}</router-link></td>
                        <td>￥{{payee.sum_fund || 0}}</td>
                        <td>{{payee.expired_in}}</td>
                        <td>{{payee.display_name}}</td>
                        <td>
                            <span class="label success m-r" v-if="payee.status==1">{{$t('status.active')}}</span>
                            <span class="label danger m-r" v-else>{{$t('status.disabled')}}</span>
                            <template v-if="$root.permissions.includes('update_onlinepayee_status')">
                                <a @click="toggleStatus(payee)" v-if="payee.status==1">{{$t('status.disabled')}}</a>
                                <a @click="toggleStatus(payee)" v-else>{{$t('status.active')}}</a>
                            </template>
                        </td>
                        <td>
                            <router-link v-for="l in payee.level" :to="'/level/' + l.id" class="m-r-sm">{{l.name}}</router-link>
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
            'online_payees': []
        }
    },
    created () {
        this.getPayees()
    },
    methods: {
        toggleStatus (payee) {
            this.$http.put(api.onlinepayee + payee.id + '/', {
                'status': payee.status === 0 ? 1 : 0
            }).then(data => {
                payee.status = data.status
            })
        },
        getPayees () {
            this.$http.get(api.onlinepayee + '?opt_expand=1').then(data => {
                this.online_payees = data.sort((a, b) => a.id - b.id)
            })
        }
    }
}
</script>
