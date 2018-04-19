<template>
    <div class="box">
        <div class="box-body clearfix form-inline form-input-sm">
            <div class="row">
                <div class="col-xs-10">
                    <label class="m-r">{{ $t('common.date') }}</label>
                    <date-picker
                        width="248"
                        :shortcuts="shortcuts"
                        type="date"
                        v-model="date_at"
                        format="yyyy-MM-dd"
                        range
                    />
                </div>
                <div class="col-xs-12 m-t">
                    <a
                        :href="href"
                        class="md-btn blue a-btn w-sm"
                        v-show="hasDates"
                    >
                        <i class="fa fa-download"></i>
                        {{ $t('action.download') }}
                    </a>
                    <button
                        class="md-btn blue w-sm"
                        :disabled="!hasDates"
                        v-show="!hasDates"
                    >
                        <i class="fa fa-download"></i>
                        {{ $t('action.download') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import api from '../../api'
    import DatePicker from 'vue2-datepicker'
    import VueCookie from 'vue-cookie'
    import Vue from 'vue'
    import date from '../../utils/date'
    const format = 'YYYY-MM-DD'

    export default {
        data () {
            return {
                date_at: date.today,
                shortcuts: ['today', 'yesterday', 'this_week', 'this_month', 'last_month'].map(element => Object({
                    text: this.$t(`common.${element}`),
                    start: date[element][0],
                    end: date[element][1]
                })),
                url: '',
                href: '',
                isDateAvailable: false
            }
        },
        computed: {
            hasDates () {
                let test = (this.date_at[0] && this.date_at[1])
                let date0 = Vue.moment(this.date_at[0]).format(format)
                let date1 = Vue.moment(this.date_at[1]).format(format)
                this.href = `${api.report_commission}?token=${VueCookie.get('access_token')}&report=commission&date_0=${date0}&date_1=${date1}`
                return test
            }
        },
        components: {
            DatePicker
        }
    }
</script>
<style>
a.a-btn, a.a-btn:hover {
    color: #fff;
}
</style>
