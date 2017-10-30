<template>
  <div class="box">
    <div class="box-header b-b ">
      <h3>{{$t('game_manage.transaction_setting')}}</h3>
    </div>
    <div class="box-body">
      <div class="box" v-for="key in combinationsKey" :key="key">
        <div class="box-header text-center">
          <strong class="text-md">{{key === 'remains' ? '':key}}</strong>
        </div>
        <div class="box-body">
          <setting-table :mainTitle="key" :playsets="combinations[key]" :fields="['min_per_bet','max_per_bet','max_per_draw']">
            <template scope="thead">
              <tr>
                <th width="25%"></th>
                <th width="25%">{{$t('game_manage.min_per_bet')}}</th>
                <th width="25%">{{$t('game_manage.max_per_bet')}}</th>
                <th width="25%">{{$t('game_manage.max_per_draw')}}</th>
              </tr>
            </template>
          </setting-table>
        </div>
      </div>
    </div>
    <div class="box-footer text-center">
        <button class="btn btn-primary" :disabled="setting_mode" @click="setting_mode = true">{{$t('action.setting')}}</button>
        <button class="btn btn-primary" :disabled="!setting_mode" @click="update">{{$t('action.confirm')}}</button>
    </div>
  </div>
</template>
<script>
export default {
    components: {
        SettingTable: require('./settingTable')
    },
    filters: {
        nameFilter (value, key) {
            return value.replace(key + '-', '')
        }
    },
    props: {
        combinations: Object,
        combinationsKey: Array
    },
    data () {
        return {
            setting_mode: false
        }
    },
    methods: {

        arrayFormer (arr) {
            return arr.slice(0, Math.ceil(arr.length / 2))
        },
        arrayLatter (arr) {
            return arr.slice(Math.ceil(arr.length / 2), arr.length)
        },
        update () {
            this.$emit('update')
        },
        changeField (e, key, playset) {
            this.$emit('changeField', {
                key: key,
                value: e.target.value,
                playset: playset
            })
        }
    }

}
</script>

