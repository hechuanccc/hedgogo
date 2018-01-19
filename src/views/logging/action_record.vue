<template>
    <div>
        <form class="form text-sm" v-on:submit.prevent="submit">
            <div class="box">
                <div class="box-body clearfix form-input-sm">
                    <div class="row m-l-xs m-r-xs">
                        <div class="pull-left m-r-xs">
                            <label class="form-control-label p-b-0">{{ $t('actionrecord.action_time') }}</label>
                            <date-picker
                                width='227'
                                style="display: block;"
                                :not-after="today"
                                :shortcuts="shortcuts"
                                :inputClass="'input form-control'"
                                type="date"
                                v-model="action_time"
                                format="yyyy-MM-dd"
                                range
                            />
                        </div>
                        <div class="pull-left m-r-xs">
                            <label class="form-control-label p-b-0">{{ $t('actionrecord.action_username') }}</label>
                            <input
                                type="text"
                                v-model="query.action_username_q"
                                class="form-control w-sm"
                                :placeholder="$t('actionrecord.action_username')"
                                @input="search"
                            />
                        </div>
                        <div class="pull-left m-r-xs">
                            <label class="form-control-label p-b-0">{{ $t('actionrecord.action_ip') }}</label>
                            <input
                                type="text"
                                v-model="query.action_ip_q"
                                class="form-control w-sm"
                                :placeholder="$t('actionrecord.action_ip')"
                                @input="search"
                            />
                        </div>
                        <div class="pull-left m-r-xs">
                            <label class="form-control-label p-b-0">{{ $t('actionrecord.action_type') }}</label>
                            <select
                                class="form-control w-sm c-select"
                                style="display: block;"
                                v-model="action_type">
                                <option value=""><span class="text-muted">{{ $t('common.please_select') }}</span></option>
                                <option
                                    :value="`${index}`"
                                    v-for="(actionType, index) in action_types"
                                    :key="index"
                                >{{ $t('actionrecord.action_types.' + actionType) }}
                                </option>
                            </select>
                        </div>
                        <div class="pull-left m-r-xs">
                            <label class="form-control-label p-b-0">{{ $t('actionrecord.description') }}</label>
                            <input
                                type="text"
                                v-model="query.description_q"
                                class="form-control"
                                style="width: 224px;"
                                :placeholder="`${$t('actionrecord.enter_keywords')} ${$t('actionrecord.separated_by_spaces')}`"
                                @input="search"
                            />
                        </div>
                        <div class="pull-left m-r-xs">
                            <label class="form-control-label p-b-0" 
                                style="display: block;">
                                {{ $t('actionrecord.action_result') }}
                            </label>
                            <label class="sm-check m-r m-t-sm m-l">
                                <input class="c-radio" type="radio" value="" v-model="action_result">
                                <i class="blue m-r-xs"></i>
                                {{ $t('common.show_all') }}
                            </label>
                            <label class="sm-check m-r">
                                <input class="c-radio" type="radio" value="1" v-model="action_result">
                                <i class="blue m-r-xs"></i>
                                {{ $t('status.success') }}
                            </label>
                            <label class="sm-check m-r">
                                <input class="c-radio" type="radio" value="0" v-model="action_result">
                                <i class="blue m-r-xs"></i>
                                {{ $t('status.failed') }}
                            </label>
                        </div>
                        <div class="pull-right">
                            <button
                                type="button"
                                class="btn btn-icon white p-b-0 m-t-sm"
                                @click="clearAll"
                                v-if="!loading"
                            >
                                <i class="fa fa-remove text-blue"></i>
                            </button>
                            <button
                                type="button"
                                class="btn btn-icon white p-b-0 m-t-sm"
                                v-else
                                disabled
                            >
                                <i class="fa fa-spin fa-spinner"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
        <div class="box">
            <table class="table table-striped b-t">
                <thead>
                    <tr>
                        <th style="width: 10%" class="text-center">{{ $t('actionrecord.action_time') }}</th>
                        <th style="width: 10%">{{ $t('actionrecord.action_username') }}</th>
                        <th style="width: 10%">{{ $t('actionrecord.action_user_type') }}</th>
                        <th style="width: 10%">{{ $t('actionrecord.action_ip') }}</th>
                        <th style="width: 10%">{{ $t('actionrecord.action_type') }}</th>
                        <th>{{ $t('actionrecord.description') }}</th>
                        <th style="width: 5%" class="text-center">{{ $t('actionrecord.action_result') }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(report, index) in queryset" :key="index">
                        <td class="text-center">{{ report.action_time | moment("YYYY-MM-DD HH:mm:ss") }}</td>
                        <td>{{ report.action_username || '-' }}</td>
                        <td>{{ report.action_user_type || '-' }}</td>
                        <td>{{ report.action_ip || '-' }}</td>
                        <td>{{ report.action_type || '-' }}</td>
                        <td v-if="report.description" v-html="report.description"></td>
                        <td v-else>-</td>
                        <td class="text-center">
                            <span v-if="report.action_result" class="label success">{{ $t('status.success') }}</span>
                            <span v-else class="label  danger">{{ $t('status.failed') }}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="row m-b-lg">
            <pulling
                :queryset="queryset"
                :query="query"
                @query-data="queryData"
                @query-param="queryParam"
                :api="actionrecordApi"
                ref="pulling"
            />
        </div>
    </div>
</template>

<script>
import DatePicker from 'vue2-datepicker'
import api from '../../api'
import pulling from '../../components/pulling'
import date from '../../utils/date'
import Vue from 'vue'
import _ from 'lodash'

const format = 'YYYY-MM-DD'
export default {
    data () {
        return {
            actionrecordApi: api.action_record,
            action_time: ['', ''],
            query: {},
            queryset: [],
            action_result: '',
            action_type: '',
            action_types: ['finance', 'configuration', 'member_information', 'game'],
            today: Vue.moment().format(format),
            shortcuts: ['today', 'yesterday', 'this_week', 'this_month', 'last_month'].map(element => Object({
                text: this.$t(`common.${element}`),
                start: date[element][0],
                end: date[element][1]
            })),
            loading: true
        }
    },
    created () {
        this.setQueryAll()
        this.$nextTick(() => {
            this.$refs.pulling.rebase()
        })
    },
    watch: {
        action_result (newObj) {
            this.query.action_result = newObj || ''
            if ((newObj && newObj !== this.$route.query.action_result) || (!newObj && this.$route.query.action_result)) {
                this.submit()
            }
        },
        action_type (newObj) {
            this.query.action_type = newObj || ''
            if ((newObj && newObj !== this.$route.query.action_type) || (!newObj && this.$route.query.action_type)) {
                this.submit()
            }
        },
        '$route': {
            handler () {
                this.loading = true
                this.setQueryAll()
                this.$refs.pulling.rebase()
            },
            deep: true
        },
        action_time (newObj) {
            [this.query.action_time_0, this.query.action_time_1] = [...newObj]
            if (this.query.action_time_0 !== this.$route.query.action_time_0 || this.query.action_time_1 !== this.$route.query.action_time_1) {
                this.submit()
            }
        }
    },
    methods: {
        setQueryAll () {
            if (this.$route.query.action_time_0 || this.$route.query.action_time_1) {
                this.action_time = [this.$route.query.action_time_0, this.$route.query.action_time_1]
            } else {
                this.action_time = [undefined, undefined]
            }
            this.action_result = this.$route.query.action_result || ''
            this.action_type = this.$route.query.action_type || ''
            this.query = Object.assign({}, this.$route.query)
        },
        queryData (queryset) {
            this.loading = false
            this.queryset = queryset
            this.queryset.forEach(element => {
                element.description = element.description.replace(/(\r\n|\r|\n)/g, '<br/>')
            })
        },
        queryParam (query) {
            this.query = Object.assign(this.query, query)
        },
        submit () {
            this.$refs.pulling.submit()
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
        pulling
    }
}
</script>
