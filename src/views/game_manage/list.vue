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
            <th>{{$t('game_manage.to_display')}}</th>
            <th>{{$t('game_manage.to_closed')}}</th>
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
            <td>{{game.holiday_start_time || $t('game_manage.no_setting')}}</td>
            <td>{{game.holiday_end_time || $t('game_manage.no_setting')}}</td>
            <td>
              <div :class="game.to_display ? 'text-success': 'text-danger'">
                {{game.to_display ? $t('game_manage.enabled') : $t('game_manage.disabled')}}
              </div>
            </td>
            <td>
              <div :class="game.to_closed ? 'text-success': 'text-danger'">
                {{game.to_closed ? $t('game_manage.openning') : $t('game_manage.closed')}}
              </div>
            </td>
            <td>
              <a class="p-l-xs" href="">{{!game.to_display ? $t('game_manage.enabled') : $t('game_manage.disabled')}}</a>
              <a class="p-l-xs" href="">{{!game.to_closed ? $t('game_manage.openning') : $t('game_manage.closed')}}</a>
              <a class="p-l-xs" @click="showModal(game.id)">{{$t('game_manage.setting')}}</a>
            </td>
          </tr>
          </tbody>
        </table>
    </div>
    <div class="modal" v-if="modalShowed">
        <div class="modal-backdrop fade in" ></div>
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true" @click="modalShowed=!modalShowed">×
                    </button>
                </div>
                <div class="modal-body">
                  <div class="row">
                    <div class="col-md-6">
                      <div class="text-center">
                        {{$t('game_manage.holiday_start_time')}}
                      </div>
                      <date-picker width='140' v-model="start_date"></date-picker>
                      <input class="w-sm timepicker" type="time" v-model="start_time">
                    </div>
                    <div class="col-md-6">
                      <div class="text-center">
                        {{$t('game_manage.holiday_end_time')}}
                      </div>
                      <date-picker width='140' v-model="end_date"></date-picker>
                      <input class="w-sm timepicker" type="time" v-model="end_time">
                    </div>
                  </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal" @click="modalShowed=!modalShowed">{{$t('staff.close')}}</button>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>
<script>
import api from '../../api'
import DatePicker from 'vue2-datepicker'
// import Vue from 'vue'
// const format = 'YYYY-MM-DD'

export default {
    data () {
        return {
            gameApi: api.game_list,
            query: {},
            queryset: [],
            optexpand: 'group',
            modalShowed: false,
            start_date: '',
            end_date: '',
            start_time: '',
            end_time: ''
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
        toggleEnable (game) {
            const params = {
                display_name: game.display_name,
                code: game.code,
                to_display: game.to_display
            }
            this.$http.put(api.game_list + game.id + '/', params).then(response => {
                if (response.status === 200) {
                    this.getGameList()
                }
            }, response => {

            })
        },
        toggleOpen (game) {
            const params = {
                display_name: game.display_name,
                code: game.code,
                to_display: game.to_display
            }
            this.$http.put(api.game_list + game.id + '/', params).then(response => {
                if (response.status === 200) {
                    this.getGameList()
                }
            }, response => {

            })
        },
        showModal (id) {
            this.modalShowed = true
        }
    },
    components: {
        DatePicker
    }
}
</script>
<style scoped>
    .modal-backdrop, .modal{z-index: 1}
    .modal-dialog{z-index: 10;top: 10%}
        .modal{display: block;}
    .timepicker{height: 33px}
</style>
