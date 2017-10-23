<template>
    <form class="form m-a" @submit.prevent='onSubmit' enctype="multipart/form-data">
        <div class="alert alert-danger" v-if="responseError">{{responseError}}</div>
        <div class="m-b" v-if="userPermission">
            <button class="md-btn w-sm blue"  @click="showAll=!showAll">
                <span v-if="!showAll">{{$t('manage.add_announcement')}}</span>
                <span v-else>隐藏</span>
            </button>
        </div>
        <div class="box" v-show="showAll">
            <div class="box-body ">
                <div class="row" >
                    <div class="col-xs-10">
                        <div class="clearfix" v-show="false">
                            <label class="col-xs-1 text-right form-control-label">名称 </label>
                            <div class="col-xs-6">
                                <input type="text" v-model="announcement.name" class="form-control" />
                            </div>
                        </div>

                        <div class="clearfix m-t">
                            <label class="col-xs-1 text-right form-control-label">{{$t('cms.announcement')}}</label>
                            <div class="col-xs-6">
                                <textarea class="form-control" rows="3" placeholder="" required v-model="announcement.announcement"></textarea>
                            </div>
                        </div>

                        <div class="clearfix m-t">
                            <label class="col-xs-1">{{$t('manage.platform_select')}}</label>
                            <div class="col-xs-8  m-b">
                                <label class="md-check md-check-md m-r">
                                    <input type="radio" value="2" checked name="platform" v-model="announcement.platform">
                                    <i class="blue"></i>
                                    {{$t('manage.all')}}
                                </label>
                                <label class="md-check m-r">
                                    <input type="radio" value="1" name="platform" v-model="announcement.platform">
                                    <i class="blue"></i>
                                    {{$t('manage.pc')}}
                                </label>
                                <label class="md-check m-r">
                                    <input type="radio" value="0" name="platform" v-model="announcement.platform">
                                    <i class="blue"></i>
                                    {{$t('manage.mobile')}}
                                </label>
                            </div>
                        </div>

                        <div class="clearfix">
                            <label class="col-xs-1 text-right form-control-label"> </label>
                            <div class="col-xs-3">
                                <button class="md-btn w-sm blue " type="onSubmit">{{$t('common.save')}}</button>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>

        <div class="box">
            <table st-table="rowCollectionBasic" class="table table-striped b-t">
                <thead>
                <tr>
                    <th>{{$t('member.list_no')}}</th>
                    <th>{{$t('cms.announcement')}}</th>
                    <th>{{$t('manage.platform')}}</th>
                    <th>{{$t('member.status')}}</th>
                    <th v-if="$root.permissions.includes('change_banner_announcement')">{{$t('manage.sequence')}}</th>
                    <th v-if="$root.permissions.includes('change_banner_announcement')">{{$t('manage.operate')}}</th>
                </tr>
                </thead>
                <tbody v-if="queryset.length > 0">
                <tr v-for="(announcement, key) in queryset">
                    <td>{{announcement.id}}</td>
                    <td class="word-break">
                       {{announcement.announcement}}
                    </td>
                    <td>
                        <span v-if="announcement.platform === 0">{{$t('manage.mobile')}}</span>
                        <span v-if="announcement.platform === 1">{{$t('manage.pc')}}</span>
                        <span v-if="announcement.platform === 2">{{$t('manage.pc')}}/{{$t('manage.mobile')}}</span>
                    </td>
                    <td>
                        <span class="label success" v-if="announcement.status==1" >{{$t('status.active')}}</span>
                        <span class="label danger" v-if="announcement.status==0">{{$t('status.inactive')}}</span>
                        <template v-if="userPermission">
                            <a class="text-sm m-l" @click="toggleStatus(announcement)" v-if="announcement.status===0" >{{$t('status.active')}}</a>
                            <a class="text-sm m-l" @click="toggleStatus(announcement)" v-else >{{$t('status.inactive')}}</a>
                        </template>
                    </td>
                    <td v-if="userPermission">
                        <a @click="changeUp(announcement)" v-if="key!=0">
                            <i class="fa fa-arrow-up" aria-hidden="true"></i>
                        </a>
                        <a @click="changeDown(announcement)" v-if="!((key+1) === queryset.length)">
                            <i class="fa fa-arrow-down" aria-hidden="true"></i>
                        </a>
                    </td>
                    <td v-if="userPermission">
                        <a class="md-btn md-flat m-r-sm" @click="deleteAnnouncement(announcement.id, $event, key)">{{$t('action.delete')}}</a>
                        <a class="md-btn md-flat m-r-sm" @click="updateAnnouncement(announcement.id, key)">{{$t('action.update')}}</a>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="row m-b-lg">
            <pulling :queryset="queryset" :api="announcementApi" :query="query" ref="pulling" @query-data="queryData" @query-param="queryParam"></pulling>
        </div>
    </form>
</template>

<script>
import api from '../../api'
import pulling from '../../components/pulling'

export default {
    data () {
        return {
            showAll: false,
            announcementApi: api.announcement,
            queryset: [],
            query: {
            },
            announcement: {
                platform: '2',
                name: '',
                announcement: ''
            },
            id: '',
            querysetIndex: '',
            responseError: ''
        }
    },
    computed: {
        userPermission: function () {
            return this.$root.permissions.includes('change_banner_announcement')
        }
    },
    created () {
        this.$nextTick(() => {
            this.$refs.pulling.rebase()
        })
    },
    methods: {
        changeUp (announcement) {
            this.$http.put(this.announcementApi + announcement.id + '/', {'rank': announcement.rank + 1}).then((response) => {
                this.$refs.pulling.rebase()
            })
        },
        changeDown (announcement) {
            this.$http.put(this.announcementApi + announcement.id + '/', {'rank': announcement.rank - 1}).then((response) => {
                this.$refs.pulling.rebase()
            })
        },
        deleteAnnouncement (id, event, index) {
            if (!window.confirm(this.$t('common.confirm', {
                action: event.target.innerText
            }))) {
                return
            }
            this.$http.delete(this.announcementApi + id + '/').then((response) => {
                this.$refs.pulling.rebase()
            })
        },
        updateAnnouncement (id, key) {
            if (id) {
                this.$http.get(this.announcementApi + id + '/').then((response) => {
                    this.announcement = response.data
                    this.id = id
                    this.querysetIndex = key
                })
                this.showAll = true
            }
        },
        onSubmit () {
            if (this.id) {
                this.$http.put(this.announcementApi + this.id + '/', this.announcement).then(response => {
                    if (response.status === 200) {
                        this.queryset[this.querysetIndex].platform = response.data.platform
                        this.queryset[this.querysetIndex].announcement = response.data.announcement
                        this.showAll = false
                    }
                }, response => {
                    this.responseError = response.data.error[0].image
                })
            } else {
                this.$http.post(this.announcementApi, this.announcement).then(response => {
                    if (response.status === 201) {
                        this.announcement.name = ''
                        this.announcement.announcement = ''
                        this.queryset.unshift(response.data)
                    }
                }, response => {
                    this.responseError = response.data.error[0].image
                })
            }
        },
        toggleStatus (announcement) {
            this.$http.put(this.announcementApi + announcement.id + '/', {
                'status': announcement.status === 0 ? 1 : 0
            }).then((response) => {
                announcement.status = response.data.status
            })
        },
        queryData (queryset) {
            this.queryset = queryset
        },
        queryParam (query) {
            this.query = query
        }
    },
    components: {
        pulling
    }
}
</script>

<style scoped>
    .word-break {
       word-break: break-all;
       max-width: 500px;
    }
</style>
