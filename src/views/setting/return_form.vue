<template>
    <div>
        <div class="m-b">
            <ol class="breadcrumb">
                <li class="active"><router-link to="/return">{{$t('nav.setting_return')}}</router-link></li>
                <li class="active">{{$route.meta.title}}</li>
            </ol>
        </div>
        <div class="alert alert-danger" v-if="!$root.permissions.includes('change_returnrate')">{{$t('common.errorPermission')}}</div>
        <form @submit.prevent='onSubmit'>
            <div class="alert alert-success" v-show="deleted === 1">
                <span>{{$t('setting.deleted_return_setting')}}</span>
            </div>

            <div class="alert alert-danger" v-show="deleted === -1">
                <span>{{errorMsg}}</span>
            </div>
            <div class="row">
                <div class="col-xs-4">
                    <div class="form-group">
                        <div class="inline-form-control">
                            <label class="m-r">{{$t('common.name')}}</label>
                            <input class="form-control" v-model="returnsetting.name" required placeholder="名称">
                        </div>
                    </div>
                </div>
                <div class="col-xs-8" v-if="returnsetting.id">
                    <button type="button" class="md-btn md-flat pull-right t-red" @click="deleteReturn" :disabled="returnsetting.member_count > 0">{{$t('setting.delete_return_setting')}}</button>
                    <span class="text-muted v-m pull-right count-label">{{$t('common.member_count')}}：{{returnsetting.member_count}}</span>
                </div>
            </div>
            <div class="box p-t m-b clearfix" v-for="(group, index) in returnsetting.groups">
                <div class="clearfix b-b m-b">
                    <div class="col-xs-3">
                        <div class="form-group">
                            <label class="m-r">{{$t('setting.group_threshold')}}</label>
                            <div class="inline-form-control">
                                <input type="number" min="0"  class="form-control w-sm" v-model="group.threshold" required  id="level-name">
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-3">
                        <div class="form-group">
                            <label class="m-r">{{$t('setting.group_max')}}</label>
                            <div class="inline-form-control">
                                <input type="number" min="0" class="form-control w-sm" v-model="group.max" id="level-name">
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-3">
                        <div class="form-group">
                            <label class="m-r">{{$t('setting.check_amount')}}</label>
                            <div class="inline-form-control">
                                <input type="number" min="0"  class="form-control w-sm" v-model="group.check_amount"  id="level-name">
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-3" v-if="$root.permissions.includes('change_returnrate')" >
                        <input type="button" v-if="index == 0 && $root.permissions.includes('change_returnrate')"  class="md-btn grey-600 w-sm pull-right m-r" @click="addConfig()" value="新增一组"/>
                        <a v-if="index > 0 & $root.permissions.includes('change_returnrate')" class="pull-right m-r" @click="deleteConfig(index)">{{$t('action.delete')}}</a>
                    </div>
                </div>
<!-- Will be updated once the requirement is finalized -->
<!--                 <div class="col-xs-12 m-b-sm">
                    {{$t('setting.return_setting_ratio')}} %
                </div> -->
<!--                 <div v-for="rateconfig in group.rates" class="p-r m-b-sm col-xs-6" >
                    <div class="col-xs-2">
                        <strong class="label m-t" :class="rateconfig.status==1 ? 'success' : ''">{{rateconfig.name}}</strong>
                    </div>
                    <div class="col-xs-2" v-for="t in rateconfig.gamecategories">
                        <div class="md-form-group" >
                            <input class="md-input" type="number" v-model="t.rate" min="0" step="0.1" max="100" required="" />
                            <label>{{t.name}}</label>
                        </div>
                    </div>
                </div> -->
            </div>
            <div class="row">
                <div class="col-xs-12">
                    <button :disabled="!$root.permissions.includes('change_returnrate')" type="submit" class="md-btn w-sm blue">{{$t('common.save')}}</button>
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
                errorMsg: '',
                defaultProviders: [],
                updated: false,
                returnsetting: {
                    name: '',
                    groups: [{
                        threshold: '',
                        max: '',
                        check_amount: '',
                        rates: []
                    }]
                }
            }
        },
        // route: {
        //     data (transition) {
        //         this.fetchProviders()
        //         let id = transition.to.params.returnId
        //         if (id) {
        //             this.getReturnSetting(id)
        //         }
        //     }
        // },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                let id = to.params.returnId
                if (id) {
                    vm.getReturnSetting(id)
                }
            })
        },
        // Note: Will be updated once the requirement is finalized
        // created () {
        //     this.fetchProviders()
        // },
        methods: {
            deleteConfig (index) {
                this.returnsetting.groups.splice(index, 1)
            },
            // Note: Will be updated once the requirement is finalized
            // fetchProviders () {
            //     this.$http.get(api.provider_setting + '?opt_fields=provider,name,status,gamecategories').then(response => {
            //         this.defaultProviders = response.data
            //         if (!this.returnsetting.id) {
            //             this.returnsetting.groups[0].rates = this.defaultProviders
            //         }
            //     })
            // },
            addConfig () {
                this.returnsetting.groups.push({
                    threshold: '',
                    max: '',
                    check_amount: '',
                    rates: JSON.parse(JSON.stringify(this.defaultProviders))
                })
            },
            onSubmit (e) {
                if (this.deleted > 0) {
                    return
                }
                if (this.returnsetting.id) {
                    this.$http.put(api.return + this.returnsetting.id + '/', this.returnsetting).then(response => {
                        if (response.status === 200) {
                            this.updated = true
                            setTimeout(() => {
                                this.updated = false
                            }, 3000)
                        }
                    })
                } else {
                    this.$http.post(api.return, this.returnsetting).then(response => {
                        if (response.status === 201) {
                            this.$router.push('/return/')
                        }
                    })
                }
            },
            getReturnSetting (id) {
                this.$http.get(api.return + id + '/').then((response) => {
                    this.returnsetting = response.data
                })
            },
            deleteReturn () {
                if (window.confirm('确定删除该反水设定吗?')) {
                    this.$http.delete(api.return + this.returnsetting.id + '/').then(response => {
                        this.deleted = 1
                        setTimeout(() => {
                            this.$router.push('/return')
                        }, 2000)
                    }, response => {
                        this.deleted = -1
                        this.errorMsg = response.data.detail
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
