<template>
    <div>
        <div class="m-b">
            <ol class="breadcrumb">
                <li class="active"><router-link to="/remit_payee">{{$t('nav.setting_remit_payee')}}</router-link></li>
                <li class="active">{{$route.meta.title}}</li>
            </ol>
        </div>
        <div class="box">
            <div class="box-body">
                <form name="myform" class="form m-a" v-on:submit.prevent="onSubmit" enctype="multipart/form-data" novalidate>
                    <div class="row">
                        <div class="col-md-12 b-b m-b">
                            <div class="form-group">
                                <label for="agent" class="label-width">{{$t('setting.payment_type')}}</label>
                                <div class="from-control inline-form-control">
                                    <label class="md-check">
                                        <input type="radio" name="remit_type" checked="checked" v-model="payee.remit_type" value="1" ref="remit_type">
                                        <i class="blue"></i>
                                        {{$t('setting.payment_normal')}}
                                    </label>

                                    <label class="md-check m-l-lg" >
                                        <input type="radio" name="remit_type" v-model="payee.remit_type" value="2">
                                        <i class="blue"></i>
                                        {{$t('setting.payment_wechat')}}
                                    </label>
                                    <label class="md-check m-l-lg" >
                                        <input type="radio" name="remit_type" v-model="payee.remit_type" value="3">
                                        <i class="blue"></i>
                                        {{$t('setting.payment_alipay')}}
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 ">
                            <div v-show="payee.remit_type === '1'">
                                <div class="form-group">
                                    <label  class="label-width">{{$t('bank.name')}}</label>
                                    <bank :bank.sync="payee.bank" :req.sync="bankRequired" @bank-select="bankSelect"></bank>
                                </div>

                                <div class="form-group">
                                    <label class="label-width">{{$t('common.real_name')}}</label>
                                    <div class="inline-form-control">
                                        <input class="form-control" placeholder="比如：张三丰" v-model="payee.payee_name" :required="payee.remit_type==='1'" />
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="label-width">{{$t('bank.address')}}</label>
                                    <div class="inline-form-control">
                                        <input class="form-control" placeholder="例如：黑龙江黑河" v-model="payee.address" :required="payee.remit_type==='1'" />
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label class="label-width">{{$t('bank.account')}}</label>
                                    <div class="inline-form-control">
                                        <input type="number" class="form-control" placeholder="比如：6256768987765442" v-model="payee.account"  :required="payee.remit_type==='1'" />
                                    </div>
                                </div>
                            </div>

                            <div v-show="payee.remit_type === '2' || payee.remit_type === '3'">
                                <div class="form-group">
                                    <label  class="label-width">{{$t('common.nickname')}} </label>
                                    <div class="inline-form-control">
                                        <input class="form-control" placeholder="例如：中国银行" v-model="payee.nickname"/>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label  class="label-width">{{$t('common.qr_code')}}</label>
                                    <div class="inline-form-control qr-image" v-if="!hasImage">
                                        <img :src="payee.qr_code" class="qr-code">
                                    </div>
                                    <div class="inline-form-control">
                                        <input type="file" accept="image/*" @change="syncImage">
                                    </div>
                                </div>
                            </div>

                            <div class="form-group" >
                              <label for="memo">{{$t('common.memo')}}</label>
                              <textarea class="form-control" name="memo" rows="2" cols="4" placeholder="仅供管理员记录会员信息，会员无法查看" v-model="payee.memo"></textarea>
                            </div>
                        </div>
                        <div class="col-md-12 b-b m-b p-b">
                            <div class="p-b">{{$t('member.level')}} <span class="text-danger m-l" v-show="levelError">{{$t('setting.select_one_level')}}</span></div>
                            <level :level="payee.level" :mode="'checkbox'" @level-select="levelSelect"></level>
                        </div>
                    </div>
                    <div>
                        <div class="alert alert-danger" v-if="errorMsg">
                            <span>{{ errorMsg }}</span> 
                        </div>
                        <button :disabled="!$root.permissions.includes('change_remitpayee')" type="submit" class="md-btn w-sm blue">{{$t('common.save')}}</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

</template>
<script>
    import api from '../../api'

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
                    level: [],
                    qr_code: [],
                    remit_type: '1'
                },
                showLevelError: false,
                hasImage: false,
                errorMsg: ''
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
                if (id) {
                    vm.getPayee(id)
                }
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
                    formData.append('level', this.payee.level)
                    if (this.hasImage) {
                        formData.append('qr_code', this.payee.qr_code)
                    }
                } else {
                    formData.append('remit_type', this.payee.remit_type)
                    formData.append('bank', this.payee.bank)
                    formData.append('payee_name', this.payee.payee_name)
                    formData.append('address', this.payee.address)
                    formData.append('account', this.payee.account)
                    formData.append('memo', this.payee.memo)
                    formData.append('level', this.payee.level)
                }

                if (this.payee.id) {
                    this.$http.put(api.remitpayee + this.payee.id + '/', formData).then(data => {
                        this.$router.push('/remit_payee/' + data.id)
                    }, error => {
                        this.errorMsg = error
                    })
                } else {
                    this.$http.post(api.remitpayee, formData).then(data => {
                        this.$router.push('/remit_payee/' + data.id)
                    }, error => {
                        this.errorMsg = error
                    })
                }
            },
            getPayee (id) {
                this.$http.get(api.remitpayee + id + '/').then(data => {
                    data.remit_type += ''
                    this.payee = data
                })
            },
            syncImage (e) {
                this.payee.qr_code = e.target.files[0]
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
            bank: require('../../components/bank'),
            level: require('../../components/level')
        }
    }

</script>

<style>
    .qr-image {
        margin-right: 15px;
    }
</style>
