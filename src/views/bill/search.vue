<template>
  <div>
    <form class="form" v-on:submit.prevent="submit">
        <div class="box">
            <div class="box-body clearfix form-inline form-input-sm">
                <div class="row">
                    <div class="col-xs-2">
                        <label class="text-sm">{{$t('bill.order_id')}}</label>
                        <input type="text" v-model="order_id" @keyup="removeSpace" class="form-control w-sm" />
                    </div>
                    <div class="col-xs-2">
                        <label class="text-sm">{{$t('common.member')}}</label>
                        <input type="text" v-model="query.member_q" class="form-control w-sm" />
                    </div>

                    <div class="col-xs-2" v-if="$root.$data.userType !== 'agent'" >
                        <label class="text-sm">{{$t('common.agent')}}</label>
                        <input type="text" v-model="query.agent_q" class="form-control w-sm" />
                    </div>

                    <div class="col-xs-4">
                        <label class="text-sm">{{$t('common.amount')}}</label>
                        <input type="text" v-model="query.amount_gte" class="form-control inline w-sm" /> <span>~</span>
                        <input type="text" v-model="query.amount_lte" class="form-control inline w-sm" />
                    </div>

                    <div class="col-xs-2">
                        <button class="md-btn w-sm blue pull-right" type="submit">{{$t('common.search')}}</button>
                    </div>
                </div>
                <div class="row m-t">
                    <div class="col-xs-2">
                        <label class="text-sm">{{$t('member.level')}}</label>
                        <level
                          :level="query.member_level"
                          @level-select="changeFromLevel">
                        </level>
                    </div>

                    <div class="col-xs-4">
                        <label class="text-sm">{{$t('bill.created_at')}}</label>
                        <date-picker width='140' v-model="created_at_0"></date-picker>
                        <span>~</span>
                        <date-picker width='140' v-model="created_at_1"></date-picker>

                    </div>
                    <div class="col-xs-6">
                        <label class="text-sm">{{$t('bill.transaction_type')}}</label>
                        <label class="md-check m-r pull-right" v-for="t in trans_type">
                            <input name="transaction_type" type="checkbox" :value="t.code" v-model="transaction_type" >
                            <i class="blue"></i>
                            {{t.display_name}}
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </form>

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
                </tr>
            </tbody>
        </table>
        <div class="report-button" v-if="queryset.length">
            <div class="col-xs-2 pull-right">
                <a :href="href" class="grey-400 md-btn w-sm" :getReport="getReport">{{$t('returnrate.export')}}</a>
            </div>
        </div>
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
    import pulling from '../../components/pulling'
    import VueCookie from 'vue-cookie'
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
                // use selectd transaction types
                transaction_type: [],
                // all of the transaction types
                trans_type: [],
                showAgent: false,
                href: '',
                export_query: '',
                filter: {}
            }
        },
        watch: {
            transaction_type: function (newObj, old) {
                this.query.transaction_type = newObj
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
            this.$nextTick(() => {
                this.$refs.pulling.rebase()
                this.$refs.pulling.getExportQuery()
            })
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
