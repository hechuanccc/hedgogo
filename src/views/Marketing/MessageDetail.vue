<template>
    <div>
        <div class="m-b">
            <ol class="breadcrumb">
                <li class="active"><router-link to="/messages">{{ $t('title.message') }}</router-link></li>
                <li class="active">{{ $route.meta.title }}</li>
            </ol>
        </div>
        <div class="box">
            <div class="row box-body">
                <div class="col-xs-8">
                    <table class="table b-a m-t-sm">
                        <tbody>
                        <tr>
                            <th class="grey-50" width="200">{{ $t('message.title') }}</th>
                            <td class="word-break">{{ message.title }}</td>
                        </tr>
                        <tr>
                            <th class="grey-50" width="200">{{ $t('message.sent_at') }}</th>
                            <td class="word-break" v-if="message.sent_at">{{ message.sent_at | moment('YYYY-MM-DD HH:mm') }}</td>
                            <td class="word-break" v-else>-</td>
                        </tr>
                        <tr>
                            <th class="grey-50" width="200">{{ $t('message.sender') }}</th>
                            <td class="word-break">{{ message.sender_displayname }}</td>
                        </tr>
                        <tr>
                            <th class="grey-50" width="200">{{ $t('message.receiver') }}/{{ $t('message.receiver_group') }}</th>
                            <td class="word-break" v-if="message.receiver_group">{{ message.receiver_group.split(',').join(' ') }}</td>
                            <td class="word-break" v-else>-</td>
                        </tr>
                        <tr>
                            <th class="grey-50" width="200">{{ $t('message.content') }}</th>
                            <td class="word-break">{{ message.content }}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import { getSetting } from '../../service'

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
                id && vm.getMessage(id)
            })
        },
        methods: {
            getMessage (id) {
                getSetting('message', { id }).then(data => {
                    Object.assign(this.message, data)
                })
            }
        }
    }

</script>

<style scoped>
    .word-break {
       word-break: break-all;
       max-width: 100%;
    }
</style>
