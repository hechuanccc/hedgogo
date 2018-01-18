<template>
    <div>
        <form class="form text-sm" v-on:submit.prevent="submit">
            <div class="box">
                <div class="box-body clearfix form-inline form-input-sm">
                    <div class="row m-l-xs m-r-xs">
                        <date-picker
                            width='227'
                            :not-after="today"
                            :shortcuts="shortcuts"
                            :placeholder="$t('common.please_select') + $t('actionrecord.action_time')"
                            class="pull-left m-r-xs"
                            type="date"
                            v-model="action_time"
                            format="yyyy-MM-dd"
                            range
                        />
                        <div class="form-group pull-left m-r-xs p-t-xs">
                            <label class="form-control-label">
                                {{ $t('actionrecord.action_result') }}
                            </label>
                            <label class="sm-check m-r">
                                <input type="radio" value="" v-model="action_result">
                                <i class="blue m-r-xs"></i>
                                {{ $t('common.show_all') }}
                            </label>
                            <label class="sm-check m-r">
                                <input type="radio" value="1" v-model="action_result">
                                <i class="blue m-r-xs"></i>
                                {{ $t('status.success') }}
                            </label>
                            <label class="sm-check m-r">
                                <input type="radio" value="0" v-model="action_result">
                                <i class="blue m-r-xs"></i>
                                {{ $t('status.failed') }}
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </form>
        <div class="box">
            <table class="table table-striped b-t">
                <thead>
                    <tr>
                        <th>{{$t('actionrecord.action_time')}}</th>
                        <th>{{$t('actionrecord.action_user')}}</th>
                        <th>{{$t('actionrecord.action_user_type')}}</th>
                        <th>{{$t('actionrecord.action_ip')}}</th>
                        <th>{{$t('actionrecord.action_type')}}</th>
                        <th>{{$t('actionrecord.description')}}</th>
                        <th>{{$t('actionrecord.action_result')}}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(report, index) in queryset" :key="index">
                        <td>{{report.action_time | moment("YYYY-MM-DD HH:mm:ss")}}</td>
                        <td>{{report.action_user || '-'}}</td>
                        <td>{{report.action_user_type || '-'}}</td>
                        <td>{{report.action_ip || '-'}}</td>
                        <td>{{report.action_type || '-'}}</td>
                        <td v-if="report.description" v-html="report.description"></td>
                        <td v-else>-</td>
                        <td>
                            <span v-if="report.action_result" class="label success">{{$t('status.success')}}</span>
                            <span v-else class="label  danger">{{$t('status.failed')}}</span>
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
            today: Vue.moment().format(format),
            shortcuts: ['today', 'yesterday', 'this_week', 'this_month', 'last_month'].map(element => Object({
                text: this.$t(`common.${element}`),
                start: date[element][0],
                end: date[element][1]
            }))
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
        '$route': {
            handler () {
                this.setQueryAll()
                this.queryset = []
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
                this.selected = '0'
                this.action_time = [this.$route.query.action_time_0, this.$route.query.action_time_1]
            } else {
                this.action_time = [undefined, undefined]
            }
            this.action_result = this.$route.query.action_result || ''
            this.query = Object.assign({}, this.$route.query)
        },
        queryData (queryset) {
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
        }
    },
    components: {
        DatePicker,
        pulling
    }
}
</script>
