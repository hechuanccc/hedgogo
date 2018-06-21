<template>
    <div class="bg-auto w-full">
    <div class="text-center p-y-md">
        <h1 class="text-shadow text-blue text-4x">
            <span class="text-2x font-bold block m-t-lg">{{ $route.query.status || 'ERROR' }}</span>
        </h1>
        <p class="h5 m-y-lg text-u-c font-bold">{{ $t('system_msg.error_occurred') }}</p>
        <p>
            Thanks!
        </p>
        <button class="m-t-lg md-btn w-sm blue" @click="$router.go(-2)"><i class="fa fa-long-arrow-left"></i> {{ $t('system.back_page') }}</button>
    </div>
    </div>
</template>
<script>

</script>
