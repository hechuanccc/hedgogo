<template>
    <div>
        <div class="m-b-sm">
            <div class="row">
            <div class="col-xs-12">
                <div class="pull-left inline" v-if="$root.permissions.includes('add_new_agent')">
                    <router-link
                        tag="button"
                        class="md-btn w-sm blue"
                        to="/agent/add"
                    >{{ $t('nav.agent_add') }}
                    </router-link>
                </div>
            </div>
            </div>
        </div>
        <form class="form" v-on:submit.prevent="submit('agent')">
            <div class="box">
                <div class="box-body clearfix form-inline form-input-sm">
                    <div class="row">
                        <div class="col-xs-12">
                            <input
                                type="text"
                                v-model.trim="query.username_q"
                                class="pull-left m-r-xs form-control"
                                :placeholder="$t('agent.account')"
                            />
                            <input
                                type="text"
                                v-model="query.promo_code"
                                class="pull-left m-r-xs form-control w-sm" 
                                :placeholder="$t('agent.promo_code')"
                            />
                            <input
                                type="text"
                                v-model="query.real_name_q"
                                class="pull-left m-r-xs form-control w-sm"
                                :placeholder="$t('common.real_name')"
                            />
                            <input
                                type="text"
                                v-model="query.parent_agent_q"
                                class="pull-left m-r-xs form-control w-sm"
                                :placeholder="$t('agent.parent_agent')"
                            />
                            <select
                                class="pull-left m-r-xs form-control c-select w-sm"
                                v-model="level"
                            >
                                <option value="">{{ $t('agent.level') }}</option>
                                <option value="1">大股东</option>
                                <option value="2">股东</option>
                                <option value="3">总代理</option>
                                <option value="4">代理</option>
                            </select>
                            <commissionsetting
                                class="pull-left m-r-xs"
                                :commissionsetting="commission_settings"
                                @myCommission="myCommission"
                            />
                            <button class="md-btn w-xs blue pull-right" type="submit">{{ $t('common.search') }}</button>
                            <button class="md-btn grey-100 pull-right m-r" @click="showAll=!showAll">
                                <span v-if="!showAll">{{ $t('member.more_options') }} <i class="fa fa-angle-double-down"></i></span>
                                <span v-else>{{ $t('member.collapse_options') }} <i class="fa fa-angle-double-up"></i></span>
                            </button>
                        </div>
                    </div>
                    <div class="row m-t" v-show="showAll">
                        <div class="col-xs-12">
                            <select
                                class="pull-left m-r-xs form-control w-sm c-select inline"
                                v-model="selected"
                            >
                                <option value="">{{ $t('common.please_select') }}</option>
                                <option value="0">{{ $t('common.phone') }}</option>
                                <option value="1">{{ $t('common.email') }}</option>
                                <option value="2">{{ $t('common.qq') }}</option>
                                <option value="3">{{ $t('common.wechat') }}</option>
                            </select>
                            <input
                                v-if="!selected"
                                type="text"
                                class="pull-left m-r-xs form-control inline"
                                :disabled="!selected"
                            />
                            <input
                                v-else
                                type="text"
                                v-model="detailValue"
                                class="pull-left m-r-xs form-control w-sm"
                                :placeholder="`${$t('common.input')} ${$t('common.' + detailSelect)}`"
                                ref="detailInput"
                            />
                            <select class="pull-left m-r-xs form-control c-select w-sm" v-model="status">
                                <option value="">{{ $t('common.status') }}</option>
                                <option value="1">{{ $t('status.active') }}</option>
                                <option value="0">{{ $t('status.inactive') }}</option>
                            </select>
                            <input
                                type="text"
                                v-model="query.bank"
                                class="pull-left m-r-xs form-control w-sm"
                                :placeholder="$t('agent.bank_account')"
                            />
                            <date-picker
                                width='223'
                                :not-after="today"
                                :shortcuts="shortcuts"
                                :placeholder="$t('agent.joined_at')"
                                class="pull-left m-r-xs"
                                type="date"
                                v-model="created_at"
                                format="yyyy-MM-dd"
                                range
                            />
                            <button class="md-btn w-xs grey-400 pull-right" type="button" @click="clearall">{{ $t('action.clear_all') }}</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
        <div class="box">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th width="7%" class="text-center">{{ $t("common.login_status") }}</th>
                        <th>{{ $t("agent.parent_agent") }}</th>
                        <th>{{ $t("agent.account") }}</th>
                        <th>{{ $t('common.real_name') }}</th>
                        <th>{{ $t("agent.member_count") }}</th>
                        <th>{{ $t("agent.joined_at") }}</th>
                        <th width="240">{{ $t("agent.domain") }}</th>
                        <th>{{ $t("agent.level") }}</th>
                        <th>{{ $t("common.memo") }}</th>
                    </tr>
                </thead>
                <tbody v-if="queryset.length">
                    <tr v-for="agent in queryset" :key="agent.id">
                        <td>
                            <div class="circle" style="font-size: 25px; text-align: center; color:#42b72a;" v-if="agent.is_logged_in==true">&#x25CF;</div>
                            <div class="circle" style="font-size: 25px; text-align: center; color:#d3d3d3;" v-else>&#x25CF;</div>
                        </td>
                        <td>
                            <span v-if="agent.parent_agent">{{ agent.parent_agent.name }}</span>
                            <span v-else>-</span>
                        </td>
                        <td>
                            <router-link :to="'/agent/' + agent.id">
                                {{ agent.username }}
                            </router-link>
                            <br/>
                            <span class="label success" v-if="agent.status===1">{{ $t('status.active') }}</span>
                            <span class="label" v-else>{{ $t('status.inactive') }}</span>
                        </td>
                        <td>
                            <span v-if="agent.real_name">{{ agent.real_name }}</span>
                            <span v-else>-</span>
                        </td>
                        <td>
                            <router-link :to="'/member/?agent=' + agent.username">
                                {{ agent.member_count }}
                            </router-link>
                        </td>
                        <td>
                            <span v-if="agent.created_at">{{ agent.created_at | moment("YYYY-MM-DD HH:mm") }}</span>
                            <span v-else>-</span>
                        </td>
                        <td>
                            <span v-if="agent.domain && isArray(agent.domain.split(','))">
                                <label
                                    class="m-r-sm deamin-label"
                                    v-for="deamin in agent.domain.split(',')"
                                    :key="deamin"
                                >
                                    {{ deamin }}
                                </label>
                            </span>
                            <span v-else-if="agent.domain">{{ agent.domain }}</span>
                            <span v-else>-</span>
                        </td>
                        <td>
                            <span v-if="agent.level">{{ agent.level.name }}</span>
                            <span v-else>-</span>
                        </td>
                        <td>
                            <span v-if="agent.memo">{{ agent.memo }}</span>
                            <span v-else>-</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="row m-b-lg">
            <pulling
                :queryset="queryset"
                :api="agentApi"
                :query="query"
                :optexpand="optexpand"
                ref="pulling"
                @query-data="queryData"
                @query-param="queryParam"
            />
        </div>
    </div>
