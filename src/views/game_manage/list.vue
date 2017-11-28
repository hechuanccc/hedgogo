<template>
  <div>
    <div class="box" v-if="queryset.length">
      <table st-table="rowCollectionBasic" class="table table-striped b-t">
          <thead>
          <tr>
            <th>{{$t('game_manage.id')}}</th>
            <th>{{$t('game_manage.rank')}}</th>
            <th>{{$t('game_manage.name')}}</th>
            <th>{{$t('game_manage.holiday_start_time')}}</th>
            <th>{{$t('game_manage.holiday_end_time')}}</th>
            <th>{{$t('game_manage.enabled_status')}}</th>
            <th>{{$t('game_manage.closed_status')}}</th>
            <th>{{$t('game_manage.operating')}}</th>
          </tr>
          </thead>
          <tbody v-if="queryset.length > 0">
          <tr v-for="(game, index) in queryset" :key="game.id">
            <td>{{game.id}}</td>
            <td>{{game.rank}}</td>
            <td>
              <router-link :to="'/game_detail/' + game.id">{{game.display_name}}</router-link>
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
          </tbody>
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
                            <button type="button" class="btn btn-sm btn-default" @click="updateTime">{{$t('action.update')}}</button>
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
                        <div class="col-xs-5 inline-form-control m-t-75">
                            <input type="file" class="form-control" accept="image/*" @change="syncImg" required>
                        </div>
                        <div class="col-xs-2 col-xs-offset-2 text-right m-t-75">
                            <button type="button" class="btn btn-sm btn-default" @click="updateImage">{{$t('action.update')}}</button>
                        </div>
                    </div>
                    <div class="row m-l m-r">
                        <transition name="fade">
                            <div class="alert" :class="modal.classObject" v-if="modal.showMsg"><i class="fa" :class="modal.iconObject"></i> {{ modal.msg }}</div>
                        </transition>
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
import DatePicker from 'vue2-datepicker'

import Vue from 'vue'
// const formatDate = 'YYYY-MM-DD'

export default {
    data () {
        return {
            gameApi: api.game_list,
            query: {},
            queryset: [],
            optexpand: 'group',
            modal: {
                isShow: false,
                value: [],
                start_date: '',
                end_date: '',
                start_time: {
                    HH: '00',
                    mm: '00'
                },
                end_time: {
                    HH: '00',
                    mm: '00'
                },
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
                msg: '',
                showMsg: false,
                classObject: {
                    'alert-success': false,
                    'alert-warning': false,
                    'alert-danger': false
                },
                iconObject: {
                    'fa-check': false,
                    'fa-warning': false,
                    'fa-close': false
                }
            }
        }
    },
    created () {
        this.getGameList()
    },
    methods: {
        getGameList () {
            this.$http.get(api.game_list).then(response => {
                this.queryset = response.data
                const games = {}
                response.data.forEach(game => {
                    games[game.id] = game.display_name
                })
                this.$store.dispatch('setGame', games)
            }, response => {
                if (response.status === 401) {
                    this.$router.push('/login?next=' + this.$route.path)
                }
            })
        },
        toggleEnable (index) {
            const game = this.queryset[index]
            const params = {
                display_name: game.display_name,
                code: game.code,
                to_display: !game.to_display
            }
            this.$http.put(api.game_list + game.id + '/', params).then(response => {
                if (response.status === 200) {
                    this.$set(this.queryset, index, response.data)
                }
            })
        },
        toggleClose (index) {
            const game = this.queryset[index]
            const params = {
                display_name: game.display_name,
                code: game.code,
                status: game.status === 0 ? 1 : 0
            }
            this.$http.put(api.game_list + game.id + '/', params).then(response => {
                if (response.status === 200) {
                    this.$set(this.queryset, index, response.data)
                }
            })
        },
        showModal (index) {
            const game = this.queryset[index]
            this.modal.display_name = game.display_name
            this.modal.id = game.id
            this.modal.index = index
            this.modal.value = []
            this.modal.iconResult.display_name = game.display_name
            this.modal.iconResult.code = game.code
            this.modal.iconResult.icon = undefined
            this.modal.image = game.icon
            this.modal.isShow = true
        },
        showSuccessMsg () {
            this.modal.showMsg = true
            this.modal.msg = this.$t('game_manage.modify_success')
            this.modal.classObject['alert-success'] = true
            this.modal.iconObject['fa-check'] = true
            setTimeout(() => {
                this.modal.showMsg = false
                this.modal.msg = ''
                this.modal.classObject['alert-success'] = false
                this.modal.iconObject['fa-check'] = false
            }, 3000)
        },
        showWarningMsg (flag) {
            this.modal.showMsg = true
            this.modal.msg = this.$t('game_manage.no_setting_' + flag)
            this.modal.classObject['alert-warning'] = true
            this.modal.iconObject['fa-warning'] = true
            setTimeout(() => {
                this.modal.showMsg = false
                this.modal.msg = ''
                this.modal.classObject['alert-warning'] = false
                this.modal.iconObject['fa-warning'] = false
            }, 3000)
        },
        showErrorMsg () {
            this.modal.showMsg = true
            this.modal.msg = this.$t('game_manage.modify_fail')
            this.modal.classObject['alert-danger'] = true
            this.modal.iconObject['fa-clear'] = true
            setTimeout(() => {
                this.modal.showMsg = false
                this.modal.msg = ''
                this.modal.classObject['alert-danger'] = false
                this.modal.iconObject['fa-clear'] = false
            }, 3000)
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
                }).then(response => {
                    if (response.status === 200) {
                        this.$set(this.queryset, this.modal.index, response.data)
                        this.showSuccessMsg()
                    }
                }, response => {
                    this.showErrorMsg()
                })
            } else {
                this.showWarningMsg('holiday')
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
                formData.append('to_display', this.modal.iconResult.to_display)
                this.$http.put(api.game_list + this.modal.id + '/', formData)
                .then(response => {
                    if (response.status === 200) {
                        this.getGameList()
                        this.showSuccessMsg()
                    }
                }, response => {
                    this.showErrorMsg()
                })
            } else {
                this.showWarningMsg('icon')
            }
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
        DatePicker
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
.m-t-75{
    margin-top: 75px;
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
  transition: opacity 1s
}
.fade-enter, .fade-leave-to{
  opacity: 0
}
</style>
