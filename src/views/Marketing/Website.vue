<template>
    <div class="box">
        <div class="box-body">
            <div class="row b-b p-b m-b">
                <div class="col-md-6">
                    <div class="form-group">
                        <label class="m-b-0">{{$t('website.name')}}</label>
                        <input
                            class="form-control w-md"
                            placeholder="Name"
                            v-model="website.name"
                            v-if="updateWebsiteManagementPermission"
                            required
                        />
                        <span v-else>{{ website.name }}</span>
                    </div>
                    <div class="form-group">
                        <label class="m-b-0">{{$t('website.second_name')}}</label>
                        <input
                            class="form-control w-md"
                            placeholder="Name"
                            v-model="website.second_name"
                            v-if="updateWebsiteManagementPermission"
                            required
                        />
                        <span v-else>{{ website.second_name }}</span>
                    </div>
                    <div class="form-group">
                        <label class="text-uppercase m-b-0">{{$t('misc.logo')}}</label>
                        <img :src="website.icon" height="30" v-if="hasIcon">
                        <span class="m-r-xs" v-else>{{ $t('system.no_setting') }}</span>
                        <input
                            type="file"
                            class="form-control w-md"
                            accept="image/*"
                            @change="syncImg($event, 'Icon')"
                            v-if="updateWebsiteManagementPermission"
                        >
                    </div>
                    <div class="p-b m-t" v-if="updateWebsiteManagementPermission">
                        <button
                            class="md-btn w-sm blue"
                            @click="updateWebsiteSetting"
                        >
                            <span v-if="!websiteSettingLoading">{{$t('dic.submit')}}</span>
                            <i class="fa fa-spin fa-spinner" v-else></i>
                        </button>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-inline right-float-img">
                        <label class="form-control-label text-uppercase">{{ $t('website.right_float_img') }}</label>
                        <div class="inline-form-control" v-if="hasRightFloatImg">
                            <img :src="website.right_float_img" height="180">
                            <button
                                type="button"
                                class="btn btn-xs btn-icon img-nav-btn"
                                @click="clearImg('RightFloatImg')"
                                v-if="hasRightFloatImg"
                            >
                                <i class="fa fa-times"></i>
                            </button>
                        </div>
                        <span class="m-r-xs" v-else>{{ $t('system.no_setting') }}</span>
                        <div class="inline-form-control" v-if="updateWebsiteManagementPermission">
                            <input
                                type="file"
                                class="form-control w-md"
                                accept="image/*"
                                @change="syncImg($event, 'RightFloatImg')"
                                ref="rightFloatImg"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <label class="m-l-sm label-width col-xs-1">{{$t('website.advertisement')}} </label>
            </div>
            <div :class="['row text-center m-b-sm', `col-xs-${boxes.length<4?'11':'12'}`]" v-if="!mode && updateWebsiteManagementPermission">
                <button class="md-btn w-sm blue" @click="mode=1">{{ $t('system.adjust_rank') }}</button>
            </div>
            <div :class="['row text-center m-b-sm', `col-xs-${boxes.length<4?'11':'12'}`]" v-else-if="updateWebsiteManagementPermission">
                <button class="md-btn w-xs btn blue" @click="updateRank">{{ $t('dic.confirm') }}</button>                                
                <button class="m-l-xs md-btn btn w-xs" @click="cancelUpdateRank">{{ $t('dic.cancel') }}</button>
            </div>
            <div class="row b-b p-b">
                <div :class="`col-xs-${boxes.length<4?'11':'12'}`">
                    <draggable v-model="boxes" class="row" :options="{disabled:!mode}">
                        <transition-group name="list-complete">
                            <div :class="[`col-xs-${12/boxes.length}`, 'list-complete-item m-a-0']" v-for="(box, index) in boxes" :key="box.id">
                                <div :class="['box', mode?'b-a b-dashed b-3x':'']">
                                    <div class="box-tool" v-if="updateWebsiteManagementPermission">
                                        <ul class="nav">
                                            <li class="nav-item inline" v-if="boxes.length>2">
                                                <button type="button" class="close" aria-hidden="true" @click="deleteBox(box.id, index)"><i class="fa fa-times"></i>
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="box-body text-center">
                                        <div class="m-a-sm" v-if="box.mode">{{ $t('website.header_img') }}</div>
                                        <div v-if="box.header_image">
                                            <img :src="box.header_image" width="250" height="50">
                                        </div>
                                        <div v-else style="height:50px; background:lightgrey; line-height:50px;">{{ $t('system.no_setting') }}</div>
                                        <div class="inline-form-control m-t-xs" v-if="box.mode">
                                            <input
                                                type="file"
                                                class="form-control"
                                                accept="image/*"
                                                @change="syncBoxImg($event, box, index, 'header_image')"
                                                style="width:250px;"
                                                ref="header_image"
                                            >
                                        </div>
                                        <div class="form-group m-b-xs m-t-sm" v-if="box.mode">
                                            <label class="form-control-label">{{ $t('website.main_content') }}</label>
                                            <label class="radio-inline">
                                                <input type="radio" :value="0" v-model="box.status">{{ $t('misc.img') }}
                                            </label>
                                            <label class="radio-inline">
                                                <input type="radio" :value="1" v-model="box.status">{{ $t('misc.text') }}
                                            </label>
                                        </div>
                                        <div class="row m-l-xs m-r-xs" v-if="box.status===0">
                                            <div v-if="box.main_image">
                                                <img :src="box.main_image" height="300">
                                            </div>
                                            <div v-else style="height:300px; background:lightgrey; line-height:300px;">
                                                {{ $t('system.no_setting') }}
                                            </div>
                                            <div class="inline-form-control m-t-xs" v-if="box.mode">
                                                <input
                                                    type="file"
                                                    class="form-control"
                                                    accept="image/*"
                                                    @change="syncBoxImg($event, box, index, 'main_image')"
                                                    style="width:250px;"
                                                    ref="main_image"
                                                >
                                            </div>
                                        </div>
                                        <div class="row m-l-xs m-r-xs" v-else-if="box.status===1">
                                            <textarea class="form-control" rows="15" cols="12" v-model="box.main_description" :disabled="!box.mode" style="resize:none;"></textarea>
                                        </div>
                                        <div class="row m-t-sm" v-if="updateWebsiteManagementPermission">
                                            <button class="md-btn w-sm blue" @click="changeBoxMode(box.id, index)" v-if="box.mode===0">{{ $t('dic.update')}}</button>
                                            <button class="btn btn-sm blue loading" @click="updateBox(box.id, index)" v-if="box.mode===1"><i class='fa fa-spin fa-spinner' v-if="box.loading"></i>{{ $t('dic.confirm')}}</button>
                                            <button class="btn btn-sm" @click="cancelUpdateBox(box.id, index)" v-if="box.mode===1">{{ $t('dic.cancel')}}</button>  
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </transition-group>
                    </draggable>
                </div>
                <div class="col-xs-1" v-if="boxes.length<4 && updateWebsiteManagementPermission">
                    <button class="md-btn md-fab m-b-sm blue" @click="createBox"><i class="material-icons md-24">&#xe145;</i></button>
                </div>
            </div>
            <div class="row m-t">
                <label class="m-l-sm col-xs-2">{{$t('website.agent_joining_agreement')}} </label>
            </div>
            <div class="row m-t-xs">
                <div class="col-md-12">
                    <textarea
                        style="width: 930px;"
                        rows="40"
                        class="m-l form-control"
                        v-model="websiteAgreement"
                        :disabled="!updateWebsiteManagementPermission"
                    >
                    </textarea>
                </div>
            </div>
            <div class="row b-b p-b m-t">
                <div class="col-md-12" v-if="updateWebsiteManagementPermission">
                    <button
                        type="button"
                        class="m-l md-btn w-sm blue m-r-sm"
                        @click="updateWebsiteAgreement"
                        :disabled="!updateWebsiteManagementPermission"
                    >
                        <span v-if="!websiteAgreementLoading">{{$t('dic.submit')}}</span>
                        <i class="fa fa-spin fa-spinner" v-else></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import draggable from 'vuedraggable'
