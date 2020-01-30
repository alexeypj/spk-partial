<template>
    <transition name="fade"> <!-- чтобы анимация сработало, должно быть без v-if="isSaved || errorText" -->
        <div class="pull-right alert alert-success alertsave eq_div" role="alert" v-if="isSaved">
            Сохранено
        </div>
        <div class="pull-right alert alert-danger alertsave eq_div" role="alert" v-if="errorText">
            {{ errorText }}
        </div>
    </transition>    
</template>

<script src="./requestResultAlert.ts" lang="ts">
</script>
