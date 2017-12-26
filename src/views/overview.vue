<template>
    <div class="row">
        <div class="col-md-6 col-xs-12" v-for="item in dataCategory" :key="item">
            <div class="box p-a-sm">
                <div class="box-header p-b-0"><h6>{{ $t(`common.overview.title.${item}`) }}</h6></div>
                <div class="box-body" v-if="dataCollection[item] && lineChart.includes(item)">
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
            </div>
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
                profit: 172,
                betrecord_count: 45,
                register_count: 262
            },
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
                        data: data.map(e => e[title])
                    }]
                })
                this.$set(this.options, title, {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        yAxes: [{
                            ticks: {
                                callback: (value, index, values) => {
                                    return this.lineChart.includes(title) ? '¥' + value : value
                                }
                            },
                            gridLines: {
                                display: true
                            }
                        }],
                        xAxes: [{
                            barPercentage: 1.0
                        }]
                    }
                })
            })
        }
    },
    components: {
        LineChart,
        BarChart
    }
}
</script>
