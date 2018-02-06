<template>
    <div>
        <div class="m-b">
            <ol class="breadcrumb">
                <li class="active"><router-link to="/commission">{{$t('nav.setting_commission')}}</router-link></li>
                <li class="active">{{$route.meta.title}}</li>
            </ol>
        </div>
        <form @submit.prevent='onSubmit'>
            <div class="alert alert-success" v-if="deleted === 1">
                <span>{{$t('setting.deleted_commission_setting')}}</span>
            </div>

            <div class="alert alert-danger" v-if="deleted === -1">
                <span>{{errorMsg}}</span>
            </div>

            <div class="row m-b-sm">
                <div class="col-xs-12" v-if="commissionsetting.id">
                    <button
                        type="button"
                        class="md-btn md-flat pull-right t-red"
                        @click="deleteCommission"
                        :disabled="commissionsetting.agent_count > 0"
                        v-if="$root.permissions.includes('delete_commission_setting')"
                    >{{$t('setting.delete_commission_setting')}}
                    </button>
                    <span class="text-muted v-m pull-right count-label">{{$t('common.agent_count')}}：{{commissionsetting.agent_count || 0}}</span>
                </div>
            </div>
            <div class="box">
                <div class="box-body row">
                    <div class="col-xs-4">
                        <div class="clearfix">
                            <label class="col-xs-6 text-right form-control-label">{{$t('common.name')}} </label>
                            <div class="col-xs-3">
                                <input
                                    class="form-control"
                                    v-model="commissionsetting.name"
                                    required
                                    :disabled="!updateCommissionSettingPermission"
                                >
                            </div>
                        </div>

                        <div class="clearfix m-t">
                            <label class="col-xs-6 text-right form-control-label">{{$t('setting.com_deposit_max')}} </label>
                            <div class="col-xs-3">
                                <input
                                    type="number"
                                    min="0"
                                    class="form-control"
                                    v-model="commissionsetting.deposit_fee_max"
                                    :disabled="!updateCommissionSettingPermission"
                                    required
                                >
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-4">
                        <div class="clearfix">
                            <label class="col-xs-6 text-right form-control-label">{{$t('setting.com_min_bet')}} </label>
                            <div class="col-xs-3">
                                <input
                                    type="number"
                                    min="0"
                                    class="form-control"
                                    v-model="commissionsetting.invest_least"
                                    :disabled="!updateCommissionSettingPermission"
                                    required
                                >
                            </div>
                        </div>

                        <div class="clearfix m-t">
                            <label class="col-xs-6 text-right form-control-label">{{$t('setting.com_withdraw_fee')}} </label>
                            <div class="col-xs-3">
                                <input
                                    type="number"
                                    min="0"
                                    class="form-control"
                                    v-model="commissionsetting.withdraw_fee"
                                    :disabled="!updateCommissionSettingPermission"
                                    required
                                >
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-4">
                        <div class="clearfix">
                            <label class="col-xs-6 text-right form-control-label">{{$t('setting.com_deposit_fee')}} </label>
                            <div class="col-xs-3">
                                <input
                                    type="number"
                                    min="0"
                                    class="form-control"
                                    v-model="commissionsetting.deposit_fee"
                                    :disabled="!updateCommissionSettingPermission"
                                    required
                                >
                            </div>
                        </div>

                        <div class="clearfix m-t">
                            <label class="col-xs-6 text-right form-control-label">{{$t('setting.com_withdraw_max')}} </label>
                            <div class="col-xs-3">
                                <input
                                    type="number"
                                    min="0"
                                    class="form-control"
                                    v-model="commissionsetting.withdraw_fee_max"
                                    :disabled="!updateCommissionSettingPermission"
                                    required
                                >
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="box p-t p-b m-b clearfix" v-for="(group, index) in commissionsetting.groups" :key="index">
                <div class="clearfix b-b box-body">
                    <div class="col-xs-4">
                        <div class="form-group">
                            <label class="col-xs-6 text-right form-control-label">{{$t('setting.com_group_threshold')}}</label>
                            <div class="inline-form-control">
                                <input
                                    type="number"
                                    min="0"
                                    class="form-control"
                                    v-model="group.threshold"
                                    :disabled="!updateCommissionSettingPermission"
                                    required
                                >
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-xs-6 text-right form-control-label">{{$t('setting.com_discount_rate')}}</label>
                            <div class="inline-form-control">
                                <input
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    class="form-control"
                                    v-model="group.discount_rate"
                                    :disabled="!updateCommissionSettingPermission"
                                    required
                                >
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-4">
                        <div class="form-group">
                            <label class="col-xs-6 text-right form-control-label">{{$t('setting.valid_member')}}</label>
                            <div class="inline-form-control">
                                <input
                                    type="number"
                                    min="0"
                                    class="form-control"
                                    v-model="group.member_num"
                                    :disabled="!updateCommissionSettingPermission"
                                    required
                                >
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-xs-6 text-right form-control-label">{{$t('nav.returnrate')}}</label>
                            <div class="inline-form-control">
                                <input
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    class="form-control"
                                    v-model="group.return_rate"
                                    :disabled="!updateCommissionSettingPermission"
                                    required
                                >
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-4">
                        <input
                            type="button"
                            v-if="index === 0 && updateCommissionSettingPermission"
                            class="md-btn grey-600 w-sm pull-right m-r"
                            @click="addConfig()"
                            value="新增一组"
                        />
                        <a v-if="index > 0" class="pull-right m-r" @click="deleteConfig(index)">{{$t('action.delete')}}</a>
                    </div>
                </div>
                <div class="col-xs-12 p-t-sm p-b-sm">
                    退佣比 %
                </div>

                <div v-for="rateconfig in group.rates" class="p-r" >
                    <div class="col-xs-3">
                        <label class="m-t">{{rateconfig.game || rateconfig.display_name}}</label>
                        <input
                            class="form-control"
                            type="number"
                            step="0.1"
                            min="0"
                            max="100"
                            v-model="rateconfig.rate"
                            :disabled="!updateCommissionSettingPermission"
                            required
                        />
                    </div>
                </div>
            </div>
            <div class="row" v-if="updateCommissionSettingPermission">
                <div class="col-xs-12">
                    <button :disabled="!updateCommissionSettingPermission" type="submit" class="md-btn w-sm blue">{{$t('common.save')}}</button>
                    <span class="text-success m-l-md" v-show="updated">{{$t('common.saved_successfully')}}</span>
                </div>
            </div>
        </form>
    </div>
