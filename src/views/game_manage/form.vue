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
              <label class="label-width">{{$t('game_manage.to_display')}}</label>
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
              <label for="remarks" class="label-width">{{$t('common.remarks')}}</label>
              <div class="inline-form-control">
                <input class="form-control" id="remarks" v-model="game.remarks">
              </div>
            </div>

            <div class="form-group">
              <label for="icon" class="label-width">{{$t('game_manage.icon')}}</label>
              <div class="inline-form-control">
                <img class="w-32" :src="iconSrc" alt="">
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
            initGame: {
                display_name: '',
                rank: '',
                code: '',
                to_display: '',
                remarks: '',
                icon: ''
            },
            iconSrc: '',
            errorMsg: ''
        }
    },
    methods: {
        onSubmit () {
            const formData = new FormData()
            Object.keys(this.game).forEach(key => {
                // these fields are required even if their values never change
                if (['code', 'display_name'].includes(key)) {
                    formData.append(key, this.game[key])
                } else if (this.game[key] !== this.initGame[key]) {
                    formData.append(key, this.game[key])
                }
            })
            if (this.changeIcon) {
                formData.append('icon', this.game.icon)
            }
            this.$http.put(api.game_list + this.$route.params.id + '/', formData).then(response => {
                if (response.status === 200) {
                    this.$router.push('/game_detail/' + response.data.id)
                }
            }, response => {

            })
        },
        getGame (id) {
            this.$http.get(api.game_list + id).then(
            response => {
                Object.keys(this.game).forEach(key => {
                    if (key === 'icon') {
                        this.iconSrc = response.data[key]
                    } else {
                        this.game[key] = response.data[key]
                        this.initGame[key] = response.data[key]
                    }
                })
            }, response => {
                if (('' + response.status).indexOf('4') === 0) {
                    this.$router.push('/login?next=' + this.$route.path)
                }
            })
        },
        fileChange (e) {
            this.game.icon = e.target.files[0]
            this.imgPreview(e.target.files[0])
        },
        imgPreview (file) {
            let self = this
            if (!file || !window.FileReader) return

            if (/^image/.test(file.type)) {
                var reader = new FileReader()
                reader.readAsDataURL(file)
                reader.onloadend = function () {
                    self.iconSrc = this.result
                }
            }
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

