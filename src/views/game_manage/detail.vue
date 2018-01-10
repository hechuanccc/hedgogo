<template>
    <div>
        <div class="m-b">
            <ol class="breadcrumb">
                <li class="active"><router-link to="/game_list">{{ $t('nav.game_list') }}</router-link></li>
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
                                <th width="16%">{{ $t('game_manage.odds') }}</th>
                                <th width="16%">{{ $t('game_manage.return_rate') }}</th>
                                <th width="16%">{{ $t('game_manage.min_per_bet') }}</th>
                                <th width="16%">{{ $t('game_manage.max_per_bet') }}</th>
                                <th width="16%">{{ $t('game_manage.max_per_draw') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="playset in playsetOrderByName" :key="playset.id">
                                <td>
                                    <strong>{{ playset.display_name }}</strong>
                                </td>
                                <td>
                                    <div class="form-group m-b-0">
                                        <input class="form-control" type="text" v-model="playset.odds" @change="changeField(playset)" required :disabled="!updatePlaysetDetailsPermission">
                                    </div>
                                </td>
                                <td>
                                    <div class="input-group m-b-0">
                                        <input class="form-control" type="number" min="0" v-model="playset.return_rate" @change="changeField(playset)" required :disabled="!updatePlaysetDetailsPermission">
                                        <span class="input-group-addon"><b>%</b></span>
                                    </div>
                                </td>
                                <td>
                                    <div class="input-group m-b-0">
                                        <span class="input-group-addon"><i class="fa fa-rmb"></i></span>
                                        <input class="form-control" type="number" min="0" v-model="playset.min_per_bet" @change="changeField(playset)" required :disabled="!updatePlaysetDetailsPermission">
                                    </div>
                                </td>
                                <td>
                                    <div class="input-group m-b-0">
                                        <span class="input-group-addon"><i class="fa fa-rmb"></i></span>
                                        <input class="form-control" type="number" min="0" v-model="playset.max_per_bet" @change="changeField(playset)" required :disabled="!updatePlaysetDetailsPermission">
                                    </div>
                                </td>
                                <td>
                                    <div class="input-group m-b-0">
                                        <span class="input-group-addon"><i class="fa fa-rmb"></i></span>
                                        <input class="form-control" type="number" min="0" v-model="playset.max_per_draw" @change="changeField(playset)" required :disabled="!updatePlaysetDetailsPermission">
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="box-footer text-center" v-if="updatePlaysetDetailsPermission">
                    <button class="btn md-btn w-sm blue" type="submit"><i class="fa fa-check"></i> {{ $t('action.confirm') }}</button>
                    <button class="btn md-btn w-sm" type="reset" @click="getPlaySet(game.id)"><i class="fa fa-repeat"></i> {{ $t('action.cancel') }}</button>
                    <transition name="fade">
                        <span class="text-success m-l-sm" v-show="successMsg"><i class="fa fa-check"></i> {{ successMsg }}</span>
                    </transition>
                    <transition name="fade">                    
                        <span class="text-warning m-l-sm" v-show="errorMsg"><i class="fa fa-times"></i> {{ errorMsg }}</span>
                    </transition>
                </div>
            </form>
        </div>
    </div>
</template>
<script>
import api from '../../api'
export default {
    data () {
        return {
            game: {
                id: '',
                display_name: ''
            },
            playsets: [],
            successMsg: '',
            errorMsg: ''
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
        getPlaySet (id) {
            this.$http.get(api.playset, {
                params: {
                    game: id
                }
            }).then(data => {
                this.playsets = data
            })
        },
        changeField (playset) {
            this.$set(playset, 'updated', true)
        },
        updatePlayset () {
            if (this.updatedPlaysets.length > 0) {
                this.$http.post(`${api.playset}?game=${this.game.id}`, this.updatedPlaysets).then(data => {
                    this.successMsg = `${this.$t('game_manage.modify_success')}`
                    setTimeout(() => {
                        this.successMsg = ''
                    }, 2000)
                    this.playsets.forEach(playset => {
                        this.$set(playset, 'updated', false)
                    })
                }, error => {
                    this.errorMsg = error
                })
            } else {
                this.errorMsg = this.$t('game_manage.no_change')
                setTimeout(() => {
                    this.errorMsg = ''
                }, 2000)
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.text-center th {
    text-align: center;
}
.fade-enter-active, .fade-leave-active{
  transition: opacity .5s
}
.fade-enter, .fade-leave-to{
  opacity: 0
}
</style>
