<template>
    <div>
        <div class="row m-l-xs m-r-xs m-b-xs">
            <div class="pull-left">
                <button
                    class="md-btn w-sm blue"
                    type="button"
                    @click="createAnnouncement"
                    v-if="!showAll"
                    :disabled="!$root.permissions.includes('add_new_announcement')"
                >{{ $t('title.announcement_add') }}
                </button>
                <button
                    class="md-btn w-sm blue"
                    type="button"
                    @click="showAll = false"
                    v-else
                >
                    <span>{{ $t('system.hide') }}</span>
                </button>              
            </div>
            <div class="pull-center m-t-sm">
                <span class="alert alert-success text-success m-r p-a-sm" v-if="successMsg"><i class="fa fa-check"></i> {{ successMsg }}</span>
                <span class="alert alert-danger text-danger m-r p-a-sm" v-if="errorMsg"><i class="fa fa-times"></i> {{ errorMsg }}</span>
            </div>
            <div class="pull-right">
                <button type="button" class="md-btn w-sm blue m-b" @click="changeMode">{{ mode ? $t('system.adjust_rank') : $t('dic.confirm') }}</button>
                <button type="button" class="md-btn w-sm m-b m-l-sm" v-show="!mode" @click="cancelAdjustRank">{{ $t('dic.cancel') }}</button>
            </div>
        </div>
        <div class="box" v-show="showAll">
            <div class="box-body ">
                <form 
                    class="form"
                    @submit.prevent="onSubmit"
                >
                    <div class="row" >
                        <div class="col-xs-10">

                            <div class="clearfix m-t">
                                <label class="col-xs-1 text-right form-control-label">{{$t('dic.announcement')}}</label>
                                <div class="col-xs-6">
                                    <textarea class="form-control" rows="3" required v-model="announcement.announcement"></textarea>
                                </div>
                            </div>

                            <div class="clearfix m-t">
                                <label class="col-xs-1">{{$t('system.select_platform')}}</label>
                                <div class="col-xs-8  m-b form-group">
                                    <label class="md-check md-check-md m-r">
                                        <input type="radio" value="2" checked v-model="announcement.platform">
                                        <i class="blue"></i>
                                        {{$t('system.select_all')}}
                                    </label>
                                    <label class="md-check m-r">
                                        <input type="radio" value="1" v-model="announcement.platform">
                                        <i class="blue"></i>
                                        {{$t('dic.pc')}}
                                    </label>
                                    <label class="md-check m-r">
                                        <input type="radio" value="0" v-model="announcement.platform">
                                        <i class="blue"></i>
                                        {{$t('dic.mobile')}}
                                    </label>
                                </div>
                            </div>
                            <div class="clearfix">
                                <label class="col-xs-1 text-right form-control-label"> </label>
                                <div class="col-xs-3">
                                    <button class="md-btn w-sm blue " type="submit">{{$t('dic.submit')}}</button>
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
                    <th>{{ $t('dic.platform') }}</th>
                    <th>{{ $t('dic.status') }}</th>
                    <th v-if="$root.permissions.includes('delete_announcement') || $root.permissions.includes('update_announcement')">
                        {{ $t('dic.operate') }}
                    </th>
                </tr>
                </thead>
                <draggable v-model="queryset" :element="'tbody'" :options="{disabled:mode}">
                <tr v-for="(announcement, key) in queryset" :key="key">
                    <td v-show="!mode" class="text-center"><i class="fa fa-reorder text-blue"></i></td>
                    <td class="word-break">
                       {{ announcement.announcement }}
                    </td>
                    <td>
                        <span v-if="announcement.platform === 0">{{ $t('dic.mobile') }}</span>
                        <span v-if="announcement.platform === 1">{{ $t('dic.pc') }}</span>
                        <span v-if="announcement.platform === 2">{{ $t('dic.pc') }}/{{ $t('dic.mobile') }}</span>
                    </td>
                    <td>
                        <span class="label success" v-if="announcement.status === 1" >{{ $t('status.active') }}</span>
                        <span class="label danger" v-else>{{ $t('status.inactive') }}</span>
                        <template v-if="updateAnnouncementStatusPermission">
                            <a class="text-sm m-l" @click="toggleStatus(announcement)" v-if="announcement.status === 0">{{ $t('status.active') }}</a>
                            <a class="text-sm m-l" @click="toggleStatus(announcement)" v-else>{{ $t('status.inactive') }}</a>
                        </template>
                    </td>
                    <td v-if="$root.permissions.includes('delete_announcement') || $root.permissions.includes('update_announcement')">
                        <a
                            class="m-r-sm"
                            @click="updateAnnouncement(announcement)"
                            v-if="$root.permissions.includes('update_announcement')"
                        >{{ $t('dic.update') }}
                        </a>
                        <a
                            class="m-r-sm"
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
            errorMsg: '',
            successMsg: ''
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

            deleteSetting('announcement', id).then(() => {
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
            }).then(data => {
                this.showAll = false
                this.id = ''
                let index = this.findIndexOfQueryset(data.id)
                if (index !== -1) {
                    this.queryset.splice(index, 1)
                }
                this.queryset = [data, ...this.queryset]
                this.showSuccessMsg()
            }, error => {
                this.errorMsg = error
            })
        },
        toggleStatus (announcement) {
            updateSetting('announcement', {
                id: announcement.id,
                data: {
                    status: announcement.status ^ 1
                }
            }).then(data => {
                announcement.status = data.status
                if (data.id === this.id) {
                    this.announcement.status = data.status
                }
            }, error => {
                this.errorMsg = error
            })
        },
        changeMode () {
            if (!this.mode) {
                updateSetting('announcementRank', {
                    data: this.queryset.map((element, index) => Object({
                        id: element.id,
                        rank: index + 1
                    }))
                }).then(data => {
                    this.queryset.forEach((element, index) => {
                        element.rank = index + 1
                    })
                    this.mode = true
                    this.showSuccessMsg()
                }, error => {
                    this.errorMsg = `${this.$t('status.failed')} (${error})`
                })
            } else {
                this.mode = false
            }
        },
        cancelAdjustRank () {
            this.getAnnouncements()
            this.mode = !this.mode
        },
        showSuccessMsg () {
            this.successMsg = this.$t('status.success')
            setTimeout(() => {
                this.successMsg = ''
            }, 3000)
        }
    },
    components: {
        draggable
    }
}
</script>

<style scoped>
    .word-break {
       word-break: break-all;
       max-width: 500px;
    }
</style>
