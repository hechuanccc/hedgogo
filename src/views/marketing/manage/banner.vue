<template>
    <div>
        <form class="form m-l m-r" v-on:submit.prevent="onSubmit" enctype="multipart/form-data">
            <div class="row">
                <div class="pull-left" v-if="$root.permissions.includes('add_new_banner')">
                    <input type="file" class="md-btn w-sm blue add-file-btn" accept="image/*" @change="getImg">
                    <button class="md-btn w-sm blue" >{{$t('action.create')}}</button>
                </div>
                <div class="pull-left form-group" v-if="$root.permissions.includes('add_new_banner')">
                    <label class="form-control-label">{{$t('manage.platform_select')}}</label>
                    <label class="radio-inline">
                        <input type="radio" value="2" checked name="platform" v-model="banner.platform">
                        {{$t('manage.all')}}
                    </label>
                    <label class="radio-inline">
                        <input type="radio" value="1" name="platform" v-model="banner.platform">
                        <i class="blue"></i>
                        {{$t('manage.pc')}}
                    </label>
                    <label class="radio-inline">
                        <input type="radio" value="0" name="platform" v-model="banner.platform">
                        <i class="blue"></i>
                        {{$t('manage.mobile')}}
                    </label>
                </div>
                <div class="pull-center m-t-sm">
                    <span class="alert alert-success text-success m-r p-a-sm" v-if="successMsg"><i class="fa fa-check"></i> {{ successMsg }}</span>
                    <span class="alert alert-danger text-danger m-r p-a-sm" v-if="errorMsg"><i class="fa fa-times"></i> {{ errorMsg }}</span>
                </div>
                <div class="pull-right" v-if="$root.permissions.includes('update_banner_order')">
                    <button type="button" class="md-btn w-sm blue m-b" @click="changeMode">{{ mode ? $t('game_manage.adjust_rank') : $t('action.confirm') }}</button>
                    <button type="button" class="md-btn w-sm m-b m-l-sm" v-show="!mode" @click="cancelAdjustRank">{{ $t('action.cancel') }}</button>
                </div>
            </div>
        </form>
        <div class="row">
            <div class="col-xs-12">
                <div class="pull-right">
                    <div class="text-danger">图片尺寸：电脑端推荐宽高比例为 4 : 1，推荐宽高为 1920 * 454，手机端推荐宽高比例为 3 : 1 ，推荐宽高为 320 * 160</div>                
                </div>
            </div>
        </div>
        <div class="box">
            <table st-table="rowCollectionBasic" class="table table-striped b-t">
                <thead>
                <tr>
                    <th v-show="!mode"></th>
                    <th><span class="m-l">{{$t('manage.img')}}</span></th>
                    <th>{{$t('manage.platform')}}</th>
                    <th>{{$t('member.status')}}</th>
                    <th v-if="$root.permissions.includes('delete_banner')">{{$t('manage.operate')}}</th>
                </tr>
                </thead>
                <draggable v-model="queryset" :element="'tbody'" :options="{disabled:mode}">
                <tr v-for="(banner, key) in queryset" :key="key">
                    <td v-show="!mode" class="v-m text-center"><i class="fa fa-reorder text-blue"></i></td>
                    <td>
                        <img class="m-l" :src="banner.image" v-if="banner.image !== null" height="100">
                    </td>
                    <td class="v-m">
                        <span v-if="banner.platform === 0">{{$t('manage.mobile')}}</span>
                        <span v-if="banner.platform === 1">{{$t('manage.pc')}}</span>
                        <span v-if="banner.platform === 2">{{$t('manage.pc')}}/{{$t('manage.mobile')}}</span>
                    </td>
                    <td class="v-m">
                        <span class="label success" v-if="banner.status==1" >{{$t('status.active')}}</span>
                        <span class="label danger" v-if="banner.status==0">{{$t('status.inactive')}}</span>
                        <template v-if="updateBannerStatusPermission">
                            <a class="text-sm m-l" @click="toggleStatus(banner)" v-if="banner.status===0" >{{$t('status.active')}}</a>
                            <a class="text-sm m-l" @click="toggleStatus(banner)" v-else >{{$t('status.inactive')}}</a>
                            </template>
                    </td>
                    <td class="v-m" v-if="deleteBannerPermission">
                        <a class="md-btn md-flat m-r-sm" @click="deleteBanner(banner.id, $event, key)">{{$t('action.delete')}}</a>
                    </td>
                </tr>
                </draggable>
            </table>
        </div>
    </div>
</template>

<script>
import api from '../../../api'
import draggable from 'vuedraggable'

export default {
    data () {
        return {
            mode: true,
            showAll: false,
            api: api.banner,
            queryset: [],
            key: '',
            banner: {
                platform: 2,
                image: []
            },
            loading: false,
            errorMsg: '',
            successMsg: ''
        }
    },
    computed: {
        updateBannerStatusPermission () {
            return this.$root.permissions.includes('update_banner_status')
        },
        deleteBannerPermission () {
            return this.$root.permissions.includes('delete_banner')
        }
    },
    created () {
        this.getBanners()
    },
    methods: {
        getBanners () {
            this.$http.get(this.api).then(data => {
                this.queryset = data.sort((a, b) => a.rank - b.rank)
            })
        },
        deleteBanner (id, event, index) {
            if (!window.confirm(this.$t('common.confirm', {
                action: event.target.innerText
            }))) {
                return
            }
            this.$http.delete(this.api + id + '/').then(() => {
                this.getBanners()
            })
        },
        onSubmit () {
            let formData = new window.FormData()
            formData.append('image', this.banner.image)
            formData.append('platform', this.banner.platform)
            this.$http.post(this.api, formData).then(data => {
                this.getBanners()
                this.loading = false
                this.successMsg = this.$t('action.create') + this.$t('status.success')
                setTimeout(() => {
                    this.successMsg = ''
                }, 3000)
            }, error => {
                this.errorMsg = error
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
            this.$http.put(this.api + banner.id + '/', {
                'status': banner.status === 0 ? 1 : 0
            }).then(data => {
                banner.status = data.status
            })
        },
        changeMode () {
            if (!this.mode) {
                this.$http.post(`${this.api}rank/`, this.queryset.map((element, index) => Object({
                    id: element.id,
                    rank: index + 1
                }))).then(data => {
                    this.queryset.forEach((element, index) => {
                        element.rank = index + 1
                    })
                    this.successMsg = this.$t('status.success')
                    setTimeout(() => {
                        this.successMsg = ''
                    }, 3000)
                    this.mode = true
                }, error => {
                    this.errorMsg = `${this.$t('status.failed')} (${error})`
                })
            } else {
                this.mode = false
            }
        },
        cancelAdjustRank () {
            this.getBanners()
            this.mode = !this.mode
        }
    },
    components: {
        draggable
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
