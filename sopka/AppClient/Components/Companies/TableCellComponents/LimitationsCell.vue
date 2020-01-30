<template>
    <span class="w100 pright15 d-block">
        Пользователи <span class="text-right pull-right">{{ Item.UsersCount }}</span>
        <br />
        Объекты <span class="text-right pull-right">{{ Item.ObjectsCount }}</span>
        <br />
        Оборудование <span class="text-right pull-right">{{ Item.EquipmentsCount }}</span>
    </span>
</template>
<script lang="ts" src="./LimitationsCell.ts">
</script>