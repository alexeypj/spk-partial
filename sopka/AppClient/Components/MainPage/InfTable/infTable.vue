<template>
    <div class="col-sm-6 h100 pleft0" style="display: flex;flex-direction: column;">
        <div class="startlefttop">
            <div class="start_block" style="border: 1px solid #ccc;">
                <div class="pull-left fa25x"><i class="menu-objects-start"></i>&nbsp;<router-link to="/Inventory" title="Объекты">Объекты</router-link></div>
                <div class="pull-right fa25x"><span title="Всего">{{ objectsTotal }} </span>/ <span title="С инцидентами"> {{ objectIncidents }}</span></div>
            </div>
            <div class="start_block" style="border: 1px solid #ccc;border-top: 0;border-bottom: 0;" v-if="DisplayEquipments">
                <div class="pull-left fa25x"><i class="menu-equip-start"></i>&nbsp;<router-link to="/Equipment" title="Оборудование">Оборудование</router-link></div>
                <div class="pull-right fa25x"><span title="Всего">{{ equipmentTotal }} </span>/ <span title="С инцидентами">{{ equipmentIncidents }}</span></div>
            </div>
            <div class="start_block" style="border: 1px solid #ccc;border-bottom: 0;">
                <div class="pull-left fa25x"><i class="fa fa-crosshairs"> </i>&nbsp; <router-link to="/Incident" title="Инциденты">Инциденты</router-link></div>
                <div class="pull-right fa25x"><span title="Всего">{{ incidentsTotal}} </span>/ <span title="Открытые">{{ openIncidents }}</span></div>
            </div>
            <div class="start_block_sm" style="display:flex;border: 1px solid #ccc;border-top: 0;border-bottom: 0;">
                <div class="fa-2x inc"><i class="fa fa fa-crosshairs" style="color:orange; margin-right:5px;"></i>открыто </div><div class="fa-2x w3d text-right">{{ openIncidents }}</div>
            </div>
            <div class="start_block_sm" style="border: 1px solid #ccc;border-top: 0;border-bottom: 0;"><div class="fa-2x inc"><i class="fa fa fa-crosshairs" style="color:red;margin-right:5px;"></i>критичные </div><div class="fa-2x w3d text-right">{{ criticalIncidents }}</div></div>
            <div class="start_block_sm" style="border: 1px solid #ccc;border-top: 0;"><div class="fa-2x inc"><i class="fa fa fa-crosshairs" style="color:darkblue;margin-right:5px;"></i>не взято в работу </div><div class="fa-2x w3d text-right">{{ newIncidents }}</div></div>
        </div>
        <div style="width: 100%;text-align: center; margin-top:10px;border: 1px solid #ddd;">
<!--            <img src="/img/stat.png" style="width:100%;margin-bottom: 10px;">-->
            <Charts />
        </div>
    </div>
</template>

<script lang="ts" src="./infTable.ts"></script>