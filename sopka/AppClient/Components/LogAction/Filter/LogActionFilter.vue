<template>
    <div class="bordertop pleft5 pright5 ptop5 incfilter">

        <div class="checkbox">
            <label class="font-noraml">
                <input type="checkbox" v-model="model.UsePeriod"> Период
            </label>
        </div>

        <div class="form-group">
            <div class="input-group w100 daterange">
                <div class="col-md-6">
                    <DatePickRFX v-model="model.DateFrom"
                                 :pickTime="true"
                                 class="vdpComponent-positionRight"
                                 :inputAttributes="dateAttributes">
                    </DatePickRFX>
                </div>
                <div class="col-md-6">
                    <DatePickRFX v-model="model.DateTo"
                                 :pickTime="true"
                                 :inputAttributes="dateAttributes">
                    </DatePickRFX>
                </div>
            </div>
        </div>

        <div class="form-group">
            <label class="font-noraml">Пользователь</label>
            <div class="input-group w100">
                <select2 data-placeholder="Выбор..." class="chosen-select w100 sel2" tabindex="2"
                         :options="Dictionaries.Users"
                         v-model="model.UserId" />
            </div>
        </div>

        <div class="form-group">
            <label class="font-noraml">Действие</label>
            <div class="input-group w100">
                <select2 data-placeholder="Выбор..." class="chosen-select w100 sel2" tabindex="2"
                         v-model="model.ActionName"
                         :options="Dictionaries.Actions" />
            </div>
        </div>

        <div class="form-group">
            <label class="font-noraml">Сессия</label>
            <div class="input-group w100">
                <input v-model="model.SessionId" class="input-sm form-control w100" placeholder="Номер сессии" />
            </div>
        </div>

        <div class="text-right">
            <button class="btn btn-white mr5 btn-small" type="button" @click="ResetFilter">Сбросить</button>
            <button class="btn btn-success btn-small" type="button" @click="Apply">Применить</button>
        </div>
    </div>
</template>


<script lang="ts" src="./LogActionFilter.ts">
</script>
