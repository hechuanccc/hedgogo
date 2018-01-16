<template>
    <div class="box">
        <div class="box-body">
                <div class="row b-b p-b m-b">
                    <div class="col-md-12">
                        <div>
                            <div class="form-group">
                                <label class="label-width col-xs-1">{{$t('manage.name')}} </label>
                                <div class="inline-form-control">
                                    <input
                                        class="form-control"
                                        placeholder="Name"
                                        v-model="website.name"
                                        v-if="updateWebsiteManagementPermission"
                                        required
                                    />
                                    <span v-else>{{ website.name }}</span>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="label-width col-xs-1">{{$t('manage.second_name')}} </label>
                                <div class="inline-form-control">
                                    <input
                                        class="form-control"
                                        placeholder="Name"
                                        v-model="website.second_name"
                                        v-if="updateWebsiteManagementPermission"
                                        required
                                    />
                                    <span v-else>{{ website.second_name }}</span>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="label-width col-xs-1">{{$t('manage.logo')}}</label>
                                <div class="inline-form-control" v-if="!hasImage">
                                    <img :src="website.icon" width="60">
                                </div>
                                <span v-else>{{ $t('action.no_setting') }}</span>
                                <div class="inline-form-control" v-if="updateWebsiteManagementPermission">
                                    <input type="file" class="form-control" accept="image/*" @change="syncImg">
                                </div>
                            </div>
                            <div class="p-b m-t" v-if="updateWebsiteManagementPermission">
                                <div class="alert alert-danger" v-if="responseError">{{responseError}}</div>
                                <div class="alert alert-success" v-if="statusUpdated">{{$t('agent.status_update')}}</div>
                                <button type="" class="md-btn w-sm blue" @click="onSubmit">{{$t('common.save')}}</button>
                            </div>
                            <div class="row b-t p-t m-t">
                                <label class="m-l-sm label-width col-xs-1">{{$t('manage.advertisement')}} </label>
                            </div>
                            <div :class="['row text-center m-b-sm', ` col-xs-${boxes.length<4?'11':'12'}`]" v-if="!mode && updateWebsiteManagementPermission">
                                <button class="md-btn w-sm blue" @click="mode=1"><i class="fa fa-arrows-h"></i> {{ $t('manage.adjust_rank') }}</button>
                                <span class="text-success text-sm m-l" v-if="successMsg"><i class="fa fa-check"></i> {{ successMsg }}</span>                                                                                      
                            </div>
                            <div :class="['row text-center m-b-sm', ` col-xs-${boxes.length<4?'11':'12'}`]" v-else-if="updateWebsiteManagementPermission">
                                <button class="btn btn-sm blue" @click="updateRank"><i class="fa fa-check"></i> {{ $t('action.confirm') }}</button>                                
                                <button class="m-l-xs btn btn-sm" @click="cancelUpdateRank"><i class="fa fa-repeat"></i> {{ $t('action.cancel') }}</button>
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
                                                        <div class="m-a-sm" v-if="box.mode">{{ $t('manage.header_img') }}</div>
                                                        <div v-if="box.header_image">
                                                            <img :src="box.header_image" width="250" height="50">
                                                        </div>
                                                        <div v-else style="height:50px; background:lightgrey; line-height:50px;">{{ $t('action.no_setting') }}</div>
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
                                                            <label class="form-control-label">{{ $t('manage.main') }}</label>
                                                            <label class="radio-inline">
                                                                <input type="radio" :value="0" v-model="box.status">{{ $t('manage.img') }}
                                                            </label>
                                                            <label class="radio-inline">
                                                                <input type="radio" :value="1" v-model="box.status">{{ $t('manage.text') }}
                                                            </label>
                                                        </div>
                                                        <div class="row m-l-xs m-r-xs" v-if="box.status===0">
                                                            <div v-if="box.main_image">
                                                                <img :src="box.main_image" height="300">
                                                            </div>
                                                            <div v-else style="height:300px; background:lightgrey; line-height:300px;">
                                                                {{ $t('action.no_setting') }}
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
                                                        <div class="m-a alert alert-danger" v-if="box.errorMsg">{{ box.errorMsg }}</div>
                                                        <div class="row m-t-sm" v-if="updateWebsiteManagementPermission">
                                                            <button class="md-btn w-sm blue" @click="changeBoxMode(box.id, index)" v-if="box.mode===0"><i class="fa fa-wrench"></i> {{ $t('action.update')}}</button>
                                                            <button class="btn btn-sm blue loading" @click="updateBox(box.id, index)" v-if="box.mode===1"><i class='fa fa-spin fa-spinner' v-if="box.loading"></i><i class="fa fa-check" v-else></i> {{ $t('action.confirm')}}</button>
                                                            <button class="btn btn-sm" @click="cancelUpdateBox(box.id, index)" v-if="box.mode===1"><i class="fa fa-repeat"></i> {{ $t('action.cancel')}}</button>  
                                                            <span class="text-success text-sm m-l" v-if="box.successMsg"><i class="fa fa-check"></i> {{ box.successMsg }}</span>                                                      
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
                                <label class="m-l-sm col-xs-2">{{$t('manage.agent_joining_agreement')}} </label>
                            </div>
                            <div class="row m-t-xs">
                                <div class="col-md-12">
                                    <textarea style="width: 930px;" rows="50" class="m-l form-control" v-model="website_agreement" :disabled="!updateWebsiteManagementPermission"></textarea>
                                </div>
                            </div>
                            <div class="row b-b p-b m-t">
                                <div class="col-md-12" v-if="updateWebsiteManagementPermission">
                                    <button
                                        type="button"
                                        class="m-l md-btn w-sm blue m-r-sm"
                                        @click="updateWebsiteAgreement"
                                        :disabled="!updateWebsiteManagementPermission"
                                    >{{$t('common.save')}}
                                    </button>
                                    <i class="fa fa-check text-success" v-if="updateWebsiteAgreementStatus === 'success'"></i>
                                    <i class="fa fa-times text-danger" v-if="updateWebsiteAgreementStatus === 'failed'"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    </div>
