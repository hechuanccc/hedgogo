<template>
  <div>
    <form class="form" v-on:submit.prevent="submit">
        <div class="box">
            <div class="box-body clearfix form-inline form-input-sm">
                <div class="row">
                    <div class="col-xs-12">
                        <select class="w c-select" v-model="selected" @change="getData">
                            <option value="0">{{$t('common.date')}}</option>
                            <option value="1">{{$t('common.today')}}</option>
                            <option value="2">{{$t('common.yesterday')}}</option>
                            <option value="3">{{$t('common.specify_date_range')}}</option>
                        </select>
                        <level class="inline" :level="member_level" @level-select="changeFromLevel"></level>
                        <select class="form-control w-sm c-select" v-model="transaction_type">
                            <option value="0">{{$t('bill.transaction_type')}}</option>
                            <option name="transaction_type" v-for="t in trans_type" :value="t.code">
                                <i class="blue">{{t.display_name}}</i>
                            </option>
                        </select>
                        <input type="text" v-model="query.id" @keyup="removeSpace()" class="form-control w-sm" v-bind:placeholder="$t('bill.order_id')"/>
                        <input type="text" v-model="query.member_q" class="form-control w-sm" v-bind:placeholder="$t('common.member')" />
                        <input type="text" v-model="query.agent_q" class="form-control w-sm" v-bind:placeholder="$t('common.agent')"/>
                        <input type="text" v-model="query.amount_gte" class="form-control inline w-sm" v-bind:placeholder="$t('common.min_amount')"/> <span>~</span>
                        <input type="text" v-model="query.amount_lte" class="form-control inline w-sm" v-bind:placeholder="$t('common.max_amount')"/>
                        <button class="md-btn w-xs blue pull-right" type="submit">{{$t('common.search')}}</button>
                    </div>
                </div>
                <div class="row m-t">
                    <div class="col-xs-12">
                        <div v-if="selected == '3'" class="pull-left">
                            <date-picker width='140' v-model="query.created_at_0"></date-picker>
                            <span>~</span>
                            <date-picker width='140' v-model="query.created_at_1"></date-picker>
                        </div>
                    <button class="md-btn w-xs pull-right" type="button" @click="clearall">{{$t('action.clear_all')}}</button>
                    </div>
                </div>
            </div>
        </div>
    </form>
    <input type="checkbox" name="account_type" v-model="account_type" >
    <i class="blue"></i>{{$t('action.filter_trial_account')}}
    <div v-if="queryset.length" class="pull-right">
      <a :href="href" class="grey-400" :getReport="getReport">
        <span class="nav-icon export-button" ><i class="material-icons">&#xe2c4;</i></span>
      </a>
    </div>
    <div class="box">
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>{{$t('bill.order_id')}}</th>
                    <th>{{$t('common.member')}}</th>
                    <th v-if="showAgent">{{$t('common.agent')}}</th>
                    <th>{{$t('bill.created_at')}}</th>
                    <th>{{$t('bill.transaction_type')}}</th>
                    <th>{{$t('common.status')}}</th>
                    <th>{{$t('common.balance_before')}}</th>
                    <th>{{$t('common.balance_after')}}</th>
                    <th>{{$t('common.amount')}}</th>
                    <th>{{$t('game_manage.issue_number')}}</th>
                    <th>{{$t('game_manage.name')}}</th>
                    <th>{{$t('game_manage.play')}}</th>
                    <th>{{$t('common.operator')}}</th>
                    <th>{{$t('common.memo')}}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="t in queryset">
                    <td>
                        <router-link v-if="$root.$data.userType !== 'agent'" :to="'/transaction/' + t.id + '/'">{{t.id}}</router-link>
                        <span v-else>{{t.id}}</span>
                    </td>
                    <td>
                        <router-link v-if="$root.$data.userType !== 'agent'" :to="'/member/' + t.member.id">{{t.member.username}}</router-link>
                        <span v-else>{{t.member.username}}</span>
                    </td>
                    <td v-if="showAgent"><router-link :to="'/agent/' + t.member.agent.id ">{{t.member.agent.username}}</router-link></td>
                    <td>{{t.created_at | moment("YYYY-MM-DD HH:mm:ss")}}</td>
                    <td>{{t.transaction_type.display_name}}</td>
                    <td>
                        <transaction-status :transaction="t"></transaction-status>
                    </td>
                    <td>
                      <span v-if="t.balance_before">{{t.balance_before | currency('￥')}}</span>
                      <span v-else>-</span>
                    </td>
                    <td>
                      <span v-if="t.balance_after">{{t.balance_after | currency('￥')}}</span>
                      <span v-else>-</span>
                    </td>
                    <td>{{t.amount | currency('￥')}} <label v-if="t.withdraw_fee"> - 手续费：{{t.withdraw_fee}}</label></td>
                    <td v-if="t.issue_number">{{t.issue_number}}</td> <td v-else>-</td>
                    <td v-if="t.game">{{t.game}}</td> <td v-else>-</td>
                    <td v-if="t.play">{{t.play}</td> <td v-else>-</td>
                    <td v-if="t.updated_by">{{t.updated_by.username}}</td> <td v-else>-</td>
                    <td v-if="t.memo">{{t.memo}}</td> <td v-else>-</td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="row m-b-lg">
      <div v-show="!queryset.length" class="col-xs-12 text-center">{{$t('report.no_record_found')}}</div>
      <pulling v-show="queryset.length"
        :queryset="queryset"
        :query="query"
        :export_query="export_query"
        @query-data="queryData"
        @query-param="queryParam"
        @export-query="exportQuery"
        :api="billApi"
        ref="pulling">
      </pulling>
    </div>
  </div>
</template>
<script>
    import api from '../../api'
    import DatePicker from 'vue2-datepicker'
    import transactionStatus from '../../components/transaction_status'
    import pulling from '../../components/pulling'
    import VueCookie from 'vue-cookie'
    import date from '../../utils/date'
    import Vue from 'vue'

    const format = 'YYYY-MM-DD'
    export default {
        data () {
            return {
                created_at_0: '',
                created_at_1: '',
                queryset: [],
                billApi: api.bill,
                order_id: '',
                query: {
                    account_type: '',
                    id: '',
                    member_q: '',
                    created_at_0: '',
                    created_at_1: '',
                    amount_gte: '',
                    amount_lte: '',
                    member_level: '',
                    operator: '',
                    agent_q: '',
                    transaction_type: [],
                    report_flag: true
                },
                member_level: '0',
                selected: '0',
                account_type: 'true',
                // use selectd transaction types
                transaction_type: '0',
                // all of the transaction types
                trans_type: [],
                showAgent: false,
                href: '',
                export_query: '',
                filter: {
                    created_at_0: Vue.moment().subtract(7, 'days').format(format),
                    created_at_1: Vue.moment().subtract(1, 'days').format(format),
                    report_flag: 'True'
                }
            }
        },
        watch: {
            account_type: function (newObj, old) {
                if (newObj === true) {
                    this.query.account_type = '1'
                } else {
                    this.query.account_type = '0'
                }
                this.submit()
            },
            transaction_type: function (newObj, old) {
                if (newObj === '0') {
                    this.query.transaction_type = ''
                } else {
                    this.query.transaction_type = newObj
                }
            },
            '$route' (to, from) {
                this.queryset = []
                this.$refs.pulling.rebase()
                this.$refs.pulling.getExportQuery()
            },
            created_at_0 (newObj, old) {
                this.query.created_at_0 = newObj
            },
            created_at_1 (newObj, old) {
                this.query.created_at_1 = newObj
            },
            order_id (newObj, old) {
                this.query.id = newObj
            }
        },
        created () {
            this.getTransactionType()
            let transactionType = this.$route.query.transaction_type
            if (transactionType) {
                this.transaction_type = transactionType.split(',')
            }
        },
        computed: {
            src () {
                return api.agent + '?opt_fields=username,id,&username_q=' + this.agent_q
            },
            getReport () {
                this.href = `${api.report_deposit}?token=${VueCookie.get('access_token')}&${this.export_query}`
                return this.queryset.length
            }
        },
        methods: {
            changeFromLevel (val) {
                this.query.member_level = val
                this.member_level = val
            },
            queryData (queryset) {
                this.query = Object.assign({}, this.filter)
                if (this.query.created_at_0) {
                    this.created_at_0 = this.query.created_at_0
                }
                if (this.query.created_at_1) {
                    this.created_at_1 = this.query.created_at_1
                }
                if (this.query.id) {
                    this.order_id = this.query.id
                }
                this.queryset = queryset
            },
            queryParam (query) {
                this.filter = query
            },
            exportQuery (expor) {
                this.export_query = expor
            },
            submit () {
                // won't pull queryset here, just tell child component to change the route
                this.query.agent_q ? this.showAgent = true : this.showAgent = false
                this.$refs.pulling.submit()
                this.$refs.pulling.getExportQuery()
            },
            getTransactionType () {
                this.$http.get(api.transactiontype).then(response => {
                    this.trans_type = response.data
                })
            },
            removeSpace () {
                this.order_id = this.order_id.replace(/[^\d]+/g, '')
            },
            clearall: function () {
                this.query = {}
                this.dateRange = -1
                this.query.created_at_0 = ''
                this.query.created_at_1 = ''
                this.member_level = 0
                this.transaction_type = '0'
                this.selected = '0'
                this.account_type = true
                this.$router.push({
                    path: this.$route.path + '?report_flag=true&account_type=1'
                })
            },
            getData: function () {
                if (this.selected === '0') {
                    this.query.created_at_0 = ''
                    this.query.created_at_1 = ''
                    this.$router.push({
                        path: this.$route.path + '?report_flag=true&account_type=1'
                    })
                } else {
                    this.created_at_0 = ''
                    this.created_at_1 = ''
                    this.toggleDate(this.selected)
                }
            },
            clearDateFilter () {
                this.created_at_0 = ''
                this.created_at_1 = ''
                this.query.created_at_0 = ''
                this.query.created_at_1 = ''
                this.$router.push({
                    path: this.$route.path + '?report_flag=true&account_type=1',
                    query: this.query
                })
            },
            toggleDate (flag) {
                switch (flag) {
                case '1':
                    this.filter.created_at_0 = date.today[0]
                    this.filter.created_at_1 = date.today[1]
                    break
                case '2':
                    this.filter.created_at_0 = date.yesterday[0]
                    this.filter.created_at_1 = date.yesterday[1]
                    break
                }
                this.quick_select()
            },
            quick_select () {
                this.$refs.pulling.submit()
                let query = this.filter
                this.$router.push({
                    path: this.$route.path,
                    query: query
                })
            }
        },
        components: {
            DatePicker,
            pulling,
            transactionStatus,
            level: require('../../components/level')
        }
    }
</script>
