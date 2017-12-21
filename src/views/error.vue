<template>
    <div class="bg-auto w-full">
    <div class="text-center p-y-md">
        <h1 class="text-shadow text-blue text-4x">
            <span class="text-2x font-bold block m-t-lg">500</span>
        </h1>
        <p class="h5 m-y-lg text-u-c font-bold">Don't worry, we will fix it soon.</p>
        <p>
            Thanks!
        </p>
        <button class="md-btn w-sm blue" @click="$router.go(-1)"><i class="fa fa-repeat"></i> {{ $t('action.back_page') }}</button>
    </div>
    </div>
</template>
<script>

</script>
