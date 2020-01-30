<template>
    <button :class="className" :disabled="isSaving" @click="$emit('click', $event)">        
        {{ text }}
    </button>
</template>

<script src="./cancelButton.ts" lang="ts">
</script>
