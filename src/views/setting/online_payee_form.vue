<template>
    <div>
        <div class="m-b">
            <ol class="breadcrumb">
                <li class="active"><router-link to="/online_payee">{{$t('nav.setting_online_payee')}}</router-link></li>
                <li class="active">{{$route.meta.title}}</li>
            </ol>
        </div>
        <div class="box">
            <div class="box-body">
                <form class="form m-a" v-on:submit.prevent="onSubmit">
                    <div class="row">
                        <div class="col-xs-12">
                            <div class="form-group">
                                <label  class="label-width">{{$t('common.name')}}</label>
                                <div class="inline-form-control">
                                    <input type="text" class="form-control" placeholder="名称" v-model="payee.name" required >
                                </div>
                            </div>
                            <div class="form-group">
                                <label  class="label-width">{{$t('setting.display_name')}}</label>
                                <div class="inline-form-control">
                                    <input type="text" class="form-control" placeholder="显示名称" v-model="payee.display_name" required>
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="label-width">{{$t('setting.type')}}</label>
                                <div class="inline-form-control">
                                    <select class="form-control c-select" v-model="payee.payment_gateway" required>
                                        <option :value="p.id" v-for="p in paymenttypes">{{p.name}}</option>
                                    </select>
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="label-width">{{$t('setting.merchant_num')}}</label>
                                <div class="inline-form-control">
                                    <input class="form-control" type="text" v-model="payee.merchant_num" required />
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="label-width">{{$t('setting.certificate')}}</label>
                                <div class="inline-form-control">
                                    <input type="text" class="form-control" v-model="payee.certificate"  />
                                </div>
                            </div>

                            <div class="form-group">
                                <label  class="label-width">{{$t('setting.board_url')}}</label>
                                <div class="inline-form-control">
                                    <input  class="form-control" placeholder="Board URL" v-model="payee.board_url"  required/>
                                </div>
                            </div>

                            <div class="form-group">
                                <label  class="label-width">{{$t('setting.payment_domain')}}</label>
                                <div class="inline-form-control">
                                    <input  class="form-control" v-model="payee.domain_url"/>
                                </div>
                                <p class="text-danger note">{{$t('setting.domain_label')}}</p>
                            </div>

                            <div class="form-group">
                                <label  class="label-width">{{$t('setting.expired_in')}}</label>
                                <div class="inline-form-control">
                                    <input  class="form-control" placeholder="Expiration" v-model="payee.expired_in" required>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-12">
                            <div class="form-group">
                                <label  class="label-width">{{$t('member.level')}}</label>
                                <level :level="payee.level" :mode="'checkbox'" @level-select="levelSelect"></level>
                            </div>


                            <input type="hidden" v-model="payee.updated_by">

                            <div class="form-group" >
                                <label for="memo">{{$t('common.memo')}}</label>
                                <textarea class="form-control" name="memo" rows="2" cols="4" v-model="payee.memo"></textarea>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="alert alert-danger" v-if="errorMsg">
                            <span>{{ errorMsg }}</span>
                        </div>
                        <button :disabled="!$root.permissions.includes('change_onlinepayee')" type="submit" class="md-btn w-sm blue">{{$t('common.save')}}</button>
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
                    name: '',
                    merchant_num: '',
                    certificate: '',
                    board_url: '',
                    level: '',
                    expired_in: '',
                    memo: '',
                    payment_gateway: '',
                    domain_url: '',
                    display_name: ''
                },
                errorMsg: '',
                paymenttypes: []
            }
        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                let id = to.params.online_payeeId
                if (id) {
                    vm.getPayee(id)
                }
                vm.getPaymentTypes()
            })
        },
        methods: {
            onSubmit (e) {
                if (this.payee.id) {
                    this.$http.put(api.onlinepayee + this.payee.id + '/', this.payee).then(data => {
                        this.$router.push('/online_payee/' + data.id)
                    }, error => {
                        this.errorMsg = error
                    })
                } else {
                    this.$http.post(api.onlinepayee, this.payee).then(data => {
                        this.$router.push('/online_payee/' + data.id)
                    }, error => {
                        this.errorMsg = error
                    })
                }
            },
            getPaymentTypes () {
                this.$http.get(api.paymentgateway).then(data => {
                    this.paymenttypes = data
                })
            },
            getPayee (id) {
                this.$http.get(api.onlinepayee + id + '/').then(data => {
                    setTimeout(() => {
                        this.payee = Object.assign(this.payee, data)
                    }, 300)
                })
            },
            levelSelect (val) {
                this.payee.level = val
            }
        },
        components: {
            level: require('../../components/level')
        }
    }

</script>

<style>
    .note {
        padding-left: 20px;
        display: inline-block;
    }
</style>
