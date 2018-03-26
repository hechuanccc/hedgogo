<template>
  <div>
    <div class="box p-a">
      <table st-table="rowCollectionBasic" class="table table-striped">
        <thead>
          <tr>
            <th class="text-center" style="width: 7%;">{{ $t('common.avatar') }}</th>
            <th>{{ $t('common.nickname') }}</th>
            <th>{{ $t('staff.role') }}</th>
            <th>{{ $t('common.game') }}</th>
            <th>{{ $t('common.online_time') }}</th>
            <th>{{ $t('common.speak_interval') }}</th>
            <th class="text-center" style="width: 10%;">{{ $t('common.status') }}</th>
            <th class="text-center" style="width: 10%;">{{ $t('common.operate') }}</th>
          </tr>
        </thead>
        <tbody v-if="!pageLoading">
          <tr
            v-for="element in robots"
            :key="element.id"
          >
            <td class="text-center">
              <img
                :src="element.user_robot.avatar_url || defaultAvatar"
                id="circle"
                style="height:48px; width:48px;"
              />
            </td>
            <td>{{ element.user_robot.nickname }}</td>
            <td>{{ element.user_robot.level_name }}</td>
            <td>{{ transformCode(element.game_code) }}</td>
            <td>
              <span>{{ element.day_of_week && `${$t('week.week')}: ${tranformWeek(element.day_of_week)}` }}</span>
              <br/>
              <span>{{ `${$t('common.time')}: ${element.on_time} ~ ${element.off_time}` }}</span>
            </td>
            <td>{{ (element.speak_interval && element.speak_interval + $t('common.minute')) || '-' }}</td>
            <td class="text-center p-r-0">
              <label
                class="label m-r-xs"
                :class="element.enabled ? 'success' : 'danger'"
              >{{ element.enabled ? $t('status.active') : $t('status.inactive') }}
              </label>
              <a
                @click="updateRobot({ mode: 'update', field: 'status' }, type, Object.assign({}, element, {
                  nickname: element.user_robot.nickname,
                  level_name: element.user_robot.level_name,
                  day_of_week: `${element.day_of_week}`,
                  enabled: !element.enabled
                }))"
              >{{ element.enabled ? $t('status.inactive') : $t('status.active') }}
              </a>
            </td>
            <td class="text-center">
              <a
                @click="openModal('update', type, Object.assign({}, element, {
                  avatar: element.user_robot.avatar_url,
                  hasAvatar: !!element.user_robot.avatar_url,
                  hasAvatarFile: false,
                  avatarFile: '',
                  nickname: element.user_robot.nickname,
                  role: element.user_robot.level_name === '管理员' ? '2' : '1',
                  on_time: {
                    HH: element.on_time.split(':')[0],
                    mm: element.on_time.split(':')[1]
                  },
                  off_time: {
                    HH: element.off_time.split(':')[0],
                    mm: element.off_time.split(':')[1]
                  }
                }))"
              >{{ $t('action.update') }}
              </a>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="row" v-if="pageLoading">
        <div class="text-center">
          <i class="fa fa-spin fa-spinner"></i> <b>{{ $t('common.loading') }}</b>
        </div>
      </div>

      <div class="row" v-if="!pageLoading && !robots.length">
        <div class="text-center m-t">
          <span>{{ $t('common.no_data') }}</span>
        </div>
      </div>
    </div>

    <div class="modal" v-if="modal.showModal">
      <div class="modal-backdrop fade in" @click="modal.showModal = false">
      </div>
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ modal.mode && $t(`action.${modal.mode}_object`, {
                object: $t('common.plan_robot')
              }) }}
            </h5>
          </div>
          <div class="modal-body p-lg">
            <div class="row">
              <div class="col-sm-4 col-sm-offset-4 text-center">
                <div class="avatar-nav">
                  <button
                    type="button"
                    class="btn btn-xs btn-icon nav-delete"
                    @click="clearImg"
                    v-if="modal.robot.hasAvatar"
                  >
                    <i class="fa fa-times"></i>
                  </button>
                </div>
                <label class="avatar m-b-0">
                  <img
                    :src="modal.robot.avatar"
                    id="circle"
                    v-if="modal.robot.hasAvatar"
                  />
                  <img
                    :src="defaultAvatar"
                    id="circle"
                    v-else
                  />
                  <div class="upload-overlay">
                    <i class="fa fa-cloud-upload"></i>
                  </div>
                  <h6 class="m-t-sm">{{ $t('action.update_object', {
                    object: $t('common.avatar')}) }}
                  </h6>
                  <input
                    type="file"
                    accept="image/*"
                    style="display: none"
                    @change="syncImg($event)"
                  />
                </label>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-3 col-sm-offset-1 text-right">
                <label class="form-control-label">{{ $t('common.nickname') }}</label>
              </div>
              <div class="col-sm-4">
                <input
                  class="form-control"
                  v-model.trim="modal.robot.nickname"
                />
              </div>
            </div>
            <div class="row m-t-xs">
                <div class="col-sm-3 col-sm-offset-1 text-right">
                  <label class="form-control-label">{{ $t('staff.role') }}</label>
                </div>
                <div class="col-sm-6 p-t-sm">
                  <label class="sm-check m-r">
                    <input class="c-radio" type="radio" value="1" v-model="modal.robot.role">
                    <i class="blue m-r-xs"></i>
                    {{ $t('robot.member') }}
                  </label>
                  <label class="sm-check m-r">
                    <input class="c-radio" type="radio" value="2" v-model="modal.robot.role">
                    <i class="blue m-r-xs"></i>
                    {{ $t('robot.manager') }}
                  </label>
                </div>
              </div>
            <div class="row m-t-xs b-b p-b-xs">
              <div class="col-sm-3 col-sm-offset-1 text-right">
                <label class="form-control-label">{{ $t('common.game') }}</label>
              </div>
              <div class="col-sm-6">
                <label class="form-control-label p-l-0">{{ transformCode(modal.robot.game_code) }}</label>
              </div>
            </div>
            <div class="row m-t-xs">
              <div class="col-sm-3 col-sm-offset-1 text-right">
                <label class="form-control-label">{{ $t('common.online_time') }}</label>
              </div>
              <div class="col-sm-6 p-t-sm">
                {{ $t('week.week') }}
                <label class="m-l">
                  <input
                    type="checkbox"
                    :checked="isSelectAll"
                    @change="toggleSelectAllDays($event)"
                  />
                  <i class="dark-white"></i>
                  {{ $t('common.select_all') }}
                </label>
                <div class="checkbox">
                  <label class="m-r" v-for="i in 7" :key="i">
                    <input
                      type="checkbox"
                      name="week"
                      v-model="modal.checkboxDay[i%7]"
                    />
                    <i class="dark-white"></i>
                    {{ $t('week.' + (i % 7)) }}
                  </label>
                </div>
              </div>
            </div>
            <div class="row m-t-xs">
              <div class="col-sm-3 col-sm-offset-1 text-right">
                <label class="form-control-label">{{ $t('common.on_time') }}</label>
              </div>
              <div class="col-sm-6">
                <time-picker v-model="modal.robot.on_time"/>
              </div>
            </div>
            <div class="row m-t-xs">
              <div class="col-sm-3 col-sm-offset-1 text-right">
                <label class="form-control-label">{{ $t('common.off_time') }}</label>
              </div>
              <div class="col-sm-6">
                <time-picker v-model="modal.robot.off_time"/>
              </div>
            </div>
            <div class="row m-t-xs m-b-sm">
              <div class="col-sm-3 col-sm-offset-1 text-right">
                <label class="form-control-label">{{ $t('common.speak_interval') }}</label>
              </div>
              <div class="col-sm-3 p-r-0">
                <input
                  type="number"
                  style="width:140px;"
                  class="form-control"
                  v-model="modal.robot.speak_interval"
                />
              </div>
              <div class="col-sm-3 text-left p-l-0">
                <label class="form-control-label">{{ $t('common.minute')}}</label>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn dark-white p-x-md w-xs" @click="modal.showModal = false">
              {{ $t('action.cancel') }}
            </button>
            <button
              type="button"
              class="btn blue p-x-md w-xs"
              @click="updateRobot({ mode: modal.mode }, type, Object.assign({}, modal.robot, {
                level_name: modal.robot.role === '1' ? $t('robot.member') : $t('robot.manager'), 
                day_of_week: `${modal.robot.day_of_week}`,
                on_time: (modal.robot.on_time.HH && modal.robot.on_time.mm) ? `${modal.robot.on_time.HH}:${modal.robot.on_time.mm}` : '',
                off_time: (modal.robot.off_time.HH && modal.robot.off_time.mm) ? `${modal.robot.off_time.HH}:${modal.robot.off_time.mm}` : ''
              }))"
            >
              <span v-if="modal.loading"><i class="fa fa-spin fa-spinner"></i></span>
              <span v-else>{{ $t('action.confirm') }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from '../../api'
import TimePicker from 'vue2-timepicker'
import $ from '../../utils/util'
const defaultAvatar = require('../../assets/avatar.png')
export default {
    data () {
        return {
            pageLoading: true,
            type: 2,
            robots: [],
            games: [],
            modal: {
                showModal: false,
                mode: '',
                checkboxDay: {},
                robot: {}
            },
            updateFields: [
                'nickname',
                'game_code',
                'level_name',
                'day_of_week',
                'on_time',
                'off_time',
                'speak_interval',
                'enabled'
            ],
            defaultAvatar
        }
    },
    created () {
        this.getRobots()
        this.getGames()
    },
    computed: {
        isSelectAll () {
            return this.modal.robot.day_of_week.length === 7
        }
    },
    watch: {
        'modal.checkboxDay': {
            handler (newObj) {
                this.modal.robot.day_of_week = Object.keys(newObj).filter(e => newObj[e])
            },
            deep: true
        }
    },
    methods: {
        getRobots () {
            this.$http.get(api.robot).then(data => {
                data.forEach(element => {
                    element.day_of_week = this.splitDayOfWeek(element)
                })
                this.robots = data
                this.pageLoading = false
            })
        },
        getGames () {
            this.$http.get(`${api.game_list}?opt_fields=code,display_name`).then(data => {
                this.games = data
            })
        },
        transformCode (code) {
            return this.games.find(e => e.code === code).display_name
        },
        splitDayOfWeek (element) {
            return element.day_of_week && element.day_of_week.split(',')
        },
        textBreakAll (str) {
            return str && str.replace(/(\r\n|\r|\n)/g, '<br/>')
        },
        updateRobot ({ mode = '', field = '' }, type = 2, resultRobot) {
            let result = new window.FormData()
            result.append('type', type)
            let unfinished = this.updateFields.filter(key => resultRobot[key] === '' || resultRobot[key] === undefined)
            if (unfinished.length > 0 && mode !== 'delete') {
                $.notify({
                    message: this.$t('action.please_fill_object', {
                        object: unfinished.map(key => this.$t('common.' + key)).join(',')
                    }),
                    type: 'danger'
                })
                return
            } else {
                this.updateFields.forEach(key => {
                    result.append(key, resultRobot[key])
                })
            }
            if (resultRobot.hasAvatarFile) {
                result.append('avatar', resultRobot.avatarFile)
            } else if (!resultRobot.hasAvatar) {
                result.append('avatar', '')
            }

            this.modal.loading = true
            this.$http.put(`${api.robot}${resultRobot.id}/`, result).then(data => {
                this.$set(this.robots, this.robots.findIndex(e => e.id === data.id), Object.assign(data, {
                    day_of_week: this.splitDayOfWeek(data)
                }))
                this.notify(mode, 'success', 'success', true)
            }, error => {
                this.notify(mode, 'danger', 'failed', false, error)
            })
        },
        openModal (mode = '', type = 2, robot = {
            avatar: null,
            hasAvatar: false,
            avatarFile: '',
            nickname: '',
            role: '',
            day_of_week: [],
            speak_interval: '',
            on_time: {
                HH: '0',
                mm: '0'
            },
            off_time: {
                HH: '0',
                mm: '0'
            },
            game_code: '',
            enabled: true
        }) {
            this.modal = Object.assign({
                mode,
                type,
                robot,
                checkboxDay: {},
                showModal: true,
                loading: false
            })
            this.modal.robot.day_of_week.forEach(element => {
                this.$set(this.modal.checkboxDay, element, true)
            })
        },
        syncImg (e) {
            let file = e.target.files[0]

            if (file) {
                var reader = new FileReader()
                reader.onload = (e) => {
                    this.modal.robot.avatar = e.target.result
                }
                reader.readAsDataURL(file)
                this.modal.robot.avatarFile = file
                this.modal.robot.hasAvatar = true
                this.modal.robot.hasAvatarFile = true
            }
        },
        clearImg () {
            this.modal.robot.hasAvatar = false
            this.modal.robot.hasAvatarFile = false
        },
        tranformWeek (days = []) {
            return days.map(element => this.$t('week.' + element)).join(',')
        },
        toggleSelectAllDays (e) {
            for (let i = 0; i < 7; ++i) {
                this.$set(this.modal.checkboxDay, i, e.target.checked)
            }
        },
        closeModal () {
            this.modal.showModal = false
        },
        notify (operate = 'update', type = 'success', status = 'success', closeModal = false, addMsg = '') {
            this.modal.loading = false
            $.notify({
                message: this.$t('action.' + operate) + this.$t('status.' + status) + (addMsg && ` (${addMsg})`),
                type
            })
            closeModal && this.closeModal()
        }
    },
    components: {
        TimePicker
    }
}
</script>

<style lang="scss" scoped>
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
  border-radius: 50%;
}
.avatar {
  width: 108px;
  cursor: pointer;
  .upload-overlay {
    background-color: rgba(33, 152, 243, 0.87);
    transition: all .5s ease;
    background-repeat: no-repeat;
    background-position: center;
    border-radius: 100%;
    position: absolute;
    height: 108px;
    width: 108px;
    left: 0;
    top: 0;
    opacity: 0;

    img {
      border-radius: 100%;
      width: 108px;
      margin-left: 1px;
    }

    i {
      vertical-align: bottom;
      display:inline-block;
      line-height: 108px;
      text-align: center;
      font-size: 40px;
      height: 110px;
      width: 110px;
      left: -2px;
      top:-2px;
      color: white;
    }
  }

  &:hover .upload-overlay {
    transition: all .5s ease;
    opacity: 1;
    top: 0;
  }
}
.avatar-nav {
  position: absolute;
  top: 0;
  right: 0;
  width: 42px;
  height: 100%;
  font-size: 30px;
  color: #fff;

  .nav-delete {
    position: absolute;
    color: black;
    top: 0;
    left: 0;
  }
}
</style>
