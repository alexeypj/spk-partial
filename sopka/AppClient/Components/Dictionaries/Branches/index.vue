<template>
    <div class="minhtablerow">
        <div class="ibox float-e-margins">
            <div class="ibox-title newh_ibox">
                <h5>Филиал</h5>
                <div class="ibox-tools">
                    <div class="ibox-tools">

                        <a @click="onAddClick"
                           class="btn btn-success btn-outline btn-small"
                           data-toggle="tooltip"
                           title="Добавить новый филиал">
                            <i class="fa fa-plus fa-lg"></i>
                        </a>

                    </div>
                </div>
                <div class="ibox-tools">

                </div>
            </div>

            <Datatable :filter="State.Filter"
                       :columns="columns"
                       :items="State.Items"
                       :totalItems="State.TotalItems"
                       :applyFilter="applyFilter"
                       :showSearch="true"
                       :hasFilters="true"
                       :filterOptions="tableFilterOptions"
                       :hasSearch="true"
                       :hasActions="true">
                <template class="input-group w100" v-slot:columnActions="{ item }">
                    <select2 :class="['']"
                             :options="getActions()"
                             @input="(value) => selectorChange(value, item)"
                             v-model="actionValue"
                             :allowClear="false"
                             placeholder="Действия"
                             :showSearchInput="false" />
                </template>
            </Datatable>

            <div class="alert alert-danger alert-dismissable" v-if="showError">
                {{ this.errorText }}
            </div>


        </div>



        <Modal @cancel="closeModal"
               v-show="showCreateModal"
               okText="Сохранить"
               :showFooter="false"
               :title="modalTitle">
            <EditForm slot="body"
                      @cancel="closeModal"
                      :SaveHandler="onDicSaved"
                      :SelectedObjectType="selectedObjectType"
                      :OnSelectNext="selectNext"
                      :OnSelectPrev="selectPrev" />
        </Modal>

        <Modal @cancel="closeFilterModal"
               v-show="showFilterModal"
               okText="Применить"
               :showFooter="false"
               title="Фильтр">
            <SearchFilter slot="body" @cancel="closeFilterModal" :ApplyFilter="applyAdditionalFilter" :Filter="additionalFilter" />
        </Modal>

    </div>
</template>
<script lang="ts" src="./index.ts"></script>
