<template>
    <div class="row" style="margin-bottom: 15px">
        <div class="col-xs-12">
            <div class="pull-right">
                <button class="btn btn-white btn-xs" @click="$emit('selectNext')"><i class="fa fa-arrow-right"></i></button>
            </div>
            <div class="pull-left">
                <button class="btn btn-white btn-xs" @click="$emit('selectPrev')"><i class="fa fa-arrow-left"></i></button>
            </div>
        </div>
    </div>
</template>

<script src="./carousel.ts" lang="ts">
</script>
