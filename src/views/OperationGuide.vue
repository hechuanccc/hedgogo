<template>
<div>
    <div class="col-md-3">
        <div class="box">
            <div class="box-body">
                <div
                    class="b-b m-b-sm"
                    v-for="h3 in operationGuide"
                    :key="h3.ref"
                >
                    <router-link tag="p" class="pointer text-md" :to="`#${h3.ref}`">{{ h3.title }}</router-link>
                    <div
                        class="m-l-xs m-b-xs p-b-xs"
                        v-for="h4 in h3.sub"
                        :key="`${h3.ref}_${h4.ref}`"
                        v-if="h3.sub && h3.sub.length"
                    >
                        <router-link tag="p" class="pointer m-b-sm" :to="`#${h3.ref}_${h4.ref}`">
                            {{ h4.title }}
                        </router-link>
                        <div class="m-l-xs text-blue m-b-xs"
                            v-for="h5 in h4.sub"
                            :key="`${h3.ref}_${h4.ref}_${h5.ref}`"
                            v-if="h4.sub && h4.sub.length"
                        >
                            <router-link tag="p" class="pointer m-b-sm" :to="`#${h3.ref}_${h4.ref}_${h5.ref}`">
                                {{ h5.title }}
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="col-md-9">
        <div class="box">
            <div class="box-body p-r-lg">
                <div
                    class="m-b-md b-b"
                    v-for="h3 in operationGuide"
                    :key="h3.ref"
                >
                    <h3
                        class="m-b-md _500"
                        :ref="h3.ref"
                        :class="{'text-blue': bookmark === h3.ref}"
                    >
                        {{ h3.title }}
                        <i class="fa fa-hand-o-left text-blue" v-show="bookmark === h3.ref"></i>
                    </h3>
                    <div
                        class="m-l-sm m-b-md"
                        v-for="h4 in h3.sub"
                        :key="`${h3.ref}_${h4.ref}`"
                        v-if="h3.sub && h3.sub.length"
                    >
                        <h4
                            class="m-b"
                            :ref="`${h3.ref}_${h4.ref}`"
                            :class="{'text-blue': bookmark === `${h3.ref}_${h4.ref}`}"
                        >
                            {{ h4.title }}
                            <i class="fa fa-hand-o-left text-blue" v-show="bookmark === `${h3.ref}_${h4.ref}`"></i>
                        </h4>
                        <div class="m-l-sm m-b-sm" v-if="h4.sub && h4.sub.length > 0">
                            <div class="p-l m-b-0">
                                <div
                                    class="m-b-sm p-b-xs"
                                    v-for="(h5, index) in h4.sub"
                                    :key="`${h3.ref}_${h4.ref}_${h5.ref}`"
                                    v-if="h4.sub && h4.sub.length"
                                >
                                    <h5
                                        :ref="`${h3.ref}_${h4.ref}_${h5.ref}`"
                                        :class="{'text-blue': bookmark === `${h3.ref}_${h4.ref}_${h5.ref}`}"
                                    >
                                        <span v-if="h4.sub.length > 1">{{ `${index + 1}.` }}</span>
                                        {{ h5.title }}
                                        <i class="fa fa-hand-o-left text-blue" v-show="bookmark === `${h3.ref}_${h4.ref}_${h5.ref}`"></i>
                                    </h5>
                                    <div class="content m-l" v-html="h5.content" v-if="h5.content"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>
