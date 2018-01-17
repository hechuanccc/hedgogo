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
                        <level
                            class="inline"
                            :level="member_level"
                            @level-select="changeFromLevel"
                            :disabled="!$route.query.member"
                        >
                        </level>
                        <transaction-type-selector
                            :transactionType="transaction_type"
                            :placeholder="$t('bill.transaction_type')"
                            @transaction-type-select="transactionTypeSelect"
                        />
                        <input type="number" v-model.trim="query.transaction_id" class="form-control w-sm" v-bind:placeholder="$t('bill.order_id')"/>
                        <input type="text" v-model="member.username" class="form-control" disabled v-if="$route.query.member"/>
                        <input type="text" v-model="query.member_q" class="form-control w-sm" v-bind:placeholder="$t('common.member')" v-else/>
                        <input type="text" v-model="member.agent.name" class="form-control" disabled v-if="$route.query.member"/>
                        <input type="text" v-model="query.agent_q" class="form-control w-sm" v-bind:placeholder="$t('common.agent')" v-else/>
                        <input type="text" v-model="query.amount_gte" class="form-control inline w-sm" v-bind:placeholder="$t('common.min_amount')"/> <span>~</span>
                        <input type="text" v-model="query.amount_lte" class="form-control inline w-sm" v-bind:placeholder="$t('common.max_amount')"/>
                        <button class="md-btn w-xs blue pull-right" type="submit">{{$t('common.search')}}</button>
                    </div>
                </div>
                <div class="row m-t-sm">
                    <div class="col-xs-12">
                        <div v-if="selected == '3'" class="pull-left">
                            <date-picker width='140' v-model="query.created_at_0"></date-picker>
                            <span>~</span>
                            <date-picker width='140' v-model="query.created_at_1"></date-picker>
                        </div>
                    <button class="md-btn w-xs btn pull-right" type="button" @click="clearall">{{$t('action.clear_all')}}</button>
                    </div>
                </div>
            </div>
        </div>
    </form>
    <div class="row">
        <div class="col-xs-12">
          <div class="pull-right" v-if="$root.permissions.includes('export_transaction_report')">
            <a :href="href" :getReport="getReport" v-if="queryset.length">
              <span>{{ $t('action.download') }}<i class="material-icons">&#xe2c4;</i></span>
            </a>
            <span disabled v-else>{{ $t('action.download') }}<i class="material-icons">&#xe2c4;</i></span>
          </div>
        </div>
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
                    <th>{{$t('common.operator')}}</th>
                    <th>{{$t('common.memo')}}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="t in queryset">
                    <td>
                        <router-link v-if="$root.$data.userType !== 'agent'" :to="'/transaction/' + t.id + '/'">{{t.transaction_id}}</router-link>
                        <span v-else>{{t.transaction_id}}</span>
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
                    <td v-if="t.updated_by">{{t.updated_by.username}}</td> <td v-else>-</td>
                    <td v-if="t.memo">{{t.memo}}</td> <td v-else>-</td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="row m-b-lg">
      <pulling
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
    import transactionTypeSelector from '../../components/transactionTypeSelector'
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
                member: {
                    username: '',
                    agent: {},
                    level: {}
                },
                member_level: '',
                selected: '0',
                // use selectd transaction types
                transaction_type: '',
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
            '$route' (to, from) {
                this.queryset = []
                this.$refs.pulling.rebase()
            },
            created_at_0 (newObj, old) {
                this.query.created_at_0 = newObj
            },
            created_at_1 (newObj, old) {
                this.query.created_at_1 = newObj
            },
            order_id (newObj, old) {
                this.query.transaction_id = newObj
            }
        },
        created () {
            let transactionType = this.$route.query.transaction_type
            let member = this.$route.query.member
            if (this.$route.query.member) {
                this.getMember(member)
            }
            if (transactionType) {
                this.transaction_type = transactionType.split(',')
            }
            this.$nextTick(() => {
                this.transaction_type = this.$route.query.transaction_type || ''
                this.$refs.pulling.rebase()
            })
        },
        computed: {
            src () {
                return api.agent + '?opt_fields=username,id,&username_q=' + this.agent_q
            },
            getReport () {
                this.$refs.pulling.getExportQuery()
                this.href = `${api.report_transaction}?token=${VueCookie.get('access_token')}&${this.export_query}`
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
                if (this.query.transaction_id) {
                    this.order_id = this.query.transaction_id
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
            },
            transactionTypeSelect (val) {
                this.query.transaction_type = val
                this.transaction_type = val
            },
            getMember (username) {
                this.$http.get(api.member + '?opt_expand=bank&username=' + username).then(data => {
                    this.member = data[0]
                    this.member_level = this.member.level.id
                })
            },
            clearall: function () {
                this.query = {}
                this.dateRange = -1
                this.query.created_at_0 = ''
                this.query.created_at_1 = ''
                this.member_level = ''
                this.transaction_type = ''
                this.selected = '0'
                this.$router.push({
                    path: this.$route.path + '?report_flag=true'
                })
            },
            getData: function () {
                if (this.selected === '0') {
                    this.query.created_at_0 = ''
                    this.query.created_at_1 = ''
                    this.$router.push({
                        path: this.$route.path + '?report_flag=true'
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
                    path: this.$route.path + '?report_flag=true',
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
            transactionTypeSelector,
            level: require('../../components/level')
        }
    }
</script>
