<template>
    <div>
        <form class="form text-sm" v-on:submit.prevent="submit">
            <div class="box">
                <div class="box-body clearfix form-input-sm">
                    <div class="row m-l-xs m-r-xs">
                        <div class="pull-left m-r-xs">
                            <label
                                class="form-control-label p-b-0"
                                :class="{'text-blue': action_time && (action_time[0] || action_time[1])}"
                            >{{ $t('time.operated_at') }}
                            </label>
                            <date-picker
                                width='227'
                                style="display: block;"
                                :not-after="today"
                                :shortcuts="shortcuts"
                                type="date"
                                v-model="action_time"
                                format='yyyy-MM-dd'
                                range
                            />
                        </div>
                        <div class="pull-left m-r-xs">
                            <label
                                class="form-control-label p-b-0"
                                :class="{'text-blue': query.action_username_q}"
                            >{{ $t('dic.operator') }}
                            </label>
                            <input
                                type="text"
                                v-model="query.action_username_q"
                                class="form-control w-sm"
                                :placeholder="$t('dic.operator')"
                                @input="search"
                            />
                        </div>
                        <div class="pull-left m-r-xs">
                            <label
                                class="form-control-label p-b-0"
                                :class="{'text-blue': query.action_ip_q}"
                            >{{ $t('misc.ip') }}
                            </label>
                            <input
                                type="text"
                                v-model="query.action_ip_q"
                                class="form-control w-sm"
                                :placeholder="$t('misc.ip')"
                                @input="search"
                            />
                        </div>
                        <div class="pull-left m-r-xs">
                            <label
                                class="form-control-label p-b-0"
                                :class="{'text-blue': actionType}"
                            >{{ $t('action.action_type') }}
                            </label>
                            <select
                                class="form-control w-sm c-select"
                                style="display: block;"
                                v-model="actionType"
                            >
                                <option value=""><span class="text-muted">{{ $t('system.please_select') }}</span></option>
                                <option
                                    :value="`${index}`"
                                    v-for="(actionType, index) in actionTypes"
                                    :key="index"
                                >{{ $t('action.action_types.' + actionType) }}
                                </option>
                            </select>
                        </div>
                        <div class="pull-left m-r-xs">
                            <label
                                class="form-control-label p-b-0"
                                :class="{'text-blue': query.description_q}"
                            >{{ $t('action.description') }}
                            </label>
                            <input
                                type="text"
                                v-model="query.description_q"
                                class="form-control"
                                style="width: 224px;"
                                :placeholder="`${$t('system.enter_keywords')} ${$t('misc.separated_by_spaces')}`"
                                @input="search"
                            />
                        </div>
                        <div class="pull-left m-r-xs">
                            <label
                                class="form-control-label p-b-0"
                                :class="{'text-blue': actionResult}"
                                style="display: block;"
                            >{{ $t('dic.status') }}
                            </label>
                            <label class="sm-check m-r m-t-sm m-l">
                                <input class="c-radio" type="radio" value="" v-model="actionResult">
                                <i class="blue m-r-xs"></i>
                                {{ $t('system.show_all') }}
                            </label>
                            <label class="sm-check m-r">
                                <input class="c-radio" type="radio" value="1" v-model="actionResult">
                                <i class="blue m-r-xs"></i>
                                <span class="label" :class="{'success': actionResult === '1'}">{{ $t('status.success') }}</span>
                            </label>
                            <label class="sm-check m-r">
                                <input class="c-radio" type="radio" value="0" v-model="actionResult">
                                <i class="blue m-r-xs"></i>
                                <span class="label" :class="{'danger': actionResult === '0'}">{{ $t('status.failed') }}</span>
                            </label>
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
                        <th style="width: 10%" class="text-center">{{ $t('time.operated_at') }}</th>
                        <th style="width: 10%">{{ $t('dic.operator') }}</th>
                        <th style="width: 10%">{{ $t('dic.role') }}</th>
                        <th style="width: 10%">{{ $t('misc.ip') }}</th>
                        <th style="width: 10%">{{ $t('action.action_type') }}</th>
                        <th>{{ $t('action.description') }}</th>
                        <th style="width: 5%" class="text-center">{{ $t('dic.status') }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(report, index) in queryset" :key="index">
                        <td class="text-center">{{ report.action_time | moment('YYYY-MM-DD HH:mm:ss') }}</td>
                        <td>{{ report.action_username || '-' }}</td>
                        <td>{{ report.action_user_type || '-' }}</td>
                        <td>{{ report.action_ip || '-' }}</td>
                        <td>{{ report.action_type || '-' }}</td>
                        <td class="text-break-all" v-if="report.description" v-html="report.description"></td>
                        <td v-else>-</td>
                        <td class="text-center">
                            <span v-if="report.action_result" class="label success">{{ $t('status.success') }}</span>
                            <span v-else class="label danger">{{ $t('status.failed') }}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="row m-b-sm">
            <pulling
                :queryset="queryset"
                :query="query"
                @query-data="queryData"
                @query-param="queryParam"
                :api="url.log.action"
                ref="pulling"
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
            action_time: ['', ''],
            query: {},
            queryset: [],
            actionResult: '',
            actionType: '',
            actionTypes: ['finance', 'configuration', 'member_information', 'game'],
            today: date.today[0],
            shortcuts: ['today', 'yesterday', 'this_week', 'this_month', 'last_month'].map(element => Object({
                text: this.$t(`time.${element}`),
                start: date[element][0],
                end: date[element][1]
            })),
            loading: true,
            url
        }
    },
    created () {
        this.setQueryAll()
        this.$nextTick(() => {
            this.$refs.pulling.rebase()
        })
    },
    watch: {
        actionResult (newObj) {
            this.query.action_result = newObj || ''
            this.submit()
        },
        actionType (newObj) {
            this.query.action_type = newObj || ''
            this.submit()
        },
        '$route': {
            handler () {
                this.loading = true
                this.setQueryAll()
                this.queryset = []
                this.$refs.pulling.rebase()
            },
            deep: true
        },
        action_time (newObj) {
            [this.query.action_time_0, this.query.action_time_1] = [...newObj]
            this.submit()
        }
    },
    computed: {
        isQueryEmpty () {
            return $.compareQuery(this.query, {})
        }
    },
    methods: {
        setQueryAll () {
            if (this.$route.query.action_time_0 || this.$route.query.action_time_1) {
                this.action_time = [this.$route.query.action_time_0, this.$route.query.action_time_1]
            } else {
                this.action_time = [undefined, undefined]
            }
            this.actionResult = this.$route.query.action_result || ''
            this.actionType = this.$route.query.action_type || ''
            this.query = Object.assign({}, this.$route.query)
        },
        queryData (queryset) {
            this.loading = false
            this.queryset = queryset
            this.queryset.forEach(element => {
                element.description = $.htmlTransform(element.description)
            })
        },
        queryParam (query) {
            this.query = Object.assign(this.query, query)
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
