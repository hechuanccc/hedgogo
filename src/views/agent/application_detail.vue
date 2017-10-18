<template>
    <div>
      <div class="m-b">
        <ol class="breadcrumb">
          <li class="active"><router-link to="/agent/applications">代理申请</router-link></li>
          <li class="active">{{$route.meta.title}}</li>
        </ol>
      </div>
      <div class="alert alert-danger" v-if="!$root.permissions.includes('audit_agent_application')">{{$t('common.errorPermission')}}</div>
      <div class="box" v-if="agent.status !== 1">
        <div class="box-header b-b">
          <h3>注意：</h3>
          <small >代理商登录密码预设：123456</small>
        </div>
        <div class="box-body">
          <form class="form m-a" v-on:submit.prevent="onSubmit">
            <div class="row b-b p-b m-b">
              <div class="col-md-6">
                <div class="form-group">
                  <label class="label-width">{{$t('common.username')}}</label>
                  <div class="inline-form-control">
                    <input class="form-control" placeholder="代理商账号" v-model="agent.username" required :disabled="agent.id!=''" >
                  </div>
                  <i class="fa fa-star t-red-500 m-l" v-if="!agent.id">必填</i>
                </div>

                <div class="form-group m-t-md">
                  <label class="label-width">{{$t('agent.level')}}</label>
                  <div class="inline-form-control">
                    <agentlevel :default="4" disabled></agentlevel>
                  </div>
                </div>

                <div class="form-group">
                  <label class="label-width">{{$t('agent.parent_agent')}}</label>
                  <div class="inline-form-control dropdown" :class="{'open': hasItems}">
                    <input v-if="!hasAgentParent" class="form-control" type="text"
                           :placeholder="agent.level === 1 ? '大股东无需填写' : '代理商账号'"
                           :disabled="!agent.level"
                           autocomplete="on"
                           v-model="query"
                           @keydown.down="down"
                           @keydown.up="up"
                           @keydown.enter="hit"
                           @keydown.esc="reset"
                           @blur="checkAgent"
                           @input="update" />
                    <input class="form-control" type="text" v-else v-model="agent.parent_agent_name" disabled>
                    <div class="dropdown-menu" >
                      <a v-for="item in items" class="dropdown-item" :class="activeClass($index)" @click="hit" @mousemove="setActive($index)">
                        <span v-text="item.username"></span>
                      </a>
                    </div>
                  </div>
                  <span class="text-danger v-m m-l-sm" v-show="agentValid === false">&times;无此代理</span>
                  <span class="text-success fa fa-check v-m m-l-sm" v-show="agentValid"></span>
                </div>
                <div class="form-group" v-if="agent.id!=''">
                  <label class="label-width">{{$t('common.status')}}</label>
                  <div class="inline-form-control">
                    <select class="form-control w-sm c-select" v-model="agent.status">
                      <option value="0">{{$t('status.rejected')}}</option>
                      <option value="1">{{$t('status.active')}}</option>
                      <option value="2">{{$t('status.inactive')}}</option>
                      <option value="3">{{$t('status.ongoing')}}</option>
                    </select>
                  </div>
                </div>
                <div class="form-group m-t-md">
                  <label class="label-width">{{$t('agent.commission_setting')}}</label>
                  <div class="inline-form-control">
                    <commissionsetting :commissionsetting="agent.commission_settings" @myCommission="myCommission"></commissionsetting>
                  </div>
                </div>


                <div class="form-group m-t-md">
                  <label class="label-width">{{$t('agent.dft_member_lv')}}</label>
                  <div class="inline-form-control">

                    <level :level="agent.default_member_lv" @level-select="levelSelect"></level>
                  </div>
                </div>

                <div class="form-group p-b-md m-t-md">
                  <label class="label-width">{{$t('agent.dft_return_setting')}}</label>
                  <div class="inline-form-control">
                    <returnsetting :returnsetting="agent.default_return_settings" @myReturn="myReturn"></returnsetting>
                  </div>
                </div>
                <div class="form-group">
                  <label class="label-width">{{$t('common.wechat')}}</label>
                  <div class="inline-form-control">
                    <input type="text" class="form-control" name="wechat" placeholder="比如：ABC234" v-model="agent.wechat">
                  </div>
                </div>
                <div class="form-group">
                  <label class="label-width">{{$t('common.qq')}}</label>
                  <div class="inline-form-control">
                    <input type="number" class="form-control" name="qq" placeholder="比如：453087589" v-model="agent.qq">
                  </div>
                </div>
                <div class="form-group" v-if="!agent.id">
                  <label class="label-width">{{$t('agent.promo_code')}}</label>
                  <div class="inline-form-control">
                    <input class="form-control" type="number"  name="realname" disabled v-model="agent.promo_code">
                  </div>
                </div>
                <div class="form-group">
                  <label  class="label-width">{{$t('agent.domain')}}</label>
                  <div class="inline-form-control">
                    <input class="form-control input-lg" placeholder="1234567.com" v-model="agent.domain" >
                  </div>
                </div>
                <div class="form-group" >
                  <label class="label-width">{{$t('common.phone')}}</label>
                  <div class="inline-form-control">
                    <input class="form-control" type="number" name="agent" placeholder="比如：13856789876" v-model="agent.phone">
                  </div>
                </div>
              </div>
              <div class="col-md-6">

                <div class="form-group">
                  <label class="label-width">{{$t('common.real_name')}}</label>
                  <div class="inline-form-control">
                    <input class="form-control" name="realname" placeholder="比如：张三丰" v-model="agent.real_name">
                  </div>
                </div>

                <div class="form-group">
                  <label class="label-width">{{$t('common.gender')}}</label>
                  <div class="from-control inline-form-control">
                    <label class="md-check md-check-md">
                      <input type="radio" name="gender" value="M" v-model="agent.gender">
                      <i class="blue"></i>
                      {{$t('common.male')}}
                    </label>

                    <label class="md-check md-check-md m-l-lg" >
                      <input type="radio" name="gender" value="F" v-model="agent.gender">
                      <i class="blue"></i>
                      {{$t('common.female')}}
                    </label>
                  </div>
                </div>

                <div class="form-group">
                  <label class="label-width">{{$t('common.email')}}</label>
                  <div class="inline-form-control">
                    <input type="email" class="form-control" name="email" placeholder="比如：abc@example.com" v-model="agent.email">
                  </div>
                </div>

                <div class="form-group">
                  <label class="label-width">{{$t('common.birthday')}}</label>
                  <div class="inline-form-control">
                    <date-picker width='153' v-model="agent.birthday"></date-picker>
                  </div>
                </div>

                <h6 class="b-b p-b m-b m-t-lg">{{$t('bank.bank_title')}}</h6>
                <div class="form-group">
                  <label class="label-width">{{$t('bank.name')}}</label>
                  <bank :bank="agent.bank.bank" :req="bankFilled" @bank-select="bank"></bank>
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
                <div class="form-group" >
                  <label>{{$t('common.memo')}}</label>
                  <textarea class="form-control" rows="3" placeholder="仅供管理员记录会员信息，会员无法查看" v-model="agent.memo"></textarea>
                </div>
              </div>

            </div>
            <div>
              <div class="alert alert-danger" v-if="formError">{{formError}}</div>
              <button :disabled="!$root.permissions.includes('audit_agent_application')" type="submit" class="md-btn w-sm blue">{{$t('common.save')}}</button>
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
              <input v-show="false" v-model="today" :value="new Date() | moment('YYYY-MM-DD')">
              <router-link class="md-btn md-flat m-r-sm" :to="'/report/game?agent=' + agent.username +'&category=&date_0='+ today +'&date_1='+ today">{{$t('action.view_today_report')}}</router-link>
              <router-link class="md-btn md-flat m-r-sm" :to="'/bill/search?agent=' + agent.id">{{$t('action.view_member_record')}}</router-link>
              <a class="md-btn md-flat m-r-sm" @click="resetPassword($event)">{{$t('action.reset_password')}}</a>
              <router-link class="md-btn md-flat m-r-sm" :to="'/agent/' + agent.id + '/edit'">{{$t('action.update_agent')}}</router-link>
            </div>
          </div>
        </div>
        <div class="box-body">
          <div class="row m-b">
            <div class="col-xs-4">
              <span class="text-muted">{{$t('agent.level')}}</span>
              <div >{{agent.level.name}}</div>
            </div>
            <div class="col-xs-4">
              <span class="text-muted">{{$t('agent.parent_agent')}}</span>
              <div>
                <router-link v-if="agent.parent_agent" :to="'/agent/' + agent.parent_agent.id">{{agent.parent_agent.name}}</router-link>
                <span class="text-muted" v-else>{{$t('agent.no_parent')}}</span>
              </div>
            </div>
          </div>
          <div class="row m-b">
            <div class="col-xs-4">
              <span class="text-muted">{{$t('common.status')}} </span>
              <div>
                <span class="label success" v-if="agent.status==1" @click="toggleStatus">{{$t('status.active')}}</span>
                <span class="label" v-else  @click="toggleStatus">{{$t('status.inactive')}}</span>
                <a class="text-sm m-l" @click="toggleStatus" v-if="agent.status==1" >禁用</a>
                <a class="text-sm m-l" @click="toggleStatus" v-else >启用</a>
                <span class="text-success" v-show="statusUpdated">{{$t('common.status_updated')}}</span>
              </div>
            </div>

            <div class="col-xs-4">
              <span class="text-muted">{{$t('agent.member_count')}}</span>
              <div >
                <router-link :to="'/member?agent=' + agent.username">{{agent.member_count}}</router-link>
              </div>
            </div>

          </div>
          <div class="row p-b b-b">
            <div class="col-xs-4">
              <span class="text-muted">{{$t('agent.commission_setting')}}</span>
              <div>
                <router-link v-if="agent.commission_settings" :to="'/commission/' + agent.commission_settings.id + '/edit'">{{agent.commission_settings.name}}</router-link>
                <span class="label" v-else>未设定</span>
              </div>
            </div>
            <div class="col-xs-4">
              <span class="text-muted">{{$t('agent.dft_member_lv')}}</span>
              <div>
                <router-link v-if="agent.default_member_lv" :to="'/level/' + agent.default_member_lv.id ">{{agent.default_member_lv.name}}</router-link>
                <span class="label" v-else>未设定</span>
              </div>
            </div>
          </div>
          <div class="row p-b b-b m-t">
            <div class="col-xs-4">
              <span class="text-muted">{{$t('agent.promo_code')}}</span>
              <div >{{agent.promo_code}}</div>
            </div>
            <div class="col-xs-4">
              <span class="text-muted">{{$t('agent.dft_return_setting')}}</span>
              <div>
                <router-link v-if="agent.default_return_settings" :to="'/return/' + agent.default_return_settings.id + '/edit'">{{agent.default_return_settings.name}}</router-link>
                <span class="label" v-else>未设定</span>
              </div>
            </div>
          </div>
          <div class="row m-b p-t p-b b-b">
            <div class="col-xs-4">
              <span class="text-muted">{{$t('common.basic_info')}}</span>
              <div  v-show="!showDetail">
                {{$t('common.real_name')}}：
                <span v-if="agent.real_name">{{agent.real_name}}</span>
                <span class="label" v-else>未填写</span>，{{$t('common.phone')}}：
                <span v-if="agent.phone">{{agent.phone}}</span>
                <span class="label" v-else>未填写</span>
              </div>

              <div class="p-a grey-50 lh-md m-t-sm label-width-eq">
                <div>
                  <span class="text-muted title">{{$t('common.real_name')}}</span>
                  <span v-if="agent.real_name">{{agent.real_name}}</span>
                  <span v-else class="text-muted">未填写</span>
                </div>
                <div>
                  <span class="text-muted title">{{$t('common.phone')}}</span>
                  <span v-if="agent.phone">{{agent.phone}}</span>
                  <span v-else class="text-muted">未填写</span>
                </div>
                <div>
                  <span class="text-muted title">{{$t('common.gender')}}</span>
                  <span v-if="agent.gender">{{agent.gender}}</span>
                  <span v-else class="text-muted">未填写</span>
                </div>
                <div>
                  <span class="text-muted title">{{$t('common.email')}}</span>
                  <span v-if="agent.email">{{agent.email}}</span>
                  <span v-else class="text-muted">未填写</span>
                </div>
                <div>
                  <span class="text-muted title">{{$t('common.birthday')}}</span>
                  <span v-if="agent.birthday">{{agent.birthday}}</span>
                  <span v-else class="text-muted">未填写</span>
                </div>
                <div>
                  <span class="text-muted title">{{$t('common.wechat')}}</span>
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
                <span v-if="showDetail">{{$t('action.close_detailed_infos')}}</span>
                <span v-else>{{$t('action.view_detailed_infos')}}</span>
              </a>
            </div>
          </div>

          <div class="row m-b b-b p-b">
            <div class="col-xs-4">
              <span class="text-muted">{{$t('bank.bank_title')}}</span>
              <div v-if="!agent.bank">
                <span class="label" >尚未建立</span>
              </div>
              <div class="p-a grey-50 lh-md m-t-sm label-width-eq" v-else>
                <div>
                  <span class="text-muted title">{{$t('bank.name')}}</span>
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
              <span class="text-muted">{{$t('common.memo')}}</span>
              <div  v-if="agent.memo">{{agent.memo}}</div>
              <div class="text-muted" v-else>{{$t('common.no_memo')}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
    import VueTypeahead from 'vue-typeahead'
    import DatePicker from 'vue2-datepicker'
    import api from '../../api'
    import { handleError } from '../../utils/handleError'
    import Vue from 'vue'
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
                formError: '',
                levels: [],
                agent: {
                    id: '',
                    level: '4',
                    username: '',
                    promo_code: '',
                    parent_agent: {},
                    commission_settings: '',
                    default_member_lv: '',
                    default_return_settings: '',
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
                field_locales: {
                    'default_member_lv': '预设会员等级错误：'
                },
                done: false,
                hasAgentParent: false,
                today: ''
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
                let level = parseInt(this.agent.level) - parseInt(1)
                level = level <= 0 ? 1 : level
                return level
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
            myReturn (val) {
                this.agent.default_return_settings = val
            },
            bank (val) {
                this.agent.bank.bank = val
            },
            getLevels () {
                this.$http.get(api.level).then(response => {
                    this.levels = response.data
                })
            },
            onSubmit (e) {
                if (this.agent.birthday) {
                    this.agent.birthday = Vue.moment(this.agent.birthday).format(format)
                }
                if (!this.agent.parent_agent && parseInt(this.agent.level) !== 1) {
                    this.formError = '请选择正确的上线'
                    return
                } else {
                    this.formError = ''
                }
                if (!this.bankFilled) {
                    delete this.agent.bank
                }
                if (this.agent.id) {
                    for (let x in this.agent) {
                        if (!this.agent[x]) {
                            delete this.agent[x]
                        }
                    }
                    this.$http.put(api.agentapplication + this.agent.id + '/', this.agent).then(response => {
                        if (response.status === 200) {
                            this.$router.push('/agent/applications/')
                        }
                    }, response => {
                        this.formError = ''
                        for (let field in this.field_locales) {
                            this.formError += handleError(response, field, this.field_locales)
                        }
                    })
                } else {
                    this.$http.post(api.agentapplication, this.agent).then(response => {
                        if (response.status === 201) {
                            this.$router.push('/agent/applications/')
                        }
                    }, response => {
                        this.formError = ''
                        for (let field in this.field_locales) {
                            this.formError += handleError(response, field, this.field_locales)
                        }
                    })
                }
            },
            checkAgent () {
                if (this.query !== '') {
                    this.$http.get(api.agent + '?opt_fields=username,id&username=' + this.query + '&level=' + this.parentLevel).then((response) => {
                        if (response.data.length === 1) {
                            this.agentValid = true
                            this.agent.parent_agent = response.data[0].id
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
                this.$http.get(api.agentapplication + id + '/?opt_expand=detail').then((response) => {
                    let data = response.data
                    if (!data.bank) {
                        data.bank = {}
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
            bank: require('../../components/bank'),
            level: require('../../components/level'),
            agentlevel: require('../../components/agentlevel'),
            returnsetting: require('../../components/returnsetting'),
            commissionsetting: require('../../components/commissionsetting')
        }
    }
</script>
<style scoped>
.input-lg{
    width: 180px;
}
</style>
