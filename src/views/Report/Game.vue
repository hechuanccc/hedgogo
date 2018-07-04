<template>
<div>
  <form 
      class="form m-b-sm"
      @submit.prevent="submit"
    >
      <div class="box m-t-sm m-b-sm">
        <div class="box-body clearfix form-input-sm">
          <div class="row m-l-xs m-r-xs">
            <div class="pull-left m-r-xs">
              <label
                class="form-control-label p-b-0"
                :class="{'text-blue': query.start_date && query.end_date}"
              >{{ $t('dic.date') }}
              </label>
              <el-date-picker
                style="display: block;"
                v-model="date"
                size="mini"
                type="daterange"
                unlink-panels
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="{shortcuts}"
                :clearable="false"
              />
            </div>
            <div class="pull-left m-r-xs">
              <label
                class="form-control-label p-b-0"
                :class="{'text-blue': query.game_code}"
              >{{ $t('dic.game') }}
              </label>
              <select
                class="form-control w-sm c-select block"
                v-model="query.game_code"
                @change="clickGame()"
              >
                <option value="">{{ $t('system.please_select') }}</option>
                <option
                  class="form-control"
                  :value="g.code"
                  v-for="(g, i) in gameList"
                  :key="g.code + i"
                >
                  {{ g.display_name }}
                </option>
              </select>
            </div>
            <div class="pull-left m-r-xs">
              <label
                class="form-control-label p-b-0"
                :class="{'text-blue': query.category}"
              >{{ $t('game.category') }}
              </label>
              <select
                class="form-control w-md c-select block"
                v-model="query.category"
                @change="clickCategory()"
                :disabled="!activeGame"
              >
                <option value="">{{ $t('system.please_select') }}</option>
                <option
                  class="form-control"
                  :value="c.code"
                  v-for="c in categoryList"
                  :key="c.code"
                >
                  {{ c.display_name }}&nbsp;-&nbsp;{{ $t(`dic.${c.platform}`) }}
                </option>
              </select>
            </div>
            <div class="pull-left m-r-xs">
              <label class="form-control-label">
                {{ $t('system.dimension_displaying') }}
              </label>
              <div class="m-l">
                <label class="m-r-xs pointer">
                  <input
                    type="checkbox"
                    name="platform"
                    v-model="dimension.platform"
                    :disabled="!!(activeGame || activeCategory)"
                  />
                  <i class="blue"></i>
                  {{ $t('dic.platform') }}
                </label>
              </div>
            </div>
            <button
              class="md-btn w-xs pull-right btn m-t-md"
              type="button"
              @click="clearAll"
              :disabled="isQueryEmpty"
            >
              <i v-if="loading.game" class="fa fa-spin fa-spinner"></i> 
              <i v-else class="fa fa-trash-o"></i> 
              <span>{{ $t('system.reset_condition') }}</span>
            </button>
          </div>
        </div>
      </div>
    </form>
    <div class="box m-t-xs">
      <table st-table="rowCollectionBasic" class="table table-striped b-t">
        <thead>
          <tr>
            <th class="text-center" width="15%" v-if="gameList.length && !activeGame">{{ $t('dic.game') }}</th>
            <th class="text-center" v-if="activeGame && !activeCategory" width="15%">{{ $t('game.category') }}</th>
            <th class="text-center" v-if="activeGame && activeCategory" width="15%">{{ $t('game.play') }}</th>
            <th class="text-center" v-if="activeGame || activeCategory || dimension.platform" width="5%">{{ $t('dic.platform') }}</th>
            <th class="text-right pointer" :width="`${otherColWidth}%`" v-for="col in otherCol" :key="col" @click="clickSort(col)">
                {{ $t(`report.game.${col}`) }}
                <span v-if="sort.title !== col || !sort.sorting">&nbsp;<i class="fa fa-sort text-black-lt"></i></span>
                <span v-else-if="sort.title === col">
                    &nbsp;<i class="fa" :class="{
                        'fa-sort-desc': sort.sorting === 'des',
                        'fa-sort-asc': sort.sorting === 'asc'
                    }"></i>
                </span>
            </th>
          </tr>
        </thead>
        <tbody class="text-right">
          <tr v-for="index in DataLength" :key="index" v-if="!loading.game">
            <td
              class="text-center v-m pointer"
              @click="clickGame({
                game: filteredGame[index-1].code,
                platform: 'default'
              })"
              :rowspan="gameListMode === 'double' ? 2 : 1"
              v-if="index <= filteredGame.length && (index + 2) % ( gameListMode === 'double' ? 2 : index + 1) && !activeGame"
            >
              <a>{{ filteredGame[index-1].display_name }}</a>
            </td>
            <td v-else-if="index > filteredGame.length && !activeGame"></td>
            <td
              class="text-center pointer"
              @click="clickCategory(filteredCategory[index-1].code)"
              v-if="activeGame && !activeCategory && index <= filteredCategory.length"
            >
              <a>{{ filteredCategory[index-1].display_name }}</a>
            </td>
            <td v-else-if="activeGame && !activeCategory && index <= filteredPlay.length"></td>
            <td v-if="activeGame && activeCategory && index <= filteredPlay.length" class="text-center">{{ filteredPlay[index-1].display_name }}</td>
            <template v-if="index <= filteredData.length && !loading.category && !loading.play">
              <td
                v-if="!activeGame && !activeCategory && dimension.platform"
                class="pointer text-center"
                @click="clickGame({
                  game: gameList[index-1].code,
                  platform: filteredData[index-1].platform
                })"
              >
                <a>{{ $t(`dic.${filteredData[index-1].platform}`) }}</a>
              </td>
              <td v-else-if="activeGame || activeCategory || dimension.platform" class="text-center">{{ $t(`dic.${filteredData[index-1].platform}`) }}</td>
              <td>{{ filteredData[index-1].amount | currency('￥') }}</td>
              <td>{{ filteredData[index-1].member_count }}</td>
              <td>{{ filteredData[index-1].avg_amount | currency('￥') }}</td>
              <td :class="{
                'text-success': filteredData[index-1].profit > 0,
                'text-danger': filteredData[index-1].profit < 0
              }" class="text-xs">{{ filteredData[index-1].profit | currency('￥') }}</td>
            </template>
          </tr>
        </tbody>
      </table>
      <div class="row text-center p-a" v-if="loading.game">
        <i class="fa fa-spin fa-spinner"></i>
        <b>{{ $t('system.loading') }}</b>
      </div>
    </div>
