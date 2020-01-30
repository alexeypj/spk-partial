<template>
    <div>
        <div class="checkbox">
            <label class="font-noraml">
                <input type="checkbox" v-model="model.UseCreateDate"> Период
            </label>
        </div>      

        <div class="form-group">            
            <div class="input-group w100 daterange">
                <div class="col-md-6">
                    <DatePickRFX v-model="model.CreateDateFrom"
                                 :pickTime="true"
                                 :inputAttributes="dateAttributes">
                    </DatePickRFX>
                </div>
                <div class="col-md-6">
                    <DatePickRFX v-model="model.CreateDateTo"
                                 :pickTime="true"
                                 :inputAttributes="dateAttributes">
                    </DatePickRFX>
                </div>
            </div>
        </div>

        <div class="form-group">
            <label class="font-noraml">Статус</label>
            <div class="input-group w100">
                <select2 class="chosen-select w100"
                    id="status"
                    :options="Statuses"
                    data-placeholder="Выбор..."
                    name="Status"
                    v-model="model.Status" 
                />
            </div>
        </div>

        <div class="form-group">
            <label class="font-noraml">Страны</label>
            <div class="input-group w100">
                 <select2 class="chosen-select w100"
                    id="country"
                    :options="Dictionaries.Countries"
                    :multiple="true"
                    data-placeholder="Выбор..."
                    name="Country"
                    v-model="model.Countries" 
                />
            </div>
        </div>

        <div class="form-group">
            <label class="font-noraml">Нормативная документация</label>
            <div class="input-group w100">
                 <select2 class="chosen-select w100"
                    id="regulations"
                    :options="Dictionaries.Regulations"
                    :multiple="true"
                    data-placeholder="Выбор..."
                    name="Regulations"
                    v-model="model.Regulations" 
                />
            </div>
        </div>

        <div class="form-group">
            <label class="font-noraml">Производители</label>
            <div class="input-group w100">
                <select2 class="chosen-select w100"
                    id="manufacturers"
                    :options="Dictionaries.Manufacturers"
                    :multiple="true"
                    data-placeholder="Выбор..."
                    name="manufacturers"
                    v-model="model.Manufacturers" 
                />
            </div>
        </div>

        <div class="form-group">
            <label class="font-noraml">Исследования</label>
            <div class="input-group w100">
                <select2 class="chosen-select w100"
                    id="research"
                    :options="Dictionaries.Research"
                    :multiple="true"
                    data-placeholder="Выбор..."
                    name="Research"
                    v-model="model.Research" 
                />
            </div>
        </div>

        <div class="form-group">
            <label class="font-noraml">Инциденты</label>
            <div class="input-group w100">
                  <select2 class="chosen-select w100"
                    id="incidents"
                    :options="Dictionaries.Incidents"
                    :multiple="true"
                    data-placeholder="Выбор..."
                    name="Incidents"
                    v-model="model.Incidents" 
                />
            </div>
        </div>

        <div class="form-group">
            <label class="font-noraml">Ресурсы</label>
            <div class="input-group w100">
                 <select2 class="chosen-select w100"
                    id="resources"
                    :options="Dictionaries.Resources"
                    :multiple="true"
                    data-placeholder="Выбор..."
                    name="Resources"
                    v-model="model.Resources" 
                />
            </div>
        </div>
       
        <div class="text-right">
            <button class="btn btn-white mr5 btn-small" type="button" @click="resetFilter" :disabled="IsLoading">
                Сбросить
            </button>
            <button class="btn btn-success btn-small" type="button" @click="applyFilter" :disabled="IsLoading">
                <i class="fa fa-spinner fa-spin fa-fw" v-if="IsLoading"></i>
                Применить
            </button>
        </div>
    </div>
</template>

<script src="./vulnerabilitiesFilter.ts" lang="ts">
</script>
