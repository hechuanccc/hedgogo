<template>
    <div>
        <div class="m-b">
            <ol class="breadcrumb">
                <li class="active"><router-link to="/staff">{{ $t('title.staff_list') }}</router-link></li>
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
                        <router-link class="md-btn md-flat m-r-sm" :to="'/staff/'+staff.id+'/edit'">{{ $t('dic.update') }}</router-link>
                        <a
                            class="md-btn md-flat m-r-sm"
                            @click="deleteStaff(staff.id, true, $event)"
                            v-if="$root.permissions.includes('remove_staff')"
                        >{{ $t('dic.delete') }}
                        </a>
                    </div>
                </div>
            </div>
            <div class="box-body">
                <div class="row m-b p-b b-b">
                    <div class="col-xs-9">
                        <span class="text-muted">{{ $t('title.staff_detail') }}</span>
                        <table class="table b-a m-t-sm">
                            <tbody>
                                <tr>
                                    <th class="grey-50" width="130">{{ $t('user.account') }}</th>
                                    <td>{{ staff.username }}</td>
                                </tr>
                                <tr>
                                    <th class="grey-50" width="130">{{ $t('dic.role') }}</th>
                                    <td>
                                        <span v-if="staff.user_group">{{ staff.user_group.name }}</span>
                                        <span v-else>{{ $t('system.no_setting') }}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <th class="grey-50" width="130">{{ $t('user.email') }}</th>
                                    <td>{{ staff.email ? staff.email : $t('system.no_setting') }}</td>
                                </tr>
                                <tr>
                                    <th class="grey-50">{{$t('dic.permission')}}</th>
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
                                    <td v-else>{{ $t('system.no_setting') }}</td>
                                </tr>
                                <tr>
                                    <th class="grey-50">{{$t('dic.memo')}}</th>
                                    <td>{{ staff.memo }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="row p-t">
                    <div class="col-xs-5">
                        <span class="text-muted">{{$t('dic.status')}}</span>
                        <status-switch
                            :status="staff.status"
                            :loading="toggleLoading"
                            :disabled="!$root.permissions.includes('update_staff_status')"
                            @toggle="toggleStatus"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import StatusSwitch from '../../components/StatusSwitch.vue'
import { getUser, updateUser, deleteStaff } from '../../service'
export default {
    data () {
        return {
            staff: {
                user_group: {}
            },
            toggleLoading: false
        }
    },
    created () {
        this.getStaff(this.$route.params.staffId)
    },
    methods: {
        getStaff (id) {
            getUser('staff', {
                id,
                params: {
                    opt_expand: 'group,permissions'
                }
            }).then(data => {
                this.staff = data
            })
        },
        toggleStatus () {
            this.toggleLoading = true
            updateUser('staff', {
                id: this.staff.id,
                data: {
                    username: this.staff.username,
                    group: this.staff.user_group.id,
                    status: this.staff.status ^ 1
                }
            }, {
                action: this.$t('dic.update'),
                object: this.$t('dic.status')
            }).then(({ status }) => {
                this.staff.status = status
            }).finally(() => {
                this.toggleLoading = false
            })
        },
        deleteStaff (id, confirm, event) {
            if (confirm) {
                if (!window.confirm(this.$t('system_msg.confirm_action_object', {
                    action: event.target.innerText
                }))) {
                    return
                }
            }
            deleteStaff(id, {
                action: this.$t('dic.delete'),
                object: this.$t('dic.staff')
            }).then(() => {
                this.$router.push('/staff')
            }, () => {})
        }
    },
    components: {
        StatusSwitch
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