</template>
<script>
    import api from '../../api'

    export default {
        data () {
            return {
                deleted: 0,
                updated: false,
                gamelist: [],
                commissionsetting: {
                    name: '',
                    status: 0,
                    deposit_fee: '',
                    deposit_fee_max: '',
                    invest_least: '',
                    withdraw_fee: '',
                    withdraw_fee_max: '',
                    groups: [{
                        threshold: '',
                        discount_rate: '',
                        return_rate: '',
                        member_num: '',
                        rates: []
                    }]
                }
            }
        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                let id = to.params.commissionId
                if (id) {
                    vm.getCommissionSetting(id)
                }
            })
        },
        created () {
            this.getGameList()
        },
        computed: {
            updateCommissionSettingPermission () {
                return this.$route.params.commissionId ? this.$root.permissions.includes('update_commission_setting') : this.$root.permissions.includes('add_commission_setting')
            }
        },
        methods: {
            deleteConfig (index) {
                this.commissionsetting.groups.splice(index, 1)
            },
            addConfig () {
                this.commissionsetting.groups.push({
                    threshold: '',
                    max: '',
                    check_amount: '',
                    rates: this.gamelist.map(element => Object({
                        game: element.game,
                        game_id: element.game_id,
                        rate: ''
                    }))
                })
            },
            onSubmit (e) {
                if (this.commissionsetting.id) {
                    this.$http.put(api.commission + this.commissionsetting.id + '/', this.commissionsetting).then(() => {
                        this.updated = true
                        setTimeout(() => {
                            this.updated = false
                        }, 3000)
                    })
                } else {
                    this.$http.post(api.commission, this.commissionsetting).then(data => {
                        this.$router.push('/commission/' + data.id + '/edit')
                    })
                }
            },
            getCommissionSetting (id) {
                this.$http.get(api.commission + id + '/').then(data => {
                    this.commissionsetting = data
                })
            },
            getGameList () {
                this.$http.get(api.game_list).then(data => {
                    this.gamelist = this.createGameRate(data)
                    if (!this.commissionsetting.id) {
                        this.commissionsetting.groups[0].rates = this.gamelist
                    }
                })
            },
            createGameRate (game) {
                let result = game.map(function (g) {
                    return {game_id: g.id, rate: '', game: g.display_name}
                })
                return result
            },
            deleteCommission () {
                if (window.confirm('确定删除该佣金设定吗?')) {
                    this.$http.delete(api.commission + this.commissionsetting.id + '/').then(() => {
                        this.deleted = 1
                        setTimeout(() => {
                            this.$router.push('/commission')
                        }, 2000)
                    }, error => {
                        this.deleted = -1
                        this.errorMsg = error
                        setTimeout(() => {
                            this.deleted = 0
                        }, 5000)
                    })
                }
            }
        }
    }

</script>
<style scoped>
.count-label {
    padding: 6px;
    margin-right: 10px;
}
.md-form-group {
    padding: 15px 0 5px 0;
}
</style>
