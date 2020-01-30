<template>
    <div class="bordertop pleft5 pright5 ptop5 incfilter">
         <div class="form-group" v-if="!Shortview">
            <label class="font-noraml">Тип атаки</label>
            <div class="input-group w100">
                <select2 data-placeholder="Выбор..." class="chosen-select w100 sel2" tabindex="2" 
                    v-model="model.AttackType"                    
                    :options="Dictionaries.Attacks"                    
                />                
            </div>
        </div>

         <div class="form-group" v-if="!Shortview">
            <label class="font-noraml">Дата фиксации</label>
            <div class="input-group w100">
                <date-pick v-model="model.FixationTime"
                        :pickTime="false    "
                        :inputAttributes="{
                                class: 'form-control'
                            }"
                        :format="'YYYY-MM-DD'"
                        :displayFormat="'DD.MM.YYYY'"
                        :nextMonthCaption="'Следующий месяц'"
                        :prevMonthCaption="'Предыдущий месяц'"
                        :setTimeCaption="'Время'"
                        :weekdays="['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']"
                        :months="['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']"
                        name="FixationTime"
                        data-vv-as="Время окончания"
                        v-validate="'required'">
                </date-pick>        
            </div>
        </div>

        <div class="form-group" v-if="!Shortview">
            <label class="font-noraml">Статус</label>
            <div class="input-group w100">
                <select2 data-placeholder="Выбор..." class="chosen-select w100 sel2" tabindex="2"
                    :options="statusOptions"
                    v-model="model.Status"
                />                    
            </div>
        </div>

        <div class="form-group">
            <label class="font-noraml">Ответственная группа</label>
            <div class="input-group w100">
                <select2 data-placeholder="Выбор..." class="chosen-select w100 sel2" tabindex="2" 
                    v-model="model.ResponsibleRoleId"                    
                    :options="Dictionaries.Roles"                    
                />                
            </div>
        </div>

        <div class="form-group">
            <label class="font-noraml">Кем заведено</label>
            <div class="input-group w100">
                <select2 data-placeholder="Выбор..." class="chosen-select w100 sel2" tabindex="2"
                     v-model="model.CreatorId"                    
                    :options="Dictionaries.Users"                    
                />
            </div>
        </div>

         <div class="form-group">
            <label class="font-noraml">Объект</label>
            <div class="input-group w100">
                <select2 data-placeholder="Выбор..." class="chosen-select w100 sel2" tabindex="2"
                    v-model="model.ObjectId"
                    :options="Dictionaries.Objects"
                />
            </div>
        </div>

        <div class="form-group">
            <label class="font-noraml">Оборудование</label>
            <div class="input-group w100">
                <select2 data-placeholder="Выбор..." class="chosen-select w100 sel2" tabindex="2"
                    v-model="model.EquipmentId"
                    :options="Dictionaries.Equipments"                    
                />
            </div>
        </div>       

        <div class="form-group">
            <label class="font-noraml">Аппаратная платформа</label>
            <div class="input-group w100">
                <select2 data-placeholder="Выбор..." class="chosen-select w100 sel2" tabindex="2"
                    v-model="model.PlatformId"
                    :options="Dictionaries.Platforms"
                />
            </div>
        </div>
        
        <div class="form-group" v-if="!Shortview">
            <label class="font-noraml">Страна источника</label>
            <div class="input-group w100">
                <select2 data-placeholder="Выбор..." class="chosen-select w100 sel2" tabindex="2"
                    v-model="model.Country"
                    :options="Dictionaries.Countries"
                />
            </div>
        </div>
        <div class="checkbox">
            <label class="font-noraml">
                <input type="checkbox" v-model="model.ShowClosed"> Показать закрытые инциденты
            </label>
        </div>        
        <div class="text-right">
            <button class="btn btn-white mr5 btn-small" type="button" @click="ResetFilter">Сбросить</button>
            <button class="btn btn-success btn-small" type="button" @click="Apply">Применить</button>
        </div>
    </div>
</template>


<script lang="ts" src="./IncidentFilter.ts">
</script>
