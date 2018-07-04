<template>
    <div>
      <div class="m-b">
        <ol class="breadcrumb">
          <li class="active"><router-link to="/member">{{$t('nav.member')}}</router-link></li>
          <li class="active">{{$route.meta.title}}</li>
        </ol>
      </div>
      <div class="box">
        <div class="box-header b-b" v-if="!$route.params.memberId">
          <h3>{{$t('common.attention')}}：</h3>
          <small>{{$t('common.default_password')}} ：123456, {{$t('common.default_withdraw_password')}} ：123456。</small>
        </div>
        <div class="box-body">
          <form class="form m-a" @submit.prevent="onSubmit">
            <div class="row b-b p-b m-b">
              <div class="col-md-4">
                <h5 class="m-b">{{$t('member.account_info')}} </h5>
                <div class="form-group">
                  <label for="account" class="label-width">{{$t('member.account')}}</label>
                  <div class="inline-form-control">
                    <input
                      class="form-control"
                      name="account"
                      :placeholder="`${$t('common.username')}, ${$t('common.required')}`"
                      v-model="member.username"
                      pattern="[A-Za-z\d]{6,15}"
                      :title="$t('member.username_form_validation_msg', {
                        digit: '6~15'
                      })"
                      :disabled="$route.params.memberId"
                      required
                    />
                  </div>
                </div>

                <div class="form-group" v-if="updateMemberPermission('agent')">
                  <label for="agent" class="label-width">{{$t('member.agent')}}</label>
                  <selector-agent
                    :agent="member.agent.id || member.agent"
                    :req="true"
                    :extra="{level: 4}"
                    @agent-select="(val) => member.agent = parseInt(val)"
                  />
                  <!-- member is under only agent level 4 ( not 3 and above ) -->
                </div>

                <div class="form-group b-b p-b">
                  <label for="agent" class="label-width">{{$t('member.level')}} </label>
                  <div class="inline-form-control">
                    <selector-member-level
                      :level="member.level"
                      @level-select="levelSelect"
                      :req="true"
                      :disabled="!updateMemberPermission('level')"
                    />
                  </div>
                </div>


                <div class="form-group">
                  <label class="label-width">{{$t('common.real_name')}}</label>
                  <div class="inline-form-control">
                    <input
                      class="form-control"
                      :placeholder="`${$t('common.real_name')}, ${$t('common.required')}`"
                      v-model="member.real_name"
                      :disabled="!updateMemberPermission('name')"
                      required
                    />
                  </div>
                </div>
                <div class="form-group">
                  <label class="label-width">{{$t('common.phone')}}</label>
                  <div class="inline-form-control">
                    <input
                      class="form-control"
                      :placeholder="`${$t('common.phone')}, ${$t('common.required')}`"
                      v-model="member.phone"
                      :disabled="!updateMemberPermission('details')"
                      pattern="[1][3-9][\d]{9}"
                      required
                    />
                  </div>
                </div>

                <div class="form-group">
                  <label for="agent" class="label-width">{{$t('common.gender')}} </label>
                  <div class="from-control inline-form-control">
                    <label class="md-check">
                      <input type="radio" value="M" name="gender" v-model="member.gender" :disabled="!updateMemberPermission('details')">
                      <i class="blue"></i>
                      {{$t('common.male')}}
                    </label>

                    <label class="md-check m-l-md" >
                      <input type="radio" value="F" name="gender" v-model="member.gender" :disabled="!updateMemberPermission('details')">
                      <i class="blue"></i>
                      {{$t('common.female')}}
                    </label>
                  </div>
                </div>
                <div class="form-group">
                  <label for="email" class="label-width">{{$t('common.email')}}</label>
                  <div class="inline-form-control">
                    <input
                      type="email"
                      class="form-control" 
                      name="email"
                      placeholder="比如：abc@example.com"
                      v-model="member.email"
                      :disabled="!updateMemberPermission('details')"
                    />
                  </div>
                </div>
                <div class="form-group">
                  <label for="birthday" class="label-width">{{$t('common.birthday')}} </label>
                  <div class="inline-form-control" v-if="updateMemberPermission('details')">
                    <el-date-picker
                      style="width: 153px;"
                      v-model="member.birthday"
                      type="date"
                      placeholder="请输入日期"
                      value-format="yyyy-MM-dd"
                    />
                  </div>
                  <div class="inline-form-control" v-else>
                    <input
                      class="form-control"
                      placeholder="请输入日期"
                      v-model="member.birthday"
                      disabled
                    />                    
                  </div>
                </div>
                <div class="form-group">
                  <label class="label-width">{{$t('common.wechat')}} </label>
                  <div class="inline-form-control">
                    <input
                      class="form-control"
                      placeholder="比如：ABC234" 
                      v-model="member.wechat"
                      :disabled="!updateMemberPermission('details')"
                    />
                  </div>
                </div>
                <div class="form-group">
                  <label class="label-width">QQ</label>
                  <div class="inline-form-control">
                    <input
                      class="form-control"
                      placeholder="比如：453087589"
                      v-model="member.qq"
                      :disabled="!updateMemberPermission('details')"
                      pattern="[\d]*"
                    />
                  </div>
                </div>
              </div>
              <div class="col-md-4 col-md-offset-1">
                <div v-if="updateMemberPermission('bank')">
                  <h5 class="m-b">{{$t('bank.bank_title')}} </h5>
                  <div class="form-group">
                    <label class="label-width">{{$t('bank.name')}}</label>
                    <selector-bank
                      :bank="member.bank.bank"
                      :req="bankFilled"
                      @bank-select="bankSelect"
                      :disabled="!updateMemberPermission('bank')"
                      :show-status="true"
                    />
                  </div>
                  <div class="form-group">
                    <label class="label-width">{{$t('bank.province')}} </label>
                    <div class="inline-form-control">
                      <input
                        class="form-control"
                        v-model="member.bank.province"
                        :required="bankFilled"
                        :disabled="!updateMemberPermission('bank')"
                      />
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="label-width">{{$t('bank.city')}} </label>
                    <div class="inline-form-control">
                      <input
                        class="form-control"
                        v-model="member.bank.city"
                        :required="bankFilled"
                        :disabled="!updateMemberPermission('bank')"
                      />
                    </div>
                  </div>
                  <div class="form-group b-b p-b">
                    <label class="label-width">{{$t('bank.account')}} </label>
                    <div class="inline-form-control">
                      <input
                        class="form-control w-lg"
                        placeholder="比如：3345678"
                        v-model="member.bank.account"
                        :required="bankFilled"
                        :disabled="!updateMemberPermission('bank')"
                        pattern="[\d]*"
                      />
                    </div>
                  </div>

                  <div class="form-group m-t">
                    <label for="memo">{{$t('common.memo')}} </label>
                    <textarea class="form-control" rows="4" placeholder="仅供管理员记录会员信息，会员无法查看" v-model="member.memo" :disabled="!updateMemberPermission('details')"></textarea>
                  </div>
                </div>
              </div>
            </div>
            <button type="submit" class="md-btn blue w-sm">
              <span v-if="!loading">{{$t('common.save')}}</span>
              <i class="fa fa-spin fa-spinner" v-else></i>
            </button>
          </form>
        </div>
      </div>
    </div>
