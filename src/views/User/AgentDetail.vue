<template>
    <div>
      <div class="m-b">
        <ol class="breadcrumb">
          <li class="active"><router-link to="/agent">{{ $t('dic.agent') }}</router-link></li>
          <li class="active">{{ $route.meta.title }}</li>
        </ol>
      </div>
      <div class="box">
        <div class="box-header b-b">
          <div class="alert alert-success" v-if="passwordChanged">
            {{ $t('system_msg.agent_password_changed') }}
            <b>{{ newPassword }}</b>
          </div>

          <div class="row">
            <div class="col-xs-3">
              <h2><strong>{{ agent.username }}</strong>
              </h2>
              <span class="text-muted text-sm" v-if="agent.created_by">{{ agent.created_at | moment( 'YYYY-MM-DD HH:mm') }} 加盟</span>
            </div>
            <div class="col-xs-8 col-md-offset-1 text-right">
              <router-link class="md-btn md-flat m-r-sm" :to="`/agent/commission?agent=${agent.username}`">{{ $t('misc.view_agent_report') }}</router-link>
              <router-link class="md-btn md-flat m-r-sm" :to="'/bill/search?agent_q=' + agent.username">{{ $t('misc.view_all_member_transactions') }}</router-link>
              <a class="md-btn md-flat m-r-sm" @click="resetPassword($event)" v-if="this.$root.permissions.includes('reset_agent_password')">{{ $t('user.reset_password') }}</a>
              <router-link class="md-btn md-flat m-r-sm" :to="'/agent/' + agent.id + '/edit'">{{ $t('title.agent_edit') }}</router-link>
              <!--<a class="md-btn md-flat m-r-sm" @click="deleteAgent(agent.id,true,$event)" v-if="">{{ $t('dic.delete') }}</a>-->
            </div>
          </div>
        </div>
        <div class="box-body">
          <div class="row b-b">
            <div class="m-b col-xs-8">
              <div class="col-xs-6">
                <span>{{ $t('user.agent_level') }}</span>
                <p class="m-b-0 text-muted">{{ agent.level.name }}</p>
              </div>

              <div class="col-xs-6">
                <span>{{ $t('user.parent_agent') }}</span>
                <p class="m-b-0">
                  <router-link v-if="agent.parent_agent" :to="'/agent/' + agent.parent_agent.id">{{ agent.parent_agent.name }}</router-link>
                  <span class="text-muted" v-else>{{ $t('user.no_parent_agent') }}</span>
                </p>
              </div>

              <div class="col-xs-6 m-t-sm">
                <span>{{ $t('user.agent_count') }}</span>
                <div>
                  <!-- <router-link :to="'/agent?parent_agent_q=' + agent.username" v-if="agent.agent_count">{{ agent.agent_count }}</router-link> -->
                  <span v-if="agent.agent_count">{{ agent.agent_count }}</span>
                  <span class="text-muted" v-else>{{ agent.agent_count }}</span>
                </div>
              </div>

              <div class="col-xs-6 m-t-sm">
                <span>{{ $t('user.member_count') }}</span>
                <div class="text-muted">
                  {{ agent.member_count }}
                </div>
              </div>
              <div class="col-xs-6 m-t-sm">
                <span>{{ $t('dic.status') }} </span>
                <div>
                  <span class="label success" v-if="agent.status === 1" @click="toggleStatus">{{ $t('status.active') }}</span>
                  <span class="label" v-else @click="toggleStatus">{{ $t('status.inactive') }}</span>
                  <template v-if="$root.permissions.includes('update_agent_status')">
                    <a class="text-sm m-l-sm" @click="toggleStatus" v-if="agent.status === 1">{{ $t('status.inactive') }}</a>
                    <a class="text-sm m-l-sm" @click="toggleStatus" v-else>{{ $t('status.active') }}</a>
                  </template>
                </div>
              </div>
              <div class="col-xs-6 m-t-sm">
                <span>{{ $t('user.default_member_level') }}</span>
                <div>
                  <router-link v-if="agent.default_member_lv" :to="'/level/' + agent.default_member_lv.id ">{{ agent.default_member_lv.name }}</router-link>
                  <span class="label" v-else>未设定</span>
                </div>
              </div>
            </div>
            <div class="col-xs-4">
              <p class="m-b-0">{{ $t('title.commission') }}</p>
              <div v-if="agent.commission_settings" class="text-sm">
                <div class="m-t-xs">
                  <span class="text-muted m-r-sm">{{ $t('finance.commission_name') }}</span>
                  <router-link :to="`/commission/${agent.commission_settings.id}/edit`" class="m-b-0">{{ agent.commission_settings.name }}</router-link>
                </div>
                <div class="m-t-xs text-muted" v-if="agent.commission_settings.member_number">
                  <span class="m-r-sm">{{ $t('user.valid_member') }}</span>
                  <span v-if="agent.commission_settings.member_number !== null">{{ agent.commission_settings.member_number }}</span>
                  <span v-else>未填写</span>
                </div>
                <div class="p-a-sm m-a m-t-sm grey-50" v-if="agent.commission_settings.profit_set">
                  <div class="row m-l-sm text-muted text-center">
                    <div class="col-xs-8">{{ $t('finance.income_threshold') }}</div>
                    <div class="col-xs-4">{{ $t('finance.commission_rate') }}</div>
                  </div>
                  <div class="row m-l-sm text-center text-black-dk" v-for="(p, i) in agent.commission_settings.profit_set" :key="i" v-if="agent.commission_settings.profit_set">
                    <div class="col-xs-8">
                      <span>{{ p.income_threshold | currency('￥', 2) }}</span>
                      ~
                      <span v-if="i + 1 < agent.commission_settings.profit_set.length">{{ agent.commission_settings.profit_set[i+1].income_threshold - 0.01 | currency('￥', 2) }}</span>
                    </div>
                    <div class="col-xs-4">{{ p.rate }}&nbsp;%</div>
                  </div>
                </div>
              </div>
              <p class="label m-b-0" v-else>未设定</p>
            </div>
          </div>

          <div class="row m-b p-t p-b b-b m-l-xs m-r-xs">
            <div class="col-xs-4">
              <span>{{ $t('title.basic_info') }}</span>
              <div class="p-a grey-50 lh-md m-t-sm label-width-eq">
                <div>
                  <span class="text-muted title">{{ $t('user.real_name') }}</span>
                  <span v-if="agent.real_name">{{ agent.real_name }}</span>
                  <span v-else class="text-muted">未填写</span>
                </div>
                <div>
                  <span class="text-muted title">{{ $t('user.phone') }}</span>
                  <span v-if="agent.phone">{{ agent.phone }}</span>
                  <span v-else class="text-muted">未填写</span>
                </div>
                <div>
                  <span class="text-muted title">{{ $t('user.gender') }}</span>
                  <span v-if="agent.gender">{{ agent.gender }}</span>
                  <span v-else class="text-muted">未填写</span>
                </div>
                <div>
                  <span class="text-muted title">{{ $t('user.email') }}</span>
                  <span v-if="agent.email">{{ agent.email }}</span>
                  <span v-else class="text-muted">未填写</span>
                </div>
                <div>
                  <span class="text-muted title">{{ $t('user.birthday') }}</span>
                  <span v-if="agent.birthday">{{ agent.birthday }}</span>
                  <span v-else class="text-muted">未填写</span>
                </div>
                <div>
                  <span class="text-muted title">{{ $t('user.wechat') }}</span>
                  <span v-if="agent.wechat">{{ agent.wechat }}</span>
                  <span v-else class="text-muted">未填写</span>
                </div>
                <div>
                  <span class="text-muted title">QQ</span>
                  <span v-if="agent.qq">{{ agent.qq }}</span>
                  <span v-else class="text-muted">未填写</span>
                </div>
              </div>
            </div>

            <div class="col-xs-4">
              <span>{{ $t('bank.bank_info') }}</span>
              <div v-if="!agent.bank">
                <span class="label" >尚未建立</span>
              </div>
              <div class="p-a grey-50 lh-md m-t-sm label-width-eq" v-else>
                <div>
                  <span class="text-muted title">{{ $t('dic.bank') }}</span>
                  <span>{{ agent.bank.bank.name }}</span>
                </div>
                <div>
                  <span class="text-muted title">{{ $t('bank.province') }}</span>
                  <span>{{ agent.bank.province }}</span>
                </div>
                <div>
                  <span class="text-muted title">{{ $t('bank.city') }}</span>
                  <span>{{ agent.bank.city }}</span>
                </div>
                <div>
                  <span class="text-muted title">{{ $t('bank.account') }}</span>
                  <span>{{ agent.bank.account }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="row m-b b-b p-b m-r-xs m-l-xs">
            <div class="col-xs-3">
              <span>{{ $t('user.domain') }}</span>
              <div v-if="isArray(agent.domain)" class="domain">
                <label class="m-r" v-for="domain in agent.domain">{{ domain }}</label>
              </div>
              <div class="text-muted" v-else-if="!agent.domain">{{ $t('user.no_domain') }}</div>
              <div class="text-muted" v-else>{{ agent.domain }}</div>
            </div>
            <div class="col-xs-3">
              <span>{{ $t('user.promo_code') }}</span>
              <div class="text-muted">{{ agent.promo_code }}</div>
            </div>
            <div class="col-xs-6">
              <span>{{ $t('user.promo_link') }}</span>
              <div class="t-red">首页地址?r=推广码 如：http://rico-st8ging.azureedge.net/#/?r={{ agent.promo_code }}</div>
            </div>
          </div>

          <div class="row m-l-xs m-r-xs">
            <div class="col-xs-8">
              <span>{{ $t('dic.memo') }}</span>
              <div  v-if="agent.memo">{{ agent.memo }}</div>
              <div class="text-muted" v-else>{{ $t('dic.no_memo') }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
    import { getUser, updateUser, deleteAgent, resetPassword } from '../../service'
    import Vue from 'vue'
    const format = 'YYYY-MM-DD'

    export default {
        data () {
            return {
                showDetail: false,
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
        beforeRouteEnter (to, from, next) {
            next(vm => {
                let id = to.params.agentId
                vm.getAgent(id)
            })
        },
        watch: {
            '$route': 'nextTickFetch'
        },
        methods: {
            nextTickFetch () {
                this.getAgent(this.$route.params.agentId)
            },
            toggleStatus () {
                updateUser('agent', {
                    id: this.agent.id,
                    data: {
                        status: this.agent.status ^ 1
                    },
                    params: {
                        opt_fields: 'status'
                    }
                }, {
                    action: this.$t('dic.update'),
                    object: this.$t('dic.status')
                }).then(data => {
                    this.agent.status = data.status
                }, () => {})
            },
            resetPassword (event) {
                if (!window.confirm(this.$t('system_msg.confirm_action_object', {
                    action: event.target.innerText
                }))) {
                    return
                }
                this.passwordChanged = false
                resetPassword(this.agent.id, 'agent').then(data => {
                    this.passwordChanged = true
                    this.newPassword = data.new_password
                }, () => {})
            },
            deleteAgent (id, confirm, event) {
                if (!window.confirm(this.$t('system_msg.confirm_action_object', {
                    action: event.target.innerText
                }))) {
                    return
                }
                deleteAgent(id, {
                    action: this.$t('dic.delete'),
                    object: this.$t('dic.agent')
                }).then(() => {
                    this.$router.push('/agent')
                }, () => {})
            },
            getAgent (id) {
                let fields = 'level,commission_settings,default_member_lv,parent_agent,bank'
                getUser('agent', {
                    id,
                    params: {
                        opt_expand: fields
                    }
                }).then(data => {
                    if (data.commission_settings && data.commission_settings.profit_set) {
                        data.commission_settings.profit_set.sort((a, b) => a.income_threshold - b.income_threshold)
                    }
                    this.agent = data
                })
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
