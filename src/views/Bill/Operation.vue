<template>
    <div class="box">
        <div class="box-body">
            <form @submit.prevent="onSubmit">
                <div class="form-group row">
                    <label class="col-sm-2 form-control-label">
                        {{ $t('user.username') }}
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
                        {{ $t('finance.deposit_amount') }}
                    </label>
                    <div class="col-sm-3">
                        <input
                            type="number"
                            class="form-control"
                            v-model="transaction.amount"
                            required
                        />
                        <span class="text-sm text-danger">{{ $t('misc.manual_adjust_deposit_amount_alert_msg') }}</span>
                    </div>
                </div>
    
                <div class="form-group row">
                    <label class="col-sm-2 form-control-label">
                        {{ $t('misc.manual_adjust_suggested_balance') }}
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
                            {{ $t('status.yes') }}
                        </label>

                        <label class="m-r">
                            <input
                                type="radio"
                                value="0"
                                name="compensation"
                                v-model.number="compensation"
                            />
                            <i class="blue"></i>
                            {{ $t('status.no') }}
                        </label>
                        <span class="text-sm text-danger">{{ $t('misc.manual_adjust_suggested_balance_alert_msg') }}</span>
                    </div>
                </div>
    
                <div class="form-group row">
                    <label class="col-sm-2 form-control-label">{{ $t('finance.audit_type') }}</label>
                    <div class="col-xs-5 form-control-label">
                        <label class="m-r">
                            <input
                                type="radio"
                                value="0"
                                name="check-type"
                                v-model.number="transaction.audit.type"
                            />
                            <i class="blue"></i>
                            {{ $t('finance.audit_free') }}
                        </label>

                        <label class="m-r">
                            <input
                                type="radio"
                                value="1"
                                name="check-type"
                                v-model.number="transaction.audit.type"
                            />
                            <i class="blue"></i>
                            {{ $t('finance.audit_deposit') }}
                        </label>

                        <label>
                            <input
                                type="radio"
                                value="2"
                                name="check-type" 
                                v-model.number="transaction.audit.type"
                            />
                            <i class="blue"></i>
                            {{ $t('finance.audit_discount') }}
                        </label>
                    </div>
                </div>

                <div class="form-group row">
                    <label class="col-sm-2 form-control-label"></label>
                    <div class="col-sm-3">
                        <input
                            type="number"
                            class="form-control"
                            :placeholder="$t('finance.audit_amount')"
                            v-model="transaction.audit.amount"
                            :required="transaction.audit.type !== 3"
                            :disabled="transaction.audit.type === 0"
                        />
                    </div>
                </div>
    
                <div class="form-group row">
                    <label class="col-sm-2 form-control-label">{{ $t('finance.transaction_type') }}</label>
                    <div class="col-xs-8 form-control-label">
                        <label class="m-r">
                            <input
                                type="radio"
                                value="manual_operation"
                                name="t-type"
                                v-model="transaction.transaction_type"
                            />
                            <i class="blue"></i>
                            {{ $t('finance.manual_operation') }}
                        </label>
                        <label class="m-r">
                            <input
                                type="radio"
                                value="discount"
                                name="t-type"
                                v-model="transaction.transaction_type"
                            />
                            <i class="blue"></i>
                            {{ $t('finance.discount') }}
                        </label>
                        <label class="m-r">
                            <input
                                type="radio"
                                value="return"
                                name="t-type"
                                v-model="transaction.transaction_type"
                            />
                            <i class="blue"></i>
                            {{ $t('finance.return') }}
                        </label>
                        <label class="m-r">
                            <input
                                type="radio"
                                value="game_settlement"
                                name="t-type"
                                v-model="transaction.transaction_type"
                            />
                            <i class="blue"></i>
                            {{ $t('finance.game_settlement') }}
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="other"
                                name="t-type"
                                v-model="transaction.transaction_type"
                            />
                            <i class="blue"></i>
                            {{ $t('misc.others') }}
                        </label>
                    </div>
                </div>

                <div class="form-group row">
                    <label class="col-sm-2 form-control-label">{{ $t('dic.memo') }}</label>
                    <div class="col-sm-3">
                        <textarea class="form-control" v-model="transaction.memo"></textarea>
                    </div>
                </div>


                <div class="form-group row">
                    <label class="col-sm-2 form-control-label">{{ $t('user.password') }}</label>
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
                            <span v-show="!loading">{{ $t('dic.submit') }}</span>
                        </button>
                        <p class="text-sm text-danger">{{ $t('misc.manual_adjust_submit_alert_msg') }}</p>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>
<script>
import { manuallyAdjust } from '../../service'

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

            manuallyAdjust(this.transaction, {
                action: this.$t('finance.manual_adjust')
            }).then(data => {
                this.$router.push('/transaction/' + data.id)
            }).finally(() => {
                this.loading = false
            })
        }
    }
}
</script>
