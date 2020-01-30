<template>
	<div class="form-horizontal">
		<error-text :text="errorText" />
		<div class="row">
			<div class="col-xs-12">
				<div class="form-group">
					<label class="col-sm-12 ">Производитель</label>
					<div class="col-sm-12">
						<input type="text" v-model="model.Manufacturer"
								:class="['form-control', {'required-validation-error' : errors.has('Title')}]"
								id="title"
								placeholder="Производитель"
								name="Title"
								data-vv-as="Производитель"
								v-validate="'required|min:2|max:250'" />
						<span class="text-danger" v-show="errors.has('Title')">{{ errors.first('Title') }}</span>
					</div>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col-xs-12">
				<div class="form-group">
					<label class="col-sm-12 ">Продукт</label>
					<div class="col-sm-12">
						<input v-model="model.Product" 
								:class="['form-control', {'required-validation-error' : errors.has('Description')}]"
								id="description"
								placeholder="Продукт"
								name="Description"
								data-vv-as="Продукт"
								v-validate="'required|min:2|max:250'" 
								/>
						<span class="text-danger" v-show="errors.has('Description')">{{ errors.first('Description') }}</span>
					</div>
				</div>
			</div>
		</div>
		<Footer :IsSaving="IsSaving" @store="store" @cancel="$emit('cancel', true)"/>		
	</div>
</template>

<script lang="ts" src="./CreatePlatform.ts" />