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
          <tr v-for="game in queryset" :key="game.id">
            <td>{{game.id}}</td>
            <td>{{game.rank}}</td>
            <td>
              <router-link :to="'/game_detail/' + game.id">{{game.display_name}}</router-link>
            </td>
            <td>{{game.holidates.schedule_open || $t('game_manage.no_setting')}}</td>
            <td>{{game.holidates.schedule_close || $t('game_manage.no_setting')}}</td>
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
              <a class="p-l-xs" @click="toggleEnable(game)">{{!game.to_display ? $t('game_manage.enabled') : $t('game_manage.disabled')}}</a>
              <a class="p-l-xs" @click="toggleClose(game)">{{!game.status ? $t('game_manage.openning') : $t('game_manage.closed')}}</a>
              <a class="p-l-xs" @click="showModal(game)">{{$t('game_manage.setting')}}</a>
            </td>
          </tr>
          </tbody>
        </table>
    </div>
    <div class="modal" v-if="modal.isShow">
        <div class="modal-backdrop fade in" @click="modal.isShow=!modal.isShow"></div>
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true" @click="modal.isShow=!modal.isShow">×
                    </button>
                </div>
                <div class="modal-body">
                  <div class="row">
                    <div class="col-md-6">
                      <div class="text-center">
                        {{$t('game_manage.holiday_start_time')}}
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="text-center">
                        {{$t('game_manage.holiday_end_time')}}
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-3 p-x-xs">
                      <date-picker width='140' v-model="modal.start_date"></date-picker>
                    </div>
                    <div class="col-md-3 p-x-xs">
                      <time-picker v-model="modal.start_time" format="HH:mm"></time-picker>
                    </div>
                    <div class="col-md-3 p-x-xs">
                      <date-picker width='140' v-model="modal.end_date"></date-picker>
                    </div>
                    <div class="col-md-3 p-x-xs">
                      <time-picker v-model="modal.end_time" format="HH:mm"></time-picker>
                    </div>
                  </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" @click="updateTime">{{$t('action.update')}}</button>
                    <button type="button" class="btn btn-default" data-dismiss="modal" @click="modal.isShow=!modal.isShow">{{$t('staff.close')}}</button>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>
<script>
import api from '../../api'
import DatePicker from 'vue2-datepicker'
import TimePicker from 'vue2-timepicker'

import Vue from 'vue'
const formatDateTime = 'YYYY-MM-DD HH:mm'

export default {
    data () {
        return {
            gameApi: api.game_list,
            query: {},
            queryset: [],
            optexpand: 'group',
            modal: {
                isShow: false,
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
                id: '',
                display_name: '',
                code: ''
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
                this.queryset.forEach(game => {
                    if (game.holidates.schedule_open) {
                        game.holidates.schedule_open = Vue.moment(game.holidates.schedule_open).format(formatDateTime)
                    }
                    if (game.holidates.schedule_close) {
                        game.holidates.schedule_close = Vue.moment(game.holidates.schedule_close).format(formatDateTime)
                    }
                })
            }, response => {
                if (response.status === 401) {
                    this.$router.push('/login?next=' + this.$route.path)
                }
            })
        },
        toggleEnable (game) {
            const params = {
                display_name: game.display_name,
                code: game.code,
                to_display: !game.to_display
            }
            this.$http.put(api.game_list + game.id + '/', params).then(response => {
                if (response.status === 200) {

                }
            }, response => {

            })
        },
        toggleClose (game) {
            const params = {
                display_name: game.display_name,
                code: game.code,
                status: !game.status
            }
            this.$http.put(api.game_list + game.id + '/', params).then(response => {
                if (response.status === 200) {

                }
            }, response => {

            })
        },
        showModal (game) {
            this.modal.id = game.id
            this.modal.display_name = game.display_name
            this.modal.code = game.code
            this.modal.isShow = true

            let openDatetime = game.holidates.schedule_open || Vue.moment().format(formatDateTime)
            let closeDatetime = game.holidates.schedule_close || Vue.moment().format(formatDateTime)

            openDatetime = openDatetime.split(' ')
            closeDatetime = closeDatetime.split(' ')

            this.modal.start_date = openDatetime[0]
            this.modal.end_date = closeDatetime[0]

            let openTIme = openDatetime[1].split(':')
            let closeTIme = closeDatetime[1].split(':')

            this.modal.start_time.HH = openTIme[0]
            this.modal.start_time.mm = openTIme[1]
            this.modal.end_time.HH = closeTIme[0]
            this.modal.end_time.mm = closeTIme[1]
        },
        updateTime () {
            this.$http.put(api.game_list + this.modal.id + '/', {
                display_name: this.modal.display_name,
                code: this.modal.code,
                start_date: this.modal.start_date + ' ' + this.modal.start_time.HH + ':' + this.modal.start_time.mm,
                end_date: this.modal.end_date + ' ' + this.modal.end_time.HH + ':' + this.modal.end_time.mm
            }).then(response => {
                if (response.status === 200) {
                    for (let i = 0; i < this.queryset.length; i++) {
                        if (this.queryset[i].id === response.data.id) {
                            this.queryset.splice(i, 1, response.data)
                            this.modal.isShow = false
                            break
                        }
                    }
                }
            }, response => {

            })
        }
    },
    components: {
        DatePicker,
        TimePicker
    }
}
</script>
<style scoped>
    .modal-backdrop, .modal{z-index: 1}
    .modal-dialog{z-index: 10;top: 10%}
        .modal{display: block;}
</style>
