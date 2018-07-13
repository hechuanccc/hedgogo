<template>
<div>
    <div class="row m-r-sm m-l-sm" v-if="$root.permissions.includes('update_onlinepayment')">
        <div class="pull-left" v-show="mode">
            <label
                class="form-control-label p-b-0"
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
        <div class="pull-right">
            <button class="md-btn w-sm blue m-b" @click="changeMode">{{ mode ? $t('system.adjust_rank') : $t('dic.confirm') }}</button>
            <button class="md-btn w-sm m-b m-l-sm" v-show="!mode" @click="cancelAdjustRank">{{ $t('dic.cancel') }}</button>
        </div>
    </div>
    <div class="box p-a">
        <div class="b-b nav-active-blue" v-if="mode">
            <ul class="nav nav-tabs m-l" >
                <li class="nav-item">
                    <router-link
                        :to="'/paymenttype/?type=0'"
                        class="nav-link _600"
                        :class="{'active': type === '0' }"
                    >{{ $t('dic.pc') }}
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link
                        :to="'/paymenttype/?type=1'"
                        class="nav-link _600"
                        :class="{'active': type === '1' }"
                    >{{ $t('dic.mobile') }}
                    </router-link>
                </li>
            </ul>
        </div>
        <table st-table="rowCollectionBasic" class="table table-striped">
            <thead>
                <tr>
                    <th v-show="!mode" width="3%"></th>
                    <th width="20%">{{ $t('dic.name') }}</th>
                    <th width="20%">{{ $t('misc.display_name') }}</th>
                    <th width="20%">{{ $t('title.online_payee') }}</th>
                    <th width="20%">{{ $t('finance.dashboard_memo') }}</th>
                    <th width="20%" class="text-center">{{ $t('dic.status') }}</th>
                </tr>
            </thead>
            <draggable
                v-model="filteredPaymentTypes"
                :element="'tbody'"
                :options="{ disabled: mode }"
                v-if="filteredPaymentTypes.length"
            >
                <tr
                    v-for="paymentType in filteredPaymentTypes"
                    :key="paymentType.id"
                    :class="{ 'pointer': !mode }"
                >
                    <td v-show="!mode">
                        <i class="fa fa-reorder text-blue"></i>
                    </td>
                    <td v-if="$root.permissions.includes('update_onlinepayment')">
                        <router-link :to="'/paymenttype/' + paymentType.id + '/edit'">
                            {{ paymentType.name }}
                        </router-link>
                    </td>
                    <td v-else>{{ paymentType.name }}</td>
                    <td>{{ paymentType.display_name || '-' }}</td>
                    <td v-if="paymentType.detail.length">
                        <router-link
                            :to="'/online_payee/' + payee.payee_id"
                            v-for="payee in paymentType.detail"
                            :key="payee.payee_id"
                        >
                            {{ payee.name }} &nbsp;
                        </router-link>
                    </td>
                    <td v-else>-</td>
                    <td>
                        {{ paymentType.description || '-' }}
                    </td>
                    <td class="text-center">
                        <status-switch
                            :status="paymentType.status"
                            :loading="!!toggleLoading[paymentType.id]"
                            :disabled="!updateOnlinepaymentStatusPermission"
                            :options="[$t('status.disabled'), '']"
                            @toggle="toggleStatus(paymentType)"
                        />
                    </td>
                </tr>
            </draggable>
        </table>
        
        <div class="row text-center p-a" v-if="loading">
            <i class="fa fa-spin fa-spinner"></i>
            <b>{{ $t('system.loading') }}</b>
        </div>
        <div class="row text-center p-a" v-if="!loading && !filteredPaymentTypes.length">
            {{ $t('system.no_record') }}
        </div>
    </div>
</div>
</template>
<script>
import StatusSwitch from '../../components/StatusSwitch.vue'
import draggable from 'vuedraggable'
import { getMerchant, updateMerchant, adjustPaymentTypeOrder } from '../../service'
export default {
    data () {
        return {
            mode: 1,
            status: this.$route.query.status || '',
            type: this.$route.query.type || '0',
            paymentTypes: [],
            filteredPaymentTypes: [],
            loading: true,
            toggleLoading: {}
        }
    },
    created () {
        this.getPaymentType()
    },
    watch: {
        '$route.query.type' (newType) {
            this.type = newType || '0'
            this.changeType(newType)
        },
        '$route.query.status' (newStatus) {
            this.status = newStatus || ''
            this.changeType()
        },
        status (newStatus) {
            this.$router.push({
                path: '/paymenttype',
                query: {
                    ...(newStatus && { status: newStatus }),
                    ...(this.type && { type: this.type })
                }
            })
        }
    },
    computed: {
        updateOnlinepaymentStatusPermission () {
            return this.$root.permissions.includes('update_onlinepayment_status')
        }
    },
    methods: {
        toggleStatus (paymentType) {
            this.$set(this.toggleLoading, paymentType.id, true)
            updateMerchant('paymentType', {
                id: paymentType.id,
                data: {
                    status: paymentType.status ^ 1,
                    code: paymentType.code
                }
            }, {
                action: this.$t('dic.update'),
                object: this.$t('dic.status')
            }).then(({ status }) => {
                paymentType.status = status
            }).catch(() => {
                this.changeType(this.type)
            }).finally(() => {
                this.$delete(this.toggleLoading, paymentType.id)
            })
        },
        getPaymentType () {
            getMerchant('paymentType', {
                params: {
                    opt_expand: 1
                }
            }).then(data => {
                this.paymentTypes = data
                this.paymentTypes.forEach(paymentType => {
                    paymentType.detail = paymentType.detail.filter(payee => payee.activate)
                })
                this.changeType()
            }).finally(() => { this.loading = false })
        },
        changeMode () {
            if (!this.mode) {
                adjustPaymentTypeOrder({
                    data: this.filteredPaymentTypes.map((p, index) => Object({
                        id: p.id,
                        [`${parseInt(this.type) ? 'mobile' : 'pc'}_rank`]: index + 1
                    })),
                    params: {
                        opt_expand: 1
                    }
                }, {
                    action: this.$t('system.adjust_rank')
                }).then(data => {
                    this.getPaymentType()
                }, () => {})
            } else {
                this.status = ''
                this.changeType()
            }
            this.mode = !this.mode
        },
        cancelAdjustRank () {
            this.mode = !this.mode
        },
        changeType (type = this.type) {
            type && (this.type = type)
            this.filteredPaymentTypes = this.paymentTypes
                .filter(element => element.platform === 2 || parseInt(element.platform) === parseInt(this.type))
                .filter(element => !this.mode || !this.status || parseInt(element.status) === parseInt(this.status))
                .sort((a, b) => {
                    let attribute = parseInt(this.type) ? 'mobile_rank' : 'pc_rank'
                    return a[attribute] - b[attribute]
                })
        }
    },
    components: {
        StatusSwitch,
        draggable
    }
}
</script>
