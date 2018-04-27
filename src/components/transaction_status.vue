<template>
  <div>
    <span class="label success" v-if="transaction.status === 1">{{$t('status.success')}}</span>
    <span class="label danger" v-else-if="transaction.status === 2">{{$t('status.failed')}}</span>
    <span class="label warn" v-else-if="transaction.status === 3">{{$t('status.ongoing')}}</span>
    <span class="label" v-else-if="transaction.status === 4">{{$t('status.cancelled')}}</span>
    <span class="label danger" v-else-if="transaction.status === 5">{{$t('status.declined')}}</span>
    <span class="label blue" v-else-if="transaction.status === 6">{{$t('status.payment_pending')}}</span>
  </div>
</template>
<script>
    export default {
        props: ['transaction']
    }
</script>
