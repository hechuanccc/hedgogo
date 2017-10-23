<template>
    <div class="box  ">
        <div class="box-body">
            <form class="form m-a" v-on:submit.prevent="onSubmit" enctype="multipart/form-data">
                <div class="row b-b p-b m-b">
                    <div class="col-md-9 ">
                        <div>
                            <div class="form-group">
                                <label  class="label-width col-xs-1">{{$t('manage.name')}} </label>
                                <div class="inline-form-control">
                                    <input class="form-control" placeholder="Name" v-model="website.name" required/>
                                </div>
                            </div>
                            <div class="form-group">
                                <label  class="label-width col-xs-1">{{$t('manage.second_name')}} </label>
                                <div class="inline-form-control">
                                    <input class="form-control" placeholder="Name" v-model="website.second_name" required/>
                                </div>
                            </div>
                            <div class="form-group">
                                <label  class="label-width col-xs-1">{{$t('manage.logo')}}</label>
                                <div class="inline-form-control" v-if="!hasImage">
                                    <img :src="website.icon" width="60">
                                </div>
                                <div class="inline-form-control">
                                    <input type="file" class="form-control" accept="image/*" @change="syncImg">
                                </div>
                            </div>
                            <div class="form-group ">
                                <label class="col-xs-1  label-width">{{$t('manage.description')}} </label>
                                <div class="inline-form-control col-md-10 website-text">
                                    <textarea class="form-control" rows="6" placeholder="" required v-model="website.description"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="m-t">
                    <div class="alert alert-danger" v-if="responseError">{{responseError}}</div>
                    <div class="alert alert-success" v-if="statusUpdated">{{$t('agent.status_update')}}</div>
                    <button type="" class="md-btn w-sm blue">{{$t('common.save')}}</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
    import api from '../../api'
    export default {
        data () {
            return {
                website: {
                    id: '',
                    name: '',
                    icon: [],
                    description: '',
                    second_name: ''
                },
                hasImage: false,
                statusUpdated: false,
                responseError: ''
            }
        },
        created () {
            this.getWebsite()
        },
        watch: {
            statusUpdated (newObj, old) {
                setTimeout(() => {
                    this.statusUpdated = false
                }, 2500)
            },
            responseError (newObj, old) {
                setTimeout(() => {
                    this.statusUpdated = false
                }, 2500)
            }
        },
        methods: {
            getWebsite () {
                this.$http.get(api.website).then(response => {
                    this.website = Object.assign(this.website, response.data)
                })
            },
            syncImg (e) {
                this.website.icon = e.target.files[0]
                this.hasImage = true
            },
            onSubmit (e) {
                let formData = new window.FormData()
                formData.append('name', this.website.name)
                formData.append('description', this.website.description)
                formData.append('second_name', this.website.second_name)
                if (this.hasImage) {
                    formData.append('icon', this.website.icon)
                }
                this.$http.put(api.website, formData).then(response => {
                    if (response.status === 200) {
                        this.website = Object.assign(this.website, response.data)
                        this.responseError = ''
                        this.statusUpdated = true
                    }
                }, response => {
                    this.responseError = response.data.error[0].icon
                })
            }
        }
    }
</script>

<style>
    .row .website-text{
        padding:0
    }
</style>
