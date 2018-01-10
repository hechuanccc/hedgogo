<template>
    <div>
        <div class="m-b" v-if="$root.permissions.includes('add_commission_setting')">
            <router-link tag="button" class="md-btn blue w-sm" to="/commission/add">{{$t('setting.setting_commission_add_btn')}}</router-link>
        </div>
        <div class="box">
            <table class="table table-striped b-t">
                <thead>
                    <tr>
                        <th>{{$t('common.name')}}</th>
                        <th>{{$t('common.status')}}</th>
                        <th>{{$t('setting.min_member_bet_amt')}}</th>
                        <th>{{$t('setting.max_deposit')}}</th>
                        <th>{{$t('setting.max_withdraw')}}</th>
                        <th>{{$t('common.agent_count')}}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="setting in commissionsettings" >
                        <td><router-link :to="'/commission/' + setting.id + '/edit'">{{setting.name}}</router-link></td>
                        <td>
                            <span class="label success" v-if="setting.status==1">{{$t('status.active')}}</span>
                            <span class="label danger" v-if="setting.status==0">{{$t('status.disabled')}}</span>
                            <template v-if="$root.permissions.includes('update_commission_setting_status')">
                                <a class="text-sm m-l" @click="toggleStatus(setting)" v-if="setting.status==1" >{{$t('status.inactive')}}</a>
                                <a class="text-sm m-l" @click="toggleStatus(setting)" v-else >{{$t('status.active')}}</a>
                            </template>
                        </td>
                        <td>{{setting.invest_least}}</td>
                        <td>{{setting.deposit_fee}} <span v-if="deposit_fee_max">上限：{{setting.deposit_fee_max}}</span></td>
                        <td>{{setting.withdraw_fee}} <span v-if="withdraw_fee_max">上限：{{setting.withdraw_fee_max}}</span></td>
                        <td>
                            <router-link v-if="setting.agent_count !== 0" :to="'/agent/?commission_settings=' + setting.id ">{{setting.agent_count}}</router-link>
                            <span v-else>{{setting.agent_count}}</span>
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
            tips: [],
            commissionsettings: [],
            deposit_fee_max: '',
            withdraw_fee_max: ''
        }
    },
    created () {
        this.getCommissionsettings()
    },
    methods: {
        toggleStatus (setting) {
            this.$http.put(api.commission + setting.id + '/', {
                'status': setting.status === 0 ? 1 : 0
            }).then(data => {
                setting.status = data.status
            })
        },
        getCommissionsettings () {
            let fields = '?opt_fields=invest_least,id,name,status,deposit_fee,deposit_fee_max,withdraw_fee,withdraw_fee_max,member_count,agent_count'
            this.$http.get(api.commission + fields).then(data => {
                this.commissionsettings = data
            })
        }
    }
}
</script>
