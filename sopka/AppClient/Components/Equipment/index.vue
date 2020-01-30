<template>
    <div class="h100">

        <div class="col-md-3 col-sm-4 col-xs-12 bright h100">
            <div class="ibox float-e-margins">
                <!--<div class="ibox-title">
                    <h5>Фильтры</h5>
                    <div class="ibox-tools">

                        <ul class="dropdown-menu dropdown-user">
                            <li>
                                <a href="#">Config option 1</a>
                            </li>
                            <li>
                                <a href="#">Config option 2</a>
                            </li>
                        </ul>

                    </div>
                </div>-->
				<div class="ibox-content btop0" v-if="showFilters" style="padding: 0">
					<div class="ibox-title mb5" v-if="showHideFiltersBtn">
						<h5>Оборудование</h5>
						<div style="text-align:right" class="float-right">
							<button class="btn btn-white btn-small" type="button" @click="closeFilters"><i class="fa fa-filter fa-lg" title="Скрыть фильтры"></i></button>
							<a @click="addEquipment" class="btn-success btn-outline btn btn-small mb0" title="Добавить новое оборудование" 
                               v-if="IsSuperAdminOrPaidAccess">
								<i class="fa fa-plus fa-lg"></i>
							</a>
						</div>
					</div>

					<form class="form-horizontal bordertop pleft5 pright5 ptop5">
						<div class="form-group ml0 mr0">
							<label class="font-noraml w100">Объект</label>
							<div class="col-lg-12 pleft0 pright0">
								<select2 v-model="filter.ObjectId" data-placeholder="Выбор..."
										 class="form-control"
										 :options="Dictionaries.Objects" />
							</div>
						</div>
						<div class="form-group ml0 mr0" >
							<label class="font-noraml w100">Тип оборудования</label>
							<div class="col-lg-12 pleft0 pright0">
								<select2 v-model="filter.TypeId" data-placeholder="Выбор..."
										 class="form-control"
										 :options="Dictionaries.DeviceTypes" />
							</div>
						</div>
						<div class="form-group ml0 mr0" >
							<label class="font-noraml w100">Аппаратная платформа</label>
							<div class="col-lg-12 pleft0 pright0">
								<select2 v-model="filter.PlatformId" class="form-control" data-placeholder="Выбор..."
										 :options="Dictionaries.Platforms" />
							</div>
						</div>
						<div class="form-group ml0 mr0">
							<label class="font-noraml w100">Процессор</label>
							<div class="col-lg-12 pleft0 pright0">
								<select2 v-model="filter.CPUId"
										 class="form-control"
										 data-placeholder="Выбор..."
										 :options="Dictionaries.CPU" />
							</div>
						</div>

						<div class="form-group ml0 mr0">
							<label class="font-noraml w100">Память</label>
							<div class="col-lg-12 pleft0 pright0">
								<select2 v-model="filter.MemoryId"
										 class="form-control"
										 data-placeholder="Выбор..."
										 :options="memoryDict" />
							</div>
						</div>

						<div class="form-group ml0 mr0">
							<label class="font-noraml w100">Диск</label>
							<div class="col-lg-12 pleft0 pright0">
								<select2 v-model="filter.HDDId"
										 class="form-control"
										 data-placeholder="Выбор..."
										 :options="hddDict" />
							</div>
						</div>

						<div class="form-group ml0 mr0">
							<label class="font-noraml w100">Сетевой адаптер</label>
							<div class="col-lg-12 pleft0 pright0">
								<select2 v-model="filter.NetworkAdapterId"
										 class="form-control"
										 data-placeholder="Выбор..."
										 :options="networkAdaptersDict" />
							</div>
						</div>

						<div class="form-group ml0 mr0">
							<label class="font-noraml w100">Системное ПО</label>
							<div class="col-lg-12 pleft0 pright0">
								<select2 v-model="filter.OperationSystemId"
										 class="form-control"
										 data-placeholder="Выбор..."
										 :options="Dictionaries.OS" />
							</div>
						</div>

						<div class="form-group ml0 mr0">
							<label class="font-noraml w100">Прикладное ПО</label>
							<div class="col-lg-12 pleft0 pright0">
								<select2 v-model="filter.SoftwareId"
										 class="form-control"
										 data-placeholder="Выбор..."
										 :options="Dictionaries.Software" />
							</div>
						</div>

					</form>
					<div class="text-right pright5">
						<button class="btn btn-white mr5 btn-small" type="button" @click="resetFilter">Сбросить</button>
						<button class="btn btn-success btn-small" type="button" @click="applyFilter(filter)">Применить</button>
					</div>
				</div>
				<div class="ibox" v-else style="padding: 0">
					<div class="ibox-title mb5"><h5>Оборудование</h5>
						<div style="text-align:right" class="float-right">
							<button class="btn btn-white btn-small" type="button" @click="openFilters"><i class="fa fa-filter fa-lg" title="Показать фильтры"></i></button>
							<a @click="addEquipment" class="btn-success btn-outline btn btn-small mb0" title="Добавить новое оборудование" 
                               v-if="IsSuperAdminOrPaidAccess">
								<i class="fa fa-plus fa-lg"></i>
							</a>
						</div>
					</div>						
					<div class="ibox-content btop0" style="padding: 0">
						<div class="table-responsive eqtable">
							<table class="table">
								<tbody>
									<EquipmentEntry v-for="entry in Equipments" :key="entry.Id" :Entry="entry"
													:ClickHandler="openEquipment"
													:SelectedId="selectedEquipmentId" />
								</tbody>
							</table>
						</div>
					</div>
   
					<!--<div class="pleft5 pright5"><button class="btn btn-white btn-small" style="width:100%" type="button" @click="openFilters">Посмотреть фильтры </button></div>-->
				</div>
            </div>
        </div>

        <div class="col-md-9 col-sm-8 col-xs-12 pleft0 bright h100">
            <div class="ibox float-e-margins" v-if="!showingEquipment">
                <div class="ibox-title newh_ibox">
                    <h5>
						<template v-if="!showingEquipment || Equipment == null || Equipment.Name == ''">
							Оборудование
						</template>
						<template v-else>
							{{ Equipment.Name }}
						</template>
					</h5>
					<div class="ibox-tools">
						<a @click="addEquipment"
                           class="btn-success btn-outline btn btn-small mbo"
                           data-toggle="tooltip" 
                           title="Добавить новое оборудование" v-if="IsSuperAdminOrPaidAccess">
							<i class="fa fa-plus fa-lg"></i>
						</a>
					</div>
                </div>              				
				<template v-if="!showingEquipment">

					<Datatable :filter="filter"
						:hasSearch="true"
						:columns="columns"
						:items="Equipments"
						:totalItems="State.EquipmentTotalItems"
						:applyFilter="applyFilter"
						:rowClickHandler="openEquipment"
						:hasFilters="true"							
						:filterOptions="tableFilterOptions"
                        class="pright15 eqlisttable"
					/>
				</template>
			
            </div>

            <EquipmentDetails 
                v-if="showingEquipment" 
                :Id="selectedEquipmentId" 
                :ObjectId="filter.ObjectId"						
                :Readonly="selectedEquipmentId != 0"
                :key="selectedEquipmentId"
                @cancelEdit="cancelEquipment"
                @store="onStore"
                @removed="onRemove"
            />                  
        </div>
        <!-- <EquipmentDetails /> -->

    </div>


    
</template>

<script lang="ts" src="./index.ts">
</script>
