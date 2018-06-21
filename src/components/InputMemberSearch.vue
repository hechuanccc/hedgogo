<template>
    <div class="form-group l-h m-a-0">
        <div class="input-group input-group-sm">
            <span class="input-group-addon btn b-a">
                <i class="fa fa-plus" v-if="exportMember"></i>
                <i class="fa fa-search" v-else></i>
            </span>
            <input 
                type="text"
                class="form-control p-x b-a rounded"
                v-model.trim="username_q"
                :placeholder="$t('user.search_member')"
                @focus="focusSearchMemberInput()"
                @blur="blurSearchMemberInput()"
                @change="search"
            >
            <div class="search-results" v-if="isShowResults">
                <div class="search-items">
                    <div class="search-item" v-show="searchLoading" disabled><span class="m-l"><i class="fa fa-spin fa-spinner"></i> {{$t('system.loading')}}</span></div>
                    <div class="search-item" v-show="searchNoRecord" disabled><span class="m-l">{{$t('system.no_record')}}</span></div>
                    <div class="search-item" v-for="r in results" :key="r.id" @click="routerLinkTo(r.id)">
                        <span>{{r.username}}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { searchMember } from '../service'
import _ from 'lodash'

export default {
    props: {
        exportMember: false
    },
    data () {
        return {
            username_q: '',
            results: [],
            searchlimit: 5,
            searchLoading: false,
            isShowResults: false
        }
    },
    watch: {
        'username_q' (newObj, old) {
            this.searchLoading = newObj.length > 0
            this.results = []
            if (this.username_q) {
                this.search()
            }
        }
    },
    computed: {
        searchNoRecord () {
            return this.results.length === 0 && !this.searchLoading
        }
    },
    methods: {
        search:
            _.debounce(function () {
                if (this.username_q) {
                    this.results = []
                    searchMember({ username_q: this.username_q }).then(data => {
                        this.searchLoading = false
                        if (data || data.length > 0) {
                            this.results = data.slice(0, Number(this.searchlimit))
                        }
                    })
                }
            },
        500),
        focusSearchMemberInput () {
            this.isShowResults = true
        },
        blurSearchMemberInput () {
            setTimeout(() => {
                this.isShowResults = false
            }, 300)
        },
        routerLinkTo (id) {
            this.blurSearchMemberInput()
            this.$router.push('/member/' + id)
        }
    }
}
</script>


<style lang="scss" scoped>
.search-results {
  font-size: 0.875rem;
  color: rgba(0, 0, 0, 0.87);
  border-radius: 3px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  float: left;
  padding: 5px 0;
  margin: 2px 0 0;
  font-size: 1rem;
  color: #373a3c;
  text-align: left;
  list-style: none;
  background-color: #fff;
  width: 100%;
  display: flex;
  flex-direction: column;
}
.search-item {
  padding: 5px 0;
}
.search-item span {
  padding: 0px 15px;
}
div.search-item:not([disabled]):hover,
div.search-item:not([disabled]):focus,
div.search-item:not([disabled]).active {
    box-shadow: inset 0 -10rem 0px rgba(158, 158, 158, 0.2);
    cursor: pointer;
}
</style>
