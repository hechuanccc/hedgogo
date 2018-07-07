<template>
<div>
    <ol class="breadcrumb">
        <li class="active"><router-link to="/level">{{ $t('title.member_level') }}</router-link></li>
        <li class="active">{{ $route.meta.title }}</li>
    </ol>
    <div class="box">
        <div class="box-body">
            <form class="form m-a" @submit.prevent="onSubmit">
                <div class="row b-b m-b">
                    <div class="col-xs-5">
                        <div class="form-group">
                            <label for="level-name" class="label-width">
                                {{ $t('dic.name') }}
                            </label>
                            <div class="inline-form-control">
                                <input
                                    class="form-control w-sm"
                                    v-model="level.name"
                                    required
                                />
                            </div>
                        </div>
                        <div class="form-group">
                            <label
                                for="remit-limit"
                                class="label-width"
                            >{{ $t('finance.remit_limit') }}
                            </label>
                            <input
                                class="form-control w-sm inline"
                                type="number"
                                placeholder="下限或留空"
                                v-model="level.remit_limit.lower"
                            />
                            <span>&nbsp;~&nbsp;</span>
                            <input
                                class="form-control w-sm inline"
                                type="number"
                                placeholder="上限或留空"
                                v-model="level.remit_limit.upper"
                            />
                        </div>

                        <div class="form-group">
                            <label
                                for="online-limit"
                                class="label-width"
                            >{{ $t('finance.online_pay_limit') }}
                            </label>
                            <input
                                class="form-control w-sm inline"
                                type="number"
                                placeholder="下限或留空"
                                v-model="level.online_limit.lower"
                            />
                            <span>&nbsp;~&nbsp;</span>
                            <input
                                class="form-control w-sm inline"
                                type="number"
                                placeholder="上限或留空"
                                v-model="level.online_limit.upper"
                            />
                        </div>
                        <div class="form-group p-b">
                            <label
                                for="withdraw-limit"
                                class="label-width"
                            >{{ $t('finance.withdraw_limit') }}
                            </label>
                            <input
                                class="form-control w-sm inline"
                                type="number"
                                placeholder="下限或留空"
                                v-model="level.withdraw_limit.lower"
                            />
                            <span>&nbsp;~&nbsp;</span>
                            <input
                                class="form-control w-sm inline"
                                type="number"
                                placeholder="上限或留空"
                                v-model="level.withdraw_limit.upper"
                            />
                        </div>
                        <div class="form-group p-b b-b">
                            <label
                                for="withdraw-limit"
                                class="label-width-md"
                            >{{ $t('finance.withdraw_limit_count_per_day') }}
                            </label>
                            <input
                                class="form-control w-sm inline"
                                type="number"
                                v-model="level.max_withdraw_count_per_day"
                            />
                        </div>
                        <div class="form-group m-t-md b-b">
                            <label
                                for="reg-present"
                                class="label-width"
                            >{{ $t('finance.register_present') }}
                            </label>
                            <div class="row text-muted">
                                <label class="col-xs-2">{{ $t('system.enabled_status') }}</label>
                                <label class="col-xs-3">{{ $t('finance.register_present_bank_info') }}</label>
                                <label class="col-xs-3">{{ $t('finance.register_present_amount') }}</label>
                                <label class="col-xs-3">{{ $t('finance.audit_amount') }}</label>
                            </div>
                            <div class="form-group row">
                                <div class="col-xs-2">
                                    <label class="ui-switch blue m-t-xs m-r">
                                        <input type="checkbox" v-model="level.reg_present.status">
                                        <i></i>
                                    </label>
                                </div>
                                <div class="col-xs-3">
                                    <label class="ui-switch blue m-t-xs m-r">
                                        <input type="checkbox" v-model="level.reg_present.need_bankinfo">
                                        <i></i>
                                    </label>
                                </div>
                                <div class="col-xs-3">
                                    <input
                                        type="number"
                                        class="form-control w-sm"
                                        v-model="level.reg_present.amount"
                                    />
                                </div>
                                <div class="col-xs-3">
                                    <input
                                        type="number"
                                        class="form-control w-sm"
                                        v-model="level.reg_present.check_amount"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="form-group m-t-md">
                            <label
                                for="baudit-ratio"
                                class="label-width"
                            >{{ $t('finance.deposit_audit_ratio') }}</label>
                            <div class="form-group row">
                                <div class="col-xs-4">
                                    <label class="text-muted">{{ $t('finance.remit') }}&nbsp;%</label>
                                    <input
                                        type="number"
                                        class="form-control"
                                        v-model="level.deposit_check.remit_pay"
                                    />
                                </div>
                                <div class="col-xs-4">
                                    <label class="text-muted">{{ $t('finance.online_pay') }}&nbsp;%</label>
                                    <input
                                        type="number"
                                        class="form-control"
                                        v-model="level.deposit_check.online_pay"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-6 col-xs-offset-1">
                        <div class="form-group b-b">
                            <label
                                for="bremit-offer"
                                class="label-width"
                            >{{ $t('finance.remit_discount') }}
                            </label>
                            <input
                                type="button"
                                class="btn grey-600 btn-sm pull-right"
                                @click="addDiscounts(level.remit_discounts, 1)"
                                value="新增一组"
                            />
                            <div class="row text-muted">
                                <label class="col-xs-3">{{ $t('finance.deposit_amount') }}</label>
                                <label class="col-xs-2">{{ $t('finance.discount_rate') }}&nbsp;%</label>
                                <label class="col-xs-2">{{ $t('finance.audit_multiple') }}</label>
                                <label class="col-xs-2">{{ $t('finance.discount_limit') }}</label>
                            </div>
                            <div
                                class="form-group row"
                                :key="index"
                                v-for="(remit_discount, index) in level.remit_discounts"
                            >
                                <div class="col-xs-3 p-r-0">
                                    <input
                                        type="number"
                                        class="form-control"
                                        v-model="remit_discount.threshold"
                                        :required="isRequired(remit_discount)"
                                    />
                                </div>
                                <div class="col-xs-2 p-r-0">
                                    <input
                                        type="number"
                                        :required="isRequired(remit_discount)"
                                        class="form-control"
                                        v-model="remit_discount.rate"
                                    >
                                </div>
                                <div class="col-xs-2 p-r-0">
                                    <input
                                        type="number"
                                        :required="isRequired(remit_discount)"
                                        class="form-control"
                                        v-model="remit_discount.check_rate"
                                    >
                                </div>
                                <div class="col-xs-2 p-r-0">
                                    <input
                                        type="number"
                                        placeholder="可留空"
                                        class="form-control"
                                        v-model="remit_discount.limit"
                                    >
                                </div>
                                <div class="col-xs-3">
                                    <a
                                        class="pull-right"
                                        v-if="index > 0"
                                        @click="deleteDiscount(level.remit_discounts, index)"
                                    >{{ $t('dic.delete') }}
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div class="form-group m-t-md b-b">
                            <label for="birthday" class="label-width">{{ $t('finance.online_pay_discount') }}</label>
                            <input
                                type="button"
                                class="btn grey-600 btn-sm pull-right"
                                @click="addDiscounts(level.online_discounts, 2)"
                                value="新增一组"
                            />
                            <div class="row text-muted">
                                <label class="col-xs-3">{{ $t('finance.deposit_amount') }}</label>
                                <label class="col-xs-2">{{ $t('finance.discount_rate') }}&nbsp;%</label>
                                <label class="col-xs-2">{{ $t('finance.audit_multiple') }}</label>
                                <label class="col-xs-2">{{ $t('finance.discount_limit') }}</label>
                            </div>
                            <div
                                class="form-group row"
                                :key="index"
                                v-for="(online_discount, index) in level.online_discounts"
                            >
                                <div class="col-xs-3 p-r-0">
                                    <input
                                        type="number"
                                        :required="isRequired(online_discount)"
                                        v-model="online_discount.threshold"
                                        class="form-control"
                                    />
                                </div>
                                <div class="col-xs-2 p-r-0">
                                    <input
                                        type="number"
                                        :required="isRequired(online_discount)"
                                        v-model="online_discount.rate"
                                        class="form-control"
                                    />
                                </div>
                                <div class="col-xs-2 p-r-0">
                                    <input
                                        type="number"
                                        :required="isRequired(online_discount)"
                                        v-model="online_discount.check_rate"
                                        class="form-control"
                                    />
                                </div>
                                <div class="col-xs-2 p-r-0">
                                    <input
                                        type="number"
                                        v-model="online_discount.limit"
                                        placeholder="可留空"
                                        class="form-control"
                                    />
                                </div>
                                <div class="col-xs-3">
                                    <a
                                        class="pull-right"
                                        v-if="index > 0"
                                        @click="deleteDiscount(level.online_discounts, index)"
                                    >{{ $t('dic.delete') }}
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div class="form-group row">
                            <label for="memo" class="col-xs-12">{{ $t('dic.memo') }}</label>
                            <div class="col-xs-8 p-r-0">
                                <textarea
                                    class="form-control"
                                    rows="4"
                                    v-model="level.memo"
                                >
                                </textarea>
                            </div>
                        </div>
                    </div>
                </div>
                <button type="submit" class="md-btn w-sm blue">
                    <i class="fa fa-spin fa-spinner" v-if="loading"></i>
                    <span v-else>{{ $t('dic.submit') }}</span>
                </button>
            </form>
        </div>
    </div>
