<template>
<div>
    <div class="m-b">
        <ol class="breadcrumb">
            <li class="active"><router-link to="/commission">{{ $t('nav.setting_commission') }}</router-link></li>
            <li class="active">{{ $route.meta.title }}</li>
        </ol>
    </div>
    <form @submit.prevent="onSubmit">
        <div class="row m-b-sm">
            <div class="col-xs-12" v-if="commissionsetting.id">
                <span class="v-m pull-left p-t-sm m-l-xs">{{ $t('common.agent_count') }}：{{ commissionsetting.agent_count || 0 }}</span>
                <button
                    type="button"
                    class="md-btn md-flat pull-right t-red"
                    @click="deleteMode = true"
                    :disabled="commissionsetting.agent_count > 0"
                    v-if="$root.permissions.includes('delete_commission_setting') && !deleteMode"
                >{{ $t('setting.delete_commission_setting') }}
                </button>
                <button
                    type="button"
                    class="md-btn md-flat pull-right w-xs"
                    @click="deleteMode = false"
                    v-if="deleteMode"
                >{{ $t('action.cancel') }}
                </button>
                <button
                    type="button"
                    class="md-btn blue pull-right w-xs m-r-xs"
                    @click="deleteCommission"
                    v-if="deleteMode"
                >
                    <span v-if="!deleteLoading">{{ $t('commission.confirm_delete') }}</span>
                    <i class="fa fa-spin fa-spinner" v-else></i>
                </button>
            </div>
        </div>
        <div class="box">
            <div class="box-body row">
                <div class="col-xs-4">
                    <h5 class="p-a-sm">{{ $t('common.basic_setting') }}</h5>
                    <div class="clearfix">
                        <label class="col-xs-4 text-right form-control-label">{{ $t('common.name') }} </label>
                        <div class="col-xs-6">
                            <input
                                class="form-control"
                                v-model="commissionsetting.name"
                                required
                                :disabled="!updateCommissionSettingPermission"
                            >
                        </div>
                    </div>
                    <div class="clearfix m-t-sm">
                        <label class="col-xs-4 text-right form-control-label">{{ $t('setting.valid_member') }} </label>
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
                    <h5 class="p-a-sm m-b-0">{{ $t('commission.name') }}</h5>
                    <div class="row text-center p-l">
                        <div class="col-xs-4 p-t-sm">{{ $t('commission.income_threshold') }}</div>
                        <div class="col-xs-3 col-xs-offset-1 p-t-sm">{{ $t('commission.commission_rate') }}</div>
                        <div class="col-xs-3 col-xs-offset-1 text-center" v-if="updateCommissionSettingPermission">
                            <button
                                type="button"
                                class="btn btn-sm w-xs grey-600"
                                @click="addConfig"
                            >
                                {{ $t('action.add_group') }}
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
                            >{{ $t('action.delete') }}</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row p-l" v-if="updateCommissionSettingPermission">
            <button
                :disabled="!updateCommissionSettingPermission"
                type="submit"
                class="md-btn w-sm blue"
            >
                <span v-if="!loading">{{ $t('common.save') }}</span>
                <i class="fa fa-spin fa-spinner" v-else></i>
            </button>
        </div>
    </form>
</div>
</template>
<script>
import api from '../../api'
import $ from '../../utils/util'

export default {
    data () {
        return {
            api: api.commission,
            id: '',
            commissionsetting: {
                name: '',
                status: 1,
                groups: [{
                    member_num: '',
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
        }
    },
    computed: {
        updateCommissionSettingPermission () {
            return this.$route.params.commissionId ? this.$root.permissions.includes('update_commission_setting') : this.$root.permissions.includes('add_commission_setting')
        }
    },
    methods: {
        getCommissionSetting (id) {
            this.$http.get(this.api + id).then(data => {
                data.groups && data.groups[0].rates.sort((a, b) => a.income_threshold - b.income_threshold)
                Object.assign(this.commissionsetting, data)
                this.addConfig()
                this.loading = false
            }, error => {
                $.notify({
                    message: error,
                    type: 'danger'
                })
            })
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
            if (typeof this.incomeThresholdValidate(data.groups[0].rates) === 'number') {
                this.$refs.income_threshold[this.incomeThresholdValidate(data.groups[0].rates)].select()
                $.notify({
                    message: this.$t('commission.income_threshold') + this.$t('common.repeat') + this.$t('action.key_in'),
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
            this.$http({
                method: this.commissionsetting.id ? 'put' : 'post',
                url: `${this.api}${this.id && this.id + '/'}`,
                data
            }).then(data => {
                $.notify({
                    message: `${this.id ? this.$t('action.update') : this.$t('action.create')}${this.$t('commission.name')}${this.$t('status.success')}`
                })
                this.$router.push('/commission/')
                this.loading = false
            }, error => {
                $.notify({
                    message: error,
                    type: 'danger'
                })
                this.loading = false
            })
        },
        deleteCommission () {
            this.deleteLoading = true
            this.$http.delete(this.api + this.commissionsetting.id + '/').then(() => {
                this.deleteMode = false
                $.notify({
                    message: this.$t('action.delete') + this.$t('status.success')
                })
                this.$router.push('/commission')
            }, error => {
                this.deleteLoading = false
                $.notify({
                    message: error,
                    type: 'danger'
                })
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
