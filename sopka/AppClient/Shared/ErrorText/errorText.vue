<template>
    <transition name="fade">
        <div class="row" v-if="text">
            <div class="pull-left col-xs-12 alert alert-danger" role="alert">
                Ошибка: {{ text }}
            </div>
        </div>
    </transition>   
</template>

<script src="./errorText.ts" lang="ts">
</script>

 