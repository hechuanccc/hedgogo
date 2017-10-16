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
                                    <input type="text" class="form-control" name="username" :placeholder="$t('common.username')" v-model="staff.username" required :disabled="!isCreating">
                                </div>
                            </div>
                            <div class="form-group" v-if="isCreating">
                                <label for="password" class="label-width">{{$t('staff.password')}}</label>
                                <div class="inline-form-control">
                                    <input type="password" class="form-control" name="password" :placeholder="$t('staff.password')" v-model="staff.password">
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="permission" class="label-width">{{$t('staff.role')}}</label>
                                <div class="inline-form-control">
                                    <select class="form-control w-sm c-select" name="permission" v-model="staff.group" :disabled="!$root.permissions.includes('add_change_staff')">
                                        <option class="form-control" :value="r.id" v-for="r in roles">{{r.name}}</option>
                                    </select>
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="" class="label-width">{{$t('staff.permission')}}</label>
                                <a @click="showModal=!showModal">{{$t('staff.quick_selection')}}</a>
                                <div class="form-control">
                                    <template v-for="(list, index) in permissionsList">
                                        <div class="row">
                                            <div class="col-sm-12">
                                                <div class="checkbox">
                                                    <label>
                                                        <input type="checkbox" v-model="list.checked" :checked="selectMax"  :disabled="!$root.permissions.includes('add_change_staff')" @click="toggleSelect(list)" >
                                                        <strong class=""> {{list.display_name}} </strong>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-sm-offset-1 col-sm-11" v-for="permission in list.permissions">
                                                <div class="checkbox">
                                                    <label>
                                                        <input type="checkbox" :disabled="!$root.permissions.includes('add_change_staff')"  v-model="permission.checked">
                                                        <span class="">{{permission.display_name}}</span>
                                                        <span class="text-muted ">- {{permission.description}}</span>
                                                        &nbsp&nbsp&nbsp&nbsp;
                                                        <span class="text-danger "></span>
                                                    </label>
                                                </div>
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
    import api from '../../api'
    import { handleError } from '../../utils/handleError'
    export default {
        data () {
            return {
                staff: {
                    id: '',
                    username: '',
                    password: '',
                    group: '',
                    permissions: []
                },
                permissionsList: [],
                staffPermissions: [],
                field_locales: {
                    'username': '用户名错误：',
                    'permission': '权限错误：'
                },
                roles: '',
                creating: false,
                errorMsg: '',
                showModal: false
            }
        },
        computed: {
            isCreating () {
                let action = this.staff.id === '' ? this.creating = true : this.creating = false
                return action
            },
            selectMax () {
                for (let list in this.permissionsList) {
                    this.permissionsList[list].checked = this.permissionsList[list].permissions.every(function (permission) {
                        return permission.checked
                    })
                }
            }
        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                let id = to.params.staffId
                if (id) {
                    vm.getStaff(id)
                    vm.getStaffPermissionsList(id)
                } else {
                    vm.getPermissionsListAll()
                }
            })
        },
        created () {
            this.getRole()
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
                this.$http.get(api.staff + id + '/').then((response) => {
                    this.staff = response.data
                })
            },
            getPermissionsListAll () {
                this.$http.get(api.permissions + '?opt_expand=permissions').then((response) => {
                    this.permissionsList = response.data
                })
            },
            getStaffPermissionsList (id) {
                this.$http.get(api.staffPermissions + id + '/?opt_expand=permissions').then((response) => {
                    this.permissionsList = response.data.permissions
                })
            },
            toggleSelect (list) {
                list.permissions.forEach(function (permission) {
                    permission.checked = list.checked
                })
            },
            getRole () {
                this.$http.get(api.managerole).then((response) => {
                    this.roles = response.data
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
            selectAll () {
                for (let list in this.permissionsList) {
                    this.permissionsList[list].checked = 1
                    for (let index in this.permissionsList[list].permissions) {
                        this.permissionsList[list].permissions[index].checked = 1
                    }
                }
            },
            clearSelectAll () {
                for (let list in this.permissionsList) {
                    this.permissionsList[list].checked = 0
                    for (let index in this.permissionsList[list].permissions) {
                        this.permissionsList[list].permissions[index].checked = 0
                    }
                }
            },
            getManager () {
                let permission = [11, 10, 9, 1, 7, 6, 5, 4, 3, 37, 36, 22, 19, 17, 15, 14, 13, 35, 34, 33, 32, 31, 30, 29, 26, 24, 23, 27, 16, 20, 18]
                this.setRolePermission(permission)
            },
            getManager1 () {
                let permission = [17, 14, 13]
                this.setRolePermission(permission)
            },
            getManager2 () {
                let permission = [1, 36, 22, 19, 17, 14, 13]
                this.setRolePermission(permission)
            },
            getManager3 () {
                let permission = [12, 2, 8, 37, 36, 22, 13, 26, 16, 20, 18]
                this.setRolePermission(permission)
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
