<template>
    <div class="form-horizontal">
        <div class="row">
            <div class="col-xs-12">
                <div class="form-group">
                    <label class="col-sm-12 ">Название</label>
                    <div class="col-sm-12">
                        <input type="text" v-model="Filter.Title"
                               class="form-control"
                               id="Title"
                               placeholder="Продукт"
                               name="Title"
                                />
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-xs-12">
                <div class="form-group">
                    <label class="col-sm-12 ">Объем</label>
                    <div class="col-sm-12">
                        <input type="text" v-model="Filter.Volume"
                               class="form-control"
                               id="Volume"
                               placeholder="Объем"
                               name="Volume"
                                />
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-xs-12">
                <button class="btn btn-primary" @click="apply">Применить</button>
                <button class="btn btn-default" @click="$emit('cancel', true)" >Отмена</button>
            </div>
        </div>
    </div>
</template>
<script lang="ts" src="./SearchFilter.ts" />