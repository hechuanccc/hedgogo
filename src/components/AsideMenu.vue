<template>
    <div id="aside" class="app-aside modal folded show-text nav-dropdown" v-if="showNav">
        <div class="left navside grey dk w-sm">
            <div class="navbar no-radius">
                <a class="navbar-brand" href="/">
                  <img src="../../static/images/logo.png" />
                  <span class="hidden-folded inline">$t{{'app_name'}}</span>
                </a>
            </div>

            <div>
                <nav class="nav-active-blue" >
                    <ul class="nav" ui-nav="">
                        <template>
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
                                <li v-if="$root.permissions.includes('view_remit_transaction_page')">
                                    <router-link to="/bill/remit"><span class="nav-text">{{$t('title.finance_remit')}}</span>
                                    </router-link>
                                </li>
                                <li v-if="$root.permissions.includes('view_withdraw_application_page')">
                                    <router-link to="/bill/withdraw"><span class="nav-text">{{$t('title.finance_withdraw')}}</span>
                                    </router-link>
                                </li>
                                <li>
                                    <router-link to="/bill/online_pay"><span class="nav-text">{{$t('title.finance_online_pay')}}</span>
                                    </router-link>
                                </li>
                                <li>
                                    <router-link to="/bill/search"><span class="nav-text">{{$t('title.finance_search')}}</span>
                                    </router-link>
                                </li>
                            </ul>
                        </li>
                        <li :class="$route.meta.group == 'report' ? 'active' : ''">
                            <a>
                              <span class="nav-icon"><i class="material-icons m-r-xs">&#xe24b;</i>报表管理</span>
                            </a>
                            <ul class="nav-sub">
                                <li><router-link to="/report/finance_report"><span class="nav-text">{{$t('title.report_finance')}}</span></router-link></li>
                                <li><router-link to="/report/member_report"><span class="nav-text">{{$t('title.report_member')}}</span></router-link></li>
                                <li><router-link to="/report/game"><span class="nav-text">{{$t('title.report_game')}}</span></router-link></li>
                            </ul>
                        </li>

                        <li :class="$route.meta.group == 'betrecord' ? 'active' : ''">
                            <a>
                              <span class="nav-icon"> <i class="material-icons m-r-xs">&#xe1b8;</i>投注记录</span>
                            </a>
                            <ul class="nav-sub">
                                <li><router-link to="/report/betrecord"><span class="nav-text">{{$t('title.betting_record')}}</span></router-link></li>
                                <li><router-link to="/report/betrecord/realtime?account_type=1,2"><span class="nav-text">{{$t('title.betting_record_instant')}}</span></router-link></li>
                            </ul>
                        </li>

                        <li><div class="b-b m-t-sm m-b-sm"></div></li>
                        <li :class="$route.meta.group == 'users' ? 'active' : ''">
                            <a>
                              <span class="nav-icon"><i class="material-icons m-r-xs">&#xE7FC;</i>用户管理</span>
                            </a>
                            <ul class="nav-sub">
                                <li>
                                    <router-link  to="/agent/applications?status=3">
                                        <span class="nav-text">{{$t('title.agent_application')}}</span>
                                    </router-link>
                                </li>
                                <li>
                                    <router-link  to="/agent">
                                        <span class="nav-text">{{$t('title.agent_list')}}</span>
                                    </router-link>
                                </li>
                                <li>
                                    <router-link  to="/member">
                                        <span class="nav-text">{{$t('title.member_list')}}</span>
                                    </router-link>
                                </li>
                                <li>
                                    <router-link  to="/online_member">
                                        <span class="nav-text">{{$t('title.online_member')}}</span>
                                    </router-link>
                                </li>
                                <li v-if="$root.permissions.includes('view_staff_management_page')">
                                    <router-link to="/staff">
                                        <span class="nav-text">{{$t('title.staff_list')}}</span>
                                    </router-link>
                                </li>
                            </ul>
                        </li>

                        <li><div class="b-b m-t-sm m-b-sm"></div></li>
                        <li :class="$route.meta.group == 'game_manage' ? 'active' : ''">
                            <router-link to="/game_list">
                                <span class="nav-icon"><i class="material-icons m-r-xs">&#xE021;</i>游戏管理</span>
                            </router-link>
                        </li>
                        
                        <li :class="$route.meta.group == 'game_history' ? 'active' : ''">
                            <router-link to="/game_history">
                                <span class="nav-icon"><i class="material-icons m-r-xs">&#xE889;</i>历史开奖</span>
                            </router-link>
                        </li>

                        <li><div class="b-b b m-t-sm m-b-sm"></div></li>
                        <li :class="$route.meta.group == 'transaction' ? 'active' : ''">
                            <a>
                              <span class="nav-icon"><i class="fa fa-suitcase m-r-xs"></i>交易配置</span>
                            </a>
                            <ul class="nav-sub">
                                <li><router-link to="/paymenttype"><span class="nav-text">{{$t('title.payment_type_management')}}</span></router-link></li>
                                <li><router-link to="/online_payee"><span class="nav-text">{{$t('title.online_payee_management')}}</span></router-link></li>
                                <li><router-link to="/online_payer"><span class="nav-text">{{$t('title.online_payer_management')}}</span></router-link></li>
                                <li><router-link to="/bank"><span class="nav-text">{{$t('title.setting_bank')}}</span></router-link></li>
                                <li><router-link to="/remit_payee"><span class="nav-text">{{$t('title.remit_payee')}}</span></router-link></li>
                            </ul>
                        </li>

                        <li :class="$route.meta.group == 'setting' ? 'active' : ''">
                            <a>
                              <span class="nav-icon"><i class="material-icons m-r-xs">&#xE8B8;</i>系统配置</span>
                            </a>
                            <ul class="nav-sub">
                                <li><router-link to="/roles"><span class="nav-text">{{$t('title.role_management')}}</span></router-link></li>
                                <li v-if="$root.permissions.includes('view_global_parameters_setting')"><router-link to="/global_parameters"><span class="nav-text">{{$t('title.setting_global_parameter')}}</span></router-link></li>
                                <li><router-link to="/chatroom"><span class="nav-text">{{$t('title.setting_chatroom')}}</span></router-link></li>
                                <li><router-link to="/level"><span class="nav-text">{{$t('title.member_level')}}</span></router-link></li>
                                <li><router-link to="/commission"><span class="nav-text">{{$t('title.commission')}}</span></router-link></li>
                            </ul>
                        </li>

                        <li :class="$route.meta.group == 'logging' ? 'active' : ''">
                            <a>
                                <span class="nav-icon"><i class="material-icons m-r-xs">&#xe873;</i>日志管理</span>
                            </a>
                            <ul class="nav-sub">
                                <li><router-link to="/login_record"><span class="nav-text">{{$t('title.log_login')}}</span></router-link></li>
                                <li><router-link to="/actionrecord"><span class="nav-text">{{$t('title.log_action')}}</span></router-link></li>
                            </ul>
                        </li>
                        <li :class="$route.meta.group == 'agent' ? 'active' : ''" v-if="$root.permissions.includes('export_agent_commission_report')">
                            <a>
                                <span class="nav-icon"><i class="material-icons m-r-xs">&#xE7FB;</i>代理结算</span>
                            </a>
                            <ul class="nav-sub">
                                <li><router-link to="/agent/commission"><span class="nav-text">{{$t('title.report_commission')}}</span></router-link></li>
                            </ul>
                        </li>
                        <li :class="$route.meta.group == 'manage' ? 'active' : ''">
                            <a>
                                <span class="nav-icon"><i class="material-icons m-r-xs">&#xE051;</i>运营管理</span>
                            </a>
                            <ul class="nav-sub">
                                <li><router-link to="/messages"><span class="nav-text">{{$t('title.message')}}</span></router-link></li>
                                <li><router-link to="/promotion"><span class="nav-text">{{$t('title.promotion')}}</span></router-link></li>
                                <li><router-link to="/banner"><span class="nav-text">{{$t('title.marketing_banner')}}</span></router-link></li>
                                <li><router-link to="/announcement"><span class="nav-text">{{$t('title.announcement_management')}}</span></router-link></li>
                                <li><router-link to="/website"><span class="nav-text">{{$t('title.marketing_website')}}</span></router-link></li>
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
