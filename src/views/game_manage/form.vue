<template>
<div>
  <div class="m-b">
    <ol class="breadcrumb">
      <li class="active"><router-link to="/game_list">{{$t('nav.game_list')}}</router-link></li>
      <li class="active">{{$route.meta.title}}</li>
    </ol>
  </div>
  <div class="box">
    <div class="box-body">
      <form class="form m-a" v-on:submit.prevent="onSubmit">
        <div class="row b-b p-b m-b">
          <div class="col-md-4">
            <div class="form-group">
              <label for="display_name" class="label-width">{{$t('game_manage.name')}}</label>
              <div class="inline-form-control">
                <input class="form-control" id="display_name" v-model="game.display_name">
              </div>
            </div>

            <div class="form-group">
              <label for="rank" class="label-width">{{$t('game_manage.rank')}}</label>
              <div class="inline-form-control">
                <input class="form-control" id="rank" v-model="game.rank">
              </div>
            </div>

            <div class="form-group">
              <label for="code" class="label-width">{{$t('game_manage.code')}}</label>
              <div class="inline-form-control">
                <input class="form-control" id="code" v-model="game.code">
              </div>
            </div>
          </div>
          <div class="col-md-8">
            <div class="form-group">
              <label class="label-width">to_display</label>
              <div class="from-control inline-form-control">
                <label class="md-check">
                  <input type="radio" :value="true" v-model="game.to_display">
                  <i class="blue"></i>
                  {{$t('common.yes')}}
                </label>

                <label class="md-check m-l-lg" >
                  <input type="radio" :value="false" v-model="game.to_display">
                  <i class="blue"></i>
                  {{$t('common.no')}}
                </label>
              </div>
            </div>

            <div class="form-group">
              <label for="remarks" class="label-width">remarks</label>
              <div class="inline-form-control">
                <input class="form-control" id="remarks" v-model="game.remarks">
              </div>
            </div>

            <div class="form-group">
              <label for="icon" class="label-width">icon</label>
              <div class="inline-form-control">
                <img :src="game.icon" alt="">
                <input type="file" class="inline-form-control" id="icon" @change="fileChange">
              </div>
            </div>
          </div>
        </div>
        <div>
          <div class="alert alert-danger" v-if="errorMsg">{{errorMsg}}</div>
          <button type="submit" class="md-btn blue w-sm" >{{$t('common.save')}} </button>
        </div>
      </form>
    </div>
  </div>
</div>
</template>
<script>
import api from '../../api'
import { handleError } from '../../utils/handleError'

export default {
    data () {
        return {
            game: {
                display_name: '',
                rank: '',
                code: '',
                to_display: '',
                remarks: '',
                icon: ''
            },
            changeIcon: '',
            errorMsg: ''
        }
    },
    methods: {
        onSubmit () {
            const formData = new FormData()
            Object.keys(this.game).forEach(key => {
                if (key !== 'icon') {
                    formData.append(key, this.game[key])
                }
            })
            if (this.changeIcon) {
                formData.append('icon', this.changeIcon)
            }
            this.$http.put(api.game_list + this.$route.params.id + '/', formData).then(response => {
                if (response.status === 200) {
                    this.$router.push('/game_detail/' + response.data.id)
                }
            }, response => {
                this.errorMsg = ''
                for (let field in this.field_locales) {
                    this.errorMsg += handleError(response, field, this.field_locales)
                }
            })
        },
        getGame (id) {
            this.$http.get(api.game_list + id).then(
          response => {
              Object.keys(this.game).forEach(key => {
                  this.game[key] = response.data[key]
              })
          }, response => {
                if (('' + response.status).indexOf('4') === 0) {
                    this.$router.push('/login?next=' + this.$route.path)
                }
            })
        },
        fileChange (e) {
            this.changeIcon = e.target.files[0]
        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            let id = to.params.id
            vm.getGame(id)
        })
    }
}
</script>

