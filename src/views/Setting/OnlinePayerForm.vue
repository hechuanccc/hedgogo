<template>
    <div>
        <div class="m-b">
            <ol class="breadcrumb">
                <li class="active"><router-link to="/online_payer">{{$t('nav.setting_online_payer')}}</router-link></li>
                <li class="active">{{$route.meta.title}}</li>
            </ol>
        </div>
        <div class="box">
            <div class="box-body">
                <form class="form m-a" @submit.prevent="onSubmit">
                    <div class="row">
                        <div class="col-xs-12">
                            <div class="form-group">
                                <label class="label-width">{{$t('online_payer.name')}}</label>
                                <div class="inline-form-control">
                                    <input
                                        class="form-control w-lg"
                                        v-model="payer.name"
                                        required
                                    />
                                </div>
                            </div>
                            <div class="form-group">
                                <label  class="label-width">{{$t('online_payer.withdraw_gateway')}}</label>
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
                                        {{ $t('common.no_record') }}
                                    </span>
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="label-width">{{$t('online_payer.merchant_num')}}</label>
                                <div class="inline-form-control">
                                    <input
                                        class="form-control w-lg"
                                        v-model="payer.merchant_num"
                                        required
                                    />
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="label-width">{{$t('online_payer.certificate')}}</label>
                                <div class="inline-form-control">
                                    <input
                                        class="form-control w-lg"
                                        v-model="payer.certificate"
                                        required
                                    />
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="label-width v-t">{{$t('online_payer.public_key')}}</label>
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
                                <label class="label-width v-t">{{$t('online_payer.private_key')}}</label>
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
                                <label class="label-width">{{$t('online_payer.board_url')}}</label>
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
                        <span v-if="!submitLoading">{{$t('common.save')}}</span>
                        <i class="fa fa-spin fa-spinner" v-else></i>
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>
<script>
import api from '../../api'
import $ from '../../utils/util'

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
            this.$http({
                method: this.id ? 'put' : 'post',
                url: `${api.online_payer}${this.id && this.id + '/'}`,
                data
            }).then(data => {
                if (data) {
                    $.notify({
                        message: `${this.payer.id ? this.$t('action.update') : this.$t('action.create')}${this.$t('status.success')}`
                    })
                    this.$router.push(`/online_payer/${data.id}`)
                }
                this.submitLoading = false
            }, error => {
                $.notify({
                    message: error,
                    type: 'danger'
                })
                this.submitLoading = false
            })
        },
        getPayer (id) {
            this.$http.get(`${api.online_payer}${id}/`).then(data => {
                Object.assign(this.payer, data, {
                    withdraw_gateway: data.withdraw_gateway.id
                })
            })
        },
        getWithdrawGateway () {
            this.$http.get(api.withdrawgateway).then(data => {
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
