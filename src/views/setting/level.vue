<template>
    <div>
        <div class="m-b" v-show="$root.permissions.includes('change_level')">
            <router-link class="md-btn blue w-sm" tag="button" to="/level/add">{{$t('action.add_level')}}</router-link>
        </div>
        <div class="box">
            <table st-table="rowCollectionBasic" class="table table-striped b-t">
              <thead>
              <tr>
                <th>{{$t('common.name')}}</th>
                <th>{{$t('common.status')}}</th>
                <th>{{$t('level.remit_limit')}}</th>
                <th>{{$t('level.online_pay_limit')}}</th>
                <th>{{$t('level.withdraw_limit')}}</th>
                <th>{{$t('level.withdraw_fee_rate')}}</th>
                <th >{{$t('level.withdraw_fee_type')}}</th>
                <th>{{$t('level.discount')}}</th>
                <th>{{$t('level.report_flag')}}</th>
                <th>{{$t('common.member_count')}}</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="l in levels" >
                <td><router-link :to="'/level/' + l.id">{{l.name}}</router-link></td>
                <td>
                    <span v-if="l.status==1" class="label success">安全</span>
                    <span v-else-if="l.status==0" class="label danger">危险</span>
                </td>
                <td>
                    <div v-show="l.remit_limit" v-if="l.remit_limit.lower || l.remit_limit.upper">
                        <div  v-show="!l.remit_limit.lower">{{l.remit_limit.upper}} 以下</div>
                        <div  v-show="!l.remit_limit.upper">{{l.remit_limit.lower}} 以上</div>
                        <div v-show="l.remit_limit.upper && l.remit_limit.lower">{{l.remit_limit.lower}} 至 {{l.remit_limit.upper}}</div>
                    </div>
                    <div v-else>
                        <span>{{$t('common.not_set')}}</span>
                    </div>
                </td>
                <td>
                    <div v-show="l.online_limit" v-if="l.online_limit.lower || l.online_limit.upper">
                        <div  v-show="!l.online_limit.lower">{{l.online_limit.upper}} 以下</div>
                        <div  v-show="!l.online_limit.upper">{{l.online_limit.lower}} 以上</div>
                        <div v-show="l.online_limit.upper && l.online_limit.lower">{{l.online_limit.lower}} 至 {{l.online_limit.upper}}</div>
                    </div>
                    <div v-else>
                        <span>{{$t('common.not_set')}}</span>
                    </div>
                </td>
                <td>
                    <div v-show="l.withdraw_limit" v-if="l.withdraw_limit.lower || l.withdraw_limit.upper">
                        <div  v-show="!l.withdraw_limit.lower">{{l.withdraw_limit.upper}} 以下</div>
                        <div  v-show="!l.withdraw_limit.upper">{{l.withdraw_limit.lower}} 以上</div>
                        <div v-show="l.withdraw_limit.upper && l.withdraw_limit.lower">{{l.withdraw_limit.lower}} 至 {{l.withdraw_limit.upper}}</div>
                    </div>
                    <div v-else>
                        <span>{{$t('common.not_set')}}</span>
                    </div>
                </td>
                <td>
                    {{l.withdraw_fee.rate}}
                </td>
                <td>
                    <div v-if="l.withdraw_fee.type == 2">{{l.withdraw_fee.hour}} {{$t('level.hour')}} {{l.withdraw_fee.times}} {{$t('level.times')}}</div>
                    <div v-else-if="l.withdraw_fee.type == 0">{{$t('level.free')}}</div>
                    <div v-else-if="l.withdraw_fee.type == 1">{{$t('level.everytime')}}</div>
                </td>
                <td class="text-sm">
                    <router-link tag="div" v-show="l.online_discounts" :to="'/level/' + l.id">{{$t('bill.remit')}}：
                        <a v-if="l.remit_discounts">{{l.remit_discounts.length}} {{$t('level.level_settings')}}</a>
                        <span class="text-muted" v-else>{{$t('common.not_set')}}</span>
                    </router-link>
                    <router-link tag="div" v-show="l.online_discounts" :to="'/level/' + l.id">{{$t('bill.onlinepay')}}：
                        <a v-if="l.online_discounts">{{l.online_discounts.length}} {{$t('level.level_settings')}}</a>
                        <span class="text-muted" v-else>{{$t('common.not_set')}}</span>
                    </router-link>
                </td>
                <td>
                  <span class="label success" v-if="l.report_flag">{{$t('status.active')}}</span>
                  <span class="label danger" v-else>{{$t('status.inactive')}}</span>
                </td>
                <td>
                    <router-link v-if="l.member_count !== 0" :to="'/member/?level=' + l.id ">{{l.member_count }}</router-link>
                    <span v-else>{{l.member_count }}</span>
                </td>
              </tr>
              </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import api from '../../api'

export default {
    data () {
        return {
            'levels': []
        }
    },
    created () {
        this.getLevels()
    },
    methods: {
        getLevels () {
            this.$http.get(api.level).then((response) => {
                this.levels = response.data.data
            })
        }
    }
}
</script>
