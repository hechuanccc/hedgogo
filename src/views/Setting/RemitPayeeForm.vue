<template>
    <div>
        <div class="m-b">
            <ol class="breadcrumb">
                <li class="active"><router-link to="/remit_payee">{{$t('title.remit_payee')}}</router-link></li>
                <li class="active">{{$route.meta.title}}</li>
            </ol>
        </div>
        <div class="box">
            <div class="box-body">
                <form name="myform" class="form m-a" v-on:submit.prevent="onSubmit" enctype="multipart/form-data">
                    <div class="row">
                        <div class="col-md-12 b-b m-b">
                            <div class="form-group">
                                <label for="agent" class="label-width">{{$t('title.payment_type')}}</label>
                                <div class="from-control inline-form-control">
                                    <label class="md-check">
                                        <input type="radio" name="remit_type" checked="checked" v-model="payee.remit_type" value="1" ref="remit_type">
                                        <i class="blue"></i>
                                        {{$t('finance.payment_normal')}}
                                    </label>

                                    <label class="md-check m-l-lg" >
                                        <input type="radio" name="remit_type" v-model="payee.remit_type" value="2">
                                        <i class="blue"></i>
                                        {{$t('finance.payment_wechat')}}
                                    </label>
                                    <label class="md-check m-l-lg" >
                                        <input type="radio" name="remit_type" v-model="payee.remit_type" value="3">
                                        <i class="blue"></i>
                                        {{$t('finance.payment_alipay')}}
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 ">
                            <div v-show="payee.remit_type === '1'">
                                <div class="form-group">
                                    <label  class="label-width">{{$t('dic.bank')}}</label>
                                    <selector-bank :bank.sync="payee.bank" :req.sync="bankRequired" @bank-select="bankSelect"/>
                                </div>

                                <div class="form-group">
                                    <label class="label-width">{{$t('user.real_name')}}</label>
                                    <div class="inline-form-control">
                                        <input
                                            class="form-control"
                                            placeholder="比如：张三丰"
                                            v-model="payee.payee_name"
                                            :required="payee.remit_type === '1'"
                                        />
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="label-width">{{$t('bank.address')}}</label>
                                    <div class="inline-form-control">
                                        <input
                                            class="form-control"
                                            placeholder="例如：黑龙江黑河"
                                            v-model="payee.address"
                                            :required="payee.remit_type === '1'"
                                        />
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label class="label-width">{{$t('bank.account')}}</label>
                                    <div class="inline-form-control">
                                        <input
                                            pattern="[\d\*]*"
                                            class="form-control"
                                            placeholder="比如：6256768987765442"
                                            v-model="payee.account"
                                            :required="payee.remit_type === '1'"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div v-show="payee.remit_type === '2' || payee.remit_type === '3'">
                                <div class="form-group">
                                    <label class="label-width">{{$t('user.nickname')}} </label>
                                    <div class="inline-form-control">
                                        <input
                                            class="form-control"
                                            placeholder="例如：中国银行"
                                            v-model="payee.nickname"
                                            :required="payee.remit_type === '2' || payee.remit_type === '3'"
                                        />
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label  class="label-width">{{$t('misc.qr_code')}}</label>
                                    <div class="inline-form-control" v-if="hasImage">
                                        <img
                                            :src="payee.qr_code"
                                            width="112"
                                            class="qr-code"
                                            alt="qr_code"
                                        />
                                    </div>
                                    <div v-else>
                                        {{ $t('system.no_setting')}}
                                    </div>
                                    <div class="inline-form-control">
                                        <input
                                            class="form-control"
                                            type="file"
                                            accept="image/*"
                                            @change="syncImage"
                                            :required="payee.remit_type === '2' || payee.remit_type === '3'"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="memo">{{$t('finance.dashboard_memo')}}</label>
                                <textarea class="form-control" name="memo" rows="2" placeholder="仅供管理员记录会员信息，会员无法查看" v-model="payee.memo"></textarea>
                            </div>
                            <div class="form-group">
                                <label for="memo">{{ $t('finance.client_memo') }}</label>
                                <textarea class="form-control" name="client_description" rows="2" v-model="payee.client_description"></textarea>
                            </div>
                        </div>
                        <div class="col-md-12 b-b m-b p-b">
                            <div class="p-b">{{$t('dic.member_level')}} <span class="text-danger m-l" v-show="levelError">{{$t('system_msg.no_select_object', { object: $t('dic.member_level') })}}</span></div>
                            <selector-member-level :level="payee.level" :mode="'checkbox'" @level-select="levelSelect"/>
                        </div>
                    </div>
                    <div>
                        <button type="submit" class="md-btn w-sm blue">{{$t('dic.submit')}}</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
<script>
    import { getMerchant, updateMerchant } from '../../service'
    import SelectorBank from '../../components/SelectorBank'
    import SelectorMemberLevel from '../../components/SelectorMemberLevel'

    export default {
        data () {
            return {
                payee: {
                    id: '',
                    nickname: '',
                    payee_name: '',
                    bank: '',
                    account: '',
                    address: '',
                    memo: '',
                    client_description: '',
                    level: [],
                    qr_code: [],
                    qr_code_file: '',
                    remit_type: '1'
                },
                hasImage: false
            }
        },
        computed: {
            bankRequired () {
                return this.payee.remit_type === '1'
            },
            levelError () {
                return this.payee.level.length === 0
            }
        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                let id = to.params.payeeId
                id && vm.getPayee(id)
            })
        },
        methods: {
            onSubmit (e) {
                let formData = new window.FormData()

                if (this.levelError) {
                    return
                }
                if (this.payee.remit_type !== '1') {
                    formData.append('remit_type', this.payee.remit_type)
                    formData.append('nickname', this.payee.nickname)
                    formData.append('memo', this.payee.memo)
                    formData.append('client_description', this.payee.client_description)
                    formData.append('level', this.payee.level)
                    if (this.hasImage) {
                        formData.append('qr_code', this.payee.qr_code_file)
                    }
                } else {
                    formData.append('remit_type', this.payee.remit_type)
                    formData.append('bank', this.payee.bank)
                    formData.append('payee_name', this.payee.payee_name)
                    formData.append('address', this.payee.address)
                    formData.append('account', this.payee.account)
                    formData.append('memo', this.payee.memo)
                    formData.append('client_description', this.payee.client_description)
                    formData.append('level', this.payee.level)
                }

                updateMerchant('remitPayee', {
                    id: this.payee.id,
                    data: formData
                }, {
                    action: this.payee.id ? this.$t('title.remit_payee_edit') : this.$t('title.remit_payee_add')
                }).then(({ id }) => {
                    this.$router.push('/remit_payee/' + id)
                }, () => {})
            },
            getPayee (id) {
                getMerchant('remitPayee', { id }).then(data => {
                    data.remit_type += ''
                    this.hasImage = !!data.qr_code
                    this.payee = data
                })
            },
            syncImage (e) {
                var reader = new FileReader()

                reader.onload = (e) => {
                    this.payee.qr_code = e.target.result
                }
                reader.readAsDataURL(e.target.files[0])
                this.payee.qr_code_file = e.target.files[0]
                this.hasImage = true
            },
            levelSelect (val) {
                this.payee.level = val
            },
            bankSelect (val) {
                this.payee.bank = val
            }
        },
        components: {
            SelectorBank,
            SelectorMemberLevel
        }
    }

</script>
