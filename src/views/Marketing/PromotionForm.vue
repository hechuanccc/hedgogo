<template>
    <div>
        <div class="m-b">
            <ol class="breadcrumb">
                <li class="active"><router-link to="/promotion">{{$t('title.promotion')}}</router-link></li>
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
                            <option class="form-control" value="">{{ $t('system.please_select') }}</option>
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
                                <label class="label-width">{{ $t('dic.name') }}</label>
                                <div class="inline-form-control">
                                    <input 
                                        class="form-control"
                                        v-model="promotion.name"
                                        :placeholder="$t('dic.name')"
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
                                <label class="label-width">{{ $t('promotion.banner_mobile') }}</label>
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
                                <label for="status" class="label-width">{{ $t('dic.status') }}</label>
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
                                <el-date-picker
                                    v-model="promotion.start_date"
                                    type="date"
                                    ref="start_date"
                                    :placeholder="$t('promotion.start_date')"
                                    value-format="yyyy-MM-dd"
                                />
                                &nbsp;~&nbsp;
                                <el-date-picker
                                    v-model="promotion.end_date"
                                    type="date"
                                    ref="end_date"
                                    :placeholder="`${$t('promotion.end_date')}, ${$t('system.not_required')}`"
                                    value-format="yyyy-MM-dd"
                                />
                            </div>
                            <div class="form-group">
                                <label class="text-sm">{{ $t('dic.member_level') }}</label>
                                <selector-member-level
                                    :level="promotion.level"
                                    :mode="'checkbox'"
                                    :accountType="''"
                                    @level-select="levelSelect"
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <button type="submit" class="md-btn w-sm blue">
                            <span v-if="!loading">{{ $t('dic.submit') }}</span>
                            <i v-else class="fa fa-spin fa-spinner"></i>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
<script>
import random from 'lodash/random'
import { getSetting, updateSetting } from '../../service'
import Tinymce from '../../components/Tinymce'
import SelectorMemberLevel from '../../components/SelectorMemberLevel'
import $ from '../../utils/util'

export default {
    data () {
        return {
            id: '',
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
            randomId: 'pd' + random(0, 500),
            randomIdMobile: 'pd' + random(501, 1000),
            promotions: [],
            hasImage: false,
            hasImageMobile: false,
            selectedPromotion: '',
            loading: false
        }
    },
    created () {
        this.getPromotions()
    },
    methods: {
        getPromotions () {
            getSetting('promotion').then(data => {
                this.promotions = data
                if (this.$route.params.promotionId) {
                    this.id = this.$route.params.promotionId
                    this.selectPromotion(this.id)
                }
            })
        },
        onSubmit (e) {
            if (!this.promotion.start_date) {
                $.notify({
                    message: `${this.$t('system.unfilled')}(${this.$t('promotion.availability')})`,
                    type: 'danger'
                })
                this.$refs.start_date.focus()
                return
            }

            if (this.promotion.end_date) {
                if (this.$moment(this.promotion.end_date).diff(this.promotion.start_date) < 0) {
                    $.notify({
                        message: this.$t('promotion.end_date_not_before_start_date'),
                        type: 'danger'
                    })
                    this.$refs.end_date.focus()
                    return
                }
            } else {
                this.promotion.end_date = ''
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

            this.loading = true
            updateSetting('promotion', {
                id: this.id,
                data: formData
            }).then(data => {
                $.notify({
                    message: `${this.id ? this.$t('title.promotion_edit') : this.$t('title.promotion_add')}${this.$t('status.success')}`
                })
                this.$router.push('/promotion/' + data.id)
                this.loading = false
            }, error => {
                $.notify({
                    message: error,
                    type: 'danger'
                })
                this.loading = false
            })
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
        Tinymce,
        SelectorMemberLevel
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
