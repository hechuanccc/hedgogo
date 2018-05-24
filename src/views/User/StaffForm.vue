<template>
    <div>
        <div class="m-b">
            <ol class="breadcrumb">
                <li class="active"><router-link to="/staff">{{ $t('nav.staff') }}</router-link></li>
                <li class="active">{{ $route.meta.title }}</li>
            </ol>
        </div>
        <div class="box">
            <div class="box-body">
                <form class="form m-a" v-on:submit.prevent="onSubmit">
                    <div class="row b-b p-b m-b">
                        <div class="col-md-10">
                            <div class="form-group">
                                <label for="username" class="label-width">{{ $t('staff.staff_name') }}</label>
                                <div class="inline-form-control">
                                    <input type="text" class="form-control" name="username" :placeholder="$t('common.username')" v-model="staff.username" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="password" class="label-width">{{ (staff.id ? $t('action.update') : '') + $t('staff.password')}}</label>
                                <div class="inline-form-control">
                                    <input
                                        type="password"
                                        class="form-control"
                                        name="password"
                                        :placeholder="$t('staff.password')"
                                        v-model="staff.password"
                                        :disabled="!updateStaffPermission('password')"
                                        :required="!staff.id"
                                    >
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="email" class="label-width">{{$t('staff.email')}}</label>
                                <div class="inline-form-control">
                                    <input
                                        type="email"
                                        class="form-control"
                                        name="email"
                                        :placeholder="$t('staff.email')"
                                        v-model="staff.email"
                                        :disabled="!updateStaffPermission('role_mail')"
                                    >
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="role" class="label-width">{{$t('staff.role')}}</label>
                                <div class="inline-form-control">
                                    <select
                                        class="form-control w-sm c-select"
                                        name="role"
                                        v-model="staff.user_group.id"
                                        @change="changeRole"
                                        :placeholder="$t('common.please_select') + $t('staff.role')"
                                        :disabled="!updateStaffPermission('role_mail')"
                                    >
                                        <option class="form-control" value="">{{ $t('common.please_select') + $t('staff.role') }}</option>                                        
                                        <option class="form-control" :value="r.id" v-for="r in roles" :key="r.id">{{ r.name }}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="label-width">{{$t('staff.permission')}}</label>
                                <div class="box" v-if="permissions.length">
                                    <template v-for="(list, index) in permissions">
                                        <div class="row">
                                            <div class="col-sm-offset-1 col-sm-11 p-t"><strong>{{ list.display_name }}</strong></div>
                                        </div>
                                        <div class="row">
                                            <div class="col-sm-offset-2 col-sm-10 p-b" v-for="permission in list.advpermissions" :key="permission.id">
                                                <i v-if="permission.checked" class="fa fa-check text-success"></i>   
                                                <i v-else class="fa fa-times text-danger"></i>
                                                <span>{{ permission.display_name }}</span>
                                                <span class="text-muted" v-if="permission.description">- {{ permission.description }}</span>
                                            </div>
                                        </div>
                                    </template>
                                </div>
                                <div class="alert alert-warning" v-else>
                                    <span><i class="fa fa-warning"></i> {{ $t('staff.no_select_group') }}</span>
                                </div>
                            </div>
                            <div class="form-group" >
                                <label for="memo">{{$t('common.memo')}}</label>
                                <textarea class="form-control" name="memo" rows="5" cols="12" :placeholder="$t('common.memo')" v-model="staff.memo"></textarea>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="alert alert-danger" v-if="errorMsg">{{ errorMsg }}</div>
                        <button type="submit" class="md-btn w-sm blue">{{$t('common.save')}}</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
<script>
import api from '../../api'
export default {
    data () {
        return {
            staff: {
                id: '',
                username: '',
                password: '',
                email: '',
                user_group: {
                    id: '',
                    name: ''
                }
            },
            permissions: [],
            roles: [],
            errorMsg: ''
        }
    },
    created () {
        this.getRoles()
        if (this.$route.params.staffId) {
            this.getStaff(this.$route.params.staffId)
        } else {
            this.permissions = []
        }
    },
    methods: {
        updateStaffPermission (field) {
            return this.$route.name === 'staff_edit' ? this.$root.permissions.includes(`update_staff_${field}`) : this.$root.permissions.includes('add_new_staff')
        },
        onSubmit (e) {
            let staffResult = Object({
                username: this.staff.username,
                group: this.staff.user_group.id,
                email: this.staff.email,
                memo: this.staff.memo
            })
            if (!this.staff.user_group.id) {
                this.errorMsg = this.$t('staff.no_select_group')
                return
            }
            if (this.staff.password) {
                staffResult = Object({
                    ...staffResult,
                    password: this.staff.password
                })
            }
            if (this.staff.id) {
                this.$http.put(api.staff + this.staff.id + '/', staffResult).then(data => {
                    this.$router.push('/staff/' + data.id)
                }, error => {
                    this.errorMsg = error
                })
            } else {
                this.$http.post(api.staff, staffResult).then(data => {
                    this.$router.push('/staff/' + data.id)
                }, error => {
                    this.errorMsg = error
                })
            }
        },
        getStaff (id) {
            this.$http.get(api.staff + id + '/?opt_expand=group,permissions').then(data => {
                this.staff = Object.assign(this.staff, data)
                if (data.user_group) {
                    this.permissions = data.user_group.permissions
                } else {
                    this.staff.user_group.id = ''
                }
            }, error => {
                this.errorMsg = error
            })
        },
        getRoles () {
            this.$http.get(api.managerole + '?opt_expand=group,permissions').then(data => {
                this.roles = data
            }, error => {
                this.errorMsg = error
            })
        },
        changeRole () {
            if (this.staff.user_group.id) {
                this.permissions = this.roles.find(role => role.id === this.staff.user_group.id).manage_permissiongroup
            } else {
                this.permissions = []
            }
        }
    }
}
</script>
<style scoped>
</style>
