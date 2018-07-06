<template>
<div>
    <div class="box p-a">
        <div class="row m-t">
            <label class="m-l-sm col-xs-2">{{ $t('manage.agent_joining_agreement') }} </label>
        </div>
        <div class="row m-t-xs">
            <div class="col-md-12">
                <textarea
                    style="width: 930px;"
                    rows="40"
                    class="m-l form-control"
                    v-model="websiteAgreement"
                    :disabled="!updateWebsiteManagementPermission"
                >
                </textarea>
            </div>
        </div>
        <div class="row p-b m-t">
            <div class="col-md-12" v-if="updateWebsiteManagementPermission">
                <button
                    type="button"
                    class="m-l md-btn w-sm blue m-r-sm"
                    @click="updateWebsiteAgreement"
                    :disabled="!updateWebsiteManagementPermission"
                >
                    <span v-if="!websiteAgreementLoading">{{$t('common.save')}}</span>
                    <i class="fa fa-spin fa-spinner" v-else></i>
                </button>
            </div>
        </div>
    </div>
</div>
</template>
<script>
import {
    getSetting,
    updateWebsite
} from '../../service'
import $ from '../../utils/util'

export default {
    data () {
        return {
            websiteAgreementLoading: false,
            websiteAgreement: ''
        }
    },
    computed: {
        updateWebsiteManagementPermission () {
            return this.$root.permissions.includes('update_website_management')
        }
    },
    async created () {
        this.websiteAgreement = await getSetting('websiteAgreement').then(data => data.description)
    },
    methods: {
        updateWebsiteAgreement () {
            this.websiteAgreementLoading = true

            updateWebsite('websiteAgreement', {
                description: this.websiteAgreement
            }).then(data => {
                this.websiteAgreement = data.description
                $.notify({
                    message: this.$t('action.update') + this.$t('status.success')
                })
                this.websiteAgreementLoading = false
            }, error => {
                $.notify({
                    message: error,
                    type: 'danger'
                })
                this.websiteAgreementLoading = false
            })
        }
    }
}
</script>

