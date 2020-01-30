<template>
    <div style="padding:0 ">
        <template v-if="options.Type == 'none'">            
        </template>
        <input 
            type="text" 
            :placeholder="options.Placeholder" 
            class="form-control" 
            v-if="options.Type == 'text'"
            :value="options.Value"
            @input="updateValue"
        />
        <select2 class="w100" v-if="options.Type == 'select'" style="width:100%"
            :options="options.SelectValues"
            :value="options.Value"
            :data-placeholder="options.Placeholder"
            @input="updateValue"
        />
        <date-pick v-if="options.Type == 'date' || options.Type == 'datetime'"
            @input="updateValue"
            :pickTime="options.Type == 'datetime'"
            :value="options.Value"
            :inputAttributes="{
                class: 'form-control'
            }"
            :format="'YYYY-MM-DD HH:mm'"
            :displayFormat="'DD.MM.YYYY'"
            :nextMonthCaption="'Следующий месяц'"
            :prevMonthCaption="'Предыдущий месяц'"
            :setTimeCaption="'Время'"
            :weekdays="['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']"
            :months="['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']"
        />
    </div>
</template>

<script src="./filters.ts" lang="ts">
</script>
