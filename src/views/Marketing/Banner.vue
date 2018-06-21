<template>
<div>
    <form class="form m-l m-r" @submit.prevent="onSubmit" enctype="multipart/form-data">
        <div class="row">
            <div class="pull-left" v-if="$root.permissions.includes('add_new_banner')">
                <input
                    type="file"
                    class="md-btn w-sm blue add-file-btn"
                    accept="image/*"
                    @change="getImg"
                />
                <button class="md-btn w-sm blue">
                    <span v-if="!uploadLoading">{{ $t('action.create') }}</span>
                    <i class="fa fa-spin fa-spinner" v-else></i>
                </button>
            </div>
            <div class="pull-left form-group" v-if="$root.permissions.includes('add_new_banner')">
                <label class="form-control-label">{{ $t('manage.platform_select') }}</label>
                <label class="radio-inline">
                    <input
                        type="radio"
                        value="2"
                        checked 
                        name="platform"
                        v-model="banner.platform"
                    />
                    {{ $t('manage.all') }}
                </label>
                <label class="radio-inline">
                    <input
                        type="radio"
                        value="1"
                        name="platform"
                        v-model="banner.platform"
                    />
                    <i class="blue"></i>
                    {{ $t('manage.pc') }}
                </label>
                <label class="radio-inline">
                    <input
                        type="radio"
                        value="0"
                        name="platform"
                        v-model="banner.platform"
                    />
                    <i class="blue"></i>
                    {{ $t('manage.mobile') }}
                </label>
            </div>
            <div class="pull-right" v-if="$root.permissions.includes('update_banner_order')">
                <button
                    type="button"
                    class="md-btn w-sm blue m-b"
                    @click="changeMode"
                >
                    <span v-if="!reorderLoading">{{ mode ? $t('game_manage.adjust_rank') : $t('action.confirm') }}</span>
                    <i class="fa fa-spin fa-spinner" v-else></i>
                </button>
                <button type="button" class="md-btn w-sm m-b m-l-sm" v-show="!mode" @click="cancelAdjustRank">{{ $t('action.cancel') }}</button>
            </div>
        </div>
    </form>
    <div class="row">
        <div class="col-xs-12">
            <div class="pull-right">
                <p class="text-danger m-b-0 text-sm">图片尺寸：电脑端推荐宽高比例为 4 : 1，推荐宽高为 1920 * 454，手机端推荐宽高比例为 3 : 1 ，推荐宽高为 320 * 160 ( 图片不得超过 1 MB )</p>                
            </div>
        </div>
    </div>
    <div class="box">
        <table st-table="rowCollectionBasic" class="table table-striped b-t" v-if="!loading">
            <thead>
                <tr>
                    <th v-show="!mode"></th>
                    <th><span class="m-l">{{ $t('manage.img') }}</span></th>
                    <th class="text-center">{{ $t('manage.platform') }}</th>
                    <th class="text-center">{{ $t('member.status') }}</th>
                    <th class="text-center" v-if="$root.permissions.includes('delete_banner')">{{ $t('manage.operate') }}</th>
                </tr>
            </thead>
            <draggable v-model="queryset" :element="'tbody'" :options="{disabled: mode}" v-if="queryset.length">
                <tr v-for="(banner, index) in queryset" :key="index">
                    <td v-show="!mode" class="v-m text-center"><i class="fa fa-reorder text-blue"></i></td>
                    <td>
                        <img
                            class="m-l"
                            :src="banner.image"
                            height="100"
                            alt="."
                            v-if="banner.image"
                        >
                    </td>
                    <td class="text-center v-m">
                        <span v-if="banner.platform === 0">{{ $t('manage.mobile') }}</span>
                        <span v-if="banner.platform === 1">{{ $t('manage.pc') }}</span>
                        <span v-if="banner.platform === 2">{{ $t('manage.pc') }}&nbsp;/&nbsp;{{ $t('manage.mobile') }}</span>
                    </td>
                    <td class="text-center v-m">
                        <span class="label success" v-if="banner.status==1" >{{ $t('status.active') }}</span>
                        <span class="label danger" v-if="banner.status==0">{{ $t('status.inactive') }}</span>
                        <template v-if="updateBannerStatusPermission">
                            <a class="text-sm m-l-sm" @click="toggleStatus(banner)">
                                {{ banner.status === 0 ? $t('status.active') : $t('status.inactive') }}
                            </a>
                        </template>
                    </td>
                    <td class="text-center v-m" v-if="deleteBannerPermission">
                        <a class="md-btn md-flat" @click="deleteBanner(banner.id, $event, index)">
                            {{ $t('action.delete') }}
                        </a>
                    </td>
                </tr>
            </draggable>
        </table>
        <div class="row text-center p-a" v-show="loading">
            <i class="fa fa-spin fa-spinner"></i>&nbsp;
            <b>{{ $t('common.loading') }}...</b>
        </div>
        <div class="row text-center p-b" v-if="!loading && !queryset.length">
            {{ $t('common.no_record') }}
        </div>
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
import $ from '../../utils/util'