</template>

<script>
import DatePicker from 'vue2-datepicker'
import api from '../../../api'
import pulling from '../../../components/pulling'
import date from '../../../utils/date'

export default {
    data () {
        return {
            created_at: ['', ''],
            optexpand: 'level,parent_agent',
            showAll: false,
            agentApi: api.agent,
            queryset: [],
            query: {
                id: '',
                username_q: '',
                created_at_0: '',
                created_at_1: '',
                status: '',
                level: '',
                parent_agent: '',
                commission_settings: '',
                promo_code: '',
                real_name_q: '',
                phone: '',
                email: '',
                qq: '',
                wechat: '',
                bank: '',
                member_count: '',
                agent_count: '',
                memo: ''
            },
            details: ['phone', 'email', 'qq', 'wechat'],
            detailSelect: '',
            detailValue: '',
            status: '',
            level: '',
            commission_settings: '0',
            selected: '0',
            filter: {},
            today: date.today[0],
            shortcuts: ['today', 'yesterday', 'this_week', 'this_month', 'last_month'].map(element => Object({
                text: this.$t(`common.${element}`),
                start: date[element][0],
                end: date[element][1]
            }))
        }
    },
    watch: {
        '$route': {
            handler () {
                this.setQueryAll()
                this.queryset = []
                this.$refs.pulling.rebase()
            },
            deep: true
        },
        status (newObj) {
            this.query.status = newObj
        },
        level (newObj) {
            this.query.level = newObj
        },
        selected (newObj) {
            this.details.forEach(element => {
                this.query[element] = ''
            })
            if (newObj) {
                this.detailSelect = this.details[newObj]
                this.$nextTick(() => {
                    this.$refs.detailInput.focus()
                })
            }
        },
        detailValue (newObj) {
            this.query[this.detailSelect] = newObj
        },
        created_at (newObj) {
            [this.query.created_at_0, this.query.created_at_1] = [...newObj]
            if (this.query.created_at_0 !== this.$route.query.created_at_0 || this.query.created_at_1 !== this.$route.query.created_at_1) {
                this.submit()
            }
        }
    },
    created () {
        this.setQueryAll()
        this.$nextTick(() => {
            this.$refs.pulling.rebase()
        })
    },
    methods: {
        setQueryAll () {
            this.level = this.$route.query.level || ''
            this.commission_settings = this.$route.query.commission_settings || ''
            this.status = this.$route.query.status || ''
            this.selected = ''
            this.details.forEach((element, index) => {
                if (this.$route.query[element]) {
                    this.selected = `${index}`
                    this.detailSelect = element
                    this.detailValue = this.$route.query[element]
                }
            })
            if (this.$route.query.created_at_0 || this.$route.query.created_at_1) {
                this.created_at = [this.$route.query.created_at_0, this.$route.query.created_at_1]
            } else {
                this.created_at = [undefined, undefined]
            }

            this.query = Object.assign({}, this.$route.query)
        },
        queryData (queryset) {
            this.queryset = queryset
        },
        queryParam (query) {
            this.query = Object.assign(this.query, query)
        },
        myCommission (val) {
            this.query.commission_settings = val
            this.commission_settings = val
        },
        submit () {
            this.$refs.pulling.submit()
        },
        isArray (o) {
            return Object.prototype.toString.call(o) === '[object Array]'
        },
        clearall: function () {
            this.query = {}
            this.$nextTick(() => {
                this.submit()
            })
        }
    },
    components: {
        DatePicker,
        pulling,
        commissionsetting: require('../../../components/commissionsetting')
    }
}
</script>
<style scoped lang="scss">
    table {
        table-layout: fixed;
    }
    td{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    td .deamin-label{
        display: inline;
    }
</style>
