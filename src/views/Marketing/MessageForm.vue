<template>
    <div>
        <div class="m-b">
            <ol class="breadcrumb">
                <li class="active"><router-link to="/messages">{{ $t('nav.message') }}</router-link></li>
                <li class="active">{{ $route.meta.title }}</li>
            </ol>
        </div>
        <div class="box">
            <div class="box-body">
                <form class="form m-a" v-on:submit.prevent="onSubmit">
                    <div class="row">
                        <div class="col-xs-12">
                            <div class="form-group">
                                <label  class="label-width">{{ $t('messages.title') }}</label>
                                <div class="inline-form-control">
                                    <input type="text" class="form-control" placeholder="标题不能超过100个字节" v-model="message.title" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label  class="label-width">{{ $t('messages.receiver') }}</label>
                                <div class="inline-form-control">
                                    <input  type="text" class="form-control" @blur='checkMemberHandler' v-model="message.receiver" :disabled="!(!message.member_level)">
                                </div>
                                <label class="text-danger m-l">  * 接收人或群发只能选择一个，接收人可以同时填写多个（以英文 "," 隔开）</label>
                            </div>
                            <div class="form-group">
                                <label  class="label-width">{{ $t('messages.members') }} </label>
                                <div class="inline-form-control">
                                    <selector-member-level :level="message.member_level" :disabled="!(!message.receiver)" @level-choose="changeFromLevel"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-6">
                            <div class="form-group">
                                <label  class="label-width">{{ $t('messages.text') }} </label>
                                <textarea v-model="message.content" class="form-control" rows="3" placeholder="内容不能超过500个字节" required></textarea>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="alert alert-danger" v-if="errorMsg">
                            <span>{{ errorMsg }}</span>
                        </div>
                        <button type="submit" class="md-btn w-sm blue">{{ $t('common.send') }}</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
<script>
    import api from '../../api'
    import { checkMember } from '../../service'
    import SelectorMemberLevel from '../../components/SelectorMemberLevel'

    export default {
        data () {
            return {
                message: {
                    id: '',
                    content: '',
                    receiver: '',
                    sent_at: '',
                    title: '',
                    member_level: ''
                },
                errorMsg: '',
                checkMembers: false
            }
        },
        methods: {
            onSubmit (e) {
                if (this.message.member_level || this.message.receiver) {
                    if (this.message.receiver && !this.checkMembers) {
                        this.checkMemberHandler()
                        return
                    }
                    this.$http.post(api.setting.message, this.message).then(() => {
                        this.$router.push('/messages/')
                    }, error => {
                        this.errorMsg = error
                    })
                } else {
                    this.errorMsg = '群发或接收人必须填写一个'
                }
            },
            checkMemberHandler () {
                this.errorMsg = ''
                if (this.message.receiver) {
                    checkMember({ username: this.message.receiver }).then(data => {
                        this.checkMembers = (data.length === 0)
                        this.errorMsg = data.length > 0 && `${data.join(',')} 会员名输入有误，请从新填写`
                    }, error => {
                        this.errorMsg = error
                        this.checkMembers = false
                    })
                }
            },
            changeFromLevel (val, index) {
                this.message.member_level = val
            }
        },
        components: {
            SelectorMemberLevel
        }
    }

</script>
