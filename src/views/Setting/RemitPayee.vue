<template>
    <div>
      <div class="row">
        <div class="col-xs-12">
          <div class="pull-right">
            <label class="text-danger m-r inline">{{$t('system.select_remit_type')}}:</label>
            <select class="w c-select inline" v-model="remittype">
              <option value="1">{{$t('finance.payment_normal')}}</option>
              <option value="2">{{$t('finance.payment_alipay')}} / {{$t('finance.payment_alipay')}}</option>
            </select>
          </div>
          <div v-if="$root.permissions.includes('add_remit_account')">
            <router-link tag="button" class="md-btn blue inline" to="/remit_payee/add">{{$t('title.payment_type_add')}}</router-link>
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
                    <th>{{$t('dic.status')}}</th>
                  </tr>
                </thead>
                <tbody v-if="remittype == '1'">
                    <tr v-for="payee in payees" v-if="payee.remit_type == '1'">
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
                      <td>
                        <span class="label success m-r" v-if="payee.status==1" @click="toggleStatus(payee)">{{$t('status.active')}}</span>
                        <span class="label danger m-r" v-if="payee.status==0" @click="toggleStatus(payee)">{{$t('status.disabled')}}</span>
                        <template v-if="updateRemitAccountStatus">
                            <a @click="toggleStatus(payee)" v-if="payee.status==1">{{$t('status.disabled')}}</a>
                            <a @click="toggleStatus(payee)" v-else>{{$t('status.active')}}</a>
                        </template>
                      </td>
                    </tr>
                </tbody>
                <tbody v-if="remittype == '2' || remittype == '3'">
                    <tr v-for="payee in payees" v-if="payee.remit_type != '1'">
                      <td><router-link :to="'/remit_payee/' + payee.id">{{payee.payee_name || payee.nickname}}</router-link></td>
                      <td>
                        <span v-if="payee.qr_code !== null"><img :src="payee.qr_code" class="qr-code"></span>
                        <span v-else>-</span>
                      </td>
                      <td>
                        <span v-if="payee.sum_fund !== null">{{payee.sum_fund | currency('￥')}}</span>
                        <span v-else>-</span>
                      </td>
                      <td><router-link class="m-r" v-for="l in payee.level" :to="'/level/' + l.id" :key="l.id">{{l.name}}</router-link></td>
                      <td>
                        <span class="label success m-r" v-if="payee.status==1" @click="toggleStatus(payee)">{{$t('status.active')}}</span>
                        <span class="label danger m-r" v-if="payee.status==0" @click="toggleStatus(payee)">{{$t('status.disabled')}}</span>
                        <template v-if="updateRemitAccountStatus">
                            <a @click="toggleStatus(payee)" v-if="payee.status==1">{{$t('status.disabled')}}</a>
                            <a @click="toggleStatus(payee)" v-else>{{$t('status.active')}}</a>
                        </template>
                      </td>
                  </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import { getMerchant, updateMerchant } from '../../service'
export default {
    data () {
        return {
            'payees': [],
            remittype: '1'
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
            updateMerchant('remitPayee', {
                id: payee.id,
                data: {
                    status: payee.status ^ 1
                }
            }).then(data => {
                payee.status = data.status
            })
        }
    }
}
</script>
