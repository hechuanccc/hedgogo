<template>
    <div>
      <div class="row">
        <div class="col-xs-12">
          <div class="pull-right">
            <label class="text-danger m-r inline">{{$t('system.select_remit_type')}}:</label>
            <select class="form-control w-sm c-select inline" v-model="remittype">
              <option value="1">{{$t('finance.payment_normal')}}</option>
              <option value="2">{{$t('finance.payment_wechat')}} / {{$t('finance.payment_alipay')}}</option>
            </select>
          </div>
          <div v-if="$root.permissions.includes('add_remit_account')">
            <router-link tag="button" class="md-btn blue inline w-sm" to="/remit_payee/add">{{$t('dic.create')}}</router-link>
          </div>
        </div>
      </div>
        <div class="box">
            <table st-table="rowCollectionBasic" class="table table-striped b-t m-t">
                <thead>
                  <tr>
                    <th v-show="remittype == '1'">{{$t('user.real_name')}}</th>
                    <th v-show="remittype != '1'">{{$t('user.username')}}</th>
                    <th v-show="remittype == '1'">{{$t('dic.bank')}}</th>
                    <th v-show="remittype == '1'">{{$t('bank.account')}}</th>
                    <th v-show="remittype == '1'">{{$t('bank.address')}}</th>
                    <th v-show="remittype != '1'">{{$t('misc.qr_code')}}</th>
                    <th>{{$t('finance.sum_fund')}}</th>
                    <th>{{$t('dic.member_level')}}</th>
                    <th class="text-center">{{$t('dic.status')}}</th>
                  </tr>
                </thead>
                <tbody v-if="remittype == '1'">
                    <tr v-for="payee in payees" :key="payee.id" v-if="payee.remit_type == '1'">
                      <td><router-link :to="'/remit_payee/' + payee.id">{{payee.payee_name || payee.nickname}}</router-link></td>
                      <td>
                        <span v-if="payee.bank !== null">{{payee.bank.name}}</span>
                        <span v-else>-</span>
                      </td>
                      <td>
                        <span v-if="payee.account !== null">{{payee.account}}</span>
                        <span v-else>-</span>
                      </td>
                      <td>
                        <span v-if="payee.address !== null">{{payee.address}}</span>
                        <span v-else>-</span>
                      </td>
                      <td>
                        <span v-if="payee.sum_fund !== null">{{payee.sum_fund | currency('￥')}}</span>
                        <span v-else>-</span>
                      </td>
                      <td><router-link class="m-r" v-for="l in payee.level" :to="'/level/' + l.id" :key="l.id">{{l.name}}</router-link></td>
                      <td class="text-center">
                        <status-switch
                          :status="payee.status"
                          :loading="!!statusSwitchLoading[payee.id]"
                          :disabled="!updateRemitAccountStatus"
                          :options="[$t('status.disabled'), '']"
                          @toggle="toggleStatus(payee)"
                        />
                      </td>
                    </tr>
                </tbody>
                <tbody v-if="remittype == '2' || remittype == '3'">
                    <tr v-for="payee in payees" :key="payee.id" v-if="payee.remit_type != '1'">
                      <td><router-link :to="'/remit_payee/' + payee.id">{{payee.payee_name || payee.nickname}}</router-link></td>
                      <td>
                        <span v-if="payee.qr_code !== null">
                            <img :src="payee.qr_code" class="qr-code" width="200px;">
                        </span>
                        <span v-else>-</span>
                      </td>
                      <td>
                        <span v-if="payee.sum_fund !== null">{{payee.sum_fund | currency('￥')}}</span>
                        <span v-else>-</span>
                      </td>
                      <td><router-link class="m-r" v-for="l in payee.level" :to="'/level/' + l.id" :key="l.id">{{l.name}}</router-link></td>
                      <td class="text-center">
                        <status-switch
                          :status="payee.status"
                          :loading="!!statusSwitchLoading[payee.id]"
                          :disabled="!updateRemitAccountStatus"
                          :options="[$t('status.disabled'), $t('status.active')]"
                          @toggle="toggleStatus(payee)"
                        />
                      </td>
                  </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
import StatusSwitch from '../../components/StatusSwitch.vue'
import { getMerchant, updateMerchant } from '../../service'
export default {
    data () {
        return {
            payees: [],
            remittype: '1',
            statusSwitchLoading: {}
        }
    },
    created () {
        getMerchant('remitPayee', {
            params: {
                opt_expand: 1
            }
        }).then(data => {
            this.payees = data
        })
    },
    computed: {
        updateRemitAccountStatus () {
            return this.$root.permissions.includes('update_remit_account_status')
        }
    },
    methods: {
        toggleStatus (payee) {
            this.$set(this.statusSwitchLoading, payee.id, true)
            updateMerchant('remitPayee', {
                id: payee.id,
                data: {
                    status: payee.status ^ 1
                }
            }, {
                action: this.$t('dic.update'),
                object: this.$t('dic.status')
            }).then(({ status }) => {
                payee.status = status
            }).finally(() => {
                this.$delete(this.statusSwitchLoading, payee.id)
            })
        }
    },
    components: {
        StatusSwitch
    }
}
</script>
