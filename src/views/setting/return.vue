<template>
    <div>
        <div class="m-b" v-if="$root.permissions.includes('change_returnrate')" >
            <router-link tag="button" class="md-btn w-sm blue" to="/return/add">{{$t('setting.setting_return_add_btn')}}</router-link>
        </div>
        <div class="box">
            <table class="table table-striped b-t">
                <thead>
                    <tr>
                        <th>{{$t('common.name')}}</th>
                        <th>{{$t('common.status')}}</th>
                        <th>{{$t('setting.setting_return_ratio_count')}}</th>
                        <th>{{$t('common.member_count')}}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="setting in returnsettings" >
                        <td><router-link :to="'/return/' + setting.id + '/edit'">{{setting.name}}</router-link></td>
                        <td>
                            <span class="label success" v-if="setting.status==1" >{{$t('status.active')}}</span>
                            <span class="label danger" v-if="setting.status==0">{{$t('status.disabled')}}</span>
                            <template v-if="$root.permissions.includes('change_returnrate')" >
                                <a class="text-sm m-l" @click="toggleStatus(setting)" v-if="setting.status==1" >{{$t('status.inactive')}}</a>
                                <a class="text-sm m-l" @click="toggleStatus(setting)" v-else >{{$t('status.active')}}</a>
                            </template>
                        </td>
                        <td>{{setting.group_count}}</td>
                        <td>
                            <router-link v-if="setting.member_count !== 0" :to="'/member/?return_settings=' + setting.id ">{{setting.member_count}}</router-link>
                            <span v-else>{{setting.member_count}}</span>
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
            'returnsettings': []
        }
    },
    created () {
        this.getReturnsettings()
    },
    methods: {
        toggleStatus (setting) {
            this.$http.put(api.return + setting.id + '/', {
                'status': setting.status === 0 ? 1 : 0
            }).then((response) => {
                setting.status = response.data.status
            })
        },
        getReturnsettings () {
            this.$http.get(api.return + '?opt_fields=id,name,status,member_count,group_count').then((response) => {
                this.returnsettings = response.data.data
            })
        }
    }
}
</script>
