<template>
    <form class="form m-a" v-on:submit.prevent="onSubmit" enctype="multipart/form-data">
        <div class="row m-b" v-if="userPermission">
            <div class="col-xs-2">
                <input type="file" class="md-btn w-sm blue add-file-btn" accept="image/*" @change="getImg">
                <button class="md-btn w-sm blue" >{{$t('action.create')}}</button>
            </div>
            <div class="col-xs-4">
                <label class="text-sm">{{$t('manage.platform_select')}}</label>
                <label class="md-check md-check-md m-r">
                    <input type="radio" value="2" checked name="platform" v-model="banner.platform">
                    <i class="blue"></i>
                    {{$t('manage.all')}}
                </label>
                <label class="md-check m-r">
                    <input type="radio" value="1" name="platform" v-model="banner.platform">
                    <i class="blue"></i>
                    {{$t('manage.pc')}}
                </label>
                <label class="md-check m-r">
                    <input type="radio" value="0" name="platform" v-model="banner.platform">
                    <i class="blue"></i>
                    {{$t('manage.mobile')}}
                </label>
            </div>
            <div class="m-b text-danger">图片尺寸：电脑端推荐宽高比例为 4 : 1，推荐宽高为 1920 * 454，手机端推荐宽高比例为 3 : 1 ，推荐宽高为 320 * 160</div>
            <div class="loading text-success" v-if="loading"><i class='fa fa-spinner '></i>   <b class="">正在创建中...</b>   </div>
        </div>
        <div class="alert alert-danger" v-if="responseError">{{responseError}}</div>
        <div class="box">
            <table st-table="rowCollectionBasic" class="table table-striped b-t">
                <thead>
                <tr>
                    <th>{{$t('member.list_no')}}</th>
                    <th>{{$t('manage.img')}}</th>
                    <th>{{$t('manage.platform')}}</th>
                    <th>{{$t('member.status')}}</th>
                    <th v-if="userPermission">{{$t('manage.sequence')}}</th>
                    <th v-if="userPermission">{{$t('manage.operate')}}</th>
                </tr>
                </thead>
                <tbody v-if="queryset.length > 0">
                <tr v-for="(banner, key) in queryset">
                    <td>{{banner.id}}</td>
                    <td>
                        <img :src="banner.image" v-if="banner.image !== null" height="100">
                    </td>
                    <td>
                        <span v-if="banner.platform === 0">{{$t('manage.mobile')}}</span>
                        <span v-if="banner.platform === 1">{{$t('manage.pc')}}</span>
                        <span v-if="banner.platform === 2">{{$t('manage.pc')}}/{{$t('manage.mobile')}}</span>
                    </td>
                    <td>
                        <span class="label success" v-if="banner.status==1" >{{$t('status.active')}}</span>
                        <span class="label danger" v-if="banner.status==0">{{$t('status.inactive')}}</span>
                        <template v-if="userPermission">
                            <a class="text-sm m-l" @click="toggleStatus(banner)" v-if="banner.status===0" >{{$t('status.active')}}</a>
                            <a class="text-sm m-l" @click="toggleStatus(banner)" v-else >{{$t('status.inactive')}}</a>
                         </template>
                    </td>
                    <td v-if="userPermission">
                        <a @click="changeUp(banner)" v-if="key!=0">
                            <i class="fa fa-arrow-up" aria-hidden="true"></i>
                        </a>
                        <a @click="changeDown(banner)" v-if="!((key+1) === queryset.length)">
                            <i class="fa fa-arrow-down" aria-hidden="true"></i>
                        </a>
                    </td>
                    <td v-if="userPermission">
                        <a class="md-btn md-flat m-r-sm" @click="deleteBanner(banner.id, $event, key)">{{$t('action.delete')}}</a>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="row m-b-lg">
            <pulling :queryset="queryset" :api="bannerApi" :query="query" ref="pulling" @query-data="queryData" @query-param="queryParam"></pulling>
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
            bannerApi: api.banner,
            queryset: [],
            key: '',
            query: {
            },
            banner: {
                platform: 2,
                image: []
            },
            loading: false,
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
        changeUp (banner) {
            this.$http.put(this.bannerApi + banner.id + '/', {'rank': banner.rank + 1}).then((response) => {
                this.$refs.pulling.rebase()
            })
        },
        changeDown (banner) {
            this.$http.put(this.bannerApi + banner.id + '/', {'rank': banner.rank - 1}).then((response) => {
                this.$refs.pulling.rebase()
            })
        },
        deleteBanner (id, event, index) {
            if (!window.confirm(this.$t('common.confirm', {
                action: event.target.innerText
            }))) {
                return
            }
            this.$http.delete(this.bannerApi + id + '/').then((response) => {
                this.$refs.pulling.rebase()
            })
        },
        onSubmit () {
            let formData = new window.FormData()
            formData.append('image', this.banner.image)
            formData.append('platform', this.banner.platform)
            this.$http.post(this.bannerApi, formData).then(response => {
                if (response.status === 201) {
                    this.queryset.unshift(response.data)
                    this.loading = false
                }
            }, response => {
                this.responseError = response.data.error[0].image
            })
        },
        getImg (e) {
            this.banner.image = e.target.files[0]
            if (this.banner.image) {
                this.loading = true
                this.onSubmit()
            }
        },
        toggleStatus (banner) {
            this.$http.put(this.bannerApi + banner.id + '/', {
                'status': banner.status === 0 ? 1 : 0
            }).then((response) => {
                banner.status = response.data.status
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
.add-file-btn{
    position: absolute;
    z-index: 1;
    opacity: 0;
}
</style>
