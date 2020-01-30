<template>
     <div class="h100">
        <div class="col-md-3 col-sm-4 col-xs-12 bright h100">
            <div class="ibox float-e-margins ">
                <div class="ibox-title mb5">
                    <h5>Правила обработки журналов</h5>
                    <div style="text-align:right" class="float-right" v-if="isFilters">
                        <a @click="create" class="btn btn-small btn-success btn-outline" data-toggle="tooltip" v-if="showForm" title="Добавить новое правило">
                            <i class="fa fa-plus fa-lg"></i>
                        </a>             
                        <template v-if="isFilters">
                            <button class="btn btn-white btn-small" type="button" @click="showRules">
                                <i class="fa fa-filter fa-lg" title="Скрыть фильтры"></i>
                            </button>
                        </template>
                        <template v-else>
                            <button class="btn btn-white btn-small" type="button" @click="showFilters">
                                <i class="fa fa-filter fa-lg" title="Показать фильтры"></i>
                            </button>
                        </template>
                    </div>    
                </div>				
                <div class="ibox-content">                                        
                    <template v-if="isFilters">                   
                        <div class="form-group">
                            <label class="font-noraml">Название</label>
                            <div class="input-group w100">
                               <input type="text" class="form-control" v-model="filter.Name" /> 
                            </div>
                        </div>                       
                        <div class="text-right">
                            <button class="btn btn-white mr5 btn-small" type="button" @click="resetFilter">Сбросить</button>
                            <button class="btn btn-success btn-small" type="button" @click="applyFilter(filter)">Применить</button>
                        </div>                    
                    </template>
                    <template v-else>      
                        
                    </template>            
                </div>
            </div>
        </div>
        <div class="col-md-9 col-sm-8 col-xs-12 pleft0 bright h100">            
			<div class="ibox float-e-margins">
                <div class="ibox-title newh_ibox">
                    <h5 v-if="model && model.Id != 0"> 
                        {{ model.Name }}
                    </h5>
                    <h5 v-if="model && model.Id == 0">
                        Новое правило
                    </h5>
                    <div class="equip_btn_r21" v-if="IsSuperAdminOrPaidAccess">
                        <div class="pull-right">
                            <!-- <button class="btn btn-danger pull-left mr5" @click="$emit('remove')" :disabled="State.IsObjectSaving" v-if="!readonly && SelectedObjectId">Удалить</button> -->
                            <template v-if="model">
                                <cancel-button className="btn btn-white" @click="cancel" v-if="!readonly && model.Id != 0" :isSaving="IsSaving"/>                                
                                <cancel-button className="btn btn-white" @click="close" v-if="readonly || model.Id == 0" :isSaving="IsSaving"/>
                                <button type="button" class="btn btn-success mr5" @click="edit" v-if="readonly">Редактировать</button>
                                <save-button className="btn btn-success mr5" @click="$emit('store')" v-if="!readonly" :isSaving="IsSaving" />                                
                                &nbsp; 
                            </template>
                            <a @click="create" class="btn btn-small btn-success btn-outline" data-toggle="tooltip" v-if="!showForm" 
                                title="Добавить новое правило">
                                    <i class="fa fa-plus fa-lg"></i>
                            </a>                          
                        </div>
                    </div>                   
                </div>               			
                    <Rule v-if="showForm"   
                        :Model="model" 
                        :key="'model_' + model.Id"     
                        @stored="onStore"            
                    />              
                    <Datatable v-else
                        :filter="filter"
                        :items="rules"
                        :totalItems="RulesCount"
                        :applyFilter="applyFilter"
                        :hasSearch="true"
                        :columns="columns"
                        :hasActions="IsSuperAdminOrPaidAccess">
                            <template class="input-group w100" v-slot:columnActions="{ item }">                        
                                <select2 :class="['col-md-6']"
                                    :options="getActions(item)" 
                                    @input="(value) => selectorChange(value, item)" 
                                    v-model="actionValue" 
                                    :allowClear="false"
                                    :showSearchInput="false"
                                />
                            </template>
                    </Datatable>                                            
            </div>        
        </div>
    </div>   
</template>

<script src="./EquipmentLogs.ts" lang="ts">
</script>
