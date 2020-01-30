<template>
    <span >
        <i class="fa fa-check" style="color:green" v-if="Item.IsActive"></i>
        <i class="fa fa-times" style="color:red" v-else></i>
    </span>
</template>
<script lang="ts" src="./IsActiveCell.ts">
</script>