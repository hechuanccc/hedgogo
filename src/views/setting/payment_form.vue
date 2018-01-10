<template>
    <div>
        <div class="m-b">
            <ol class="breadcrumb">
                <li class="active"><router-link to="/paymenttype">{{$t('nav.payment_type_setting')}}</router-link></li>
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
                                    <input type="text" class="form-control" placeholder="名称" v-model="payment.name" disabled >
                                </div>
                            </div>
                            <div class="form-group">
                                <label  class="label-width">{{$t('setting.display_name')}}</label>
                                <div class="inline-form-control">
                                    <input  type="text" class="form-control" placeholder="显示名称" v-model="payment.display_name" disabled>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-12">
                            <div class="form-group">
                                <label class="label-width">{{$t('setting.payment_gateway')}}</label>
                                <div v-if="payment.detail.length > 0" class="m-t-sm">
                                    <label class="m-l-lg checkbox inline" v-for="(detail, index) in payment.detail">
                                        <input type="checkbox" name="payees"  :value="detail.payee_id" :diu="detail.activate" :checked="detail.activate" @click="changePayee(detail.payee_id, index)">
                                        <i class="blue"></i>
                                        {{detail.name}}
                                    </label>
                                </div>
                                <div v-else class="inline-form-control">{{$t('setting.no_payment_gateway')}}</div>    
                            </div>
                            <div class="form-group" >
                                <label for="memo">{{$t('common.memo')}}</label>
                                <textarea class="form-control" name="memo" rows="2" cols="4" v-model="payment.description"></textarea>
                            </div>
                        </div>
                    </div>
                    <div>
                        <button type="submit" class="md-btn w-sm blue">{{$t('common.save')}}</button>
                        <span class="text-success m-l-md" v-show="updated">{{$t('common.saved_successfully')}}</span>
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
                payment: {
                    description: '',
                    payees: [],
                    detail: [],
                    display_name: '',
                    name: '',
                    status: ''
                },
                updated: false
            }
        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                let id = to.params.id
                if (id) {
                    vm.getPaymentType(id)
                }
            })
        },
        watch: {
            updated (newObj, old) {
                setTimeout(() => {
                    this.updated = false
                }, 2500)
            }
        },
        methods: {
            onSubmit (e) {
                if (this.payment.id) {
                    this.$http.put(api.paymenttype + this.payment.id + '/', this.payment).then(() => {
                        this.updated = true
                    })
                }
            },
            getPaymentType (id) {
                this.$http.get(api.paymenttype + id + '?opt_expand=1').then(data => {
                    for (let i = 0; i < data.detail.length; i++) {
                        data.detail[i].payee_id = String(data.detail[i].payee_id)
                        if (data.detail[i].activate) {
                            this.payment.payees.push(data.detail[i].payee_id)
                        }
                    }
                    this.payment = Object.assign(this.payment, data)
                })
            },
            changePayee (id, index) {
                if (this.payment.detail.length && this.payment.payees.includes(id)) {
                    this.payment.detail[index].activate = false
                } else if (this.payment.detail.length) {
                    this.payment.detail[index].activate = true
                }
                if (this.payment.payees.includes(id)) {
                    for (let i = 0; i < this.payment.payees.length; i++) {
                        if (id === this.payment.payees[i]) {
                            this.payment.payees.splice(i, 1)
                        }
                    }
                } else {
                    this.payment.payees.push(id)
                }
            }
        },
        components: {
            level: require('../../components/level')
        }
    }

</script>
