<template>
<div>
    <div class="m-b">
        <ol class="breadcrumb">
            <li class="active"><router-link to="/chatroom">{{ $t('nav.chatroom_management') }}</router-link></li>
            <li class="active">{{ $route.meta.title }}</li>
        </ol>
    </div>

    <div class="box">
        <div class="box-header b-b">
            <h6 class="m-b-0">{{ title }}</h6>
        </div>
        <form class="box-body b-b">
            <div class="row m-b">
                <div class="col-md-4 p-r-md">
                    <h6>{{ $t('chatroom.setting') }}</h6>
                    <div class="form-group m-t-md">
                        <label  class="label-width">{{ $t('setting.display_name') }}</label>
                        <div class="inline-form-control">
                            <input
                                class="form-control"
                                :placeholder="$t('setting.display_name')"
                                v-model="chatroom.title"
                                required
                            />
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="manager">{{ $t('chatroom.manager') }}</label>
                        <span class="text-muted text-sm m-b-0">{{ $t('chatroom.keyin_tips') }}</span>
                        <textarea
                            class="form-control"
                            name="manager"
                            rows="3"
                            v-model="chatroom.managers"
                        />
                    </div>
                    <div class="form-group" v-if="!isDefaultChatroom">
                        <label for="planMaker">{{ $t('chatroom.plan_maker') }}</label>
                        <span class="text-muted text-sm m-b-0">{{ $t('chatroom.keyin_tips') }}</span>
                        <textarea
                            class="form-control"
                            name="planMaker"
                            rows="3"
                            v-model="chatroom.plan_makers"
                        />
                    </div>
                    <button
                        @click="submit('setting')"
                        type="button"
                        class="md-btn w-sm blue"
                    >
                        <span v-if="!settingSubmitLoading">{{ $t('common.save') }}</span>
                        <i class="fa fa-spin fa-spinner" v-else></i>
                    </button>
                </div>
                <div class="p-l-md col-md-8">
                    <h6 class="inline m-b-0 m-r-sm">{{ $t('chatroom.bulletin') }}</h6>
                    <button
                        type="button"
                        class="btn btn-sm btn-icon inline m-b-xs"
                        @click="addBulletin"
                    >
                        <i class="fa fa-plus text-blue"></i>
                    </button>
                    <table class="table table-striped b-a">
                        <thead>
                            <tr>
                                <th width="3%"></th>
                                <th>{{ $t('chatroom.bulletin_content') }}</th>
                                <th width="15%" class="text-center">{{ $t('common.status') }}</th>
                                <th width="20%" class="text-center">{{ $t('common.operate') }}</th>
                            </tr>
                        </thead>
                        <draggable
                            v-model="chatroom.bulletin"
                            :element="'tbody'"
                            v-if="!loading && chatroom.bulletin && chatroom.bulletin.length"
                            @change="debounceBulletinSubmit"
                        >
                            <tr v-for="(b, index) in chatroom.bulletin" :key="index">
                                <td class="v-m p-r-xs"><i class="fa fa-reorder text-blue"></i></td>
                                <td class="v-m" :class="{'p-t-0 p-b-0': b.editing}">
                                    <span v-if="!b.editing">{{ b.content }}</span>
                                    <input
                                        class="form-control inline"
                                        v-model="b.content"
                                        :ref="`bulletin${index}`"
                                        v-else
                                    />
                                </td>
                                <td class="v-m text-center text-break-all">
                                    <label class="md-switch m-l-sm">
                                        <input
                                            type="checkbox"
                                            v-model="b.status"
                                            @change="debounceBulletinSubmit"
                                        />
                                        <i class="success"></i>
                                    </label>
                                </td>
                                <td class="v-m text-center">
                                    <button
                                        type="button"
                                        class="btn btn-xs btn-icon"
                                        @click="editBulletin(b, index)"
                                        :class="b.editing ? 'success' : 'blue'"
                                        :disabled="!b.content"
                                    >
                                        <i class="fa fa-edit" v-show="!b.editing"></i>
                                        <i class="fa fa-check" v-show="b.editing"></i>
                                    </button>
                                    <button
                                        type="button"
                                        class="btn btn-xs btn-icon danger"
                                        @click="deleteBulletin(b, index)"
                                    >
                                        <i class="fa fa-trash-o"></i>
                                    </button>
                                </td>
                            </tr>
                        </draggable>
                    </table>
                    <div class="row text-center p-a" v-if="loading">
                        <i class="fa fa-spin fa-spinner"></i>
                        <b>{{ $t('common.loading') }}&nbsp;...</b>
                    </div>
                    <div class="row" v-else-if="!chatroom.bulletin || !chatroom.bulletin.length">
                        <div class="col-md-12 text-center">
                            {{ $t('common.no_record') }}
                        </div>
                    </div>

                    <h6 class="m-t-md">{{ $t('chatroom.plan_robot') }}</h6>
                    <table class="table table-striped b-a">
                        <thead>
                            <tr>
                                <th class="text-center" width="7%;"></th>
                                <th width="20%;">{{ $t('common.nickname') }}</th>
                                <th class="text-center">{{ $t('staff.role') }}</th>
                                <th class="text-center">{{ $t('common.game') }}</th>
                                <th>{{ $t('common.online_time') }}</th>
                                <th class="text-center">{{ $t('common.speak_interval') }}</th>
                                <th class="text-center">{{ $t('common.status') }}</th>
                                <th class="text-center p-r-sm p-l-xs">{{ $t('common.operate') }}</th>
                            </tr>
                        </thead>
                        <tbody v-if="!loading && chatroom.robots && chatroom.robots.length">
                            <tr
                                v-for="element in chatroom.robots"
                                :key="element.id"
                            >
                                <td class="text-center p-r-0">
                                    <img
                                        :src="element.user_robot.avatar_url || defaultAvatar"
                                        id="circle"
                                        style="height:40px; width:40px;"
                                    />
                                </td>
                                <td class="text-break-all">{{ element.user_robot.nickname }}</td>
                                <td class="text-center">{{ element.user_robot.level_name }}</td>
                                <td class="text-center">{{ gamesMapping[element.game_code] || '-' }}</td>
                                <td>
                                    <span>{{ element.day_of_week && `${$t('week.week')}: ${tranformWeek(element.day_of_week)}` }}</span>
                                    <br/>
                                    <span>{{ `${$t('common.time')}: ${element.on_time} ~ ${element.off_time}` }}</span>
                                </td>
                                <td class="text-right">{{ (element.speak_interval && `${element.speak_interval} ${$t('common.minute')}`) || '-' }}</td>
                                <td class="text-center p-r-xs">
                                    <label class="md-switch">
                                        <input
                                            type="checkbox"
                                            v-model="element.enabled"
                                            @change="updateRobot({ mode: 'update', field: 'status' }, 2, Object.assign({}, element, {
                                                hasAvatar: !!element.user_robot.avatar_url,
                                                hasAvatarFile: false,
                                                nickname: element.user_robot.nickname,
                                                level_name: element.user_robot.level_name,
                                                day_of_week: `${element.day_of_week}`,
                                                enabled: element.enabled
                                            }))"
                                        />
                                        <i class="success"></i>
                                    </label>
                                </td>
                                <td class="text-center p-r-sm p-l-xs">
                                    <button
                                        type="button"
                                        class="btn btn-xs btn-icon blue"
                                        @click="openModal('update', 2, Object.assign({}, element, {
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
                                    >
                                        <i class="fa fa-edit"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="row text-center p-a" v-if="loading">
                        <i class="fa fa-spin fa-spinner"></i>
                        <b>{{ $t('common.loading') }}&nbsp;...</b>
                    </div>
                    <div class="row" v-else-if="!chatroom.robots || !chatroom.robots.length">
                        <div class="col-md-12 text-center">
                            {{ $t('common.no_record') }}
                        </div>
                    </div>
                </div>
            </div>
        </form>
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
                <label class="form-control-label p-l-0">{{ gamesMapping[modal.robot.game_code] || '-' }}</label>
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
              @click="updateRobot({ mode: modal.mode }, 2, Object.assign({}, modal.robot, {
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
import Draggable from 'vuedraggable'
import TimePicker from 'vue2-timepicker'
import api from '../../api'
import $ from '../../utils/util'
import * as defaultAvatar from '../../../static/images/avatar.png'
import { debounce } from 'lodash'
const defaultChatroomID = 100000

