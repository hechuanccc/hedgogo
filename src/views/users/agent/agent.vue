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
        <form class="form" @submit.prevent="submit">
            <div class="box">
                <div class="box-body clearfix form-input-sm">
                    <div class="row m-l-xs m-r-xs">
                        <div class="pull-left m-r-xs">
                            <label
                                class="form-control-label p-b-0"
                                :class="{'text-blue': query.username_q}"
                            >{{ $t('common.username') }}
                            </label>
                            <input
                                v-model.trim="query.username_q"
                                class="form-control w-sm"
                                :placeholder="$t('agent.account')"
                                @input="search"
                            />
                        </div>
                        <div class="pull-left m-r-xs">
                            <label
                                class="form-control-label p-b-0"
                                :class="{'text-blue': query.real_name_q}"
                            >{{ $t('common.real_name') }}
                            </label>
                            <input
                                v-model.trim="query.real_name_q"
                                class="form-control w-sm"
                                :placeholder="$t('common.real_name')"
                                @input="search"
                            />
                        </div>
                        <div class="pull-left m-r-xs">
                            <label
                                class="form-control-label p-b-0"
                                :class="{'text-blue': query.promo_code_q}"
                            >{{ $t('agent.promo_code') }}
                            </label>
                            <input
                                v-model.trim="query.promo_code_q"
                                class="form-control w-sm" 
                                :placeholder="$t('agent.promo_code')"
                                @input="search"
                            />
                        </div>
                        <div class="pull-left m-r-xs">
                            <label
                                class="form-control-label p-b-0"
                                :class="{'text-blue': query.parent_agent_q}"
                            >{{ $t('agent.parent_agent') }}
                            </label>
                            <input
                                v-model="query.parent_agent_q"
                                class="form-control w-sm"
                                :placeholder="$t('agent.parent_agent')"
                                @input="search"
                            />
                        </div>
                        <div class="pull-left m-r-xs">
                            <label
                                class="form-control-label p-b-0"
                                :class="{'text-blue': query.level}"
                            >{{ $t('agent.level') }}
                            </label>
                            <select
                                class="form-control c-select w-sm"
                                style="display: block;"
                                v-model="level"
                            >
                                <option value="">{{ $t('agent.level') }}</option>
                                <option value="1">大股东</option>
                                <option value="2">股东</option>
                                <option value="3">总代理</option>
                                <option value="4">代理</option>
                            </select>
                        </div>
                        <div class="pull-left m-r-xs">
                            <label
                                class="form-control-label p-b-0"
                                :class="{'text-blue': commission_settings}"
                            >{{ $t('agent.commission_setting') }}
                            </label>
                            <commissionsetting
                                style="display: block;"
                                :commissionsetting="commission_settings"
                                @myCommission="myCommission"
                            />
                        </div>
                    </div>
                    <div class="row m-t-xs m-r-xs m-l-xs">
                        <div class="pull-left m-r-xs">
                            <label
                                class="form-control-label p-b-0"
                                :class="{'text-blue': userInfo_q}"
                            >{{ $t('member.contact_info') }}
                            </label>
                            <div style="display: block;">
                                <select
                                class="pull-left form-control w-sm c-select no-b-r"
                                v-model="userInfoSelect"
                                >
                                <option value="">{{ $t('common.please_select') }}</option>
                                <option value="0">{{ $t('common.phone') }}</option>
                                <option value="1">{{ $t('common.email') }}</option>
                                <option value="2">{{ $t('common.qq') }}</option>
                                <option value="3">{{ $t('common.wechat') }}</option>
                                </select>
                                <input
                                v-model.trim="userInfo_q"
                                class="form-control w-sm"
                                style="width: 122px;"
                                :disabled="!userInfoSelect"
                                />
                            </div>
                        </div>
                        <div class="pull-left m-r-xs">
                            <label
                                class="form-control-label p-b-0"
                                :class="{'text-blue': status}"
                            >{{ $t('common.status') }}
                            </label>
                            <select
                                class="form-control c-select w-sm"
                                style="display: block;"
                                v-model="status"
                            >
                                <option value="">{{ $t('common.please_select') }}</option>
                                <option value="1">{{ $t('status.active') }}</option>
                                <option value="0">{{ $t('status.inactive') }}</option>
                            </select>
                        </div>
                        <div class="pull-left m-r-xs">
                            <label
                                class="form-control-label p-b-0"
                                :class="{'text-blue': query.bank_account_q}"
                            >{{ $t('agent.bank_account') }}
                            </label>
                            <input
                                v-model="query.bank_account_q"
                                class="form-control w-sm"
                                :placeholder="$t('agent.bank_account')"
                                @input="search"
                            />
                        </div>
                        <div class="pull-left m-r-xs">
                            <label
                                class="form-control-label p-b-0"
                                :class="{'text-blue': created_at && (created_at[0] || created_at[1])}"
                            >{{ $t('agent.joined_at') }}
                            </label>
                            <date-picker
                                width='244'
                                style="display: block;"
                                :not-after="today"
                                :shortcuts="shortcuts"
                                :inputClass="'mx-input form-control'"
                                type="date"
                                v-model="created_at"
                                format="yyyy-MM-dd"
                                range
                            />
                        </div>
                        <button
                            class="md-btn w-xs pull-right btn m-t-md"
                            type="button"
                            @click="clearAll"
                            :disabled="isQueryEmpty"
                        >
                            <i v-if="loading" class="fa fa-spin fa-spinner"></i> 
                            <i v-else class="fa fa-trash-o"></i> 
                            <span>{{ $t('action.reset_condition') }}</span>
                        </button>
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
import _ from 'lodash'
import $ from '../../../utils/util'

