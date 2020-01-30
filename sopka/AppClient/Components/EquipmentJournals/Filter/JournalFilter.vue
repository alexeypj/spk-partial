<template>
    <div class="bordertop pleft5 pright5 ptop5 incfilter">

        <div class="form-check">
            <input type="checkbox" class="form-check-input" id="usePeriod" v-model="model.UsePeriod">
            <label class="form-check-label" for="usePeriod">Период</label>
        </div>        
        <div class="form-group">
            <div class="input-group w100 daterange">
                <div class="col-md-6 pright5 pr0_992">
                    <DatePickRFX v-model="model.DateFrom"
                                 :pickTime="true"
                                 name="DateFrom"
                                 class="vdpComponent-positionRight"
                                 :inputAttributes="dateAttributes">
                    </DatePickRFX>
                </div>
                <div class="col-md-6 pleft5 pleft0_992">
                    <DatePickRFX v-model="model.DateTo"
                                 :pickTime="true"
                                 name="DateTo"
                                 :inputAttributes="dateAttributes">
                    </DatePickRFX>
                </div>
                <span class="text-danger" v-if="showInvalidDateRangeErrorText">Дата конца периода должна быть больше даты начала периода</span>
            </div>
        </div>

        <div class="form-group">
            <label class="font-noraml">Объект</label>
            <div class="input-group w100">
                <select2 data-placeholder="Выбор..." class="chosen-select w100 sel2" tabindex="2"
                         id="ObjectId"
                         v-model="model.ObjectId"
                         :options="Dictionaries.Objects" />
            </div>
        </div>

        <div class="form-group">
            <label class="font-noraml">Тип оборудования</label>
            <div class="input-group w100">
                <select2 data-placeholder="Выбор..." class="chosen-select w100 sel2" tabindex="2"
                         v-model="model.EquipmentTypeId"
                         id="EquipmentTypeId"
                         @input="onEquipmentTypeIdChange"
                         :options="Dictionaries.EquipmentTypes" />
            </div>
        </div>

        <div class="form-group">
            <label class="font-noraml">Аппаратная платформа</label>
            <div class="input-group w100">
                <select2 data-placeholder="Выбор..." class="chosen-select w100 sel2" tabindex="2"
                         v-model="model.PlatformId"
                         :value="model.PlatformId"
                         id="PlatformId"
                         @input="onPlatformIdChange"
                         :options="Dictionaries.Platforms" />
            </div>
        </div>

        <div class="form-group">
            <label class="font-noraml">Оборудования</label>
            <div class="input-group w100">
                <select2 data-placeholder="Выбор..." class="chosen-select w100 sel2" tabindex="2"
                         v-model="model.EquipmentId"
                         id="EquipmentId"
                         :options="Dictionaries.Equipments" />
            </div>
        </div>

        <div class="text-right">
            <button class="btn btn-white mr5 btn-small" type="button" @click="ResetFilter">Сбросить</button>
            <button class="btn btn-success btn-small" type="button" @click="Apply">Применить</button>
        </div>
    </div>
</template>


<script lang="ts" src="./JournalFilter.ts">
</script>
