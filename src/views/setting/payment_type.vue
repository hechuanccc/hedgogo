<template>

    <div class="box p-a">
        <div class="b-b nav-active-blue">
            <ul class="nav nav-tabs">
                <li class="nav-item">
                    <a
                    class="nav-link"
                    :class="{ 'active': type === 0 }"
                    @click="type = 0"
                    ><b>{{$t('manage.pc')}}</b>
                    </a>
                </li>
                <li class="nav-item">
                    <a
                    class="nav-link"
                    :class="{ 'active': type === 1 }"
                    @click="type = 1"
                    ><b>{{$t('manage.mobile')}}</b>
                    </a>
                </li>
            </ul>
        </div>
        <table st-table="rowCollectionBasic" class="table table-striped">
            <thead>
                <tr>
                <th>{{$t('setting.display_name')}}</th>
                <th>{{$t('setting.payee')}}</th>
                <th>{{$t('common.status')}}</th>
            </tr>
            </thead>
            <tbody>
                <tr v-for="paymentType in filerPaymentType" :key="paymentType.id">
                    <td v-if="$root.permissions.includes('update_onlinepayment')">
                        <router-link :to="'/paymenttype/' + paymentType.id + '/edit'">
                            {{paymentType.display_name}}
                        </router-link>
                    </td>
                    <td v-if="paymentType.detail.length">
                        <span v-for="payee in paymentType.detail" :key="payee.id">
                            {{payee.name}}
                        </span> 
                    </td>
                    <td v-else>-</td>
                    <td>
                        <span class="label success m-r" v-if="paymentType.status==1">{{$t('status.active')}}</span>
                        <span class="label danger m-r" v-else>{{$t('status.disabled')}}</span>
                        <template v-if="$root.permissions.includes('update_onlinepayment_status')">
                            <a @click="toggleStatus(paymentType)" v-if="paymentType.status==1">{{$t('status.disabled')}}</a>
                            <a @click="toggleStatus(paymentType)" v-else>{{$t('status.active')}}</a>
                        </template>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
import api from '../../api'
export default {
    data () {
        return {
            paymentTypes: [],
            type: 0
        }
    },
    created () {
        this.getPaymentType()
    },
    computed: {
        filerPaymentType () {
            return this.paymentTypes
            .filter(element => element.platform === 2 || element.platform === this.type)
            .sort((a, b) => a.id - b.id)
        }
    },
    methods: {
        toggleStatus (paymentType) {
            this.$http.put(api.paymenttype + paymentType.id + '/', {
                'status': paymentType.status === 0 ? 1 : 0
            }).then(data => {
                paymentType.status = data.status
            })
        },
        getPaymentType () {
            this.$http.get(`${api.paymenttype}?opt_expand=1`).then(data => {
                this.paymentTypes = data
                this.paymentTypes.forEach(paymentType => {
                    paymentType.detail = paymentType.detail.filter(payee => payee.activate)
                })
            })
        }
    }
}
</script>
