<template>
    <div>
            <div class="m-b">
                <ol class="breadcrumb">
                    <li class="active"><router-link to="/level">{{$t('nav.setting_level')}}</router-link></li>
                    <li class="active">{{$route.meta.title}}</li>
                </ol>
            </div>
            <div class="alert alert-danger" v-show="!$root.permissions.includes('update_member_level') || !$root.permissions.includes('add_member_level')">{{$t('common.errorPermission')}}</div>
            <div class="box">
            <div class="box-body">
                <form class="form m-a" v-on:submit.prevent="onSubmit">
                    <div class="row b-b p-b m-b">
                        <div class="col-xs-5">
                            <div class="form-group p-b">
                                <label for="level-name" class="label-width">{{$t('common.name')}} </label>
                                <div class="inline-form-control">
                                    <input class="form-control w-sm" v-model="level.name" required  id="level-name">
                                </div>
                            </div>
                            <div class="form-group p-b" v-if="level.remit_limit">
                                <label for="agent" class="label-width">{{$t('level.remit_limit')}} </label>
                                <input  class="form-control w-sm inline" type="number" placeholder="下限或留空" v-model="level.remit_limit.lower">
                                <span> ~ </span>
                                <input  class="form-control w-sm inline" type="number" name="agent" placeholder="上限或留空" v-model="level.remit_limit.upper">
                            </div>

                            <div class="form-group p-b" v-if="level.online_limit">
                              <label for="agent" class="label-width">{{$t('level.online_pay_limit')}}</label>
                                <input  class="form-control w-sm inline" type="number" placeholder="下限或留空" v-model="level.online_limit.lower">
                                <span> ~ </span>
                                <input  class="form-control w-sm inline" type="number" name="agent" placeholder="上限或留空" v-model="level.online_limit.upper">
                            </div>
                            <div class="form-group b-b p-b" v-if="level.withdraw_limit">
                              <label for="agent" class="label-width">{{$t('level.withdraw_limit')}} </label>
                                <input  class="form-control w-sm inline" type="number" placeholder="下限或留空" v-model="level.withdraw_limit.lower">
                                <span> ~ </span>
                                <input  class="form-control w-sm inline" type="number" name="agent" placeholder="上限或留空" v-model="level.withdraw_limit.upper" >
                            </div>
                            <div class="form-group">
                                <label for="realname" class="label-width">{{$t('level.withdraw_fee_rate')}}</label>
                                <div class="inline-form-control">
                                    <input class="form-control w-sm" type="number" name="realname" placeholder="比如：100" v-model="level.withdraw_fee.rate" required>
                                </div>
                            </div>
                            <div class="form-group p-b b-b ">
                                <label for="phone" >{{$t('level.withdraw_fee_type')}}</label>
                                <div>
                                    <label class="radio md-check md-check-md m-b text-muted">
                                        <input type="radio" value="0" name="gender" v-model="level.withdraw_fee.type">
                                        <i class="blue"></i>
                                        {{$t('level.free')}}
                                    </label>
                                </div>
                                <div>
                                    <label class="radio md-check md-check-md m-b text-muted">
                                        <input type="radio" value="2" name="gender" v-model="level.withdraw_fee.type">
                                        <i class="blue"></i>
                                        {{$t('level.preset')}}
                                    </label>
                                    <div class="w-auto inline m-l-md m-b-md text-muted">
                                        <input type="number" class="form-control xsm-input inline" v-model="level.withdraw_fee.hour" :disabled="level.withdraw_fee.type!=2"/>
                                        <span> &nbsp;{{$t('level.hour')}}&nbsp; </span>
                                        <input type="number" class="form-control xsm-input inline" v-model="level.withdraw_fee.times" :disabled="level.withdraw_fee.type!=2"/>
                                        <span> &nbsp;{{$t('level.times')}} </span>
                                    </div>
                                </div>
                                <div>
                                    <label class="radio md-check md-check-md m-b text-muted">
                                        <input type="radio" value="1" name="gender" v-model="level.withdraw_fee.type">
                                        <i class="blue"></i>
                                        {{$t('level.everytime')}}
                                    </label>
                                </div>

                                <div class="text-danger">{{$t('level.withdraw_fee_type_danger')}}</div>

                            </div>
                            <div class="row m-b p-b b-b">
                                <div class="col-xs-8">
                                    <span class="text-muted">{{$t('level.display_report')}}</span>
                                    <div class="m-t">
                                        <span class="label success" v-show="level.report_flag">显示</span>
                                        <span class="label danger" v-show="!level.report_flag">隐藏</span>
                                        <a class="text-sm m-l" @click="change" v-show="level.report_flag" >隐藏</a>
                                        <a class="text-sm m-l" @click="change" v-show="!level.report_flag" >显示</a>
                                    </div>
                                </div>
                            </div>


                            <div class="form-group m-t-md">
                                <label for="serviceRate" class="label-width">{{$t('level.service_rate')}}</label>
                                <div class="inline-form-control">
                                    <input type="number" class="form-control w-lg inline" placeholder="存款稽核没有通过时，行政费用的金额比例" required v-model="level.service_rate">
                                    <span class="inline"> &nbsp; %</span>
                                </div>
                            </div>


                            <div class="form-group">
                              <label for="memo">{{$t('common.memo')}}</label>
                              <textarea class="form-control" rows="2" v-model="level.memo"></textarea>
                            </div>
                        </div>
                        <div class="col-xs-6 col-xs-offset-1">
                            <div class="form-group p-b b-b">
                                <label for="birthday" class="label-width">{{$t('level.remit_offer')}}</label>
                                <input type="button" class="btn grey-600 btn-sm pull-right" @click="addDiscounts(level.remit_discounts, 1)" value="新增一组"/>
                                <div class="row text-muted">
                                    <label class="col-xs-2">{{$t('level.rate')}}</label>
                                    <label class="col-xs-2">{{$t('level.threshold')}}</label>
                                    <label class="col-xs-2">{{$t('level.check_rate')}}</label>
                                    <label class="col-xs-2">{{$t('level.discount_limit')}}</label>
                                </div>
                                <div class="form-group row " v-for="(remit_discount, index) in level.remit_discounts">
                                    <div class="col-xs-2">
                                        <input type="number" :required="isRequired(remit_discount)" class="form-control" v-model="remit_discount.rate">
                                    </div>
                                    <div class="col-xs-2">
                                        <input type="number" :required="isRequired(remit_discount)" class="form-control" v-model="remit_discount.threshold">
                                    </div>
                                    <div class="col-xs-2">
                                        <input type="number" :required="isRequired(remit_discount)" class="form-control" v-model="remit_discount.check_rate">
                                    </div>
                                    <div class="col-xs-2">
                                        <input type="number" :required="isRequired(remit_discount)" placeholder="可留空" class="form-control input-sm" v-model="remit_discount.limit">
                                    </div>
                                    <div class="col-xs-4">
                                        <a class="pull-right" v-if="index > 0"  @click="deleteDiscount(level.remit_discounts, index)">{{$t('action.delete')}}</a>
                                    </div>
                                </div>
                            </div>

                            <div class="form-group m-t-md p-b b-b">
                                <label for="birthday" class="label-width">{{$t('level.online_pay_offer')}}</label>
                                <input type="button" class="btn grey-600 btn-sm pull-right" @click="addDiscounts(level.online_discounts, 2)" value="新增一组"/>
                                <div class="row text-muted">
                                    <label class="col-xs-2">{{$t('level.rate')}}</label>
                                    <label class="col-xs-2">{{$t('level.threshold')}}</label>
                                    <label class="col-xs-2">{{$t('level.check_rate')}}</label>
                                    <label class="col-xs-2">{{$t('level.discount_limit')}}</label>
                                </div>
                                <div class="form-group row" v-for="(online_discount, index) in level.online_discounts">
                                    <div class="col-xs-2">
                                        <input type="number" :required="isRequired(online_discount)" v-model="online_discount.rate" class="form-control">
                                    </div>
                                    <div class="col-xs-2">
                                        <input type="number" :required="isRequired(online_discount)" v-model="online_discount.threshold" class="form-control" >
                                    </div>
                                    <div class="col-xs-2">
                                        <input type="number" :required="isRequired(online_discount)" v-model="online_discount.check_rate" class="form-control">
                                    </div>
                                    <div class="col-xs-2">
                                        <input type="number" :required="isRequired(online_discount)" v-model="online_discount.limit" placeholder="可留空" class="form-control input-sm">
                                    </div>
                                    <div class="col-xs-4 block">
                                        <a class="pull-right" v-if="index > 0" @click="deleteDiscount(level.online_discounts, index)">{{$t('action.delete')}}</a>
                                    </div>
                                </div>
                            </div>

                            <div class="form-group m-t-md">
                                <label for="birthday" class="label-width">{{$t('level.reg_present')}}</label>
                                <div class="row text-muted">
                                    <label class="col-xs-2">{{$t('level.reg_present_status')}}</label>
                                    <label class="col-xs-2">{{$t('level.reg_present_allow_add')}}</label>
                                    <label class="col-xs-2">{{$t('level.reg_present_amount')}}</label>
                                    <label class="col-xs-2">{{$t('level.reg_present_check_amount')}}</label>
                                </div>
                                <div class="form-group row p-b-md b-b">
                                    <div class="col-xs-2">
                                        <label class="ui-switch info m-t-xs m-r">
                                            <input type="checkbox" v-model="level.reg_present.status">
                                            <i class="grey-200"></i>
                                        </label>
                                    </div>
                                    <div class="col-xs-2">
                                        <label class="ui-switch info m-t-xs m-r">
                                            <input type="checkbox" v-model="level.reg_present.allow_add">
                                            <i></i>
                                        </label>
                                    </div>
                                    <div class="col-xs-2">
                                        <input type="number" class="form-control"  v-model="level.reg_present.amount">
                                    </div>
                                    <div class="col-xs-2">
                                        <input type="number" class="form-control input-sm" v-model="level.reg_present.check_amount">
                                    </div>
                                </div>
                            </div>
                            <div class="form-group m-t-md ">
                                <label for="birthday" class="label-width">{{$t('level.deposit_audit_ratio')}}</label>
                                <div class="form-group row text-muted">
                                    <div class="col-xs-3">
                                        <label >{{$t('bill.remit')}}  %</label>
                                        <input type="number" class="form-control" v-model="level.deposit_check.remit_pay">
                                    </div>
                                    <div class="col-xs-3">
                                        <label >{{$t('bill.online_pay')}} %</label>
                                        <input type="number" class="form-control"  v-model="level.deposit_check.online_pay">
                                    </div>
                                    <div class="col-xs-3">
                                        <label >{{$t('bill.card_pay')}} %</label>
                                        <input type="number" class="form-control"  v-model="level.deposit_check.card_pay">
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div>
                        <div class="alert alert-danger" v-show="level.errorMsg">
                            <span>{{level.errorMsg}}</span>
                        </div>
                        <button :disabled="!$root.permissions.includes('update_member_level') || !$root.permissions.includes('add_member_level')" type="submit" class="md-btn w-sm blue">{{$t('common.save')}}</button>
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
            level: {
                id: '',
                remit_discounts: [{
                    type: 1
                }],
                online_discounts: [{
                    type: 2
                }],
                name: '',
                remit_limit: {
                    lower: '',
                    upper: ''
                },
                online_limit: {
                    lower: '',
                    upper: ''
                },
                withdraw_limit: {
                    lower: '',
                    upper: ''
                },
                withdraw_fee: {
                    value: '',
                    type: '0',
                    hour: '',
                    times: ''
                },
                field_locales: {
                    'remit_limit_upper': '公司支付限额有误：',
                    'online_limit_upper': '线上支付限额有误：',
                    'withdraw_limit_upper': '单次取款限额有误：',
                    'service_rate': '行政费用比例：'
                },
                errorMsg: '',
                memo: '',
                service_rate: '',
                reg_present: {
                    status: 0,
                    allow_add: 0,
                    amount: 0,
                    check_amount: 0
                },
                deposit_check: {
                    remit_pay: '',
                    online_pay: '',
                    card_pay: ''
                },
                report_flag: true
            }
        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            let id = to.params.levelId
            if (id) {
                vm.getLevel(id)
            }
        })
    },
    methods: {
        change () {
            this.level.report_flag = !this.level.report_flag
        },
        isRequired (discount) {
            if ((discount.rate || discount.threshold || discount.check_rate || discount.limit) === '') {
                return false
            }
            return discount.rate || discount.threshold || discount.check_rate || discount.limit
        },
        verifyDiscounts (discounts) {
            for (let idx in discounts) {
                let d = discounts[idx]
                if (!d.rate && !d.threshold & !d.check_rate & !d.limit) {
                    discounts.splice(idx, 1)
                }
            }
        },
        addDiscounts (target, type) {
            if (target.length <= 5) {
                target.push({
                    type: type
                })
            }
        },
        deleteDiscount (target, index) {
            target.splice(index, 1)
        },
        onSubmit (e) {
            if (this.level.id) {
                this.verifyDiscounts(this.level.remit_discounts)
                this.verifyDiscounts(this.level.online_discounts)
                this.$http.put(api.level + this.level.id + '/', this.level).then(data => {
                    this.$router.push('/level/' + data.id)
                }, error => {
                    this.level.errorMsg = error
                })
            } else {
                this.verifyDiscounts(this.level.remit_discounts)
                this.verifyDiscounts(this.level.online_discounts)
                this.$http.post(api.level, this.level).then(data => {
                    this.$router.push('/level/' + data.id)
                }, error => {
                    this.level.errorMsg = error
                })
            }
        },
        getLevel (id) {
            this.$http.get(api.level + id + '/').then(data => {
                let onlineDiscounts = data.online_discounts
                if (onlineDiscounts.length === 0) {
                    data.online_discounts = [{
                        type: 2
                    }]
                }

                let regPresent = data.reg_present
                if (regPresent === null) {
                    data.reg_present = this.level.reg_present
                }

                let remitDiscounts = data.remit_discounts
                if (remitDiscounts.length === 0) {
                    data.remit_discounts = [{
                        type: 1
                    }]
                }
                for (let e in data) {
                    if (!data[e]) delete data[e]
                }
                this.level = Object.assign(this.level, data)
            })
        }
    }
}
</script>
