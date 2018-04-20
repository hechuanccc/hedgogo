<template>
    <div class="row">
        <div
            class="col-md-6 col-xs-12"
            v-for="item in dataCategory"
            :key="item"
        >
            <router-link
                :to="routerLinkTo(item)"
                tag="div"
                class="box p-a-sm pointer"
            >
                <h6 class="box-header p-b-0">{{ $t(`common.overview.title.${item}`) }}</h6>
                <div class="box-body text-center" v-if="loading">
                    <i class="fa fa-3x fa-spin fa-spinner fa-fw"></i>
                </div>
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
            loading: true,
            options: {}
        }
    },
    created () {
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
            this.dataCategory.forEach(category => {
                this.$set(this.dataCollection, category, {
                    labels: data.map(e => Vue.moment(e.date).format('MM/DD')),
                    datasets: [{
                        label: this.$t(`common.overview.label.${category}`),
                        pointBorderColor: `hsl(${this.color[category]}, 88%, 55%)`,
                        pointBackgroundColor: '#ffffff',
                        backgroundColor: `hsl(${this.color[category]}, 88%, 80%)`,
                        borderColor: `hsl(${this.color[category]}, 88%, 55%)`,
                        borderWidth: 2,
                        data: data.map(e => e[category].toFixed(2))
                    }]
                })
                this.$set(this.options, category, {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        yAxes: [{
                            ticks: {
                                callback: (value, index, values) => {
                                    if (Number.isInteger(value)) {
                                        return this.lineChart.includes(category) ? (`${value < 0 ? '-' : ''}¥${Math.abs(value).toLocaleString()}`) : value.toLocaleString()
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
                    },
                    tooltips: {
                        callbacks: {
                            label: (tooltipItem, data) => {
                                let _data = data.datasets[0]
                                let value = tooltipItem.yLabel
                                // Only line chart has negative value.
                                return this.lineChart.includes(category) ? `${_data.label}：${value < 0 ? '-' : ''}¥${Math.abs(value).toLocaleString()}` : `${_data.label} : ${value.toLocaleString()}`
                            }
                        }
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
