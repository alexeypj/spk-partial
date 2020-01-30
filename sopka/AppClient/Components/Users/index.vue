<template>
    <div class="col-md-12 userdiv pleft5">
        <div class="ibox float-e-margins">
            <div class="ibox-title newh_ibox">
                <h5>Пользователи</h5>
                <div class="ibox-tools" v-if="IsSuperAdminOrPaidAccess">
                    <div class="ibox-tools">
                        <a class="btn btn-success btn-outline btn-small" v-if="IsLimited == false"
                           @click="create"
                           data-toggle="tooltip" 
                           title="Добавить нового пользователя">
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
                    :items="users" 
                    :totalItems="Total" 
                    :hasFilters="true"
                    :filterOptions="tableFilterOptions"
                    :applyFilter="applyFilter"  
                    :rowClickHandler="onUserClick"
                    :hasSearch="true"
                    :hasActions="IsSuperAdminOrPaidAccess">
                        <template class="input-group w100" v-slot:columnActions="{ item }" v-if="IsLimited == false">                        
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
                v-if="SelectedUserId != null"                 
                :showFooter="false"
                title="Пользователь">
                <EditForm slot="body" :UserId="SelectedUserId" @cancel="closeModals" @onStore="reload"/>
            </Modal>     

            <Modal 
                @cancel="showBlocking = false" 
                v-if="showBlocking"                 
                :showFooter="false"
                title="Блокировка пользователя">
                <Blocking slot="body" :UserId="modalUserId" @cancel="showBlocking = false" @onStore="reload"/>
            </Modal>   

            <Modal 
                @cancel="showBlockingInfo = false" 
                v-if="showBlockingInfo"                 
                :showFooter="false"
                title="Информация о блокировке пользователя">
                <Blocking slot="body" :UserId="modalUserId" @cancel="showBlockingInfo = false" ViewOnly="true" />
            </Modal>  

             <Modal 
                @cancel="showResetPassword = false" 
                v-if="showResetPassword"                 
                :showFooter="false"
                title="Сброс пароля">
                <ResetPassword slot="body" :UserId="modalUserId" @cancel="showResetPassword = false" @onStore="reload"/>
            </Modal>          
            
        </div>

    </div>
</template>

<script lang="ts" src="./index.ts">
</script>
