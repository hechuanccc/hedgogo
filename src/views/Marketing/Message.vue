<template>
    <div>
        <div class="m-b" v-if="$root.permissions.includes('add_new_message')">
            <router-link tag="button" class="md-btn blue w-sm" to="/messages/add">{{ $t('title.message_add') }}</router-link>
        </div>

        <div class="box">
            <table st-table="rowCollectionBasic" class="table table-striped">
                <thead>
                <tr>
                    <th>{{ $t('message.title') }}</th>
                    <th>{{ $t('message.content') }}</th>
                    <th>{{ $t('message.receiver') }} / {{ $t('message.receiver_group') }}</th>
                    <th>{{ $t('message.sent_at') }}</th>
                    <th>{{ $t('message.sender') }}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="message in messages" :key="message.id">
                    <td><router-link :to="'/messages/'+ message.id">{{ message.title }}</router-link></td>
                    <td class="word-break">{{ message.content }}</td>
                    <td v-if="message.receiver_group">{{ message.receiver_group.split(',').join(' ') }}</td>
                    <td v-else>-</td>
                    <td>{{ message.sent_at | moment('YYYY-MM-DD HH:mm') }}</td>
                    <td>{{ message.sender_displayname }}</td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="row m-b-lg">
            <pulling
                :queryset="messages"
                :api="url.setting.message"
                :query="{}"
                @query-data="queryData"
                ref="pulling"
            />
        </div>
    </div>
</template>
<script>
import url from '../../service/url'
import Pulling from '../../components/Pulling'
export default {
    data () {
        return {
            messages: [],
            url
        }
    },
    created () {
        this.$nextTick(() => {
            this.$refs.pulling.rebase()
        })
    },
    methods: {
        submit () {
            this.$refs.pulling.submit()
        },
        queryData (queryset) {
            this.messages = queryset
        }
    },
    components: {
        Pulling
    }
}
</script>

<style scoped>
    .word-break {
       word-break: break-all;
       max-width: 500px;
    }
</style>
