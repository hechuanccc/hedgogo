<template>
<div>
    <ol class="breadcrumb">
        <li class="active"><router-link to="/level">{{ $t('title.member_level') }}</router-link></li>
        <li class="active">{{ $route.meta.title }}</li>
    </ol>
    <div class="box">
        <div class="box-header p-b-xs b-b">
            <div class="row">
                <div class="col-md-4">
                    <h2 class="m-t-sm">{{ `${$t('title.member_level')}：${name}` }}</h2>
                </div>
                <div class="col-md-8 text-right" v-if="id">
                    <router-link
                        class="md-btn md-flat m-r-sm"
                        to="/level/add"
                        v-if="$root.permissions.includes('add_member_level')"
                    >{{ $t('dic.create') }}
                    </router-link>
                    <router-link
                        class="md-btn md-flat m-r-sm"
                        v-if="$root.permissions.includes('update_memberlevel')"
                        :to="'/level/' + id + '/edit'"
                    >{{ $t('dic.update') }}
                    </router-link>
                    <!-- trial, test, and normal member level couldn't be deleted -->
                    <a
                        class="md-btn md-flat"
                        @click="deleteLevel(id, $event)"
                        v-if="id && !(id === 1 || id === 2 || id === 3) && $root.permissions.includes('delete_member_level')"
                    >{{ $t('dic.delete') }}
                    </a>
                </div>
            </div>
        </div>
        <div class="box-body">
            <div class="row m-b p-b b-b">
                <div class="col-xs-3">
                    <span class="text-muted">{{ $t('finance.remit_limit') }}</span>
                    <div v-if="remit_limit && (remit_limit.lower || remit_limit.upper)">
                        <span v-if="remit_limit.upper && remit_limit.lower">{{ remit_limit.lower }} 至 {{ remit_limit.upper }}</span>
                        <span v-else-if="!remit_limit.lower">不高于 {{ remit_limit.upper }}</span>
                        <span v-else-if="!remit_limit.upper">不低于 {{ remit_limit.lower }}</span>
                    </div>
                    <p v-else>
                        {{ $t('system.no_setting') }}
                    </p>
                </div>
                <div class="col-xs-3">
                    <span class="text-muted">{{ $t('finance.online_pay_limit') }}</span>
                    <div v-if="online_limit && (online_limit.lower || online_limit.upper)">
                        <span v-if="online_limit.upper && online_limit.lower">{{ online_limit.lower }} 至 {{ online_limit.upper }}</span>
                        <span v-else-if="!online_limit.lower">不高于 {{ online_limit.upper }}</span>
                        <span v-else-if="!online_limit.upper">不低于 {{ online_limit.lower }}</span>
                    </div>
                    <p v-else>
                        {{ $t('system.no_setting') }}
                    </p>
                </div>
                <div class="col-xs-3">
                    <span class="text-muted">{{ $t('finance.withdraw_limit') }}</span>
                    <div v-if="withdraw_limit && (withdraw_limit.lower || withdraw_limit.upper)">
                        <span v-if="withdraw_limit.upper && withdraw_limit.lower">{{ withdraw_limit.lower }} 至 {{ withdraw_limit.upper }}</span>
                        <span v-else-if="!withdraw_limit.lower">不高于 {{ withdraw_limit.upper }}</span>
                        <span v-else-if="!withdraw_limit.upper">不低于 {{ withdraw_limit.lower }}</span>
                    </div>
                    <p v-else>
                        {{ $t('system.no_setting') }}
                    </p>
                </div>
                <div class="col-xs-3">
                    <span class="text-muted">{{ $t('finance.withdraw_limit_count_per_day') }}</span>
                    <p>
                        <span v-if="max_withdraw_count_per_day !== null">{{ max_withdraw_count_per_day }}</span>
                        <span v-else>{{ $t('system.no_setting') }}</span>
                    </p>
                </div>
            </div>

            <div class="row m-b b-b p-b" >
                <div class="col-xs-5" >
                    <p class="text-muted">{{ $t('finance.remit_discount') }}</p>
                    <table class="table table-sm  light-blue-50 text-center" v-if="remit_discounts.length > 0">
                        <thead>
                            <tr>
                                <th class="text-center">{{ $t('finance.deposit_amount') }}</th>
                                <th class="text-center">{{ $t('finance.discount_rate') }}&nbsp;%</th>
                                <th class="text-center">{{ $t('finance.audit_multiple') }}</th>
                                <th class="text-center">{{ $t('finance.discount_limit') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr :key="r.id" v-for="r in remit_discounts" >
                                <td>{{ r.threshold }}</td>
                                <td>{{ r.rate }}&nbsp;%</td>
                                <td>{{ r.check_rate }}</td>
                                <td>
                                    <span v-if="r.limit">{{ r.limit }}</span>
                                    <span v-else class="text-muted">{{ $t('misc.no_limit') }}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <p class="label" v-else>{{ $t('finance.remit_discount_no_set') }}</p>
                </div>

                <div class="col-xs-5">
                    <p class="text-muted">{{ $t('finance.online_pay_discount') }}</p>
                    <table class="table table-sm light-blue-50 text-center" v-if="online_discounts.length > 0">
                        <thead>
                            <tr>
                                <th class="text-center">{{ $t('finance.deposit_amount') }}</th>
                                <th class="text-center">{{ $t('finance.discount_rate') }}&nbsp;%</th>
                                <th class="text-center">{{ $t('finance.audit_multiple') }}</th>
                                <th class="text-center">{{ $t('finance.discount_limit') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr :key="d.id" v-for="d in online_discounts">
                                <td>{{ d.threshold }}</td>
                                <td>{{ d.rate }}&nbsp;%</td>
                                <td>{{ d.check_rate }}</td>
                                <td>
                                    <span v-if="d.limit">{{ d.limit }}</span>
                                    <span v-else class="text-muted">{{ $t('misc.no_limit') }}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <p class="label" v-else>{{ $t('finance.online_pay_discount_no_set') }}</p>
                </div>
            </div>

            <div class="row m-b b-b p-b">
                <div class="col-xs-5">
                    <p class="text-muted">{{ $t('finance.register_present') }}</p>
                    <table class="table table-sm light-blue-50 text-center" v-if="reg_present">
                        <thead>
                            <tr>
                                <th class="text-center">{{ $t('system.enabled_status') }}</th>
                                <th class="text-center">{{ $t('finance.register_present_bank_info') }}</th>
                                <th class="text-center">{{ $t('finance.register_present_amount') }}</th>
                                <th class="text-center">{{ $t('finance.audit_amount') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr >
                                <td>
                                    <span class="label success" v-if="reg_present.status == 1">{{ $t('status.active') }}</span>
                                    <span class="label danger" v-else>{{ $t('status.disabled') }}</span>
                                </td>
                                <td>
                                    <span class="label success" v-if="reg_present.need_bankinfo == 1">{{ $t('status.yes') }}</span>
                                    <span class="label danger" v-else>{{ $t('status.no') }}</span>
                                </td>
                                <td>{{ reg_present.amount }}</td>
                                <td>{{ reg_present.check_amount }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <p class="label" v-else>{{ $t('system.no_setting') }}</p>
                </div>
                <div class="col-xs-5">
                    <p class="text-muted">{{ $t('finance.deposit_audit_ratio') }}</p>
                    <table class="table table-sm light-blue-50 text-center" v-if="deposit_check">
                        <thead>
                            <tr>
                                <th class="text-center">{{ $t('finance.remit') }}</th>
                                <th class="text-center">{{ $t('finance.online_pay') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr >
                                <td>
                                    <span v-if="deposit_check.remit_pay">{{ deposit_check.remit_pay }}&nbsp;%</span>
                                    <span v-else class="label">{{ $t('system.no_setting') }}</span>
                                </td>
                                <td>
                                    <span v-if="deposit_check.online_pay">{{ deposit_check.online_pay }}&nbsp;%</span>
                                    <span v-else class="label">{{ $t('system.no_setting') }}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <p class="label" v-else>{{ $t('system.no_setting') }}</p>
                </div>
            </div>

            <div class="row m-b b-b p-b">
                <div class="col-xs-5">
                    <p class="text-muted">{{ $t('dic.memo') }}</p>
                    <p class="m-b-xs" v-if="memo">{{ memo }}</p>
                    <p class="m-b-xs" v-else>{{ $t('dic.no_memo') }}</p>
                </div>
            </div>

            <div class="row p-b b-b">
                <div class="col-xs-5">
                    <p class="text-muted">{{ $t('finance.remit_account_available') }} 共 {{ remit_payee.length }} 个</p>
                    <router-link
                        :to="'/remit_payee/' + p.id"
                        :key="p.id"
                        v-for="p in remit_payee"
                        class="m-r-sm"
                    >{{ p.payee_name || p.nickname }}
                    </router-link>
                </div>
                <div class="col-xs-4">
                    <p class="text-muted">{{ $t('finance.online_pay_available') }} 共 {{ online_payee.length }}  个</p>
                    <router-link
                        :to="'/online_payee/' + p.id"
                        :key="p.id"
                        v-for="p in online_payee"
                        class="m-r-sm"
                    >{{ p.name }}
                    </router-link>
                </div>
            </div>

            <div class="row p-t">
                <div class="col-xs-5">
                    <p :class="{'text-muted': !member_count}">
                        {{ $t('user.member_count') }}：
                        <router-link :to="`/member?level=${id}`" v-if="member_count">{{ member_count }}</router-link>
                        <span v-else>{{ member_count }}</span>
                    </p>
                </div>
                <div class="col-xs-5">
                    <p :class="{'text-muted': !agent_count}">{{ $t('user.agent_count') }}：{{ agent_count }}</p>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import { getSetting, deleteSetting } from '../../service'

export default {
    data () {
        return {
            remit_discounts: [{
                threshold: '',
                rate: '',
                checkRate: '',
                limit: ''
            }],
            online_discounts: [{
                threshold: '',
                rate: '',
                checkRate: '',
                limit: ''
            }],
            online_discount: [],
            id: '',
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
            max_withdraw_count_per_day: '',
            memo: '',
            reg_present: {
                status: 0,
                amount: '',
                checkAmount: '',
                need_bankinfo: 0
            },
            deposit_check: {
                company: '',
                online: ''
            },
            remit_payee: [],
            online_payee: [],
            member_count: '',
            agent_count: ''
        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            vm.id = parseInt(to.params.levelId)
            vm.getLevel(vm.id)
        })
    },
    methods: {
        deleteLevel (id, event) {
            if (!window.confirm(this.$t('system_msg.confirm_action_object', {
                action: event.target.innerText
            }))) {
                return
            }
            deleteSetting('memberLevel', id, {
                action: this.$t('dic.delete'),
                object: this.$t('dic.member_level')
            }).then(() => {
                this.$router.push('/level')
            })
        },
        getLevel (id) {
            getSetting('memberLevel', { id }).then(data => {
                for (let key in data) {
                    this[key] = data[key]
                }
            })
        }
    }
}
</script>