<script>
export default {
    data () {
        return {
            operationGuide: [{
                title: '财务',
                ref: 'finance',
                sub: [{
                    title: '支付',
                    ref: 'payment',
                    sub: [{
                        title: '在线充值',
                        ref: 'deposit',
                        content: `
                            <ol class="m-b-0 p-l" style="list-style-type: upper-alpha;">
                                <li>
                                    <p class="m-b-sm">支付网关异常处理</p>
                                    <ol class="m-b-0 p-l" style="list-style-type: lower-roman;">
                                        <li class="m-b-xs">在特定支付方式中取消勾选相关商户</li>
                                        <li class="m-b-xs">前台屏蔽禁用该网关商户
                                            <p>如该网关所有支付方式都出现异常，直接将此网关商户拉为测试层级使用，待修复后再次设置会员等级。</p>
                                        </li>
                                    </ol>
                                </li>
                                <li>
                                    <p class="m-b-sm">系统对于交易订单时效之判定</p>
                                    <p>每一笔在线支付都有一定的有效期，逾期未付系统会标记为已取消，因此若有订单于时效外进行交易并且在商户后台显示已成功，则需要运营人员自行为会员手动添加。</p>
                                </li>
                                <li>
                                    <p class="m-b-sm">第三方网关交易掉单之处置</p>
                                    <ol class="m-b-0 p-l" style="list-style-type: lower-roman;">
                                        <li class="m-b-xs">支付商户后台显示订单交易成功，但本系统后台未更新交易状态，代表第三方网关交易掉单，此时可进行<span class="text-danger">补单</span>，系统会向第三方网关取得交易订单的最新状态。</li>
                                        <li class="m-b-xs">部分网关不支持补单，系统支持手动补单，请依提示仔细操作。
                                            <div class="row">
                                                <div class="col-md-6 col-md-offset-2 m-t">
                                                    <table class="table table-bordered table-striped table-condensed text-sm text-center">
                                                        <thead><tr><th width="45%" class="text-center">网关商户</th><th width="55%" class="text-center">提示內容</th></tr></thead>
                                                        <tbody>
                                                            <tr><td>具有补单功能</td><td class="text-danger text-left">确认要补单吗？</td></tr>
                                                            <tr><td class="v-m">不具有补单功能</td><td class="text-danger text-left">确认要补单吗？ 此操作会直接将订单状态更改为成功，请确认是否收到款项后再执行此操作</td></tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </li>
                                    </ol>
                                </li>
                            </ol>
                        `
                    }]
                }, {
                    title: '取款',
                    ref: 'withdraw',
                    sub: [{
                        title: '稽核金额计算',
                        ref: 'audit_amount',
                        content: `
                            <ol class="m-b-0 p-l" style="list-style-type: upper-alpha;">
                                <li class="m-b-sm">当会员在<span class="text-danger">稽核通过下发起新的存款交易</span>（转帐充值、在线充值、手工存提且类型为存款稽核）时，系统会将会员的打码量清空并且将稽核金额重置为此次存款交易所产生的稽核金额。</li>
                                <li class="m-b-sm">当会员在<span class="text-danger">稽核未通过下发起存款交易</span>（转帐充值、在线充值、手工存提且类型为存款稽核）时，系统不会将打码量清空，而稽核金额则是直接累加上去。</li>
                                <li class="m-b-sm">一旦会员发起取款申请且后台通过审核，则打码量及稽核金额立即清空。</li>
                            </ol>
                        `
                    }, {
                        title: '每日取款限制',
                        ref: 'limit',
                        content: '在「会员等级」中具有每日取款限制的配置，系统仅将取款审核成功的视为一次取款，初始化的系统默认每日取款限制为4次，可根据营运需求自行调整。'
                    }]
                }]
            }, {
                title: '用户管理',
                ref: 'user',
                sub: [{
                    title: '会员',
                    ref: 'member',
                    sub: [{
                        title: '注册送彩金，如需通过派利发展会员可启用该功能',
                        ref: 'register_present',
                        content: `
                            <ol class="m-b-0 p-l" style="list-style-type: upper-alpha;">
                                <li class="m-b-sm">可在「系统配置」->「会员等级」中启用，一般只需要为系统的默认会员等级配置。</li>
                                <li class="m-b-sm">建议启用：会员需填写银行资讯才可以获得该彩金，同样在会员等级中可配置。</li>
                            </ol>
                        `
                    }, {
                        title: '用户余额及估算额度之对照',
                        ref: 'balance_and_suggestion',
                        content: '估算额度为系统确保用户当前余额不被篡改所提供的参考，若两个余额不符就需要仔细核查该会员的交易历史，也可进一步联系技术支持排查疑问。'
                    }, {
                        title: '通过 IP 批量禁用会员',
                        ref: 'batch_ban',
                        content: '如发现异常 IP 有大量会员登录，可在会员列表或系统参数配置中禁用可疑账号。'
                    }]
                }, {
                    title: '代理商',
                    ref: 'agent',
                    sub: [{
                        title: '多层级代理',
                        ref: 'multi_level',
                        content: `
                            <ol class="m-b-0 p-l" style="list-style-type: upper-alpha;">
                                <li class="m-b-sm">系统支持多层级代理体系，以「大股东」-> 「股东」-> 「总代理」-> 「代理」的层级模型实现代理功能。</li>
                                <li class="m-b-sm">审核代理申请亦或是新增代理商时，必须设定此代理商的层级、上线、佣金设定、预设会员等级等重要资讯，一但设定好后，<span class="text-danger">代理商的代理层级不可再变动</span>，但其上线可以因营运需求而在日后变更。</li>
                            </ol>
                        `
                    }, {
                        title: '佣金设定',
                        ref: 'commission_setting',
                        content: `
                            <ol class="m-b-0 p-l" style="list-style-type: upper-alpha;">
                                <li class="m-b-sm">
                                    代理的佣金设定可于「系统配置」--> 「佣金设定」进行配置，佣金设定当中的有效会员及盈利范围为一阀值，表示只有当代理商的有效会员数及盈利范围超过您所设定的区间时，代理商才能采用此佣金计算方式。
                                </li>
                                <li class="m-b-sm">
                                    盈利范围的设定可为多组区间不同比例，以下图为例，代理商的盈利范围在100~500元时，系统采用3%的佣金比例计算佣金，当代理商的盈利范围在500元以上时，系统采用6%的佣金比例计算佣金，若代理商的盈利范围不到100元，则无佣金。
                                    <div class="row text-center m-t-sm">
                                        <img class="b-a" width="400" src="../../static/images/operation_guide_img_1.png" alt="."/>
                                    </div>
                                </li>
                            </ol>
                        `
                    }, {
                        title: '佣金计算',
                        ref: 'commission_amount',
                        content: '在「代理结算」--> 「佣金计算」，可以看到一定时间内所有代理商的佣金报表，可根据营运需求自行调整计算区间，系统会根据目前代理商所采用的佣金比例即时计算。'
                    }]
                }]
            }, {
                title: '游戏管理',
                ref: 'game',
                sub: [{
                    title: '盘口设定',
                    ref: 'setting',
                    sub: [{
                        title: '停用/封盘 游戏时机',
                        ref: 'disabled_and_close',
                        content: `
                            <ol class="m-b-0 p-l" style="list-style-type: upper-alpha;">
                                <li class="m-b-sm">停用游戏
                                    <p class="m-t-sm">
                                        当游戏因为特殊因素需要进入维护时，请将游戏停用，停用的操作会使得前台彩票网不显示此游戏。
                                    </p>
                                </li>
                                <li class="m-b-sm">游戏封盘
                                    <p class="m-t-sm">
                                        若游戏出现无法预期之突发状况，可暂时封盘进行排查，封盘时游戏前台可见但无法下注。
                                    </p>
                                </li>
                            </ol>
                        `
                    }, {
                        title: '赔率配置',
                        ref: 'odds',
                        content: `
                            <ol class="m-b-0 p-l" style="list-style-type: upper-alpha;">
                                <li class="m-b-sm">默认赔率
                                    <p class="m-t-sm">
                                        系统根据资料分析和一定的盈利空间给予游戏最适当的默认赔率，一般来说无需进行大调整，可依据实际营运需求调整。
                                    </p>
                                </li>
                                <li class="m-b-sm">标准赔率
                                    <p class="m-t-sm">
                                        系统另外提供标准赔率的参考，是系统依照该游戏的特定玩法的中奖机率计算出的赔率，可供参考。
                                    </p>
                                </li>
                            </ol>
                        `
                    }]
                }, {
                    title: '官方未开',
                    ref: 'no_draw',
                    sub: [{
                        title: '官方未开奖之判定',
                        ref: 'judgement',
                        content: `
                            <ol class="m-b-0 p-l" style="list-style-type: upper-alpha;">
                                <li class="m-b-sm">秒速系列官方未开
                                    <p class="m-t-sm">
                                        <span class="text-danger">秒速系列</span>的彩种：秒速赛车、秒速飞艇、秒速时时彩，时常出现官方未开的情形，若在 <span class="text-danger">20</span> 期内官方有补开，则系统会自动补开，但官方若在20期以后补开，系统则无法自动补开，需要手动输入开奖结果。
                                    </p>
                                </li>
                                <li class="m-b-sm">其他彩种
                                    <p class="m-t-sm">
                                        若出现彩票官方未开奖，但是在 3期 以内官方有补开，则系统会自动补开，超过 <span class="text-danger">3</span> 期，则系统无法自动补开，可于该游戏官方网站确认。
                                    </p>
                                </li>
                            </ol>
                        `
                    }, {
                        title: '官方未开之处置',
                        ref: 'operation',
                        content: `
                            <p class="m-b-sm">一旦确认为官方未开，请进行以下操作流程</p>
                            <ol class="m-b-0 p-l m-l-sm" style="list-style-type: upper-alpha;">
                                <li class="m-b-sm">将未开期数标记为官方未开</li>
                                <li class="m-b-sm">确认该期是否有注单产生，以决定是否将整期注单一并撤销</li>
                            </ol>
                        `
                    }]
                }, {
                    title: '手动开奖',
                    ref: 'manual_draw',
                    sub: [{
                        title: '手动开奖时机',
                        ref: 'timing',
                        content: '若您发现有游戏期数未开奖，属于系统异常而非官方未开，可以自行为游戏手动开奖，也可不选择做任何操作，技术支持会随时为异常的系统状况做修正。'
                    }]
                }, {
                    title: '撤单',
                    ref: 'retreat_schedule',
                    sub: [{
                        title: '未结算注单撤单',
                        ref: 'unsettled',
                        content: `
                            <ol class="m-b-0 p-l" style="list-style-type: upper-alpha;">
                                <li class="m-b-sm">进行中游戏整期撤单在「历史开奖」頁面中選取特定遊戲，可以整期撤销正在进行的注单。</li>
                                <li class="m-b-sm">进行中游戏之会员单笔注单撤销在「投注记录」->「实时滚单」页面中，可以单笔取消会员注单</li>
                            </ol>
                        `
                    }, {
                        title: '已结算期数撤单',
                        ref: 'settled',
                        content: '系统提供游戏整期已结算注单撤单的功能，在进行撤单以前系统会计算此次撤单将会影响的所有会员注单情形做再次确认，执行撤单操作后影响的会员余额皆会重新计算。'
                    }]
                }]
            }, {
                title: '系统配置',
                ref: 'system',
                sub: [{
                    title: '系统参数配置',
                    ref: 'parameter_setting',
                    sub: [{
                        title: '启用手机验证-提升网站安全层级',
                        ref: 'phone_validation',
                        content: `
                            <ol class="m-b-0 p-l" style="list-style-type: upper-alpha;">
                                <li class="m-b-sm">
                                    系统提供使用注册手机验证的机制，启用此验证机制，则将取代图形验证码，网站安全层级更高。
                                </li>
                                <li class="m-b-sm">
                                    <span class="text-danger">注意</span> 此功能需要额外付费，需提前告知才能使用，并且受中国短信服务商政策影响，可能会不稳定。
                                </li>
                            </ol>
                        `
                    }]
                }, {
                    title: '聊天室配置',
                    ref: 'chatroom_setting',
                    sub: [{
                        title: '启用整站聊天室功能',
                        ref: 'enabled_chatroom',
                        content: `
                            <p>在「聊天室配置」中的「聊天室参数配置」区块，具有「<span class="text-danger">是否启用聊天室</span>」的选项，此操作决定了是否要将聊天室功能启用，若选择禁用，则任何的聊天室皆不会显示于前台。</p>
                        `
                    }, {
                        title: '为整站聊天室设定发言条件及红包配置',
                        ref: 'speak_and_envelope',
                        content: `
                            <ol class="m-b-0 p-l" style="list-style-type: upper-alpha;">
                                <li class="m-b-sm">
                                    系统提供发言条件的配置，未达发言条件的会员无法在任何聊天室中进行发言。
                                </li>
                                <li class="m-b-sm">
                                    系统提供聊天室发送红包的功能，可进一步调整红包发放的条件
                                </li>
                            </ol>
                        `
                    }, {
                        title: '为单个游戏启用聊天室',
                        ref: 'enabled_game_chatroom',
                        content: `
                            <p class="m-b-sm">当整站的聊天室功能启用，系统提供为个别游戏聊天室做个性化设定，能做设定的操作如下</p>
                            <ol class="m-b-0 p-l m-l-sm" style="list-style-type: upper-alpha;">
                                <li class="m-b-sm p-b-xs">
                                    <p class="m-b-xs">将个别游戏聊天室启用 / 禁用</p>
                                    <ol class="m-b-0 p-l m-l-sm" style="list-style-type: lower-roman;">
                                        <li class="m-b-sm">
                                            若「<span class="text-danger">是否启用聊天室</span>」为启用，且个别游戏聊天室也启用，则此游戏页面会出现此游戏聊天室。
                                        </li>
                                        <li class="m-b-sm">若「<span class="text-danger">是否启用聊天室</span>」为启用，但个别游戏聊天室禁用，则此游戏页面所显示的聊天室为默认聊天室。</li>
                                        <li class="m-b-sm">若「<span class="text-danger">是否启用聊天室</span>」为禁用，则不管个别聊天室是否启用，都不会显是于前台</li>
                                    </ol>
                                </li>
                                <li class="m-b-sm p-b-xs">
                                    <p class="m-b-xs">设定游戏聊天室管理员、计划员</p>
                                    <ol class="m-b-0 p-l m-l-sm" style="list-style-type: lower-roman;">
                                        <li class="m-b-sm">
                                            管理员可禁言、拉黑于聊天室发言的会员
                                        </li>
                                        <li class="m-b-sm">
                                            计划员能将在自己在前台下注的选项推送至相应游戏聊天室中，以引导会员跟单
                                        </li>
                                    </ol>
                                </li>
                                <li class="m-b-sm p-b-xs">
                                    <p class="m-b-xs">启用游戏聊天室计划机器人</p>
                                    <ol class="m-b-0 p-l m-l-sm" style="list-style-type: lower-roman;">
                                        <li class="m-b-sm">
                                            <p class="m-b-sm">支持计划机器人的游戏</p>
                                            <ol class="m-b-0 p-l m-l-sm">
                                                <li class="m-b-sm">时时彩系列：秒速时时彩、重庆时时彩、新疆时时彩、天津时时彩</li>
                                                <li class="m-b-sm">秒速赛车、秒速飞艇、幸运飞艇、北京赛车</li>
                                                <li class="m-b-sm">其余游戏暂不提供</li>
                                            </ol>
                                        </li>
                                        <li class="m-b-sm">
                                            进入上述聊天室配置，可启用/禁用计划机器人，亦能调整发言时间。
                                        </li>
                                    </ol>
                                </li>
                            </ol>
                        `
                    }]
                }]
            }],
            bookmark: ''
        }
    },
    created () {
        this.setBookmark()
    },
    watch: {
        '$route': {
            handler () {
                this.setBookmark()
            },
            deep: true
        }
    },
    methods: {
        scrollIntoView (ref) {
            this.$nextTick(() => {
                this.$refs[ref] && this.$refs[ref][0].scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                })
            })
        },
        async setBookmark () {
            if (this.$route.hash) {
                this.bookmark = await this.$route.hash.split('#')[1]
                this.scrollIntoView(this.bookmark)
            } else {
                this.bookmark = ''
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.content {
    font-size: 16px; 
}
</style>
