<template>
    <span>
        {{ Item.IsBlockText }}
        <i class="fa fa-times" style="color:red" v-if="Item.IsBlock"></i>
        <i class="fa fa-check" style="color:green" v-else></i>
    </span>
</template>
<script lang="ts" src="./IsBlockCell.ts">
</script>