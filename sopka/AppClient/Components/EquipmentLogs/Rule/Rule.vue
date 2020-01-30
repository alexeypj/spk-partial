<template>
	<div class="form-horizontal ibox-content eqrules" style="padding: 10px 30px">
		<div class="equip_btn_r21" style="margin-right: 65px;">
			<transition name="fade">
				<div class="pull-left alert alert-success eq_div" role="alert" v-if="isSaved">
					Сохранено
				</div>
				<div class="pull-left alert alert-danger eq_div" role="alert" v-if="errorText">
					{{ errorText }}
				</div>
			</transition>
		</div>
		<div class="row">
			<div :class="['form-group', { 'has-warning': errors.has('Name')}]">
				<label class="col-md-12">Название</label>
				<div class="col-md-12">
					<input :disabled="readonly"
						   v-model="model.Name"
						   type="text"
						   placeholder=""
						   class="form-control"
						   name="Name"
						   data-vv-as="Название"
						   v-validate="'required|min:3'" />
					<span class="text-danger" v-show="errors.has('Name')">{{ errors.first('Name') }}</span>
				</div>
			</div>
		</div>
		<div class="row">
			<div :class="['form-group', { 'has-warning': errors.has('OnCondition')}]">
				<label class="col-md-12">Если выполняется</label>
				<div class="col-md-5">
					<select2 v-if="!readonly"
							 :class="['w100']"
							 id="OnCondition"
							 v-model="model.OnCondition"
							 :options="OnConditionsDictionary"
							 data-placeholder="Условия"
							 name="OnCondition"
							 v-validate="'required'"
							 data-vv-as="Условия"
							 :allowClear="false" />
					<p class="form-control-static" v-else>{{ model.OnCondition }}</p>
					<span class="text-danger" v-show="errors.has('OnCondition')">{{ errors.first('OnCondition') }}</span>
				</div>
				<div class="col-md-7 dflex dflex-center">
					<template v-if="isOrdered">
						<label class="mr5">в течение</label>
						<div class="mr5">
							<input min="1"
								   step="1"
								   type="number"
								   class="form-control"
								   :disabled="readonly"
								   v-model="model.OnConditionPeriodLength"
								   placeholder=""
								   name="OnConditionPeriodLength"
								   data-vv-as="в течение"
								   v-validate="'required|min_value:1'" />
							<span class="text-danger" v-show="errors.has('OnConditionPeriodLength')">{{ errors.first('OnConditionPeriodLength') }}</span>
						</div>
						<div>
							<select2 class=""
									 :options="TimePeriodDictionary"
									 v-model="model.OnConditionPeriod"
									 v-validate="'required'"
									 name="onConditionPeriod"
									 data-placeholder="период"
									 data-vv-as="Период"
									 :allowClear="false" />
							<span class="text-danger" v-show="errors.has('onConditionPeriod')">{{ errors.first('onConditionPeriod') }}</span>
						</div>
					</template>
				</div>
			</div>
		</div>

		<!-- Conditions -->
		<div v-for="(condition, idx) in conditions" :key="'condition_' + condition.Position">
			<div class="row">
				<div class="dflex dflex-center bbottom2px mb10">
					<div class="flexgrow font-weight-bolder">Условие {{ condition.Position + 1 }}</div>
					<div class="col-md-offset-8">
						<button class="btn btn-link btn-small" @click="moveDown(idx)">
							<i class="fa fa-arrow-down" aria-hidden="true"></i>
						</button>
						<button class="btn btn-link btn-small" @click="moveUp(idx)">
							<i class="fa fa-arrow-up" aria-hidden="true"></i>
						</button>
						<button class="btn btn-link btn-small" @click="remove(idx)">
							<i class="fa fa-minus" aria-hidden="true" style="color:red;"></i>
						</button>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-md-6 no-padding">
					<div class="col-md-12 pleft0 pr0_992">Критичность ошибки</div>
					<div class="col-md-12 pleft0 pr0_992">
						<select2 :class="['w100']"
								 :options="SeverityDictionary"
								 v-model="condition.SeverityId"
								 v-validate="'required'"
								 :name="'CriticalityId_' +idx"
								 data-placeholder="Критичность"
								 data-vv-as="Критичность ошибки"
								 :allowClear="false" />
						<span class="text-danger" v-show="errors.has('CriticalityId_' + idx)">{{ errors.first('CriticalityId_' + idx) }}</span>
					</div>
				</div>
				<div class="col-md-6 no-padding">
					<div class="col-md-12 pleft0_992 pright0">Тип оборудования</div>
					<div class="col-md-12 pleft0_992 pright0">
						<select2 :class="['w100']"
								 :options="EquipmentDictionary"
								 v-model="condition.EquipmentId"
								 v-validate="'required'"
								 :name="'EquipmentId_' + idx"
								 data-placeholder="Тип оборудования"
								 data-vv-as="Тип оборудования"
								 :allowClear="false" />
						<span class="text-danger" v-show="errors.has('EquipmentId_' + idx)">{{ errors.first('EquipmentId_' + idx) }}</span>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="form-group">
					<div class="col-md-12">Текст ошибки содержит</div>
					<div class="col-md-12">
						<input v-model="condition.ErrorBody"
							   type="text"
							   placeholder=""
							   class="form-control"
							   :name="'Errortext_' + idx"
							   data-vv-as="Текст ошибки"
							   v-validate="'required|min:3'" />
						<span class="text-danger" v-show="errors.has('Errortext_' + idx)">{{ errors.first('Errortext_' + idx) }}</span>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="form-group">
					<div class="col-md-12">Число ошибок более</div>
					<div class="col-md-12">
						<div class="pull-left">
							<input v-model="condition.ErrorsNumber"
								   min="1"
								   step="1"
								   type="number"
								   placeholder=""
								   class="form-control"
								   :name="'ErrorsNumber_' + idx"
								   data-vv-as="число"
								   :allowClear="false"
								   v-validate="'required|min_value:1'" />
							<span class="text-danger" v-show="errors.has('ErrorsNumber_' + idx)">{{ errors.first('ErrorsNumber_' + idx) }}</span>
						</div>
						<div class="pull-left" style="padding:0 10px; line-height: 28px">в</div>
						<div class="pull-left">
							<input v-model="condition.PeriodLength"
								   min="1"
								   step="1"
								   type="number"
								   placeholder=""
								   class="form-control"
								   :name="'PeriodLength_' + idx"
								   data-vv-as="число"
								   v-validate="'required|min_value:1'" />
							<span class="text-danger" v-show="errors.has('PeriodLength_' + idx)">{{ errors.first('PeriodLength_' + idx) }}</span>
						</div>
						<div class="pull-left" style="padding-left: 10px">
							<select2 class="w100"
									 :options="TimePeriodDictionary"
									 v-model="condition.Period"
									 v-validate="'required'"
									 :name="'Period_' + idx"
									 data-placeholder="период"
									 data-vv-as="Период"
									 :allowClear="false" />
							<span class="text-danger" v-show="errors.has('Period_' + idx)">{{ errors.first('Period_' + idx) }}</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="row" v-if="errors.has('conditions')">
			<div class="form-group text-danger">
				<div class="col-md-12"></div>
				<div class="col-md-12">
					{{ errors.first('conditions') }}
				</div>
			</div>
		</div>
		<!-- end condition -->
		<div class="row mtop10 bbottom2px mb10 pb10">
			<button class="btn btn-success btn-outline btn-sm" @click="addCondition">
				<i class="fa fa-plus" aria-hidden="true"></i> Добавить условие
			</button>
		</div>
		<div class="row">
			<div class="form-group">
				<label class="col-md-12">Выполнить действие</label>
				<div class="col-md-12">
					<select2 v-if="!readonly"
							 :class="['w100']"
							 id="Action"
							 v-model="model.Action"
							 :options="ActionDictionary"
							 data-placeholder="Действие"
							 name="Action"
							 data-vv-as="Действие"
							 :allowClear="false" />
					<p class="form-control-static" v-else>{{ model.Action }}</p>
					<span class="text-danger" v-show="errors.has('Action')">{{ errors.first('Action ') }}</span>
				</div>
				<div :class="['col-md-12', {'has-error': errors.has('EmailAddress')}]">
					<input v-if="model.Action == 1"
						   v-model="model.EmailAddress"
						   type="text"
						   placeholder="E-Mail"
						   class="form-control"
						   name="EmailAddress"
						   data-vv-as="E-mail"
						   v-validate="'required|email'" />
					<span class="text-danger" v-show="errors.has('EmailAddress')">{{ errors.first('EmailAddress') }}</span>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="form-group">
				<label class="col-md-12 ">{{ descriptionTitle }}</label>
				<div class="col-md-12">
					<textarea v-if="!readonly"
							  v-model="model.Description"
							  name="Descriotion"
							  rows="5"
							  class="form-control">
					</textarea>
					<p class="form-control-static" v-else>{{ model.Description }}</p>
					<span class="text-danger" v-show="errors.has('Description')">{{ errors.first('Description') }}</span>
				</div>
			</div>
		</div>
	</div>													
</template>

<script lang="ts" src="./Rule.ts">
</script>
