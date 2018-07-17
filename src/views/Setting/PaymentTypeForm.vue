<template>
<div>
    <div class="m-b">
        <ol class="breadcrumb">
            <li class="active"><router-link to="/paymenttype">{{ $t('title.payment_type_management') }}</router-link></li>
            <li class="active">{{ $route.meta.title }}</li>
        </ol>
    </div>
    <form class="box p-a" @submit.prevent="onSubmit">
        <div class="row m-a">
            <div class="form-group">
                <label class="label-width">{{ $t('dic.name') }}</label>
                <div class="inline-form-control">
                    <input 
                        class="form-control"
                        v-model="payment.name"
                        disabled
                    />
                </div>
            </div>
            <div class="form-group">
                <label class="label-width">{{ $t('misc.display_name') }}</label>
                <div class="inline-form-control">
                    <input
                        class="form-control"
                        v-model="payment.display_name"
                        disabled
                    />
                </div>
            </div>
            <!-- User could modify icon only on mobile platform. -->
            <div class="form-group" v-if="payment.platform === 1 || payment.platform === 2">
                <label class="label-width">Icon</label>
                <div class="inline-form-control right-float-img" v-if="hasIcon">
                    <img :src="payment.icon" height="60" alt="icon">
                    <button
                        type="button"
                        class="btn btn-xs btn-icon img-nav-btn"
                        @click="clearImg('Icon')"
                        v-if="hasIcon"
                    >
                        <i class="fa fa-times"></i>
                    </button>
                </div>
                <span class="m-r-sm" v-else>{{ $t('system.no_setting') }}</span>
                <div class="inline-form-control">
                    <input
                        type="file"
                        class="form-control w-md"
                        accept="image/*"
                        @change="syncImg($event, 'Icon')"
                        ref="iconInput"
                    />
                </div>
            </div>
        </div>
        <div class="row m-a">
            <div class="form-group">
                <label class="label-width">{{ $t('title.online_payee') }}</label>
                <div v-if="payment.detail.length > 0" class="m-t-sm">
                    <label
                        class="m-l-lg checkbox inline"
                        :key="detail.payee_id"
                        v-for="detail in payment.detail"
                    >
                        <input
                            type="checkbox"
                            name="payees" 
                            :value="detail.payee_id"
                            v-model="checkboxPayees[detail.payee_id]"
                        />
                        <i class="blue"></i>
                        {{ detail.name }}
                    </label>
                </div>
                <div v-else class="inline-form-control">{{ $t('finance.no_payment_gateway') }}</div>    
            </div>
            <p
                class="text-muted"
                v-html="payment.gateway_memo"
                v-if="payment.gateway_memo"
            >
            </p>
            <div class="row">
                <div class="form-group col-xs-6">
                    <label for="memo">{{ $t('finance.dashboard_memo') }}</label>
                    <textarea class="form-control" name="description" rows="4" v-model="payment.description"></textarea>
                </div>
            </div>
            <div class="row">
                <div class="form-group col-xs-6">
                    <label for="memo">{{ $t('finance.client_memo') }}</label>
                    <textarea class="form-control" name="client_description" rows="4" v-model="payment.client_description"></textarea>
                </div>
            </div>
        </div>
        <button type="submit" class="md-btn w-sm blue">
            <span v-if="!loading">{{ $t('dic.submit') }}</span>
            <i class="fa fa-spin fa-spinner" v-else></i>
        </button>
    </form>
</div>
</template>
<script>
import { getMerchant, updateMerchant } from '../../service'
import $ from '../../utils/util'

export default {
    data () {
        return {
            payment: {
                description: '',
                payees: [],
                detail: [],
                display_name: '',
                name: '',
                status: '',
                icon: '',
                icon_file: ''
            },
            fields: [
                'description',
                'client_description',
                'payees'
            ],
            checkboxPayees: {},
            hasIcon: false,
            hasIconFile: false,
            loading: false
        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            let id = to.params.id
            id && vm.getPaymentType(id)
        })
    },
    watch: {
        checkboxPayees: {
            handler (newObj) {
                this.payment.payees = Object.keys(newObj).filter(e => newObj[e])
            },
            deep: true
        }
    },
    methods: {
        onSubmit (e) {
            if (this.payment.id) {
                let formData = new window.FormData()
                this.fields.forEach(f => {
                    formData.append(f, this.payment[f] || '')
                })
                if (this.hasIconFile) {
                    formData.append('icon', this.payment.icon_file)
                } else if (!this.hasIcon) {
                    formData.append('icon', '')
                }
                this.loading = true
                updateMerchant('paymentType', {
                    id: this.payment.id,
                    data: formData
                }, {
                    action: this.$t('title.payment_type_edit')
                }).then(() => {
                    this.$router.push('/paymenttype/?type=' + this.payment.platform)
                }, () => {}).finally(() => {
                    this.loading = false
                })
            }
        },
        getPaymentType (id) {
            getMerchant('paymentType', {
                id,
                params: {
                    opt_expand: 1
                }
            }).then(data => {
                if (data.detail && data.detail.length) {
                    data.detail.forEach(payee => {
                        this.$set(this.checkboxPayees, payee.payee_id, payee.activate)
                    })
                }
                Object.assign(this.payment, data, {
                    gateway_memo: $.htmlTransform(data.gateway_memo)
                })
                this.hasIcon = !!data.icon
                this.hasIconFile = false
            })
        },
        syncImg (e, attr) {
            let snakeCase = $.camelToSnake(attr)
            var reader = new FileReader()
            reader.onload = (e) => {
                this.payment[`${snakeCase}`] = e.target.result
            }
            reader.readAsDataURL(e.target.files[0])
            this.$set(this.payment, `${snakeCase}_file`, e.target.files[0])
            this[`has${attr}`] = true
            this[`has${attr}File`] = true
        },
        clearImg (attr) {
            this[`has${attr}`] = false
            this[`has${attr}File`] = false
            this.$refs.iconInput.value = ''
            $.notify({
                message: this.$t('system_msg.click_submit_and_clear'),
                type: 'warning'
            })
        }
    }
}
</script>
<style lang="scss" scoped>
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
