<template>
    <div>
        <div class="m-b">
            <ol class="breadcrumb">
                <li class="active"><router-link to="/staff">{{$t('nav.staff')}}</router-link></li>
                <li class="active">{{$route.meta.title}}</li>
            </ol>
        </div>
        <div class="alert alert-danger" v-if="!$root.permissions.includes('add_change_staff')">{{$t('common.errorPermission')}}</div>
        <div class="box">
            <div class="box-body">
                <form class="form m-a" v-on:submit.prevent="onSubmit">
                    <div class="row b-b p-b m-b">
                        <div class="col-md-10">
                            <div class="form-group">
                                <label for="username" class="label-width">{{$t('staff.staff_name')}}</label>
                                <div class="inline-form-control">
                                    <input type="text" class="form-control" name="username" :placeholder="$t('common.username')" v-model="staff.username" required>
                                </div>
                            </div>
                            <div class="form-group" v-if="!staff.id">
                                <label for="password" class="label-width">{{$t('staff.password')}}</label>
                                <div class="inline-form-control">
                                    <input type="password" class="form-control" name="password" :placeholder="$t('staff.password')" v-model="staff.password">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="role" class="label-width">{{$t('staff.role')}}</label>
                                <div class="inline-form-control">
                                    <select class="form-control w-sm c-select" name="role" v-model="staff.user_group.id">
                                        <option class="form-control" :value="r.id" v-for="r in roles" :key="r.id">{{ r.name }}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="email" class="label-width">{{$t('staff.email')}}</label>
                                <div class="inline-form-control">
                                    <input type="email" class="form-control" name="email" :placeholder="$t('staff.email')" v-model="staff.email">
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="label-width">{{$t('staff.permission')}}</label>
                                <div class="box">
                                    <template v-for="(list, index) in permissions">
                                        <div class="row">
                                            <div class="col-sm-offset-1 col-sm-11 p-t">{{ list.display_name }}</div>
                                        </div>
                                        <div class="row">
                                            <div class="col-sm-offset-2 col-sm-10 p-b" v-for="permission in list.permissions" :key="permission.id">
                                                <i v-if="staffAdvpermissionsList.includes(permission.id)" class="fa fa-check text-success"></i>   
                                                <i v-else class="fa fa-times text-danger"></i>
                                                <span>{{ permission.display_name }}</span>
                                                <span class="text-muted ">- {{ permission.description }}</span>
                                            </div>
                                        </div>
                                    </template>
                                </div>
                            </div>

                            <div class="modal" v-if="showModal">
                                <div class="modal-backdrop fade in" ></div>
                                <div class="modal-dialog">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <button type="button" class="close" data-dismiss="modal" aria-hidden="true" @click="showModal=!showModal">×
                                            </button>
                                            <h4 class="modal-title" id="myModalLabel">{{$t('staff.select_permission_group')}}</h4>
                                        </div>
                                        <div class="modal-body">
                                            <button type="button" class="btnQuick btn btn-default btn-sm" @click="selectAll()">{{$t('staff.select_all')}}</button>
                                            <button type="button" class="btnQuick btn btn-default btn-sm" @click="clearSelectAll()">{{$t('staff.deselect_all')}}</button>
                                            <span class="ng-scope">
                                                <button type="button" class="btnQuick btn btn-default btn-sm ng-binding" @click="getManager()">{{$t('staff.webmster_permission')}}</button>
                                            </span>
                                            <span class="ng-scope">
                                                <button type="button" class="btnQuick btn btn-default btn-sm ng-binding" @click="getManager1()">{{$t('staff.account_permission')}}</button>
                                            </span>
                                            <span class="ng-scope">
                                                <button type="button" class="btnQuick btn btn-default btn-sm ng-binding" @click="getManager2()">{{$t('staff.customer_service')}}</button>
                                            </span>
                                            <span class="ng-scope">
                                                 <button type="button" class="btnQuick btn btn-default btn-sm ng-binding" @click="getManager3()">{{$t('staff.technical_customer_service')}}</button>
                                            </span>
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-default" data-dismiss="modal" @click="showModal=!showModal">{{$t('staff.close')}}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group" >
                                <label for="memo">{{$t('common.memo')}}</label>
                                <textarea class="form-control" name="memo" rows="5" cols="12" :placeholder="$t('common.memo')" v-model="staff.memo"></textarea>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="alert alert-danger" v-if="errorMsg">{{errorMsg}}</div>
                        <button :disabled="!$root.permissions.includes('add_change_staff')" type="submit" class="md-btn w-sm blue">{{$t('common.save')}}</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
