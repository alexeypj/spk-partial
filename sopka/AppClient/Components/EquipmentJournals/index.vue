
<template>
    <div class="h100">
        <div class="col-md-3 col-xs-4 bright h100">
            <div class="ibox-content btop0" style="padding: 0">
                <JournalFilter />
            </div>
        </div>

        <div class="col-md-9 col-xs-8 pleft0 h100">
            <div class="col-md-12 pright0 pleft0">
                <div class="ibox float-e-margins">
                    <div class="ibox-title newh_ibox">
                        <h5>Журнал оборудования</h5>
                        <div class="mtop10">
                            <router-link class="btn btn-white mbo" :to="{path: '/EquipmentLogs'}">
                                Настроить правила
                            </router-link>
                            <!--<a data-toggle="tooltip" title="Добавить новое оборудование" class="btn-success btn-outline btn btn-small mbo">
                                <i class="fa fa-plus fa-lg"></i>
                            </a>-->
                        </div>
                    </div>

                    <Datatable :filter="Filter"
                               :columns="columns"
                               :items="loadedLogs"
                               :totalItems="TotalItems"
                               :applyFilter="applyFilter"
                               :rowClickHandler="selectLog"
                               :hasSearch="false"
                               :hasFilters="false">
                    </Datatable>

                    <div class="ibox-content" v-if="SelectedLog">
                        <p class="form-control-static"  style="white-space: pre-line" >
                            {{ SelectedLog.Description }}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        
    </div>
</template>
<script src="./index.ts" lang="ts"></script>