<template>
    <div>
        <div class="p-b inline m-r-sm" v-if="$root.permissions.includes('add_online_payee')" >
            <router-link tag="button" class="md-btn blue w-sm" to="/online_payee/add">{{$t('dic.create')}}</router-link>
        </div>
        <div class="inline">
            <label
                class="form-control-label p-b-0 p-t-0"
                :class="{'text-blue': status}"
            >{{ $t('dic.status') }}
            </label>
            <label class="sm-check m-r m-b-0">
                <input class="c-radio" type="radio" value="" v-model="status">
                <i class="blue m-r-xs"></i>
                {{ $t('system.show_all') }}
            </label>
            <label class="sm-check m-r m-b-0">
                <input class="c-radio" type="radio" value="1" v-model="status">
                <i class="blue m-r-xs"></i>
                <span class="label" :class="{'success': status === '1'}">{{ $t('status.active') }}</span>
            </label>
            <label class="sm-check m-r m-b-0">
                <input class="c-radio" type="radio" value="0" v-model="status">
                <i class="blue m-r-xs"></i>
                <span class="label" :class="{'danger': status === '0'}">{{ $t('status.disabled') }}</span>
            </label>
        </div>
        <div class="box">
            <table st-table="rowCollectionBasic" class="table table-striped">
                <thead>
                    <tr>
                    <th>{{$t('dic.name')}}</th>
                    <th>{{$t('finance.sum_fund')}}</th>
                    <th>{{$t('finance.expired_in')}}</th>
                    <th>{{$t('misc.display_name')}}</th>
                    <th class="text-center" width="13%">{{$t('dic.status')}}</th>
                    <th>{{$t('dic.member_level')}}</th>
                </tr>
                </thead>
                <tbody>
                    <tr v-for="payee in filteredOnlinePayee" :key="payee.id">
                        <td><router-link :to="'/online_payee/' + payee.id">{{payee.name}}</router-link></td>
                        <td>￥{{payee.sum_fund || 0}}</td>
                        <td>{{payee.expired_in}}</td>
                        <td>{{payee.display_name}}</td>
                        <td class="text-center">
                            <status-switch
                                :status="payee.status"
                                :loading="!!statusSwitchLoading[payee.id]"
                                :disabled="!updateOnlinepayeeStatusPermission"
                                :options="[$t('status.disabled'), '']"
                                @toggle="toggleStatus(payee)"
                            />
                        </td>
                        <td>
                            <router-link
                                v-for="l in payee.level"
                                :to="'/level/' + l.id"
                                :key="l.id"
                                class="m-r-sm"
                            >{{l.name}}
                            </router-link>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
import StatusSwitch from '../../components/StatusSwitch.vue'
import { getMerchant, updateMerchant } from '../../service'
export default {
    data () {
        return {
            status: this.$route.query.status || '',
            onlinePayee: [],
            statusSwitchLoading: {}
        }
    },
    created () {
        getMerchant('onlinePayee', {
            params: {
                opt_expand: 1
            }
        }).then(data => {
            this.onlinePayee = data.sort((a, b) => a.id - b.id)
        })
    },
    watch: {
        '$route.query.status' (newStatus) {
            this.status = newStatus || ''
        },
        status (newStatus) {
            this.$router.push({
                path: '/online_payee',
                query: {
                    ...(newStatus && { status: newStatus })
                }
            })
        }
    },
    computed: {
        updateOnlinepayeeStatusPermission () {
            return this.$root.permissions.includes('update_onlinepayee_status')
        },
        filteredOnlinePayee () {
            return this.onlinePayee.filter(p => !this.status || parseInt(p.status) === parseInt(this.status))
        }
    },
    methods: {
        toggleStatus (payee) {
            this.$set(this.statusSwitchLoading, payee.id, true)
            updateMerchant('onlinePayee', {
                id: payee.id,
                data: {
                    status: payee.status ^ 1
                }
            }, {
                action: this.$t('dic.update'),
                object: this.$t('dic.status')
            }).then(({ status }) => {
                payee.status = status
            }).finally(() => {
                this.$delete(this.statusSwitchLoading, payee.id)
            })
        }
    },
    components: {
        StatusSwitch
    }
}
</script>
