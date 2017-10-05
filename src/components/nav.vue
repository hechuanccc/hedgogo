<template>
    <div id="aside" class="app-aside modal fade folded md show-text nav-dropdown" v-if="showNav">
        <div class="left navside grey dk"  v-if="$root.$data.userType !== 'agent'">
            <div class="navbar no-radius">
                <a class="navbar-brand" href="/" v-if="$root.permissions.includes('list_report_betrecord')">
                  <img src="../../static/images/logo.png" />
                  <span class="hidden-folded inline">$t{{'app_name'}}</span>
                </a>
                <a class="navbar-brand" v-else>
                    <img src="../../static/images/logo.png" />
                    <span class="hidden-folded inline">$t{{'app_name'}}</span>
                </a>
            </div>

            <div>
                <nav class="nav-stacked nav-active-blue" >
                    <ul class="nav" ui-nav="">
                        <template v-if="$root.permissions.includes('list_report_betrecord')">
                            <li><div class="b-b b m-t-sm m-b-sm"></div></li>

                            <li :class="$route.meta.group == 'overview' ? 'active' : ''" >
                                <router-link to="/" >
                                  <span class="nav-icon"><i class="material-icons">&#xe3fc;</i></span>
                                  <span class="nav-text">{{$t("nav.overview")}}</span>
                                </router-link>
                            </li>
                            <li><div class="b-b b m-t-sm"></div></li>
                        </template>
                    </ul>
                </nav>
            </div>
        </div>
        <div class="left navside grey dk" v-else>
            <div class="navbar no-radius">

                <router-link class="navbar-brand" to="/">
                  <img src="../../static/images/logo.png" />
                  <span class="hidden-folded inline">$t{{'app_name'}}</span>
                </router-link>
            </div>

            <div flex>
              <nav class="nav-stacked nav-active-blue" flex>
                <ul class="nav" ui-nav="">
                    <li><div class="b-b b m-t-sm m-b-sm"></div></li>
                    <li :class="$route.meta.group == 'overview' ? 'active' : ''">
                        <router-link to="'/'" >
                          <span class="nav-icon"><i class="material-icons">&#xe3fc;</i></span>
                          <span class="nav-text">{{$t("nav.overview")}}</span>
                        </router-link>
                    </li>

                    <li :class="$route.meta.group == 'member' ? 'active' : ''">
                        <a>
                            <span class="nav-caret"><i class="fa fa-caret-down"></i></span>
                            <span class="nav-icon"><i class="material-icons">&#xE7FC;</i></span>
                            <span class="nav-text">{{$t("nav.member")}}</span>
                        </a>
                        <ul class="nav-sub">
                            <li>
                                <router-link to="/member">
                                    <span class="nav-text">{{$t("nav.member_list")}}</span>
                                </router-link>
                            </li>
                        </ul>
                    </li>

                    <li :class="$route.meta.group == 'bill' ? 'active' : ''">
                        <a>
                            <span class="nav-caret" ><i class="fa fa-caret-down"></i></span>
                            <span class="nav-icon" ><i class="material-icons">&#xE227;</i></span>
                            <span class="nav-text">{{$t("nav.bills")}}</span>
                        </a>
                        <ul class="nav-sub">
                            <li><router-link to="/bill/commission"><span class="nav-text">{{$t('bill.commission_report')}}</span></router-link></li>
                        </ul>
                    </li>

                    <li :class="$route.meta.group == 'report' ? 'active' : ''">
                        <a>
                            <span class="nav-caret">
                              <i class="fa fa-caret-down"></i>
                            </span>
                            <span class="nav-icon">
                              <i class="material-icons">&#xe1b8;</i>
                            </span>
                            <span class="nav-text">{{$t("nav.report")}}</span>
                        </a>
                        <ul class="nav-sub">
                            <li><router-link to="/report/game"><span class="nav-text">{{$t('nav.game_report')}}</span></router-link></li>
                            <li><router-link to="/report/transferrecord"><span class="nav-text">{{$t('nav.transfer_record')}}</span></router-link></li>
                        </ul>
                    </li>
                </ul>
                </nav>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            showNav: {
                default: true
            }
        }
    }
</script>
