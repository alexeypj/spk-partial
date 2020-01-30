<template>
    <div class="form-horizontal">
        <div class="row">
            <div class="col-xs-12">
                <div class="form-group">
                    <label class="col-sm-12 ">Название</label>
                    <div class="col-sm-12">
                        <input type="text" v-model="Filter.Title"
                               class="form-control"
                               id="title"
                               placeholder="Название"
                               name="Title"
                                />
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-xs-12">
                <div class="form-group">
                    <label class="col-sm-12 ">Описание</label>
                    <div class="col-sm-12">
                        <input type="text" v-model="Filter.Description"
                               class="form-control"
                               id="description"
                               placeholder="Описание"
                               name="description"
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