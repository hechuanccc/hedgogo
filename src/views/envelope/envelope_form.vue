<template>
    <div>
        <div class="m-b">
            <ol class="breadcrumb">
                <li class="active"><router-link to="/envelope">{{$t('envelope.envelope')}}</router-link></li>
                <li class="active">{{$route.meta.title}}</li>
            </ol>
        </div>
        <form @submit.prevent='onSubmit'>
            <div class="box p-t m-b clearfix">
                <div class="col-xs-4 m-b">
                    <div class="clearfix m-b">
                        <label class="col-xs-4 text-right form-control-label">{{$t('envelope.name')}}</label>
                        <div class="inline-form-control">
                            <input  class="form-control" v-model="envelope.name" required>
                        </div>
                    </div>
                    <div class="clearfix">
                        <label class="col-xs-4 text-right form-control-label">{{$t('envelope.min_money')}}</label>
                        <div class="inline-form-control">
                            <input type="number" min="0" class="form-control" v-model="envelope.min_bonus" required>
                        </div>
                    </div>
                </div>
                <div class="col-xs-4">
                    <div class="clearfix m-b" >
                        <label class="col-xs-4 text-right form-control-label">{{$t('envelope.status')}}</label>
                        <div class="inline-form-control">
                            <select class="form-control w-sm c-select" v-model="envelope.status">
                                <option value="1">{{$t('status.active')}}</option>
                                <option value="0">{{$t('status.inactive')}}</option>
                            </select>
                        </div>
                    </div>

                    <div class="clearfix">
                        <label class="col-xs-4 text-right form-control-label">{{$t('envelope.max_money')}}</label>
                        <div class="inline-form-control">
                            <input type="number" min="1" class="form-control" v-model="envelope.max_bonus" required>
                        </div>
                </div>
                </div>
            </div>
            <div class="row">
                <div class="col-xs-12">
                    <div class="alert alert-danger" v-if="errorMsg">{{errorMsg}}</div>
                    <button type="submit" class="md-btn w-sm blue">{{$t('common.save')}}</button>
                </div>
            </div>
        </form>
    </div>
</template>
<script>
    import api from '../../api'
    import { handleError } from '../../utils/handleError'

    export default {
        data () {
            return {
                envelope: {
                    id: '',
                    name: '',
                    min_bonus: '',
                    max_bonus: '',
                    status: 1
                },
                field_locales: {
                    'name': '红包名称有误：',
                    'min_bonus': ' 红包最小金额有误：',
                    'max_bonus': ' 红包最大金额有误：'
                },
                errorMsg: '',
                updated: false
            }
        },
        // route: {
        //     data (transition) {
        //         let id = transition.to.params.envelopeId
        //         if (id) {
        //             this.getEnvelope(id)
        //         }
        //     }
        // },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                let id = to.params.envelopeId
                if (id) {
                    vm.getEnvelope(id)
                }
            })
        },
        methods: {
            onSubmit (e) {
                if (this.envelope.id) {
                    this.$http.put(api.envelope + this.envelope.id + '/', this.envelope).then(response => {
                        if (response.status === 200) {
                            this.$router.push('/envelope')
                        }
                    }, response => {
                        this.errorMsg = ''
                        for (let field in this.field_locales) {
                            this.errorMsg += handleError(response, field, this.field_locales)
                        }
                    })
                } else {
                    this.$http.post(api.envelope, this.envelope).then(response => {
                        if (response.status === 201) {
                            this.$router.push('/envelope')
                        }
                    }, response => {
                        this.errorMsg = ''
                        for (let field in this.field_locales) {
                            this.errorMsg += handleError(response, field, this.field_locales)
                        }
                    })
                }
            },
            getEnvelope (id) {
                this.$http.get(api.envelope + id).then(response => {
                    this.envelope = response.data
                })
            }
        }
    }
</script>
<style scoped>
.count-label {
    padding: 6px;
    margin-right: 10px;
}
.md-form-group {
    padding: 15px 0 5px 0;
}
</style>
