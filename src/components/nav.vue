<template>
    <div id="aside" class="app-aside modal fade folded md show-text nav-dropdown" v-if="showNav">
        <div class="left navside grey dk w-sm">
            <div class="navbar no-radius">
                <a class="navbar-brand" href="/">
                  <img src="../../static/images/logo.png" />
                  <span class="hidden-folded inline">$t{{'app_name'}}</span>
                </a>
            </div>

            <div>
                <nav class="nav-active-blue" >
                    <ul class="nav m-l-sm" ui-nav="">
                        <template v-if="$root.permissions.includes('list_report_betrecord')">
                            <li><div class="b-b b m-t-sm m-b-sm"></div></li>
                            <li :class="$route.meta.group == 'overview' ? 'active' : ''" >
                                <router-link to="/" >
                                  <span class="nav-icon"><i class="material-icons m-r-xs">&#xe3fc;</i>总览</span>
                                </router-link>
                            </li>
                            <li><div class="b-b b m-t-sm"></div></li>
                        </template>
                        <li :class="$route.meta.group == 'financing' ? 'active' : ''">
                            <a>
                                <span class="nav-icon" ><i class="material-icons m-r-xs">&#xE227;</i>财务管理</span>
                            </a>
                            <ul class="nav-sub">
                                <li v-if="$root.permissions.includes('list_remit_online_withdraw_page')"><router-link to="/bill/remit?report_flag=True"><span class="nav-text">{{$t('nav.remit')}}</span></router-link></li>
                                <li v-if="$root.permissions.includes('list_remit_online_withdraw_page')"><router-link to="/bill/online?report_flag=True"><span class="nav-text">{{$t('nav.online_pay_orders')}}</span></router-link></li>
                                <li v-if="$root.permissions.includes('list_remit_online_withdraw_page')"><router-link to="/bill/withdraw?report_flag=True"><span class="nav-text">{{$t('nav.withdraw_request')}}</span></router-link></li>
                                <li><router-link to="/bill/search?report_flag=True"><span class="nav-text">{{$t('nav.transaction')}}</span></router-link></li>
                                <li><router-link to="/bill/returnrate"><span class="nav-text">{{$t('nav.returnrate')}}</span></router-link></li>
                            </ul>
                        </li>
                        <li :class="$route.meta.group == 'reporting' ? 'active' : ''">
                            <a>
                              <span class="nav-icon"><i class="material-icons m-r-xs">&#xe24b;</i>报表管理</span>
                            </a>
                            <ul class="nav-sub">
                                <li><router-link to="/report/agent_report"><span class="nav-text">{{$t('nav.agent_report')}}</span></router-link></li>
                                <li><router-link to="/report/member_report"><span class="nav-text">{{$t('nav.member_report')}}</span></router-link></li>
                                <li><router-link to="/report/online_member"><span class="nav-text">{{$t('nav.online_member_report')}}</span></router-link></li>
                            </ul>
                        </li>

                        <li :class="$route.meta.group == 'betrecord' ? 'active' : ''">
                            <a>
                              <span class="nav-icon"> <i class="material-icons m-r-xs">&#xe1b8;</i>投注记录</span>
                            </a>
                            <ul class="nav-sub">
                                <li><router-link to="/report/betrecord/today"><span class="nav-text">{{$t('nav.recent_bet_records')}}</span></router-link></li>
                                <li><router-link to="/report/betrecord/history"><span class="nav-text">{{$t('nav.bet_record_history')}}</span></router-link></li>
                                <li><router-link to="/report/betrecord/realtime"><span class="nav-text">{{$t('nav.instant_view')}}</span></router-link></li>
                            </ul>
                        </li>

                        <li><div class="b-b m-t-sm m-b-sm"></div></li>
                        <li :class="$route.meta.group == 'users' ? 'active' : ''">
                            <a>
                              <span class="nav-icon"><i class="material-icons m-r-xs">&#xE7FC;</i>用户管理</span>
                            </a>
                            <ul class="nav-sub">
                                <li>
                                    <router-link to="/agent?level=3">
                                        <span class="nav-text">{{$t("nav.general_agent_list")}}</span>
                                    </router-link>
                                </li>
                                <li>
                                    <router-link  to="/agent">
                                        <span class="nav-text">{{$t("nav.agent_list")}}</span>
                                    </router-link>
                                </li>
                                <li v-if="$root.permissions.includes('update_member_details')">
                                    <router-link  to="/member?report_flag=True">
                                        <span class="nav-text">{{$t("nav.member_list")}}</span>
                                    </router-link>
                                </li>
                                <li v-if="$root.permissions.includes('update_member_details')">
                                    <router-link  to="/member?logined=1">
                                        <span class="nav-text">{{$t("nav.online_member_list")}}</span>
                                    </router-link>
                                </li>
                                <li>
                                    <router-link to="/staff">
                                        <span class="nav-text">{{$t("nav.staff")}}</span>
                                    </router-link>
                                </li>
                            </ul>
                        </li>

                        <li><div class="b-b m-t-sm m-b-sm"></div></li>
                        <li :class="$route.meta.group == 'game_manage' ? 'active' : ''">
                            <a>
                                <span class="nav-icon"><i class="material-icons m-r-xs">&#xE021;</i>游戏管理</span>
                            </a>
                            <ul class="nav-sub">
                                <li><router-link to="/game_list"><span class="nav-text">{{$t("nav.game_list")}}</span></router-link></li>
                            </ul>
                        </li>
                        
                        <li :class="$route.meta.group == 'game_history' ? 'active' : ''">
                            <router-link to="/game_history">
                                <span class="nav-icon"><i class="material-icons m-r-xs">&#xE889;</i>历史开奖</span>
                            </router-link>
                        </li>

                        <li><div class="b-b b m-t-sm m-b-sm"></div></li>
                        <li :class="$route.meta.group == 'setting' ? 'active' : ''">
                            <a>
                              <span class="nav-icon"><i class="material-icons m-r-xs">&#xE8B8;</i>系统配置</span>
                            </a>
                            <ul class="nav-sub">
                                <li><router-link to="/permissions"><span class="nav-text">{{$t("nav.permissions")}}</span></router-link></li>
                                <li><router-link to="/roles"><span class="nav-text">{{$t("nav.roles")}}</span></router-link></li>
                                <li><router-link to="/global_parameters"><span class="nav-text">{{$t("nav.global_parameters")}}</span></router-link></li>
                                <li><router-link to="/level"><span class="nav-text">{{$t("nav.setting_level")}}</span></router-link></li>
                                <li><router-link to="/online_payee"><span class="nav-text">{{$t("nav.setting_online_payee")}}</span></router-link></li>
                                <li><router-link to="/paymenttype"><span class="nav-text">{{$t("nav.payment_type_setting")}}</span></router-link></li>
                                <li><router-link to="/remit_payee"><span class="nav-text">{{$t("nav.setting_remit_payee")}}</span></router-link></li>
                                <li><router-link to="/return"><span class="nav-text">{{$t("nav.setting_return")}}</span></router-link></li>
                                <li><router-link to="/commission"><span class="nav-text">{{$t("nav.setting_commission")}}</span></router-link></li>
                                <li><router-link to="/envelope_settings"><span class="nav-text">{{$t("nav.envelope_setting")}}</span></router-link></li>
                            </ul>
                        </li>

                        <li :class="$route.meta.group == 'logging' ? 'active' : ''">
                            <a>
                                <span class="nav-icon"><i class="material-icons m-r-xs">&#xe873;</i>日志管理</span>
                            </a>
                            <ul class="nav-sub">
                                <li><router-link to="/login_record"><span class="nav-text">{{$t("nav.login_logs")}}</span></router-link></li>
                                <li><router-link to="/actionrecord"><span class="nav-text">{{$t("nav.action_logs")}}</span></router-link></li>
                                <li><router-link to="/errors"><span class="nav-text">{{$t("nav.errors")}}</span></router-link></li>
                            </ul>
                        </li>
                        <li :class="$route.meta.group == 'agent' ? 'active' : ''">
                            <a>
                                <span class="nav-icon"><i class="material-icons m-r-xs">&#xE7FB;</i>代理结算</span>
                            </a>
                            <ul class="nav-sub">
                                <li v-if="$root.permissions.includes('calculate_commission')"><router-link to="/agent/commission?report_flag=True"><span class="nav-text">{{$t('nav.commission_report')}}</span></router-link></li>
                            </ul>
                        </li>
                        <li :class="$route.meta.group == 'manage' ? 'active' : ''">
                            <a>
                                <span class="nav-icon"><i class="material-icons m-r-xs">&#xE051;</i>运营管理</span>
                            </a>
                            <ul class="nav-sub">
                                <li><router-link to="/envelope"><span class="nav-text">{{$t("nav.envelope")}}</span></router-link></li>
                                <li><router-link to="/messages"><span class="nav-text">{{$t("nav.message")}}</span></router-link></li>
                                <li><router-link to="/promotion"><span class="nav-text">{{$t("nav.promotion")}}</span></router-link></li>
                                <li><router-link to="/banner"><span class="nav-text">{{$t("nav.title_banner")}}</span></router-link></li>
                                <li><router-link to="/announcement"><span class="nav-text">{{$t("nav.title_announcement")}}</span></router-link></li>
                                <li><router-link to="/website"><span class="nav-text">{{$t("nav.title_website")}}</span></router-link></li>
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
