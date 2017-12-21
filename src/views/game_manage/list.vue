<template>
  <div>
    <div class="row">
        <transition name="fade">
            <div class="pull-center alert alert-success m-l m-t-0 p-t-xs p-b-xs" v-show="updateRankMsg"><i class="fa fa-check"></i>{{ updateRankMsg }}</div>
        </transition>
        <div class="pull-right m-r">
            <button class="md-btn w-sm blue m-b" @click="changeMode">{{ mode ? $t('game_manage.adjust_rank') : $t('action.confirm') }}</button>
            <button class="md-btn w-sm m-b m-l-sm" v-show="!mode" @click="cancelAdjustRank">{{ $t('action.cancel') }}</button>
        </div>
    </div>
    <div class="box" v-if="queryset.length">
      <table st-table="rowCollectionBasic" class="table table-striped b-t">
          <thead>
          <tr>
            <th v-show="!mode"></th>
            <th>{{$t('game_manage.name')}}</th>
            <th>{{$t('game_manage.holiday_start_time')}}</th>
            <th>{{$t('game_manage.holiday_end_time')}}</th>
            <th>{{$t('game_manage.enabled_status')}}</th>
            <th>{{$t('game_manage.closed_status')}}</th>
            <th>{{$t('game_manage.operating')}}</th>
          </tr>
          </thead>
          <draggable v-model="queryset" :element="'tbody'" :options="{disabled:mode}">
          <tr v-for="(game, index) in queryset" :key="game.id">
            <td v-show="!mode"><i class="fa fa-reorder blue"></i></td>
            <td>
              <a @click="$_routerLink(game)">{{game.display_name}}</a>
            </td>
            <td>{{game.holidates.schedule_open | datetimeFilter}}</td>
            <td>{{game.holidates.schedule_close | datetimeFilter}}</td>
            <td>
              <div :class="game.to_display ? 'text-success': 'text-danger'">
                {{game.to_display ? $t('game_manage.enabled') : $t('game_manage.disabled')}}
              </div>
            </td>
            <td>
              <div :class="game.status ? 'text-success': 'text-danger'">
                {{game.status ? $t('game_manage.openning') : $t('game_manage.closed')}}
              </div>
            </td>
            <td>
              <a class="p-l-xs" @click="toggleEnable(index)">{{!game.to_display ? $t('game_manage.enabled') : $t('game_manage.disabled')}}</a>
              <a class="p-l-xs" @click="toggleClose(index)">{{!game.status ? $t('game_manage.openning') : $t('game_manage.closed')}}</a>
              <a class="p-l-xs" @click="showModal(index)">{{$t('game_manage.setting')}}</a>
            </td>
          </tr>
          </draggable>
        </table>
    </div>
    <div class="modal" v-if="modal.isShow">
        <div class="modal-backdrop fade in" @click="hideModal"></div>
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <span>{{ modal.display_name }}- {{ $t('game_manage.setting') }}</span>
                    <button type="button" class="close" aria-hidden="true" @click="hideModal">×
                    </button>
                </div>
                <div class="modal-body m-r m-l">
                    <div class="row m-b">
                        <span>{{ $t('game_manage.setting_holiday') }}</span>
                    </div>
                    <div class="row m-b m-l">
                        <div class="col-xs-8">
                            <date-picker v-model="modal.value" type="datetime" format="yyyy-MM-dd HH:mm" :minute-step="1" range></date-picker>
                        </div>
                        <div class="col-xs-2 col-xs-offset-2 text-right">
                            <button type="button" class="btn btn-sm btn-primary" @click="updateTime">{{$t('action.update')}}</button>
                        </div>
                    </div>
                    <div class="row"></div>
                    <div class="row m-t m-b">
                        <span>{{ $t('game_manage.setting_icon') }}</span>
                    </div>
                    <div class="row m-b m-l">
                        <div class="col-xs-3" v-if="modal.image">
                            <img :src="modal.image" width="108" height="108">
                        </div>
                        <div class="col-xs-3 text-center" v-else>
                            <div id="circle">
                                <span>{{ $t('game_manage.no_setting_icon') }}</span>
                            </div>
                        </div>
                        <div class="col-xs-5 inline-form-control m-t-lg">
                            <input type="file" class="form-control" accept="image/*" @change="syncImg" required>
                        </div>
                        <div class="col-xs-2 col-xs-offset-2 text-right m-t-lg">
                            <button type="button" class="btn btn-sm btn-primary" @click="updateImage">{{$t('action.update')}}</button>
                        </div>
                    </div>
                    <div class="row m-l m-r">
                        <alert-msg :msg="modal.msg" ref="alertMsg" @hide-modal="hideModal" ></alert-msg>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" @click="hideModal">{{$t('staff.close')}}</button>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>
<script>
import api from '../../api'
import alertMsg from '../../components/alertMsg'
import DatePicker from 'vue2-datepicker'
import draggable from 'vuedraggable'

import Vue from 'vue'

