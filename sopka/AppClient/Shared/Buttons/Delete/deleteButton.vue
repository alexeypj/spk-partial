<template>
    <button :class="className" :disabled="isSaving" @click="onClick($event)">        
        {{ text }}
    </button>
</template>

<script src="./deleteButton.ts" lang="ts">
</script>
