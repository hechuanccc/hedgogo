<template>
    <div class="row">
        <div class="col-md-6 col-xs-12" v-for="item in dataCategory" :key="item">
            <router-link :to="routerLinkTo(item)" tag="div" class="box p-a-sm">
                <div class="box-header p-b-0"><h6>{{ $t(`common.overview.title.${item}`) }}</h6></div>
                <div class="box-body text-center" v-if="loading"><i class="fa fa-3x fa-spin fa-spinner fa-fw"></i></div>
                <div class="box-body" v-else-if="dataCollection[item] && lineChart.includes(item)">
                    <line-chart
                        :chart-data="dataCollection[item]"
                        :options="options[item]"
                        :height="250"
                    />
                </div>
                <div class="box-body" v-else-if="dataCollection[item] && barChart.includes(item)">
                    <bar-chart
                        :chart-data="dataCollection[item]"
                        :options="options[item]"
                        :height="250"
                    />
                </div>
                <div class="box-body" v-else>
                    <span>{{ $t('common.no_record') }}</span>
                </div>
            </router-link>
        </div>
    </div>
</template>
<script>
import LineChart from '../components/LineChart'
import BarChart from '../components/BarChart'
import api from '../api'
import Vue from 'vue'
export default {
    data () {
        return {
            dataCollection: {},
            labels: [],
            dataCategory: [
                'amount',
                'profit',
                'betrecord_count',
                'register_count'
            ],
            lineChart: [
                'amount',
                'profit'
            ],
            barChart: [
                'betrecord_count',
                'register_count'
            ],
            color: {
                amount: 207,
                profit: 262,
                betrecord_count: 45,
                register_count: 18
            },
            loading: undefined,
            options: {}
        }
    },
    created () {
        this.loading = true
        this.getOverviewData()
    },
    methods: {
        getOverviewData () {
            this.$http.get(api.report_overview).then(data => {
                this.fillData(data)
                this.loading = false
            })
        },
        fillData (data) {
            data.sort((a, b) => Vue.moment(a.date) - Vue.moment(b.date))
            this.dataCategory.forEach(title => {
                this.$set(this.dataCollection, title, {
                    labels: data.map(e => Vue.moment(e.date).format('MM/DD')),
                    datasets: [{
                        label: this.$t(`common.overview.label.${title}`),
                        pointBorderColor: `hsl(${this.color[title]}, 88%, 55%)`,
                        pointBackgroundColor: '#ffffff',
                        backgroundColor: `hsl(${this.color[title]}, 88%, 80%)`,
                        borderColor: `hsl(${this.color[title]}, 88%, 55%)`,
                        borderWidth: 2,
                        data: data.map(e => e[title].toFixed(3))
                    }]
                })
                this.$set(this.options, title, {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        yAxes: [{
                            ticks: {
                                callback: (value, index, values) => {
                                    if (Number.isInteger(value)) {
                                        return this.lineChart.includes(title) ? (`${value < 0 ? '-' : ''}¥${Math.abs(value).toLocaleString()}`) : value
                                    }
                                }
                            },
                            gridLines: {
                                display: true
                            }
                        }],
                        xAxes: [{
                            barPercentage: 1.0
                        }]
                    },
                    legend: {
                        onClick () {}
                    }
                })
            })
        },
        routerLinkTo (item) {
            if (item === 'amount' || item === 'betrecord_count' || item === 'profit') {
                return 'report/finance_report'
            } else if (item === 'register_count') {
                return 'report/member_report'
            }
        }
    },
    components: {
        LineChart,
        BarChart
    }
}
</script>
<style scoped>
div.box:hover,
div.box:focus,
div.box:active {
    transform: scale(1.01);
    cursor: pointer;
}
</style>
