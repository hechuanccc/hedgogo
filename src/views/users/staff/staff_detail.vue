<template>
    <div>
        <div class="m-b">
            <ol class="breadcrumb">
                <li class="active"><router-link to="/staff">{{$t('nav.staff')}}</router-link></li>
                <li class="active" >{{$route.meta.title}}</li>
            </ol>
        </div>
        <div class="alert alert-success" v-if="passwordSuccess">
            <span>{{$t('action.login_password_changed')}}</span>
            <strong>{{newPassword}}</strong>
        </div>
        <div class="alert alert-danger" v-if="passwordError">
            修改失败：{{passwordError}}
        </div>
        <div class="box">
            <div class="box-header b-b">
                <div class="row">
                    <div class="col-md-4">
                        <h2 class="v-m m-t-sm">{{staff.username}}</h2>
                    </div>
                    <div class="col-md-5 col-md-offset-3 text-right" v-if="$root.permissions.includes('add_change_staff')">
                        <router-link class="md-btn md-flat m-r-sm" to="/staff/add">{{$t('action.create')}}</router-link>
                        <router-link class="md-btn md-flat m-r-sm" :to="'/staff/' + staff.id + '/edit'">{{$t('action.update')}}</router-link>
                        <a class="md-btn md-flat m-r-sm" @click="resetPassword($event)">{{$t('action.reset_password')}}</a>
                        <a class="md-btn md-flat m-r-sm" @click="deleteStaff(staff.id, true, $event)">{{$t('action.delete')}}</a>
                    </div>
                </div>
            </div>
            <div class="box-body">
                <div class="row m-b p-b b-b">
                    <div class="col-xs-9">
                        <span class="text-muted">{{$t('staff.staff_info')}}</span>
                        <table class="table b-a m-t-sm">
                            <tbody>
                                <tr>
                                    <th class="grey-50" width="130">{{$t('staff.account')}}</th>
                                    <td>{{staff.username}}</td>
                                </tr>
                                <tr>
                                    <th class="grey-50" width="130">{{$t('staff.role')}}</th>
                                    <td>{{staff.group.name}}</td>
                                </tr>
                                <tr>
                                    <th class="grey-50" width="130">{{$t('staff.email')}}</th>
                                    <td v-if="staff.email!==null">{{staff.email}}</td>
                                    <td v-else>{{$t('staff.no_setting')}}</td>
                                </tr>
                                <tr>
                                    <th class="grey-50">{{$t('staff.permission')}}</th>
                                    <td>
                                        <!-- <ul class="ul-padding-vertical-05 permissions-list" id="">
                                            <li v-for="permission in permissions" class="ng-binding ng-scope">
                                                <i class="fa text-danger">x</i>
                                                {{permission.display_name}}
                                                <span class="text-muted ng-binding">
                                                    - {{permission.description}}
                                                </span>
                                            </li>
                                        </ul> -->
                                        <template v-for="(list, index) in permissionsList">
                                            <div class="row" :key="list.id">
                                                <div class="col-sm-12 p-b"> 
                                                    <strong>{{ list.display_name }}</strong>
                                                </div>
                                            </div>
                                            <div class="row" :key="list.id">
                                                <div class="col-sm-offset-1 col-sm-11 p-b" v-for="permission in list.permissions" :key="permission.id">
                                                    <i v-if="permission.checked" class="fa fa-check text-success"></i>   
                                                    <i v-else class="fa fa-times text-danger"></i>
                                                    <span>{{ permission.display_name }}</span>
                                                    <span class="text-muted ">- {{ permission.description }}</span>
                                                </div>
                                            </div>
                                        </template>
                                    </td>
                                </tr>
                                <tr>
                                    <th class="grey-50">{{$t('common.memo')}}</th>
                                    <td>{{staff.memo}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="row p-t">
                    <div class="col-xs-5">
                        <span class="text-muted">{{$t('staff.status')}}</span>
                        <div>
                            <span class="label success" v-if="staff.status==1" >{{$t('status.active')}}</span>
                            <span class="label" v-else >{{$t('status.inactive')}}</span>
                            <template v-if="$root.permissions.includes('add_change_staff')">
                                <a class="text-sm m-l" @click="toggleStatus" v-if="staff.status==1" >禁用</a>
                                <a class="text-sm m-l" @click="toggleStatus" v-else >启用</a>
                            </template>
                            <span class="text-success text-sm m-l" v-show="statusUpdated" @click="toggleStatus">状态已更新</span>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import api from '../../../api'
    export default {
        data () {
            return {
                staff: {
                    id: '',
                    group: {}
                },
                statusUpdated: false,
                passwordSuccess: false,
                permissions: [],
                permissionsList: [],
                passwordError: '',
                permissionsId: []
            }
        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                let id = to.params.staffId
                if (id) {
                    vm.getStaff(id)
                    vm.getPermissions(id)
                    vm.getStaffPermissionsList(id)
                }
            })
        },
        methods: {
            getStaff (id) {
                this.$http.get(api.staff + id + '/?opt_expand=group').then((response) => {
                    this.staff = response.data
                })
            },
            getPermissions (id) {
                this.$http.get(api.staff + id + '/?opt_expand=group,permissions').then((response) => {
                    this.permissions = response.data.permissions
                    this.getSelect()
                })
            },
            getStaffPermissionsList (id) {
                this.$http.get(api.staffPermissions + id + '/?opt_expand=permissions').then((response) => {
                    this.permissionsList = response.data.permissions
                })
            },
            getSelect () {
                let selectId = []
                for (let list in this.permissions) {
                    selectId.push(this.permissions[list].id)
                }
                this.permissionsId = selectId
            },
            toggleStatus () {
                this.statusUpdated = false
                this.$http.put(api.staff + this.staff.id + '/?opt_fields=status', {
                    status: this.staff.status === 1 ? 0 : 1,
                    permissions: this.permissionsId
                }).then((response) => {
                    if (response.status === 200) {
                        this.staff.status = response.data.status
                        this.statusUpdated = true
                        setTimeout(() => {
                            this.statusUpdated = false
                        }, 2000)
                    }
                })
            },
            resetPassword (event) {
                if (!window.confirm(this.$t('member.reset_confirm', {
                    action: event.target.innerText
                }))) {
                    return
                }
                this.$http.post(api.passwordstaff, {
                    'account_id': this.staff.id
                }, {emulateJSON: true}).then(response => {
                    this.passwordSuccess = true
                    this.newPassword = response.data.new_password
                }, response => {
                    this.passwordError = response.data.error
                })
            },
            deleteStaff (id, confirm, event) {
                if (confirm) {
                    if (!window.confirm(this.$t('common.confirm', {
                        action: event.target.innerText
                    }))) {
                        return
                    }
                }
                this.$http.delete(api.staff + id + '/').then((response) => {
                    this.$router.push('/staff')
                })
            }
        }
    }
</script>

<style scoped>
     .permissions-list{
         list-style:none;
         padding-left:0;
         margin-bottom:0;
     }
     .ul-padding-vertical-05 > li {
        padding: 0.5em 0;
     }
</style>
