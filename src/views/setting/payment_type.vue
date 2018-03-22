<template>
<div>
    <div class="row">
        <div class="pull-right m-r">
            <button class="md-btn w-sm blue m-b" @click="changeMode">{{ mode ? $t('game_manage.adjust_rank') : $t('action.confirm') }}</button>
            <button class="md-btn w-sm m-b m-l-sm" v-show="!mode" @click="cancelAdjustRank">{{ $t('action.cancel') }}</button>
        </div>
    </div>
    <div class="box p-a">
        <div class="b-b nav-active-blue">
            <ul class="nav nav-tabs">
                <li class="nav-item" v-if="mode || type === 0">
                    <a
                    class="nav-link"
                    :class="{ 'active': type === 0 }"
                    @click="changeType(0)"
                    ><b>{{$t('manage.pc')}}</b>
                    </a>
                </li>
                <li class="nav-item" v-if="mode || type === 1">
                    <a
                    class="nav-link"
                    :class="{ 'active': type === 1 }"
                    @click="changeType(1)"
                    ><b>{{$t('manage.mobile')}}</b>
                    </a>
                </li>
            </ul>
        </div>
        <table st-table="rowCollectionBasic" class="table table-striped">
            <thead>
                <tr>
                    <th v-show="!mode" style="width: 3%;"></th>
                    <th>{{$t('setting.display_name')}}</th>
                    <th>{{$t('setting.payee')}}</th>
                    <th>{{$t('common.status')}}</th>
                </tr>
            </thead>
            <draggable
                v-model="filerPaymentTypes"
                :element="'tbody'"
                :options="{
                    disabled: mode
                }"
            >
                <tr
                    v-for="paymentType in filerPaymentTypes"
                    :key="paymentType.id"
                    :class="{
                        'pointer': !mode 
                    }"
                >
                    <td v-show="!mode"><i class="fa fa-reorder text-blue"></i></td>
                    <td v-if="$root.permissions.includes('update_onlinepayment')">
                        <router-link :to="'/paymenttype/' + paymentType.id + '/edit'">
                            {{paymentType.display_name}}
                        </router-link>
                    </td>
                    <td v-if="paymentType.detail.length">
                        <span v-for="payee in paymentType.detail" :key="payee.id">
                            {{payee.name}}
                        </span> 
                    </td>
                    <td v-else>-</td>
                    <td>
                        <span class="label success m-r" v-if="paymentType.status==1">{{$t('status.active')}}</span>
                        <span class="label danger m-r" v-else>{{$t('status.disabled')}}</span>
                        <template v-if="$root.permissions.includes('update_onlinepayment_status')">
                            <a @click="toggleStatus(paymentType)" v-if="paymentType.status==1">{{$t('status.disabled')}}</a>
                            <a @click="toggleStatus(paymentType)" v-else>{{$t('status.active')}}</a>
                        </template>
                    </td>
                </tr>
            </draggable>
        </table>
    </div>
</div>
</template>
<script>
import api from '../../api'
import draggable from 'vuedraggable'
import $ from '../../utils/util'
export default {
    data () {
        return {
            mode: 1,
            paymentTypes: [],
            filerPaymentTypes: [],
            type: 0
        }
    },
    created () {
        this.getPaymentType()
    },
    methods: {
        toggleStatus (paymentType) {
            this.$http.put(api.paymenttype + paymentType.id + '/', {
                'status': paymentType.status === 0 ? 1 : 0
            }).then(data => {
                paymentType.status = data.status
            })
        },
        getPaymentType () {
            this.$http.get(`${api.paymenttype}?opt_expand=1`).then(data => {
                this.paymentTypes = data
                this.paymentTypes.forEach(paymentType => {
                    paymentType.detail = paymentType.detail.filter(payee => payee.activate)
                })
                this.changeType(this.type)
            })
        },
        changeMode () {
            if (!this.mode) {
                this.$http.post(`${api.paymenttype}rank/?opt_expand=1`, this.filerPaymentTypes.map((p, index) => Object({
                    id: p.id,
                    [`${this.type ? 'mobile' : 'pc'}_rank`]: index + 1
                }))).then(data => {
                    $.notify({
                        message: this.$t('game_manage.modify_success'),
                        type: 'success'
                    })
                    this.getPaymentType()
                }, error => {
                    $.notify({
                        message: error,
                        type: 'danger'
                    })
                    this.changeType(this.type)
                })
            }
            this.mode = !this.mode
        },
        cancelAdjustRank () {
            this.mode = !this.mode
            this.changeType(this.type)
        },
        changeType (type) {
            if (this.mode) {
                this.type = type
                this.filerPaymentTypes = this.paymentTypes
                .filter(element => element.platform === 2 || element.platform === this.type)
                .sort((a, b) => {
                    let attribute = this.type ? 'mobile_rank' : 'pc_rank'
                    return a[attribute] - b[attribute]
                })
            }
        }
    },
    components: {
        draggable
    }
}
</script>
