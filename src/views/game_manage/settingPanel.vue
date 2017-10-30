<template>
  <div class="box">
    <div class="box-header b-b ">
      <h3>{{$t('game_manage.handicap_setting')}}</h3>
    </div>
    <div class="box-body">
      <div class="box" v-for="key in combinationsKey" :key="key">
        <div class="box-header text-center">
          <strong class="text-md">{{key === 'remains' ? '':key}}</strong>
        </div>
        <div class="box-body">
          <setting-table :mainTitle="key" :playsets="combinations[key]">
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
        update () {
            this.$emit('update')
        }
    }

}
</script>

