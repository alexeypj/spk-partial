<template>
    <div>
        <div class="form-horizontal">
            <div class="form-group no-margins">
                <label for="Name" class="control-label w100 text-left">Компания</label>
                <div class="w100">
                    <input :class="['form-control', {'required-validation-error' : errors.has('Name')}]"
                           id="Name"
                           placeholder="Компания"
                           v-model="model.Name"
                           name="Name"
                           data-vv-as="Компания"
                           v-validate="{required: true, min: 3}" />
                    <span class="text-danger" v-show="errors.has('Name')">{{ errors.first('Name') }}</span>
                </div>
            </div>

            <div class="form-group">
                <div class="col-md-6">
                    <label for="Support" class="control-label w100 text-left">
                        <input type="checkbox" id="Support" v-model="model.Support" />
                        Техподдержка
                    </label>
                </div>

                <div class="col-md-6">
                    <label for="PaidTo" class="control-label w100 text-left">Срок истечения</label>
                    <div class="">
                        <DatePickRFX v-model="model.PaidTo"
                                     :pickTime="false"
                                     :displayFormat="'YYYY-MM-DD'"
                                     :inputAttributes="{class: 'form-control', id: 'PaidTo'}">
                        </DatePickRFX>
                    </div>
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
            </div>

            <div class="form-group no-margins">
                <label for="ResponsiblePersonEmail" class="control-label w100 text-left">Email ответственного лица</label>
                <div class="w100">
                    <input :class="['form-control', {'required-validation-error' : errors.has('ResponsiblePersonEmail')}]"
                           id="ResponsiblePersonEmail"
                           placeholder="Email ответственного лица"
                           v-model="model.ResponsiblePersonEmail"
                           name="ResponsiblePersonEmail"
                           data-vv-as="Email ответственного лица"
                           v-validate="'email'" />
                    <span class="text-danger" v-show="errors.has('ResponsiblePersonEmail')">{{ errors.first('ResponsiblePersonEmail') }}</span>
                </div>
            </div>

            <div class="form-group no-margins">
                <label for="Comment" class="control-label w100 text-left">Комментарий</label>
                <div class="w100">
                    <textarea class="form-control" id="Comment" v-model="model.Comment" rows="3">
                    </textarea>
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
<script lang="ts" src="./EditForm.ts"></script>
