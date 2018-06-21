<template>
    <div class="modal" v-if="modal.showModal">
        <div class="modal-backdrop fade in" @click="modal.showModal = false"></div>
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" aria-hidden="true" @click="modal.showModal = false">×
                    </button>
                </div>
                <div class="modal-body m-r m-l">
                    <div class="row">
                        <div class="col-sm-12 text-center">
                        <h5>代付打款商户选择</h5>
                        </div>
                    </div>
                    <div class="row m-t-sm p-b b-b">
                        <div class="col-sm-3 col-sm-offset-1 text-right m-t-sm">{{ $t('setting.merchant_num') }}</div>
                        <div class="col-sm-5" v-if="transaction.member && transaction.member.id">
                            <selector-online-payer
                                :payer="selectedPayer"
                                :member="transaction.member.id"
                                @payer-select="payerSelect"
                            />
                        </div>
                        <div class="col-sm-5" v-else>
                            <i class="fa fa-spin fa-spinner"></i>
                        </div>
                    </div>
                    <div class="row m-t-sm p-t-sm">
                        <div class="col-sm-12 text-center">
                        <h5>{{ $t('bill.order_detail') }}</h5>
                        </div>
                    </div>
                    <div class="row m-t-sm">
                        <div class="col-sm-3 col-sm-offset-1 text-right">{{ $t('common.real_name') }}</div>
                        <div class="col-sm-5" v-if="transaction.member">
                            {{ transaction.member.real_name }}
                        </div>
                    </div>
                    <div class="row m-t-sm">
                        <div class="col-sm-3 col-sm-offset-1 text-right">{{ $t('bill.withdraw') + $t('common.amount') }}</div>
                        <div class="col-sm-5">
                            {{ transaction.amount | currency('￥') }}
                        </div>
                    </div>
                    <div class="row m-t-sm">
                        <div class="col-sm-3 col-sm-offset-1 text-right">{{ $t('bill.withdraw') + $t('common.applied_at') }}</div>
                        <div class="col-sm-5" v-if="transaction.member">
                            {{ transaction.created_at | moment("YYYY-MM-DD HH:mm:ss") }}
                        </div>
                    </div>
                    <div class="row m-t-sm">
                        <div class="col-sm-3 col-sm-offset-1 text-right">{{ $t('bill.deposit_info') }}</div>
                        <div class="col-sm-5" v-if="transaction.member">
                            <p class="m-b-xs">{{ $t('bank.name') }}: {{ transaction.member.bank.name }}</p>
                            <p>{{ $t('bank.account') }}: {{ transaction.member.bank.account }}</p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button
                        class="btn blue p-x-md w-xs"
                        @click="update"
                        :disabled="!selectedPayer"
                    >
                        <span v-if="modal.loading"><i class="fa fa-spin fa-spinner"></i></span>
                        <span v-else>{{ $t('action.confirm') }}</span>
                    </button>
                    <button
                        type="button"
                        class="btn dark-white p-x-md w-xs"
                        @click="modal.showModal = false">
                        {{ $t('action.cancel') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { autoWithdraw } from '../service'
import $ from '../utils/util'
import SelectorOnlinePayer from '../components/SelectorOnlinePayer'

export default {
    props: {
        transaction: {
            type: Object,
            default: () => ({})
        },
        show: {
            type: Boolean,
            default: false
        },
        payer: {
            default: ''
        }
    },
    data () {
        return {
            modal: {
                showModal: false,
                loading: false
            },
            member: {},
            selectedPayer: ''
        }
    },
    watch: {
        payer (newObj) {
            this.selectedPayer = newObj
        },
        show (newObj) {
            this.modal.showModal = newObj
        },
        'modal.showModal' (newObj) {
            this.$emit('withdraw-payee-showmodal', newObj)
        }
    },
    methods: {
        update () {
            if (this.transaction.id && this.transaction.member.id && this.selectedPayer) {
                this.modal.loading = true
                autoWithdraw({
                    id: this.transaction.id,
                    data: {
                        memo: this.transaction.memo,
                        member: this.transaction.member.id,
                        transaction_type: parseInt(this.transaction.transaction_type.id),
                        status: 1,
                        online_payer: this.selectedPayer
                    }
                }).then(data => {
                    $.notify({
                        message: this.$t('bill.withdraw_payee') + this.$t('status.success')
                    })
                    this.$emit('withdraw-payee-status', 1)
                    this.modal.loading = false
                }, error => {
                    $.notify({
                        message: error,
                        type: 'danger'
                    })
                    this.modal.loading = false
                })
            }
        },
        payerSelect (val) {
            this.selectedPayer = val
        }
    },
    components: {
        SelectorOnlinePayer
    }
}
</script>
