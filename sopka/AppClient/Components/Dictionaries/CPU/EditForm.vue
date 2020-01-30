<template>
	<div class="form-horizontal">
		<error-text :text="errorText" />
		<div class="row">
			<div class="col-xs-12">
				<div class="form-group">
					<label class="col-sm-12 ">Продукт</label>
					<div class="col-sm-12">
						<input type="text" v-model="model.Product"
								:class="['form-control', {'required-validation-error' : errors.has('Product')}]"
								id="Product"
								placeholder="Продукт"
								name="Product"
								data-vv-as="Продукт"
								v-validate="'required|min:3'" />
                        <span class="text-danger" v-show="errors.has('Product')">{{ errors.first('Product') }}</span>
					</div>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col-xs-12">
				<div class="form-group">
					<label class="col-sm-12 ">Количество ядер</label>
					<div class="col-sm-12">
							<input type="number" v-model="model.CoresNumber"
								:class="['form-control', {'required-validation-error' : errors.has('CoresNumber')}]"
								id="CoresNumber"
								placeholder="Количество ядер"
								name="CoresNumber"
								data-vv-as="Количество ядер"
								v-validate="'required|min_value:1'" />
                        <span class="text-danger" v-show="errors.has('CoresNumber')">{{ errors.first('CoresNumber') }}</span>
					</div>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col-xs-12">
				<div class="form-group">
					<label class="col-sm-12 ">Производитель</label>
					<div class="col-sm-12">
						<textarea v-model="model.Manufacturer" 
								rows="5"
								:class="['form-control', {'required-validation-error' : errors.has('Manufacturer')}]"
								id="Manufacturer"
								placeholder="Производитель"
								name="Manufacturer"
								data-vv-as="Производитель"
                                v-validate="'required|min:3'" 
								/>
                        <span class="text-danger" v-show="errors.has('Manufacturer')">{{ errors.first('Manufacturer') }}</span>
					</div>
				</div>
			</div>
		</div>
        <Carousel @selectNext="selectNext" @selectPrev="selectPrev" v-if="model.Id > 0" />
		<Footer :IsSaving="IsSaving" @cancel="cancel" @store="store" @storeAndExit="storeAndExit" :Id="model.Id"/>
	</div>
</template>

<script lang="ts" src="./EditForm.ts" />