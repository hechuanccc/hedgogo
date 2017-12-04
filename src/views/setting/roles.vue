<template>
  <div>
    <div class="row">
        <div class="pull-right m-r">
            <router-link tag="button" class="md-btn w-sm blue m-b"  to="/role/add">{{$t('role_manage.role_add_btn')}}</router-link>
        </div>
    </div>
    <div class="box" v-if="rolesList.length">
        <table st-table="rowCollectionBasic" class="table table-striped b-t">
            <thead>
                <tr>
                    <th>{{$t('role_manage.id')}}</th>
                    <th>{{$t('role_manage.name')}}</th>
                    <th>{{$t('role_manage.created_at')}}</th>
                    <th>{{$t('role_manage.type')}}</th>
                    <th>{{$t('role_manage.operating')}}</th>
                </tr>
            </thead>
            <tbody v-if="rolesList.length > 0">
                <tr v-for="role in rolesList" :key="role.id">
                    <td>{{ role.id }}</td>
                    <td><router-link :to="'/roles/' + role.id">{{ role.name }}</router-link></td>
                    <td>{{ role.created_at | datetimeFilter }}</td>
                    <td>{{ role.type | typeFilter }}</td>
                    <td>
                        <a class="p-l-xs" @click="showModal(0, role)">{{$t('role_manage.modify')}}</a>
                        <a class="p-l-xs" @click="deleteRole(role.id)" v-if="role.id !== 4">{{$t('role_manage.delete')}}</a>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="modal" v-if="modal.isShow">
        <div class="modal-backdrop fade in" @click="hideModal"></div>
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" aria-hidden="true" @click="hideModal">×</button>
                </div>
                <div class="modal-body">
                    <table st-table="rowCollectionBasic" class="table b-t">
                    <thead>
                    <tr>
                        <th v-if="modal.flag===0">{{ $t('role_manage.id') }}</th>
                        <th>{{ $t('role_manage.name') }}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td v-if="modal.flag===0">{{ modal.role.id }}</td>
                        <td><input class="form-control" v-model="modal.role.name"></td>
                    </tr>
                    </tbody>
                    </table>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" @click="updateRole">{{ $t(modal.flag===0 ? 'action.update' : 'action.create') }}</button>
                    <button type="button" class="btn btn-default" @click="hideModal">{{ $t('staff.close') }}</button>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>
<script>
import api from '../../api'
import Vue from 'vue'

export default {
    data () {
        return {
            rolesList: [],
            modal: {
                flag: undefined,
                // 0 = edit ; 1 = add
                isShow: false,
                role: {},
                id: undefined
            }
        }
    },
    created () {
        this.getRolesList()
    },
    methods: {
        getRolesList () {
            this.$http.get(api.managerole).then((response) => {
                this.rolesList = response.data.data
            })
        },
        updateRole () {
            if (this.modal.flag === 0) {
                // edit mode
                this.$http.put(api.managerole + this.modal.id + '/', this.modal.role)
                .then((response) => {
                    if (response.status === 200) {
                        this.getRolesList()
                    }
                })
            } else {
                // add mode
                this.$http.post(api.managerole, this.modal.role)
                .then((response) => {
                    if (response.status === 201) {
                        this.getRolesList()
                    }
                })
            }
            this.hideModal()
        },
        showModal (flag, role) {
            role = role || {}
            this.modal.flag = flag
            if (flag === 0) {
                // edit mode
                this.modal.id = role.id
                this.modal.role = role
                this.modal.isShow = true
            } else {
                // add mode
                this.modal.id = undefined
                this.modal.role = {}
                this.modal.isShow = true
            }
        },
        hideModal () {
            this.modal.isShow = false
        },
        deleteRole (id) {
            if (window.confirm('确定删除该角色吗?')) {
                this.$http.delete(api.managerole + id + '/')
                .then(response => {
                    if (response.status === 204) {
                        this.getRolesList()
                    }
                })
            }
        }
    },
    filters: {
        datetimeFilter (value) {
            if (!value) {
                return Vue.t('permission_manage.no_setting')
            } else {
                return Vue.moment(value).format('YYYY-MM-DD HH:mm')
            }
        },
        typeFilter (value) {
            if (!value) {
                return Vue.t('permission_manage.no_setting')
            } else {
                return value
            }
        }
    }
}
</script>
<style scoped>
.modal-backdrop, .modal{
  z-index: 1;
}
.modal-dialog{
  z-index: 10;
  top: 10%;
}
.modal{
  display: block;
}
</style>
