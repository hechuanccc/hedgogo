<template>
    <div>
        <div class="row m-l-xs m-r-xs m-b-xs">
            <div class="pull-left" v-if="$root.permissions.includes('add_promotion_activity')">
                <router-link tag="button" class="md-btn w-sm blue" to="/promotion/add">{{$t('dic.create')}}</router-link>
            </div>
            <div class="pull-right">
                <button type="button" class="md-btn w-sm blue m-b" @click="changeMode">{{ mode ? $t('system.adjust_rank') : $t('dic.confirm') }}</button>
                <button type="button" class="md-btn w-sm m-b m-l-sm" v-show="!mode" @click="cancelAdjustRank">{{ $t('dic.cancel') }}</button>
            </div>
        </div>
        <div class="box">
            <table st-table="rowCollectionBasic" class="table table-striped">
                <thead>
                    <tr>
                        <th v-show="!mode"></th>
                        <th>{{$t('dic.name')}}</th>
                        <th>{{$t('dic.member_level')}}</th>
                        <th>{{$t('promotion.start_date')}}</th>
                        <th>{{$t('promotion.end_date')}}</th>
                        <th>{{$t('dic.status')}}</th>
                    </tr>
                </thead>
                <draggable v-model="queryset" :element="'tbody'" :options="{disabled:mode}">
                    <tr v-for="promotion in queryset" :key="promotion.id">
                        <td v-show="!mode" class="v-m text-center"><i class="fa fa-reorder text-blue"></i></td>
                        <td><router-link :to="'/promotion/' + promotion.id">{{promotion.name}}</router-link></td>
                        <td>
                            <router-link class="m-r" v-for="pl in promotion.level" :to="'/level/' + pl.id" :key="pl.id">{{pl.name}}</router-link>
                        </td>
                        <td>{{promotion.start_date || '-'}}</td>
                        <td>{{promotion.end_date || '-'}}</td>
                        <td>
                            <span class="label success" v-if="promotion.status==1">{{$t('status.active')}}</span>
                            <span class="label danger" v-else>{{$t('status.inactive')}}</span>
                        </td>
                    </tr>
                </draggable>
            </table>
        </div>
    </div>
</template>
<script>
import { getSetting, updateSetting } from '../../service'
import draggable from 'vuedraggable'

export default {
    data () {
        return {
            mode: true,
            queryset: []
        }
    },
    created () {
        this.getPromotions()
    },
    methods: {
        getPromotions () {
            getSetting('promotion', {
                params: {
                    opt_expand: 'level'
                }
            }).then(data => {
                this.queryset = data.sort((a, b) => a.rank - b.rank)
            })
        },
        changeMode () {
            if (!this.mode) {
                updateSetting('promotionRank', {
                    data: this.queryset.map(({ id }, index) => Object({
                        id,
                        rank: index + 1
                    })),
                    params: {
                        opt_expand: 'level'
                    }
                }, {
                    action: this.$t('system.adjust_rank')
                }).then(data => {
                    this.queryset.forEach((element, index) => {
                        element.rank = index + 1
                    })
                    this.mode = true
                })
            } else {
                this.mode = false
            }
        },
        cancelAdjustRank () {
            this.queryset.sort((a, b) => a.rank - b.rank)
            this.mode = !this.mode
        }
    },
    components: {
        draggable
    }
}
</script>
