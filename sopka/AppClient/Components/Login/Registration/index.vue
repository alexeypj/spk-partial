<template>
    <div class="col-md-300px col-sm-offset-4" style="margin-top:50px">

        <div class="m-t text-center" role="form" v-if="Settings.Logo.LoginLogo">
            <img :src="Settings.Logo.LoginLogo" style="width:130px" />
            <br />
            <h3>Регистрация</h3>
            <div class="form-group">
                <input type="text" v-model="model.AdminEmail"
                       :class="['form-control', {'required-validation-error' : errors.has('AdminEmail')}]"
                       id="AdminEmail"
                       placeholder="Email"
                       name="AdminEmail"
                       data-vv-as="Email"
                       v-validate="'required|email'" />
                <span class="text-danger" v-show="errors.has('AdminEmail')">{{ errors.first('AdminEmail') }}</span>
            </div>
            <div class="form-group">
                <input type="text" v-model="model.FIO"
                       :class="['form-control', {'required-validation-error' : errors.has('FIO')}]"
                       id="FIO"
                       placeholder="ФИО"
                       name="FIO"
                       data-vv-as="ФИО"
                       v-validate="{required: true, min: 3, regex: /^[a-zA-Z\-\'\u0430-\u044f\s]+$/i }" />
                <span class="text-danger" v-show="errors.has('FIO')">{{ errors.first('FIO') }}</span>
            </div>
            <div class="form-group">
                <input type="text" v-model="model.PhoneNumber"
                       :class="['form-control', {'required-validation-error' : errors.has('PhoneNumber')}]"
                       id="PhoneNumber"
                       placeholder="Телефон"
                       name="PhoneNumber"
                       data-vv-as="Телефон"
                       v-validate="'phoneNumber|required'" />
                <span class="text-danger" v-show="errors.has('PhoneNumber')">{{ errors.first('PhoneNumber') }}</span>
            </div>
            <div class="form-group">
                <input type="text" v-model="model.companyName"
                       :class="['form-control', {'required-validation-error' : errors.has('CompanyName')}]"
                       id="CompanyName"
                       placeholder="Наименование компании"
                       name="CompanyName"
                       data-vv-as="Наименование компании"
                       v-validate="'required|min:3'" />
                <span class="text-danger" v-show="errors.has('CompanyName')">{{ errors.first('CompanyName') }}</span>
            </div>

            <div class="form-group text-left">
                <select2 class="form-control"
                         v-model="selectedTariffId"
                         name="TariffId"
                         :options="tariffsDic"
                         data-vv-as="Тариф"
                         placeholder="Тариф"
                         v-validate="'required'" />
                <span class="text-danger" v-show="errors.has('TariffId')">{{ errors.first('TariffId') }}</span>
            </div>


            <div class="text-left" v-if="selectedTariffId">
                <div class="text-left">После регистрации Вы сможете изменить тариф или его параметры, если захотите.</div>
                <div class="hr-line-dashed"></div>
                <h4>Уточните свой тариф</h4>
                <div class="form-group" v-if="isCloud">
                    <label class="control-label">
                        Количество пользователей
                    </label>
                    <div>
                        <div class="radio">
                            <label>
                                <input type="radio" checked="" v-model="model.UsersLimited" :value="false">
                                безлимит
                            </label>
                            <!--<span class="pull-right">6500 ₽/мес</span>-->
                        </div>
                        <div class="radio">
                            <div>
                                <label>
                                    <input type="radio" :value="true" v-model="model.UsersLimited">
                                    <input type="text"
                                           :class="['form-control', {'required-validation-error' : errors.has('UsersCount')}]"
                                           v-model="model.UsersCount"
                                           placeholder="Количество пользователей"
                                           v-validate="`${isCloud && model.UsersLimited ? 'required|between:1,100' : ''}`" 
                                           data-vv-as="Количество пользователей"
                                           name="UsersCount"
                                           />
                                    <span class="text-danger" v-show="errors.has('UsersCount')">{{ errors.first('UsersCount') }}</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label class="control-label">
                        Количество объектов ККИ
                    </label>
                    <div>
                        <div class="radio">
                            <label>
                                <input type="radio" checked="" v-model="model.ObjectsLimited" :value="true"> не более 100 объектов КИИ
                            </label>
                        </div>
                        <div class="radio">
                            <label>
                                <input type="radio" v-model="model.ObjectsLimited" :value="false"> безлимит на объекты КИИ (+2500 р./мес)
                            </label>
                        </div>
                    </div>
                </div>
                <div class="checkbox" v-if="isCloud">
                    <label> <input type="checkbox" v-model="model.Support"> расширенная техническая поддержка</label>
                </div>
                <div class="hr-line-dashed"></div>
            </div>
            <div class="text-left" v-else>

            </div>

            <transition name="fade">
                <div class="row" v-if="errorText">
                    <div class="pull-left col-xs-12 alert alert-danger" role="alert">
                        {{ errorText }}
                    </div>
                </div>
                <div class="row" v-if="successText">
                    <div class="pull-left col-xs-12 alert alert-success" role="alert">
                        {{ successText }}
                    </div>
                </div>
            </transition>
            <button @click="send" type="button" class="btn btn-primary block full-width m-b" :disabled="isSaving">Зарегистрироваться</button>

            <div class="row">
                <div class="col-md-6 text-left"> <router-link to="/Login"><small>Войти</small></router-link></div>
                <!--<div class="col-md-6"> <a @click="openSupportModal" class="pull-right"><small>Связаться с поддержкой</small></a></div>-->
            </div>


        </div>
    </div>

</template>
<script lang="ts" src=".\index.ts"></script>