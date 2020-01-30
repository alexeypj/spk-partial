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
                               id="title"
                               placeholder="Название"
                               name="Title"
                               data-vv-as="Название"
                               v-validate="'required|min:3'" />
                        <span class="text-danger" v-show="errors.has('Title')">{{ errors.first('Title') }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-xs-12">
                <div class="form-group">
                    <label class="col-sm-12 ">Описание</label>
                    <div class="col-sm-12">
                        <textarea v-model="model.Description"
                                  rows="5"
                                  :class="['form-control', {'required-validation-error' : errors.has('Description')}]"
                                  id="description"
                                  placeholder="Описание"
                                  name="Description"
                                  data-vv-as="Описание" />
                        <span class="text-danger" v-show="errors.has('Description')">{{ errors.first('Description') }}</span>
                    </div>
                </div>
            </div>
        </div>
        <Carousel @selectNext="selectNext" @selectPrev="selectPrev" v-if="model.Id > 0" />
		<Footer :IsSaving="IsSaving" @cancel="cancel" @store="store" @storeAndExit="storeAndExit" :Id="model.Id" />
    </div>
</template>

<script lang="ts" src="./EditForm.ts" />