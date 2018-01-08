<template>
    <div>
        <div class="row m-l-xs m-r-xs m-b-xs">
            <div class="pull-left" v-if="$root.permissions.includes('add_promotion_activity')">
                <router-link tag="button" class="md-btn w-sm blue" to="/promotion/add">{{$t('promotion.add')}}</router-link>
            </div>
            <div class="pull-center m-t-sm">
                <span class="alert alert-success text-success m-r p-a-sm" v-if="successMsg"><i class="fa fa-check"></i> {{ successMsg }}</span>
                <span class="alert alert-danger text-danger m-r p-a-sm" v-if="errorMsg"><i class="fa fa-times"></i> {{ errorMsg }}</span>
            </div>
            <div class="pull-right">
                <button type="button" class="md-btn w-sm blue m-b" @click="changeMode">{{ mode ? $t('game_manage.adjust_rank') : $t('action.confirm') }}</button>
                <button type="button" class="md-btn w-sm m-b m-l-sm" v-show="!mode" @click="cancelAdjustRank">{{ $t('action.cancel') }}</button>
            </div>
        </div>
        <div class="box">
            <table st-table="rowCollectionBasic" class="table table-striped">
                <thead>
                    <tr>
                        <th v-show="!mode"></th>
                        <th>{{$t('common.name')}}</th>
                        <th>{{$t('member.level')}}</th>
                        <th>{{$t('promotion.start_date')}}</th>
                        <th>{{$t('promotion.end_date')}}</th>
                        <th>{{$t('common.status')}}</th>
                    </tr>
                </thead>
                    <draggable v-model="queryset" :element="'tbody'" :options="{disabled:mode}">
                    <tr v-for="promotion in queryset" :key="promotion.id">
                        <td v-show="!mode" class="v-m text-center"><i class="fa fa-reorder text-blue"></i></td>
                        <td><router-link :to="'/promotion/' + promotion.id">{{promotion.name}}</router-link></td>
                        <td>
                            <router-link class="m-r" v-for="pl in promotion.level" :to="'/level/' + pl.id">{{pl.name}}</router-link>
                        </td>
                        <td>{{promotion.start_date}}</td>
                        <td>{{promotion.end_date}}</td>
                        <td>
                            <span class="label success" v-if="promotion.status==1">{{$t('status.active')}}</span>
                            <span class="label" v-else>{{$t('status.inactive')}}</span>
                        </td>
                    </tr>
                    </draggable>
            </table>
        </div>
    </div>
</template>
<script>
    import api from '../../../api'
    import draggable from 'vuedraggable'

    export default {
        data () {
            return {
                mode: true,
                api: api.promotion,
                queryset: [],
                successMsg: '',
                errorMsg: ''
            }
        },
        created () {
            this.getPromotions()
        },
        methods: {
            getPromotions () {
                this.$http.get(this.api + '?opt_expand=level').then(data => {
                    this.queryset = data.sort((a, b) => a.rank - b.rank)
                })
            },
            changeMode () {
                if (!this.mode) {
                    this.$http.post(`${this.api}rank/`, this.queryset.map((element, index) => Object({
                        id: element.id,
                        rank: index + 1
                    }))).then(data => {
                        this.queryset = data.sort((a, b) => a.rank - b.rank)
                        this.successMsg = this.$t('status.success')
                        this.mode = true
                        setTimeout(() => {
                            this.successMsg = ''
                        }, 3000)
                    }, error => {
                        this.errorMsg = `${this.$t('status.failed')} (${error})`
                    })
                } else {
                    this.mode = false
                }
            },
            cancelAdjustRank () {
                this.getPromotions()
                this.mode = !this.mode
            }
        },
        components: {
            draggable
        }
    }

</script>
