<template>
    <div>
      <div class="m-b">
        <ol class="breadcrumb">
          <li class="active"><router-link to="/agent">{{$t('common.agent')}}</router-link></li>
          <li class="active">{{$route.meta.title}}</li>
        </ol>
      </div>
      <div class="box">
        <div class="box-header b-b">
          <h3>{{$t('common.attention')}}</h3>
          <small>{{$t('common.default_agent_password')}}：123456</small>
        </div>
        <div class="box-body">
          <form class="form m-a" v-on:submit.prevent="onSubmit">
            <div class="row b-b p-b m-b">
              <div class="col-md-6">
                <div class="form-group">
                  <label for="username" class="label-width">{{$t('agent.account')}} </label>
                  <div class="inline-form-control">
                    <input class="form-control" placeholder="代理商帐号" v-model="agent.username" required :disabled="agent.id!=''" >
                  </div>
                  <i class="fa fa-star t-red-500 m-l" v-if="!agent.id">必填</i>
                </div>

                <div class="form-group m-t-md">
                  <label for="agent" class="label-width">{{$t('agent.level')}}</label>
                  <div class="inline-form-control">
                    <select
                      class="form-control c-select w-sm"
                      v-model.number="agent.level"
                      v-if="!agentLevelLoading && filteredAgentLevels.length"
                      :disabled="$route.name === 'agent-edit'"
                      required
                    >
                      <option
                        class="form-control"
                        :value="l.id"
                        v-for="(l, i) in filteredAgentLevels"
                        :key="i"
                      >{{ l.name }}
                      </option>
                    </select>
                    <span
                      class="p-b-xs p-t-sm form-control w-sm"
                      v-else-if="agentLevelLoading"
                    >
                      <i class="fa fa-spin fa-spinner"></i>
                    </span>
                    <span
                      class="p-b-xs p-t-sm form-control w-sm"
                      v-else-if="!filteredAgentLevels.length"
                    >
                      {{ $t('common.no_record') }}
                    </span>
                  </div>
                </div>

                <div class="form-group">
                  <label for="agent"  class="label-width">{{$t('agent.parent_agent')}} </label>
                  <div class="inline-form-control">
                    <select
                        class="form-control c-select w-sm"
                        v-model.number="agent.parent_agent"
                        v-if="filteredParentAgents.length && agent.level !== 1"
                        required
                    >
                        <option value="">{{ $t('common.please_select') }}</option>
                        <option
                            class="form-control"
                            :value="pa.id"
                            v-for="(pa, i) in filteredParentAgents"
                            :key="i"
                        >{{ pa.username }}
                        </option>
                    </select>
                    <span
                        class="p-b-xs p-t-sm form-control w-sm inline"
                        v-else-if="agentLevelLoading"
                    >
                        <i class="fa fa-spin fa-spinner"></i>
                    </span>
                    <input
                        class="p-b-xs p-t-sm form-control w-sm inline"
                        v-else-if="!filteredParentAgents.length"
                        :placeholder="$t('common.no_record')"
                        disabled
                    />
                  </div>
                </div>
                <div class="form-group" v-if="agent.id!=''">
                  <label for="agent"  class="label-width">{{$t('common.status')}}</label>
                  <div class="inline-form-control">
                    <select class="form-control w-sm c-select" v-model="agent.status" :disabled="!updateAgentPermission('status')">
                      <option value="1">{{$t('status.active')}}</option>
                      <option value="0">{{$t('status.disabled')}}</option>
                    </select>
                  </div>
                </div>
                <div class="form-group m-t-md">
                  <label for="agent" class="label-width">{{$t('agent.commission_setting')}} </label>
                  <div class="inline-form-control">
                    <selector-commission :commissionsetting="agent.commission_settings" @myCommission="myCommission" :required="true" :disabled="!updateAgentPermission('settings')"/>
                  </div>
                </div>


                <div class="form-group m-t-md">
                  <label for="agent" class="label-width">{{$t('agent.dft_member_lv')}}</label>
                  <div class="inline-form-control">
                    <selector-member-level :level="agent.default_member_lv" @level-select="levelSelect" :req="false" :disabled="!updateAgentPermission('settings')"/>
                  </div>
                </div>

                <div class="form-group">
                  <label for="wechat" class="label-width">{{$t('common.wechat')}}</label>
                  <div class="inline-form-control">
                    <input type="text" class="form-control" name="wechat" placeholder="比如：ABC234" v-model="agent.wechat" :disabled="!updateAgentPermission('details')">
                  </div>
                </div>
                <div class="form-group">
                  <label for="qq" class="label-width">{{$t('common.qq')}}</label>
                  <div class="inline-form-control">
                    <input type="number" class="form-control" name="qq" placeholder="比如：453087589" v-model="agent.qq" :disabled="!updateAgentPermission('details')">
                  </div>
                </div>
                <div class="form-group" v-if="agent.id!=''">
                  <label for="realname"  class="label-width">{{$t('agent.promo_code')}}</label>
                  <div class="inline-form-control">
                    <input class="form-control" type="number" disabled  name="realname"  v-model="agent.promo_code">
                  </div>
                </div>
                <div class="form-group">
                  <label for="realname"  class="label-width">{{$t('agent.domain')}}</label>
                  <div class="inline-form-control">
                    <input class="form-control input-lg" placeholder="123.com, abc.com" v-model="agent.domain" :disabled="!updateAgentPermission('settings')">
                  </div>
                  <label class="t-red"> {{$t('agent.domain_label')}}</label>
                </div>
                <div class="form-group" >
                  <label for="phone" class="label-width">{{$t('common.phone')}}</label>
                  <div class="inline-form-control">
                    <input class="form-control" type="number"  name="agent" placeholder="比如：13856789876" v-model="agent.phone" :disabled="!updateAgentPermission('name_phone_mail')">
                  </div>
                </div>
              </div>
              <div class="col-md-6">

                <div class="form-group">
                  <label for="realname"  class="label-width">{{$t('common.real_name')}}</label>
                  <div class="inline-form-control">
                    <input class="form-control" name="realname" placeholder="比如：张三丰" v-model="agent.real_name" :disabled="!updateAgentPermission('name_phone_mail')">
                  </div>
                </div>

                <div class="form-group">
                  <label for="agent" class="label-width">{{$t('common.gender')}}</label>
                  <div class="from-control inline-form-control">
                    <label class="md-check md-check-md">
                      <input type="radio" name="gender" value="M" v-model="agent.gender" :disabled="!updateAgentPermission('details')">
                      <i class="blue"></i>
                      {{$t('common.male')}}
                    </label>

                    <label class="md-check md-check-md m-l-lg" >
                      <input type="radio" name="gender" value="F" v-model="agent.gender" :disabled="!updateAgentPermission('details')">
                      <i class="blue"></i>
                      {{$t('common.female')}}
                    </label>
                  </div>
                </div>

                <div class="form-group">
                  <label for="email" class="label-width">{{$t('common.email')}}</label>
                  <div class="inline-form-control">
                    <input type="email" class="form-control" name="email" placeholder="比如：abc@example.com" v-model="agent.email" :disabled="!updateAgentPermission('name_phone_mail')">
                  </div>
                </div>

                <div class="form-group">
                  <label for="birthday" class="label-width">{{$t('common.birthday')}}</label>
                  <div class="inline-form-control" v-if="updateAgentPermission('details')">
                    <date-picker width='153' v-model="agent.birthday"></date-picker>
                  </div>
                  <div class="inline-form-control" v-else>
                      <input type="text" class="form-control" placeholder="请选择日期" v-model="agent.birthday" disabled>
                  </div>
                </div>

                <h6 class="b-b p-b m-b m-t-lg">{{$t('bank.bank_title')}}</h6>
                <div class="form-group">
                  <label for="realname" class="label-width">{{$t('bank.name')}}</label>
                  <selector-bank
                    :bank="agent.bank.bank"
                    :req="bankFilled"
                    @bank-select="bankSelect"
                    :disabled="!updateAgentPermission('bank')"
                />
                </div>
                <div class="form-group">
                  <label for="realname" class="label-width">{{$t('bank.province')}}</label>
                  <div class="inline-form-control">
                    <input
                        class="form-control"
                        v-model="agent.bank.province"
                        :disabled="!updateAgentPermission('bank')"
                        :required="bankFilled"
                    />
                  </div>
                </div>
                <div class="form-group">
                  <label for="realname" class="label-width">{{$t('bank.city')}}</label>
                  <div class="inline-form-control">
                    <input
                        class="form-control"
                        v-model="agent.bank.city"
                        :disabled="!updateAgentPermission('bank')"
                        :required="bankFilled"
                    />
                  </div>
                </div>
                <div class="form-group">
                  <label for="realname"  class="label-width">{{$t('bank.account')}}</label>
                  <div class="inline-form-control">
                    <input
                        class="form-control input-lg"
                        type="number"
                        v-model="agent.bank.account"
                        :disabled="!updateAgentPermission('bank')"
                        :required="bankFilled"
                    />
                  </div>
                </div>

                <div class="form-group" >
                  <label for="memo">{{$t('common.memo')}}</label>
                  <textarea class="form-control" rows="3" placeholder="仅供管理员记录会员信息，会员无法查看" v-model="agent.memo" :disabled="!updateAgentPermission('details')"></textarea>
                </div>
              </div>

            </div>
            <div>
              <div class="alert alert-danger" v-if="errorMsg">
                <span>{{ errorMsg }}</span>
              </div>
              <div class="alert alert-success" v-if="statusUpdated">{{$t('agent.status_update')}}</div>
              <button type="submit" class="md-btn blue w-sm" >{{$t('common.save')}}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
