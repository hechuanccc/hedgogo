<template>
    <div>
        <div class="loading text-center" v-if="loading"><i class="fa fa-spin fa-spinner"></i>   <b class="">正在加载中...</b>   </div>
        <div v-else>
            <div class="pull-left m-l" v-if="!busy && count !== 0">
                <span class="">共 {{count}} 条，每页&nbsp;</span>
                <select
                    class="form-control c-select"
                    v-model="pageSize"
                    style="height:38px; width:80px; border-radius: 0.25rem;"
                >
                    <option value=20>20</option>
                    <option value=50>50</option>
                    <option value=100>100</option>
                    <option value=200>200</option>
                </select>
                <span>&nbsp;条，前往&nbsp;</span>
                <input
                    type="number"
                    step="1"
                    class="form-control w-xs inline"
                    style="height:38px; width:80px; border-radius: 0.25rem;"
                    v-model.number="pageInput"
                    @change="pageGo()"
                />
                <span>&nbsp;页</span>
            </div>
            <div v-if="!myQueryset.length && !loading" class="text-muted pull-center">查无记录</div>
            <div class="pull-right m-r">
                <div v-if="myQueryset.length" >
                    <button
                        class="btn btn-icon m-r-xs"
                        @click="pageGo(1)"
                        v-if="pageNum.length && !pageNum.includes(1)"
                    >
                        <i class="fa fa-angle-double-left" v-if="!busy"></i>
                        <i class="fa fa-spin fa-spinner" v-else></i>
                    </button>
                    <button
                        class="btn btn-icon m-r-xs"
                        @click="prevPage"
                        v-if="showPageGo > 1"
                    >
                        <i class="fa fa-angle-left" v-if="!busy"></i>
                        <i class="fa fa-spin fa-spinner" v-else></i>
                    </button>
                    <div style="display: inline" v-if="pageNum.length">
                        <button
                            class="btn m-r-xs"
                            @click="pageGo(num)"
                            v-for="num in pageNum"
                            :key="num"
                            :class="{'blue': num === showPageGo}"
                        >
                            <span>{{ num }}</span>
                        </button>
                        <span v-if="showPageGo + 4 <= countPage && countPage > 6">&hellip;&nbsp;</span>
                        <button
                            class="btn m-r-xs"
                            :class="{'blue': countPage === showPageGo}"
                            @click="pageGo(countPage)"
                            v-if="showPageGo + 3 <= countPage && countPage >= 6"
                        >
                            <span>{{ countPage }}</span>
                        </button>
                    </div>
                    <button
                        class="btn btn-icon"
                        @click="nextPage"
                        v-if="showPageGo !== countPage"
                        :disabled="busy"
                    >
                        <i class="fa fa-angle-right" v-if="!busy"></i>
                        <i class="fa fa-spin fa-spinner" v-else></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import _ from 'lodash'
