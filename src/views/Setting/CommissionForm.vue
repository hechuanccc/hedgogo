<template>
<div>
    <div class="m-b">
        <ol class="breadcrumb">
            <li class="active"><router-link to="/commission">{{ $t('title.commission') }}</router-link></li>
            <li class="active">{{ $route.meta.title }}</li>
        </ol>
    </div>
    <form @submit.prevent="onSubmit">
        <div class="row m-b-sm">
            <div class="col-xs-12" v-if="commissionsetting.id">
                <span class="v-m pull-left p-t-sm m-l-xs">{{ $t('user.agent_count') }}：{{ commissionsetting.agent_count || 0 }}</span>
                <button
                    type="button"
                    class="md-btn pull-right danger"
                    @click="deleteMode = true"
                    :disabled="commissionsetting.agent_count > 0"
                    v-if="$root.permissions.includes('delete_commission_setting') && !deleteMode"
                >{{ $t('dic.delete') }}
                </button>
                <button
                    type="button"
                    class="md-btn md-flat pull-right w-xs"
                    @click="deleteMode = false"
                    v-if="deleteMode"
                >{{ $t('dic.cancel') }}
                </button>
                <button
                    type="button"
                    class="md-btn danger pull-right m-r-xs"
                    @click="deleteCommission"
                    v-if="deleteMode"
                >
                    <i class="fa fa-spin fa-spinner" v-if="deleteLoading"></i>
                    {{ $t('system_msg.confirm_action_object', {
                        action: $t('dic.delete')
                    }) }}
                    
                </button>
            </div>
        </div>
        <div class="box">
            <div class="box-body row">
                <div class="col-xs-4">
                    <h5 class="p-a-sm">{{ $t('title.basic_setting') }}</h5>
                    <div class="clearfix">
                        <label class="col-xs-4 text-right form-control-label">{{ $t('dic.name') }} </label>
                        <div class="col-xs-6">
                            <input
                                class="form-control"
                                v-model="commissionsetting.name"
                                required
                                :disabled="!updateCommissionSettingPermission"
                                ref="name"
                            >
                        </div>
                    </div>
                    <div class="clearfix m-t-sm">
                        <label class="col-xs-4 text-right form-control-label">{{ $t('user.valid_member') }} </label>
                        <div class="col-xs-4">
                            <input
                                type="number"
                                min="0"
                                class="form-control"
                                v-model="commissionsetting.groups[0].member_num"
                                required
                                :disabled="!updateCommissionSettingPermission"
                            >
                        </div>
                    </div>
                </div>
                <div class="col-xs-5 col-xs-offset-1">
                    <h5 class="p-a-sm m-b-0">{{ $t('title.commission') }}</h5>
                    <div class="row text-center p-l">
                        <div class="col-xs-4 p-t-sm">{{ $t('finance.income_threshold') }}</div>
                        <div class="col-xs-3 col-xs-offset-1 p-t-sm">{{ $t('finance.commission_rate') }}</div>
                        <div class="col-xs-3 col-xs-offset-1 text-center" v-if="updateCommissionSettingPermission">
                            <button
                                type="button"
                                class="btn btn-sm w-xs grey-600"
                                @click="addConfig"
                            >
                                {{ $t('system.add_group') }}
                            </button>
                        </div>
                    </div>
                    <div class="row m-t-sm p-l" v-for="(rate, index) in commissionsetting.groups[0].rates" :key="index">
                        <div class="col-xs-4 input-group">
                            <span class="input-group-addon">￥</span>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                :max="1000000000"
                                class="form-control text-right"
                                v-model.number="rate.income_threshold"
                                :ref="'income_threshold'"
                                :required="rate.rate > 0 || index === 0"
                                :disabled="!updateCommissionSettingPermission"
                            />
                        </div>
                        <div class="col-xs-3 col-xs-offset-1 input-group">
                            <input
                                type="number"
                                step="1"
                                min="0"
                                class="form-control text-right"
                                v-model.number="rate.rate"
                                :required="rate.income_threshold > 0 || index === 0"
                                :disabled="!updateCommissionSettingPermission"
                            />
                            <span class="input-group-addon">%</span>
                        </div>
                        <div class="col-xs-3 col-xs-offset-1 text-center v-m p-t-xs" v-if="updateCommissionSettingPermission">
                            <a
                                v-if="index"
                                @click="deleteConfig(index)"
                            >{{ $t('dic.delete') }}</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row p-l" v-if="updateCommissionSettingPermission">
            <button
                :disabled="!updateCommissionSettingPermission"
                class="md-btn w-sm blue"
            >
                <span v-if="!loading">{{ $t('dic.submit') }}</span>
                <i class="fa fa-spin fa-spinner" v-else></i>
            </button>
        </div>
    </form>
