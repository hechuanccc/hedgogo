<template>
    <div>
        <div class="m-b" >
            <router-link tag="button" class="md-btn blue w-sm" to="/messages/add">{{$t('nav.add_message')}}</router-link>
        </div>

        <div class="box">
            <table st-table="rowCollectionBasic" class="table table-striped">
                <thead>
                <tr>
                    <th>{{$t('messages.number')}}</th>
                    <th>{{$t('messages.title')}}</th>
                    <th>{{$t('messages.receiver')}}</th>
                    <th>{{$t('messages.time')}}</th>
                    <th>{{$t('messages.text')}}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="message in messages" >
                    <td>{{message.id}}</td>
                    <td><router-link :to="'/messages/'+ message.id">{{message.title}}</router-link></td>
                    <td>{{message.receiver}}</td>
                    <td>{{message.sent_at | moment("YYYY-MM-DD HH:mm")}}</td>
                    <td class="word-break">{{message.content}}</td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="row m-b-lg">
            <pulling :queryset="messages" :api="messageApi" :query="query" ref="pulling" @query-data="queryData" @query-param="queryParam"></pulling>
        </div>
    </div>
</template>
<script>
import api from '../../api'
import pulling from '../../components/pulling'
export default {
    data () {
        return {
            messageApi: api.messages,
            messages: [{}],
            query: {}
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
        },
        queryParam (query) {
            this.query = query
        }
    },
    components: {
        pulling
    }
}
</script>

<style scoped>
    .word-break {
       word-break: break-all;
       max-width: 500px;
    }
</style>
