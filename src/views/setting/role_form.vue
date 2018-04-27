<template>
    <div>
        <div class="m-b">
            <ol class="breadcrumb">
                <li class="active"><router-link to="/roles">{{ $t('nav.roles') }}</router-link></li>
                <li class="active">{{ $route.meta.title }}</li>
            </ol>
        </div>
        <div class="box">
            <div class="box-body">
                <form class="form m-a" v-on:submit.prevent="onSubmit">
                    <div class="row b-b p-b m-b">
                        <div class="col-md-10">
                            <div class="form-group">
                                <label for="name" class="label-width">{{ $t('role_manage.name') }}</label>
                                <div class="inline-form-control">
                                    <input type="text" class="form-control" name="name" v-model="role.name" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="" class="label-width">{{ $t('role_manage.role_permission') }}</label>
                                <div class="form-control">
                                    <template v-for="(list, index) in permissions">
                                        <div class="row">
                                            <div class="col-sm-12">
                                                <div class="checkbox">
                                                    <label>
                                                        <input type="checkbox" v-model="list.checked" :checked="selectMax" @click="toggleSelect(list, list.checked^1)">
                                                        <strong> {{ list.display_name }}</strong>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-sm-offset-1 col-sm-11" v-for="advpermission in list.advpermissions">
                                                <div class="checkbox">
                                                    <label>
                                                        <input type="checkbox" v-model="advpermission.checked">
                                                        <span class="">{{ advpermission.display_name }}</span>
                                                        <span class="text-muted">- {{ advpermission.description }}</span>
                                                        <span class="text-danger"></span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="alert alert-danger" v-if="errorMsg">{{ errorMsg }}</div>
                        <button type="submit" class="md-btn w-sm blue">{{ $t('common.save') }}</button>
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
            role: {
                id: undefined,
                name: ''
            },
            selectId: [[], []],
            permissions: [],
            errorMsg: ''
        }
    },
    computed: {
        selectMax () {
            this.permissions.forEach(list => {
                list.checked = list.advpermissions.every(advpermission => advpermission.checked)
            })
        }
    },
    created () {
        if (this.$route.params.roleId) {
            this.getRole(this.$route.params.roleId)
        } else {
            this.getPermissionsAll()
        }
    },
    methods: {
        getRole (id) {
            this.$http.get(api.managerole + id + '/?opt_expand=group,permissions').then(data => {
                this.role = data
                this.permissions = data.manage_permissiongroup
            })
        },
        onSubmit (e) {
            this.getSelect()
            let roleResult = {
                name: this.role.name,
                manage_permissiongroup: this.selectId[0],
                permissions: this.selectId[1]
            }
            if (this.role.id) {
                this.$http.put(api.managerole + this.role.id + '/?opt_expand=group,permissions', roleResult).then(data => {
                    this.$router.push('/roles/' + data.id)
                }, error => {
                    this.errorMsg = error
                })
            } else {
                this.$http.post(api.managerole + '?opt_expand=group,permissions', roleResult).then(data => {
                    this.$router.push('/roles/' + data.id)
                }, error => {
                    this.errorMsg = error
                })
            }
        },
        getPermissionsAll () {
            this.$http.get(api.permissions + '?opt_expand=permissions').then(data => {
                this.permissions = data
            }, error => {
                this.errorMsg = error
            })
        },
        toggleSelect (list, value) {
            list.checked = value
            list.advpermissions.forEach((advpermission) => {
                advpermission.checked = value
            })
        },
        getSelect () {
            let selectId = [[], []]
            this.permissions.forEach(permissionGroup => {
                if (permissionGroup.checked) {
                    selectId[0].push(permissionGroup.id)
                } else {
                    permissionGroup.advpermissions.forEach(advpermission => {
                        if (advpermission.checked) {
                            selectId[1].push(advpermission.id)
                        }
                    })
                }
            })
            this.selectId = selectId
        }
    }
}
</script>
<style scoped>
</style>