</div>
</template>
<script>
import { getSetting, updateSetting, deleteSetting } from '../../service'
import $ from '../../utils/util'

export default {
    data () {
        return {
            id: '',
            commissionsetting: {
                name: '',
                status: 1,
                groups: [{
                    member_num: 0,
                    rates: [{
                        rate: '',
                        income_threshold: ''
                    }]
                }]
            },
            deleteMode: false,
            deleteLoading: false,
            loading: true
        }
    },
    created () {
        let id = this.$route.params.commissionId
        if (id) {
            this.id = id
            this.getCommissionSetting(id)
        } else {
            this.loading = false
            this.$nextTick(() => {
                this.$refs.name.select()
            })
        }
    },
    computed: {
        updateCommissionSettingPermission () {
            return this.$route.params.commissionId ? this.$root.permissions.includes('update_commission_setting') : this.$root.permissions.includes('add_commission_setting')
        }
    },
    methods: {
        getCommissionSetting (id) {
            getSetting('commission', { id }).then(data => {
                data.groups && data.groups[0].rates.sort((a, b) => a.income_threshold - b.income_threshold)
                Object.assign(this.commissionsetting, data)
                this.addConfig()
            }).catch($.errorNotify)
            .finally(() => { this.loading = false })
        },
        deleteConfig (index) {
            this.commissionsetting.groups[0].rates.splice(index, 1)
        },
        addConfig () {
            this.commissionsetting.groups[0].rates.push({
                rate: '',
                income_threshold: ''
            })
        },
        onSubmit (e) {
            let data = Object.assign({}, this.commissionsetting)
            data.groups[0].rates = data.groups[0].rates.filter(element => {
                return element.income_threshold !== '' && element.rate !== ''
            })
            data.groups[0].rates.sort((a, b) => a.income_threshold - b.income_threshold)
            let validation = this.incomeThresholdValidate(data.groups[0].rates)
            if (typeof validation === 'number') {
                this.$refs.income_threshold[validation].select()
                $.notify({
                    message: this.$t('finance.income_threshold') + this.$t('misc.repeated'),
                    type: 'warning'
                })
                return
            }
            this.$delete(data, 'id')
            this.$delete(data, 'agent_count')
            this.$delete(data, 'group_count')
            this.$delete(data, 'rates')
            this.$delete(data, 'member_num')
            this.loading = true
            updateSetting('commission', {
                id: this.id,
                data
            }, {
                action: this.id ? this.$t('dic.update') : this.$t('dic.create'),
                object: this.$t('dic.commission')
            }).then(data => {
                this.$router.push('/commission/')
            }).finally(() => { this.loading = false })
        },
        deleteCommission () {
            this.deleteLoading = true
            deleteSetting('commission', this.commissionsetting.id, {
                action: this.$t('dic.delete'),
                object: this.$t('dic.commission')
            }).then(() => {
                this.deleteMode = false
                this.$router.push('/commission')
            }, () => {
                this.deleteLoading = false
            })
        },
        incomeThresholdValidate (rates) {
            let judge = true
            for (let i = 0; i < rates.length - 1; ++i) {
                if (rates[i].income_threshold === rates[i + 1].income_threshold) {
                    judge = i
                    break
                }
            }
            return judge
        }
    }
}
</script>
