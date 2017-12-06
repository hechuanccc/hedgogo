<template>
  <div>
    <div class="box" v-if="queryset.length > 0">
      <table st-table="rowCollectionBasic" class="table table-striped b-t align-middle">
          <thead>
          <tr>
            <th width="20%" class="text-center align-middle">{{ $t('global_parameters.name') }}</th>
            <th valign="middle">{{ $t('global_parameters.value') }}</th>
            <th width="10%" class="align-middle">{{ $t('global_parameters.operating') }}</th>
          </tr>
          </thead>
          <tbody>
            <tr v-for="(preference, index) in queryset" :key="index">
                <td class="text-center align-middle">{{ preference.display_name }}</td>
                <td v-if="listMode.includes(index)"><div :class="preference.newValue ? '' : 'has-danger'"><input :class="['form-control', preference.newValue ? '' : 'form-control-danger']" v-model="preference.newValue"></div></td>
                <td v-else>{{ preference.value }}</td>
                <td class="align-middle">
                    <a class="p-l-xs" @click="changeMode(index)">{{ listMode.includes(index) ? $t('action.confirm') : $t('global_parameters.modify') }}</a>
                    <a class="p-l-xs" v-if="listMode.includes(index)" @click="cancel(index)">{{ $t('global_parameters.cancel') }}</a>
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
                    <strong>{{ $t('global_parameters.sure_update_parameter') }}</strong>
                    <button type="button" class="close" aria-hidden="true" @click="hideModal">×</button>
                </div>
                <div class="modal-body">
                    <table st-table="rowCollectionBasic" class="table b-t">
                    <thead>
                        <tr>
                            <th>{{ $t('global_parameters.name') }}</th>
                            <th>{{ $t('global_parameters.value') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{ modal.globalPreferenceResult.display_name }}</td>
                            <td>{{ modal.globalPreferenceResult.value }}</td>
                        </tr>
                    </tbody>
                    </table>
                    <div class="row m-l m-r">
                        <alert-msg :msg="modal.msg" ref="alertMsg" @hide-modal="hideModal"></alert-msg>
                    </div>   
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" @click="updateGlobalPreference">{{ $t('action.update') }}</button>
                    <button type="button" class="btn btn-default" @click="hideModal">{{ $t('staff.close') }}</button>
                </div>
            </div>
        </div>
    </div>
    <div class="row m-b-lg">
        <pulling :queryset="queryset" :api="globalPreferencesApi" :query="query" ref="pulling" @query-data="queryData" @query-param="queryParam"></pulling>
    </div>
  </div>
</template>
<script>
import api from '../../api'
import pulling from '../../components/pulling'
import alertMsg from '../../components/alertMsg'
// import Vue from 'vue'

export default {
    data () {
        return {
            globalPreferencesApi: api.global_preferences,
            query: {},
            queryset: [],
            modal: {
                isShow: false,
                index: '',
                key: '',
                globalPreferenceResult: {
                    display_name: '',
                    value: ''
                },
                msg: ''
            },
            listMode: []
        }
    },
    created () {
        this.$nextTick(() => {
            this.$refs.pulling.rebase()
        })
    },
    methods: {
        changeMode (index) {
            if (this.listMode.includes(index)) {
                this.modal.key = this.queryset[index].key
                this.modal.index = index
                this.modal.globalPreferenceResult.value = this.queryset[index].newValue
                this.modal.globalPreferenceResult.display_name = this.queryset[index].display_name
                this.showModal()
            } else {
                this.$set(this.queryset[index], 'newValue', this.queryset[index].value)
                this.listMode.push(index)
            }
        },
        cancel (index) {
            this.queryset[index].newValue = this.queryset[index].value
            this.listMode.splice(this.listMode.indexOf(this.modal.index), 1)
        },
        updateGlobalPreference () {
            this.$http.patch(this.globalPreferencesApi + this.modal.key + '/', this.modal.globalPreferenceResult)
            .then(response => {
                if (response.data.code === 2000) {
                    this.queryset[this.modal.index].value = response.data.data.value
                    this.modal.msg = this.$t('game_manage.modify_success')
                    this.$refs.alertMsg.trigger('success', 1, true)
                    this.listMode.splice(this.listMode.indexOf(this.modal.index), 1)
                } else {
                    this.modal.msg = response.data.msg
                    this.$refs.alertMsg.trigger('danger', 1, true)
                }
            })
        },
        showModal () {
            this.modal.isShow = true
        },
        hideModal () {
            this.modal.isShow = false
        },
        submit () {
            this.$refs.pulling.submit()
        },
        queryData (queryset) {
            this.queryset = queryset
        },
        queryParam (query) {
            this.query = query
        }
    },
    components: {
        pulling,
        alertMsg
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
.align-middle td{
  vertical-align:middle;
}
</style>
