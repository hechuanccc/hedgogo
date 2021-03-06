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
                    <span v-if="!uploadLoading">{{ $t('dic.create') }}</span>
                    <i class="fa fa-spin fa-spinner" v-else></i>
                </button>
            </div>
            <div class="pull-left form-group" v-if="$root.permissions.includes('add_new_banner')">
                <label class="form-control-label">{{ $t('system.select_platform') }}</label>
                <label class="radio-inline">
                    <input
                        type="radio"
                        value="2"
                        checked 
                        name="platform"
                        v-model="banner.platform"
                    />
                    {{ $t('system.select_all') }}
                </label>
                <label class="radio-inline">
                    <input
                        type="radio"
                        value="1"
                        name="platform"
                        v-model="banner.platform"
                    />
                    <i class="blue"></i>
                    {{ $t('dic.pc') }}
                </label>
                <label class="radio-inline">
                    <input
                        type="radio"
                        value="0"
                        name="platform"
                        v-model="banner.platform"
                    />
                    <i class="blue"></i>
                    {{ $t('dic.mobile') }}
                </label>
            </div>
            <div class="pull-right" v-if="$root.permissions.includes('update_banner_order')">
                <button
                    type="button"
                    class="md-btn w-sm blue m-b"
                    @click="changeMode"
                >
                    <span v-if="!reorderLoading">{{ mode ? $t('system.adjust_rank') : $t('dic.confirm') }}</span>
                    <i class="fa fa-spin fa-spinner" v-else></i>
                </button>
                <button type="button" class="md-btn w-sm m-b m-l-sm" v-show="!mode" @click="cancelAdjustRank">{{ $t('dic.cancel') }}</button>
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
                    <th><span class="m-l">{{ $t('misc.img') }}</span></th>
                    <th class="text-center">{{ $t('dic.platform') }}</th>
                    <th class="text-center">{{ $t('dic.status') }}</th>
                    <th class="text-center" v-if="$root.permissions.includes('delete_banner')">{{ $t('dic.operate') }}</th>
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
                        <span v-if="banner.platform === 0">{{ $t('dic.mobile') }}</span>
                        <span v-if="banner.platform === 1">{{ $t('dic.pc') }}</span>
                        <span v-if="banner.platform === 2">{{ $t('dic.pc') }}&nbsp;/&nbsp;{{ $t('dic.mobile') }}</span>
                    </td>
                    <td class="text-center v-m">
                        <status-switch
                            :status="banner.status"
                            :loading="!!statusSwitchLoading[banner.id]"
                            :disabled="!updateBannerStatusPermission"
                            @toggle="toggleStatus(banner)"
                        />
                    </td>
                    <td class="text-center v-m" v-if="deleteBannerPermission">
                        <a class="md-btn md-flat" @click="deleteBanner(banner.id, $event, index)">
                            {{ $t('dic.delete') }}
                        </a>
                    </td>
                </tr>
            </draggable>
        </table>
        <div class="row text-center p-a" v-show="loading">
            <i class="fa fa-spin fa-spinner"></i>&nbsp;
            <b>{{ $t('system.loading') }}</b>
        </div>
        <div class="row text-center p-b" v-if="!loading && !queryset.length">
            {{ $t('system.no_record') }}
        </div>
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
            reorderLoading: false,
            statusSwitchLoading: {}
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
            getSetting('banner')
            .then(data => {
                this.queryset = data.sort((a, b) => a.rank - b.rank)
            })
            .catch($.errorNotify)
            .finally(() => { this.loading = false })
        },
        deleteBanner (id, event, index) {
            if (!window.confirm(this.$t('system_msg.confirm_action_object', {
                action: event.target.innerText
            }))) {
                return
            }
            deleteSetting('banner', id, {
                action: this.$t('dic.delete'),
                object: 'Banner'
            }).then(() => {
                this.queryset.splice(index, 1)
            })
        },
        onSubmit () {
            let formData = new window.FormData()
            formData.append('image', this.banner.image)
            formData.append('platform', this.banner.platform)
            updateSetting('banner', {
                data: formData
            }, {
                action: this.$t('dic.create'),
                object: 'Banner'
            }).then(data => {
                this.queryset = []
                this.getBanners()
            }).finally(() => {
                this.uploadLoading = false
            })
        },
        getImg (e) {
            // file size must less than 1mb
            if (e.target.files[0].size > 1 * 1000 * 1000) {
                e.target.value = ''
                $.notify({
                    message: this.$t('system_msg.file_size_too_large'),
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
            this.$set(this.statusSwitchLoading, banner.id, true)
            updateSetting('banner', {
                id: banner.id,
                data: {
                    status: banner.status ^ 1
                }
            }, {
                action: this.$t('dic.update'),
                object: this.$t('dic.status')
            }).then(({ status }) => {
                banner.status = status
            }).finally(() => {
                this.$delete(this.statusSwitchLoading, banner.id)
            })
        },
        changeMode () {
            if (!this.mode) {
                this.reorderLoading = true
                updateSetting('bannerRank', {
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
                    this.mode = 1
                }).finally(() => {
                    this.reorderLoading = false
                })
            } else {
                this.mode = 0
            }
        },
        cancelAdjustRank () {
            this.queryset = this.queryset.sort((a, b) => a.rank - b.rank)
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
.add-file-btn{
    position: absolute;
    z-index: 1;
    opacity: 0;
}
</style>