</template>

<script>
    import api from '../../../api'
    import draggable from 'vuedraggable'
    export default {
        data () {
            return {
                website: {
                    id: '',
                    name: '',
                    icon: [],
                    description: '',
                    second_name: ''
                },
                mode: 0,
                boxes: [],
                initialBoxes: {},
                boxResults: {},
                hasImage: false,
                website_agreement: '',
                updateWebsiteAgreementStatus: '',
                statusUpdated: false,
                responseError: '',
                successMsg: ''
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
        watch: {
            statusUpdated (newObj, old) {
                setTimeout(() => {
                    this.statusUpdated = false
                }, 2500)
            },
            updateWebsiteAgreementStatus () {
                setTimeout(() => {
                    this.updateWebsiteAgreementStatus = ''
                }, 2500)
            },
            responseError (newObj, old) {
                setTimeout(() => {
                    this.statusUpdated = false
                }, 2500)
            }
        },
        methods: {
            getWebsite () {
                this.$http.get(api.website).then(data => {
                    this.website = Object.assign(this.website, data)
                })
            },
            getWebsiteDescription () {
                this.$http.get(api.website_descriptions).then(data => {
                    this.boxes = data.map(box => Object({
                        ...box,
                        mode: 0,
                        errorMsg: '',
                        successMsg: '',
                        loading: false
                    }))
                })
            },
            getWebsiteAgreement () {
                this.$http.get(api.website_agreement).then(data => {
                    this.website_agreement = data.description
                })
            },
            createBox () {
                this.boxes = [...this.boxes, {}]
                this.$http.post(api.website_descriptions).then(data => {
                    let box = Object({
                        ...data,
                        mode: 1,
                        errorMsg: '',
                        successMsg: '',
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
                this.$http.delete(api.website_descriptions + id + '/').then(() => {
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
                const errorMsg = `${this.$t('action.no_setting')}: ${this.$t('manage.main')}`
                if (!box.header_image) {
                    box.errorMsg = `${this.$t('action.no_setting')}: ${this.$t('manage.header_img')}`
                    return
                } else if (boxResult && boxResult.header_image) {
                    formData.append('header_image', boxResult.header_image)
                }

                formData.append('status', box.status)
                if (box.status === 0) {
                    if (!box.main_image) {
                        box.errorMsg = errorMsg
                        return
                    } else if (boxResult && boxResult.main_image) {
                        formData.append('main_image', boxResult.main_image)
                    }
                } else if (box.status === 1) {
                    if (!box.main_description) {
                        box.errorMsg = errorMsg
                        return
                    } else {
                        formData.append('main_description', box.main_description)
                    }
                }
                box.loading = true
                this.$http.put(api.website_descriptions + id + '/', formData).then(data => {
                    this.updateBoxSuccess(box.id, index)
                    this.$set(this.boxes, index, {
                        ...this.boxes[index],
                        ...data,
                        mode: 0,
                        errorMsg: '',
                        loading: false
                    })
                    delete this.boxResults[id]
                    delete this.initialBoxes[id]
                }, error => {
                    this.boxes[index].errorMsg = error
                })
            },
            cancelUpdateBox (id, index) {
                this.$set(this.boxes, index, {
                    ...this.boxes[index],
                    ...this.initialBoxes[id],
                    mode: 0,
                    errorMsg: ''
                })
                delete this.initialBoxes[id]
            },
            updateBoxSuccess (id, index) {
                this.boxes[index].successMsg = this.$t('status.success')
                setTimeout(() => {
                    this.boxes[index].successMsg = ''
                }, 2000)
            },
            updateRank () {
                this.$http.post(api.website_descriptions_ranks, this.boxes.map((box, index) => Object({
                    id: box.id,
                    rank: index + 1
                }))).then(() => {
                    this.boxes.forEach((box, index) => {
                        this.boxes[index].rank = index + 1
                    })
                    this.mode = 0
                    this.updateRankSuccess()
                })
            },
            updateRankSuccess () {
                this.successMsg = this.$t('status.success')
                setTimeout(() => {
                    this.successMsg = ''
                }, 2000)
            },
            updateWebsiteAgreement () {
                this.$http.put(api.website_agreement, {
                    description: this.website_agreement
                }).then(data => {
                    this.website_agreement = data.description
                    this.updateWebsiteAgreementStatus = 'success'
                }, () => {
                    this.updateWebsiteAgreementStatus = 'failed'
                })
            },
            cancelUpdateRank () {
                this.boxes.sort((a, b) => a.rank - b.rank)
                this.mode = 0
            },
            syncImg (e) {
                this.website.icon = e.target.files[0]
                this.hasImage = true
            },
            syncBoxImg (e, box, index, attr) {
                if (!this.checkFileSize(e.target.files[0])) {
                    e.target.value = ''
                    this.boxes[index].errorMsg = this.$t('common.file_size_too_large')
                    return
                } else {
                    this.boxes[index].errorMsg = ''
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
            onSubmit (e) {
                let formData = new window.FormData()
                formData.append('name', this.website.name)
                formData.append('description', this.website.description)
                formData.append('second_name', this.website.second_name)
                if (this.hasImage) {
                    formData.append('icon', this.website.icon)
                }
                this.$http.put(api.website, formData).then(data => {
                    this.website = Object.assign(this.website, data)
                    this.responseError = ''
                    this.statusUpdated = true
                }, error => {
                    this.responseError = error
                })
            }
        },
        components: {
            draggable
        }
    }
</script>
<style scoped>
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
</style>