export default {
    data () {
        return {
            agentApi: api.agent,
            queryset: [],
            query: {},
            created_at: ['', ''],
            optexpand: 'level,parent_agent',
            status: '',
            level: '',
            commission_settings: '',
            today: date.today[0],
            shortcuts: ['today', 'yesterday', 'this_week', 'this_month', 'last_month'].map(element => Object({
                text: this.$t(`common.${element}`),
                start: date[element][0],
                end: date[element][1]
            })),
            userInfos: ['phone', 'email', 'qq', 'wechat'],
            userInfoSelect: '',
            userInfo_q: '',
            loading: true
        }
    },
    watch: {
        '$route': {
            handler () {
                this.loading = true
                this.setQueryAll()
                this.queryset = []
                this.$refs.pulling.rebase()
            },
            deep: true
        },
        status (newObj) {
            this.query.status = newObj || ''
            this.submit()
        },
        level (newObj) {
            this.query.level = newObj || ''
            this.submit()
        },
        userInfo_q (newObj) {
            this.setUserInfo()
        },
        userInfoSelect (newObj) {
            this.setUserInfo()
        },
        created_at (newObj) {
            [this.query.created_at_0, this.query.created_at_1] = [...newObj]
            this.submit()
        }
    },
    created () {
        this.setQueryAll()
        this.rebase()
    },
    computed: {
        isQueryEmpty () {
            return $.compareQuery(this.query, {})
        }
    },
    methods: {
        setQueryAll () {
            this.level = this.$route.query.level || ''
            this.commission_settings = this.$route.query.commission_settings || ''
            this.status = this.$route.query.status || ''
            this.userInfoSelect = this.userInfos.findIndex(element => this.$route.query[element + '_q']).toString()
            if (this.userInfoSelect !== '-1') {
                let key = this.userInfos[this.userInfoSelect]
                this.userInfo_q = this.$route.query[key + '_q']
            } else {
                this.userInfoSelect = '0'
                this.userInfo_q = ''
            }
            if (this.$route.query.created_at_0 || this.$route.query.created_at_1) {
                this.created_at = [this.$route.query.created_at_0, this.$route.query.created_at_1]
            } else {
                this.created_at = [undefined, undefined]
            }
            this.query = Object.assign({}, this.$route.query)
        },
        queryData (queryset) {
            this.queryset = queryset
            this.loading = false
        },
        queryParam (query) {
            this.query = Object.assign(this.query, query)
        },
        myCommission (val) {
            this.query.commission_settings = val
            this.submit()
        },
        rebase () {
            this.$nextTick(() => {
                this.$refs.pulling.rebase()
            })
        },
        submit () {
            if (!$.compareQuery(this.query, this.$route.query)) {
                this.$refs.pulling.submit()
            }
        },
        search:
            _.debounce(function () {
                this.submit()
            },
        700),
        clearAll () {
            this.query = {}
            this.$nextTick(() => {
                this.submit()
            })
        },
        isArray (o) {
            return Object.prototype.toString.call(o) === '[object Array]'
        },
        setUserInfo () {
            let key = this.userInfos[this.userInfoSelect]
            this.userInfos.forEach(element => {
                this.query[element + '_q'] = element === key ? this.userInfo_q : ''
            })
            this.search()
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
