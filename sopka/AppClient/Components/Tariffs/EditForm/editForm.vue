<template>
    <div>
        <div class="form-horizontal">
            <div class="form-group no-margins">
                <label for="Name" class="control-label w100 text-left">Наименование тарифа</label>
                <div class="w100">
                    <input :class="['form-control', {'required-validation-error' : errors.has('Name')}]"
                           id="Name"
                           placeholder="Наименование тарифа"
                           v-model="model.Name"
                           name="Name"
                           data-vv-as="Наименование тарифа"
                           v-validate="{required: true, min: 3}" />
                    <span class="text-danger" v-show="errors.has('Name')">{{ errors.first('Name') }}</span>
                </div>
            </div>

            <div class="form-group">
                <div class="col-md-6">
                    <label for="UsersCount" class="control-label w100 text-left">Количество пользователей</label>
                    <div class="">
                        <select2 :class="['form-control w100']"
                                 id="UsersCount"
                                 data-placeholder="Количество пользователей"
                                 name="UsersCount"
                                 data-vv-as="Количество пользователей"
                                 v-validate="'required|min_value:0'"
                                 :options="usersCountOptions"
                                 v-model="model.UsersCount"
                                 :allowClear="false" />
                        <span class="text-danger" v-show="errors.has('UsersCount')">{{ errors.first('UsersCount') }}</span>
                    </div>
                </div>
                <div class="col-md-6">
                    <label for="ObjectsCount" class="control-label w100 text-left">Количество объектов</label>
                    <div class="">
                        <select2 :class="['form-control w100']"
                                 id="ObjectsCount"
                                 data-placeholder="Количество объектов"
                                 name="ObjectsCount"
                                 data-vv-as="Количество объектов"
                                 v-validate="'required|min_value:0'"
                                 :options="objectsCountOptions"
                                 v-model="model.ObjectsCount"
                                 :allowClear="false" />
                        <span class="text-danger" v-show="errors.has('ObjectsCount')">{{ errors.first('ObjectsCount') }}</span>
                    </div>
                </div>
            </div>

            <div class="form-group">
                <div class="col-md-6 ">
                    <label for="EquipmentsCount" class="control-label w100 text-left">Количество оборудования</label>
                    <div>
                        <select2 :class="['form-control w100']"
                                 id="EquipmentsCount"
                                 data-placeholder="Количество оборудования"
                                 name="EquipmentsCount"
                                 data-vv-as="Количество оборудования"
                                 v-validate="'required|min_value:0'"
                                 :options="equipmentsCountOptions"
                                 v-model="model.EquipmentsCount"
                                 :allowClear="false" />
                        <span class="text-danger" v-show="errors.has('EquipmentsCount')">{{ errors.first('EquipmentsCount') }}</span>
                    </div>
                </div>
                <div class="col-md-6">
                    <label for="ObjectsCount" class="control-label w100 text-left">Время действия (дней)</label>
                    <div class="">
                        <input :class="['form-control', {'required-validation-error' : errors.has('Period')}]"
                               id="Period"
                               placeholder="Время действия"
                               v-model="model.Period"
                               name="Period"
                               data-vv-as="Время действия"
                               v-validate="{required: true, min_value: 1}" />
                        <span class="text-danger" v-show="errors.has('Period')">{{ errors.first('Period') }}</span>
                    </div>
                </div>
            </div>



            <div class="form-group">
                <div class="col-md-12">
                    <label for="Support" class="control-label w100 text-left">
                        <input type="checkbox" id="Support" v-model="model.Support" />
                        Техподдержка
                    </label>
                </div>
            </div>
            <div class="form-group">
                <div class="col-md-12">
                    <label for="IsActive" class="control-label w100 text-left">
                        <input type="checkbox" id="IsActive" v-model="model.IsActive" />
                        Активен
                    </label>
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
<script lang="ts" src="./editForm.ts"></script>