</template>
<script>
import SelectorAgent from '../../components/SelectorAgent'
import SelectorBank from '../../components/SelectorBank'
import SelectorMemberLevel from '../../components/SelectorMemberLevel'
import { getUser, updateUser } from '../../service'
import $ from '../../utils/util'

export default {
    data () {
        return {
            id: '',
            member: {
                id: '',
                username: '',
                agent: '',
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
                level: ''
            },
            loading: false
        }
    },
    computed: {
        bankFilled: function () {
            let bankinfo = this.member.bank
            return bankinfo.bank || bankinfo.province || bankinfo.id || bankinfo.account
        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            let id = to.params.memberId
            if (id) {
                vm.id = id
                vm.getMember(id)
            }
        })
    },
    methods: {
        updateMemberPermission (field) {
            return this.$route.name === 'member-edit' ? this.$root.permissions.includes(`update_member_${field}`) : this.$root.permissions.includes('add_new_member')
        },
        bankSelect (bank) {
            this.member.bank.bank = bank
        },
        levelSelect (val) {
            this.member.level = parseInt(val)
        },
        onSubmit (e) {
            this.loading = true
            let memberResult = {}
            Object.assign(memberResult, this.member)
            if (!this.bankFilled) {
                this.$delete(memberResult, 'bank')
            }

            updateUser('member', {
                id: this.id,
                data: memberResult
            }).then(data => {
                $.notify({
                    message: `${this.id ? this.$t('action.update') : this.$t('action.create')}${this.$t('status.success')}`
                })
                this.$router.push('/member/' + data.id)
            }, error => {
                $.notify({
                    message: error,
                    type: 'danger'
                })
                this.loading = false
            })
        },
        getMember (id) {
            getUser('member', {
                id,
                params: {
                    opt_expand: 1
                }
            }).then(data => {
                if (!data.bank) {
                    data.bank = {bank: '', province: ''}
                }
                if (data.level) {
                    data.level = data.level.id
                }
                Object.assign(this.member, data)
            })
        }
    },
    components: {
        SelectorBank,
        SelectorMemberLevel,
        SelectorAgent
    }
}
</script>
