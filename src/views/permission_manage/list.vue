<template>
  <div>
    <div class="m-b" v-if="$root.permissions.includes('change_permission')" >
      <router-link tag="button" class="md-btn w-sm blue" to="/permission/add">{{$t('permission_manage.permission_add_btn')}}</router-link>
    </div>
    <div class="box" v-if="permissionsListAll.length">
      <table st-table="rowCollectionBasic" class="table table-striped b-t">
          <thead>
          <tr>
            <th>{{$t('permission_manage.id')}}</th>
            <th>{{$t('permission_manage.name')}}</th>
            <th>{{$t('permission_manage.description')}}</th>
            <th>{{$t('permission_manage.group_id')}}</th>
            <th>{{$t('permission_manage.operating')}}</th>
          </tr>
          </thead>
          <tbody v-if="permissionsListAll.length > 0">
              <template v-for="(list, index) in permissionsListAll">
                  <tr v-for="permission in list.permissions" :key="permission.id">
                      <td>{{ permission.id }}</td>
                      <td>{{ permission.display_name }}</td>
                      <td>{{ permission.description }}</td>
                      <td>{{ list.display_name }}</td>
                      <td><a class="p-l-xs" @click="showModal(list.id, permission.id)">{{$t('permission_manage.modify')}}</a></td>
                  </tr>
              </template>
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
                        <th>{{ $t('permission_manage.id') }}</th>
                        <th>{{ $t('permission_manage.name') }}</th>
                        <th>{{ $t('permission_manage.group_id') }}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>{{ modal.permission.id }}</td>
                        <td>{{ modal.permission.display_name }}</td>
                        <td>
                            <div class="inline-form-control">
                                <select class="form-control w-sm c-select" v-model="modal.permission.group" required>
                                    <option v-for="permission in permissions" :value="permission.id" :key="permission.id">{{ permission.display_name }}</option>
                                </select>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                    </table>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" @click="updateGroup">{{ $t('action.update') }}</button>
                    <button type="button" class="btn btn-default" @click="hideModal">{{ $t('staff.close') }}</button>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>
<script>
import api from '../../api'

export default {
    data () {
        return {
            permissionsListAll: [],
            permissions: [],
            modal: {
                isShow: false,
                permission: {},
                id: undefined,
                group: undefined
            }
        }
    },
    created () {
        this.getPermissionsListAll()
        this.getPermissions()
    },
    methods: {
        getPermissionsListAll () {
            this.$http.get(api.permissions + '?opt_expand=permissions').then((response) => {
                this.permissionsListAll = response.data
            })
        },
        getPermissions () {
            this.$http.get(api.permissions).then((response) => {
                this.permissions = response.data
            })
        },
        getPermission (id) {
            this.$http.get(api.advpermissions + id + '/').then((response) => {
                this.modal.permission = response.data
            })
        },
        showModal (group, id) {
            this.modal.id = id
            this.modal.group = group
            this.getPermission(id)

            this.modal.isShow = true
        },
        hideModal () {
            this.modal.isShow = false
        },
        updateGroup () {
            if (this.modal.group === this.modal.permission.group) {
                this.hideModal()
            } else {
                this.$http.put(api.advpermissions + this.modal.id + '/', this.modal.permission).then(response => {
                    if (response.status === 200) {
                        this.getPermissionsListAll()
                    }
                })
                this.hideModal()
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
