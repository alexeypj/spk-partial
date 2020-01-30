<template>
    <div class="form-horizontal">
        <error-text :text="errorText" />
        <div class="row">
            <div class="col-xs-12">
                <div class="form-group">
                    <label class="col-sm-12 ">Значение</label>
                    <div class="col-sm-12">
                        <input type="text" v-model="model.NewSynonym"
                               :class="['form-control', {'required-validation-error' : errors.has('NewSynonym')}]"
                               id="NewSynonym"
                               placeholder="Значение"
                               name="NewSynonym"
                               data-vv-as="Значение"
                               v-validate="'required|min:3'" />
                        <span class="text-danger" v-show="errors.has('NewSynonym')">{{ errors.first('NewSynonym') }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-xs-12">
                <div class="form-group">
                    <label class="col-sm-12 ">Обозначение</label>
                    <div class="col-sm-12 w100">
                        <select2 type="text"
                                 :class="['form-control']"
                                 id="NewSeverityId"
                                 placeholder="Обозначение"
                                 v-model="model.NewSeverityId"
                                 name="NewSeverityId"
                                 data-vv-as="Обозначение"
                                 :options="SeverityDictionary"
                                 @customOptionClick="openSeverityModal"
                                 customOptionTitle="Добавить"
                                 :allowClear="false"
                                 v-validate="'required|min_value:1'" />
                        <span class="text-danger" v-show="errors.has('NewSeverityId')">Поле Обозначение обязательно для заполнения</span>
                    </div>
                </div>
            </div>
        </div>
        <Carousel @selectNext="selectNext" @selectPrev="selectPrev" v-if="model.OldSeverityId > 0" />
		<Footer :IsSaving="IsSaving" @cancel="cancel" @store="store" @storeAndExit="storeAndExit" :Id="model.OldSeverityId" />
    </div>
</template>

<script lang="ts" src="./EditForm.ts" />