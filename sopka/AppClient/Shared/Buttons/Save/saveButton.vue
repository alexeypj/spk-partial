<template>
    <button :class="className" :disabled="isSaving" @click="$emit('click', $event)">        
        <template v-if="isSaving">
            <i class="fa fa-spinner fa-spin fa-fw"></i>
            {{ disabledText}}
        </template>
        <template v-else>
            {{ enabledText }}
        </template>
    </button>
</template>

<script src="./saveButton.ts" lang="ts">
</script>