</template>
<script>
import VueTypeahead from 'vue-typeahead'
import DatePicker from 'vue2-datepicker'
import Vue from 'vue'
import api from '../../api'
import $ from '../../utils/util'
import SelectorBank from '../../components/SelectorBank'
import SelectorMemberLevel from '../../components/SelectorMemberLevel'
import SelectorCommission from '../../components/SelectorCommission'

const format = 'YYYY-MM-DD'
export default {
    extends: VueTypeahead,
    data () {
        return {
            agentValid: '',
            data: {
                opt_fields: 'username,id'
            },
            limit: 5,
            minChars: 1,
            query: '',
            errorMsg: '',
            birthdayFormat: '',
            agent: {
                id: '',
                level: 4,
                username: '',
                promo_code: '',
                parent_agent: 3,
                parent_agent_name: 'gagent',
                commission_settings: '',
                default_member_lv: 1,
                real_name: '',
                phone: '',
                birthday: '',
                wechat: '',
                gender: '',
                email: '',
                memo: '',
                bank: {
                    bank: '',
                    province: ''
                },
                domain: '',
                password: '123456'
            },
            initAgent: {},
            done: false,
            statusUpdated: false,
            agentLevelLoading: true,
            agentLevels: []
        }
    },
    computed: {
        bankFilled () {
            let bankinfo = this.agent.bank
            return bankinfo.bank || bankinfo.province || bankinfo.id || bankinfo.account
        },
        src () {
            return api.agent + '?opt_fields=username,id,&username_q=' + this.query + '&level=' + this.parentLevel
        },
        parentLevel () {
            let level = this.agent.level - 1
            level = level <= 0 ? 1 : level
            return level
        },
        filteredParentAgents () {
            if (this.agent.level && this.agent.level === 1 && this.agentLevels.legnth) {
                return []
            } else {
                let level = this.agentLevels.find(a => a.level === this.agent.level - 1)
                if (level && level.agents) {
                    return level.agents
                } else {
                    return []
                }
            }
        },
        filteredAgentLevels () {
            return this.agentLevels.filter(l => this.agent.level === l.level || l.level !== 1)
        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            if (vm.agent.username === '') {
                vm.initAgent = Object.assign(vm.initAgent, vm.agent)
            } else {
                vm.agent = vm.initAgent
            }
            let id = to.params.agentId
            if (id) {
                vm.getAgent(id)
            }
            vm.getAgentLevels()
        })
    },
    watch: {
        '$route' (to, from) {
            let _this = this
            this.queryset = []
            setTimeout(() => {
                if (_this.agent.username === '') {
                    _this.initAgent = Object.assign(_this.initAgent, _this.agent)
                } else {
                    _this.agent = _this.initAgent
                }
                let id = to.params.agentId
                if (id) {
                    _this.getAgent(id)
                }
            }, 100)
        },
        'agent.birthday' (newObj, old) {
            if (newObj) {
                this.agent.birthday = Vue.moment(this.agent.birthday).format(format)
            }
        },
        'agent.level' (newObj, old) {
            if (parseInt(newObj) !== parseInt(old) && this.filteredParentAgents.length && !this.filteredParentAgents.find(a => a.id === this.agent.parent_agent)) {
                this.agent.parent_agent = ''
            }
        }
    },
    methods: {
        updateAgentPermission (field) {
            return this.$route.name === 'agent-edit' ? this.$root.permissions.includes(`update_agent_${field}`) : this.$root.permissions.includes('add_new_agent')
        },
        bankSelect (bank) {
            this.agent.bank.bank = bank
        },
        levelSelect (val) {
            this.agent.default_member_lv = val
        },
        agentLevel (val) {
            this.agent.level = val
            if (val === '1') {
                    // reset agent validation and parent_agent query input
                this.agentValid = ''
                this.query = ''
            }
        },
        myCommission (val) {
            this.agent.commission_settings = val
        },
        onSubmit (e) {
            if (!this.agent.parent_agent && parseInt(this.agent.level) !== 1) {
                this.errorMsg = '请选择正确的上线'
                return
            } else {
                this.errorMsg = ''
            }
            this.initAgent = Object.assign({}, this.initAgent, this.agent)
            if (!this.initAgent.bank.bank) {
                this.$delete(this.initAgent, 'bank')
            }
            if (!this.initAgent.default_member_lv) {
                this.initAgent.default_member_lv = 2
            }
            if (!this.initAgent.domain) {
                this.$delete(this.initAgent, 'domain')
            }
            if (this.agent.id) {
                this.$http.put(api.agent + this.agent.id + '/', this.initAgent).then(data => {
                    this.statusUpdated = true
                    setTimeout(() => {
                        this.$router.push('/agent/' + data.id)
                    }, 2000)
                }, error => {
                    this.errorMsg = error
                })
            } else {
                this.$http.post(api.agent, this.initAgent).then(data => {
                    this.statusUpdated = true
                    setTimeout(() => {
                        this.$router.push('/agent/' + data.id)
                    }, 2000)
                }, error => {
                    this.errorMsg = error
                })
            }
        },
        checkAgent () {
            if (this.query !== '') {
                this.$http.get(api.agent + '?opt_fields=username,id&username=' + this.query + '&level=' + this.parentLevel).then(data => {
                    if (data.length === 1) {
                        this.agentValid = true
                        this.agent.parent_agent = data[0].id
                    } else {
                        this.agentValid = false
                        this.agent.parent_agent = ''
                    }
                })
            } else {
                this.agentValid = false
                this.agent.parent_agent = ''
            }
        },
        getAgent (id) {
            this.$http.get(api.agent + id + '/?opt_expand=parent_agent').then(data => {
                if (!data.bank) {
                    data.bank = {bank: '', province: ''}
                }
                this.agent = data
                if (this.agent.birthday === null) {
                    this.agent.birthday = ''
                }
                // for nested objects parent_agent, level... we get json object from api, need to
                // transfer to plain string
                if (data.parent_agent) {
                    this.agent.parent_agent_name = data.parent_agent.name
                    this.agent.parent_agent = data.parent_agent.id
                }
                // this.commission_settings = data.commission_settings.id
            })
        },
        getAgentLevels () {
            this.$http.get(api.agent_level).then(data => {
                this.agentLevels = data
                this.agentLevelLoading = false
            }, error => {
                $.notify({
                    message: error,
                    type: 'danger'
                })
            })
        },
        reset () {
            this.checkAgent()
        },
        // for agent field typeahead
        onHit (item) {
            this.items = []
            this.query = item.username
            this.checkAgent()
        },
        // for agent field typeahead
        prepareResponseData (data) {
            return data
        }
    },
    components: {
        DatePicker,
        SelectorBank,
        SelectorMemberLevel,
        SelectorCommission
    }
}
</script>
<style scoped>
.input-lg{
    width: 180px;
}
</style>
