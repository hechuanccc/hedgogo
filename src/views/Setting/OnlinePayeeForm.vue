<template>
    <div>
        <div class="m-b">
            <ol class="breadcrumb">
                <li class="active"><router-link to="/online_payee">{{$t('title.online_payee_management')}}</router-link></li>
                <li class="active">{{$route.meta.title}}</li>
            </ol>
        </div>
        <div class="box">
            <div class="box-body">
                <form class="form m-a" v-on:submit.prevent="onSubmit">
                    <div class="row">
                        <div class="form-group">
                            <label  class="label-width">{{$t('dic.name')}}</label>
                            <div class="inline-form-control">
                                <input
                                    class="form-control w-md"
                                    v-model="payee.name"
                                    required
                                />
                            </div>
                        </div>
                        <div class="form-group">
                            <label  class="label-width">{{$t('misc.display_name')}}</label>
                            <div class="inline-form-control">
                                <input
                                    class="form-control w-md"
                                    v-model="payee.display_name"
                                    required
                                />
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="label-width">{{$t('finance.payment_gateway')}}</label>
                            <div class="inline-form-control w-md">
                                <multiselect
                                    v-model="selectedPaymentGateway"
                                    :options="paymentGateways"
                                    :hide-selected="true"
                                    :preserve-search="false"
                                    :searchable="false"
                                    label="name"
                                    track-by="id"
                                    :selectLabel="''"
                                    :allow-empty="false"
                                    class="pointer"
                                    @select="selectPaymentGateway"
                                >
                                    <template
                                        slot="placeholder"
                                        slot-scope="props"
                                    >
                                        <span class="multiselect__single" v-if="paymentGateways.length">
                                            {{ $t('system.please_select') }}
                                        </span>
                                        <i class="fa fa-spin fa-spinner m-l-sm" v-else></i>
                                    </template>
                                    <template
                                        slot="tag"
                                        slot-scope="props"
                                    >
                                        <span class="custom__tag label m-l-xs blue pointer" @click="props.remove(props.option)">
                                            {{ props.option.name }}
                                            <i class="fa fa-times"></i>
                                        </span>
                                    </template>
                                </multiselect>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="label-width">{{$t('title.payment_type')}}</label>
                            <div
                                class="inline-form-control"
                                :class="{
                                    'w-md': selectedPaymentType.length < 2
                                }"
                            >
                                <multiselect
                                    v-model="selectedPaymentType"
                                    :options="selectedPaymentGateway.payment_types || []"
                                    :multiple="true"
                                    :close-on-select="false"
                                    :clear-on-select="false"
                                    :hide-selected="true"
                                    :preserve-search="false"
                                    :searchable="false"
                                    :placeholder="$t('system.please_select')"
                                    label="name"
                                    track-by="id" 
                                    :preselect-first="false"
                                    :selectLabel="''"
                                    :disabled="!selectedPaymentGateway"
                                    @close="closePaymentTypeSelector"
                                >
                                    <template slot="option" slot-scope="props">
                                        {{ props.option.name }}<span v-if="props.option.platform < 2">-{{ props.option.platform === 0 ? $t('dic.pc') : $t('dic.mobile') }}</span>
                                    </template>
                                    <template
                                        slot="tag"
                                        slot-scope="props"
                                    >
                                        <span class="custom__tag label m-l-xs blue pointer" @click="props.remove(props.option)">
                                            {{ props.option.name }}<span v-if="props.option.platform < 2">-{{ props.option.platform === 0 ? $t('dic.pc') : $t('dic.mobile') }}</span>                                            
                                            <i class="fa fa-times"></i>
                                        </span>
                                    </template>
                                </multiselect>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="label-width">{{$t('finance.merchant_id')}}</label>
                            <div class="inline-form-control">
                                <input class="form-control w-md" v-model="payee.merchant_num" required/>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="label-width">{{$t('finance.certificate')}}</label>
                            <div class="inline-form-control">
                                <input class="form-control w-xxl" v-model="payee.certificate"/>
                            </div>
                        </div>


                        <div class="form-group">
                            <label class="label-width v-t">{{$t('finance.public_key')}}</label>
                            <div class="inline-form-control">
                                <textarea
                                    class="form-control"
                                    v-model="payee.public_key"
                                    cols="48"
                                    rows="6"
                                />
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="label-width v-t">{{$t('finance.private_key')}}</label>
                            <div class="inline-form-control">
                                <textarea
                                    class="form-control"
                                    v-model="payee.private_key"
                                    cols="48"
                                    rows="6"
                                />
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="label-width v-t">{{$t('finance.merchant_public_key')}}</label>
                            <div class="inline-form-control">
                                <textarea
                                    class="form-control"
                                    v-model="payee.merchant_public_key"
                                    cols="48"
                                    rows="6"
                                />
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="label-width v-t">{{$t('finance.merchant_private_key')}}</label>
                            <div class="inline-form-control">
                                <textarea
                                    class="form-control"
                                    v-model="payee.merchant_private_key"
                                    cols="48"
                                    rows="6"
                                />
                            </div>
                        </div>

                        <div class="form-group">
                            <label  class="label-width">{{$t('finance.board_url')}}</label>
                            <div class="inline-form-control">
                                <input class="form-control w-xxl" v-model="payee.board_url" required/>
                            </div>
                        </div>

                        <div class="form-group">
                            <label  class="label-width">{{$t('finance.payment_domain')}}</label>
                            <div class="inline-form-control">
                                <input  class="form-control" v-model="payee.domain_url" :disabled="disabledDomainURL"/>
                            </div>
                            <p class="text-danger note">{{$t('finance.domain_label')}}</p>
                        </div>

                        <div class="form-group">
                            <label  class="label-width">{{$t('finance.expired_in')}}</label>
                            <div class="inline-form-control">
                                <input class="form-control" v-model="payee.expired_in" required>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="form-group">
                            <label class="label-width">{{$t('dic.member_level')}}</label>
                            <selector-member-level
                                :level="payee.level"
                                :mode="'checkbox'"
                                @level-select="levelSelect"
                                class="m-l"
                            />
                        </div>

                        <input type="hidden" v-model="payee.updated_by">

                        <div class="form-group col-md-6 p-l-0">
                            <label for="memo">{{$t('dic.memo')}}</label>
                            <textarea class="form-control" name="memo" rows="4" cols="4" v-model="payee.memo"></textarea>
                        </div>
                    </div>
                    <div>
                        <button type="submit" class="md-btn w-sm blue">{{$t('dic.submit')}}</button>
                     </div>
                </form>
            </div>
        </div>
    </div>