export default {
    data () {
        return {
            mode: true,
            queryset: [],
            banner: {
                platform: 2,
                image: []
            },
            loading: true,
            uploadLoading: false,
            reorderLoading: false
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
            this.loading = true
            getSetting('banner').then(data => {
                this.queryset = data.sort((a, b) => a.rank - b.rank)
                this.loading = false
            }, error => {
                this.errorNotify({error})
                this.loading = false
            })
        },
        deleteBanner (id, event, index) {
            if (!window.confirm(this.$t('common.confirm', {
                action: event.target.innerText
            }))) {
                return
            }
            deleteSetting('banner', id).then(() => {
                $.notify({
                    message: this.$t('action.delete') + this.$t('status.success')
                })
                this.queryset.splice(index, 1)
            }, error => {
                this.errorNotify({error})
            })
        },
        onSubmit () {
            let formData = new window.FormData()
            formData.append('image', this.banner.image)
            formData.append('platform', this.banner.platform)
            updateSetting('banner', {
                data: formData
            }).then(data => {
                this.queryset = []
                this.loading = true
                this.getBanners()
                $.notify({
                    message: this.$t('action.create') + this.$t('status.success')
                })
                this.uploadLoading = false
            }, error => {
                this.errorNotify({error})
                this.uploadLoading = false
            })
        },
        getImg (e) {
            // file size must less than 1mb
            if (e.target.files[0].size > 1 * 1000 * 1000) {
                e.target.value = ''
                $.notify({
                    message: this.$t('common.file_size_too_large'),
                    type: 'warning'
                })
                return
            }
            this.banner.image = e.target.files[0]
            if (this.banner.image) {
                this.uploadLoading = true
                this.onSubmit()
            }
        },
        toggleStatus (banner) {
            updateSetting('banner', {
                id: banner.id,
                data: {
                    status: banner.status ^ 1
                }
            }).then(data => {
                banner.status = data.status
                $.notify({
                    message: this.$t('action.update') + this.$t('status.success')
                })
            }, error => {
                this.errorNotify({error})
            })
        },
        changeMode () {
            if (!this.mode) {
                this.reorderLoading = true
                updateSetting('bannerRank', {
                    data: this.queryset.map((element, index) => Object({
                        id: element.id,
                        rank: index + 1
                    }))
                }).then(data => {
                    this.queryset.forEach((element, index) => {
                        element.rank = index + 1
                    })
                    $.notify({
                        message: this.$t('game_manage.adjust_rank') + this.$t('status.success')
                    })
                    this.mode = 1
                    this.reorderLoading = false
                }, error => {
                    this.errorNotify({error})
                    this.reorderLoading = false
                })
            } else {
                this.mode = 0
            }
        },
        cancelAdjustRank () {
            this.queryset = this.queryset.sort((a, b) => a.rank - b.rank)
            this.mode = !this.mode
        },
        errorNotify ({error: message}) {
            $.notify({
                message,
                type: 'danger'
            })
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
