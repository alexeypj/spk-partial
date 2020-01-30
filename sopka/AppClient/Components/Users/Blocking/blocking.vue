<template>
	<div>
		<div class="form-horizontal">
			<div class="form-group no-margins">
				<label for="fio" class="w100 control-label text-left">ФИО</label>
				<div class="w100">
					<p class="form-control-static">{{ model.FIO }}</p>
				</div>
			</div>
			<div class="form-group no-margins">
				<label for="email" class="w100 control-label text-left">Email</label>
				<div class="w100">
					<p class="form-control-static">{{ model.Email }}</p>
				</div>
			</div>
			<div class="form-group no-margins">
				<label for="phoneNumber" class="w100 control-label text-left">Причина блокировки (будет передана пользователю)</label>
				<div class="w100">
					<textarea v-if="model.IsBlock === false"
							  rows="5"
							  :class="['form-control', {'required-validation-error' : errors.has('BlockReason')}]"
							  id="blockReason"
							  placeholder="Укажите причину блокировки"
							  v-model="blockReason"
							  name="BlockReason"
							  data-vv-as="Причина блокировки"
							  v-validate="''" />
					<span class="text-danger" v-show="errors.has('BlockReason')">{{ errors.first('BlockReason') }}</span>
					<p class="form-control-static" v-if="model.IsBlock">{{ model.BlockReason }}</p>
				</div>
			</div>
			<div class="form-group no-margins" v-if="model.IsBlock">
				<label for="phoneNumber" class="w100 control-label text-left">Дата блокировки</label>
				<div class="w100">
					<p class="form-control-static">{{ blockDate }}</p>
				</div>
			</div>
		</div>
		<div class="row mtop10 ptop15 no-margins">
			<div class="pull-right">
				<button class="btn btn-success pull-right btn-small" @click="store" v-if="!ViewOnly">
					<template v-if="model.IsBlock">
						Разблокировать
					</template>
					<template v-else>
						Заблокировать
					</template>
				</button>
				<button class="btn btn-white pull-right mr5 btn-small" @click="cancel">Отменa</button>

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

<script src="./blocking.ts" lang="ts">
</script>
