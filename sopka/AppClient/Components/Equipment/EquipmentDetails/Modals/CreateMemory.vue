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
								v-validate="'required|min:2'" />
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
						<input v-model="model.Volume" 
								rows="5"
								:class="['form-control', {'required-validation-error' : errors.has('Description')}]"
								id="description"
								placeholder="Объем"
								name="Description"
								data-vv-as="Объем"
								v-validate="'required|integer|min_value:1|max:64'"
								/>
						<span class="text-danger" v-show="errors.has('Description')">{{ errors.first('Description') }}</span>
					</div>
				</div>
			</div>
		</div>
		<Footer :IsSaving="IsSaving" @store="store" @cancel="$emit('cancel', true)"/>		
	</div>
</template>

<script lang="ts" src="./CreateMemory.ts" />