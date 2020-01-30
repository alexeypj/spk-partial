<template>
	<div>
		<div class="equipform">
			<div class="form-group no-margins">
				<label for="fio" class="control-label w100 text-left">ФИО</label>
				<div class="w100">
					<input :class="['form-control', {'required-validation-error' : errors.has('FIO')}]"
						   id="fio"
						   placeholder="ФИО"
						   v-model="model.FIO"
						   name="FIO"
						   data-vv-as="ФИО"
						   v-validate="{required: true, min: 3, regex: /^[a-zA-Z\-\'\u0430-\u044f\s]+$/i }" />
					<span class="text-danger" v-show="errors.has('FIO')">{{ errors.first('FIO') }}</span>
				</div>
			</div>
			<div class="form-group no-margins">
				<label for="role" class="control-label w100 text-left">Роль</label>
				<div class="w100">
					<select2 type="text"
							 :class="['form-control']"
							 id="role"
							 placeholder="Роль"
							 v-model="roleId"
							 name="Role"
							 data-vv-as="Роль"
							 :options="rolesDict"
							 v-validate="'required'" />
					<span class="text-danger" v-show="errors.has('Role')">{{ errors.first('Role') }}</span>
				</div>
			</div>
			<div class="form-group no-margins">
				<label for="email" class="control-label w100 text-left">Email</label>
				<div class="w100">
					<input type="text"
						   :class="['form-control', {'required-validation-error' : errors.has('Email')}]"
						   id="email"
						   placeholder="Email"
						   v-model="model.Email"
						   name="Email"
						   data-vv-as="Email"
						   v-validate="'required|email|min:3'" />
					<span class="text-danger" v-show="errors.has('Email')">{{ errors.first('Email') }}</span>
				</div>
			</div>
			<div class="form-group no-margins">
				<label for="phoneNumber" class="control-label w100 text-left">Телефон</label>
				<div class="w100">
					<input type="text"
						   :class="['form-control', {'required-validation-error' : errors.has('PhoneNumber')}]"
						   id="phoneNumber"
						   placeholder="Телефон"
						   v-model="model.PhoneNumber"
						   name="PhoneNumber"
						   data-vv-as="Телефон"
						   v-validate="'phoneNumber|required'" />
					<span class="text-danger" v-show="errors.has('PhoneNumber')">{{ errors.first('PhoneNumber') }}</span>
				</div>
			</div>

		</div>
		<div class="row mtop10 ptop15 no-margins">
			<div class="pull-right">				
				<save-button className="btn btn-success pull-right btn-small" @click="store" :isSaving="false"/>				
				<cancel-button className="btn btn-white mr5 pull-right btn-small" @click="cancel" :isSaving="false" />
			</div>
			<transition name="fade" v-if="isSaved || errorText">
				<div class="pull-right alert alert-success alertsave eq_div" role="alert" v-if="isSaved">
					Сохранено
				</div>
				<div class="pull-right alert alert-danger alertsave eq_div" role="alert" v-if="errorText">
					{{ errorText }}
				</div>
			</transition>
		</div>
	</div>
</template>

<script src="./editForm.ts" lang="ts">
</script>
