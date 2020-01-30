<template>
    <div class="col-md-12 userdiv pleft5">
        <div class="ibox float-e-margins">
            <div class="ibox-title newh_ibox">
                <h5>Компании</h5>
                <div class="ibox-tools">
                </div>
            </div>

            <div class="ibox-content minhtablerow btop0 ptop0">
                <div class="row no-margins pleft0">
                    <transition name="fade" v-if="errorText">
                        <div class="alert-danger alert" role="alert" v-if="errorText">
                            {{ errorText }}
                        </div>
                    </transition>
                </div>
                <Datatable :filter="Filter"
                           :columns="columns"
                           :items="List"
                           :totalItems="TotalItems"
                           :applyFilter="applyFilter"
                           :hasSearch="true"
                           :hasFilters="true"
                           :filterOptions="tableFilterOptions"
                           :hasActions="true"
                           >
                    <template class="input-group w100" v-slot:columnActions="{ item }">
                        <select2 :class="['']"
                                 :options="getActions(item)"
                                 @input="(value) => selectorChange(value, item)"
                                 v-model="actionValue"
                                 :allowClear="false"
                                 placeholder="Действия"
                                 :showSearchInput="false" />
                    </template>
                </Datatable>
            </div>

        </div>

        <Modal @cancel="showChangeBalanceForm = false"
               v-if="showChangeBalanceForm"
               :showFooter="false"
               title="Изменение баланса">
            <ChangeBalance slot="body" :CompanyId="selectedCompanyId" @cancel="showChangeBalanceForm = false" @onStore="reload" />
        </Modal>

        <Modal @cancel="showEditForm = false"
               v-if="showEditForm"
               :showFooter="false"
               title="Онлайн версия">
            <EditForm slot="body" :Company="SelectedCompanyToEdit" @cancel="showEditForm = false" @onStore="reload" />
        </Modal>


    </div>
</template>
<script src="./index.ts" lang="ts"></script>