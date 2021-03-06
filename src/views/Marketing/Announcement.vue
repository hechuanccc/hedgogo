<template>
    <div>
        <div class="row m-l-xs m-r-xs m-b-sm">
            <div class="pull-left">
                <button
                    class="md-btn w-sm blue"
                    type="button"
                    @click="createAnnouncement"
                    v-if="!showAll"
                    :disabled="!$root.permissions.includes('add_new_announcement')"
                >{{ $t('dic.create') }}
                </button>
                <button
                    class="md-btn w-sm blue"
                    type="button"
                    @click="showAll = false"
                    v-else
                >{{ $t('system.hide') }}
                </button>              
            </div>
            <div class="pull-right">
                <button
                    type="button"
                    class="md-btn w-sm blue"
                    @click="changeMode"
                >{{ mode ? $t('system.adjust_rank') : $t('dic.confirm') }}
                </button>
                <button
                    type="button"
                    class="md-btn w-sm m-l-sm"
                    v-show="!mode"
                    @click="cancelAdjustRank"
                >{{ $t('dic.cancel') }}
                </button>
            </div>
        </div>
        <div class="box" v-show="showAll">
            <div class="box-body">
                <form 
                    class="form"
                    @submit.prevent="onSubmit"
                >
                    <div class="row" >
                        <div class="col-xs-10">
                            <div class="clearfix m-t">
                                <label class="col-xs-1 text-right form-control-label">{{ $t('dic.announcement') }}</label>
                                <div class="col-xs-6">
                                    <textarea
                                        class="form-control"
                                        rows="3"
                                        required
                                        v-model="announcement.announcement"
                                    />
                                </div>
                            </div>

                            <div class="clearfix m-t">
                                <label class="col-xs-1">{{ $t('system.select_platform') }}</label>
                                <div class="col-xs-8  m-b form-group">
                                    <label class="md-check m-r">
                                        <input type="radio" value="2" checked v-model="announcement.platform">
                                        <i class="blue"></i>
                                        {{ $t('system.select_all') }}
                                    </label>
                                    <label class="md-check m-r">
                                        <input type="radio" value="1" v-model="announcement.platform">
                                        <i class="blue"></i>
                                        {{ $t('dic.pc') }}
                                    </label>
                                    <label class="md-check m-r">
                                        <input type="radio" value="0" v-model="announcement.platform">
                                        <i class="blue"></i>
                                        {{ $t('dic.mobile') }}
                                    </label>
                                </div>
                            </div>
                            <div class="clearfix">
                                <label class="col-xs-1 text-right form-control-label"> </label>
                                <div class="col-xs-3">
                                    <button class="md-btn w-sm blue" type="submit">{{ $t('dic.submit') }}</button>
                                </div>
                            </div>

                        </div>
                    </div>
                </form>
            </div>
        </div>

        <div class="box">
            <table st-table="rowCollectionBasic" class="table table-striped b-t">
                <thead>
                    <tr>
                        <th v-show="!mode"></th>
                        <th>{{ $t('dic.announcement') }}</th>
                        <th class="text-center">{{ $t('dic.platform') }}</th>
                        <th class="text-center">{{ $t('dic.status') }}</th>
                        <th
                            class="text-center"
                            v-if="$root.permissions.includes('delete_announcement') || $root.permissions.includes('update_announcement')"
                        >{{ $t('dic.operate') }}
                        </th>
                    </tr>
                </thead>
                <draggable
                    v-model="queryset"
                    :element="'tbody'"
                    :options="{ disabled: mode }"
                >
                    <tr
                        class="text-center"
                        :class="{'pointer': !mode}"
                        v-for="(announcement, key) in queryset"
                        :key="key"
                    >
                        <td v-show="!mode"><i class="fa fa-reorder text-blue"></i></td>
                        <td class="text-left word-break">
                            {{ announcement.announcement }}
                        </td>
                        <td>
                            <span v-if="announcement.platform === 0">{{ $t('dic.mobile') }}</span>
                            <span v-if="announcement.platform === 1">{{ $t('dic.pc') }}</span>
                            <span v-if="announcement.platform === 2">{{ $t('dic.pc') }}&nbsp;/&nbsp;{{ $t('dic.mobile') }}</span>
                        </td>
                        <td>
                            <status-switch
                                :status="announcement.status"
                                @toggle="toggleStatus(announcement)"
                                :loading="!!statusSwitchLoading[announcement.id]"
                                :disabled="!updateAnnouncementStatusPermission"
                            />
                        </td>
                        <td v-if="$root.permissions.includes('delete_announcement') || $root.permissions.includes('update_announcement')">
                            <a
                                @click="updateAnnouncement(announcement)"
                                v-if="$root.permissions.includes('update_announcement')"
                            >{{ $t('dic.update') }}
                            </a>
                            <a
                                class="m-l-sm"
                                @click="deleteAnnouncement(announcement.id, $event)"
                                v-if="$root.permissions.includes('delete_announcement')"
                            >{{ $t('dic.delete') }}
                            </a>
                        </td>
                    </tr>
                </draggable>
            </table>
        </div>
    </div>
