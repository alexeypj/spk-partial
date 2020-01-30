<template>    
    <div class="ibox" id="incdiv_center">

        <div class="ibox-title newh_ibox">
            <ul class="nav nav-tabs inctab">
                <li class="active"><a data-toggle="tab" href="#tab-1">Описание</a></li>
                <li class=""><a data-toggle="tab" href="#tab-2">История изменений</a></li>
            </ul>
        </div>

        <div class="equip_btn_r21" v-if="IsSuperAdminOrPaidAccess">
            <transition name="fade">
                <div class="pull-left alert alert-success eq_div" role="alert" v-if="isSaved">
                    Сохранено
                </div>
                <div class="pull-left" v-if="errorText">
                    <div class="pull-left alert alert-danger eq_div" role="alert">
                        Ошибка: {{ errorText }}
                    </div>
                </div>
            </transition>
            <div class="pull-left">
                <cancel-button @click="cancel" :isSaving="isFormDisabled" text="К списку" />
                <save-button @click="store" :isSaving="IsIncidentSaving" :disabled="isFormDisabled || isIncidentClosed || IsIncidentSaving"  />
                <input id="fileSelector" type="file" multiple class="hide" @change="getFileName" />
            </div>
        </div>

        <div class="ibox-content pleft15 pright15" style="border-top: none;">
            <div class="tab-content">
                <div id="tab-1" class="tab-pane active">
                    <div class="form-group">
                        <div class="row mb5">
                            <div class="col-md-12 col-sm-12 col-lg-12">
                                <label>Название</label>
                                <input :disabled="isFormDisabled"
                                       v-model="model.Title" type="text" placeholder="" class="form-control"
                                       name="Title"
                                       data-vv-as="Название"
                                       v-validate="'required|min:3'">
                                <span class="text-danger" v-show="errors.has('Title')">{{ errors.first('Title') }}</span>
                            </div>

                            <div class="col-md-3 col-sm-6 col-lg-3 pl15_992">
                                <label>Время фиксации</label>
                                <date-pick v-model="model.FixationTime" :disabled="isFormDisabled"
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
                                           name="FixationTime"
                                           data-vv-as="Время фиксации"
                                           v-validate="'required'">
                                </date-pick><br />
                                <span class="text-danger" v-show="errors.has('FixationTime')">{{ errors.first('FixationTime') }}</span>
                            </div>
                            <div class="col-md-3 col-sm-6 pleft0 col-lg-3 pl15_992">
                                <label>Время окончания</label>
                                <date-pick v-model="model.DecisionTime" :disabled="isFormDisabled"
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
                                           data-vv-as="Время окончания">
                                </date-pick><br />
                                <span class="text-danger" v-show="errors.has('DecisionTime')">{{ errors.first('DecisionTime') }}</span>
                            </div>
                            <div class="col-md-3 col-sm-6 pleft0 pl15_992">
                                <label>Тип атаки</label>
                                <select2 class="form-control m-b" :disabled="isFormDisabled"
                                         v-model="model.AttackType"
                                         name="AttackType"
                                         :options="Dictionaries.Attacks"
                                         data-vv-as="Тип атаки"
                                         :allowClear="false"
                                         v-validate="'required'" />
                                <span class="text-danger" v-show="errors.has('AttackType')">{{ errors.first('AttackType') }}</span>
                            </div>
                            <div class="col-md-3 col-sm-6 pleft0 pl15_992">
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
                        <div class="row mb5">
                            <div class="col-md-12">
                                   <div class="pull-left">
                                        <label>Описание компьютерной атаки</label>
                                    </div>                                    
                                  	<div class="hwt-container">
                                        <div class="hwt-backdrop">
                                            <div class="hwt-highlights hwt-content"></div>
                                        </div>
                                        <textarea :disabled="isFormDisabled"
                                              v-model="model.Description" 
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

                        <fieldset>
                            <legend>
                                <a @click="showAdditionalInfo=!showAdditionalInfo">
                                    {{showAdditionalInfo ? 'Скрыть' : 'Раскрыть'}}
                                    <i :class="['fa', showAdditionalInfo ? 'fa-sort-asc' : 'fa-sort-desc']"></i>
                                </a>
                            </legend>

                            <div v-if="showAdditionalInfo">

                                <div class="row mb5">
                                    <div class="col-md-12 ptop5">
                                        Источник
                                    </div>
                                    <div class="col-sm-4">
                                        <label class="font12">URL</label>
                                        <input :disabled="isFormDisabled"
                                               v-model="model.SourceURL"
                                               type="text"
                                               placeholder=""
                                               class="form-control"
                                               name="SourceURL"
                                               data-vv-as="URL"
                                               v-validate="'url'">
                                        <span class="text-danger" v-show="errors.has('SourceURL')">{{ errors.first('SourceURL') }}</span>
                                    </div>
                                    <div class="col-sm-2 pleft0 pl15_992">
                                        <label class="font12">IP адрес</label>
                                        <input :disabled="isFormDisabled"
                                               v-model="model.SourceIP"
                                               type="text" placeholder=""
                                               class="form-control"
                                               name="SourceIP"
                                               data-vv-as="IP адрес"
                                               v-validate="'ip'">
                                        <span class="text-danger" v-show="errors.has('SourceIP')">{{ errors.first('SourceIP') }}</span>
                                    </div>

                                    <div class="col-sm-3 pleft0 pl15_992">
                                        <label class="font12">Страна</label>
                                        <input :disabled="isFormDisabled"
                                               v-model="model.SourceCountry"
                                               type="text"
                                               placeholder=""
                                               class="form-control"
                                               name="SourceCountry"
                                               data-vv-as="Страна"
                                               v-validate="">
                                        <span class="text-danger" v-show="errors.has('SourceCountry')">{{ errors.first('SourceCountry') }}</span>
                                    </div>
                                    <div class="col-sm-3 pleft0 pl15_992">
                                        <label class="font12">Адрес</label>
                                        <input :disabled="isFormDisabled"
                                               v-model="model.SourceAddress"
                                               type="text" placeholder=""
                                               class="form-control"
                                               name="SourceAddress"
                                               data-vv-as="Адрес"
                                               v-validate="">
                                        <span class="text-danger" v-show="errors.has('SourceAddress')">{{ errors.first('SourceAddress') }}</span>
                                    </div>
                                </div>

                                <div class="col-md-12 ptop5 pleft0">Назначение (Ресурсы, на которые направлена компьютерная атака)</div>

                                <div class="row mb5">
                                    <div class="col-sm-4">
                                        <label class="font12">Оборудование</label>
                                        <div class="dflex">
                                            <select2 :disabled="isFormDisabled"
                                                     class="form-control"
                                                     v-model="model.SourceEquipmentId"
                                                     name="SourceEquipmentId"
                                                     data-vv-as="Оборудование"
                                                     v-validate="'required'"
                                                     :allowClear="false"
                                                     :options="equipmentDict" />
                                            <span class="text-danger" v-show="errors.has('SourceEquipmentId')">{{ errors.first('SourceEquipmentId') }}</span>
                                            <button @click="openEquipment()" class="btn btn-white btn-small btn-left0" title="Перейти к оборудованию"><i class="fa fa-arrow-right"></i></button>
                                        </div>
                                    </div>

                                    <div class="col-sm-2 pleft0 pl15_992">
                                        <label class="font12">IP адрес</label>
                                        <input type="text" v-model="equipmentIp" readonly placeholder="IP адрес" class="form-control">
                                    </div>
                                    <div class="col-sm-3 pleft0 pl15_992">

                                        <label class="font12">Объект</label>
                                        <div class="dflex">
                                            <input type="text" :value="getObjectName()" readonly placeholder="Объект" class="form-control">
                                            <button @click="openObject()" class="btn btn-white btn-small btn-left0" title="Перейти к объекту"><i class="fa fa-arrow-right"></i></button>
                                        </div>


                                    </div>
                                    <div class="col-sm-3 pleft0 pl15_992">
                                        <label class="font12">Адрес</label>
                                        <input type="text" :value="getObjectAddress()" readonly placeholder="Адрес" class="form-control">
                                    </div>

                                </div>

                                <div class="row mb5 ptop5">
                                    <div class="col-md-12">
                                        <label>Способ выявления компьютерной атаки</label>
                                        <input :disabled="isFormDisabled"
                                               v-model="model.DetectionMethod"
                                               type="text"
                                               placeholder=""
                                               class="form-control"
                                               name="DetectionMethod"
                                               data-vv-as="Способ выявления"
                                               v-validate="">
                                        <span class="text-danger" v-show="errors.has('DetectionMethod')">{{ errors.first('DetectionMethod') }}</span>
                                    </div>
                                </div>

                                <div class="row mb5">
                                    <div class="col-md-12 sv_select2">
                                        <label>Связь с другими инцидентами</label>
                                        <select2 :disabled="isFormDisabled"
                                                 class="form-control m-b"
                                                 id="relatedIncidents"
                                                 placeholder="Связанные инциденты"
                                                 name="RelatedIncidents"
                                                 data-vv-as="Связанный инцидент"
                                                 :multiple="true"
                                                 :value="model.RelatedIncidents"
                                                 :options="RelatedIncidents"
                                                 @input="setRelatedIncident" />
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-9">
                                        <div class="form-group">
                                            <div class="col-md-12" style="align-items:center; padding-left:0; vertical-align:top">
                                                <template v-if="IsFileListLoading">
                                                    <i class="fa fa-spinner fa-spin fa-2x fa-fw"></i>
                                                </template>
                                                <template v-else>
                                                    <div class="row no-margins" style="padding-right: 10px">
                                                        <a @click="openFileDialog" v-if="!isFormDisabled" title="Добавить документ">
                                                            <i class="fa fa-plus mr5" aria-hidden="true"></i>Документы
                                                        </a>
                                                    </div>
                                                    <div class="row no-margins">
                                                        <div v-for="(file,idx) in selectedFiles" :key="'new_' + file.name + '_' + file.size" class="pull-left">
                                                            {{ file.name }} <span>({{ getFileSize(file.size) }}) </span> <a v-if="!isFormDisabled" @click="removeFile(idx)"><i class="fa fa-times" aria-hidden="true"></i></a>;&nbsp;
                                                        </div>
                                                        <!--
                                                    <template v-if="readonly">
                                                        <div v-for="(file,idx) in Files" :key="file.Name + '_' + file.Size">
                                                            <a @click="openFile(file)" target="_blank">
                                                                {{ file.Name }} <span>({{ getFileSize(file.Size) }}) </span> <a v-if="!IsLoading" @click="removeFile(idx)"><i class="fa fa-times" aria-hidden="true"></i></a>
                                                            </a>
                                                        </div>
                                                    </template>	 -->
                                                        <template>
                                                            <div v-for="(file,idx) in existingFiles" :key="file.Name + '_' + file.Size" class="pull-left">
                                                                <a @click="openFile(file)" target="_blank">
                                                                    {{ file.Name }} <span>({{ getFileSize(file.Size) }}) </span>
                                                                </a>
                                                                <a v-if="!isFormDisabled" @click="addToRemovedFiles(idx)"><i class="fa fa-times" aria-hidden="true"></i></a>
                                                            </div>
                                                        </template>
                                                    </div>
                                                </template>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-3 text-right">
                                        <button class="btn btn-white btn-sm mb0" :disabled="isFormDisabled" @click="showRelatedArticles" title="Показать совпадения в базе знаний">
                                            <i class="fa fa-search"></i>
                                        </button>
                                        <button class="btn btn-white btn-sm mb0" @click="addToKnowledgeBase" :disabled="isFormDisabled" title="Добавить в БЗ">
                                            <i class="fa fa-plus-square"></i>
                                        </button>
                                    </div>
                                </div>

                            </div>

                            <div v-else style="position: relative">
                                <div>
                                    <label>Источник: </label>
									<span>
										<template v-if="model.SourceURL">{{ model.SourceURL }}; </template>
										<template v-else><span title="Не указан URL источника">&ndash;&nbsp;; </span></template>
										<template v-if="model.SourceIP">{{ model.SourceIP }}; </template>
										<template v-else><span title="Не указан IP-адрес источника">&ndash;&nbsp;; </span></template>
										<template v-if="model.SourceCountry">{{ model.SourceCountry }}; </template>
										<template v-else><span title="Не указана страна источника">&ndash;&nbsp;; </span></template>
										<template v-if="model.SourceAddress">{{ model.SourceAddress }}; </template>
										<template v-else><span title="Не указан адрес источника">&ndash;&nbsp;; </span></template>
									</span>
                                </div>
                                <div>
                                    <label>Назначение: </label>
                                    <span>{{ equipmentName }}; {{equipmentIp}}; {{getObjectName()}}; {{ getObjectAddress() }}</span>
                                </div>
                                <div style="position: absolute; top: 0px; right: 0px;">
                                    <span v-if="existingFiles.length" title="Прикреплены документы">
                                        <i class="fa fa-file-text"></i>
                                    </span>
                                    <span v-if="model.RelatedIncidents.length" title="Установлена связь с другими инцидентами">
                                        <i class="fa fa-link"></i>
                                    </span>
                                    <span v-if="model.DetectionMethod" title="Указан способ выявления компьютерной атаки">
                                        <i class="fa fa-drivers-license-o"></i>
                                    </span>
                                </div>
                            </div>

                        </fieldset>



                        <div class="row">
                            <div class="col-md-12">
                                <label>Рекомендации по блокировке</label>
                                <textarea :disabled="isFormDisabled"
                                          v-model="model.BlockingRecommendations"
                                          class="form-control"
                                          name="BlockingRecommendations"
                                          data-vv-as="Рекомендации по блокировке"
                                          @focus="setPopupTimer"
                                          @blur="clearPopupTimer"
                                          v-validate="''">
                                        </textarea>
                                <span class="text-danger" v-show="errors.has('BlockingRecommendations')">{{ errors.first('BlockingRecommendations') }}</span>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <label>Рекомендации по устранению последствий</label>
                                <textarea :disabled="isFormDisabled"
                                          v-model="model.MitigationRecommendations"
                                          class="form-control"
                                          name="MitigationRecommendations"
                                          data-vv-as="Рекомендации по устранению последствий"
                                          @focus="setPopupTimer"
                                          @blur="clearPopupTimer"
                                          v-validate="''">
                                        </textarea>
                                <span class="text-danger" v-show="errors.has('MitigationRecommendations')">{{ errors.first('MitigationRecommendations') }}</span>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <label>Рекомендации по предотвращению подобных инцидентов</label>
                                <textarea :disabled="isFormDisabled"
                                          v-model="model.PreventionRecommendations"
                                          class="form-control"
                                          name="PreventionRecommendations"
                                          data-vv-as="Рекомендации по предотвращению подобный инцидентов"
                                          @focus="setPopupTimer"
                                          @blur="clearPopupTimer"
                                          v-validate="''">
                                        </textarea>
                                <span class="text-danger" v-show="errors.has('PreventionRecommendations')">{{ errors.first('PreventionRecommendations') }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="ptop5 mb5">
                        <small>Создание: {{ formatDate(Model.CreateDate) }} ({{ getFio(Model.CreatorUser) }})</small>;
                        <small>Обновление: {{ formatDate(Model.UpdateDate) }} ({{ getFio(Model.UpdaterUser) }})</small>
                    </div>

                    <div class="panel-title m-b-xs">
                        <div v-if="IsIncidentLoading">
                            <div class="row">
                                <div class="col-md-12">
                                    <i class="fa fa-spinner fa-spin fa-2x fa-fw"></i> Загрузка
                                </div>
                            </div>
                        </div>
                        <h5 style="font-weight:normal !important;font-size:13px;" v-else>
                            <template v-if="Model.Status">
                                <span class="text-navy">{{ Model.Status.Name }}</span> -
                                <span class="text-navy">{{ Model.Status.ResponsibleRole.Name }}</span>
                                <i class="fa fa-history pleft5" style="color:#999;"></i>
                            </template>
                        </h5>
                    </div>
                    <div class="col-md-12 pleft0 m-b-sm" v-if="!isFormDisabled && canChangeStatus">
                        <button :class="['btn btn-small mr5', getStatusBtnClass(nextStatus.FinalStatusId)]" v-for="nextStatus in Model.Status.Transitions" :key="'status_' + nextStatus.FinalStatusId" @click="setStatus(nextStatus.FinalStatusId)">
                            {{ nextStatus.ButtonContent }}
                        </button>
                    </div>
                </div>
                <div id="tab-2" class="tab-pane">
                    <History :history="history"
                        :Id="model.Id" 
                             :usersDictionary="Users"
                             :statusDictionary="Statuses"
                             :attackTypeDictionary="Dictionaries.Attacks"
                             :equipmentDictionary="Dictionaries.Equipments"
                             :criticalityDictionary="Dictionaries.Severity" />
                </div>
            </div>
        </div>

        <Modal @cancel="cancelChangingStatus"
               v-show="showChangeStatusModel"
               okText="Сохранить"
               :showFooter="false"
               :title="statusButtonContent">
            <template slot="body" v-if="targetStatus">
                <div class="form-horizontal">
                    <transition name="fade">
                        <div class="row" v-if="errorText">
                            <div class="pull-left col-xs-12 alert alert-danger" role="alert">
                                Ошибка: {{ errorText }}
                            </div>
                        </div>
                    </transition>
                    <div class="row">
                        <div class="col-xs-12">
                            <div class="form-group">
                                <label class="col-sm-12 ">
                                    Статус инцидента изменится на <strong>{{ targetStatus.Name }}</strong>.
                                    Инцидент будет передан в <strong>{{ targetStatus.ResponsibleRole.Name }}</strong>.
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-12">
                            <div class="form-group">
                                <label class="col-sm-12 ">Комментарий</label>
                                <div class="col-sm-12">
                                    <textarea class="form-control" v-model="statusComment" rows="5"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-12 text-right ptop15">
                            <cancel-button className="btn btn-white btn-small" @click="cancelChangingStatus" :isSaving="IsLoading" />
                            <save-button className="btn btn-success btn-small" @click="storeStatus" :isSaving="IsLoading" />
                        </div>
                    </div>
                </div>
            </template>
        </Modal>
        <Modal @cancel="closePopup"
               :showFooter="false"
               v-if="showPopup">
            <KbArticles :key="model.Id"
                        :IncidentId="model.Id"
                        @cancel="closePopup"
                        slot="body" />
        </Modal>
    </div>    
</template>

<script src="./form.ts" lang="ts">
</script>

<style>
	.articleMatch {
		padding-bottom: 15px;
		border: 0px solid #ccc;
		border-bottom: 1px;
	}

	.articleInfo {
		padding-right:10px;
	}
</style>