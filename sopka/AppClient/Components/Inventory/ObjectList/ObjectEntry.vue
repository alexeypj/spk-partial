<template>
  <tr @click="select" :class="[{'selected': isSelected}]">
	<td>
		<span>{{ Entry.ObjectName }}</span>
		<div class="fontgray"><small>{{ Entry.ObjectAddress }}</small><span class="pull-right"><small>id:{{ Entry.Id }}</small></span></div>
	</td>
  </tr>
</template>


<script lang="ts" src="./ObjectEntry.ts"></script>
