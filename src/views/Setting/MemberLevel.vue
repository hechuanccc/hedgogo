<template>
<div>
    <div class="m-b" v-if="$root.permissions.includes('add_member_level')">
        <router-link
            class="md-btn blue w-sm"
            tag="button"
            to="/level/add"
        >{{ $t('dic.create') }}
        </router-link>
    </div>
    <div class="box">
        <table st-table="rowCollectionBasic" class="table table-striped">
            <thead>
                <tr>
                    <th>{{ $t('dic.name') }}</th>
                    <th class="text-center">{{ $t('dic.status') }}</th>
                    <th class="text-center">{{ $t('finance.remit_limit') }}</th>
                    <th class="text-center">{{ $t('finance.online_pay_limit') }}</th>
                    <th class="text-center">{{ $t('finance.withdraw_limit') }}</th>
                    <th class="text-center">{{ $t('finance.withdraw_limit_count_per_day') }}</th>
                    <th>{{ $t('finance.deposit_discount') }}</th>
                    <th>{{ $t('user.member_count') }}</th>
                </tr>
            </thead>
            <tbody v-if="!loading">
                <tr :key="l.id" v-for="l in levels">
                    <td><router-link :to="'/level/' + l.id">{{ l.name }}</router-link></td>
                    <td class="text-center">
                        <span v-if="l.status === 1" class="label success">{{ $t('status.active') }}</span>
                        <span v-else-if="l.status === 0" class="label danger">{{ $t('status.inactive') }}</span>
                    </td>
                    <td class="text-center">
                        <div v-if="l.remit_limit && (l.remit_limit.lower || l.remit_limit.upper)">
                            <span v-if="l.remit_limit.upper && l.remit_limit.lower">{{ l.remit_limit.lower }} 至 {{ l.remit_limit.upper }}</span>
                            <span v-else-if="!l.remit_limit.lower">{{ l.remit_limit.upper }} 以下</span>
                            <span v-else-if="!l.remit_limit.upper">{{ l.remit_limit.lower }} 以上</span>
                        </div>
                        <span v-else>
                            {{ $t('system.no_setting') }}
                        </span>
                    </td>
                    <td class="text-center">
                        <div v-if="l.online_limit && (l.online_limit.lower || l.online_limit.upper)">
                            <span v-if="l.online_limit.upper && l.online_limit.lower">{{ l.online_limit.lower }} 至 {{ l.online_limit.upper }}</span>
                            <span v-else-if="!l.online_limit.lower">{{ l.online_limit.upper }} 以下</span>
                            <span v-else-if="!l.online_limit.upper">{{ l.online_limit.lower }} 以上</span>
                        </div>
                        <span v-else>
                            {{ $t('system.no_setting') }}
                        </span>
                    </td>
                    <td class="text-center">
                        <div v-if="l.withdraw_limit && (l.withdraw_limit.lower || l.withdraw_limit.upper)">
                            <span v-if="l.withdraw_limit.upper && l.withdraw_limit.lower">{{ l.withdraw_limit.lower }} 至 {{ l.withdraw_limit.upper }}</span>
                            <span v-else-if="!l.withdraw_limit.lower">{{ l.withdraw_limit.upper }} 以下</span>
                            <span v-else-if="!l.withdraw_limit.upper">{{ l.withdraw_limit.lower }} 以上</span>
                        </div>
                        <span v-else>
                            {{ $t('system.no_setting') }}
                        </span>
                    </td>

                    <td class="text-center">
                        <span v-if="l.max_withdraw_count_per_day !== null">
                            {{ l.max_withdraw_count_per_day }}
                        </span>
                        <span v-else>{{ $t('system.no_setting') }}</span>
                    </td>
                    
                    <td class="text-sm">
                        <router-link tag="div" v-show="l.online_discounts" :to="'/level/' + l.id">{{ $t('finance.remit') }}：
                            <a v-if="l.remit_discounts">{{ l.remit_discounts.length }} {{ $t('misc.group_setting') }}</a>
                            <span class="text-muted" v-else>{{ $t('system.no_setting') }}</span>
                        </router-link>
                        <router-link tag="div" v-show="l.online_discounts" :to="'/level/' + l.id">{{ $t('finance.online_pay') }}：
                            <a v-if="l.online_discounts">{{ l.online_discounts.length }} {{ $t('misc.group_setting') }}</a>
                            <span class="text-muted" v-else>{{ $t('system.no_setting') }}</span>
                        </router-link>
                    </td>
                    <td>
                        <router-link v-if="l.member_count !== 0" :to="'/member/?level=' + l.id ">{{ l.member_count }}</router-link>
                        <span v-else>{{ l.member_count }}</span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="row text-center" v-if="loading">
        <i class="fa fa-spin fa-spinner"></i>
        <b>{{ $t('system.loading') }}</b>
    </div>
</div>
</template>

<script>
import { getSetting } from '../../service'

export default {
    data () {
        return {
            levels: [],
            loading: true
        }
    },
    created () {
        getSetting('memberLevel', {
            params: {
                account_type: 1
            }
        }).then(data => {
            this.levels = data
            this.loading = false
        })
    }
}
</script>
