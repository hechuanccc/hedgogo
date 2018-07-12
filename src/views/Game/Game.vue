<template>
  <div>
    <div class="row">
        <div class="pull-right m-r">
            <button class="md-btn w-sm blue m-b" @click="changeMode">{{ mode ? $t('system.adjust_rank') : $t('dic.confirm') }}</button>
            <button class="md-btn w-sm m-b m-l-sm" v-show="!mode" @click="cancelAdjustRank">{{ $t('dic.cancel') }}</button>
        </div>
    </div>
    <div class="box" v-if="!loading">
      <table st-table="rowCollectionBasic" class="table table-striped b-t" v-if="queryset.length">
          <thead>
          <tr>
            <th v-show="!mode"></th>
            <th width="15%">{{$t('dic.game')}}</th>
            <th width="7%"></th>
            <th class="text-center">{{$t('game.holiday_start_at')}}</th>
            <th class="text-center">{{$t('game.holiday_end_at')}}</th>
            <th class="text-center">{{$t('system.enabled_status')}}</th>
            <th class="text-center">{{$t('game.closed_status')}}</th>
            <th class="text-center">{{$t('dic.operate')}}</th>
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
            <td
              class="text-uppercase text-left"
              :class="{
                'p-t-xs p-b-xs p-l-sm': editNameList[game.id] !== undefined
              }"
            >
              <!-- game_type: 0 => lottery ; 1 => sports -->
              <span
                v-show="editNameList[game.id] === undefined"
                v-if="game.game_type === 1"
              >{{game.display_name}}</span>
              <router-link
                :to="`/game_detail/${game.id}/?display_name=${game.display_name}`"
                v-show="editNameList[game.id] === undefined"
                v-else
              >
                {{game.display_name}}
              </router-link>
              <input
                class="form-control w-sm inline p-l-sm"
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
            <td>
                <span v-if="game.holidates.schedule_open">{{game.holidates.schedule_open | moment('YYYY-MM-DD HH:mm:ss') }}</span>
                <span v-else>{{ $t('system.no_setting') }}</span>
            </td>
            <td>
                <span v-if="game.holidates.schedule_close">{{game.holidates.schedule_close | moment('YYYY-MM-DD HH:mm:ss') }}</span>
                <span v-else>{{ $t('system.no_setting') }}</span>
            </td>
            <td>
              <div :class="game.to_display ? 'text-success': 'text-danger'">
                {{game.to_display ? $t('status.active') : $t('status.disabled')}}
              </div>
            </td>
            <td>
                <span class="text-success" v-if="game.status === 1">{{ $t('game.open') }}</span>
                <span class="text-danger" v-else>{{ game.status === 0 ? $t('game.closed') : $t('game.holiday') }}</span>
            </td>
            <td class="text-center">
              <span class="text-muted p-l-xs" v-if="game.status === 2">
                  {{!game.to_display ? $t('status.active') : $t('status.disabled')}}
              </span>
              <a
                class="p-l-xs"
                @click="toggleEnable(index)"
                v-show="updateGameStatusPermission"
                v-else
              >{{!game.to_display ? $t('status.active') : $t('status.disabled')}}
              </a>
              <span class="text-muted p-l-xs" v-if="game.status === 2">
                  {{ $t('game.holiday') }}
              </span>
              <a
                class="p-l-xs"
                @click="toggleClose(index)"
                v-else-if="updateGameStatusPermission"
              >{{!game.status ? $t('game.open') : $t('game.closed')}}
              </a>
              <a class="p-l-xs" @click="showModal(index)">{{$t('dic.set')}}</a>
            </td>
          </tr>
          </draggable>
        </table>
    </div>
    <p v-else class="text-center">
        <i class="fa fa-spin fa-spinner"></i>
        <b>{{ $t('system.loading') }}</b>
    </p>
    <div class="modal" v-if="modal.isShow">
        <div class="modal-backdrop fade in" @click="hideModal"></div>
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <span>{{ modal.display_name }}- {{ $t('dic.set') }}</span>
                    <button type="button" class="close" aria-hidden="true" @click="hideModal">
                        <i class="fa fa-times"></i>
                    </button>
                </div>
                <div class="modal-body m-r m-l">
                    <div class="row m-b" v-if="updateGameStatusPermission">
                        <span>{{ $t('game.set_holiday') }}</span>
                    </div>
                    <div class="row m-b m-l" v-if="updateGameStatusPermission">
                        <div class="col-xs-8">
                            <el-date-picker
                                v-model="modal.value"
                                size="mini"
                                type="datetimerange"
                                unlink-panels
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                            />
                        </div>
                        <div class="col-xs-3 col-xs-offset-1 text-right">
                            <button type="button" class="md-btn w-xs btn blue" @click="updateTime">{{$t('dic.update')}}</button>
                        </div>
                    </div>
                    <div class="row"></div>
                    <div class="row m-t m-b">
                        <span>{{ $t('game.set_icon') }}</span>
                    </div>
                    <div class="row m-b m-l">
                        <div class="col-xs-4 text-center" v-if="modal.icon">
                            <img :src="modal.icon" width="108" height="108">
                        </div>
                        <div class="col-xs-4 text-center" v-else>
                            <div id="circle">
                                <span>{{ $t('game.no_set_icon') }}</span>
                            </div>
                        </div>
                        <div class="col-xs-3 inline-form-control m-t-lg" v-if="$root.permissions.includes('update_game_icon')">
                            <input type="file" class="form-control w-md" accept="image/*" @change="syncImg($event, 'icon')" required>
                        </div>
                        <div class="col-xs-3 col-xs-offset-2 text-right m-t-lg"  v-if="$root.permissions.includes('update_game_icon')">
                            <button type="button" class="md-btn w-xs btn blue" @click="updateImage('icon')">{{$t('dic.update')}}</button>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn w-xs" @click="hideModal">{{$t('dic.close')}}</button>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
