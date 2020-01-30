<template>
    <div class="form-horizontal">
        <error-text :text="errorText" />        
        <div class="row">
            <div class="col-xs-12">
                <div class="form-group">
                    <label class="col-sm-12 ">Название</label>
                    <div class="col-sm-12">
                        <input type="text" v-model="model.Title"
                               :class="['form-control', {'required-validation-error' : errors.has('Title')}]"
                               id="Title"
                               placeholder="Обозначние"
                               name="Title"
                               data-vv-as="Обозначение"
                               v-validate="'required|min:1'" />
                        <span class="text-danger" v-show="errors.has('Title')">{{ errors.first('Title') }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-xs-12 text-right">
                <cancel-button @click="close" :isSaving="IsSaving"/>
                <save-button @click="store" :isSaving="IsSaving" />                
            </div>
        </div>
    </div>
</template>

<script lang="ts" src="./CreateSeverity.ts" ></script>