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
          <div class="alert alert-success" v-if="passwordChanged === 1">
            {{$t('agent.reset_agent_password')}}
            <strong>{{newPassword}}</strong>
          </div>

          <div class="alert alert-error" v-if="passwordChanged === -1">
            {{errorMsg}}
          </div>
          <div class="row">
            <div class="col-xs-3">
              <h2><strong>{{agent.username}}</strong>
              </h2>
              <span class="text-muted" v-if="agent.created_by">{{agent.created_at | moment( "YYYY-MM-DD HH:mm")}} 加盟</span>
            </div>
            <div class="col-xs-8 col-md-offset-1 text-right">
              <router-link class="md-btn md-flat m-r-sm" :to="'/report/finance_report?agent=' + agent.id + '&start_date=' + created_at_0 + '&end_date=' + created_at_1">{{$t('action.view_today_report')}}</router-link>
              <router-link class="md-btn md-flat m-r-sm" :to="'/bill/search?agent_q=' + agent.username">{{$t('action.view_member_record')}}</router-link>
              <a class="md-btn md-flat m-r-sm" @click="resetPassword($event)" v-if="this.$root.permissions.includes('reset_agent_password')">{{$t('action.reset_password')}}</a>
              <router-link class="md-btn md-flat m-r-sm" :to="'/agent/' + agent.id + '/edit'">{{$t('action.update_agent')}}</router-link>
              <!--<a class="md-btn md-flat m-r-sm" @click="deleteAgent(agent.id,true,$event)" v-if="">{{$t('action.delete')}}</a>-->
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
                <template v-if="levelPermission">
                  <a class="text-sm m-l" @click="toggleStatus" v-if="agent.status==1" >{{$t('status.inactive')}}</a>
                  <a class="text-sm m-l" @click="toggleStatus" v-else >{{$t('status.active')}}</a>
                </template>
                <span class="text-success" v-show="statusUpdated" @click="toggleStatus()">{{$t('common.status_updated')}}</span>
              </div>
            </div>

            <div class="col-xs-4">
              <span class="text-muted">{{$t('agent.member_count')}}</span>
              <div >
                <router-link  :to="'/member?agent=' + agent.username">{{agent.member_count}}</router-link>
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
          </div>
          <div class="row m-b p-t p-b b-b">
            <div class="col-xs-4">
              <span class="text-muted">{{$t('common.basic_info')}}</span>
              <div  v-if="!showDetail">
                {{$t('common.real_name')}}：
                <span v-if="agent.real_name">{{agent.real_name}}</span>
                <span class="label" v-else>未填写</span>，{{$t('common.phone')}}：
                <span v-if="agent.phone">{{agent.phone}}</span>
                <span class="label" v-else>未填写</span>
              </div>

              <div class="p-a grey-50 lh-md m-t-sm label-width-eq" v-else>
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
              <router-link :to="'/agent/' + agent.id + '/edit'" v-if="!agent.bank & levelPermission">{{$t('common.add_bank_information')}}</router-link>
              <router-link :to="'/agent/' + agent.id + '/edit'" v-if="levelPermission & !(!agent.bank)">{{$t('common.edit_bank_information')}}</router-link>
            </div>
          </div>

          <div class="row m-b b-b p-b">
            <div class="col-xs-4">
              <span class="text-muted">{{$t('agent.domain')}}</span>
              <div  v-if="isArray(agent.domain)" class="domain">
                <label class="m-r" v-for="domain in agent.domain">{{domain}}</label>
              </div>
              <div class="text-muted" v-else-if="!agent.domain">{{$t('agent.unDomain')}}</div>
              <div class="text-muted" v-else>{{agent.domain}}</div>
            </div>
            <div class="col-xs-6">
              <span class="text-muted">{{$t('agent.link')}}</span>
              <div class="t-red">首页地址?r=推广码 如：http://rico-st8ging.azureedge.net/?r={{agent.promo_code}}</div>
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
    import api from '../../../api'
    import Vue from 'vue'
    const format = 'YYYY-MM-DD'

    export default {
        data () {
            return {
                showDetail: false,
                statusUpdated: false,
                passwordChanged: false,
                newPassword: '',
                memberLevels: [],
                agent: {
                    id: '',
                    member_count: '',
                    bank: {
                        bank: {
                            id: '',
                            name: ''
                        }
                    },
                    commission_settings: {},
                    level: '',
                    status: ''
                },
                created_at_0: Vue.moment().format(format),
                created_at_1: Vue.moment().format(format)
            }
        },
        computed: {
            levelPermission: function () {
                let id = this.agent.level.id
                if (id) {
                    return this.getAgentPermission(id)
                }
            }
        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                let id = to.params.agentId
                vm.getAgent(id)
            })
        },
        watch: {
            passwordChanged (newObj, old) {
                setTimeout(() => {
                    this.passwordChanged = 0
                }, 8000)
            },
            '$route': 'nextTickFetch'
        },
        methods: {
            nextTickFetch () {
                this.getAgent(this.$route.params.agentId)
            },
            toggleStatus () {
                this.statusUpdated = false
                this.$http.put(api.agent + this.agent.id + '/?opt_fields=status', {
                    status: this.agent.status === 1 ? 0 : 1
                }).then(data => {
                    this.agent.status = data.status
                    this.statusUpdated = true
                    setTimeout(() => {
                        this.statusUpdated = false
                    }, 3000)
                })
            },
            resetPassword (event) {
                if (!window.confirm(this.$t('agent.reset_confirm', {
                    action: event.target.innerText
                }))) {
                    return
                }
                this.$http.post(api.resetagent, { 'account_id': this.agent.id }, {emulateJSON: true}).then(data => {
                    this.passwordChanged = 1
                    this.newPassword = data.new_password
                }, error => {
                    this.passwordChanged = -1
                    this.errorMsg = error
                })
            },
            deleteAgent (id, confirm, event) {
                if (!window.confirm(this.$t('agent.reset_confirm', {
                    action: event.target.innerText
                }))) {
                    return
                }
                this.$http.delete(api.agent + id + '/').then(() => {
                    this.$router.go('/agent')
                })
            },
            getAgent (id) {
                let fields = 'level,commission_settings,default_member_lv,parent_agent,bank'
                this.$http.get(api.agent + id + '/?opt_expand=' + fields).then(data => {
                    this.agent = data
                    this.account_id = {'account_id': data.id}
                })
            },
            getAgentPermission (levelId) {
                let agentPermissionId = 'change_agent_level_' + levelId
                return this.$root.permissions.includes(agentPermissionId)
            },
            isArray (o) {
                return Object.prototype.toString.call(o) === '[object Array]'
            }
        }
    }
</script>
<style scoped>
.label-width-eq .title{
    text-align: right;
    display: inline-block;
    margin-right: 10px;
    width: 80px;
}
.domain {
        word-break: break-all;
    }
</style>