</div>

</template>
<script>
import { getSetting, updateSetting } from '../../service'

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
                max_withdraw_count_per_day: null,
                memo: '',
                reg_present: {
                    status: 0,
                    amount: 0,
                    check_amount: 0,
                    need_bankinfo: 0
                },
                deposit_check: {
                    remit_pay: '',
                    online_pay: ''
                }
            },
            loading: false
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
                if (!(d.rate || d.threshold || d.check_rate || d.limit)) {
                    discounts.splice(idx, 1)
                }
            }
        },
        addDiscounts (target, type) {
            if (target.length <= 5) {
                target.push({
                    type
                })
            }
        },
        deleteDiscount (target, index) {
            target.splice(index, 1)
        },
        onSubmit (e) {
            this.loading = true
            this.verifyDiscounts(this.level.remit_discounts)
            this.verifyDiscounts(this.level.online_discounts)
            if (!this.level.max_withdraw_count_per_day) {
                this.level.max_withdraw_count_per_day = null
            }
            updateSetting('memberLevel', {
                id: this.level.id,
                data: this.level
            }, {
                action: this.level.id ? this.$t('dic.update') : this.$t('dic.create'),
                object: this.$t('dic.member_level')
            }).then(data => {
                this.$router.push('/level/' + data.id)
            })
        },
        getLevel (id) {
            this.loading = true
            getSetting('memberLevel', { id }).then(data => {
                let onlineDiscounts = data.online_discounts
                if (!onlineDiscounts.length) {
                    data.online_discounts = [{
                        type: 2
                    }]
                }

                let remitDiscounts = data.remit_discounts
                if (!remitDiscounts.length) {
                    data.remit_discounts = [{
                        type: 1
                    }]
                }
                for (let key in data) {
                    if (data[key] === null) delete data[key]
                }
                this.level = Object.assign(this.level, data)
                this.loading = false
            })
        }
    }
}
</script>
