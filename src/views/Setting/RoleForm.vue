<template>
    <div>
        <div class="m-b">
            <ol class="breadcrumb">
                <li class="active"><router-link to="/roles">{{ $t('title.role_management') }}</router-link></li>
                <li class="active">{{ $route.meta.title }}</li>
            </ol>
        </div>
        <div class="box">
            <div class="box-body">
                <form class="form m-a" v-on:submit.prevent="onSubmit">
                    <div class="row b-b p-b m-b">
                        <div class="col-md-10">
                            <div class="form-group">
                                <label for="name" class="label-width">{{ $t('title.role_name') }}</label>
                                <div class="inline-form-control">
                                    <input type="text" class="form-control" name="name" v-model="role.name" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="" class="label-width">{{ $t('dic.permission') }}</label>
                                <div class="form-control">
                                    <template v-for="(list, index) in permissions">
                                        <div class="row" :key="'group_' + index">
                                            <div class="col-sm-12">
                                                <div class="checkbox">
                                                    <label>
                                                        <input type="checkbox" v-model="list.checked" :checked="selectMax" @change="toggleSelect(list, list.checked)">
                                                        <strong> {{ list.display_name }}</strong>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row" :key="'adv_' + index">
                                            <div class="col-sm-offset-1 col-sm-11" v-for="advpermission in list.advpermissions" :key="advpermission.id">
                                                <div class="checkbox">
                                                    <label>
                                                        <input type="checkbox" v-model="advpermission.checked">
                                                        <span>{{ advpermission.display_name }}</span>
                                                        <span class="text-muted">- {{ advpermission.description }}</span>
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
                        <button type="submit" class="md-btn w-sm blue">{{ $t('dic.submit') }}</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
<script>
import { getSetting, updateSetting } from '../../service'
export default {
    data () {
        return {
            role: {
                id: undefined,
                name: ''
            },
            selectId: [[], []],
            permissions: []
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
            getSetting('role', {
                id,
                params: {
                    opt_expand: 'group,permissions'
                }
            }).then(data => {
                this.role = data
                this.permissions = data.manage_permissiongroup
            })
        },
        onSubmit (e) {
            this.getSelect()
            let data = {
                name: this.role.name,
                manage_permissiongroup: this.selectId[0],
                permissions: this.selectId[1]
            }
            updateSetting('role', {
                id: this.role.id,
                data,
                params: {
                    opt_expand: 'group,permissions'
                }
            }, {
                action: this.role.id ? this.$t('title.role_edit') : this.$t('title.role_add')
            }).then(({ id }) => {
                this.$router.push('/roles/' + id)
            }, () => {})
        },
        getPermissionsAll () {
            getSetting('permission', {
                params: {
                    opt_expand: 'permissions'
                }
            }).then(data => {
                this.permissions = data
            })
        },
        toggleSelect (list, value) {
            list.advpermissions.forEach(advpermission => {
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
