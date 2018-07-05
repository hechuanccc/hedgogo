<template>
    <div>
        <div class="m-b">
            <ol class="breadcrumb">
                <li class="active"><router-link to="/game_list">{{ $t('title.game_list') }}</router-link></li>
                <li class="active">{{ game.display_name }}</li>
            </ol>
        </div>
        <div class="box">
            <form @submit.prevent="updatePlayset">
                <div class="box-body">
                    <table class="table table-striped">
                        <thead class="text-center">
                            <tr>
                                <th width="20%"></th>
                                <th width="10%">{{ $t('game.standard_odds') }}</th>
                                <th width="10%">{{ $t('game.odds') }}</th>
                                <th width="15%">{{ $t('finance.return') }}</th>
                                <th width="15%">{{ $t('game.min_per_bet') }}</th>
                                <th width="15%">{{ $t('game.max_per_bet') }}</th>
                                <th width="15%">{{ $t('game.max_per_draw') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="playset in playsetOrderByName" :key="playset.id">
                                <td class="text-left">
                                    <strong>{{ playset.display_name }}</strong>
                                </td>
                                <td class="text-center">{{ playset.standard_odds || '-' }}</td>
                                <td>
                                    <div class="form-group m-b-0">
                                        <input
                                            class="form-control text-right"
                                            type="number"
                                            step="0.0001"
                                            min="0"
                                            v-model="playset.odds"
                                            @change="changeField(playset)"
                                            required
                                            :disabled="!updatePlaysetDetailsPermission"
                                        />
                                    </div>
                                </td>
                                <td>
                                    <div class="input-group m-b-0">
                                        <input
                                            class="form-control text-right"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            v-model="playset.return_rate"
                                            @change="changeField(playset)"
                                            required :disabled="!updatePlaysetDetailsPermission"
                                        />
                                        <span class="input-group-addon">%</span>
                                    </div>
                                </td>
                                <td>
                                    <div class="input-group m-b-0">
                                        <span class="input-group-addon">￥</span>
                                        <input
                                            class="form-control text-right"
                                            type="number"
                                            min="0"
                                            v-model="playset.min_per_bet"
                                            @change="changeField(playset)"
                                            required :disabled="!updatePlaysetDetailsPermission"
                                        />
                                    </div>
                                </td>
                                <td>
                                    <div class="input-group m-b-0">
                                        <span class="input-group-addon">￥</span>
                                        <input
                                            class="form-control text-right"
                                            type="number"
                                            min="0"
                                            v-model="playset.max_per_bet"
                                            @change="changeField(playset)"
                                            required
                                            :disabled="!updatePlaysetDetailsPermission"
                                        />
                                    </div>
                                </td>
                                <td>
                                    <div class="input-group m-b-0">
                                        <span class="input-group-addon">￥</span>
                                        <input
                                            class="form-control text-right"
                                            type="number"
                                            min="0"
                                            v-model="playset.max_per_draw"
                                            @change="changeField(playset)"
                                            required
                                            :disabled="!updatePlaysetDetailsPermission"
                                        />
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="box-footer text-center p-t-0" v-if="updatePlaysetDetailsPermission">
                    <button class="btn md-btn w-sm blue" type="submit">{{ $t('dic.confirm') }}</button>
                    <button class="btn md-btn w-sm" type="reset" @click="getPlaySet(game.id)">{{ $t('dic.cancel') }}</button>
                </div>
            </form>
        </div>
    </div>
</template>
<script>
import { getGame, updateGame } from '../../service'
import $ from '../../utils/util'
export default {
    data () {
        return {
            game: {
                id: '',
                display_name: ''
            },
            playsets: []
        }
    },
    computed: {
        playsetOrderByName () {
            return this.playsets.sort((a, b) => {
                return a.display_name.localeCompare(b.display_name)
            })
        },
        updatedPlaysets () {
            return this.playsets.filter(playset => {
                return playset.updated
            })
        },
        updatePlaysetDetailsPermission () {
            return this.$root.permissions.includes('update_playset_details')
        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            let id = to.params.id
            vm.game.id = id
            vm.game.display_name = to.query.display_name
            vm.getPlaySet(id)
        })
    },
    methods: {
        getPlaySet (game) {
            getGame('playset', {
                params: { game }
            }).then(data => {
                this.playsets = data
            })
        },
        changeField (playset) {
            this.$set(playset, 'updated', true)
        },
        updatePlayset () {
            if (this.updatedPlaysets.length > 0) {
                updateGame('playset', {
                    data: this.updatedPlaysets,
                    params: {
                        game: this.game.id
                    }
                }, {
                    action: this.$t('dic.update')
                }).then(data => {
                    this.playsets.forEach(playset => {
                        this.$set(playset, 'updated', false)
                    })
                })
            } else {
                $.notify({
                    message: this.$t('system_msg.no_change'),
                    type: 'warning'
                })
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.text-center th {
    text-align: center;
}
</style>
