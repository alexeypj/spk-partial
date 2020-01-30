<template>
    <div class="col-md-12 userdiv pleft5">
        <div class="ibox float-e-margins">
            <div class="ibox-title newh_ibox">
                <h5>Тарифы</h5>
                <div class="ibox-tools" v-if="IsSuperAdminOrPaidAccess">
                    <div class="ibox-tools">
                        <a class="btn btn-success btn-outline btn-small" 
                           data-toggle="tooltip" 
                           @click="create"
                           title="Добавить тариф">
                            <i class="fa fa-plus fa-lg"></i>
                        </a>

                    </div>
                </div>
                <div class="ibox-tools">                  
                </div>
            </div>

            <div class="ibox-content minhtablerow btop0 ptop0">
                <div class="row no-margins pleft0">
                      <error-text :text="errorText" />           
                </div>                                
                <Datatable 
                    :filter="Filter" 
                    :columns="columns" 
                    :items="tariffs" 
                    :totalItems="Total" 
                    :applyFilter="applyFilter"  
                    :hasSearch="true"
                    :hasActions="IsSuperAdminOrPaidAccess">
                        <template class="input-group w100" v-slot:columnActions="{ item }">                        
                            <select2 :class="['']"
                                     :options="getActions(item)" 
                                     @input="(value) => selectorChange(value, item)" 
                                     v-model="actionValue" 
                                     :allowClear="false"
                                     placeholder="Действия"
                                     :showSearchInput="false"
                                     />
                        </template>
                </Datatable>
            </div>
            
            <Modal 
                @cancel="closeModals" 
                v-if="SelectedTariffId != null"                 
                :showFooter="false"
                title="Тарифф">
                <EditForm slot="body" :TariffId="SelectedTariffId" @cancel="closeModals" @onStore="reload"/>
            </Modal>     
        </div>

    </div>
</template>

<script lang="ts" src="./index.ts">
</script>
