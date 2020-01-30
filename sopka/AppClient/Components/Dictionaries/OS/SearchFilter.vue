<template>
    <div class="form-horizontal">
        <div class="row">
            <div class="col-xs-12">
                <div class="form-group">
                    <label class="col-sm-12 ">Продукт</label>
                    <div class="col-sm-12">
                        <input type="text" v-model="Filter.Product"
                               class="form-control"
                               id="product"
                               placeholder="Продукт"
                               name="product"
                                />
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-xs-12">
                <div class="form-group">
                    <label class="col-sm-12 ">Производитель</label>
                    <div class="col-sm-12">
                        <input type="text" v-model="Filter.Manufacturer"
                               class="form-control"
                               id="manufacturer"
                               placeholder="Производитель"
                               name="manufacturer"
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