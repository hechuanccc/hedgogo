<template>
    <div>
      <div class="m-b">
        <ol class="breadcrumb">
          <li class="active"><router-link to="/member">{{$t('dic.member')}}</router-link></li>
          <li class="active">{{$route.meta.title}}</li>
        </ol>
      </div>
      <div class="box">
        <div class="box-header b-b" v-if="!$route.params.memberId">
          <h3>{{$t('system.attention')}}：</h3>
          <small>{{$t('user.default_password')}} ：123456, {{$t('user.default_withdraw_password')}} ：123456。</small>
        </div>
        <div class="box-body">
          <form class="form m-a" @submit.prevent="onSubmit">
            <div class="row b-b p-b m-b">
              <div class="col-md-4">
                <h5 class="m-b">{{$t('user.account_info')}} </h5>
                <div class="form-group">
                  <label for="account" class="label-width">{{$t('user.account')}}</label>
                  <div class="inline-form-control">
                    <input
                      class="form-control"
                      name="account"
                      :placeholder="`${$t('user.username')}, ${$t('system.required')}`"
                      v-model="member.username"
                      pattern="[A-Za-z\d]{6,15}"
                      :title="$t('misc.username_validation_msg', {
                        digit: '6~15'
                      })"
                      :disabled="$route.params.memberId"
                      required
                    />
                  </div>
                </div>

                <div class="form-group" v-if="updateMemberPermission('agent')">
                  <label for="agent" class="label-width">{{$t('dic.agent')}}</label>
                  <selector-agent
                    :agent="member.agent.id || member.agent"
                    :req="true"
                    :extra="{level: 4}"
                    @agent-select="(val) => member.agent = parseInt(val)"
                  />
                  <!-- member is under only agent level 4 ( not 3 and above ) -->
                </div>

                <div class="form-group b-b p-b">
                  <label for="agent" class="label-width">{{$t('dic.member_level')}} </label>
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
                  <label class="label-width">{{$t('user.real_name')}}</label>
                  <div class="inline-form-control">
                    <input
                      class="form-control"
                      :placeholder="`${$t('user.real_name')}, ${$t('system.required')}`"
                      v-model="member.real_name"
                      :disabled="!updateMemberPermission('name')"
                      required
                    />
                  </div>
                </div>
                <div class="form-group">
                  <label class="label-width">{{$t('user.phone')}}</label>
                  <div class="inline-form-control">
                    <input
                      class="form-control"
                      :placeholder="`${$t('user.phone')}, ${$t('system.required')}`"
                      v-model="member.phone"
                      :disabled="!updateMemberPermission('details')"
                      pattern="[1][3-9][\d]{9}"
                      required
                    />
                  </div>
                </div>

                <div class="form-group">
                  <label for="agent" class="label-width">{{$t('user.gender')}} </label>
                  <div class="from-control inline-form-control">
                    <label class="md-check">
                      <input type="radio" value="M" name="gender" v-model="member.gender" :disabled="!updateMemberPermission('details')">
                      <i class="blue"></i>
                      {{$t('user.male')}}
                    </label>

                    <label class="md-check m-l-md" >
                      <input type="radio" value="F" name="gender" v-model="member.gender" :disabled="!updateMemberPermission('details')">
                      <i class="blue"></i>
                      {{$t('user.female')}}
                    </label>
                  </div>
                </div>
                <div class="form-group">
                  <label for="email" class="label-width">{{$t('user.email')}}</label>
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
                  <label for="birthday" class="label-width">{{$t('user.birthday')}} </label>
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
                  <label class="label-width">{{$t('user.wechat')}} </label>
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
                  <h5 class="m-b">{{$t('bank.bank_info')}} </h5>
                  <div class="form-group">
                    <label class="label-width">{{$t('dic.bank')}}</label>
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
                    <label for="memo">{{$t('dic.memo')}} </label>
                    <textarea class="form-control" rows="4" placeholder="仅供管理员记录会员信息，会员无法查看" v-model="member.memo" :disabled="!updateMemberPermission('details')"></textarea>
                  </div>
                </div>
              </div>
            </div>
            <button type="submit" class="md-btn blue w-sm">
              <span v-if="!loading">{{$t('dic.submit')}}</span>
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
            let data = Object.assign({}, this.member)
            if (!this.bankFilled) {
                this.$delete(data, 'bank')
            }

            updateUser('member', {
                id: this.id,
                data
            }, {
                action: this.id ? this.$t('title.member_edit') : this.$t('title.member_add')
            })
            .then(({ id }) => { this.$router.push('/member/' + id) })
            .catch(() => {})
            .finally(() => { this.loading = false })
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
