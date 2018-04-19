<template>
    <div class="box">
        <div class="box-body">
            <form @submit.prevent="onSubmit">
                <div class="form-group row">
                    <label class="col-sm-2 form-control-label">
                        {{ $t('common.username') }}
                    </label>
                    <div class="col-sm-3">
                        <input
                            class="form-control"
                            v-model="transaction.member"
                            required
                        />
                    </div>
                </div>

                <div class="form-group row">
                    <label class="col-sm-2 form-control-label">
                        {{ $t('bill.deposit_amount') }}
                    </label>
                    <div class="col-sm-3">
                        <input
                            type="number"
                            class="form-control"
                            v-model="transaction.amount"
                            required
                        />
                        <span class="text-sm text-danger">{{ $t('bill.deposit_amount_alert') }}</span>
                    </div>
                </div>
    
                <div class="form-group row">
                    <label class="col-sm-2 form-control-label">
                        {{ $t('bill.suggested_balance') }}
                    </label>
                    <div class="col-xs-5 form-control-label">
                        <label class="m-r">
                            <input
                                type="radio"
                                value="1"
                                name="compensation"
                                v-model.number="compensation"
                            />
                            <i class="blue"></i>
                            {{ $t('common.yes') }}
                        </label>

                        <label class="m-r">
                            <input
                                type="radio"
                                value="0"
                                name="compensation"
                                v-model.number="compensation"
                            />
                            <i class="blue"></i>
                            {{ $t('common.no') }}
                        </label>
                        <span class="text-sm text-danger">{{ $t('bill.sug_balance_alert') }}</span>
                    </div>
                </div>
    
                <div class="form-group row">
                    <label class="col-sm-2 form-control-label">{{ $t('bill.audit_type') }}</label>
                    <div class="col-xs-5 form-control-label">
                        <label class="m-r">
                            <input
                                type="radio"
                                value="0"
                                name="check-type"
                                v-model.number="transaction.audit.type"
                            />
                            <i class="blue"></i>
                            {{ $t('bill.free_audit') }}
                        </label>

                        <label class="m-r">
                            <input
                                type="radio"
                                value="1"
                                name="check-type"
                                v-model.number="transaction.audit.type"
                            />
                            <i class="blue"></i>
                            {{ $t('bill.deposit_audit') }}
                        </label>

                        <label>
                            <input
                                type="radio"
                                value="2"
                                name="check-type" 
                                v-model.number="transaction.audit.type"
                            />
                            <i class="blue"></i>
                            {{ $t('bill.preferential_audit') }}
                        </label>
                    </div>
                </div>

                <div class="form-group row">
                    <label class="col-sm-2 form-control-label"></label>
                    <div class="col-sm-3">
                        <input
                            type="number"
                            class="form-control"
                            :placeholder="$t('bill.audit_amount')"
                            v-model="transaction.audit.amount"
                            :required="transaction.audit.type !== 3"
                            :disabled="transaction.audit.type === 0"
                        />
                    </div>
                </div>
    
                <div class="form-group row">
                    <label class="col-sm-2 form-control-label">{{ $t('bill.transaction_type') }}</label>
                    <div class="col-xs-8 form-control-label">
                        <label class="m-r">
                            <input
                                type="radio"
                                value="manual_operation"
                                name="t-type"
                                v-model="transaction.transaction_type"
                            />
                            <i class="blue"></i>
                            {{ $t('bill.manual_operation') }}
                        </label>
                        <label class="m-r">
                            <input
                                type="radio"
                                value="discount"
                                name="t-type"
                                v-model="transaction.transaction_type"
                            />
                            <i class="blue"></i>
                            {{ $t('bill.discount') }}
                        </label>
                        <label class="m-r">
                            <input
                                type="radio"
                                value="return"
                                name="t-type"
                                v-model="transaction.transaction_type"
                            />
                            <i class="blue"></i>
                            {{ $t('bill.return') }}
                        </label>
                        <label class="m-r">
                            <input
                                type="radio"
                                value="game_settlement"
                                name="t-type"
                                v-model="transaction.transaction_type"
                            />
                            <i class="blue"></i>
                            {{ $t('bill.game_settlement') }}
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="other"
                                name="t-type"
                                v-model="transaction.transaction_type"
                            />
                            <i class="blue"></i>
                            {{ $t('bill.others') }}
                        </label>
                    </div>
                </div>

                <div class="form-group row">
                    <label class="col-sm-2 form-control-label">{{ $t('common.memo') }}</label>
                    <div class="col-sm-3">
                        <textarea class="form-control" v-model="transaction.memo"></textarea>
                    </div>
                </div>


                <div class="form-group row">
                    <label class="col-sm-2 form-control-label">{{ $t('staff.password') }}</label>
                    <div class="col-sm-3">
                        <input
                            type="password"
                            class="form-control"
                            placeholder="再次输入当前子帐号密码"
                            v-model="transaction.password"
                            required
                        />
                    </div>
                </div>

                <div class="form-group row" v-if="$root.permissions.includes('manual_deposit_withdraw')">
                    <label class="col-sm-2 form-control-label"></label>
                    <div class="col-sm-5">
                        <button class="md-btn blue w-sm" type="submit">
                            <i class="fa fa-spin fa-spinner" v-show="loading"></i>
                            <span v-show="!loading">{{ $t('common.submit') }}</span>
                        </button>
                        <p class="text-sm text-danger">{{ $t('bill.submit_alert') }}</p>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>
<script>
import api from '../../api'
import $ from '../../utils/util'

export default {
    data () {
        return {
            loading: false,
            transaction: {
                member: '',
                amount: '',
                transaction_type: 'manual_operation',
                audit: {
                    type: 0,
                    amount: ''
                },
                memo: '',
                password: '',
                is_compensation: false
            },
            compensation: 1
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.transaction.member = this.$route.query.member
        })
    },
    methods: {
        onSubmit () {
            this.loading = true
            this.transaction.is_compensation = this.compensation === 1

            this.$http.post(api.manual_transaction, this.transaction).then(data => {
                this.loading = false
                this.$router.push('/transaction/' + data.id)
                $.notify({
                    message: `${this.$t('member.manual_adjust')}${this.$t('status.success')}`,
                    type: 'success'
                })
            }, error => {
                this.loading = false
                $.notify({
                    message: error,
                    type: 'danger'
                })
            })
        }
    }
}
</script>
