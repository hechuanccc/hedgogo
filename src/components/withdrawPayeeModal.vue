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
                            <online-payer-selector
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
                        <div class="col-sm-5" v-if="transaction.member.bank">
                            <p class="m-b-xs">{{ $t('bank.name') }}: {{ transaction.member.bank.name }}</p>
                            <p>{{ $t('bank.account') }}: {{ transaction.member.bank.account }}</p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button
                        class="btn blue p-x-md w-xs"
                        @click="update"
                        :disabled="!payer"
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
import api from '../api'
import $ from '../utils/util'
import onlinePayerSelector from '../components/onlinePayerSelector'

export default {
    props: {
        transaction: {
            type: Object,
            default: () => ({})
        },
        show: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            payer: '',
            modal: {
                showModal: false,
                loading: false
            },
            member: {}
        }
    },
    watch: {
        show (newObj) {
            this.modal.showModal = newObj
        },
        'modal.showModal' (newObj) {
            this.$emit('withdraw-payee-showmodal', newObj)
        }
    },
    methods: {
        update () {
            if (this.transaction.id && this.transaction.member.id && this.payer) {
                this.modal.loading = true
                this.$http.put(`${api.transaction_withdraw}${this.transaction.id}/`, {
                    memo: this.transaction.memo,
                    member: this.transaction.member.id,
                    online_payer: this.payer,
                    transaction_type: parseInt(this.transaction.transaction_type.id),
                    status: 1
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
            this.payer = val
        }
    },
    components: {
        onlinePayerSelector
    }
}
</script>
<style scoped>
.modal-backdrop, .modal{
  z-index: 1;
}
.modal-dialog{
  z-index: 10;
  top: 10%;
}
.modal{
  display: block;
}
</style>
