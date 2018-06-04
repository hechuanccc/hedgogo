<template>
<div>
    <div class="row m-r-sm m-l-sm" v-if="$root.permissions.includes('update_onlinepayment')">
        <div class="pull-left">
            <label
                class="form-control-label p-b-0"
                :class="{'text-blue': status}"
            >{{ $t('common.status') }}
            </label>
            <label class="sm-check m-r m-b-0">
                <input class="c-radio" type="radio" value="" v-model="status">
                <i class="blue m-r-xs"></i>
                {{ $t('common.show_all') }}
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
            <button class="md-btn w-sm blue m-b" @click="changeMode">{{ mode ? $t('game_manage.adjust_rank') : $t('action.confirm') }}</button>
            <button class="md-btn w-sm m-b m-l-sm" v-show="!mode" @click="cancelAdjustRank">{{ $t('action.cancel') }}</button>
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
                    >{{ $t('manage.pc') }}
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link
                        :to="'/paymenttype/?type=1'"
                        class="nav-link _600"
                        :class="{'active': type === '1' }"
                    >{{ $t('manage.mobile') }}
                    </router-link>
                </li>
            </ul>
        </div>
        <table st-table="rowCollectionBasic" class="table table-striped">
            <thead>
                <tr>
                    <th v-show="!mode" width="3%"></th>
                    <th width="20%">{{ $t('common.name') }}</th>
                    <th width="20%">{{ $t('setting.display_name') }}</th>
                    <th width="20%">{{ $t('setting.payee') }}</th>
                    <th width="20%">{{ $t('common.dashboard_memo') }}</th>
                    <th width="20%" class="text-center">{{ $t('common.status') }}</th>
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
                        <span class="label success m-r-sm" v-if="paymentType.status==1">{{ $t('status.active') }}</span>
                        <span class="label danger m-r-sm" v-else>{{ $t('status.disabled') }}</span>
                        <template v-if="$root.permissions.includes('update_onlinepayment_status')">
                            <a @click="toggleStatus(paymentType)" v-if="!toggleLoading[paymentType.id] &&paymentType.status === 1">{{ $t('status.disabled') }}</a>
                            <a @click="toggleStatus(paymentType)" v-else-if="!toggleLoading[paymentType.id]">{{ $t('status.active') }}</a>
                            <span class="text-blue" v-else>
                                &nbsp;&nbsp;<i class="fa fa-spin fa-spinner"></i>&nbsp;&nbsp;
                            </span>
                        </template>
                    </td>
                </tr>
            </draggable>
        </table>
        
        <div class="row text-center p-a" v-if="loading">
            <i class="fa fa-spin fa-spinner"></i>
            <b>{{ $t('common.loading') }}&nbsp;...</b>
        </div>
        <div class="row text-center p-a" v-if="!loading && !filteredPaymentTypes.length">
            {{ $t('common.no_record') }}
        </div>
    </div>
</div>
</template>
<script>
import draggable from 'vuedraggable'
import api from '../../api'
import $ from '../../utils/util'
export default {
    data () {
        return {
            mode: 1,
            status: this.$route.query.status || '',
            paymentTypes: [],
            type: this.$route.query.type || '0',
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
        },
        '$route.query.status' (newStatus) {
            this.status = newStatus || ''
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
        filteredPaymentTypes () {
            return this.paymentTypes
                .filter(element => element.platform === 2 || parseInt(element.platform) === parseInt(this.type))
                .filter(element => !this.mode || !this.status || parseInt(element.status) === parseInt(this.status))
                .sort((a, b) => {
                    let attribute = this.type ? 'mobile_rank' : 'pc_rank'
                    return a[attribute] - b[attribute]
                })
        }
    },
    methods: {
        toggleStatus (paymentType) {
            this.$set(this.toggleLoading, paymentType.id, true)
            this.$http.put(api.transaction.paymentType + paymentType.id + '/', {
                'status': paymentType.status ^ 1
            }).then(data => {
                paymentType.status = data.status
                $.notify({
                    message: this.$t('game_manage.modify_success')
                })
                this.$delete(this.toggleLoading, paymentType.id)
            }, error => {
                $.notify({
                    message: error,
                    type: 'danger'
                })
                this.changeType(this.type)
                this.$delete(this.toggleLoading, paymentType.id)
            })
        },
        getPaymentType () {
            this.$http.get(`${api.transaction.paymentType}?opt_expand=1`).then(data => {
                this.paymentTypes = data
                this.paymentTypes.forEach(paymentType => {
                    paymentType.detail = paymentType.detail.filter(payee => payee.activate)
                })
                this.loading = false
            })
        },
        changeMode () {
            if (!this.mode) {
                this.$http.post(`${api.transaction.paymentType}rank/?opt_expand=1`, this.filteredPaymentTypes.map((p, index) => Object({
                    id: p.id,
                    [`${this.type ? 'mobile' : 'pc'}_rank`]: index + 1
                }))).then(data => {
                    $.notify({
                        message: this.$t('game_manage.modify_success')
                    })
                    this.getPaymentType()
                }, error => {
                    $.notify({
                        message: error,
                        type: 'danger'
                    })
                })
            }
            this.mode = !this.mode
        },
        cancelAdjustRank () {
            this.mode = !this.mode
        }
    },
    components: {
        draggable
    }
}
</script>
