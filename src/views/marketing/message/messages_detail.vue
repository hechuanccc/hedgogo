<template>
    <div>
        <div class="m-b">
            <ol class="breadcrumb">
                <li class="active"><router-link to="/messages">{{$t('nav.message')}}</router-link></li>
                <li class="active">{{$route.meta.title}}</li>
            </ol>
        </div>
        <div class="box">
            <div class="row box-body">
                <div class="col-xs-8">
                    <table class="table b-a m-t-sm">
                        <tbody>
                        <tr>
                            <th class="grey-50" width="200">{{$t('messages.title')}}</th>
                            <td class="word-break">{{message.title}}</td>
                        </tr>
                        <tr>
                            <th class="grey-50" width="200">{{$t('messages.transaction')}}</th>
                            <td class="word-break">{{message.transaction}}</td>
                        </tr>
                        <tr>
                            <th class="grey-50" width="200">{{$t('messages.receiver')}}</th>
                            <td class="word-break">{{message.receiver}}</td>
                        </tr>
                        <tr>
                            <th class="grey-50" width="200">{{$t('messages.text')}}</th>
                            <td class="word-break">{{message.content}}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import api from '../../../api'

    export default {
        data () {
            return {
                message: {
                    id: '',
                    content: '',
                    receiver: '',
                    sent_at: '',
                    title: '',
                    transaction: '',
                    member_level: ''
                }
            }
        },
        beforeRouteEnter (to, from, next) {
            next(vm => {
                let id = to.params.messagesId
                if (id) {
                    vm.getMessage(id)
                }
            })
        },
        methods: {
            getMessage (id) {
                this.$http.get(api.messages + id).then((response) => {
                    this.message = response.data
                })
            }
        },
        components: {
            level: require('../../../components/level')
        }
    }

</script>

<style scoped>
    .word-break {
       word-break: break-all;
       max-width: 100%;
    }
</style>
