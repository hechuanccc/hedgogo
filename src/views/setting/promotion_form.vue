<template>
    <div>
        <div class="m-b">
            <ol class="breadcrumb">
                <li class="active"><router-link to="/promotion">{{$t('nav.promotion')}}</router-link></li>
                <li class="active">{{$route.meta.title}}</li>
            </ol>
        </div>
        <div class="alert alert-danger" v-if="!$root.permissions.includes('change_promotion')">{{$t('common.errorPermission')}}</div>
        <div class="box">
            <div class="box-header b-b">
                <div class="row">
                    <div class="col-md-4">
                        <h2 class="v-m m-t-sm">{{promotion.name}} </h2>
                    </div>
                    <div class="col-md-5 col-md-offset-3 text-right" v-if="action !== 'update'">
                        <label for="promotions" class="m-r">Copy Promotion</label>
                        <select class="form-control w-sm c-select" name="promotions" @change="selectPromotion">
                            <option class="form-control" value="">请选择</option>
                            <option class="form-control" :value="p.id" v-for="p in promotions">{{p.name}}</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="box-body">
                <form class="form m-a" v-on:submit.prevent="onSubmit" enctype="multipart/form-data">
                    <div class="row b-b p-b m-b">
                        <div class="col-md-12">
                            <div class="form-group">
                                <label  class="label-width">{{$t('common.name')}}</label>
                                <div class="inline-form-control">
                                    <input class="form-control" name="name" v-model="promotion.name" :placeholder="promotion.name!='' ? '':'名称, 必填'" required >
                                </div>
                            </div>
                            <div class="form-group">
                                <label  class="label-width">{{$t('promotion.rank')}}</label>
                                <div class="inline-form-control">
                                    <input type="text" class="form-control" name="rank" v-model="promotion.rank" :placeholder="promotion.rank!='' ? '':'排序, 必填'" required >
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="label-width">{{$t('promotion.banner')}}</label>
                                <div class="inline-form-control" :class="{'promo-image-container' : promotion.image_url}" v-if="!hasImage">
                                    <img :src="promotion.image_url || promotion.image" class="promo-image">
                                </div>
                                <div class="inline-form-control">
                                    <input type="hidden" name="image_url">
                                    <input type="file" name="image" accept="image/*" @change="syncImage" >
                                </div>
                                <div class="m-t text-danger">上传图片最大宽度930像素！</div>
                            </div>
                            <div class="form-group">
                                <label class="label-width">{{$t('promotion.mobileBanner')}}</label>
                                <div class="inline-form-control" :class="{'promo-image-container' : promotion.image_url_mobile}" v-if="!hasImageMobile">
                                    <img :src="promotion.image_url_mobile || promotion.mobileBanner" class="promo-image">
                                </div>
                                <div class="inline-form-control">
                                    <input type="hidden" name="image_url_mobile">
                                    <input type="file" name="image" accept="image/*" @change="syncImageMobile" >
                                </div>
                                <div class="m-t text-danger">上传图片最大宽度320像素！</div>
                            </div>

                            <div class="form-group">
                                <label for="description">{{$t('promotion.desc')}}</label>
                                <tinymce :id="randomId" :model="promotion.description" name="description" :content="promotion.description" @change-model="changeModel"></tinymce>
                            </div>
                            <div class="form-group">
                                <label for="mobile_description">{{$t('promotion.desc_mobile')}}</label>
                                <tinymce :id="randomIdMobile" :model="promotion.mobile_description" name="mobile_description" :content="promotion.mobile_description" @change-model="changeModel"></tinymce>
                            </div>
                            <div class="form-group">
                                <label for="status" class="label-width">{{$t('common.status')}}</label>
                                <select class="form-control w-sm c-select" name="status" v-model="promotion.status">
                                    <option class="form-control" value="0">{{$t('status.inactive')}}</option>
                                    <option class="form-control" value="1">{{$t('status.active')}}</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="label-width">{{$t('promotion.availability')}}</label>
                                <date-picker v-model="promotion.start_date" width='140'></date-picker>
                                <span>~</span>
                                <date-picker v-model="promotion.end_date" width='140'></date-picker>
                            </div>
                            <div>
                                <label class="text-sm">{{$t('member.level')}}</label>
                                <level :level="promotion.level" :mode="'checkbox'" @level-select="levelSelect"></level>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="alert alert-danger" v-if="responseError">{{responseError}}</div>
                        <button :disabled="!$root.permissions.includes('change_promotion')" type="submit" class="md-btn w-sm blue">{{$t('common.save')}}</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
