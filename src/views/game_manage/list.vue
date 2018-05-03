<template>
  <div>
    <div class="row">
        <div class="pull-right m-r">
            <button class="md-btn w-sm blue m-b" @click="changeMode">{{ mode ? $t('game_manage.adjust_rank') : $t('action.confirm') }}</button>
            <button class="md-btn w-sm m-b m-l-sm" v-show="!mode" @click="cancelAdjustRank">{{ $t('action.cancel') }}</button>
        </div>
    </div>
    <div class="box" v-if="!loading">
      <table st-table="rowCollectionBasic" class="table table-striped b-t" v-if="queryset.length">
          <thead>
          <tr>
            <th v-show="!mode"></th>
            <th width="15%">{{$t('game_manage.name')}}</th>
            <th width="7%"></th>
            <th class="text-center">{{$t('game_manage.holiday_start_time')}}</th>
            <th class="text-center">{{$t('game_manage.holiday_end_time')}}</th>
            <th class="text-center">{{$t('game_manage.enabled_status')}}</th>
            <th class="text-center">{{$t('game_manage.closed_status')}}</th>
            <th class="text-center">{{$t('game_manage.operating')}}</th>
          </tr>
          </thead>
          <draggable
            v-model="queryset"
            :element="'tbody'"
            :options="{disabled:mode}"
            class="text-center"
          >
          <tr v-for="(game, index) in queryset" :key="game.id">
            <td v-show="!mode"><i class="fa fa-reorder text-blue"></i></td>
            <td class="text-uppercase text-left">
              <router-link
                :to="`/game_detail/${game.id}/?display_name=${game.display_name}`"
                v-show="editNameList[game.id] === undefined"
              >
                {{game.display_name}}
              </router-link>
              <input
                class="form-control w-sm inline"
                v-model="editNameList[game.id]"
                :ref="`input${game.id}`"
                v-show="editNameList[game.id] !== undefined"
              />
            </td>
            <td class="text-left">
              <a
                @click="editName(game.id, game.display_name)"
                v-show="editNameList[game.id] === undefined"
              >
                <i class="fa fa-pencil"></i>
              </a>
              <a
                @click="submitName(game.id, editNameList[game.id])"
                class="text-success"
                v-show="editNameList[game.id] !== undefined"
              >
                <i class="fa fa-check" v-if="!editNameLoading[game.id]"></i>
                <i class="fa fa-spin fa-spinner" v-else></i>
              </a>
              &nbsp;
              <a
                @click="cancelEditName(game.id)"
                class="text-danger"
                v-show="editNameList[game.id] !== undefined"
              >
                <i class="fa fa-times"></i>
              </a>
            </td>
            <td>{{game.holidates.schedule_open | datetimeFilter}}</td>
            <td>{{game.holidates.schedule_close | datetimeFilter}}</td>
            <td>
              <div :class="game.to_display ? 'text-success': 'text-danger'">
                {{game.to_display ? $t('game_manage.enabled') : $t('game_manage.disabled')}}
              </div>
            </td>
            <td>
                <span class="text-success" v-if="game.status === 1">{{ $t('game_manage.openning') }}</span>
                <span class="text-danger" v-else>{{ game.status === 0 ? $t('game_manage.closed') : $t('game_manage.holiday') }}</span>
            </td>
            <td class="text-center">
              <span class="text-muted p-l-xs" v-if="game.status === 2">
                  {{!game.to_display ? $t('game_manage.enabled') : $t('game_manage.disabled')}}
              </span>
              <a
                class="p-l-xs"
                @click="toggleEnable(index)"
                v-show="updateGameStatusPermission"
                v-else
              >{{!game.to_display ? $t('game_manage.enabled') : $t('game_manage.disabled')}}
              </a>
              <span class="text-muted p-l-xs" v-if="game.status === 2">
                  {{ $t('game_manage.holiday') }}
              </span>
              <a
                class="p-l-xs"
                @click="toggleClose(index)"
                v-else-if="updateGameStatusPermission"
              >{{!game.status ? $t('game_manage.openning') : $t('game_manage.closed')}}
              </a>
              <a class="p-l-xs" @click="showModal(index)">{{$t('game_manage.setting')}}</a>
            </td>
          </tr>
          </draggable>
        </table>
    </div>
    <p v-else class="text-center">
        <i class="fa fa-spin fa-spinner"></i>
        <b>{{ $t('common.loading') }}...</b>
    </p>
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
                    <div class="row m-b" v-if="updateGameStatusPermission">
                        <span>{{ $t('game_manage.setting_holiday') }}</span>
                    </div>
                    <div class="row m-b m-l" v-if="updateGameStatusPermission">
                        <div class="col-xs-8">
                            <date-picker
                                :shortcuts="[]"
                                v-model="modal.value"
                                type="datetime"
                                format="yyyy-MM-dd HH:mm"
                                :minute-step="1"
                                range
                            >
                            </date-picker>
                        </div>
                        <div class="col-xs-2 col-xs-offset-2 text-right">
                            <button type="button" class="btn btn-sm blue" @click="updateTime">{{$t('action.update')}}</button>
                        </div>
                    </div>
                    <div class="row"></div>
                    <div class="row m-t m-b">
                        <span>{{ $t('game_manage.setting_icon') }}</span>
                    </div>
                    <div class="row m-b m-l">
                        <div class="col-xs-5 text-center" v-if="modal.icon">
                            <img :src="modal.icon" width="108" height="108">
                        </div>
                        <div class="col-xs-5 text-center" v-else>
                            <div id="circle">
                                <span>{{ $t('game_manage.no_setting_icon') }}</span>
                            </div>
                        </div>
                        <div class="col-xs-5 inline-form-control m-t-lg" v-if="$root.permissions.includes('update_game_icon')">
                            <input type="file" class="form-control" accept="image/*" @change="syncImg($event, 'icon')" required>
                        </div>
                        <div class="col-xs-2 text-right m-t-lg"  v-if="$root.permissions.includes('update_game_icon')">
                            <button type="button" class="btn btn-sm blue" @click="updateImage('icon')">{{$t('action.update')}}</button>
                        </div>
                    </div>
                    <div class="row"></div>
                    <div class="row m-t m-b">
                        <span>{{ $t('game_manage.setting_icon_background') }}</span>
                    </div>
                    <div class="row m-b m-l">
                        <div class="col-xs-5 text-center" v-if="modal.bg_icon">
                            <img :src="modal.bg_icon" width="180" height="180">
                        </div>
                        <div class="col-xs-5 text-center" v-else>
                            <div class="m-l-sm" style="width:180px; height:180px; background:lightgrey; line-height:180px;">
                                {{ $t('game_manage.no_setting_icon_background') }}
                            </div>
                        </div>
                        <div class="col-xs-5 inline-form-control" style="margin-top:75px;" v-if="$root.permissions.includes('update_game_icon_background')">
                            <input type="file" class="form-control" accept="image/*" @change="syncImg($event, 'bg_icon')" required>
                        </div>
                        <div class="col-xs-2 text-right" style="margin-top:75px;" v-if="$root.permissions.includes('update_game_icon_background')">
                            <button type="button" class="btn btn-sm blue" @click="updateImage('bg_icon')">{{$t('action.update')}}</button>
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
import $ from '../../utils/util'
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
                icon: '',
                bg_icon: '',
                iconResult: {
                    display_name: '',
                    code: '',
                    icon: '',
                    bg_icon: '',
                    to_display: true
                },
                msg: ''
            },
            editNameList: {},
            editNameLoading: {},
            loading: true
        }
    },
    created () {
        this.getGameList()
    },
    computed: {
        updateGameStatusPermission () {
            return this.$root.permissions.includes('update_game_status')
        }
    },
    methods: {
        getGameList () {
            this.$http.get(api.game_list).then(data => {
                this.queryset = data
                this.loading = false
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
            }, error => {
                $.notify({
                    message: error,
                    type: 'danger'
                })
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
            }, error => {
                $.notify({
                    message: error,
                    type: 'danger'
                })
            })
        },
        showModal (index) {
            const game = this.queryset[index]
            this.modal = {
                ...this.modal,
                display_name: game.display_name,
                id: game.id,
                index: index,
                value: [game.holidates.schedule_open, game.holidates.schedule_close],
                iconResult: {
                    display_name: game.display_name,
                    code: game.code,
                    icon: undefined,
                    bg_icon: undefined
                },
                icon: game.icon,
                bg_icon: game.bg_icon,
                isShow: true
            }
        },
        hideModal () {
            this.modal.isShow = false
        },
        updateTime () {
            let [startDate, endDate] = [...this.modal.value]
            if (startDate) {
                startDate = Vue.moment(startDate).format('YYYY-MM-DD HH:mm')
            } else {
                startDate = ''
            }
            if (endDate) {
                endDate = Vue.moment(endDate).format('YYYY-MM-DD HH:mm')
            } else {
                endDate = ''
            }
            this.$http.put(api.game_list + this.modal.id + '/', {
                display_name: this.modal.display_name,
                start_date: startDate,
                end_date: endDate
            }).then(data => {
                this.$set(this.queryset, this.modal.index, data)
                this.modal.msg = this.$t('game_manage.modify_success')
                this.$refs.alertMsg.trigger('success', 3)
            }, error => {
                this.modal.msg = this.$t('game_manage.modify_fail') + error
                this.$refs.alertMsg.trigger('danger')
            })
        },
        syncImg (e, attr) {
            var reader = new FileReader()

            reader.onload = (e) => {
                this.modal[attr] = e.target.result
            }
            reader.readAsDataURL(e.target.files[0])
            this.modal.iconResult[attr] = e.target.files[0]
        },
        updateImage (attr) {
            if (this.modal.iconResult[attr]) {
                let formData = new window.FormData()
                formData.append('display_name', this.modal.iconResult.display_name)
                formData.append('code', this.modal.iconResult.code)
                formData.append(attr, this.modal.iconResult[attr])
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
                this.modal.msg = attr === 'icon' ? this.$t('game_manage.no_setting_icon') : this.$t('game_manage.no_setting_icon_background')
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
                    $.notify({
                        message: this.$t('game_manage.modify_success')
                    })
                }, error => {
                    $.notify({
                        message: error,
                        type: 'danger'
                    })
                    this.queryset = this.initialQueryset
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
        editName (id, name) {
            this.$set(this.editNameList, id, name)
            this.$nextTick(() => {
                this.$refs[`input${id}`][0].select()
            })
        },
        submitName (id, name) {
            this.$set(this.editNameLoading, id, true)
            this.$http.put(`${api.game_list}${id}/`, {
                display_name: name
            }).then(data => {
                Object.assign(this.queryset.find(game => game.id === id), {
                    display_name: data.display_name
                })
                $.notify({
                    message: this.$t('action.update') + this.$t('status.success')
                })
                this.$delete(this.editNameLoading, id)
                this.cancelEditName(id)
            }, error => {
                $.notify({
                    message: error,
                    type: 'danger'
                })
            })
        },
        cancelEditName (id) {
            this.$delete(this.editNameList, id)
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