export default {
    data () {
        return {
            id: '',
            isDefaultChatroom: false,
            title: '',
            chatroom: {
                title: '',
                managers: [],
                plan_makers: [],
                bulletin: [],
                robots: []
            },
            gamesMapping: {},
            modal: {
                showModal: false,
                mode: '',
                checkboxDay: {},
                robot: {}
            },
            robotUpdateFields: [
                'nickname',
                'game_code',
                'level_name',
                'day_of_week',
                'on_time',
                'off_time',
                'speak_interval',
                'enabled',
                'rooms'
            ],
            bulletinSubmitLoading: false,
            settingSubmitLoading: false,
            loading: true,
            defaultAvatar
        }
    },
    created () {
        this.$route.params.chatroomId && (this.id = parseInt(this.$route.params.chatroomId))
        this.isDefaultChatroom = (this.id === defaultChatroomID)
        this.getChatroom()
        this.getGamesName()
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
        getChatroom (id = this.id) {
            if (id) {
                this.$http.get(`${api.setting.chatroom}${id}/`).then(data => {
                    this.title = data.title
                    data.robots && data.robots.forEach(robot => {
                        robot.day_of_week = this.splitDayOfWeek(robot)
                    })
                    data.bulletin && data.bulletin.forEach(bulletin => {
                        Object.assign(bulletin, {
                            editing: false,
                            iniContent: bulletin.content
                        })
                    })
                    Object.assign(this.chatroom, data)
                    this.loading = false
                }, error => {
                    $.notify({
                        message: error,
                        type: 'danger'
                    })
                    this.loading = false
                })
            }
        },
        getGamesName () {
            this.$http.get(`${api.game.list}?opt_fields=code,display_name`).then(data => {
                data.forEach(game => {
                    this.$set(this.gamesMapping, game.code, game.display_name)
                })
            })
        },
        debounceBulletinSubmit: debounce(function () {
            this.submit('bulletin')
        }, 700),
        submit (category) {
            let result = {}
            if (category === 'bulletin') {
                result.bulletin = this.chatroom.bulletin
                .filter(b => b.content && !b.editing)
                .map(b => Object({
                    content: b.content,
                    status: b.status
                }))
                result.title = this.title
            } else if (category === 'setting') {
                ['managers', 'plan_makers'].forEach(name => {
                    if (!this.chatroom[name]) {
                        result[name] = []
                    } else if (typeof this.chatroom[name] === 'string') {
                        result[name] = this.chatroom[name].split(',')
                    }
                })
                result.title = this.chatroom.title
            }
            result.status = this.chatroom.status

            this[`${category}SubmitLoading`] = true
            this.$http.put(`${api.setting.chatroom}${this.id}/`, result).then(data => {
                if (category === 'bulletin') {
                    this.chatroom.bulletin.forEach(bulletin => {
                        Object.assign(bulletin, {
                            iniContent: bulletin.content
                        })
                    })
                } else {
                    this.title = data.title
                }
                $.notify({
                    message: this.$t('action.update') + this.$t('status.success')
                })
                this[`${category}SubmitLoading`] = false
            }, error => {
                $.notify({
                    message: error,
                    type: 'danger'
                })
                this[`${category}SubmitLoading`] = false
            })
        },
        addBulletin () {
            if (!this.chatroom.bulletin) {
                this.$set(this.chatroom, 'bulletin', [])
            }
            this.chatroom.bulletin = [{
                content: '',
                iniContent: '',
                status: 1,
                editing: true
            }, ...this.chatroom.bulletin]
            this.$nextTick(() => {
                this.$refs.bulletin0[0].select()
            })
        },
        editBulletin (bulletin, index) {
            bulletin.editing ^= 1
            if (bulletin.editing) {
                this.$nextTick(() => {
                    this.$refs[`bulletin${index}`][0].select()
                })
            } else if (bulletin.iniContent !== bulletin.content) {
                this.submit('bulletin')
            }
        },
        deleteBulletin (bulletin, index) {
            this.$delete(this.chatroom.bulletin, index)
            // if this bulletin has no-conent in origin, there is no need to submit to server.
            if (bulletin.iniContent) {
                this.debounceBulletinSubmit()
            }
        },
        splitDayOfWeek (element) {
            return element.day_of_week && element.day_of_week.split(',')
        },
        updateRobot ({ mode = '', field = '' }, type = 2, resultRobot) {
            let result = new window.FormData()
            result.append('type', type)
            let unfinished = this.robotUpdateFields.filter(key => resultRobot[key] === '' || resultRobot[key] === undefined)
            if (unfinished.length > 0 && mode !== 'delete') {
                $.notify({
                    message: this.$t('action.please_fill_object', {
                        object: unfinished.map(key => this.$t('common.' + key)).join(',')
                    }),
                    type: 'danger'
                })
                return
            } else {
                this.robotUpdateFields.forEach(key => {
                    result.append(key, resultRobot[key])
                })
            }
            if (resultRobot.hasAvatarFile) {
                result.append('avatar', resultRobot.avatarFile)
            } else if (!resultRobot.hasAvatar) {
                result.append('avatar', '')
            }

            this.modal.loading = true
            this.$http.put(`${api.setting.robot}${resultRobot.id}/`, result).then(data => {
                this.$set(this.chatroom.robots, this.chatroom.robots.findIndex(e => e.id === data.id), Object.assign(data, {
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
        Draggable,
        TimePicker
    }
}
</script>

<style lang="scss" scoped>
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
