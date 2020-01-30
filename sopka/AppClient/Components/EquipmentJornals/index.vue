
<template>
    <div class="h100">
        <div class="col-md-3 col-sm-4 col-xs-12 bright h100">
            <div class="ibox-content btop0" style="padding: 0">
                <LogActionFilter />
            </div>
        </div>

        <div class="col-md-9 col-sm-8 col-xs-12 pleft0 h100">
            <div class="col-md-12 pright0 pleft0">
                <div class="ibox float-e-margins">
                    <div class="ibox-title newh_ibox">
                        <h5>Журнал действий</h5>
                    </div>

                    <Datatable :filter="Filter"
                               :columns="columns"
                               :items="loadedLogs"
                               :totalItems="TotalItems"
                               :applyFilter="applyFilter"
                               :hasSearch="false"
                               :rowClickHandler="selectLog"
                               :hasFilters="false">
                    </Datatable>
                </div>
            </div>
        </div>

        
    </div>
</template>
<script src="./index.ts" lang="ts"></script>