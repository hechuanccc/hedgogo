<template>
    <div>
      <div class="m-b">
        <ol class="breadcrumb">
          <li class="active"><router-link to="/agent/applications">代理申请</router-link></li>
          <li class="active">{{$route.meta.title}}</li>
        </ol>
      </div>
      <div class="box" v-if="agent.status !== 1">
        <div class="box-body">
          <form class="form m-a" @submit.prevent="onSubmit">
            <div class="row b-b p-b m-b">
              <div class="col-md-5">
                <div class="form-group">
                  <label class="label-width">{{$t('user.username')}}</label>
                  <div class="inline-form-control">
                    <input
                      class="form-control"
                      placeholder="代理商帐号"
                      v-model="agent.username"
                      required
                      :disabled="agent.id"
                    />
                  </div>
                  <i class="fa fa-star t-red-500 m-l" v-if="!agent.id">必填</i>
                </div>

                <div class="form-group m-t-md">
                  <label class="label-width">{{$t('user.agent_level')}}</label>
                  <div class="inline-form-control">
                    <select
                      class="form-control c-select w-sm"
                      v-model.number="agent.level"
                      v-if="!agentLevelLoading && filteredAgentLevels.length"
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
                      {{ $t('system.no_record') }}
                    </span>
                  </div>
                </div>

                <div class="form-group">
                  <label class="label-width">{{$t('user.parent_agent')}}</label>
                  <select
                    class="form-control c-select w-sm"
                    v-model.number="agent.parent_agent"
                    v-if="filteredParentAgents.length && !agentLevelLoading"
                    required
                  >
                    <option value="">{{ $t('system.please_select') }}</option>
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
                    :placeholder="$t('system.no_record')"
                    disabled
                  />
                </div>
                <div class="form-group" v-if="agent.id">
                  <label class="label-width">{{$t('dic.status')}}</label>
                  <div class="inline-form-control">
                    <select class="form-control w-sm c-select" v-model="agent.status" :disabled="!$root.permissions.includes('review_agent_application')">
                      <option value="0">{{$t('status.rejected')}}</option>
                      <option value="1">{{$t('status.active')}}</option>
                      <option value="2">{{$t('status.inactive')}}</option>
                      <option value="3">{{$t('status.ongoing')}}</option>
                    </select>
                  </div>
                </div>
                <div class="form-group m-t-md">
                  <label class="label-width">{{$t('title.commission')}}</label>
                  <div class="inline-form-control">
                    <selector-commission
                      :commissionsetting="agent.commission_settings"
                      @myCommission="myCommission"
                      :required="true"
                      :show-status="true"
                    />
                  </div>
                </div>


                <div class="form-group m-t-md">
                  <label class="label-width">{{$t('user.default_member_level')}}</label>
                  <div class="inline-form-control">
                    <selector-member-level :level="agent.default_member_lv" @level-select="levelSelect" :req="false"/>
                  </div>
                </div>

                <div class="form-group" v-if="!agent.id">
                  <label class="label-width">{{$t('user.promo_code')}}</label>
                  <div class="inline-form-control">
                    <input class="form-control" type="number" name="realname" disabled v-model="agent.promo_code">
                  </div>
                </div>
                <div class="form-group">
                  <label  class="label-width">{{$t('user.domain')}}</label>
                  <div class="inline-form-control">
                    <input class="form-control input-lg" placeholder="1234567.com" v-model="agent.domain">
                  </div>
                </div>

                <h6 class="b-b p-b m-b m-t-md">{{$t('bank.bank_info')}}</h6>
                <div class="form-group">
                  <label class="label-width">{{$t('dic.bank')}}</label>
                  <selector-bank :bank="agent.bank.bank" :req="bankFilled" @bank-select="bank"/>
                </div>
                <div class="form-group">
                  <label class="label-width">{{$t('bank.province')}}</label>
                  <div class="inline-form-control">
                    <input class="form-control" v-model="agent.bank.province" :required="bankFilled">
                  </div>
                </div>
                <div class="form-group">
                  <label class="label-width">{{$t('bank.city')}}</label>
                  <div class="inline-form-control">
                    <input class="form-control" v-model="agent.bank.city" :required="bankFilled">
                  </div>
                </div>
                <div class="form-group">
                  <label class="label-width">{{$t('bank.account')}}</label>
                  <div class="inline-form-control">
                    <input class="form-control input-lg" type="number" placeholder="" v-model="agent.bank.account" :required="bankFilled">
                  </div>
                </div>
              </div>
              <div class="col-md-5 col-md-offset-1">

                <div class="form-group">
                  <label class="label-width">{{$t('user.real_name')}}</label>
                  <div class="inline-form-control">
                    <input class="form-control" name="realname" placeholder="比如：张三丰" v-model="agent.real_name">
                  </div>
                </div>

                <div class="form-group">
                  <label class="label-width">{{$t('user.gender')}}</label>
                  <div class="from-control inline-form-control">
                    <label class="md-check md-check-md">
                      <input type="radio" name="gender" value="M" v-model="agent.gender">
                      <i class="blue"></i>
                      {{$t('user.male')}}
                    </label>

                    <label class="md-check md-check-md m-l-lg" >
                      <input type="radio" name="gender" value="F" v-model="agent.gender">
                      <i class="blue"></i>
                      {{$t('user.female')}}
                    </label>
                  </div>
                </div>

                <div class="form-group">
                  <label class="label-width">{{$t('user.email')}}</label>
                  <div class="inline-form-control">
                    <input type="email" class="form-control" name="email" placeholder="比如：abc@example.com" v-model="agent.email">
                  </div>
                </div>

                <div class="form-group">
                  <label class="label-width">{{$t('user.birthday')}}</label>
                  <div class="inline-form-control">
                    <el-date-picker
                      style="width: 153px;"
                      v-model="agent.birthday"
                      type="date"
                      placeholder="请输入日期"
                      value-format="yyyy-MM-dd"
                    />
                  </div>
                </div>

                <div class="form-group">
                  <label class="label-width">{{$t('user.wechat')}}</label>
                  <div class="inline-form-control">
                    <input type="text" class="form-control" name="wechat" placeholder="比如：ABC234" v-model="agent.wechat">
                  </div>
                </div>
                <div class="form-group b-b p-b">
                  <label class="label-width">{{$t('user.qq')}}</label>
                  <div class="inline-form-control">
                    <input type="number" class="form-control" name="qq" placeholder="比如：453087589" v-model="agent.qq">
                  </div>
                </div>
                <div class="form-group" >
                  <label>{{$t('dic.memo')}}</label>
                  <textarea
                    class="form-control"
                    rows="4"
                    placeholder="仅供管理员记录会员信息，会员无法查看"
                    v-model="agent.memo"
                  />
                </div>
              </div>
            </div>
            <div>
              <div class="alert alert-danger" v-if="formError">
                <span>{{formError}}<br/> </span>
              </div>
              <button type="submit" class="md-btn w-sm blue">{{$t('dic.submit')}}</button>
            </div>
          </form>
        </div>
      </div>

      <div class="box" v-else>
        <div class="box-header b-b">
          <div class="alert alert-success" v-if="passwordChanged === 1">
            代理登录密码已修改为：
            <strong>{{newPassword}}</strong>
          </div>
          <div class="alert alert-error" v-if="passwordChanged === -1">
            {{errorMsg}}
          </div>
          <div class="row">
            <div class="col-xs-3">
              <h2><strong>{{agent.username}}</strong></h2>
              <span class="text-muted" v-if="agent.created_by">{{ agent.created_by }} 加盟</span>
            </div>
            <div class="col-xs-8 col-md-offset-1 text-right" v-if="agent.level.id > 3">
              <input v-show="false" v-model="today">
              <router-link class="md-btn md-flat m-r-sm" :to="'/report/game?agent=' + agent.username +'&category=&date_0='+ today +'&date_1='+ today">{{$t('misc.view_today_report')}}</router-link>
              <router-link class="md-btn md-flat m-r-sm" :to="'/bill/search?agent=' + agent.id">{{$t('misc.view_all_member_transactions')}}</router-link>
              <a class="md-btn md-flat m-r-sm" @click="resetPassword($event)">{{$t('user.reset_password')}}</a>
              <router-link class="md-btn md-flat m-r-sm" :to="'/agent/' + agent.id + '/edit'">{{$t('title.agent_edit')}}</router-link>
            </div>
          </div>
        </div>
        <div class="box-body">
          <div class="row m-b">
            <div class="col-xs-4">
              <span class="text-muted">{{$t('user.agent_level')}}</span>
              <div >{{agent.level.name}}</div>
            </div>
            <div class="col-xs-4">
              <span class="text-muted">{{$t('user.parent_agent')}}</span>
              <div>
                <router-link v-if="agent.parent_agent" :to="'/agent/' + agent.parent_agent.id">{{agent.parent_agent.name}}</router-link>
                <span class="text-muted" v-else>{{$t('user.no_parent_agent')}}</span>
              </div>
            </div>
          </div>
          <div class="row m-b">
            <div class="col-xs-4">
              <span class="text-muted">{{$t('dic.status')}} </span>
              <div>
                <span class="label success" v-if="agent.status==1" @click="toggleStatus">{{$t('status.active')}}</span>
                <span class="label" v-else  @click="toggleStatus">{{$t('status.inactive')}}</span>
                <a class="text-sm m-l" @click="toggleStatus" v-if="agent.status==1" >禁用</a>
                <a class="text-sm m-l" @click="toggleStatus" v-else >启用</a>
                <span class="text-success" v-show="statusUpdated">{{$t('system_msg.action_object_status', {
                  object: $t('dic.status'),
                  status: $t('status.updated')
                })}}</span>
              </div>
            </div>

            <div class="col-xs-4">
              <span class="text-muted">{{$t('user.member_count')}}</span>
              <div >
                <router-link :to="'/member?agent=' + agent.username">{{agent.member_count}}</router-link>
              </div>
            </div>

          </div>
          <div class="row p-b b-b">
            <div class="col-xs-4">
              <span class="text-muted">{{$t('title.commission')}}</span>
              <div>
                <router-link v-if="agent.commission_settings" :to="'/commission/' + agent.commission_settings.id + '/edit'">{{agent.commission_settings.name}}</router-link>
                <span class="label" v-else>未设定</span>
              </div>
            </div>
            <div class="col-xs-4">
              <span class="text-muted">{{$t('user.default_member_level')}}</span>
              <div>
                <router-link v-if="agent.default_member_lv" :to="'/level/' + agent.default_member_lv.id ">{{agent.default_member_lv.name}}</router-link>
                <span class="label" v-else>未设定</span>
              </div>
            </div>
          </div>
          <div class="row p-b b-b m-t">
            <div class="col-xs-4">
              <span class="text-muted">{{$t('user.promo_code')}}</span>
              <div >{{agent.promo_code}}</div>
            </div>
          </div>
          <div class="row m-b p-t p-b b-b">
            <div class="col-xs-4">
              <span class="text-muted">{{$t('title.basic_info')}}</span>
              <div  v-show="!showDetail">
                {{$t('user.real_name')}}：
                <span v-if="agent.real_name">{{agent.real_name}}</span>
                <span class="label" v-else>未填写</span>，{{$t('user.phone')}}：
                <span v-if="agent.phone">{{agent.phone}}</span>
                <span class="label" v-else>未填写</span>
              </div>

              <div class="p-a grey-50 lh-md m-t-sm label-width-eq">
                <div>
                  <span class="text-muted title">{{$t('user.real_name')}}</span>
                  <span v-if="agent.real_name">{{agent.real_name}}</span>
                  <span v-else class="text-muted">未填写</span>
                </div>
                <div>
                  <span class="text-muted title">{{$t('user.phone')}}</span>
                  <span v-if="agent.phone">{{agent.phone}}</span>
                  <span v-else class="text-muted">未填写</span>
                </div>
                <div>
                  <span class="text-muted title">{{$t('user.gender')}}</span>
                  <span v-if="agent.gender">{{agent.gender}}</span>
                  <span v-else class="text-muted">未填写</span>
                </div>
                <div>
                  <span class="text-muted title">{{$t('user.email')}}</span>
                  <span v-if="agent.email">{{agent.email}}</span>
                  <span v-else class="text-muted">未填写</span>
                </div>
                <div>
                  <span class="text-muted title">{{$t('user.birthday')}}</span>
                  <span v-if="agent.birthday">{{agent.birthday}}</span>
                  <span v-else class="text-muted">未填写</span>
                </div>
                <div>
                  <span class="text-muted title">{{$t('user.wechat')}}</span>
                  <span v-if="agent.wechat">{{agent.wechat}}</span>
                  <span v-else class="text-muted">未填写</span>
                </div>
                <div>
                  <span class="text-muted title">QQ</span>
                  <span v-if="agent.qq">{{agent.qq}}</span>
                  <span v-else class="text-muted">未填写</span>
                </div>
              </div>
            </div>
            <div class="col-xs-4">
              <a @click="showDetail = !showDetail">
                <span v-if="showDetail">{{$t('misc.close_detail_info')}}</span>
                <span v-else>{{$t('misc.view_detail_info')}}</span>
              </a>
            </div>
          </div>

          <div class="row m-b b-b p-b">
            <div class="col-xs-4">
              <span class="text-muted">{{$t('bank.bank_info')}}</span>
              <div v-if="!agent.bank">
                <span class="label" >尚未建立</span>
              </div>
              <div class="p-a grey-50 lh-md m-t-sm label-width-eq" v-else>
                <div>
                  <span class="text-muted title">{{$t('dic.bank')}}</span>
                  <span>{{agent.bank.bank.name}}</span>
                </div>
                <div>
                  <span class="text-muted title">{{$t('bank.province')}}</span>
                  <span>{{agent.bank.province}}</span>
                </div>
                <div>
                  <span class="text-muted title">{{$t('bank.city')}}</span>
                  <span>{{agent.bank.city}}</span>
                </div>
                <div>
                  <span class="text-muted title">{{$t('bank.account')}}</span>
                  <span>{{agent.bank.account}}</span>
                </div>
              </div>
            </div>
            <div class="col-xs-4">
              <router-link :to="'/agent/' + agent.id + '/edit'" v-if="!agent.bank">建立银行资讯</router-link>
              <router-link :to="'/agent/' + agent.id + '/edit'" v-else>编辑银行资讯</router-link>
            </div>
          </div>

          <div class="row">
            <div class="col-xs-4">
              <span class="text-muted">{{$t('dic.memo')}}</span>
              <div  v-if="agent.memo">{{agent.memo}}</div>
              <div class="text-muted" v-else>{{$t('dic.no_memo')}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
import VueTypeahead from 'vue-typeahead'
import { getUser, updateUser, getSetting } from '../../service'
import SelectorBank from '../../components/SelectorBank'
import SelectorMemberLevel from '../../components/SelectorMemberLevel'
import SelectorCommission from '../../components/SelectorCommission'

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
            formError: '',
            levels: [],
            agent: {
                id: '',
                level: 4,
                username: '',
                promo_code: '',
                parent_agent: 3,
                commission_settings: '',
                default_member_lv: 1,
                real_name: '',
                phone: '',
                birthday: '',
                wechat: '',
                gender: '',
                email: '',
                memo: '',
                bank: {},
                password: '123456'
            },
            agentLevels: [],
            done: false,
            hasAgentParent: false,
            today: '',
            agentLevelLoading: true
        }
    },
    watch: {
        'agent.level' (newObj, old) {
            if (parseInt(newObj) !== parseInt(old) && this.filteredParentAgents.length && !this.filteredParentAgents.find(a => a.id === this.agent.parent_agent)) {
                this.agent.parent_agent = ''
            }
        }
    },
    computed: {
        bankFilled () {
            let bankinfo = this.agent.bank
            return bankinfo.bank || bankinfo.province || bankinfo.id || bankinfo.account
        },
        parentLevel () {
            let level = parseInt(this.agent.level) - parseInt(1)
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
            return this.agentLevels.filter(l => l.level !== 1)
        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            let id = to.params.agentId
            if (id) {
                vm.getAgent(id)
            }
            if (!vm.agent.parent_agent_name) {
                vm.hasAgentParent = true
            }
            vm.getAgentLevels()
        })
    },
    methods: {
        levelSelect (level) {
            this.agent.default_member_lv = level
            if (level === '1') {
                  // reset agent validation and parent_agent query input
                this.agentValid = ''
                this.query = ''
                  // this.hasAgentParent = false
            }
        },
        myCommission (val) {
            this.agent.commission_settings = val
        },
        bank (val) {
            this.agent.bank.bank = val
        },
        onSubmit (e) {
            let agent = Object.assign({}, this.agent)

            if (!agent.bank.bank) {
                this.$delete(agent, 'bank')
            }
            if (!agent.default_member_lv) {
                agent.default_member_lv = 2
            }
            if (!agent.parent_agent && parseInt(agent.level) !== 1) {
                this.formError = '请选择正确的上线'
                return
            } else {
                this.formError = ''
            }

            Object.keys(agent).forEach(k => {
                !agent[k] && (delete agent[k])
            })

            updateUser('agentApplication', {
                id: agent.id,
                data: agent
            }, {
                action: this.$t('dic.update'),
                object: this.$t('title.agent_application')
            }).then(() => {
                this.$router.push('/agent/applications/')
            }, () => {})
        },
        getAgent (id) {
            getUser('agentApplication', {
                id,
                params: {
                    opt_expand: 'detail'
                }
            }).then(data => {
                if (!data.bank) {
                    data.bank = {
                        bank: ''
                    }
                }
                Object.assign(this.agent, data)
                if (this.agent.birthday === null) {
                    this.agent.birthday = ''
                }
                if (this.agent.commission_settings === null) {
                    this.agent.commission_settings = ''
                }
                if (this.agent.default_member_lv === null) {
                    this.agent.default_member_lv = ''
                }
                // for nested objects parent_agent, level... we get json object from api, need to
                // transfer to plain string
                if (data.level) {
                    this.agent.level = parseInt(data.level)
                }
                if (data.parent_agent) {
                    this.agent.parent_agent = parseInt(data.parent_agent.id)
                    this.agent.parent_agent_name = data.parent_agent.name
                }
            })
        },
        getAgentLevels () {
            getSetting('agentLevel').then(data => {
                this.agentLevels = data
                this.agentLevelLoading = false
            })
        },
        agentLevelSelect (val) {
            this.agent.level = val
        },
        // for agent field typeahead
        prepareResponseData (data) {
            return data
        }
    },
    components: {
        SelectorBank,
        SelectorMemberLevel,
        SelectorCommission
    }
}
</script>
