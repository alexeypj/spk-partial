<template>
    <span >
        <i class="fa fa-check" style="color:green" v-if="Item.Support"></i>
        <i class="fa fa-times" style="color:red" v-else></i>
    </span>
</template>
<script lang="ts" src="./SupportCell.ts">
</script>