import {
    getSetting,
    updateSetting,
    deleteSetting,
    updateWebsite
} from '../../service'
import $ from '../../utils/util'

export default {
    data () {
        return {
            website: {
                id: '',
                name: '',
                icon: '',
                right_float_img: '',
                description: '',
                second_name: ''
            },
            websiteImg: ['Icon', 'RightFloatImg'],
            websiteSettingLoading: false,
            websiteAgreementLoading: false,
            mode: 0,
            boxes: [],
            initialBoxes: {},
            boxResults: {},
            hasIcon: false,
            hasIconFile: false,
            hasRightFloatImg: false,
            hasRightFloatImgFile: false,
            websiteAgreement: ''
        }
    },
    computed: {
        updateWebsiteManagementPermission () {
            return this.$root.permissions.includes('update_website_management')
        }
    },
    created () {
        this.getWebsite()
        this.getWebsiteDescription()
        this.getWebsiteAgreement()
    },
    methods: {
        getWebsite () {
            getSetting('website').then(data => {
                this.setWebsiteData(data)
            })
        },
        setWebsiteData (data) {
            Object.assign(this.website, data)
            this.websiteImg.forEach(e => {
                let snakeCase = $.camelToSnake(e)
                this[`has${e}`] = !!this.website[snakeCase]
                this[`has${e}File`] = false
            })
        },
        getWebsiteDescription () {
            getSetting('websiteDescription').then(data => {
                this.boxes = data.map(box => Object({
                    ...box,
                    mode: 0,
                    loading: false
                }))
            })
        },
        getWebsiteAgreement () {
            getSetting('websiteAgreement').then(data => {
                this.websiteAgreement = data.description
            })
        },
        createBox () {
            this.boxes = [...this.boxes, {}]
            updateSetting('websiteDescription', {}, {
                action: this.$t('dic.create'),
                object: this.$t('website.advertisement')
            }).then(data => {
                let box = Object({
                    ...data,
                    mode: 1,
                    loading: false
                })
                this.initialBoxes[box.id] = Object({
                    header_image: null,
                    main_image: null,
                    main_description: null,
                    status: box.status
                })
                this.$set(this.boxes, this.boxes.length - 1, box)
            }, () => {
                this.boxes.splice(this.boxes.length - 1, 1)
            })
        },
        deleteBox (id, index) {
            deleteSetting('websiteDescription', id, {
                action: this.$t('dic.delete'),
                object: this.$t('website.advertisement')
            }).then(() => {
                if (this.boxes[index].mode) {
                    delete this.boxResults[id]
                    delete this.initialBoxes[id]
                }
                this.boxes.splice(index, 1)
            })
        },
        changeBoxMode (id, index) {
            const box = this.boxes[index]
            this.boxes[index].mode = 1
            this.initialBoxes[box.id] = Object({
                header_image: box.header_image,
                main_image: box.main_image,
                main_description: box.main_description,
                status: box.status
            })
        },
        updateBox (id, index) {
            let formData = new window.FormData()
            let box = this.boxes[index]
            let boxResult = this.boxResults[id]
            const errorMsg = `${this.$t('system.no_setting')}: ${this.$t('website.main_content')}`
            if (!box.header_image) {
                $.errorNotify(`${this.$t('system.no_setting')}: ${this.$t('website.header_img')}`)
                return
            } else if (boxResult && boxResult.header_image) {
                formData.append('header_image', boxResult.header_image)
            }

            formData.append('status', box.status)
            if (box.status === 0) {
                if (!box.main_image) {
                    $.errorNotify(errorMsg)
                    return
                } else if (boxResult && boxResult.main_image) {
                    formData.append('main_image', boxResult.main_image)
                }
            } else if (box.status === 1) {
                if (!box.main_description) {
                    $.errorNotify(errorMsg)
                    return
                } else {
                    formData.append('main_description', box.main_description)
                }
            }
            box.loading = true
            updateSetting('websiteDescription', {
                id,
                data: formData
            }, {
                action: this.$t('dic.update'),
                object: this.$t('website.advertisement')
            }).then(data => {
                this.$set(this.boxes, index, {
                    ...this.boxes[index],
                    ...data,
                    mode: 0,
                    loading: false
                })
                delete this.boxResults[id]
                delete this.initialBoxes[id]
            })
        },
        cancelUpdateBox (id, index) {
            this.$set(this.boxes, index, {
                ...this.boxes[index],
                ...this.initialBoxes[id],
                mode: 0
            })
            delete this.initialBoxes[id]
        },
        updateRank () {
            updateSetting('websiteDescriptionRank', {
                data: this.boxes.map(({ id }, index) => Object({
                    id,
                    rank: index + 1
                }))
            }, {
                action: this.$t('system.adjust_rank')
            }).then(() => {
                this.boxes.forEach((box, index) => {
                    box.rank = index + 1
                })
                this.mode = 0
            })
        },
        updateWebsiteAgreement () {
            this.websiteAgreementLoading = true

            updateWebsite('websiteAgreement', {
                description: this.websiteAgreement
            }, {
                action: this.$t('dic.update'),
                object: this.$t('website.agent_joining_agreement')
            }).then(data => {
                this.websiteAgreement = data.description
                this.websiteAgreementLoading = false
            }, () => {
                this.websiteAgreementLoading = false
            })
        },
        cancelUpdateRank () {
            this.boxes.sort((a, b) => a.rank - b.rank)
            this.mode = 0
        },
        syncImg (e, attr) {
            let snakeCase = $.camelToSnake(attr)
            var reader = new FileReader()
            reader.onload = (e) => {
                this.website[`${snakeCase}`] = e.target.result
            }
            reader.readAsDataURL(e.target.files[0])
            this.$set(this.website, `${snakeCase}_file`, e.target.files[0])
            this[`has${attr}`] = true
            this[`has${attr}File`] = true
        },
        clearImg (attr) {
            this[`has${attr}`] = false
            this[`has${attr}File`] = false
            this.$refs.rightFloatImg.value = ''
            $.notify({
                message: this.$t('system_msg.click_submit_and_clear'),
                type: 'warning'
            })
        },
        syncBoxImg (e, box, index, attr) {
            if (!this.checkFileSize(e.target.files[0])) {
                e.target.value = ''
                $.errorNotify(this.$t('system_msg.file_size_too_large'))
                return
            }
            var reader = new FileReader()

            reader.onload = (e) => {
                box[attr] = e.target.result
            }
            reader.readAsDataURL(e.target.files[0])
            if (!this.boxResults[box.id]) {
                this.boxResults[box.id] = {}
            }
            this.boxResults[box.id][attr] = e.target.files[0]
        },
        checkFileSize (file) {
            // 500 KB
            return file.size < 500 * 1000
        },
        updateWebsiteSetting () {
            this.websiteSettingLoading = true
            let formData = new window.FormData()
            formData.append('name', this.website.name)
            formData.append('description', this.website.description)
            formData.append('second_name', this.website.second_name)
            this.websiteImg.forEach(e => {
                let snakeCase = $.camelToSnake(e)
                if (this[`has${e}File`]) {
                    formData.append(snakeCase, this.website[`${snakeCase}_file`])
                } else if (!this[`has${e}`]) {
                    formData.append(snakeCase, '')
                }
            })
            updateWebsite('website', formData, {
                action: this.$t('dic.update')
            }).then(data => {
                this.setWebsiteData(data)
                this.websiteSettingLoading = false
            }, () => {
                this.websiteSettingLoading = false
            })
        }
    },
    components: {
        draggable
    }
}
</script>
<style lang="scss" scoped>
.list-complete-item {
  transition: all .1s;
  display: inline-block;
  margin-right: 10px;
}
.list-complete-enter, .list-complete-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.list-complete-leave-active {
  position: absolute;
}
.right-float-img {
  img {
      max-width: 80%;
  }
  .img-nav-btn {
    vertical-align: top;
    text-align: center;
    transition: all .3s ease;
  }
}
</style>
