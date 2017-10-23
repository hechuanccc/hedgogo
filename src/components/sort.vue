<template>
    <div class="box">
        <table class="table table-striped b-t">
            <thead>
            <tr>
                <th v-for="(columns, key) in columns"  @click="sortBy(key)"  :class="{active: sortKey == key}">
                  {{ columns | capitalize }}
                  <span class="arrow" :class="sortOrders[key] > 0 ? 'asc' : 'dsc'"></span>
                </th>
            </tr>
            </thead>
            <tbody v-if="!searchAgentValid && agent_level < 4">
            <tr v-for="d in filteredData">
                <td>{{d.name}}</td>
                <td>{{d.member_count}}</td>
                <td>{{d.betrecord_count}}</td>
                <td>{{d.bet_amount | currency('￥')}}</td>
                <td>{{d.valid_bet_amount | currency('￥')}}</td>
                <td>{{d.profit | currency('￥')}} </td>
                <td>{{d.deposit_amount | currency('￥')}} </td>
                <td v-if="$root.userType !== 'agent'"><a @click="resetAgent(d.name)">详细</a></td>
            </tr>
            </tbody>
            <tbody v-else>
            <tr v-for="d in filteredData">
                <td>{{d.name}}</td>
                <td v-if="$root.userType !== 'agent'"><router-link :to="member_link + d.name">{{d.betrecord_count}}</router-link></td>
                <td v-else>{{d.betrecord_count}}</td>
                <td v-if="$root.userType !== 'agent'"><router-link :to="member_link + d.name">{{d.bet_amount | currency('￥')}}</router-link></td>
                <td v-else>{{d.bet_amount | currency('￥')}}</td>
                <td v-if="$root.userType !== 'agent'"><router-link :to="member_link + d.name">{{d.valid_bet_amount | currency('￥')}}</router-link></td>
                <td v-else>{{d.valid_bet_amount | currency('￥')}}</td>
                <td>{{d.profit | currency('￥')}} </td>
                <td>{{d.deposit_amount | currency('￥')}} </td>
                <td v-if="$root.userType !== 'agent'"><a @click="resetAgent(d.name)">详细</a></td>
            </tr>
            </tbody>
            <tbody v-if="searchAgentValid">
                <tr><td colspan="5">查无代理，请更换条件再查询</td></tr>
            </tbody>
        </table>
    </div>
</template>


<script>
export default {
    props: {
        data: Array,
        columns: Object,
        searchAgentValid: Boolean,
        member_link: String,
        agent_level: Number
    },
    data () {
        return {
            sortKey: '',
            sortOrders: ''
        }
    },
    watch: {
        columns: function (old, newObj) {
            var sortOrders = {}
            for (let item in this.columns) {
                sortOrders[item] = 1
            }
            this.sortOrders = sortOrders
        }
    },
    computed: {
        filteredData: function () {
            var sortKey = this.sortKey
            var filterKey = this.filterKey && this.filterKey.toLowerCase()
            var order = this.sortOrders[sortKey] || 1
            var data = this.data
            if (filterKey) {
                data = data.filter(function (row) {
                    return Object.keys(row).some(function (key) {
                        return String(row[key]).toLowerCase().indexOf(filterKey) > -1
                    })
                })
            }
            if (sortKey) {
                data = data.slice().sort(function (a, b) {
                    a = a[sortKey]
                    b = b[sortKey]
                    return (a === b ? 0 : a > b ? 1 : -1) * order
                })
            }
            return data
        }
    },
    filters: {
        capitalize: function (str) {
            return str.charAt(0).toUpperCase() + str.slice(1)
        }
    },
    methods: {
        sortBy (key) {
            this.sortKey = key
            this.sortOrders[key] = this.sortOrders[key] * -1
        },
        resetAgent (name) {
            this.$parent.resetAgent(name)
        }
    }
}
</script>
<style scoped>
    th.active .arrow {
      opacity: 1;
    }

    .arrow {
      display: inline-block;
      vertical-align: middle;
      width: 0;
      height: 0;
      margin-left: 5px;
      opacity: 0.66;
    }

    .arrow.asc {
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-bottom: 4px solid #000;
      position: absolute;
      top: 17px;
    }

    .arrow.dsc {
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-top: 4px solid #000;
      position: absolute;
      top: 17px;
    }
    .table th.active {
      background-color: #fff !important;
      color: #2196f3;
    }
    .table th.active .arrow.asc {
      border-bottom: 4px solid #2196f3;
    }
    .table th.active .arrow.dsc {
      border-top: 4px solid #2196f3;
    }

</style>
