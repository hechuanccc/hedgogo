<template>
    <div>
        <form class="form text-sm" v-on:submit.prevent="submit">
            <div class="box">
                <div class="box-body clearfix form-input-sm">
                    <div class="row m-l-xs m-r-xs">
                        <div class="pull-left m-r-xs">
                            <label
                                class="form-control-label p-b-0"
                                :class="{'text-blue': logindate && (logindate[0] || logindate[1])}"
                            >{{ $t('time.login_at') }}
                            </label>
                            <el-date-picker
                                style="display: block;"
                                v-model="logindate"
                                size="mini"
                                type="daterange"
                                align="right"
                                unlink-panels
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :picker-options="{shortcuts}"
                            />
                        </div>
                        <div class="pull-left m-r-xs">
                            <label
                                class="form-control-label p-b-0"
                                :class="{'text-blue': query.member_q}"
                            >{{ $t('user.account') }}
                            </label>
                            <input
                                type="text"
                                v-model.trim="query.member_q"
                                class="form-control w-sm"
                                :placeholder="$t('user.account')"
                                @input="search"
                            />
                        </div>
                        <div class="pull-left m-r-xs">
                            <label
                                class="form-control-label p-b-0"
                                :class="{'text-blue': query.ipaddr_q}"
                            >{{ $t('misc.ip') }}
                            </label>
                            <input
                                type="text"
                                v-model.trim="query.ipaddr_q"
                                class="form-control w-sm"
                                :placeholder="$t('misc.ip')"
                                @input="search"
                            />
                        </div>
                        <div class="pull-left m-r-xs">
                            <label
                                class="form-control-label p-b-0"
                                :class="{'text-blue': query.domain_q}"
                            >{{ $t('user.loggedin_domain') }}
                            </label>
                            <input
                                style="width: 244px;"
                                type="text"
                                v-model.trim="query.domain_q"
                                class="form-control w-sm"
                                :placeholder="$t('user.loggedin_domain')"
                                @input="search"
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
                            <span>{{ $t('system.reset_condition') }}</span>
                        </button>
                    </div>
                </div>
            </div>
        </form>
        <div class="box">
            <table class="table table-striped b-t">
                <thead>
                    <tr>
                        <th style="width: 10%" class="text-center">{{ $t('time.login_at') }}</th>
                        <th>{{ $t('user.account') }}</th>
                        <th>{{ $t('misc.ip') }}</th>
                        <th>{{ $t('misc.isp') }}</th>
                        <th>{{ $t('dic.platform') }}</th>
                        <th>{{ $t('user.loggedin_domain') }}</th>
                        <th style="width: 10%" class="text-center">{{ $t('time.logout_at') }}</th>
                    </tr>
                </thead>
                <tbody v-if="queryset.length > 0">
                    <tr v-for="report in queryset" :key="report.id">
                        <td class="text-center">{{ report.logindate | moment('YYYY-MM-DD HH:mm:ss') }}</td>
                        <td>
                            <router-link :to="'/member/' + report.member.id">{{ report.member.username }}</router-link>
                        </td>
                        <td>
                            <span>{{ report.ipaddr }}</span><br/>
                            <span class="text-muted">{{ report.address.country || '-' }} {{ report.address.region || '-' }} {{ report.address.city || '-' }}</span>
                        </td>
                        <td>{{ report.isp || '-' }}</td>
                        <td>{{ $t('dic.' + report.platform.toLowerCase()) || '-' }}</td>
                        <td>{{ report.domain || '-' }}</td>
                        <td class="text-center">
                            <span v-if="report.logoutdate">{{ report.logoutdate | moment('YYYY-MM-DD HH:mm:ss') }}</span>
                            <span v-else>-</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="row m-b-sm">
            <pulling
                :api="url.log.login"
                :extra="'report_flag=true'"
                :query="query"
                :queryset="queryset"
                ref="pulling"
                @query-data="queryData"
                @query-param="queryParam"
            />
        </div>
    </div>
</template>

<script>
import url from '../../service/url'
import Pulling from '../../components/Pulling'
import date from '../../utils/date'
import _ from 'lodash'
import $ from '../../utils/util'

export default {
    data () {
        return {
            query: {},
            queryset: [],
            logindate: ['', ''],
            today: date.today[0],
            shortcuts: ['today', 'yesterday', 'this_week', 'this_month', 'last_month'].map(element => Object({
                text: this.$t(`time.${element}`),
                onClick (p) {
                    p.$emit('pick', date[element])
                }
            })),
            loading: true,
            url
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
        logindate (newObj) {
            [this.query.logindate_0, this.query.logindate_1] = [...(newObj || [])]
            this.submit()
        }
    },
    created () {
        this.setQueryAll()
        this.$nextTick(() => {
            this.$refs.pulling.rebase()
        })
    },
    computed: {
        isQueryEmpty () {
            return $.compareQuery(this.query, {})
        }
    },
    methods: {
        setQueryAll () {
            if (this.$route.query.logindate_0 || this.$route.query.logindate_1) {
                this.logindate = [this.$route.query.logindate_0, this.$route.query.logindate_1]
            } else {
                this.logindate = [undefined, undefined]
            }
            this.query = Object.assign({}, this.$route.query)
        },
        submit () {
            if (!$.compareQuery(this.query, this.$route.query)) {
                this.$refs.pulling.submit()
            }
        },
        queryData (queryset) {
            this.loading = false
            this.queryset = queryset
        },
        queryParam (query) {
            this.query = Object.assign(this.query, query)
        },
        search:
            _.debounce(function () {
                this.submit()
            },
        500),
        clearAll () {
            this.query = {}
            this.$nextTick(() => {
                this.submit()
            })
        }
    },
    components: {
        Pulling
    }
}
</script>
