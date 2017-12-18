<template>
    <div>
        <div class="m-b">
            <ol class="breadcrumb">
                <li class="active"><router-link to="/commission">{{$t('nav.setting_commission')}}</router-link></li>
                <li class="active">{{$route.meta.title}}</li>
            </ol>
        </div>
        <div class="alert alert-danger" v-if="!$root.permissions.includes('change_commission')">{{$t('common.errorPermission')}}</div>
        <form @submit.prevent='onSubmit'>
            <div class="alert alert-success" v-if="deleted === 1">
                <span>{{$t('setting.deleted_commission_setting')}}</span>
            </div>

            <div class="alert alert-danger" v-if="deleted === -1">
                <span>{{errorMsg}}</span>
            </div>

            <div class="row m-b-sm">
                <div class="col-xs-12" v-if="commissionsetting.id">
                    <button type="button" class="md-btn md-flat pull-right t-red" @click="deleteCommission" :disabled="commissionsetting.agent_count > 0">{{$t('setting.delete_commission_setting')}}</button>
                    <span class="text-muted v-m pull-right count-label">{{$t('common.agent_count')}}：{{commissionsetting.agent_count || 0}}</span>
                </div>
            </div>
            <div class="box">
                <div class="box-body row">
                    <div class="col-xs-4">
                        <div class="clearfix">
                            <label class="col-xs-6 text-right form-control-label">{{$t('common.name')}} </label>
                            <div class="col-xs-6">
                                <input class="form-control" v-model="commissionsetting.name" required >
                            </div>
                        </div>

                        <div class="clearfix m-t">
                            <label class="col-xs-6 text-right form-control-label">{{$t('setting.com_deposit_max')}} </label>
                            <div class="col-xs-6">
                                <input type="number" min="0"  class="form-control" v-model="commissionsetting.deposit_fee_max" required  >
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-4">
                        <div class="clearfix">
                            <label class="col-xs-6 text-right form-control-label">{{$t('setting.com_min_bet')}} </label>
                            <div class="col-xs-6">
                                <input type="number" min="0"  class="form-control" v-model="commissionsetting.invest_least" required  >
                            </div>
                        </div>

                        <div class="clearfix m-t">
                            <label class="col-xs-6 text-right form-control-label">{{$t('setting.com_withdraw_fee')}} </label>
                            <div class="col-xs-6">
                                <input type="number" min="0" class="form-control" v-model="commissionsetting.withdraw_fee" required  >
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-4">
                        <div class="clearfix">
                            <label class="col-xs-6 text-right form-control-label">{{$t('setting.com_deposit_fee')}} </label>
                            <div class="col-xs-6">
                                <input type="number" min="0" class="form-control" v-model="commissionsetting.deposit_fee" required  >
                            </div>
                        </div>

                        <div class="clearfix m-t">
                            <label class="col-xs-6 text-right form-control-label">{{$t('setting.com_withdraw_max')}} </label>
                            <div class="col-xs-6">
                                <input  type="number" min="0"  class="form-control" v-model="commissionsetting.withdraw_fee_max" required  >
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="box p-t m-b clearfix" v-for="(group, index) in commissionsetting.groups">
                <div class="clearfix b-b">
                    <div class="col-xs-4">
                        <div class="form-group">
                            <label class="col-xs-3 text-right form-control-label">{{$t('setting.com_group_threshold')}}</label>
                            <div class="inline-form-control">
                                <input type="number" min="0"  class="form-control" v-model="group.threshold" required >
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-xs-3 text-right form-control-label">{{$t('setting.com_discount_rate')}}</label>
                            <div class="inline-form-control">
                                <input type="number" min="0" step="0.1" class="form-control" v-model="group.discount_rate" required>
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-4">
                        <div class="form-group">
                            <label class="col-xs-3 text-right form-control-label">{{$t('setting.valid_member')}}</label>
                            <div class="inline-form-control">
                                <input type="number" min="0"  class="form-control" v-model="group.member_num" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-xs-3 text-right form-control-label">{{$t('nav.returnrate')}}</label>
                            <div class="inline-form-control">
                                <input type="number" min="0" step="0.1" class="form-control" v-model="group.return_rate"  required>
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-4">
                        <input type="button" v-if="index == 0 & $root.permissions.includes('change_commission')" class="md-btn grey-600 w-sm pull-right m-r" @click="addConfig()" value="新增一组"/>
                        <a v-if="index > 0" class="pull-right m-r" @click="deleteConfig(index)">{{$t('action.delete')}}</a>
                    </div>
                </div>
                <div class="col-xs-12 p-t-sm p-b-sm">
                    退佣比 %
                </div>

                <div v-for="rateconfig in commissionsetting.groups" class="p-r m-b-sm" >
                    <div v-for="rate in rateconfig.rates" class="p-r m-b-sm" >
                        <div class="col-xs-3">
                            <label class="m-t label success" >{{rate.game || rate.display_name}}</label>
                            <input class="md-input" type="number" step="0.1" v-model="rate.rate" required min="0" max="100"/>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-xs-12">
                    <button :disabled="!$root.permissions.includes('change_commission')" type="submit" class="md-btn w-sm blue">{{$t('common.save')}}</button>
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
        methods: {
            deleteConfig (index) {
                this.commissionsetting.groups.splice(index, 1)
            },
            addConfig () {
                this.commissionsetting.groups.push({
                    threshold: '',
                    max: '',
                    check_amount: '',
                    rates: ''
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
                    this.gamelist = data
                    if (!this.commissionsetting.id) {
                        this.commissionsetting.groups[0].rates = this.gamelist
                    }
                })
            },
            deleteCommission () {
                if (window.confirm('确定删除该佣金设定吗?')) {
                    this.$http.delete(api.commission + this.commissionsetting.id + '/').then(response => {
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
