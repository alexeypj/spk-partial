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
					<label class="col-sm-12 ">Объем, гб</label>
                    <div class="col-sm-12">
                        <input type="number" v-model="model.Volume"
                               :class="['form-control', {'required-validation-error' : errors.has('Volume')}]"
                               id="Volume"
                               placeholder="Объем"
                               name="Volume"
                               data-vv-as="Объем"
                               v-validate="'required|min_value:1'" />
                        <span class="text-danger" v-show="errors.has('Volume')">{{ errors.first('Volume') }}</span>
                    </div>
				</div>
			</div>
		</div>
        <Carousel @selectNext="selectNext" @selectPrev="selectPrev" v-if="model.Id > 0" />
		<Footer :IsSaving="IsSaving" @cancel="cancel" @store="store" @storeAndExit="storeAndExit" :Id="model.Id"/>
	</div>
</template>

<script lang="ts" src="./EditForm.ts" />