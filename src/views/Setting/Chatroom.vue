
<template>
<div>
    <h6>{{ $t('chatroom.preference_setting') }}</h6>
    <div class="box">
        <table st-table="rowCollectionBasic" class="table table-striped b-t v-m">
            <thead>
                <tr>
                    <th width="15%" class="text-center">{{ $t('misc.parameter') }}</th>
                    <th>{{ $t('misc.parameter_value') }}</th>
                    <th
                        width="7%"
                        class="text-center"
                        v-if="$root.permissions.includes('update_global_parameters_setting')"
                    >{{ $t('dic.operate') }}
                    </th>
                </tr>
            </thead>
            <tbody v-if="!preferenceLoading">
                <tr
                    v-for="(preference, index) in preferences"
                    :key="index"
                    class="align-middle"
                >
                    <td class="text-center align-middle">{{ preference.display_name }}</td>
                    <td class="text-break-all">
                        <div v-if="preference.type === 1 && typeof preference.value === 'object'">
                            <span
                                v-for="(e, i) in preference.value"
                                :key="e.key"
                                class="m-b-0"
                            >
                                <span>{{ `${!i ? '' : ' , '}${e.display_name}: ` }}</span>
                                <span
                                    :class="e.value == 1 ? 'success' : 'danger'"
                                    class="label"
                                    v-if="e.type === 2"
                                >
                                    {{ e.value ? $t('status.active') : $t('status.inactive') }}
                                </span>
                                <span v-else>{{ e.value }}</span>
                            </span>
                        </div>
                        <span
                            :class="preference.value ? 'success' : 'danger'"
                            class="label m-r-sm"
                            v-else-if="preference.type === 3"
                        >
                            {{ preference.value ? $t('status.active') : $t('status.inactive') }}
                        </span>
                        <span v-else>{{ preference.value }}</span>
                        <label
                            class="md-switch m-r m-t-xs"
                            v-if="preference.type === 3"
                        >
                            <input
                                type="checkbox"
                                v-model="preference.value"
                                @change="updatePreference(Object.assign({}, preference, {
                                    displayName: preference.display_name,
                                    index
                                }))"
                            />
                            <i class="success"></i>
                        </label>
                    </td>
                    <td class="text-center align-middle">
                        <a @click="openModal(index, preference)" v-if="preference.type !== 3">{{ $t('dic.update') }}</a>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="row text-center p-a" v-if="preferenceLoading">
            <i class="fa fa-spin fa-spinner"></i>
            <b>{{ $t('system.loading') }}</b>
        </div>
        <div class="row" v-if="!preferenceLoading && !preferences.length">
            <div class="text-center m-a">
                <span>{{ $t('system.no_record') }}</span>
            </div>
        </div>
    </div>

    <h6>{{ $t('chatroom.list') }}</h6>
    <div class="box">
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>{{ $t('misc.display_name') }}</th>
                    <th>{{ $t('chatroom.game_room') }}</th>
                    <th>{{ $t('chatroom.manager') }}</th>
                    <th>{{ $t('chatroom.plan_maker') }}</th>
                    <th class="text-center">{{ $t('dic.status') }}</th>
                </tr>
            </thead>
            <tbody v-if="!listLoading">
                <tr :key="chatroom.id" v-for="(chatroom, index) in chatrooms">
                    <td class="text-uppercase"><router-link :to="`/chatroom/${chatroom.id}/edit`">{{ chatroom.title || $t('system.no_setting') }}</router-link></td>
                    <td class="text-uppercase">{{ gamesMapping[chatroom.id] || '-' }}</td>
                    <td v-if="chatroom.managers.length">
                        <p class="m-b-0" v-for="(m, i) in chatroom.managers" :key="i">
                            {{ m }}
                        </p>
                    </td>
                    <td v-else>-</td>
                    <td v-if="chatroom.plan_makers.length">
                        <p class="m-b-0" v-for="(p, i) in chatroom.plan_makers" :key="i">
                            {{ p }}
                        </p>
                    </td>
                    <td v-else>-</td>
                    <td class="text-center text-sm">
                        <span class="label success" v-if="chatroom.status === 1">{{ $t('status.active') }}</span>
                        <span class="label danger" v-if="chatroom.status === 0">{{ $t('status.disabled') }}</span>
                        <a class="m-l-sm" @click="toggleStatus(index, chatroom)" v-if="!toggleLoading[index] && chatroom.status === 1">{{ $t('status.inactive') }}</a>
                        <a class="m-l-sm" @click="toggleStatus(index, chatroom)" v-else-if="!toggleLoading[index]">{{ $t('status.active') }}</a>
                        <span class="m-l-sm text-blue" v-else>
                            &nbsp;&nbsp;<i class="fa fa-spin fa-spinner"></i>&nbsp;&nbsp;
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="row text-center p-a" v-if="listLoading">
            <i class="fa fa-spin fa-spinner"></i>
            <b>{{ $t('system.loading') }}</b>
        </div>
        <div class="row" v-if="!listLoading && !chatrooms.length">
            <div class="text-center m-a">
                <span>{{ $t('system.no_record') }}</span>
            </div>
        </div>
    </div>

    <div class="modal" v-if="modal.showModal">
        <div class="modal-backdrop fade in" @click="modal.showModal = false"></div>
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <strong>{{ $t('dic.update') }} - {{ modal.displayName }}</strong>
                    <button type="button" class="close" aria-hidden="true" @click="modal.showModal = false">×</button>
                </div>
                <div class="modal-body">
                    <form class="m-l m-r" @submit.prevent="updatePreference(modal)">
                        <div v-if="modal.type === 1 && typeof modal.value === 'object'">
                            <label
                                class="form-control-label p-b-0"
                            >{{ $t('misc.parameter_value') }}
                            </label>
                            <div class="row m-t-xs" v-for="(e, index) in modal.value" :key="index">
                                <div class="col-sm-4 col-sm-offset-1 text-right">
                                    <label class="form-control-label p-r-0 text-xs">{{ e.display_name }}</label>
                                </div>
                                <div class="col-sm-5">
                                    <input
                                        class="form-control"
                                        v-model.trim="e.value"
                                        v-if="e.type !== 2"
                                    />
                                    <span
                                        class="label m-r-sm"
                                        :class="e.value ? 'success' : 'danger'"
                                        v-else-if="e.type === 2"
                                    >{{ e.value ? $t('status.active') : $t('status.inactive') }}
                                    </span>
                                    <label class="md-switch m-r m-t-xs" v-if="e.type === 2">
                                        <input type="checkbox" v-model="e.value"/>
                                        <i class="success"></i>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div v-else>
                            <label class="form-control-label p-b-0" >
                                {{ $t('misc.parameter_value') }}
                            </label>
                            <textarea
                                v-model.trim="modal.value"
                                rows="8"
                                spellcheck="false"
                                class="form-control"
                                ref="modalContent"
                                v-if="modal.type === 6"
                            />
                            <input
                                v-model.trim="modal.value"
                                spellcheck="false"
                                class="form-control"
                                ref="modalContent"
                                v-else
                            />
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn blue w-xs" @click="updatePreference(modal)">
                        <span v-if="!modal.loading">{{ $t('dic.confirm') }}</span>
                        <i class="fa fa-spin fa-spinner" v-else></i>
                    </button>
                    <button class="btn w-xs" @click="modal.showModal = false">
                        {{ $t('dic.cancel') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import {
    getSetting,
    getGame,
    updateSystemParameter,
    updateSetting
} from '../../service'
import $ from '../../utils/util'
const defaultChatroomID = 100000

export default {
    data () {
        return {
            preferences: [],
            chatrooms: [],
            modal: {
                showModal: false,
                index: '',
                key: '',
                value: '',
                loading: false
            },
            gamesMapping: {},
            preferenceLoading: true,
            listLoading: true,
            toggleLoading: {}
        }
    },
    created () {
        this.getChatrooms()
        this.getPreferences()
        this.getGamesName()
    },
    methods: {
        getPreferences () {
            getSetting('parameter', {
                params: {
                    settings: 'chatroom'
                }
            }).then(data => {
                this.preferences = data
                this.preferences.forEach(e => {
                    this.typeTransform(e)
                })
                this.preferenceLoading = false
            })
        },
        typeTransform (e) {
            if (e.type === 3) {
                Object.assign(e, {
                    value: e.value === 'True' || e.value === 'true'
                })
            }
            if ($.isJsonString(e.value)) {
                Object.assign(e, {
                    value: JSON.parse(e.value)
                })
                e.value.forEach(element => {
                    element.value = element.type === 2 ? parseInt(element.value) : element.value
                })
            }
        },
        getChatrooms () {
            getSetting('chatroom').then(data => {
                // Find default chatroom and put it to the 1st place.
                let defaultChatroom = data.findIndex(c => c.id === defaultChatroomID)
                if (defaultChatroom >= 0) {
                    this.chatrooms = data.splice(defaultChatroom, 1)
                    this.$set(this.gamesMapping, defaultChatroomID, this.$t('chatroom.default_chatroom'))
                }
                this.chatrooms = [...this.chatrooms, ...data]
                this.listLoading = false
            })
        },
        getGamesName () {
            getGame('list', {
                params: {
                    opt_fields: 'id,display_name'
                }
            }).then(data => {
                data.forEach(game => {
                    this.$set(this.gamesMapping, game.id, game.display_name)
                })
            })
        },
        toggleStatus (index, chatroom) {
            this.$set(this.toggleLoading, index, true)
            updateSetting('chatroom', {
                id: chatroom.id,
                data: {
                    title: chatroom.title,
                    status: chatroom.status ^ 1
                }
            }, {
                action: this.$t('dic.update'),
                object: this.$t('dic.status')
            }).then(data => {
                chatroom.status = data.status
                this.$delete(this.toggleLoading, index)
            }, () => {
                this.$delete(this.toggleLoading, index)
            })
        },

        openModal (index, {
            display_name: displayName,
            key,
            value,
            type
        }) {
            Object.assign(this.modal, {
                showModal: true,
                displayName,
                key,
                value,
                type,
                index,
                loading: false
            })
            if (type === 1 && typeof value === 'object') {
                this.modal.value = this.modal.value.map(e => Object.assign({}, e))
            } else {
                this.$nextTick(() => {
                    this.$refs.modalContent.focus()
                    this.$refs.modalContent.select()
                })
            }
        },
        updatePreference ({
            index,
            key,
            value,
            displayName: display_name,
            type
        }) {
            this.modal.loading = true
            let result = {
                display_name,
                value: ''
            }
            if (type === 1 && typeof value === 'object') {
                result.value = JSON.stringify(Object.assign({}, ...value.map(e => ({
                    [e.key]: e.type === 2
                    ? (e.value ? '1' : '0')
                    : e.value
                }))))
            } else if (type === 3) {
                result.value = value ? 'true' : 'false'
            } else {
                result.value = value
            }
            updateSystemParameter({
                key,
                data: result
            }, {
                action: this.$t('dic.update'),
                object: this.$t('misc.parameter_value')
            }).then(data => {
                this.typeTransform(data)
                Object.assign(this.preferences[index], data)
                this.modal.showModal = false
                this.modal.loading = false
            }, () => {
                this.modal.loading = false
            })
        }
    }
}
</script>