export default {
    data () {
        return {
            mode: 1,
            gameApi: api.game_list,
            query: {},
            queryset: [],
            initialQueryset: [],
            optexpand: 'group',
            modal: {
                isShow: false,
                value: [],
                index: '',
                id: '',
                display_name: '',
                code: '',
                image: '',
                iconResult: {
                    display_name: '',
                    code: '',
                    icon: '',
                    to_display: true
                },
                msg: ''
            },
            updateRankMsg: ''
        }
    },
    created () {
        this.getGameList()
    },
    methods: {
        getGameList () {
            this.$http.get(api.game_list).then(data => {
                this.queryset = data
                const games = {}
                data.forEach(game => {
                    games[game.id] = game.display_name
                })
            })
        },
        toggleEnable (index) {
            const game = this.queryset[index]
            const params = {
                display_name: game.display_name,
                code: game.code,
                to_display: !game.to_display
            }
            this.$http.put(api.game_list + game.id + '/', params).then(data => {
                this.$set(this.queryset, index, data)
            })
        },
        toggleClose (index) {
            const game = this.queryset[index]
            const params = {
                display_name: game.display_name,
                code: game.code,
                status: game.status === 0 ? 1 : 0
            }
            this.$http.put(api.game_list + game.id + '/', params).then(data => {
                this.$set(this.queryset, index, data)
            })
        },
        showModal (index) {
            const game = this.queryset[index]
            this.modal = {
                ...this.modal,
                display_name: game.display_name,
                id: game.id,
                index: index,
                value: [],
                iconResult: {
                    display_name: game.display_name,
                    code: game.code,
                    icon: undefined
                },
                image: game.icon,
                isShow: true
            }
        },
        hideModal () {
            this.modal.isShow = false
        },
        updateTime () {
            if (this.modal.value.length > 0) {
                this.$http.put(api.game_list + this.modal.id + '/', {
                    display_name: this.modal.display_name,
                    start_date: Vue.moment(this.modal.value[0]).format('YYYY-MM-DD HH:mm'),
                    end_date: Vue.moment(this.modal.value[1]).format('YYYY-MM-DD HH:mm')
                }).then(data => {
                    this.$set(this.queryset, this.modal.index, data)
                    this.modal.msg = this.$t('game_manage.modify_success')
                    this.$refs.alertMsg.trigger('success', 3)
                }, error => {
                    this.modal.msg = this.$t('game_manage.modify_fail') + error.join(' ')
                    this.$refs.alertMsg.trigger('danger')
                })
            } else {
                this.modal.msg = this.$t('game_manage.no_setting_holiday')
                this.$refs.alertMsg.trigger('warning', 3)
            }
        },
        syncImg (e) {
            var reader = new FileReader()

            reader.onload = (e) => {
                this.modal.image = e.target.result
            }
            reader.readAsDataURL(e.target.files[0])
            this.modal.iconResult.icon = e.target.files[0]
            this.modal.hasImage = true
        },
        updateImage () {
            if (this.modal.iconResult.icon) {
                let formData = new window.FormData()
                formData.append('display_name', this.modal.iconResult.display_name)
                formData.append('code', this.modal.iconResult.code)
                formData.append('icon', this.modal.iconResult.icon)
                this.$http.put(api.game_list + this.modal.id + '/', formData)
                .then(() => {
                    this.getGameList()
                    this.modal.msg = this.$t('game_manage.modify_success')
                    this.$refs.alertMsg.trigger('success', 3)
                }, error => {
                    this.modal.msg = this.$t('game_manage.modify_fail') + error
                    this.$refs.alertMsg.trigger('danger')
                })
            } else {
                this.modal.msg = this.$t('game_manage.no_setting_icon')
                this.$refs.alertMsg.trigger('warning', 3)
            }
        },
        changeMode () {
            if (!this.mode) {
                this.$http.post(api.game_list, this.queryset.map((game, index) => Object({
                    id: game.id,
                    display_name: game.display_name,
                    rank: index + 1
                }))).then(data => {
                    this.updateRankMsg = this.$t('game_manage.modify_success')
                    setTimeout(() => {
                        this.updateRankMsg = ''
                    }, 3000)
                }, () => {
                    this.cancelAdjustRank()
                })
            } else {
                this.initialQueryset = this.queryset
            }
            this.mode = !this.mode
        },
        cancelAdjustRank () {
            this.queryset = this.initialQueryset
            this.mode = !this.mode
        },
        $_routerLink (game) {
            this.$router.push({
                path: 'game_detail/' + game.id,
                query: {
                    display_name: game.display_name
                }
            })
        }
    },
    filters: {
        datetimeFilter (value) {
            if (!value) {
                return Vue.t('game_manage.no_setting')
            } else {
                return Vue.moment(value).format('YYYY-MM-DD HH:mm')
            }
        }
    },
    components: {
        DatePicker,
        alertMsg,
        draggable
    }
}
</script>
<style scoped>
.modal-backdrop, .modal{
  z-index: 1;
}
.modal-dialog{
  z-index: 10;
  top: 10%;
}
.modal{
  display: block;
}
#circle {
  width: 108px;
  height: 108px;
  line-height: 108px;
  background: lightgray;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  border-radius: 50%;
}
.fade-enter-active, .fade-leave-active{
  transition: opacity .5s
}
.fade-enter, .fade-leave-to{
  opacity: 0
}
</style>
