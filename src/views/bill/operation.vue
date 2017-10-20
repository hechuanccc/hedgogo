<template>
    <div class="box">
        <div class="box-body">
            <form v-on:submit.prevent="onSubmit">
                <div class="form-group row">
                    <label class="col-sm-2 form-control-label">存入账号</label>
                    <div class="col-sm-3">
                        <input type="text" class="form-control" v-model="transaction.member" required />
                    </div>
                </div>

                <div class="form-group row">
                    <label class="col-sm-2 form-control-label">存款金额</label>
                    <div class="col-sm-3">
                        <input type="text" class="form-control" v-model="transaction.amount" required />
                    </div>
                    <div class="col-xs-2">
                        <span class="t-red">输入负数即为扣款</span>
                    </div>
                </div>
                <div class="form-group row">
                  <label class="col-sm-2 form-control-label">是否记入审查记录</label>
                  <div class="col-xs-5 form-control-label">
                    <label class="md-check m-r">
                      <input type="radio" value="1" name="compensation"  v-model="compensation"/>
                      <i class="blue"></i>
                      是
                    </label>

                    <label class="md-check m-r">
                      <input type="radio" value="0" name="compensation" v-model="compensation" />
                      <i class="blue"></i>
                      否
                    </label>
                    <span class="text-danger"> 用于补偿额度丢失，选否 </span>
                  </div>
                </div>
                <div class="form-group row">
                    <label class="col-sm-2 form-control-label">稽核方式</label>
                    <div class="col-xs-5 form-control-label">
                        <label class="md-check m-r">
                            <input type="radio" value="0" name="check-type" v-model="transaction.audit.type" />
                            <i class="blue"></i>
                            免稽核
                        </label>

                        <label class="md-check m-r">
                            <input type="radio" value="1" name="check-type" v-model="transaction.audit.type" />
                            <i class="blue"></i>
                            存款稽核
                        </label>

                        <label class="md-check">
                            <input type="radio" value="2" name="check-type" v-model="transaction.audit.type" />
                            <i class="blue"></i>
                            优惠稽核
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
                    <label class="col-sm-2 form-control-label">交易类型</label>
                    <div class="col-xs-8 form-control-label">
                        <label class="md-check m-r">
                            <input type="radio" value="manual_operation" name="t-type" v-model="transaction.transaction_type" />
                            <i class="blue"></i>
                            人工存提
                        </label>
                        <label class="md-check m-r">
                            <input type="radio" value="discount" name="t-type" v-model="transaction.transaction_type"  />
                            <i class="blue"></i>
                            优惠
                        </label>
                        <label class="md-check m-r">
                            <input type="radio" value="return" name="t-type" v-model="transaction.transaction_type" />
                            <i class="blue"></i>
                            反水
                        </label>
                        <label class="md-check m-r">
                            <input type="radio" value="game_settlement" name="t-type" v-model="transaction.transaction_type" />
                            <i class="blue"></i>
                            派彩
                        </label>
                        <label class="md-check">
                            <input type="radio" value="other" name="t-type" v-model="transaction.transaction_type" />
                            <i class="blue"></i>
                            其他
                        </label>
                    </div>
                </div>

                <div class="form-group row">
                    <label class="col-sm-2 form-control-label">备注</label>
                    <div class="col-sm-3">
                        <textarea class="form-control" v-model="transaction.memo"></textarea>
                    </div>
                </div>


                <div class="form-group row">
                    <label class="col-sm-2 form-control-label">子账号密码</label>
                    <div class="col-sm-3">
                        <input type="password" class="form-control" placeholder="再次输入当前子账号密码" v-model="transaction.password" required />
                    </div>
                </div>

                <div class="form-group row" v-if="$root.permissions.includes('manual_deposit_withdraw')">
                    <label class="col-sm-2 form-control-label"></label>
                    <div class="col-sm-5">
                        <div class="alert alert-danger" v-if="errorMsg">{{errorMsg}}</div>
                        <button class="md-btn blue w-sm" type="submit">提交</button>
                        <div class="m-t-sm text-sm t-red">注意：提交该交易将直接更新会员账户余额</div>
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
                    this.errorMsg = response.data.error[0]
                })
            }
        }
    }
</script>