</template>

<script>
import draggable from 'vuedraggable'
import StatusSwitch from '../../components/StatusSwitch.vue'
import {
    getSetting,
    updateSetting,
    deleteSetting
} from '../../service'

export default {
    data () {
        return {
            mode: true,
            showAll: false,
            queryset: [],
            announcement: {
                platform: '2',
                announcement: '',
                status: '1'
            },
            id: '',
            statusSwitchLoading: {}
        }
    },
    created () {
        this.getAnnouncements()
    },
    computed: {
        updateAnnouncementStatusPermission () {
            return this.$root.permissions.includes('update_announcement_status')
        }
    },
    methods: {
        findIndexOfQueryset (id) {
            return this.queryset.findIndex(element => element.id === id)
        },
        getAnnouncements () {
            getSetting('announcement').then(data => {
                this.queryset = data.sort((a, b) => a.rank - b.rank)
            })
        },
        deleteAnnouncement (id, event) {
            if (!window.confirm(this.$t('system_msg.confirm_action_object', {
                action: event.target.innerText
            }))) {
                return
            }

            deleteSetting('announcement', id, {
                action: this.$t('dic.delete'),
                object: this.$t('dic.announcement')
            }).then(() => {
                let index = this.findIndexOfQueryset(id)
                this.queryset.splice(index, 1)
                if (this.id === id) {
                    this.showAll = false
                    this.id = ''
                    this.announcement.announcement = ''
                }
            })
        },
        createAnnouncement () {
            this.id = ''
            this.announcement = {
                announcement: '',
                status: 1,
                platform: 2
            }
            this.showAll = true
        },
        updateAnnouncement (announcement) {
            this.id = announcement.id
            this.announcement = {
                platform: announcement.platform,
                announcement: announcement.announcement,
                status: announcement.status
            }
            this.showAll = true
        },
        onSubmit () {
            updateSetting('announcement', {
                id: this.id,
                data: this.announcement
            }, {
                action: this.id ? this.$t('dic.update') : this.$t('dic.create'),
                object: this.$t('dic.announcement')
            }).then(data => {
                this.showAll = false
                this.id = ''
                let index = this.findIndexOfQueryset(data.id)
                if (index !== -1) {
                    this.queryset.splice(index, 1)
                }
                this.queryset = [data, ...this.queryset]
            })
        },
        toggleStatus (announcement) {
            this.$set(this.statusSwitchLoading, announcement.id, true)
            updateSetting('announcement', {
                id: announcement.id,
                data: {
                    status: announcement.status ^ 1
                }
            }, {
                action: this.$t('dic.update'),
                object: this.$t('dic.status')
            }).then(({ status }) => {
                announcement.status = status
            }).finally(() => {
                this.$delete(this.statusSwitchLoading, announcement.id)
            })
        },
        changeMode () {
            if (!this.mode) {
                updateSetting('announcementRank', {
                    data: this.queryset.map(({ id }, index) => Object({
                        id,
                        rank: index + 1
                    }))
                }, {
                    action: this.$t('system.adjust_rank')
                }).then(data => {
                    this.queryset.forEach((element, index) => {
                        element.rank = index + 1
                    })
                    this.mode = true
                })
            } else {
                this.mode = false
            }
        },
        cancelAdjustRank () {
            this.getAnnouncements()
            this.mode = !this.mode
        }
    },
    components: {
        draggable,
        StatusSwitch
    }
}
</script>

<style scoped>
    .word-break {
       word-break: break-all;
       max-width: 500px;
    }
</style>
