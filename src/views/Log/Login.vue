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
                            >{{ $t('common.login_at') }}
                            </label>
                            <date-picker
                                width='227'
                                style="display: block;"
                                :not-after="today"
                                :shortcuts="shortcuts"
                                type="date"
                                v-model="logindate"
                                format="yyyy-MM-dd"
                                range
                            />
                        </div>
                        <div class="pull-left m-r-xs">
                            <label
                                class="form-control-label p-b-0"
                                :class="{'text-blue': query.member_q}"
                            >{{ $t('member.account') }}
                            </label>
                            <input
                                type="text"
                                v-model.trim="query.member_q"
                                class="form-control w-sm"
                                :placeholder="$t('member.account')"
                                @input="search"
                            />
                        </div>
                        <div class="pull-left m-r-xs">
                            <label
                                class="form-control-label p-b-0"
                                :class="{'text-blue': query.ipaddr_q}"
                            >{{ $t('member.ip') }}
                            </label>
                            <input
                                type="text"
                                v-model.trim="query.ipaddr_q"
                                class="form-control w-sm"
                                :placeholder="$t('member.ip')"
                                @input="search"
                            />
                        </div>
                        <div class="pull-left m-r-xs">
                            <label
                                class="form-control-label p-b-0"
                                :class="{'text-blue': query.domain_q}"
                            >{{ $t('member.loggedin_domain') }}
                            </label>
                            <input
                                style="width: 244px;"
                                type="text"
                                v-model.trim="query.domain_q"
                                class="form-control w-sm"
                                :placeholder="$t('member.loggedin_domain')"
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
                            <span>{{ $t('action.reset_condition') }}</span>
                        </button>
                    </div>
                </div>
            </div>
        </form>
        <div class="box">
            <table class="table table-striped b-t">
                <thead>
                    <tr>
                        <th style="width: 10%" class="text-center">{{ $t('common.login_at') }}</th>
                        <th>{{ $t('member.account') }}</th>
                        <th>{{ $t('member.ip') }}</th>
                        <th>{{ $t('member.isp') }}</th>
                        <th>{{ $t('member.login_platform') }}</th>
                        <th>{{ $t('member.loggedin_domain') }}</th>
                        <th style="width: 10%" class="text-center">{{ $t('member.logout_at') }}</th>
                    </tr>
                </thead>
                <tbody v-if="queryset.length > 0">
                    <tr v-for="report in queryset" :key="report.id">
                        <td class="text-center">{{ report.logindate | moment("YYYY-MM-DD HH:mm:ss") }}</td>
                        <td>
                            <router-link :to="'/member/' + report.member.id">{{ report.member.username }}</router-link>
                        </td>
                        <td>
                            <span>{{ report.ipaddr }}</span><br/>
                            <span class="text-muted">{{ report.address.country || '-' }} {{ report.address.region || '-' }} {{ report.address.city || '-' }}</span>
                        </td>
                        <td>{{ report.isp || '-' }}</td>
                        <td>{{ report.platform || '-' }}</td>
                        <td>{{ report.domain || '-' }}</td>
                        <td class="text-center">
                            <span v-if="report.logoutdate">{{ report.logoutdate | moment("YYYY-MM-DD HH:mm:ss") }}</span>
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
import DatePicker from 'vue2-datepicker'
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
                text: this.$t(`common.${element}`),
                start: date[element][0],
                end: date[element][1]
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
            [this.query.logindate_0, this.query.logindate_1] = [...newObj]
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
        DatePicker,
        Pulling
    }
}
</script>
