<template>
    <div class="box">
        <div class="box-body">
            <form v-on:submit.prevent="onSubmit">
                <div class="form-group row">
                    <label class="col-sm-2 form-control-label">{{$t('common.username')}}</label>
                    <div class="col-sm-3">
                        <input type="text" class="form-control" v-model="transaction.member" required />
                    </div>
                </div>

                <div class="form-group row">
                    <label class="col-sm-2 form-control-label">{{$t('bill.deposit_amount')}}</label>
                    <div class="col-sm-3">
                        <input type="text" class="form-control" v-model="transaction.amount" required />
                    </div>
                    <div class="col-xs-2">
                        <span class="t-red">{{$t('bill.deposit_amount_alert')}}</span>
                    </div>
                </div>
                <div class="form-group row">
                  <label class="col-sm-2 form-control-label">{{$t('bill.suggested_balance')}}</label>
                  <div class="col-xs-5 form-control-label">
                    <label class="md-check m-r">
                      <input type="radio" value="1" name="compensation"  v-model="compensation"/>
                      <i class="blue"></i>
                      {{$t('common.yes')}}
                    </label>

                    <label class="md-check m-r">
                      <input type="radio" value="0" name="compensation" v-model="compensation" />
                      <i class="blue"></i>
                      {{$t('common.no')}}
                    </label>
                    <span class="text-danger"> {{$t('bill.sug_balance_alert')}} </span>
                  </div>
                </div>
                <div class="form-group row">
                    <label class="col-sm-2 form-control-label">{{$t('bill.audit_type')}}</label>
                    <div class="col-xs-5 form-control-label">
                        <label class="md-check m-r">
                            <input type="radio" value="0" name="check-type" v-model="transaction.audit.type" />
                            <i class="blue"></i>
                            {{$t('bill.free_audit')}}
                        </label>

                        <label class="md-check m-r">
                            <input type="radio" value="1" name="check-type" v-model="transaction.audit.type" />
                            <i class="blue"></i>
                            {{$t('bill.deposit_audit')}}
                        </label>

                        <label class="md-check">
                            <input type="radio" value="2" name="check-type" v-model="transaction.audit.type" />
                            <i class="blue"></i>
                            {{$t('bill.preferential_audit')}}
                        </label>
                    </div>
                </div>

                <div class="form-group row">
                    <label class="col-sm-2 form-control-label"></label>
                    <div class="col-sm-3">
                        <input type="text" class="form-control" placeholder="稽核金额" v-model="transaction.audit.amount" :required="transaction.audit.type != 3" :disabled="transaction.audit.type == 0"/>
                    </div>
                </div>
                <div class="form-group row">
                    <label class="col-sm-2 form-control-label">{{$t('bill.transaction_type')}}</label>
                    <div class="col-xs-8 form-control-label">
                        <label class="md-check m-r">
                            <input type="radio" value="manual_operation" name="t-type" v-model="transaction.transaction_type" />
                            <i class="blue"></i>
                            {{$t('bill.manual_operation')}}
                        </label>
                        <label class="md-check m-r">
                            <input type="radio" value="discount" name="t-type" v-model="transaction.transaction_type"  />
                            <i class="blue"></i>
                            {{$t('bill.discount')}}
                        </label>
                        <label class="md-check m-r">
                            <input type="radio" value="return" name="t-type" v-model="transaction.transaction_type" />
                            <i class="blue"></i>
                            {{$t('bill.return')}}
                        </label>
                        <label class="md-check m-r">
                            <input type="radio" value="game_settlement" name="t-type" v-model="transaction.transaction_type" />
                            <i class="blue"></i>
                            {{$t('bill.game_settlement')}}
                        </label>
                        <label class="md-check">
                            <input type="radio" value="other" name="t-type" v-model="transaction.transaction_type" />
                            <i class="blue"></i>
                            {{$t('bill.others')}}
                        </label>
                    </div>
                </div>

                <div class="form-group row">
                    <label class="col-sm-2 form-control-label">{{$t('common.memo')}}</label>
                    <div class="col-sm-3">
                        <textarea class="form-control" v-model="transaction.memo"></textarea>
                    </div>
                </div>


                <div class="form-group row">
                    <label class="col-sm-2 form-control-label">{{$t('staff.password')}}</label>
                    <div class="col-sm-3">
                        <input type="password" class="form-control" placeholder="再次输入当前子账号密码" v-model="transaction.password" required />
                    </div>
                </div>

                <div class="form-group row" v-if="$root.permissions.includes('manual_deposit_withdraw')">
                    <label class="col-sm-2 form-control-label"></label>
                    <div class="col-sm-5">
                        <div class="alert alert-danger" v-if="errorMsg">{{errorMsg}}</div>
                        <button class="md-btn blue w-sm" type="submit">{{$t('common.submit')}}</button>
                        <div class="m-t-sm text-sm t-red">{{$t('bill.submit_alert')}}</div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>
<script>
    import api from '../../api'
    export default {
        data () {
            return {
                errorMsg: '',
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
                compensation: '1'
            }
        },
        mounted: function () {
            this.$nextTick(function () {
                this.transaction.member = this.$route.query.member
            })
        },
        methods: {
            fetchMember (username) {
                this.$http.get(api.member + '?username=' + username).then(response => {

                }, response => {
                    this.errorMsg = '无法获取会员资料'
                })
            },
            onSubmit () {
                if (this.compensation === '1') {
                    this.transaction.is_compensation = false
                } else {
                    this.transaction.is_compensation = true
                }
                this.$http.post(api.manual_transaction, this.transaction).then(response => {
                    if (response.data.id) {
                        this.$router.push('/transaction/' + response.data.id)
                    }
                }, response => {
                    this.errorMsg = response.data.error[0][0]
                })
            }
        }
    }
</script>
