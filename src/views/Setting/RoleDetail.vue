<template>
    <div>
        <div class="m-b">
            <ol class="breadcrumb">
                <li class="active"><router-link to="/roles">{{ $t('title.role_management') }}</router-link></li>
                <li class="active">{{ $route.meta.title }}</li>
            </ol>
        </div>
        <div class="box">
            <div class="box-header b-b">
                <div class="row">
                    <div class="col-md-4">
                        <h2 class="v-m m-t-sm">{{ role.name }}</h2>
                    </div>
                    <div class="col-md-5 col-md-offset-3 text-right">
                        <router-link class="md-btn md-flat m-r-sm" :to="`/roles/${role.id}/edit`" v-if="$root.permissions.includes('update_role_name_advpermission')">{{ $t('dic.update') }}</router-link>
                        <a class="md-btn md-flat m-r-sm" @click="deleteRole(role.id)" v-if="role.id!==4 && $root.permissions.includes('remove_role')">{{ $t('dic.delete') }}</a>
                    </div>
                </div>
            </div>
            <div class="box-body">
                <div class="row m-b p-b b-b">
                    <div class="col-xs-9">
                        <span class="text-muted">{{ $t('title.role_detail') }}</span>
                        <table class="table b-a m-t-sm">
                            <tbody>
                                <tr>
                                    <th class="grey-50" width="130">{{ $t('title.role_name') }}</th>
                                    <td>{{ role.name }}</td>
                                </tr>
                                <tr>
                                    <th class="grey-50">{{ $t('dic.permission') }}</th>
                                    <td>
                                        <template v-for="list in role.manage_permissiongroup">
                                            <div class="row" :key="`name${list.id}`">
                                                <div class="col-sm-12 p-b"> 
                                                    <strong>{{ list.display_name }}</strong>
                                                </div>
                                            </div>
                                            <div class="row" :key="`adv${list.id}`">
                                                <div class="col-sm-offset-1 col-sm-11 p-b" v-for="permission in list.advpermissions" :key="permission.id">
                                                    <i v-if="permission.checked" class="fa fa-check text-success"></i>   
                                                    <i v-else class="fa fa-times text-danger"></i>
                                                    <span>{{ permission.display_name }}</span>
                                                    <span class="text-muted ">- {{ permission.description }}</span>
                                                </div>
                                            </div>
                                        </template>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { getSetting, deleteSetting } from '../../service'
export default {
    data () {
        return {
            role: {
                id: undefined,
                name: '',
                manage_permissiongroup: []
            }
        }
    },
    created () {
        this.getRole(this.$route.params.roleId)
    },
    methods: {
        getRole (id) {
            getSetting('role', {
                id,
                params: {
                    opt_expand: 'group,permissions'
                }
            }).then(data => {
                this.role = data
            })
        },
        deleteRole (id) {
            if (window.confirm(this.$t('system_msg.confirm_action_object', {
                action: this.$t('dic.delete'),
                object: this.$t('dic.role')
            }))) {
                deleteSetting('role', id, {
                    action: this.$t('dic.delete'),
                    object: this.$t('dic.role')
                }).then(() => {
                    this.$router.push('/roles')
                })
            }
        }
    }
}
</script>
<style scoped>
</style>
