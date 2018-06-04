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
                class="box p-a-xs pointer"
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
                        :height="300"
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
export default {
    data () {
        return {
            dataCollection: {},
            labels: [],
            dataCategory: [
                'amount',
                'profit',
                'game',
                'register_count'
            ],
            lineChart: [
                'amount',
                'profit'
            ],
            barChart: [
                'game',
                'register_count'
            ],
            finance: [
                'amount',
                'profit',
                'game'
            ],
            color: {
                // hsl
                amount: [207, 88, 80],
                profit: [262, 88, 80],
                register_count: [18, 88, 80],
                game: [
                    [38, 88, 80],
                    [0, 88, 80],
                    [0, 0, 75]
                ]
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
            this.$http.get(api.report.general).then(data => {
                this.fillData(data)
                this.loading = false
            })
        },
        fillData (data) {
            this.dataCategory.forEach(category => {
                if (category === 'game') {
                    let maxBet = Math.max(...data[category].bet_amount)
                    maxBet <= 0 && (maxBet = 1)
                    let maxProfit = Math.max(...data[category].profit)
                    maxProfit <= 0 && (maxProfit = 1)
                    let scaler = maxBet / maxProfit
                    let minProfit = Math.min(...data[category].profit)
                    minProfit > 0 && (minProfit = 0)
                    let minBet = minProfit * scaler
                    this.$set(this.dataCollection, category, {
                        labels: data[category].label,
                        datasets: [{
                            label: this.$t('common.overview.label.bet_amount'),
                            yAxisID: 'bet_amount',
                            backgroundColor: this.hslTransform(this.color[category][0]),
                            borderWidth: 0,
                            data: data[category].bet_amount
                        }, {
                            label: this.$t('common.overview.label.profit'),
                            yAxisID: 'profit',
                            backgroundColor: data[category].profit.map(p => p >= 0
                                ? this.hslTransform(this.color[category][1])
                                : this.hslTransform(this.color[category][2])),
                            borderWidth: 0,
                            data: data[category].profit
                        }]
                    })
                    this.$set(this.options, category, {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            yAxes: [{
                                id: 'bet_amount',
                                position: 'left',
                                ticks: {
                                    callback: (value, index, values) => {
                                        if (Number.isInteger(value)) {
                                            return this.finance.includes(category) ? (`${value < 0 ? '-' : ''}¥${Math.abs(value).toLocaleString()}`) : value.toLocaleString()
                                        }
                                    },
                                    max: maxBet,
                                    min: minBet
                                },
                                afterBuildTicks: (chart) => {
                                    chart.ticks.pop()
                                    chart.ticks.splice(0, 1)
                                },
                                gridLines: {
                                    zeroLineWidth: 1,
                                    display: true,
                                    drawOnChartArea: true
                                }
                            }, {
                                id: 'profit',
                                position: 'right',
                                ticks: {
                                    callback: (value, index, values) => {
                                        if (Number.isInteger(value)) {
                                            return this.finance.includes(category) ? (`${value < 0 ? '-' : ''}¥${Math.abs(value).toLocaleString()}`) : value.toLocaleString()
                                        }
                                    },
                                    max: maxProfit,
                                    min: minProfit
                                },
                                afterBuildTicks: (chart) => {
                                    chart.ticks.pop()
                                    chart.ticks.splice(0, 1)
                                },
                                gridLines: {
                                    display: false
                                }
                            }],
                            xAxes: [{
                                barPercentage: 0.8
                            }]
                        },
                        legend: {
                            onClick () {}
                        },
                        tooltips: {
                            callbacks: {
                                label: (tooltipItem, data) => {
                                    let _data = data.datasets[tooltipItem.datasetIndex]
                                    let value = tooltipItem.yLabel
                                    // Only line chart has negative value.
                                    return this.finance.includes(category) ? `${_data.label}：${value < 0 ? '-' : ''}¥${Math.abs(value).toLocaleString()}` : `${_data.label} : ${value.toLocaleString()}`
                                }
                            }
                        }
                    })
                } else {
                    this.$set(this.dataCollection, category, {
                        labels: data[category].label,
                        datasets: [{
                            label: this.$t(`common.overview.label.${category}`),
                            pointBorderColor: `hsl(${this.color[category][0]}, 88%, 55%)`,
                            pointBackgroundColor: '#ffffff',
                            backgroundColor: this.hslTransform(this.color[category]),
                            borderColor: `hsl(${this.color[category][0]}, 88%, ${this.lineChart.includes(category) ? 60 : 80}%)`,
                            borderWidth: 2,
                            data: data[category].data
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
                                            return this.finance.includes(category) ? (`${value < 0 ? '-' : ''}¥${Math.abs(value).toLocaleString()}`) : value.toLocaleString()
                                        }
                                    }
                                },
                                gridLines: {
                                    display: true
                                }
                            }],
                            xAxes: [{
                                barPercentage: 0.8
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
                                    return this.finance.includes(category) ? `${_data.label}：${value < 0 ? '-' : ''}¥${Math.abs(value).toLocaleString()}` : `${_data.label} : ${value.toLocaleString()}`
                                }
                            }
                        }
                    })
                }
            })
        },
        routerLinkTo (item) {
            if (item === 'amount' || item === 'profit') {
                return 'report/finance_report'
            } else if (item === 'register_count') {
                return 'report/member_report'
            } else if (item === 'game') {
                return 'report/game'
            }
        },
        hslTransform (hsl) {
            return `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`
        }
    },
    components: {
        LineChart,
        BarChart
    }
}
</script>