<script>
    import api from '../../api'
    import { handleError } from '../../utils/handleError'
    import tinymce from '../../components/tinymce'
    import Vue from 'vue'
    import DatePicker from 'vue2-datepicker'
    const format = 'YYYY-MM-DD'

    export default {
        data () {
            return {
                promotion: {
                    id: '',
                    image: '',
                    description: '',
                    level: [],
                    start_date: '',
                    end_date: '',
                    rank: '',
                    name: '',
                    status: '',
                    image_url: '',
                    image_url_mobile: '',
                    image_mobile: '',
                    mobile_description: ''
                },
                field_locales: {
                    'name': '名称错误：',
                    'rank': '活动排序有误：',
                    'start_date': '有效期开始时间有误：',
                    'end_date': '有效期结束时间有误：',
                    'date_field': '时间选择有误：',
                    'image': '图片有误：',
                    'level': '会员等级有误：'
                },
                promotions: [],
                hasImage: false,
                hasImageMobile: false,
                responseError: '',
                selectedPromotion: '',
                action: 'create'
            }
        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                let id = to.params.promotionId
                if (id) {
                    vm.getPromotion(id)
                }
                vm.getPromotions()
                vm.randomId
                vm.randomIdMobile
            })
        },
        ready () {
            let route = this.$route.name
            this.promotion.status = 1
            route === 'promotion_add' ? this.action = 'create' : this.action = 'update'
        },
        watch: {
            'promotion.start_date' (newObj, old) {
                this.promotion.start_date = Vue.moment(this.promotion.start_date).format(format)
            },
            'promotion.end_date' (newObj, old) {
                this.promotion.end_date = Vue.moment(this.promotion.end_date).format(format)
            }
        },
        computed: {
            randomId () {
                // need to add different id to tinymce so it will initiate
                let max = 1000
                let min = 10
                return 'pd' + Math.floor(Math.random() * min + max)
            },
            randomIdMobile () {
                // need to add different id to tinymce so it will initiate
                let max = 1000
                let min = 10
                return 'pd' + Math.floor(Math.random() * min + max)
            }
        },
        methods: {
            onSubmit (e) {
                let formData = new window.FormData()
                formData.append('name', this.promotion.name)
                formData.append('rank', this.promotion.rank)
                if (this.hasImage) {
                    formData.append('image', this.promotion.image)
                }
                if (this.hasImageMobile) {
                    formData.append('image_mobile', this.promotion.image_mobile)
                }
                formData.append('description', this.promotion.description)
                formData.append('status', this.promotion.status)
                formData.append('start_date', this.promotion.start_date)
                formData.append('end_date', this.promotion.end_date)
                formData.append('level', this.promotion.level)
                formData.append('image_url', this.promotion.image_url)
                formData.append('mobile_description', this.promotion.mobile_description)

                if (this.promotion.id) {
                    this.$http.put(api.promotion + this.promotion.id + '/', formData).then(response => {
                        if (response.status === 200) {
                            this.$router.push('/promotion/' + response.data.id)
                        }
                    }, response => {
                        this.responseError = ''
                        for (let field in this.field_locales) {
                            this.responseError += handleError(response, field, this.field_locales)
                        }
                    })
                } else {
                    this.$http.post(api.promotion, formData).then(response => {
                        if (response.status === 201) {
                            this.$router.push('/promotion/' + response.data.id)
                        }
                    }, response => {
                        this.responseError = ''
                        for (let field in this.field_locales) {
                            this.responseError += handleError(response, field, this.field_locales)
                        }
                    })
                }
            },
            syncImage (e) {
                this.promotion.image = e.target.files[0]
                this.hasImage = true
            },
            syncImageMobile (e) {
                this.promotion.image_mobile = e.target.files[0]
                this.hasImageMobile = true
            },
            getPromotion (id) {
                this.$http.get(api.promotion + id + '/').then((response) => {
                    this.promotion = response.data
                    this.selectedPromotion = this.promotion
                    // add image_url so we can pass a image url instead
                    // of image file while copying
                    this.selectedPromotion.image_url = this.promotion.image
                    this.selectedPromotion.image_url_mobile = this.promotion.image_mobile
                    if (this.action === 'copy') {
                        delete this.selectedPromotion.image
                        delete this.selectedPromotion.image_mobile
                        delete this.selectedPromotion.id
                    }
                })
            },
            getPromotions () {
                this.$http.get(api.promotion).then((response) => {
                    this.promotions = response.data
                })
            },
            selectPromotion (event) {
                let value = event.target.value
                this.action = 'copy'
                this.getPromotion(value)
            },
            changeModel (val, name) {
                this.promotion[name] = val
            },
            dateFrom (flag) {
                if (flag === 'from') {

                } else {
                    this.promotion.end_date = Vue.moment(this.promotion.end_date).format(format)
                }
            },
            levelSelect (val) {
                this.promotion.level = val
            }
        },
        components: {
            DatePicker,
            tinymce,
            level: require('../../components/level')
        }
    }
</script>
<style scoped>
    .promo-image-container {
        width: 100%;
        max-height: 350px;
        overflow: hidden;
    }
    .promo-image {
        max-width: 100%;
    }
</style>
