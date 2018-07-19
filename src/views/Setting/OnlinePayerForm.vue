<template>
    <div>
        <div class="m-b">
            <ol class="breadcrumb">
                <li class="active"><router-link to="/online_payer">{{$t('title.online_payer_management')}}</router-link></li>
                <li class="active">{{$route.meta.title}}</li>
            </ol>
        </div>
        <div class="box">
            <div class="box-body">
                <form class="form m-a" @submit.prevent="onSubmit">
                    <div class="row">
                        <div class="col-xs-12">
                            <div class="form-group">
                                <label class="label-width">{{$t('title.online_payer')}}</label>
                                <div class="inline-form-control">
                                    <input
                                        class="form-control w-lg"
                                        v-model="payer.name"
                                        required
                                    />
                                </div>
                            </div>
                            <div class="form-group">
                                <label  class="label-width">{{$t('finance.withdraw_gateway')}}</label>
                                <div class="inline-form-control">
                                    <select
                                        class="form-control w-lg c-select"
                                        v-model="payer.withdraw_gateway"
                                        v-if="!selectorLoding && withdrawGateway.length"
                                    >
                                        <option
                                        class="form-control"
                                        :value="p.id"
                                        v-for="(p, i) in withdrawGateway"
                                        :key="i"
                                        >{{ p.name }}
                                        </option>
                                    </select>
                                    <span
                                        class="p-b-xs p-t-sm form-control w-lg"
                                        v-else-if="selectorLoding"
                                    >
                                        <i class="fa fa-spin fa-spinner"></i>
                                    </span>
                                    <span
                                        class="p-b-xs p-t-sm form-control w-lg"
                                        v-else-if="!withdrawGateway.length"
                                    >
                                        {{ $t('system.no_record') }}
                                    </span>
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="label-width">{{$t('finance.merchant_id')}}</label>
                                <div class="inline-form-control">
                                    <input
                                        class="form-control w-lg"
                                        v-model="payer.merchant_num"
                                        required
                                    />
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="label-width">{{$t('finance.certificate')}}</label>
                                <div class="inline-form-control">
                                    <input
                                        class="form-control w-lg"
                                        v-model="payer.certificate"
                                        required
                                    />
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="label-width v-t">{{$t('finance.public_key')}}</label>
                                <div class="inline-form-control">
                                    <textarea
                                        class="form-control"
                                        v-model="payer.public_key"
                                        cols="48"
                                        rows="6"
                                    />
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="label-width v-t">{{$t('finance.public_key')}}</label>
                                <div class="inline-form-control">
                                    <textarea
                                        class="form-control"
                                        v-model="payer.private_key"
                                        cols="48"
                                        rows="6"
                                    />
                                </div>
                            </div>

                             <div class="form-group">
                                <label class="label-width">{{$t('finance.board_url')}}</label>
                                <div class="inline-form-control">
                                    <input
                                        class="form-control w-lg"
                                        v-model="payer.board_url"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <button
                        type="submit"
                        class="md-btn w-sm blue"
                    >
                        <span v-if="!submitLoading">{{$t('dic.submit')}}</span>
                        <i class="fa fa-spin fa-spinner" v-else></i>
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>
<script>
import { getMerchant, updateMerchant } from '../../service'

export default {
    data () {
        return {
            id: '',
            payer: {
                id: '',
                name: '',
                withdraw_gateway: '',
                merchant_num: '',
                certificate: '',
                private_key: '',
                public_key: '',
                board_url: ''
            },
            fields: [
                'name',
                'withdraw_gateway',
                'merchant_num',
                'certificate',
                'private_key',
                'public_key',
                'board_url'
            ],
            selectorLoding: true,
            submitLoading: false,
            withdrawGateway: []
        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            let id = to.params.online_payerId
            if (id) {
                vm.id = id
                vm.getPayer(id)
            }
            vm.getWithdrawGateway()
        })
    },
    methods: {
        onSubmit () {
            this.submitLoading = true
            let data = {}
            this.fields.forEach(key => {
                if (this.payer[key]) {
                    data[key] = this.payer[key]
                }
            })
            updateMerchant('onlinePayer', {
                id: this.id,
                data
            }, {
                action: this.payer.id ? this.$t('title.online_payer_edit') : this.$t('title.online_payer_add')
            })
            .then(() => { this.$router.push(`/online_payer/${this.id}`) })
            .catch(() => {})
            .finally(() => { this.submitLoading = false })
        },
        getPayer (id) {
            getMerchant('onlinePayer', { id }).then(data => {
                Object.assign(this.payer, data, {
                    withdraw_gateway: data.withdraw_gateway.id
                })
            })
        },
        getWithdrawGateway () {
            getMerchant('withdrawGateway').then(data => {
                this.withdrawGateway = data
                if (this.withdrawGateway.length && !this.$route.params.online_payerId) {
                    this.payer.withdraw_gateway = data[0].id
                }
                this.selectorLoding = false
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.v-t {
  vertical-align: top;
}
</style>
