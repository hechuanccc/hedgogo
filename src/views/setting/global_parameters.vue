<template>
  <div>
    <div class="m-b" v-if="!$root.permissions.includes('change_global_parameters')" >
      <div tag="button" class="md-btn w-sm blue" @click="showModal">{{$t('global_parameters.parameter_add_btn')}}</div>
    </div>
    <div class="box" v-if="globalParametersList.length > 0">
      <table st-table="rowCollectionBasic" class="table table-striped b-t gbp">
          <thead>
          <tr>
            <th width="20%" class="text-center align-middle">{{ $t('global_parameters.name') }}</th>
            <th valign="middle">{{ $t('global_parameters.value') }}</th>
            <th width="10%" class="align-middle">{{ $t('global_parameters.operating') }}</th>
          </tr>
          </thead>
          <tbody>
            <tr v-for="(globalParameter, index) in globalParametersList" :key="globalParameter.id">
                <td class="text-center align-middle">{{ globalParameter.name }}</td>
                <td><input class="form-control" v-model="globalParameter.value "></td>
                <td class="align-middle"><a class="p-l-xs" @click="modifyGlobalParameter(globalParameter.id)">{{ $t('global_parameters.modify') }}</a></td>
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
                            <th>{{ $t('global_parameters.name') }}</th>
                            <th>{{ $t('global_parameters.value') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><input class="form-control" v-model="modal.globalParameterResult.name"></td>
                            <td><input class="form-control" v-model="modal.globalParameterResult.value"></td>
                        </tr>
                    </tbody>
                    </table>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" @click="addGlobalParameter">{{ $t('action.create') }}</button>
                    <button type="button" class="btn btn-default" @click="hideModal">{{ $t('staff.close') }}</button>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>
<script>
// import api from '../../api'
// import Vue from 'vue'

export default {
    data () {
        return {
            globalParametersList: [],
            testData: [{
                id: 1,
                name: '试玩帐号默认金额',
                value: '2000'
            },
            {
                id: 2,
                name: '注册黑名单',
                value: '王小明;'
            },
            {
                id: 3,
                name: '六合彩金',
                value: '01,06,46,23,34,42,35,04,13,33'
            },
            {
                id: 4,
                name: '六合彩木',
                value: '01,06,46,23,34,42,35,04,13,37'
            },
            {
                id: 5,
                name: '六合彩水',
                value: '21,16,36,13,14,32,35,04,19,22'
            },
            {
                id: 6,
                name: '六合彩火',
                value: '31,06,46,43,34,42,35,04,18,01'
            },
            {
                id: 7,
                name: '六合彩土',
                value: '01,06,46,03,34,32,35,04,17,13'
            },
            {
                id: 8,
                name: '在线客服',
                value: ''
            },
            {
                id: 9,
                name: '一天一个ip可以注册多少用户',
                value: ''
            }],
            modal: {
                isShow: false,
                globalParameterResult: {
                    name: '',
                    value: ''
                }
            }
        }
    },
    created () {
        this.getGlobalParameters()
    },
    methods: {
        getGlobalParameters () {
            console.log('no api')
            this.globalParametersList = this.testData
        },
        modifyGlobalParameter (id) {
            console.log(`modify: ${id}`)
        },
        addGlobalParameter () {
            console.log('add')
            this.hideModal()
        },
        showModal () {
            this.modal.isShow = true
        },
        hideModal () {
            this.modal.isShow = false
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
.gbp td{
    vertical-align:middle;
}
</style>
