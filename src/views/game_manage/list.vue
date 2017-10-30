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
                    <button type="button" class="close" aria-hidden="true" @click="hideModal">×
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
import TimePicker from 'vue2-timepicker'

import Vue from 'vue'
const formatDate = 'YYYY-MM-DD'

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
                index: '',
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
            this.modal.id = game.id
            this.modal.index = index
            this.modal.display_name = game.display_name
            this.modal.isShow = true

            let openDatetime = game.holidates.schedule_open
            let opentime
            if (openDatetime) {
                this.modal.start_date = openDatetime
                opentime = Vue.moment(openDatetime)
            } else {
                opentime = Vue.moment()
                this.modal.start_date = opentime
            }
            this.modal.start_time = {
                HH: opentime.format('HH'),
                mm: opentime.format('mm')
            }

            let closeDatetime = game.holidates.schedule_close
            let closeTime
            if (closeDatetime) {
                this.modal.end_date = closeDatetime
                closeTime = Vue.moment(closeDatetime)
            } else {
                closeTime = Vue.moment()
                this.modal.end_date = closeTime
            }
            this.modal.end_time = {
                HH: closeTime.format('HH'),
                mm: closeTime.format('mm')
            }
        },
        hideModal () {
            this.modal.isShow = false
        },
        updateTime () {
            const startTime = this.modal.start_time
            const endTime = this.modal.end_time
            this.$http.put(api.game_list + this.modal.id + '/', {
                display_name: this.modal.display_name,
                start_date: `${Vue.moment(this.modal.start_date).format(formatDate)} ${startTime.HH}:${startTime.mm}`,
                end_date: `${Vue.moment(this.modal.end_date).format(formatDate)} ${endTime.HH}:${endTime.mm}`
            }).then(response => {
                if (response.status === 200) {
                    this.$set(this.queryset, this.modal.index, response.data)
                    this.modal.isShow = false
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
        TimePicker
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
</style>
