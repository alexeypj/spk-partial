<template>
  <tr @click="select" :class="[{'selected': isSelected}]">
    <td>
		<span :title="Entry.Name">{{Entry.Name}}</span>{{ Entry.Platform }}
        <div class="fontgray"><small>{{ Entry.ObjectAddress }}</small> <span class="pull-right"><small>id:{{ Entry.Id }}</small></span></div>
    </td>
  </tr>
</template>


<script lang="ts" src="./EquipmentEntry.ts">
</script>
