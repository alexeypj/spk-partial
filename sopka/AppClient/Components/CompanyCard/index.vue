<template>

    <div class="h100 inv objdiv">
        <div class="col-md-12 col-sm-12 col-xs-12 pright0 h100 eqmap pleft0">

            <div class="ibox float-e-margins borderbottom">
                <div class="ibox-title newh_ibox">
                    <h5>
                        Карточка компании
                    </h5>

                    <div class="equip_btn">
                        <transition name="fade">
                            <div class="pull-left alert alert-success eq_div" role="alert" v-if="isSaved">
                                Сохранено
                            </div>
                            <div class="pull-left alert alert-danger eq_div" role="alert" v-if="errorText">
                                {{ errorText }}
                            </div>
                        </transition>
                        <div class="pull-right">
                            <button type="button" class="btn btn-info mr5" @click="showChangeTariffForm = true" v-if="readonly">Сменить тариф</button>
                            <button type="button" class="btn btn-success mr5" @click="edit" v-if="readonly">Редактировать</button>
                            <button class="btn btn-white" @click="cancel" :disabled="isSaving" v-if="!readonly">Отмена</button>
                            <save-button className="btn btn-success mr5" @click="store" v-if="!readonly" :isSaving="isSaving" />
                            &nbsp;
                        </div>
                    </div>
                </div>
            </div>


            <div class="col-md-8" v-if="model">
                <div class="form-horizontal equipform">

                    <div class="form-group">
                        <label class="col-lg-2 control-label w100">Название</label>
                        <div class="col-md-12">
                            <template v-if="!readonly">
                                <input type="text"
                                       :class="['form-control', {'required-validation-error' : errors.has('Name')}]"
                                       id="Name"
                                       placeholder="Наименование"
                                       v-model="model.Name"
                                       name="Name"
                                       data-vv-as="Наименование"
                                       v-validate="'required|min:3'" />
                                <span class="text-danger" v-show="errors.has('Name')">{{ errors.first('Name') }}</span>
                            </template>
                            <p class="form-control-static" v-else>{{ model.Name }}</p>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-lg-2 control-label w100">ФИО ответственного лица</label>
                        <div class="col-md-12">
                            <template v-if="!readonly">
                                <input type="text"
                                       :class="['form-control', {'required-validation-error' : errors.has('ResponsiblePersonFIO')}]"
                                       id="ResponsiblePersonFIO"
                                       placeholder="ФИО ответственного лица"
                                       v-model="model.ResponsiblePersonFIO"
                                       name="ResponsiblePersonFIO"
                                       data-vv-as="ФИО ответственного лица"
                                       v-validate="'required|min:3'" />
                                <span class="text-danger" v-show="errors.has('ResponsiblePersonFIO')">{{ errors.first('ResponsiblePersonFIO') }}</span>
                            </template>
                            <p class="form-control-static" v-else>{{ model.ResponsiblePersonFIO }}</p>
                        </div>
                    </div>

                    <div class="form-group">
                        <div class="float-left col-md-6">
                            <label for="contactPhone" class="col-lg-2 control-label w100 pleft0">Телефон</label>
                            <div class="col-md-12 pleft0 pright0">
                                <template v-if="!readonly">
                                    <input type="text"
                                           :class="['form-control', {'required-validation-error' : errors.has('ResponsiblePersonPhone')}]"
                                           id="ResponsiblePersonPhone"
                                           placeholder="Телефон ответственного лица"
                                           v-model="model.ResponsiblePersonPhone"
                                           name="ResponsiblePersonPhone"
                                           data-vv-as="Телефон ответственного лица"
                                           v-validate="'phoneNumber|required'" />
                                    <span class="text-danger" v-show="errors.has('ResponsiblePersonPhone')">{{ errors.first('ResponsiblePersonPhone') }}</span>
                                </template>
                                <p class="form-control-static" v-else>{{ model.ResponsiblePersonPhone }}</p>
                            </div>
                        </div>
                        <div class="float-left col-md-6">
                            <label for="contactMail" class="col-lg-2 control-label w100 pleft0">E-Mail</label>
                            <div class="col-md-12 pleft0 pright0">
                                <template v-if="!readonly">
                                    <input type="text"
                                           :class="['form-control', {'required-validation-error' : errors.has('ResponsiblePersonEmail')}]"
                                           id="ResponsiblePersonEmail"
                                           placeholder="Email ответственного лица"
                                           v-model="model.ResponsiblePersonEmail"
                                           name="ResponsiblePersonEmail"
                                           data-vv-as="Email ответственного лица"
                                           v-validate="'required|email'" />
                                    <span class="text-danger" v-show="errors.has('ResponsiblePersonEmail')">{{ errors.first('ResponsiblePersonEmail') }}</span>
                                </template>
                                <p class="form-control-static" v-else>{{ model.ResponsiblePersonEmail }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="form-group" v-if="readonly">
                        <label class="col-lg-2 control-label w100">Текущий тариф</label>
                        <div class="col-md-12">
                            <p class="form-control-static" v-if="currentTariff">{{ currentTariff.Name }}</p>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-lg-2 control-label w100">Комментарии</label>
                        <div class="col-md-12">
                            <template v-if="!readonly">
                                <textarea class="form-control" v-model="model.Comment" rows="3">
                                </textarea>
                            </template>
                            <p class="form-control-static" v-else>{{ model.Comment }}</p>
                        </div>
                    </div>

                </div>
            </div>

            <div class="col-md-4" v-if="CompanyCard && readonly">
                <div class="form-horizontal equipform">

                    <div class="form-group">
                        <label class="col-lg-2 control-label w100">Текущее количество пользвателей</label>
                        <div class="col-md-12">
                            <p class="form-control-static">{{ CompanyCard.CurrentUsersCount }} из {{ CompanyCard.MaxUsersCount}}</p>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-lg-2 control-label w100">Текущее количество объектов</label>
                        <div class="col-md-12">
                            <p class="form-control-static" >{{ CompanyCard.CurrentObjectsCount }} из {{ CompanyCard.MaxObjectsCount}}</p>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-lg-2 control-label w100">Текущее количество оборудования</label>
                        <div class="col-md-12">
                            <p class="form-control-static">{{ CompanyCard.CurrentEquipmentsCount }} из {{ CompanyCard.MaxEquipmentsCount}}</p>
                        </div>
                    </div>

                </div>
            </div>

        </div>


        <Modal @cancel="showChangeTariffForm = false"
               v-if="showChangeTariffForm"
               :showFooter="false"
               title="Изменение тарифа">
            <ChangeTariff slot="body" @cancel="showChangeTariffForm = false" @onChange="loadCompanyInfo" />
        </Modal>

    </div>

</template>
<script src="./index.ts" lang="ts"></script>