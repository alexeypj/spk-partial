<template>
    <span>
        <a :href="Item.EntityUrl" target="_blank" v-if="Item.EntityUrl">{{ Item.EntityTitle || Item.Entity }}</a>
    </span>
</template>
<script lang="ts" src="./logEntityCell.ts">
</script>