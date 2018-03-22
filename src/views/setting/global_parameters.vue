<template>
  <div>
    <div class="box" v-if="queryset.length > 0">
      <table st-table="rowCollectionBasic" class="table table-striped b-t v-m">
          <thead>
          <tr>
            <th width="20%" class="text-center align-middle">{{ $t('global_parameters.name') }}</th>
            <th class="v-m">{{ $t('global_parameters.value') }}</th>
            <th
                width="10%"
                class="v-m"
                v-if="$root.permissions.includes('update_global_parameters_setting')"
            >{{ $t('global_parameters.operating') }}
            </th>
          </tr>
          </thead>
          <tbody>
            <tr v-for="(preference, index) in queryset" :key="index" class="align-middle">
                <td class="text-center align-middle">{{ preference.display_name }}</td>
                <td v-if="listMode.includes(index)">
                    <div v-if="typeof preference.newValue === 'object'">
                        <div
                            class="inline m-r-xs"
                            v-for="(element, index) in preference.newValue"
                            :key="index">
                            <label class="form-control-label">{{ element.display_name }}</label>
                            <input class="form-control" v-model="element.value"/>
                        </div>
                    </div>
                    <div class="form-group m-t-sm p-a-0" v-else-if="preference.newValue === 'true' || preference.newValue === 'false'">
                        <label class="radio-inline">
                            <input type="radio" :value="'true'" v-model="preference.newValue"> True
                        </label>
                        <label class="radio-inline">
                            <input type="radio" :value="'false'" v-model="preference.newValue"> False
                        </label>
                    </div>
                    <div  v-else>
                        <input class="form-control" v-model="preference.newValue">
                    </div>
                </td>
                <td v-else>
                    <div v-if="typeof preference.value === 'object'">
                        <div class="m-r-xs inline" v-for="(element, index) in preference.value" :key="index">
                            <label class="form-control-label">{{ element.display_name }}</label>
                            <input class="form-control" v-model="element.value" disabled/>
                        </div>
                    </div>
                    <div class="radio disabled m-t-sm p-a-0" v-else-if="preference.value === 'true' || preference.value === 'false'">
                        <label class="radio-inline disabled">
                            <input type="radio" :value="'true'" v-model="preference.value" disabled> True
                        </label>
                        <label class="radio-inline disabled">
                            <input type="radio" :value="'false'" v-model="preference.value" disabled> False
                        </label>
                    </div>
                    <div v-else>
                        {{ preference.value }}
                    </div>
                </td>
                <td class="align-middle" v-if="$root.permissions.includes('update_global_parameters_setting')">
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
                            <td v-if="typeof modal.displayValue === 'object'">
                                <span v-for="element in modal.displayValue" :key="element.key">
                                    {{ element.display_name }}: {{ element.value }}<br/>
                                </span>
                            </td>
                            <td class="text-break-all" v-else><span>{{ modal.displayValue }}</span></td>
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
  </div>
</template>
<script>
import api from '../../api'
import alertMsg from '../../components/alertMsg'
import $ from '../../utils/util'

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
                displayValue: '',
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
        this.getGlobalParameters()
    },
    methods: {
        getGlobalParameters () {
            this.$http.get(api.global_preferences).then(data => {
                this.queryset = data
                this.queryset.map(element => {
                    if ($.isJsonString(element.value)) {
                        return Object.assign(element, {
                            value: JSON.parse(element.value)
                        })
                    } else {
                        return element
                    }
                })
            })
        },
        changeMode (index) {
            if (this.listMode.includes(index)) {
                this.modal = Object.assign(this.modal, {
                    key: this.queryset[index].key,
                    index: index,
                    displayValue: this.queryset[index].newValue,
                    globalPreferenceResult: {
                        value: this.queryset[index].newValue,
                        display_name: this.queryset[index].display_name
                    },
                    isShow: true
                })
            } else {
                if (typeof this.queryset[index].value === 'object') {
                    this.$set(this.queryset[index], 'newValue', this.queryset[index].value.map(element => Object({
                        key: element.key,
                        value: element.value,
                        display_name: element.display_name
                    })))
                } else {
                    this.$set(this.queryset[index], 'newValue', this.queryset[index].value)
                }
                this.listMode.push(index)
            }
        },
        cancel (index) {
            delete this.queryset[index].newValue
            this.listMode.splice(this.listMode.indexOf(this.modal.index), 1)
        },
        updateGlobalPreference () {
            if (typeof this.modal.globalPreferenceResult.value === 'object') {
                let result = {}
                this.modal.globalPreferenceResult.value.forEach(element => {
                    result[element.key] = element.value
                })
                this.modal.globalPreferenceResult.value = JSON.stringify(result)
            }
            this.$http.patch(this.globalPreferencesApi + this.modal.key + '/', this.modal.globalPreferenceResult)
            .then(data => {
                this.queryset[this.modal.index].value = $.isJsonString(data.value) ? Object.assign(JSON.parse(data.value)) : data.value
                this.modal.msg = this.$t('game_manage.modify_success')
                this.$refs.alertMsg.trigger('success', 1, true)
                this.listMode.splice(this.listMode.indexOf(this.modal.index), 1)
            }, error => {
                this.modal.msg = error
                this.$refs.alertMsg.trigger('danger', 1, true)
            })
        },
        showModal () {
            this.modal.isShow = true
        },
        hideModal () {
            this.modal.isShow = false
        }
    },
    components: {
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
