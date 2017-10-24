<template>
    <div>
        <div class="m-b">
            <ol class="breadcrumb">
                <li class="active"><router-link to="/envelope_settings">{{$t('envelope.envelope_setting')}}</router-link></li>
                <li class="active">{{$route.meta.title}}</li>
            </ol>
        </div>
        <form @submit.prevent='onSubmit'>
            <div class="box p-t m-b clearfix">
                <div class="clearfix m-b col-xs-4" >
                    <label for="agent"  class="col-xs-5 text-right form-control-label">{{$t('envelope.name')}}</label>
                    <div class="inline-form-control">
                        <input  class="form-control" v-model="envelope.name"  required>
                    </div>
                </div>
                <div class="clearfix m-b col-xs-4" >
                    <label for="agent"  class="col-xs-4 text-right form-control-label">{{$t('envelope.status')}}</label>
                    <div class="inline-form-control">
                        <select class="form-control w-sm c-select" v-model="envelope.status">
                            <option value="1">{{$t('status.active')}}</option>
                            <option value="0">{{$t('status.inactive')}}</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="box p-t m-b clearfix"  v-for="(group, index) in envelope.groups">
                <div class="clearfix">
                    <div class="col-xs-4 m-b">
                        <div class="clearfix m-b">
                            <label class="col-xs-5 text-right form-control-label">{{$t('envelope.deposit_threshold')}}</label>
                            <div class="inline-form-control">
                                <input type="number"  class="form-control" v-model="group.deposit_threshold"  >
                            </div>
                        </div>
                        <div class="clearfix m-b">
                            <label class="col-xs-5 text-right form-control-label">{{$t('envelope.bet_threshold')}}</label>
                            <div class="inline-form-control">
                                <input type="number"  class="form-control" v-model="group.bet_threshold" >
                            </div>
                        </div>
                        <div class="clearfix">
                            <label class="col-xs-5 text-right form-control-label">{{$t('envelope.envelope_count')}}</label>
                            <div class="inline-form-control">
                                <input type="number"  class="form-control" v-model="group.envelope_count"  required>
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-4 m-b">
                        <div class="clearfix  m-b">
                            <label for="agent" class="col-xs-4 text-right form-control-label">{{$t('envelope.member_level')}}</label>
                            <div class="inline-form-control">
                                <level :level="group.member_lvl" :index="index" required @level-choose="changeFromLevel"></level>
                            </div>
                        </div>
                        <div class="clearfix  m-b">
                            <label class="col-xs-4 text-right form-control-label">{{$t('envelope.select_envelope')}}</label>
                            <div class="inline-form-control">
                                <select class="form-control w-sm c-select" v-model="group.envelope" required>
                                    <option value="">{{$t('common.please_select')}}</option>
                                    <option v-for="envelope in envelopes" :value="envelope.id">{{envelope.name}}</option>
                                </select>
                            </div>
                        </div>
                        <div class="clearfix  m-b" >
                            <label for="agent"  class="col-xs-4 text-right form-control-label">{{$t('envelope.condition')}}</label>
                            <div class="inline-form-control">
                                <select class="form-control w-sm c-select" v-model="group.condition" required>
                                    <option value="0">{{$t('envelope.and')}}</option>
                                    <option value="1">{{$t('envelope.or')}}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-4">
                        <input type="button"  v-if="index === 0" class="md-btn grey-600 w-sm pull-right m-r" @click="addConfig()" value="新增一组"/>
                        <a v-if="index > 0" class="pull-right m-r" @click="deleteConfig(index)">{{$t('action.delete')}}</a>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-xs-12">
                    <div class="alert alert-danger" v-if="errorMsg">{{errorMsg}}</div>
                    <button type="submit" class="md-btn w-sm blue">{{$t('common.save')}}</button>
                    <span class="text-success m-l-md" v-show="updated">{{$t('common.saved_successfully')}}</span>
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
                    status: '1',
                    name: '',
                    groups: [{
                        member_lvl: '',
                        envelope: '',
                        deposit_threshold: '',
                        condition: '0',
                        bet_threshold: '',
                        envelope_count: ''
                    }]
                },
                envelopes: [],
                field_locales: {
                    'name': '红包名称有误：',
                    'member_lvl': '会员等级有误：',
                    'condition': '达成条件有误：',
                    'deposit_threshold': '存款金额有误：',
                    'bet_threshold': '下注金额有误：',
                    'envelope_count': '红包个数有误：',
                    'min_bonus': ' 红包金额有误：'
                },
                errorMsg: '',
                updated: false
            }
        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                let id = to.params.envelopeId
                if (id) {
                    vm.getEnvelopeGroup(id)
                }
            })
        },
        created () {
            this.getEnvelope()
        },
        methods: {
            deleteConfig (index) {
                this.envelope.groups.splice(index, 1)
            },
            addConfig () {
                this.envelope.groups.push({condition: '0'})
            },
            onSubmit (e) {
                if (this.envelope.id) {
                    this.$http.put(api.envelope_settings + this.envelope.id + '/', this.envelope).then(response => {
                        if (response.status === 200) {
                            this.$router.push('/envelope_settings')
                        }
                    }, response => {
                        this.errorMsg = ''
                        for (let field in this.field_locales) {
                            this.errorMsg += handleError(response, field, this.field_locales)
                        }
                    })
                } else {
                    this.$http.post(api.envelope_settings, this.envelope).then(response => {
                        if (response.status === 201) {
                            this.$router.push('/envelope_settings')
                        }
                    }, response => {
                        this.errorMsg = ''
                        for (let field in this.field_locales) {
                            this.errorMsg += handleError(response, field, this.field_locales)
                        }
                    })
                }
            },
            getEnvelopeGroup (id) {
                this.$http.get(api.envelope_settings + id + '/?opt_expand=group').then((response) => {
                    setTimeout(() => {
                        this.envelope = response.data
                    }, 500)
                })
            },
            getEnvelope () {
                this.$http.get(api.envelope + '?status=1').then((response) => {
                    this.envelopes = response.data
                })
            },
            changeFromLevel (val, index) {
                this.envelope.groups[index].member_lvl = val
            }
        },
        components: {
            level: require('../../components/level')
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
