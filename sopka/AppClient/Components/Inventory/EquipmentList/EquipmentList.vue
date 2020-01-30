<template>
    <div class="col-sm-12 pleft0">
        <div class="ibox float-e-margins">
            <div class="ibox-title">
				<h5>Список оборудования на объекте</h5>
                <div class="ibox-tools">
                    <div class="ibox-tools">
                        <a v-if="!IsReadonly"
                        @click="addEquipment"
                           class="btn-success btn-outline btn btn-small"
                           data-toggle="tooltip" 
                           title="Добавить новое оборудование">
                            <i class="fa fa-plus fa-lg"></i>                        </a>

                    </div>
                </div>
            </div>
          <Datatable 
            :filter="filter" 
            :columns="columns" 
            :items="EquipmentList" 
            :totalItems="State.EquipmentTotalItems" 
            :applyFilter="applyFilter" 
            :rowClickHandler="selectEquipmentId"
            class="ibox-content-nested inveqlisttable"
            :hasActions="true">
                <template v-slot:columnActions="{ item }" v-if="!IsReadonly">
                    <a @click="remove(item)" title="Удалить оборудование">
                        <i class="fa fa-times fa-lg" style="color:red"></i>
                    </a>
                </template>
          </Datatable>
        </div>
    </div>
</template>

<script lang="ts" src="./EquipmentList.ts"></script>