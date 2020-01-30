<template>
    <div class="h100">
        <div class="col-md-3 col-sm-4 col-xs-12 bright h100">
			<div class="ibox-content btop0" v-if="showFilters" style="padding: 0">
				<div class="ibox-title mb5" v-if="showHideFiltersBtn">
					<h5>Инциденты</h5>
					<div style="text-align:right" class="float-right">
						<button class="btn btn-white btn-small" type="button" @click="closeFilters"><i class="fa fa-filter fa-lg" title="Скрыть фильтры"></i></button>
						<a @click="displayCreationForm" class="btn-success btn-outline btn btn-small" title="Добавить новый инцидент"  
                           v-if="IsSuperAdminOrPaidAccess">
							<i class="fa fa-plus fa-lg"></i>
						</a>
					</div>
				</div>

				<IncidentFilter :Shortview="false" />
			</div>
            <div class="ibox" v-else style="padding: 0">
				<div class="ibox-title mb5">
					<h5>Инциденты</h5>
					<div style="text-align:right" class="float-right">
						<button class="btn btn-white btn-small" type="button" @click="openFilters"><i class="fa fa-filter fa-lg" title="Показать фильтры"></i></button>
						<a @click="displayCreationForm" class="btn-success btn-outline btn btn-small" title="Добавить новый инцидент"  
                           v-if="IsSuperAdminOrPaidAccess">
							<i class="fa fa-plus fa-lg"></i>
						</a>
					</div>
				</div>						
				<div class="ibox-content btop0" style="padding: 0">
					<div class="table-responsive">
						<table class="table inccardtable">
							<tbody>
								<tr @click="openIncident(incident.Id)" :class="[{'info': isSelected(incident.Id)}]" v-for="incident in loadedIncidents" :key="'incidentList_' + incident.Id">
									<td>
										<!-- {{ getAttackType(incident.AttackType) }}, {{ dateFormat(incident.FixationTime) }}<br> -->
										<template v-if="incident"><span :title="incident.Title">{{ incident.Title }}</span></template>
										<div class="fontgray"><small>{{ incident.StatusName }}</small><span class="pull-right"><small>id:{{ incident.Id }}</small></span></div>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
    
                <!--<div class="pleft5 pright5"><button class="btn btn-white btn-small" style="width:100%" type="button" @click="openFilters">Посмотреть фильтры </button></div>-->					
            </div>
        </div>
        <div class="col-md-9 col-sm-8 col-xs-12 bright h100">

            <div class="ibox" v-if="!showEditForm && !showCreationForm">
                <div class="ibox-title newh_ibox">
                    <h5>Инциденты</h5>
                    <div class="ibox-tools" v-if="IsSuperAdminOrPaidAccess">
                        <a class="btn btn-success btn-outline btn-small"
                           @click="displayCreationForm"
                           data-toggle="tooltip"
                           title="Добавить новый инцидент">
                            <i class="fa fa-plus fa-lg"></i>
                        </a>
                    </div>
                </div>
                <Datatable :filter="State.Filter"
                           :columns="columns"
                           :items="loadedIncidents"
                           :totalItems="TotalItems"
                           :applyFilter="applyFilter"
                           :hasSearch="true"
                           :rowClickHandler="openIncident"
                           :hasFilters="true"
                           :filterOptions="tableFilterOptions"
                           class="table-minheight pright15 inclist" >
                </Datatable>
            </div>


            <div class="ibox float-e-margins" v-if="showCreationForm">
                <div class="ibox-title newh_ibox">
                    <h5>Новый инцидент</h5>
                </div>

            <div class="equip_btn_r21">
                <div class="pull-left" v-if="IsSuperAdminOrPaidAccess">
                        <cancel-button @click="cancel" :isSaving="IsIncidentSaving" text="К списку" />
                        <save-button @click="save" :isSaving="IsIncidentSaving" />
                </div>
            </div>

                <div class="ibox-content pleft15 pright15">
                    <div>
                        <div class="form-group">
                            <div class="row">
                                <div class="col-sm-12">
                                    <label>Название</label>
                                    <input v-model="model.Title" type="text" placeholder="" class="form-control"
                                           name="Title"
                                           data-vv-as="Название"
                                           v-validate="'required|min:3'">
                                    <span class="text-danger" v-show="errors.has('Title')">{{ errors.first('Title') }}</span>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-4 pl15_992">
                                    <label>Время фиксации</label>
                                    <DatePickRFX v-model="model.FixationTime"
                                                 :pickTime="true"
                                                 :inputAttributes="{
                                                        class: 'form-control'
                                                    }"
                                                 :format="'YYYY-MM-DD HH:mm:ss'"
                                                 :displayFormat="'DD.MM.YYYY HH:mm:ss'"
                                                 name="FixationTime"
                                                 data-vv-as="Время фиксации"
                                                 v-validate="'required'">
                                    </DatePickRFX>
                                    <br />
                                    <span class="text-danger" v-show="errors.has('FixationTime')">{{ errors.first('FixationTime') }}</span>
                                </div>

                                <!--<div class="col-md-4">
                            <label>Время окончания</label>
                            <date-pick v-model="model.DecisionTime"
                                       :pickTime="true"
                                       :inputAttributes="{
                                                class: 'form-control'
                                            }"
                                       :format="'YYYY-MM-DD HH:mm:ss'"
                                       :displayFormat="'DD.MM.YYYY HH:mm:ss'"
                                       :nextMonthCaption="'Следующий месяц'"
                                       :prevMonthCaption="'Предыдущий месяц'"
                                       :setTimeCaption="'Время'"
                                       :weekdays="['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']"
                                       :months="['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']"
                                       name="DecisionTime"
                                       data-vv-as="Время окончания"
                                       v-validate="'required'">
                            </date-pick>
                            <br />
                            <span class="text-danger" v-show="errors.has('DecisionTime')">{{ errors.first('DecisionTime') }}</span>
                        </div>-->

                                <div class="col-sm-4 pleft0 pl15_992">
                                    <label>Тип атаки</label>
                                    <select2 class="form-control m-b"
                                             v-model="model.AttackType"
                                             name="AttackType"
                                             :options="Dictionaries.Attacks"
                                             data-vv-as="Тип атаки"
                                             :allowClear="false"
                                             v-validate="'required'" />
                                    <span class="text-danger" v-show="errors.has('AttackType')">{{ errors.first('AttackType') }}</span>
                                </div>
                                <div class="col-sm-4 pleft0 pl15_992">
                                    <label>Уровень критичности</label>
                                    <select2 class="form-control m-b"
                                             v-model="model.Criticality"
                                             name="Severity"
                                             :options="Dictionaries.Severity"
                                             data-vv-as="Уровень критичности"
                                             :allowClear="false"
                                             v-validate="'required'" />
                                    <span class="text-danger" v-show="errors.has('Severity')">{{ errors.first('Severity') }}</span>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="pull-left">
                                        <label>Описание компьютерной атаки</label>
                                    </div>
                                    
                                  	<div class="hwt-container">
                                        <div class="hwt-backdrop">
                                            <div class="hwt-highlights hwt-content"></div>
                                        </div>
                                        <textarea v-model="model.Description" 
                                              id="description"
                                              :class="['form-control resize-input hwt-input hwt-content']"
                                              name="Description"
                                              data-vv-as="Описание"
                                              v-validate="'required'"
                                              rows="6">
                                        </textarea>
                                    </div>
                                    <span class="text-danger" v-show="errors.has('Description')">{{ errors.first('Description') }}</span>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12 ptop5">
                                    Источник
                                </div>
                                <div class="col-sm-4">
                                    <label class="font12">URL</label>
                                    <input v-model="model.SourceURL" type="text" placeholder="" class="form-control"
                                           name="SourceURL"
                                           v-validate="'url'"
                                           data-vv-as="URL">
                                    <span class="text-danger" v-show="errors.has('SourceURL')">{{ errors.first('SourceURL') }}</span>
                                </div>
                                <div class="col-sm-2 pleft0 pl15_992">
                                    <label class="font12">IP адрес</label>
                                    <input v-model="model.SourceIP" type="text" placeholder="" class="form-control"
                                           name="SourceIP"
                                           v-validate="'ip'"
                                           data-vv-as="IP адрес">
                                    <span class="text-danger" v-show="errors.has('SourceIP')">{{ errors.first('SourceIP') }}</span>
                                </div>

                                <div class="col-sm-3 pleft0 pl15_992">
                                    <label class="font12">Страна</label>
                                    <input v-model="model.SourceCountry" type="text" placeholder="" class="form-control"
                                           name="SourceCountry"
                                           data-vv-as="Страна">
                                    <span class="text-danger" v-show="errors.has('SourceCountry')">{{ errors.first('SourceCountry') }}</span>
                                </div>
                                <div class="col-sm-3 pleft0 pl15_992">
                                    <label class="font12">Адрес</label>
                                    <input v-model="model.SourceAddress" type="text" placeholder="" class="form-control"
                                           name="SourceAddress"
                                           data-vv-as="Адрес">
                                    <span class="text-danger" v-show="errors.has('SourceAddress')">{{ errors.first('SourceAddress') }}</span>
                                </div>
                            </div>

                            <div class="col-md-12 ptop5 pleft0">Назначение (Ресурсы, на которые направлена компьютерная атака)</div>

                            <div class="row mb5">
                                <div class="col-sm-4">
                                    <label class="font12">Оборудование</label>
                                    <select2 class="form-control" v-model="model.SourceEquipmentId"
                                             name="SourceEquipmentId"
                                             data-vv-as="Оборудование"
                                             v-validate="'required'"
                                             :allowClear="false"
                                             :options="equipmentDict" />
                                    <span class="text-danger" v-show="errors.has('SourceEquipmentId')">{{ errors.first('SourceEquipmentId') }}</span>
                                </div>

                                <div class="col-sm-2 pleft0 pl15_992">
                                    <label class="font12">IP адрес</label>
                                    <input type="text" v-model="equipmentIp" readonly placeholder="IP адрес" class="form-control">
                                </div>
                                <div class="col-sm-3 pleft0 pl15_992">
                                    <label class="font12">Объект</label>
                                    <input type="text" :value="getObjectName()" readonly placeholder="Объект" class="form-control">
                                </div>
                                <div class="col-sm-3 pleft0 pl15_992">
                                    <label class="font12">Адрес</label>
                                    <input type="text" :value="getObjectAddress()" readonly placeholder="Адрес" class="form-control">
                                </div>

                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-12">
                                <label>Способ выявления компьютерной атаки</label>
                                <input v-model="model.DetectionMethod" type="text" placeholder="" class="form-control"
                                       name="DetectionMethod"
                                       data-vv-as="Способ выявления">
                                <span class="text-danger" v-show="errors.has('DetectionMethod')">{{ errors.first('DetectionMethod') }}</span>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-12">
                                <label>Связь с другими инцидентами</label>
                                <select2 class="form-control m-b"
                                         id="relatedIncidents"
                                         placeholder="Связанные инциденты"
                                         name="RelatedIncidents"
                                         data-vv-as="Связанный инцидент"
                                         :multiple="true"
                                         :options="RelatedIncidents"
                                         @input="setRelatedIncident"
                                         :value="model.RelatedIncidents" />
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <Form ref="editForm" v-if="showEditForm"
                  :key="'incident_' + model.Id"
                  :Model="model"
                  :RelatedIncidentsDict="RelatedIncidents"
                  :EquipmentIp="equipmentIp"
                  @saved="onSaved(model.Id)"
                  @cancel="cancel"
                  @statusSet="openIncident(model.Id)" />
        </div>

    </div>
</template>

<script lang="ts" src="./index.ts">
</script>
