<template>
    <div>
        <div class="m-b">
            <ol class="breadcrumb">
                <li class="active"><router-link to="/promotion">{{$t('nav.promotion')}}</router-link></li>
                <li class="active">{{$route.meta.title}}</li>
            </ol>
        </div>
        <div class="box">
            <div class="box-header b-b">
                <div class="row">
                    <div class="col-md-4">
                        <h2 class="v-m m-t-sm">{{promotion.name}} </h2>
                    </div>
                    <div class="col-md-5 col-md-offset-3 text-right">
                        <router-link class="md-btn md-flat m-r-sm" to="/promotion/">{{$t('action.view_promotions')}}</router-link>
                        <router-link class="md-btn md-flat m-r-sm" v-if="$root.permissions.includes('change_promotion')" :to="'/promotion/' + promotion.id + '/edit'">{{$t('action.update_promotion')}}</router-link>
                        <a class="md-btn md-flat m-r-sm" v-if="$root.permissions.includes('change_promotion')" @click="deletePromotion(promotion.id, true, $event)">{{$t('action.delete')}}</a>
                    </div>
                </div>
            </div>
            <div class="box-body">
                <div class="row m-b p-b b-b">
                    <div class="col-xs-12">
                        <span class="text-muted">{{$t('common.basic_info')}}</span>
                        <table class="table b-a m-t-sm">
                            <tbody>
                                <tr>
                                    <th class="grey-50" width="200">{{$t('common.name')}}</th>
                                    <td>{{promotion.name}}</td>
                                </tr>
                                <tr>
                                    <th class="grey-50" width="200">{{$t('promotion.banner')}}</th>
                                    <td>
                                        <img :src="promotion.image" class="promo-image">
                                    </td>
                                </tr>
                                <tr>
                                    <th class="grey-50" width="200">{{$t('promotion.mobileBanner')}}</th>
                                    <td>
                                        <img :src="promotion.image_mobile" class="promo-image">
                                    </td>
                                </tr>
                                <tr>
                                    <th class="grey-50">{{$t('promotion.rank')}}</th>
                                    <td>{{promotion.rank}}</td>
                                </tr>
                                <tr>
                                    <th class="grey-50" width="200">{{$t('promotion.desc')}}</th>
                                    <td v-html="promotion.description"></td>
                                </tr>
                                <tr>
                                    <th class="grey-50" width="200">{{$t('promotion.desc_mobile')}}</th>
                                    <td v-html="promotion.mobile_description"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="row p-t">
                    <div class="col-xs-5">
                        <span class="text-muted">{{$t('common.status')}}</span>
                        <div>
                            <span class="label success" v-if="promotion.status==1">{{$t('status.active')}}</span>
                            <span class="label" v-else>{{$t('status.inactive')}}</span>
                        </div>
                    </div>
                    <div class="col-xs-5">
                        <span class="text-muted">适用会员等级</span>
                        <div>
                            <router-link class="m-r-sm" :to="'/level/' + l.id" v-for="l in promotion.level">
                            {{l.name}}
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import api from '../../../api'
    export default {
        data () {
            return {
                promotion: {}
            }
        },
        route: {
            data (transition) {
                let id = transition.to.params.promotionId
                this.getPromotion(id)
            }
        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                let id = to.params.promotionId
                if (id) {
                    vm.getPromotion(id)
                }
            })
        },
        methods: {
            getPromotion (id) {
                this.$http.get(api.promotion + id + '/?opt_expand=level').then((response) => {
                    this.promotion = response.data
                })
            },
            deletePromotion (id, confirm, event) {
                if (confirm) {
                    if (!window.confirm(this.$t('common.confirm', {
                        action: event.target.innerText
                    }))) {
                        return
                    }
                }
                this.$http.delete(api.promotion + id + '/').then((response) => {
                    this.$router.push('/promotion')
                })
            }
        }
    }
</script>
<style scoped>
    .promo-image {
        max-width: 100%;
        height: 350px;
    }
</style>