</div>
</template>

<script>
import Vue from 'vue'
import date from '../../utils/date'
import { getReport } from '../../service'
import $ from '../../utils/util'

const format = 'YYYY-MM-DD'
export default {
    data () {
        return {
            otherCol: [
                'amount',
                'member_count',
                'avg_amount',
                'profit'
            ],
            query: {},
            date: [],
            dimension: {
                platform: false
            },
            platform: 'default',
            sort: {
                title: 'amount',
                sorting: 'des'
            },
            activeGame: '',
            activeCategory: '',
            gameData: {},
            gameList: [],
            gameListMode: 'normal',
            categoryData: {},
            categoryList: [],
            playData: {},
            playList: [],
            yesterday: date.yesterday[0],
            shortcuts: ['today', 'yesterday', 'this_week', 'this_month', 'last_month'].map(element => Object({
                text: this.$t(`time.${element}`),
                onClick (p) {
                    p.$emit('pick', date[element])
                }
            })),
            defaultDate: [],
            loading: {
                game: false,
                category: false,
                play: false
            }
        }
    },
    created () {
        this.defaultDate = [Vue.moment(this.yesterday).subtract(6, 'days').format(format), this.yesterday]
        this.setQueryAll()
        this.getReport({type: 'game'})
    },
    watch: {
        '$route': {
            handler () {
                this.setQueryAll()
            },
            deep: true
        },
        date (newObj, old) {
            if (`${newObj}` === `${this.defaultDate}` || !newObj) {
                this.$delete(this.query, 'start_date')
                this.$delete(this.query, 'end_date')
            } else {
                [this.query.start_date, this.query.end_date] = newObj.map(d => Vue.moment(d).format(format))
            }
            if (this.query.start_date !== this.$route.query.start_date || this.query.end_date !== this.$route.query.end_date) {
                this.getReport({type: 'game'})
                this.activeGame = ''
                this.activeCategory = ''
                this.$router.push({
                    path: '/report/game',
                    query: this.query
                })
            }
        },
        'dimension.platform' (newObj) {
            this.changeGameListMode(newObj ? 'double' : 'normal')
        },
        activeGame (newObj) {
            if (this.dimension.platform) {
                this.changeGameListMode(newObj ? 'normal' : 'double')
            }
            if (!newObj) {
                this.platform = 'default'
                this.categoryData = this.playData = {}
                this.categoryList = this.playList = []
            }
        },
        activeCategory (newObj) {
            if (!newObj) {
                this.playData = {}
                this.playList = []
            }
        }
    },
    computed: {
        filteredData () {
            let ret = []
            if (this.activeGame && this.activeCategory) {
                ret = Object.entries(this.playData).map(([k, v]) => Object(v))
            } else if (this.activeGame) {
                ret = Object.entries(this.categoryData).map(([k, v]) => Object(v))
            } else {
                let gameDataArray = Object.keys(this.gameData).map(k => this.gameData[k])
                this.sort.title && gameDataArray.sort((a, b) => (a.default[this.sort.title] - b.default[this.sort.title]) * (this.sort.sorting === 'asc' ? 1 : -1))
                if (this.dimension.platform) {
                    gameDataArray.forEach(v => {
                        Object.assign(v['pc'], {
                            platform: 'pc'
                        })
                        Object.assign(v['mobile'], {
                            platform: 'mobile'
                        })
                        ret = [...ret, v['pc'], v['mobile']]
                    })
                    return ret
                } else {
                    return gameDataArray.map(v => Object(v[this.platform]))
                }
            }
            this.sort.title && ret.sort((a, b) => (a[this.sort.title] - b[this.sort.title]) * (this.sort.sorting === 'asc' ? 1 : -1))
            return this.platform !== 'default' ? ret.filter(d => d.platform === this.platform) : ret
        },
        filteredGame () {
            if (this.sort.title) {
                this.gameList.sort((a, b) => {
                    return (this.gameData[a.code].default[this.sort.title] - this.gameData[b.code].default[this.sort.title]) * ((this.sort.sorting === 'asc') ? 1 : -1)
                })
            } else {
                this.gameList.sort((a, b) => a.rank - b.rank)
            }

            return this.gameList
        },
        filteredCategory () {
            this.activeGame && this.categoryList.sort((a, b) => {
                if (this.sort.title) {
                    return (this.categoryData[a.code][this.sort.title] - this.categoryData[b.code][this.sort.title]) * (this.sort.sorting === 'asc' ? 1 : -1)
                } else {
                    return a.rank - b.rank
                }
            })
            return this.platform !== 'default' ? this.categoryList.filter(c => c.platform === this.platform) : this.categoryList
        },
        filteredPlay () {
            this.activeCategory && this.playList.sort((a, b) => {
                if (this.sort.title) {
                    return (this.playData[a.code][this.sort.title] - this.playData[b.code][this.sort.title]) * (this.sort.sorting === 'asc' ? 1 : -1)
                } else {
                    return a.rank - b.rank
                }
            })
            return this.platform !== 'default' ? this.playList.filter(p => p.platform === this.platform) : this.playList
        },
        DataLength () {
            return Math.max(this.gameList.length, this.filteredCategory.length, this.filteredPlay.length)
        },
        otherColWidth () {
            return (85 - (this.activeGame || this.activeCategory || this.dimension.platform ? 5 : 0)) / 4
        },
        isQueryEmpty () {
            return $.compareQuery(this.query, {})
        }
    },
    methods: {
        getReport ({
            type,
            game,
            category
        }) {
            this.loading[type] = true
            this[`${type}Data`] = {}
            this[`${type}List`] = []
            type === 'game' && (this.categoryData = this.playData = {}, this.categoryList = this.playList = [])
            type === 'category' && (this.playData = {}, this.playList = [])
            getReport('game', {
                params: {
                    ...((type === 'category' || type === 'play') && { game_code: game }),
                    ...(type === 'play' && { category }),
                    ...(this.query.start_date && { start_date: this.query.start_date }),
                    ...(this.query.end_date && { end_date: this.query.end_date })
                }
            }).then(data => {
                this[`${type}Data`] = Object.assign({}, data)
                this[`${type}List`] = Object.entries(data).map(([k, v], i) => Object({
                    rank: i,
                    code: k,
                    display_name: v.display_name,
                    platform: v.platform
                }))
                this.loading[type] = false
            }, error => {
                $.notify({
                    message: error,
                    type: 'danger'
                })
                this.loading[type] = false
            })
        },
        clickSort (title) {
            const sortingMap = {
                'des': 1,
                'asc': 2
            }
            if (title !== this.sort.title) {
                Object.assign(this.sort, {
                    title,
                    sorting: 'des'
                })
            } else {
                let sorting = sortingMap[this.sort.sorting]
                // In origin sorting = ( 1 or 2 ) become ( 2 or 0 )
                sorting = (sorting + 1) % 3
                if (sorting === 0) {
                    this.sort.title = ''
                    this.sort.sorting = ''
                } else if (sorting === 2) {
                    this.sort.sorting = 'asc'
                }
            }
        },
        clickGame ({ game, platform } = { game: this.query.game_code }) {
            platform && (this.platform = platform)
            game && (this.query.game_code = game)
            this.$router.push({
                path: '/report/game/',
                query: {
                    ...(this.query.game_code && { game_code: this.query.game_code }),
                    ...(this.query.start_date && { start_date: this.query.start_date }),
                    ...(this.query.end_date && { end_date: this.query.end_date })
                }
            })
        },
        clickCategory (category = this.query.category || '') {
            if (category === this.activeCategory) {
                category = ''
                this.playData = {}
                this.playList = []
            }
            this.$router.push({
                path: '/report/game/',
                query: {
                    ...(this.activeGame && { game_code: this.activeGame }),
                    ...(category && { category }),
                    ...(this.query.start_date && { start_date: this.query.start_date }),
                    ...(this.query.end_date && { end_date: this.query.end_date })
                }
            })
        },
        setQueryAll () {
            let query = this.$route.query

            if (this.activeGame !== query.game_code && query.game_code) {
                this.getReport({
                    type: 'category',
                    game: query.game_code
                })
            }
            this.activeGame = query.game_code = query.game_code || ''

            if (this.activeCategory !== query.category && this.activeGame && query.category) {
                this.getReport({
                    type: 'play',
                    ...(this.activeGame && { game: this.activeGame }),
                    category: query.category
                })
            }
            this.activeCategory = query.category = query.category || ''

            if (query.start_date || query.end_date) {
                this.date = [query.start_date, query.end_date]
            } else {
                this.date = this.defaultDate
            }

            this.query = Object.assign({}, query)
        },
        changeGameListMode (mode = 'normal') {
            if (this.gameListMode !== mode) {
                this.gameListMode = mode
                let newList = []
                if (mode === 'normal') {
                    for (let index = 0; index < this.gameList.length; index += 2) {
                        newList = [...newList, this.gameList[index]]
                    }
                } else if (mode === 'double') {
                    for (let g in this.gameList) {
                        newList = [...newList, this.gameList[g], this.gameList[g]]
                    }
                }
                this.gameList = newList
            }
        },
        clearAll () {
            this.query = {}
            this.$router.push('/report/game/')
        }
    }
}
</script>
