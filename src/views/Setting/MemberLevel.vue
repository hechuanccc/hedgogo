<template>
<div>
    <div class="m-b" v-if="$root.permissions.includes('add_member_level')">
        <router-link
            class="md-btn blue w-sm"
            tag="button"
            to="/level/add"
        >{{ $t('action.add_level') }}
        </router-link>
    </div>
    <div class="box">
        <table st-table="rowCollectionBasic" class="table table-striped">
            <thead>
                <tr>
                    <th>{{ $t('common.name') }}</th>
                    <th class="text-center">{{ $t('common.status') }}</th>
                    <th class="text-center">{{ $t('level.remit_limit') }}</th>
                    <th class="text-center">{{ $t('level.online_pay_limit') }}</th>
                    <th class="text-center">{{ $t('level.withdraw_limit') }}</th>
                    <th class="text-center">{{ $t('level.max_withdraw_count_per_day') }}</th>
                    <th>{{ $t('level.discount') }}</th>
                    <th>{{ $t('common.member_count') }}</th>
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
                            {{ $t('common.not_set') }}
                        </span>
                    </td>
                    <td class="text-center">
                        <div v-if="l.online_limit && (l.online_limit.lower || l.online_limit.upper)">
                            <span v-if="l.online_limit.upper && l.online_limit.lower">{{ l.online_limit.lower }} 至 {{ l.online_limit.upper }}</span>
                            <span v-else-if="!l.online_limit.lower">{{ l.online_limit.upper }} 以下</span>
                            <span v-else-if="!l.online_limit.upper">{{ l.online_limit.lower }} 以上</span>
                        </div>
                        <span v-else>
                            {{ $t('common.not_set') }}
                        </span>
                    </td>
                    <td class="text-center">
                        <div v-if="l.withdraw_limit && (l.withdraw_limit.lower || l.withdraw_limit.upper)">
                            <span v-if="l.withdraw_limit.upper && l.withdraw_limit.lower">{{ l.withdraw_limit.lower }} 至 {{ l.withdraw_limit.upper }}</span>
                            <span v-else-if="!l.withdraw_limit.lower">{{ l.withdraw_limit.upper }} 以下</span>
                            <span v-else-if="!l.withdraw_limit.upper">{{ l.withdraw_limit.lower }} 以上</span>
                        </div>
                        <span v-else>
                            {{ $t('common.not_set') }}
                        </span>
                    </td>

                    <td class="text-center">
                        <span v-if="l.max_withdraw_count_per_day !== null">
                            {{ l.max_withdraw_count_per_day }}
                        </span>
                        <span v-else>{{ $t('common.not_set') }}</span>
                    </td>
                    
                    <td class="text-sm">
                        <router-link tag="div" v-show="l.online_discounts" :to="'/level/' + l.id">{{ $t('bill.remit') }}：
                            <a v-if="l.remit_discounts">{{ l.remit_discounts.length }} {{ $t('level.level_settings') }}</a>
                            <span class="text-muted" v-else>{{ $t('common.not_set') }}</span>
                        </router-link>
                        <router-link tag="div" v-show="l.online_discounts" :to="'/level/' + l.id">{{ $t('bill.onlinepay') }}：
                            <a v-if="l.online_discounts">{{ l.online_discounts.length }} {{ $t('level.level_settings') }}</a>
                            <span class="text-muted" v-else>{{ $t('common.not_set') }}</span>
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
        <b>{{ $t('common.loading') }}...</b>
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