import { getGame, updateGame } from '../../service'
import $ from '../../utils/util'

import Vue from 'vue'

export default {
    data () {
        return {
            mode: 1,
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
            getGame('list')
            .then(data => { this.queryset = data })
            .finally(() => { this.loading = false })
        },
        toggleEnable (index) {
            const game = this.queryset[index]
            const data = {
                display_name: game.display_name,
                code: game.code,
                to_display: !game.to_display
            }
            updateGame('list', {
                id: game.id,
                data
            }, {
                action: this.$t('dic.update'),
                object: this.$t('system.enabled_status')
            }).then(data => {
                this.$set(this.queryset, index, data)
            })
        },
        toggleClose (index) {
            const game = this.queryset[index]
            const data = {
                display_name: game.display_name,
                code: game.code,
                status: game.status === 0 ? 1 : 0
            }
            updateGame('list', {
                id: game.id,
                data
            }, {
                action: this.$t('dic.update'),
                object: this.$t('game.closed_status')
            }).then(data => {
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
                value: [game.holidates.schedule_open || undefined, game.holidates.schedule_close || undefined],
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
            let [startDate, endDate] = [...(this.modal.value || ['', ''])]
            if (startDate) {
                startDate = Vue.moment(startDate).format('YYYY-MM-DD HH:mm')
            }
            if (endDate) {
                endDate = Vue.moment(endDate).format('YYYY-MM-DD HH:mm')
            }
            updateGame('list', {
                id: this.modal.id,
                data: {
                    display_name: this.modal.display_name,
                    start_date: startDate,
                    end_date: endDate
                }
            }, {
                object: this.$t('game.set_holiday')
            }).then(data => {
                this.$set(this.queryset, this.modal.index, data)
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

                updateGame('list', {
                    id: this.modal.id,
                    data: formData
                }, {
                    object: this.$t('game.set_icon')
                }).then(() => {
                    this.getGameList()
                })
            } else {
                $.notify({
                    message: this.$t('game.no_set_icon'),
                    type: 'warning'
                })
            }
        },
        changeMode () {
            if (!this.mode) {
                updateGame('list', {
                    data: this.queryset.map(({ id, display_name }, index) => Object({
                        id,
                        display_name,
                        rank: index + 1
                    }))
                }, {
                    action: this.$t('system.adjust_rank')
                }).then(() => {}, () => {
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
            updateGame('list', {
                id,
                data: {
                    display_name: name
                }
            }, {
                action: this.$t('dic.update'),
                object: this.$t('title.game_name')
            }).then(data => {
                Object.assign(this.queryset.find(game => game.id === id), {
                    display_name: data.display_name
                })
                this.cancelEditName(id)
            }).finally(() => { this.$delete(this.editNameLoading, id) })
        },
        cancelEditName (id) {
            this.$delete(this.editNameList, id)
        }
    },
    components: {
        draggable
    }
}
</script>
<style scoped>
#circle {
  width: 108px;
  height: 108px;
  line-height: 108px;
  background: lightgray;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  border-radius: 50%;
}
</style>
