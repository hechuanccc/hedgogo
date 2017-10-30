<template>
  <table class="table table-striped b-t">
    <thead>
      <tr>
        <th>{{this.mainTitle}}</th>
        <th>{{$t('game_manage.odd')}}</th>
        <th>{{$t('game_manage.return')}}</th>
        <th>{{$t('game_manage.min_per_bet')}}</th>
        <th>{{$t('game_manage.max_per_bet')}}</th>
        <th>{{$t('game_manage.max_per_draw')}}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="playset in playsetFormer" :key="playset.id">
        <td>
          <strong>{{playset.display_name | nameFilter(mainTitle)}}</strong>
        </td>
        <td v-for="(field, idxField) in fields" :key="idxField">
          <span v-if="!setting_mode">{{playset[field]}}</span>
          <input v-else type="text" :value="playset.odds" @change="changeField($event,field, playset)">
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
    filters: {
        nameFilter (value, key) {
            return value.replace(key + '-', '')
        }
    },
    props: {
        mainTitle: String,
        playsets: Array,
        fields: Array
    },
    data () {
        return {
            setting_mode: false
        }
    },
    computed: {
        width () {
            return `${100 / (this.fields.length + 1)}%`
        },
        playsetFormer () {
            return this.playsets.slice(0, Math.ceil(this.playsets.length / 2))
        },
        playsetLatter () {
            return this.playsets.slice(Math.ceil(this.playsets.length / 2), this.playsets.length)
        }
    },
    methods: {
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

