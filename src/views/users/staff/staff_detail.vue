<template>
    <div>
        <div class="m-b">
            <ol class="breadcrumb">
                <li class="active"><router-link to="/staff">{{ $t('nav.staff') }}</router-link></li>
                <li class="active">{{ $route.meta.title }}</li>
            </ol>
        </div>
        <div class="box">
            <div class="box-header b-b">
                <div class="row">
                    <div class="col-md-4">
                        <h2 class="v-m m-t-sm">{{ staff.username }}</h2>
                    </div>
                    <div class="col-md-5 col-md-offset-3 text-right">
                        <router-link class="md-btn md-flat m-r-sm" :to="'/staff/'+staff.id+'/edit'">{{ $t('action.update') }}</router-link>
                        <a
                            class="md-btn md-flat m-r-sm"
                            @click="deleteStaff(staff.id, true, $event)"
                            v-if="$root.permissions.includes('remove_staff')"
                        >{{ $t('action.delete') }}
                        </a>
                    </div>
                </div>
            </div>
            <div class="box-body">
                <div class="row m-b p-b b-b">
                    <div class="col-xs-9">
                        <span class="text-muted">{{ $t('staff.staff_info') }}</span>
                        <table class="table b-a m-t-sm">
                            <tbody>
                                <tr>
                                    <th class="grey-50" width="130">{{ $t('staff.account') }}</th>
                                    <td>{{ staff.username }}</td>
                                </tr>
                                <tr>
                                    <th class="grey-50" width="130">{{ $t('staff.role') }}</th>
                                    <td>
                                        <span v-if="staff.user_group">{{ staff.user_group.name }}</span>
                                        <span v-else>{{ $t('action.no_setting') }}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <th class="grey-50" width="130">{{ $t('staff.email') }}</th>
                                    <td>{{ staff.email ? staff.email : $t('staff.no_setting') }}</td>
                                </tr>
                                <tr>
                                    <th class="grey-50">{{$t('staff.permission')}}</th>
                                    <td v-if="staff.user_group">
                                        <template v-for="(list, index) in staff.user_group.permissions">
                                            <div class="row">
                                                <div class="col-sm-12 p-b"> 
                                                    <strong>{{ list.display_name }}</strong>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-sm-offset-1 col-sm-11 p-b" v-for="permission in list.advpermissions" :key="permission.id">
                                                    <i v-if="permission.checked" class="fa fa-check text-success m-r-xs"></i>   
                                                    <i v-else class="fa fa-times text-danger m-r-xs"></i>
                                                    <span>{{ permission.display_name }}</span>
                                                    <span class="text-muted ">- {{ permission.description }}</span>
                                                </div>
                                            </div>
                                        </template>
                                    </td>
                                    <td v-else>{{ $t('action.no_setting') }}</td>
                                </tr>
                                <tr>
                                    <th class="grey-50">{{$t('common.memo')}}</th>
                                    <td>{{ staff.memo }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="row p-t">
                    <div class="col-xs-5">
                        <span class="text-muted">{{$t('staff.status')}}</span>
                        <div>
                            <span :class="['label', staff.status?'success':'danger']">{{ staff.status ?  $t('status.active') : $t('status.inactive') }}</span>
                            <template v-if="$root.permissions.includes('update_staff_status')">
                                <a class="text-sm m-l" @click="toggleStatus">{{ staff.status ? $t('staff.disabled') : $t('staff.enabled') }}</a>
                            </template>
                            <span class="text-success text-sm m-l" v-show="statusUpdated">{{ $t('staff.status_updated') }}</span>
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
                user_group: {}
            },
            statusUpdated: false
        }
    },
    created () {
        this.getStaff(this.$route.params.staffId)
    },
    methods: {
        getStaff (id) {
            this.$http.get(api.staff + id + '/?opt_expand=group,permissions').then(data => {
                this.staff = data
            })
        },
        toggleStatus () {
            this.statusUpdated = false
            this.$http.put(api.staff + this.staff.id + '/', {
                username: this.staff.username,
                group: this.staff.user_group.id,
                status: this.staff.status ^ 1
            }).then(data => {
                this.staff.status = data.status
                this.statusUpdated = true
                setTimeout(() => {
                    this.statusUpdated = false
                }, 2000)
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
            this.$http.delete(api.staff + id + '/').then(() => {
                this.$router.push('/staff')
            })
        }
    }
}
</script>

<style scoped>
.permissions-list {
  list-style: none;
  padding-left: 0;
  margin-bottom: 0;
}
.ul-padding-vertical-05 > li {
  padding: 0.5em 0;
}
</style>
