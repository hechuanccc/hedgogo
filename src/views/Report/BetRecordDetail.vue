<template>
  <div>
    <div class="m-b">
      <ol class="breadcrumb">
        <li class="active">
          <router-link to="/report/betrecord">{{$t('title.betting_record')}}</router-link></li>
        <li class="active">{{$route.meta.title}}</li>
      </ol>
    </div>
    <div class="box">
      <div class="box-header b-b">
        <div class="row">
          <div class="col-md-4">

            <h2 class="v-m m-t-sm">
              {{$t('bet.bet_id')}}：
              <span>{{betrecords.id}}</span>
            </h2>
          </div>
        </div>
      </div>
      <div class="box-body">
        <div class="row b-b p-b m-b">
          <div class="col-xs-6">
            <div class="row">
              <div class="col-xs-3 text-right">{{$t('dic.member')}}</div>
              <div class="col-xs-8" v-if="betrecords.member">
                <router-link :to="'/member/' + betrecords.member.id" v-if="betrecords.member.account_type" class="v-m m-r">
                  {{betrecords.member.username}}
                </router-link>
                <span v-else>{{ $t('user.visitor') }}</span>
              </div>
            </div>

            <div class="row m-t" v-if="betrecords.game">
              <div class="col-xs-3 text-right">{{$t('dic.game')}}</div>
              <div class="col-xs-8">
                <span class="text-muted">{{betrecords.game.display_name}}&nbsp;{{betrecords.issue_number}}期</span>
              </div>
            </div>

            <div class="row m-t">
              <div class="col-xs-3 text-right">{{$t('time.settled_at')}}</div>
              <div class="col-xs-8"><span class="text-muted">{{betrecords.created_at | moment('YYYY-MM-DD HH:mm')}}</span></div>
            </div>

            <div class="row m-t">
              <div class="col-xs-3 text-right">{{$t('time.updated_at')}}</div>
              <div class="col-xs-8"><span class="text-muted">{{betrecords.updated_at | moment('YYYY-MM-DD HH:mm')}}</span></div>
            </div>


          </div>
          <div class="col-xs-6">
            <div class="row m-t">
              <div class="col-xs-3 text-right">{{$t('bet.bet_amount')}}</div>
              <div class="col-xs-8"><span class="text-muted"> {{betrecords.bet_amount | currency('￥')}}</span></div>
            </div>
            <div class="row m-t">
              <div class="col-xs-3 text-right v-m">{{$t('bet.settled_amount')}}</div>
              <div class="col-xs-8">
                <span class="text-muted">{{betrecords.settlement_amount | currency('￥')}}</span>
              </div>
            </div>
            <div class="row m-t">
              <div class="col-xs-3 text-right v-m">{{$t('dic.profit')}}</div>
              <div class="col-xs-8">
                <span class="text-muted" v-if="betrecords.profit">{{betrecords.profit | currency('￥')}}</span>
                <span class="text-muted" v-else>-</span>
              </div>
            </div>

            <div class="row m-t">
              <div class="col-xs-3 text-right">{{$t('dic.status')}}</div>
              <div class="col-xs-8">
                <span class="text-muted">
                    <div class="flex-value status">
                        <span class="label danger" v-if="betrecords.status === 'lose'">{{$t('bet.lose')}}</span>
                        <span class="label success" v-if="betrecords.status === 'win'">{{$t('bet.win')}}</span>
                        <span class="label ongoing" v-if="betrecords.status === 'ongoing'">{{$t('bet.ongoing')}}</span>
                        <span class="label ongoing" v-if="betrecords.status === 'tie'">{{$t('bet.tie')}}</span>
                        <span class="label ongoing" v-if="betrecords.status === 'cancelled'">{{$t('status.cancelled')}}</span>
                        <span class="label ongoing" v-if="betrecords.status === 'no_draw'">{{$t('game.no_draw')}}</span>
                    </div>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="row ">
          <div class="col-xs-8">
            <div class="text m-b">{{$t('title.betting_record_detail')}}</div>
            <div class="details-box">
              <table class="table b-a m-t-sm" >
                <tbody >
                <th class="grey-50" width="200">{{$t('game.play')}}</th>
                <td v-if="betrecords.play">{{betrecords.play.play_group.display_name}} @ {{betrecords.play.display_name}}</td>
                <tr v-for="(bet_options_list, index) in betrecords.bet_options">
                  <th class="grey-50" width="200">{{$t(`betrecord.${index}`)}}</th>
                  <td v-if="bet_options_list">{{bet_options_list}}</td>
                  <td v-else>{{bet_options}}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row" v-if="errorMsg">
      <div class="col-xs-3">
        <div class="alert alert-danger">
          {{errorMsg}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import { getBetRecord } from '../../service'
    import Vue from 'vue'

    const format = 'YYYY-MM-DD'
    export default {
        data () {
            return {
                betrecords: [],
                errorMsg: '',
                today: Vue.moment().format(format)
            }
        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                let id = to.params.betrecordId
                vm.getBetRecord(id)
            })
        },
        methods: {
            getBetRecord (id) {
                getBetRecord({
                    id,
                    params: {
                        opt_expand: 'details'
                    }
                }).then(data => {
                    this.betrecords = data
                })
            },
            isArray (o) {
                return Object.prototype.toString.call(o) === '[object Array]'
            }
        }
    }
</script>
<style scoped lang="scss">
  .qr-code {
    max-width: 120px;
  }
  .img-box{
    float: left;
    margin-right: 10px;
  }
  .details-box img {
    max-width: 70px;
  }
</style>