<script>
import api from '../../../api'
import { handleError } from '../../../utils/handleError'
export default {
    data () {
        return {
            staff: {
                id: '',
                username: '',
                password: '',
                user_group: {
                    id: undefined,
                    permissions: []
                },
                email: ''
            },
            permissions: [],
            staffAdvpermissionsList: [],
            field_locales: {
                'username': '用户名错误：',
                'permission': '权限错误：',
                'email': '邮箱错误：'
            },
            roles: [],
            creating: false,
            errorMsg: '',
            showModal: false
        }
    },
    created () {
        this.getRoles()
        this.getPermissionsAll()
        if (this.$route.params.staffId) {
            this.getStaff(this.$route.params.staffId).then((staff) => {
                this.getStaffAdvpermissionsList(staff)
            })
        } else {
            this.staffAdvpermissionsList = []
        }
    },
    methods: {
        onSubmit (e) {
            if (this.staff.id) {
                for (let x in this.staff) {
                    if (!this.staff[x]) {
                        delete this.staff[x]
                    }
                }
                this.getSelect()
                this.$http.put(api.staff + this.staff.id + '/', this.staff).then(response => {
                    if (response.status === 200) {
                        this.$router.push('/staff/' + response.data.id)
                    }
                })
            } else {
                this.getSelect()
                this.$http.post(api.staff, this.staff).then(response => {
                    if (response.status === 201) {
                        this.$router.push('/staff/' + response.data.id)
                    }
                }, response => {
                    this.errorMsg = ''
                    for (let field in this.field_locales) {
                        this.errorMsg += handleError(response, field, this.field_locales)
                    }
                })
            }
        },
        getStaff (id) {
            return new Promise((resolve, reject) => {
                this.$http.get(api.staff + id + '/?opt_expand=group').then((response) => {
                    if (response.data.code === 2000) {
                        this.staff = response.data.data
                        resolve(response.data.data)
                    } else {
                        reject(response.data)
                    }
                })
            })
        },
        getStaffAdvpermissionsList (staff) {
            staff.user_group.permissions.forEach(list => {
                list.advpermissions.forEach(permission => {
                    this.staffAdvpermissionsList.push(permission.id)
                })
            })
        },
        getPermissionsAll () {
            this.$http.get(api.permissions + '?opt_expand=permissions').then((response) => {
                this.permissions = response.data.data
            })
        },
        getRoles () {
            this.$http.get(api.managerole).then((response) => {
                if (response.data.code === 2000) {
                    this.roles = response.data.data
                }
            })
        },
        getSelect () {
            let selectId = []
            for (let list in this.permissionsList) {
                for (let index in this.permissionsList[list].permissions) {
                    if (this.permissionsList[list].permissions[index].checked) {
                        selectId.push(this.permissionsList[list].permissions[index].id)
                    }
                }
            }
            this.staff.permissions = selectId
        },
        setRolePermission (permission) {
            this.clearSelectAll()
            for (let list in this.permissionsList) {
                for (let index in this.permissionsList[list].permissions) {
                    if (permission.includes(this.permissionsList[list].permissions[index].id)) {
                        this.permissionsList[list].permissions[index].checked = 1
                    }
                }
            }
        }

    }
}
</script>
<style scoped>
    .modal-backdrop, .modal{z-index: 1}
    .modal-dialog{z-index: 10;top: 10%}
        .modal{display: block;}
</style>
