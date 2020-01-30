<template>
  <Datatable :filter="filter"
            :columns="columns"
            :items="history"
            :totalItems="totalItems"
            :hasFilters="false"
            :applyFilter="fetchHistory"
            :hasSearch="true"
            :hasActions="false">      
    </Datatable>
    <!-- <table class="table datatable historytable">
        <thead>
            <tr>
                <th>Поле</th>
                <th>Новое значение</th>
                <th>Старое значение</th>
                <th @click="changeSortDirection">
                    <i class="fa fa-sort-desc" aria-hidden="true" v-if="sortDirection == 'desc'"></i>
                    <i class="fa fa-sort-asc" aria-hidden="true" v-else></i>
                    Дата изменения 
                </th>
                <th>Кто поменял</th>
                <th>Комментарий</th>
            </tr>
        </thead>
        <tbody>
            <template v-for="record in localHistory" >
                <!-- в зависимости от типа сортировки пишем историю изменений внутри статуса либо до самого статуса, либо после -->
                <!-- <template v-if="sortDirection == 'desc'">
                    <tr v-for="fieldRecord in record.FieldHistory" :key="'fieldRecord_' + fieldRecord.Id">
                        <td>{{ getFieldName(fieldRecord.FieldName) }}</td>
                        <td>{{ getFieldValue(fieldRecord.FieldName, fieldRecord.NewVal) }}</td>
                        <td class="crossed">{{ getFieldValue(fieldRecord.FieldName, fieldRecord.OldVal) }}</td>
                        <td>{{ dateFormat(fieldRecord.ChangeDate) }}</td> 
                        <td>{{ getUser(fieldRecord.IdUser) }}</td>
                        <td>&nbsp;</td>
                    </tr>
                </template>

                <tr :key="'incidentHistory_' + record.Id">
                    <td>Статус</td>
                    <td>{{ getStatusName(record.NewStatusId) }}</td>
                    <td class="crossed">{{ getStatusName(record.OldStatusId) }}</td>
                    <td>{{ dateFormat(record.ChangeTime) }}</td>
                    <td>{{ getUser(record.IdUser) }}</td>
                    <td>{{ record.NewComment }}</td>
                </tr>

                <template v-if="sortDirection == 'asc'">
                    <tr v-for="fieldRecord in record.FieldHistory" :key="'fieldRecord_' + fieldRecord.Id">
                        <td>{{ getFieldName(fieldRecord.FieldName) }}</td>
                        <td>{{ getFieldValue(fieldRecord.FieldName, fieldRecord.NewVal) }}</td>
                        <td class="crossed">{{ getFieldValue(fieldRecord.FieldName, fieldRecord.OldVal) }}</td>
                        <td>{{ dateFormat(fieldRecord.ChangeDate) }}</td> 
                        <td>{{ getUser(fieldRecord.IdUser) }}</td>
                        <td>&nbsp;</td>
                    </tr>
                </template>
            </template>
        </tbody>
    </table>     -->
</template>

<script src="./history.ts" lang="ts">
</script>

<style scoped>
    .crossed {
        text-decoration: line-through;
    }
</style>