</template>
<script>
    import Multiselect from 'vue-multiselect'
    import { getMerchant, updateMerchant } from '../../service'
    import SelectorMemberLevel from '../../components/SelectorMemberLevel'
    import $ from '../../utils/util'

    export default {
        data () {
            return {
                id: '',
                payee: {
                    name: '',
                    merchant_num: '',
                    certificate: '',
                    private_key: '',
                    public_key: '',
                    merchant_private_key: '',
                    merchant_public_key: '',
                    board_url: '',
                    level: '',
                    expired_in: '',
                    memo: '',
                    payment_gateway: '',
                    domain_url: '',
                    display_name: '',
                    payment_type: ''
                },
                paymentGateways: [],
                selectedPaymentGateway: '',
                selectedPaymentType: [],
                validateField: {
                    level: 'dic.member_level',
                    payment_gateway: 'finance.payment_gateway',
                    payment_type: 'title.payment_type'
                }
            }
        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                vm.init()
            })
        },
        computed: {
            disabledDomainURL () {
                let paymentGateway = this.paymentGateways.find(p => p.id === this.payee.payment_gateway)
                if (paymentGateway && !paymentGateway.need_domain_url) {
                    this.payee.domain_url = ''
                }
                return paymentGateway && !paymentGateway.need_domain_url
            }
        },
        methods: {
            async init () {
                this.id = this.$route.params.online_payeeId || ''
                this.paymentGateways = await getMerchant('paymentGateway', {
                    params: {
                        embed: 'payment_types'
                    }
                })

                if (this.id) {
                    Object.assign(this.payee, await this.getPayee(this.id))
                    this.selectedPaymentGateway = this.paymentGateways.find(g => g.id === this.payee.payment_gateway)
                    this.selectedPaymentType = this.selectedPaymentGateway.payment_types.filter(t => this.payee.payment_type.includes(t.id))
                }
            },
            onSubmit (e) {
                let unfilled = Object.keys(this.validateField).filter(k => !this.payee[k] || this.payee[k].length === 0)
                if (unfilled.length > 0) {
                    $.notify({
                        message: `${this.$t('system.please_select')} ${unfilled.map(v => this.$t(this.validateField[v])).join(', ')}`,
                        type: 'danger'
                    })
                    return
                }
                updateMerchant('onlinePayee', {
                    id: this.id,
                    data: this.payee
                }).then(data => {
                    this.$router.push('/online_payee/' + data.id)
                }, error => {
                    $.notify({
                        message: error,
                        type: 'danger'
                    })
                })
            },
            getPayee (id) {
                return getMerchant('onlinePayee', { id })
            },
            levelSelect (val) {
                this.payee.level = val
            },
            selectPaymentGateway (selectedOption, id) {
                if (selectedOption && selectedOption.id) {
                    this.payee.payment_gateway = selectedOption.id
                    this.payee.payment_type = []
                    this.selectedPaymentType = []
                }
            },
            closePaymentTypeSelector (value, id) {
                value && (this.payee.payment_type = value.map(p => p.id))
            }
        },
        components: {
            Multiselect,
            SelectorMemberLevel
        }
    }

</script>

<style>
.note {
  padding-left: 20px;
  display: inline-block;
}
.v-t {
  vertical-align: top;
}
</style>