// to perform a pulling, parent componet need to boardcast 'rebase' event
// once the comopnent is ready, and might trigger 'rebase' everytime needed
export default {
    props: {
        queryset: {
            required: true,
            type: [Array, Object]
        },
        query: {
            required: true,
            type: Object
        },
        extra: {
            default: '',
            type: String
        },
        api: {
            required: true,
            type: String
        },
        optexpand: {
            default: 1
        },
        amount: {
            default: ''
        },
        profit: {
            default: ''
        },
        total_bet_amount: {
            default: ''
        },
        export_query: {
            default: false
        }
    },
    data () {
        return {
            count: 0,
            limit: 20,
            next: '',
            busy: false,
            loading: true,
            pageSize: 20,
            pageInput: 1,
            showPageGo: 1,
            offset: 0,
            countPage: 0,
            pageNum: [],
            myQueryset: this.queryset,
            myQuery: ''
        }
    },
    watch: {
        limit (newObj, old) {
            this.loading = true
            this.getPage()
            this.rebase()
        },
        pageSize (newObj, old) {
            this.limit = newObj
            this.showPageGo = 1
            this.pageInput = 1
            this.offset = 0
        },
        pageInput (newObj) {
            if (this.showPageGo !== newObj) {
                this.debounceGo()
            }
        }
    },
    methods: {
        debounceGo: _.debounce(function () {
            this.loading = true
            if (this.pageInput > this.countPage) {
                this.pageInput = this.countPage
            } else if (this.pageInput < 1) {
                this.pageInput = 1
            }
            if (this.pageInput && this.showPageGo !== this.pageInput) {
                this.pageGo(this.pageInput)
            } else {
                this.loading = false
            }
        },
        700),
        pageGo (showPageGo = this.showPageGo) {
            if (showPageGo !== this.showPageGo) {
                this.showPageGo = showPageGo
                this.pageInput = showPageGo
                let offset = parseInt(this.limit) * (parseInt(showPageGo) - 1)
                this.offset = offset
                this.rebase()
            }
        },
        nextPage () {
            this.showPageGo = parseInt(this.showPageGo) + 1
            this.offset = this.limit * (this.showPageGo - 1)
            this.loading = true
            this.rebase()
        },
        prevPage () {
            this.showPageGo = parseInt(this.showPageGo) - 1
            this.offset = this.limit * (this.showPageGo - 1)
            this.loading = true
            this.rebase()
        },
        getPage () {
            this.countPage = Math.ceil(this.count / this.limit)
            this.pageNum.splice(0, this.pageNum.length)
            let pageNum = []
            if (this.countPage === 1) {
                this.showPageGo = 1
            } else if (this.countPage > 1) {
                this.pageInput = this.showPageGo
                pageNum.push(this.showPageGo)
                for (let i = this.showPageGo - 1; i >= 1 && pageNum.length <= 2; --i) {
                    pageNum = [i, ...pageNum]
                }
                for (let i = this.showPageGo + 1; i <= this.countPage && pageNum.length <= 4; ++i) {
                    pageNum = [...pageNum, i]
                }
                for (let i = this.showPageGo - 3; i >= 1 && pageNum.length <= 4; --i) {
                    pageNum = [i, ...pageNum]
                }
            }
            this.pageNum.push(...pageNum)
        },
        rebase () {
            this.next = this.buildUrl(this.api, this.extra + '&opt_expand=' + this.optexpand + '&offset=' + this.offset + '&limit=' + this.limit)
            // this.queryset = []
            this.myQueryset = []
            this.pull()
        },
        // pull queryset form back-end
        pull () {
            this.busy = true
            this.loading = true
            this.$http.get(this.next).then(data => {
                if (data.results && data.results.length === 0 && data.count && this.showPageGo > 1) {
                    this.prevPage()
                    return
                }
                this.$emit('amount', data.total_amount || 0)
                this.$emit('profit', data.total_profit || 0)
                this.$emit('bet-count', data.total_betrecord_count || 0)
                this.$emit('deposit', data.total_deposit_amount || 0)
                this.$emit('withdraw', data.total_withdraw_amount || 0)
                this.count = data.count
                this.getPage()
                this.busy = false
                this.myQueryset = []
                this.myQueryset = this.myQueryset.concat(data.results)
                this.$emit('query-data', this.myQueryset)
                this.next = data.next
                this.loading = false
            }, () => {
                this.$router.push('/login?next=' + this.$route.fullPath)
            })
            this.$emit('query-param', this.myQuery)
        },
        // build router query string through this.query
        buildUrl (api, defaultQuery) {
            let url = api + (defaultQuery ? ('?' + defaultQuery) : '')
            let params = []
            let query = this.$route.query
            for (let x in query) {
                if (query[x] === '' || query[x] === undefined) {
                    delete query[x]
                }
            }
            // sync query data with local data
            this.myQuery = query
            // this.query = query
            for (let x in query) {
                if (query[x]) {
                    params.push(x + '=' + query[x])
                }
            }
            return url + (defaultQuery ? '&' : '?') + params.join('&')
        },
        getExportQuery () {
            let query = this.query
            for (let x in query) {
                if (query[x] === '' || query[x] === undefined || x === 'report_flag' || !query[x].length) {
                    delete query[x]
                }
            }
            let params = []
            let exportQuery = this.export_query
            for (let x in query) {
                if (query[x]) {
                    params.push(x + '=' + query[x])
                }
            }
            exportQuery = params.join('&')
            this.$emit('export-query', exportQuery)
        },
        // change the route, and then parent component will know and trigger route.data
        // and broadcast 'rebase' event
        submit () {
            let query = this.query
            this.offset = 0
            this.showPageGo = 1
            let basePath = this.$route.path
            let format = 'YYYY-MM-DD'
            for (let x in query) {
                if (query[x] === '' || query[x] === undefined) {
                    delete query[x]
                } else if (Vue.moment.isDate(query[x])) {
                    query[x] = Vue.moment(query[x]).format(format)
                }
                if (query[x] instanceof Array) {
                    query[x].forEach(function (value, index, array) {
                        if (value) {
                            query[x] = `${array}`
                        }
                    })
                }
            }
            this.$router.push({path: basePath, query})
        }
    },
    computed: {
        isPageOne () {
            return this.showPageGo === 1
        }
    }
}
</script>
