<template>
    <div class="form-horizontal">
        <error-text :text="errorText" />        
        <div class="row">
            <div class="col-xs-12">
                <div class="form-group">
                    <label class="col-sm-12 ">Название</label>
                    <div class="col-sm-12">
                        <input type="text" v-model="model.Criticality"
                               :class="['form-control', {'required-validation-error' : errors.has('Criticality')}]"
                               id="Criticality"
                               placeholder="Название"
                               name="Criticality"
                               data-vv-as="Название"
                               v-validate="'required|min:1'" />
                        <span class="text-danger" v-show="errors.has('Criticality')">{{ errors.first('Criticality') }}</span>
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

<script lang="ts" src="./CreateCriticality.ts" />