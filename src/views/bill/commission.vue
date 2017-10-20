<template>
    <div class="box">
        <div class="box-body clearfix form-inline form-input-sm">
            <div class="row">
                <div class="col-xs-10">
                    <label class="m-r">{{$t('common.date')}}</label>
                    <date-picker width='140' v-model="date_0"></date-picker>
                    <span>~</span>
                    <date-picker width='140' v-model="date_1"></date-picker>
                </div>
                <div class="col-xs-12 m-t">
                    <a :href="href" class="md-btn w-sm blue a-btn" :disabled="!hasDates">{{$t('returnrate.export')}}</a>
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
    const format = 'YYYY-MM-DD'

    export default {
        data () {
            return {
                date_0: Vue.moment().format(format),
                date_1: Vue.moment().format(format),
                url: '',
                href: '',
                isDateAvailable: false
            }
        },
        computed: {
            hasDates () {
                let test = this.date_0 !== '' && this.date_1 !== ''
                this.date_0 = Vue.moment(this.date_0).format(format)
                this.date_1 = Vue.moment(this.date_1).format(format)
                this.href = `${api.returnreport}?token=${VueCookie.get('access_token')}&report=commission&date_0=${this.date_0}&date_1=${this.date_1}`
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
