<template>
<div>
    <div class="m-b-xs text-right" v-if="$root.permissions.includes('export_withdraw_report')">
        <a
            :href="href"
            :getReport="getReport"
            v-if="queryset.length"
            class="md-btn w-sm text-white-dk blue"
        >
            <span>
                {{ $t('action.download_report') }}
                <i class="fa fa-download"></i>
            </span>
        </a>
        <span class="md-btn w-sm" disabled v-else>
            {{ $t('action.download_report') }}
            <i class="fa fa-download"></i>
        </span>
    </div>
    <form class="form box m-b-sm" @submit.prevent="submit">
        <div class="box-body clearfix form-input-sm">
            <div class="row m-l-xs m-r-xs">
                <div class="pull-left m-r-xs">
                    <label
                        class="form-control-label p-b-0"
                        :class="{'text-blue': status}"
                    >{{ $t('common.status') }}
                    </label>
                    <select
                        class="form-control w-sm c-select"
                        style="display: block;"
                        v-model="status"
                    >
                        <option value="">{{ $t('common.please_select') }}</option>
                        <option value="1">{{ $t('status.success') }}</option>
                        <option value="2">{{ $t('status.failed') }}</option>
                        <option value="3">{{ $t('status.ongoing') }}</option>
                        <option value="6">{{ $t('status.payment_pending') }}</option>
                        <option value="4">{{ $t('status.cancelled') }}</option>
                        <option value="5">{{ $t('status.declined') }}</option>
                    </select>
                </div>
                <div class="pull-left m-r-xs">
                    <label
                        class="form-control-label p-b-0"
                        :class="{'text-blue': query.member_level}"
                    >{{ $t('member.level') }}
                    </label>
                    <selector-member-level
                        style="display: block;"
                        :level="query.member_level"
                        @level-select="levelSelect"
                    />
                </div>
                <div class="pull-left m-r-xs">
                    <label
                        class="form-control-label p-b-0"
                        :class="{'text-blue': query.member_q}"
                    >{{ $t('common.member') }}
                    </label>
                    <input
                        v-model.trim="query.member_q"
                        class="form-control w-sm"
                        :placeholder="$t('common.member')"
                        @input="search"
                    />
                </div>
                <div class="pull-left m-r-xs">
                    <label
                        class="form-control-label p-b-0"
                        :class="{'text-blue': query.updated_by}"
                    >{{ $t('bill.operator') }}
                    </label>
                    <input
                        v-model.trim="query.updated_by"
                        class="form-control w-sm"
                        :placeholder="$t('bill.operator')"
                        @input="search"
                    />
                </div>
                <div class="pull-left m-r-xs">
                    <label
                        class="form-control-label p-b-0"
                        :class="{'text-blue': query.amount_lte || query.amount_gte}"
                    >{{ $t('common.amount') }}
                    </label>
                    <div style="display: block;">
                        <input
                            type="number"
                            v-model="query.amount_gte"
                            class="form-control inline w-sm"
                            :max="query.amount_lte"
                            :placeholder="$t('common.min_amount')"
                            @input="search"
                        />
                        ~
                        <input
                            type="number"
                            v-model="query.amount_lte"
                            class="form-control inline w-sm"
                            :min="query.amount_gte"
                            :placeholder="$t('common.max_amount')"
                            @input="search"
                        />
                    </div>
                </div>
                <div class="pull-left m-r-xs fade" :class="{'in': !noPayerType}">
                    <label
                        class="form-control-label p-b-0"
                        :class="{'text-blue': payerType}"
                    >{{ $t('bill.payer_type') }}
                    </label>
                    <selector-online-payer
                        style="display: block;"
                        :clearable="true"
                        :payer="payerType"
                        :addOptions="[{
                            id: 'null',
                            name: $t('bill.manual_withdraw')
                        }]"
                        @payer-select="payerTypeSelect"
                        @no-payer="v => noPayerType = v"
                    />
                </div>
            </div>
            <div class="row m-r-xs m-l-xs m-t-sm">
                <div class="pull-left m-r-xs">
                    <label
                        class="form-control-label p-b-0"
                        :class="{'text-blue': selected === '0'
                            ? created_at && (created_at[0] || created_at[1])
                            : updated_at && (updated_at[0] || updated_at[1])}"
                    >{{ $t('common.applied_at') }} / {{ $t('common.status_updated_at') }} 
                    </label>
                    <div style="display: block;">
                        <select
                            class="pull-left form-control w-sm c-select no-b-r"
                            v-model="selected"
                            @change="autoTogglePopup = true"
                        >
                            <option value="0">{{ $t('common.applied_at') }}</option>
                            <option value="1">{{ $t('common.status_updated_at') }}</option>
                        </select>
                        <el-date-picker
                            style="width: 248px;"
                            v-model="created_at"
                            size="mini"
                            type="daterange"
                            align="right"
                            unlink-panels
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :picker-options="{shortcuts}"
                            range-separator="-"
                            v-show="selected === '0'"
                            ref="created"
                        />
                        <el-date-picker
                            style="width: 248px;"
                            v-model="updated_at"
                            size="mini"
                            type="daterange"
                            align="right"
                            unlink-panels
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :picker-options="{shortcuts}"
                            v-show="selected === '1'"
                            ref="updated"
                        />
                    </div>
                </div>
                <div class="pull-left m-r-xs">
                    <label
                        class="form-control-label p-b-0"
                        :class="{'text-blue': query.transaction_id}"
                    >{{ $t('bill.order_id') }}
                    </label>
                    <input
                        style="width: 244px;"
                        v-model.trim="query.transaction_id"
                        class="form-control w-sm"
                        :placeholder="$t('bill.order_id')"
                        @input="search"
                    />
                </div>
                <div class="pull-left m-r-xs">
                <label
                    class="form-control-label p-b-0"
                    :class="{'text-blue': query.ip}"
                >
                    IP
                </label>
                <input
                    v-model.trim="query.ip"
                    class="form-control"
                    style="width: 244px;"
                    placeholder="IP"
                    @input="search"
                />
                </div>
                <button
                    class="md-btn w-xs pull-right btn m-t-md"
                    type="button"
                    @click="clearAll"
                    :disabled="isQueryEmpty"
                >
                    <i v-if="loading" class="fa fa-spin fa-spinner"></i> 
                    <i v-else class="fa fa-trash-o"></i> 
                    {{ $t('action.reset_condition') }}
                </button>
            </div>
        </div>
    </form>
    <div class="row m-l-xs m-r-xs">
        <div class="pull-right total-amount">
            <span>{{ `${$t('common.total')} ${ $t('nav.withdraw_request')} :` }}</span>
            <span v-if="queryset.length">{{ total_amount | currency('￥') }}</span>
            <span v-else>{{ 0 | currency('￥') }}</span>
        </div>
    </div>
    <div class="box">
        <table class="table table-striped">
            <thead>
                <tr class="text-sm">
                    <th class="p-r-xs">{{ $t('common.member') }}</th>
                    <th width="11%" class="text-center p-l-0 p-r-xs">
                        {{ $t('common.applied_at') }}&nbsp;/
                        <br/>
                        {{ $t('common.status_updated_at') }}
                    </th>
                    <th class="p-l-sm p-r-xs">{{ $t('common.ip_info') }}</th>
                    <th class="text-right p-r-xs">
                        {{ $t('common.balance_before') }}&nbsp;/
                        <br/>
                        {{ $t('common.balance_after') }}
                    </th>
                    <th class="text-center p-r-xs">{{ $t('common.amount') }}</th>
                    <th>{{ $t('bank.bank_title') }}</th>
                    <th>{{ $t('bill.operator') }}</th>
                    <th width="5%" class="text-center">{{ $t('bill.payer_type') }}</th>
                    <th width="7%" class="text-center">{{ $t('setting.check_amount') }}<br/>{{ $t('common.status') }}</th>
                    <th width="5%" class="text-center">{{ $t('bill.withdraw') }}<br/>{{ $t('common.status') }}</th>
                    <th width="5%" class="text-center">{{ $t('common.operate') }}</th>
                    <th width="5%" class="text-center">{{ $t('bill.order_detail') }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="t in queryset" :key="t.id">
                    <td class="p-r-xs">
                        <router-link :to="'/member/' + t.member.id">{{ t.member.username }}</router-link>
                        <br/>
                        {{ t.member.real_name }}
                        <br/>
                        <router-link :to="'/level/' + t.member.level.id" class="text-xs">{{ t.member.level.name }}</router-link>
                    </td>
                    <td class="text-center p-l-0 p-r-xs">
                        <span class="text-xs">{{ t.created_at  | moment("YYYY-MM-DD HH:mm:ss") }}</span><br/>
                        <span class="text-xs">{{ t.updated_at | moment("YYYY-MM-DD HH:mm:ss") }}</span>
                    </td>
                    <td v-if="t.ip_info" class="text-sm p-l-sm p-r-xs">
                        <span>{{ t.ip_info.ip || '-' }}</span>
                        <br/>
                        <span class="text-muted text-xs">{{ `${t.ip_info.country || '-'} ${t.ip_info.region || '-'} ${t.ip_info.city || '-'}` }}</span>
                        <br/>
                        <span class="label danger" v-if="t.ip_info && t.ip_info.ip_repeated">{{ $t('common.repeat') }}</span>
                    </td>
                    <td v-else>-</td>
                    <td class="text-right p-r-xs">
                        <p class="m-b-xs" v-if="t.balance_before || t. balance_before === 0">{{ t.balance_before | currency('￥') }}</p>
                        <p class="m-b-xs" v-else>-</p>
                        <p class="m-b-0" v-if="t.balance_after || t.balance_after === 0">{{ t.balance_after | currency('￥') }}</p>
                        <p class="m-b-0" v-else>-</p>
                    </td>
                    <td class="text-right p-r-xs">{{ t.amount | currency('￥') }}</td>
                    <td>
                        <p class="m-b-xs">{{ `${$t('bank.name')}: ${t.member.bank.name}` }}</p>
                        <p class="m-b-xs">{{ `${$t('bank.account')}: ${t.member.bank.account}` }}</p>
                        <p class="m-b-0">{{ `${$t('bank.address')}: ${t.member.bank.city}, ${t.member.bank.province}` }}</p>
                    </td>
                    <td class="p-r-xs">{{ ( t.updated_by && t.updated_by.username ) || '-' }}</td>
                    <td class="p-l-xs p-r-xs text-sm text-center">
                        <span v-if="t.online_payer && t.online_payer.name">{{ ( t.online_payer && t.online_payer.name ) }}</span>
                        <span v-else-if="t.status === 1">{{ $t('bill.manual_withdraw') }}</span>
                        <span v-else>-</span>
                    </td>
                    <td class="text-center p-r-xs p-l-xs">
                        <span v-if="t.audit_status" class="t-green">{{ $t('member.pass') }}</span>
                        <span v-else class="t-red">{{ $t('member.failed') }}</span>
                    </td>
                    <td class="text-center p-l-xs p-r-xs">
                        <transaction-status :transaction="t"/>
                    </td>
                    <td class="text-center p-l-xs p-r-xs">
                        <span v-if="t.status !== 3" class="text-sm">{{ $t('status.handled') }}</span>
                        <template v-else>
                            <button 
                                type="button"
                                class="btn btn-xs blue m-b-sm"
                                @click="openModal({
                                    status: 1,
                                    transactionType: parseInt(t.transaction_type.id),
                                    transactionId: t.id
                                }, t.member)"
                                v-if="$root.permissions.includes('allow_withdraw_transaction')"
                            >{{ $t('bill.audit') }}
                            </button>
                            <br v-if="$root.permissions.includes('allow_withdraw_transaction')"/>
                            <button
                                type="button"
                                class="btn btn-xs sm-btn m-b-sm"
                                @click="openModal({
                                    status: 4,
                                    transactionType: parseInt(t.transaction_type.id),
                                    transactionId: t.id,
                                }, t.member)"
                                v-if="$root.permissions.includes('refuse_withdraw_transaction')"
                            >{{ $t('bill.cancel') }}
                            </button>
                            <br v-if="$root.permissions.includes('allow_withdraw_transaction')"/>
                            <button
                                type="button"
                                class="btn btn-xs sm-btn m-b-sm"
                                @click="openModal({
                                    status: 5,
                                    transactionType: parseInt(t.transaction_type.id),
                                    transactionId: t.id,
                                }, t.member)"
                                v-if="$root.permissions.includes('refuse_withdraw_transaction')"
                            >{{ $t('bill.declined') }}
                            </button>
                            <div v-if="!withdrawLoading[t.id]">
                                <a
                                    @click="openWithdrawPayeeModal(t, p.id)"
                                    class="m-r-xs m-l-xs"
                                    :key="p.id"
                                    v-for="p in t.available_payers"
                                    v-if="t.available_payers && t.available_payers.length"
                                >
                                    {{ p.name }}
                                </a>
                            </div>
                            <i class="fa fa-spin fa-spinner text-blue" v-else-if="withdrawLoading[t.id]"></i>
                        </template>
                    </td>
                    <td class="text-center p-l-xs p-r-xs">
                        <router-link :to="'/transaction/' + t.id">{{$t('action.view')}}</router-link>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
     <div class="modal" v-if="modal.showModal">
        <div class="modal-backdrop fade in" @click="modal.showModal = false"></div>
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    
                    <span class="text-md" v-if="modal.status === 1">{{ $t('bill.withdraw_audit_alert_msg') }}</span>
                    <span class="text-md" v-if="modal.status === 4 || modal.status === 5">{{ $t('bill.confirm_declined', {
                        action: modal.status === 4 ? $t('bill.cancel') : $t('bill.declined')
                    }) }}</span>
                    <span class="text-md">({{ `${$t('common.username')}: ${modal.username}` }})</span>
                    <button type="button" class="close" aria-hidden="true" @click="modal.showModal = false">×
                    </button>
                </div>
                <div class="modal-body m-r m-l">
                    <label
                        class="form-control-label p-b-0"
                    >审核备注
                    </label>
                    <textarea
                        v-model.trim="modal.memo"
                        class="form-control"
                        ref="modalContent"
                        rows="6"
                        placeholder="编辑失败或者成功的理由追加在原有备注后，这些信息将会发送给用户！"
                    />
                </div>
                <div class="modal-footer">
                    <button
                        class="btn blue p-x-md w-xs"
                        @click="updateWithdraw(modal)"
                    >
                        <span v-if="modal.loading"><i class="fa fa-spin fa-spinner"></i></span>
                        <span v-else>{{ $t('action.confirm') }}</span>
                    </button>
                    <button
                        type="button"
                        class="btn dark-white p-x-md w-xs"
                        @click="modal.showModal = false"
                    >{{ $t('action.cancel') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
    <modal-withdraw-payee
        :show="showWithdrawPayeeModal"
        :transaction="withdrawPayeeTransaction"
        :payer="withdrawPayee"
        @withdraw-payee-showmodal="changeWithdrawPayeeModal"
        @withdraw-payee-status="withdrawPayeeStatus"
    />
    <div class="row m-b-lg">
        <pulling
            :extra="'transaction_type=withdraw&report_flag=true'"
            :api="url.transaction.bill"
            :queryset="queryset"
            :query="query"
            :total_amount="total_amount"
            @query-data="queryData"
            @query-param="queryParam"
            @export-query="exportQuery"
            @amount="totalAmount"
            ref="pulling"
        />
    </div>
</div>
</template>
<script>
    import url from '../../service/url'
    import { autoWithdraw, updateTransaction } from '../../service'
    import Pulling from '../../components/Pulling'
    import $ from '../../utils/util'
    import SelectorMemberLevel from '../../components/SelectorMemberLevel'
    import TransactionStatus from '../../components/TransactionStatus'
    import SelectorOnlinePayer from '../../components/SelectorOnlinePayer'
    import ModalWithdrawPayee from '../../components/ModalWithdrawPayee'
    import VueCookie from 'vue-cookie'
    import date from '../../utils/date'
    import { debounce } from 'lodash'

    export default {
        data () {
            return {
                queryset: [],
                query: {},
                href: '',
                status: '',
                payerType: '',
                noPayerType: true,
                created_at: ['', ''],
                updated_at: ['', ''],
                selected: '0',
                total_amount: '',
                today: date.today[0],
                shortcuts: ['today', 'yesterday', 'this_week', 'this_month', 'last_month'].map(element => Object({
                    text: this.$t(`common.${element}`),
                    onClick (p) {
                        p.$emit('pick', date[element])
                    }
                })),
                autoTogglePopup: false,
                loading: true,
                modal: {
                    showModal: false,
                    loading: false,
                    transactionId: '',
                    status: '',
                    memo: '',
                    member: '',
                    transactionType: '',
                    username: ''
                },
                showWithdrawPayeeModal: false,
                withdrawPayeeTransaction: {},
                withdrawPayee: '',
                isAutoWithdraw: true,
                withdrawLoading: {},
                url
            }
        },
        watch: {
            '$root.withdraw_count' (newObj, old) {
                this.$refs.pulling.rebase()
            },
            '$route': {
                handler () {
                    this.loading = true
                    this.setQueryAll()
                    this.queryset = []
                    this.$refs.pulling.rebase()
                },
                deep: true
            },
            status (newObj) {
                this.query.status = newObj
                this.submit()
            },
            created_at (newObj) {
                [this.query.created_at_0, this.query.created_at_1] = [...(newObj || [])]
                this.autoTogglePopup = false
                this.submit()
            },
            updated_at (newObj) {
                [this.query.updated_at_0, this.query.updated_at_1] = [...(newObj || [])]
                this.autoTogglePopup = false
                this.submit()
            },
            selected (newObj, old) {
                this.query = Object.assign(this.query, {
                    created_at_0: undefined,
                    created_at_1: undefined,
                    updated_at_0: undefined,
                    updated_at_1: undefined
                })
                if (this.autoTogglePopup) {
                    this.$nextTick(() => {
                        if (newObj !== old) {
                            if (newObj === '1') {
                                this.$refs.updated.focus()
                            } else {
                                this.$refs.created.focus()
                            }
                        }
                    })
                }
            }
        },
        created () {
            this.setQueryAll()
            this.$nextTick(() => {
                this.$refs.pulling.rebase()
            })
        },
        computed: {
            getReport () {
                this.$refs.pulling.getExportQuery()
                this.href = `${url.report.withdraw}?token=${VueCookie.get('access_token')}&${this.export_query}`
                return this.queryset.length
            },
            isQueryEmpty () {
                return $.compareQuery(this.query, {})
            }
        },
        methods: {
            setQueryAll () {
                if (this.$route.query.created_at_0 || this.$route.query.created_at_1) {
                    this.selected = '0'
                    this.created_at = [this.$route.query.created_at_0, this.$route.query.created_at_1]
                } else if (this.$route.query.updated_at_0 || this.$route.query.updated_at_1) {
                    this.selected = '1'
                    this.updated_at = [this.$route.query.updated_at_0, this.$route.query.updated_at_1]
                } else {
                    this.selected = '0'
                    this.created_at = [undefined, undefined]
                    this.updated_at = [undefined, undefined]
                }
                this.status = this.$route.query.status || ''
                this.payerType = this.$route.query.online_payer || ''
                this.query = Object.assign({}, this.$route.query)
            },
            levelSelect (val) {
                this.query.member_level = val
                this.submit()
            },
            payerTypeSelect (val) {
                this.query.online_payer = val
                // if user choses manually withdraw as payer type, transaction's status must be successed
                if (val === 'null') {
                    this.query.status = '1'
                }
                this.submit()
            },
            queryData (queryset) {
                this.loading = false
                this.queryset = queryset
            },
            queryParam (query) {
                this.query = Object.assign(this.query, query)
            },
            totalAmount (amount) {
                this.total_amount = amount
            },
            exportQuery (expor) {
                this.export_query = expor
            },
            submit () {
                if (!$.compareQuery(this.query, this.$route.query)) {
                    this.$refs.pulling.submit()
                }
            },
            search:
                debounce(function () {
                    this.submit()
                },
            700),
            clearAll () {
                this.query = {}
                this.$nextTick(() => {
                    this.submit()
                })
            },
            openModal ({status, transactionType, transactionId}, {id, username}) {
                Object.assign(this.modal, {
                    showModal: true,
                    transactionId,
                    status,
                    memo: '',
                    member: id,
                    transactionType,
                    username
                })
            },
            openWithdrawPayeeModal (transaction, payer = '') {
                if (this.isAutoWithdraw) {
                    this.autoWithdraw(transaction, payer)
                } else {
                    Object.assign(this.withdrawPayeeTransaction, transaction)
                    this.withdrawPayee = payer
                    this.showWithdrawPayeeModal = true
                }
            },
            autoWithdraw (transaction = {}, payer = '') {
                if (transaction && transaction.id && payer) {
                    this.$set(this.withdrawLoading, transaction.id, true)
                    autoWithdraw({
                        id: transaction.id,
                        data: {
                            memo: transaction.memo,
                            member: transaction.member.id,
                            transaction_type: parseInt(transaction.transaction_type.id),
                            status: 1,
                            online_payer: payer
                        }
                    }).then(data => {
                        $.notify({
                            message: this.$t('bill.withdraw_payee') + this.$t('status.success')
                        })
                        this.$refs.pulling.rebase()
                        this.$delete(this.withdrawLoading, transaction.id)
                    }, error => {
                        $.notify({
                            message: error,
                            type: 'danger'
                        })
                        this.$delete(this.withdrawLoading, transaction.id)
                    })
                }
            },
            updateWithdraw ({
                transactionId,
                status,
                memo,
                member,
                transactionType
            }) {
                this.modal.loading = true
                updateTransaction('withdraw', {
                    id: transactionId,
                    data: {
                        memo,
                        member,
                        transaction_type: transactionType,
                        status
                    }
                }).then(data => {
                    this.$refs.pulling.rebase()
                    $.notify({
                        message: status === 1 ? this.$t('bill.audit') : (status === 4 ? this.$t('bill.cancel') : '') + this.$t('status.success')
                    })
                    this.modal.showModal = false
                    this.modal.loading = false
                }, error => {
                    $.notify({
                        message: error,
                        type: 'danger'
                    })
                    this.modal.loading = false
                })
            },
            changeWithdrawPayeeModal (val) {
                this.showWithdrawPayeeModal = val
            },
            withdrawPayeeStatus (val) {
                if (val) {
                    this.showWithdrawPayeeModal = false
                    this.$refs.pulling.rebase()
                }
            }
        },
        components: {
            Pulling,
            TransactionStatus,
            SelectorOnlinePayer,
            ModalWithdrawPayee,
            SelectorMemberLevel
        }
    }
</script>
