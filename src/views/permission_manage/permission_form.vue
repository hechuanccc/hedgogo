<template>
    <div>
        <div class="m-b">
            <ol class="breadcrumb">
                <li class="active"><router-link to="/permissions">{{ $t('nav.permissions') }}</router-link></li>
                <li class="active">{{ $route.meta.title }}</li>
            </ol>
        </div>
        <div class="alert alert-danger" v-if="!$root.permissions.includes('change_permission')">{{ $t('common.errorPermission') }}</div>
        <form @submit.prevent='onSubmit'>
            <div class="box p-t m-b clearfix">
                <div class="col-xs-3 m-b">
                    <div class="clearfix m-b">
                        <label class="col-xs-4 text-right form-control-label">{{ $t('permission_manage.name') }}</label>
                        <div class="inline-form-control">
                            <input class="form-control" v-model="permissionsetting.display_name" required>
                        </div>
                    </div>
                </div>
                <div class="col-xs-4 m-b">
                    <div class="clearfix">
                        <label class="col-xs-4 text-right form-control-label">{{ $t('permission_manage.description') }}</label>
                        <div class="inline-form-control">
                            <input class="form-control" v-model="permissionsetting.description" required>
                        </div>
                    </div>
                </div>
                <div class="col-xs-3 clearfix  m-b">
                    <label class="col-xs-4 text-right form-control-label">{{ $t('permission_manage.select_group') }}</label>
                    <div class="inline-form-control">
                        <select class="form-control w-sm c-select" v-model="permissionsetting.group" required>
                            <option value="">{{ $t('common.please_select') }}</option>
                            <option v-for="permission in permissions" :value="permission.id" :key="permission.id">{{ permission.display_name }}</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-xs-12">
                    <div class="alert alert-danger" v-if="errorMsg">{{ errorMsg }}</div>
                    <button type="submit" class="md-btn w-sm blue">{{ $t('common.save') }}</button>
                </div>
            </div>
        </form>
    </div>
</template>
<script>
    import api from '../../api'

    export default {
        data () {
            return {
                errorMsg: '',
                permissions: [],
                permissionsetting: {
                    display_name: '',
                    name: '',
                    description: '',
                    key: '',
                    group: ''
                }
            }
        },
        created () {
            this.getPermissions()
        },
        methods: {
            getPermissions () {
                this.$http.get(api.permissions).then(data => {
                    this.permissions = data
                })
            },
            onSubmit (e) {
                this.$http.post(api.advpermissions, this.returnsetting).then(() => {
                    this.$router.push('/permissions/')
                })
            }
        }
    }
</script>
<style scoped>
.count-label {
    padding: 6px;
    margin-right: 10px;
}
.md-form-group {
    padding: 15px 0 5px 0;
}
</style>
