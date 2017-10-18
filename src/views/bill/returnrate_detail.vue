<template>
    <div>
        <div class="m-b">
            <ol class="breadcrumb">
                <li class="active"><router-link to="/bill/returnrate">反水计算</router-link></li>
                <li class="active">{{$route.meta.title}}</li>
            </ol>
        </div>

        <div class="box">
            <table id="table" class="table table-striped">
                <thead>
                    <tr>
                        <th class="table-checkbox" v-if="!allSuccess">
                            <label class="md-check md-check-md m-r">
                                <input type="checkbox" @click="selectAll()" v-model="allselected">
                                <i class="blue"></i>
                            </label>
                        </th>
                        <th>#</th>
                        <th>{{$t('common.username')}}</th>
                        <th v-for="p in provider">{{p.code}}</th>
                        <th>{{$t('common.status')}}</th>
                        <th>{{$t('returnrate.updatedby')}}</th>
                        <th>{{$t('returnrate.total_return')}}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="t in returnData">
                        <td class="table-checkbox" v-if="!allSuccess">
                            <label class="md-check md-check-md m-r" v-if="t.status !== 1">
                                <input type="checkbox" :value="t.id" v-model="ids">
                                <i class="blue"></i>
                            </label>
                        </td>
                        <td>{{t.id}}</td>
                        <td>{{t.member}}</td>
                        <td v-for="r in t.return_details">{{r.sub_total | currency('￥')}}</td>
                        <td><transaction-status :transaction="t"></transaction-status></td>
                        <td>
                            <span v-if="t.updated_by">{{t.updated_by.name}}</span>
                            <span v-else>-</span>
                        </td>
                        <td>{{t.total_return | currency('￥')}}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="m-b" v-if="$root.permissions.includes('calculate_returnrate')">
            <template v-if="!allSuccess">
                <button class="md-btn m-b-sm w-xs blue m-r" @click="confirm()" :disabled="!ids.length">{{$t('common.confirmreturn')}}</button>
                <button class="md-btn  m-b-sm w-xs white" @click="clearReturn()">{{$t('common.cancelreturn')}}</button>
            </template>
            <button class="md-btn  m-b-sm w-xs white pull-right">
                <a :href="href" class="">{{$t('returnrate.export')}}</a>
            </button>
        </div>

        <div class="row" v-if="errorMsg">
            <div class="col-xs-3">
                <div class="alert alert-danger m-t">
                    {{errMsg}}
                </div>
            </div>
        </div>
        <div class="alert alert-success m-t" v-if="isSuccess">
        {{$t('returnrate.success')}}
    </div>
    </div>
</template>
<script>
    import api from '../../api'
    import transactionStatus from '../../components/transaction_status'
    import VueCookie from 'vue-cookie'

    export default {
        data () {
            return {
                errorMsg: '',
                isSuccess: false,
                returnData: [],
                provider: [],
                allselected: false,
                ids: [],
                href: '',
                status: [],
                allSuccess: false
            }
        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                let id = to.params.returnId
                if (id) {
                    vm.href = `${api.returnreport}?token=${VueCookie.get('access_token')}&report=return&history_id=${id}`
                    vm.getReturnDetails(id)
                }
            })
        },
        methods: {
            getReturnDetails (id) {
                this.$http.get(api.returnratedetail + '?opt_expand=updated_by&id=' + id).then((response) => {
                    this.returnData = response.data
                    let details = response.data[0].return_details
                    for (let i = 0; i < details.length; i++) {
                        this.provider.push(details[i])
                    }
                    for (let i = 0; i < response.data.length; i++) {
                        this.status.push(response.data[i].status)
                    }
                    // check if all the status is confirmed
                    if (this.status.includes(3)) {
                        this.allSuccess = false
                    } else {
                        this.allSuccess = true
                    }
                })
            },
            confirm () {
                let formData = new window.FormData()
                formData.append('ids', this.ids)

                this.$http.post(api.returnratedetail, formData).then((response) => {
                    if (response.status === 200) {
                        this.isSuccess = true
                        setTimeout(() => {
                            this.$router.push('/bill/returnrate/')
                        }, 2000)
                    }
                }, response => {
                    this.errorMsg = response.data.error
                })
            },
            selectAll () {
                this.allselected = !!this.allselected
                if (this.allselected) {
                    for (let detail in this.returnData) {
                        if (this.returnData[detail].status !== 1) {
                            this.ids.push(this.returnData[detail].id)
                        }
                    }
                } else {
                    this.ids = []
                }
            },
            clearReturn () {
                this.allselected = false
                this.ids = []
                this.$router.push('/bill/returnrate/')
            }
        },
        components: {
            transactionStatus
        }
    }
</script>
<style>
    .table-checkbox {
        width: 3%;
    }
    .md-btn a{
        color: #000;
    }
</style>
