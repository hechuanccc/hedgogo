<template>
    <div>
        <div class="m-b">
            <ol class="breadcrumb">
                <li class="active"><router-link to="/promotion">{{$t('nav.promotion')}}</router-link></li>
                <li class="active">{{$route.meta.title}}</li>
            </ol>
        </div>
        <div class="box">
            <div class="box-header b-b">
                <div class="row m-l m-r m-t-sm m-b-0">
                    <div class="pull-left m-t-xs">
                        <h2>{{ promotion.name }} </h2>
                    </div>
                    <div class="pull-right" v-if="$route.name === 'promotion_add'">
                        <label for="promotions" class="m-r-xs">{{ $t('promotion.copy_promotion') }}</label>
                        <select
                            class="form-control w-sm c-select"
                            name="promotions"
                            @change="selectPromotionHandler"
                        >
                            <option class="form-control" value="">{{ $t('common.please_select') }}</option>
                            <option 
                                class="form-control"
                                :value="promotion.id"
                                v-for="promotion in promotions"
                                :key="promotion.id"
                            >{{ promotion.name }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="box-body">
                <form class="form m-a" v-on:submit.prevent="onSubmit" enctype="multipart/form-data">
                    <div class="row b-b p-b m-b">
                        <div class="col-md-12">
                            <div class="form-group">
                                <label class="label-width">{{ $t('common.name') }}</label>
                                <div class="inline-form-control">
                                    <input 
                                        class="form-control"
                                        v-model="promotion.name"
                                        :placeholder="$t('common.name')"
                                        required
                                    >
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="label-width">{{ $t('promotion.banner') }}</label>
                                <div class="inline-form-control promo-image-container" v-if="promotion.image_url">
                                    <img :src="promotion.image_url" class="promo-image">
                                </div>
                                <div class="inline-form-control v-m">
                                    <input class="form-control" type="file" accept="image/*" @change="syncImage($event, 'image')">
                                </div>
                                <p class="m-t text-danger">图片尺寸：电脑端推荐宽高比例为 8 : 1，推荐宽高为 1000 * 144</p>
                            </div>
                            <div class="form-group">
                                <label class="label-width">{{ $t('promotion.mobileBanner') }}</label>
                                <div class="inline-form-control promo-image-container" v-if="promotion.image_mobile_url">
                                    <img :src="promotion.image_mobile_url" class="promo-image">
                                </div>
                                <div class="inline-form-control">
                                    <input class="form-control" type="file" name="image" accept="image/*" @change="syncImage($event, 'image_mobile')">
                                </div>
                                <p class="m-t text-danger">图片尺寸：手机端推荐宽高比例为 4 : 1 ，推荐宽高为 360 * 90</p>
                            </div>
                            <div class="form-group">
                                <label for="description">{{ $t('promotion.desc') }}</label>
                                <tinymce
                                    :key="'promo_desc_pc'"
                                    :id="randomId"
                                    :model="promotion.description"
                                    name="description"
                                    :content="promotion.description"
                                    @change-model="changeModel"
                                >
                                </tinymce>
                            </div>
                            <div class="form-group">
                                <label for="mobile_description">{{ $t('promotion.desc_mobile') }}</label>
                                <tinymce
                                    :key="'promo_desc_pc'"
                                    :id="randomIdMobile"
                                    :model="promotion.mobile_description"
                                    name="mobile_description"
                                    :content="promotion.mobile_description"
                                    @change-model="changeModel"
                                >
                                </tinymce>
                            </div>
                            <div class="form-group">
                                <label for="status" class="label-width">{{ $t('common.status') }}</label>
                                <select
                                    class="form-control w-sm c-select"
                                    name="status"
                                    v-model="promotion.status" 
                                    required
                                >
                                    <option class="form-control" value="0">{{ $t('status.inactive') }}</option>
                                    <option class="form-control" value="1">{{ $t('status.active') }}</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="label-width">{{ $t('promotion.availability') }}</label>
                                <date-picker
                                    v-model="date"
                                    type="date"
                                    format="yyyy-MM-dd"
                                    ref="date"
                                    range
                                />
                            </div>
                            <div class="form-group">
                                <label class="text-sm">{{ $t('member.level') }}</label>
                                <level
                                    :level="promotion.level"
                                    :mode="'checkbox'"
                                    :noShowTrialMember="false"
                                    @level-select="levelSelect"
                                >
                                </level>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="alert alert-danger" v-if="errorMsg">
                            <span>{{ errorMsg }}</span>
                        </div>
                        <button type="submit" class="md-btn w-sm blue">{{ $t('common.save') }}</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
<script>
    import api from '../../../api'
    import tinymce from '../../../components/tinymce'
    import Vue from 'vue'
    import DatePicker from 'vue2-datepicker'
    import _ from 'lodash'
    const format = 'YYYY-MM-DD'

    export default {
        data () {
            return {
                api: api.promotion,
                promotion: {
                    id: '',
                    image: '',
                    description: '',
                    level: [],
                    start_date: '',
                    end_date: '',
                    rank: '1',
                    name: '',
                    status: '',
                    image_url: '',
                    image_mobile_url: '',
                    image_mobile: '',
                    mobile_description: ''
                },
                date: ['', ''],
                randomId: 'pd' + _.random(0, 500),
                randomIdMobile: 'pd' + _.random(501, 1000),
                promotions: [],
                hasImage: false,
                hasImageMobile: false,
                errorMsg: '',
                selectedPromotion: ''
            }
        },
        created () {
            this.getPromotions()
        },
        watch: {
            date (newObj) {
                if (newObj) {
                    [this.promotion.start_date, this.promotion.end_date] = [...newObj.map(e => Vue.moment(e).format(format))]
                } else {
                    [this.promotion.start_date, this.promotion.end_date] = ['', '']
                }
            }
        },
        methods: {
            getPromotions () {
                this.$http.get(this.api).then(data => {
                    this.promotions = data
                    if (this.$route.params.promotionId) {
                        this.selectPromotion(this.$route.params.promotionId)
                    }
                })
            },
            onSubmit (e) {
                if (!this.promotion.start_date || !this.promotion.start_date) {
                    this.errorMsg = `${this.$t('common.unfilled')}(${this.$t('promotion.availability')})`
                    this.$refs.date.togglePopup()
                    return
                }
                let formData = new window.FormData()
                formData.append('name', this.promotion.name)
                formData.append('rank', this.promotion.rank)
                if (this.hasImage) {
                    formData.append('image', this.promotion.image)
                } else {
                    formData.append('image_url', this.promotion.image_url)
                }
                if (this.hasImageMobile) {
                    formData.append('image_mobile', this.promotion.image_mobile)
                } else {
                    formData.append('image_url_mobile', this.promotion.image_mobile_url)
                }
                formData.append('description', this.promotion.description)
                formData.append('status', this.promotion.status)
                formData.append('start_date', this.promotion.start_date)
                formData.append('end_date', this.promotion.end_date)
                formData.append('level', this.promotion.level)
                formData.append('mobile_description', this.promotion.mobile_description)

                if (this.$route.params.promotionId && this.$route.name === 'promotion_edit') {
                    this.$http.put(`${this.api}${this.$route.params.promotionId}/`, formData).then(data => {
                        this.$router.push('/promotion/' + data.id)
                    }, error => {
                        this.errorMsg = error
                    })
                } else {
                    this.$http.post(this.api, formData).then(data => {
                        this.$router.push('/promotion/' + data.id)
                    }, error => {
                        this.errorMsg = error
                    })
                }
            },
            syncImage (e, target) {
                var reader = new FileReader()

                reader.onload = (e) => {
                    this.promotion[target + '_url'] = e.target.result
                }
                reader.readAsDataURL(e.target.files[0])
                this.promotion[target] = e.target.files[0]
                if (target === 'image') {
                    this.hasImage = true
                } else if (target === 'image_mobile') {
                    this.hasImageMobile = true
                }
            },
            selectPromotionHandler (event) {
                let value = event.target.value
                this.selectPromotion(value)
            },
            selectPromotion (id) {
                this.promotion = Object.assign(this.promotion, this.promotions.find(element => element.id === parseInt(id)))
                this.date = [this.promotion.start_date || '', this.promotion.end_date || '']
                if (this.promotion.image) {
                    this.promotion.image_url = this.promotion.image
                }
                if (this.promotion.image_mobile) {
                    this.promotion.image_mobile_url = this.promotion.image_mobile
                }
            },
            changeModel (val, name) {
                this.promotion[name] = val
            },
            levelSelect (val) {
                this.promotion.level = val
            }
        },
        components: {
            DatePicker,
            tinymce,
            level: require('../../../components/level')
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
