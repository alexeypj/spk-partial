
<template>
    <div class="col-md-300px col-sm-offset-4" style="margin-top:50px" >
       
        <div class="m-t text-center" role="form" v-if="Settings.Logo.LoginLogo">
            <img :src="Settings.Logo.LoginLogo" style="width:130px" />            
            <br />            
            <h3>Вход в систему</h3>
            <div class="form-group">
                <input v-model="model.Email"
                       :class="['form-control', {'required-validation-error' : errors.has('Email')}]"
                       v-on:keyup.enter="onSubmit"
                       id="Email"
                       placeholder="Email"
                       name="Email"
                       data-vv-as="Email"
                       v-validate="'required'" />
                <span class="text-danger" v-show="errors.has('Email')">{{ errors.first('Email') }}</span>
            </div>
            <div class="form-group">
                <input type="password"
                       v-model="model.Password"
                       v-on:keyup.enter="onSubmit"
                       :class="['form-control', {'required-validation-error' : errors.has('Password')}]"
                       id="Password"
                       placeholder="Пароль"
                       name="Password"
                       data-vv-as="Пароль"
                       v-validate="'required'" />
                <span class="text-danger" v-show="errors.has('Password')">{{ errors.first('Password') }}</span>
            </div>
            <error-text :text="errorText" />
            <button @click="onSubmit" type="button" class="btn btn-primary block full-width m-b" :disabled="isSaving">Войти</button>

            <div class="row">
                <div class="col-md-6 text-left"> <a @click="restore" v-if="Settings.IsLimited == false"><small>Восстановить доступ</small></a></div>
                <div class="col-md-6"> <a @click="openSupportModal" class="pull-right"><small>Связаться с поддержкой</small></a></div>
            </div>
            <div class="row">
                <div class="col-md-6 text-left"> 
                    <router-link to="/Login/Registration" v-if="Settings.IsLimited == false" ><small>Регистрация</small></router-link>
                </div>
            </div>



        </div>

        <Modal @cancel="closeRestoreModal"
               v-show="showRestoreModal"
               okText="Ок"
               :showFooter="false"
               title="Восстановление доступа">
            <AccessRecovery slot="body" @cancel="closeRestoreModal" />
        </Modal>

        <Modal @cancel="closeSupportModal"
               v-show="showSupportModal"
               okText="Ок"
               :showFooter="false"
               title="Связь с поддержкой">
            <Support slot="body" @cancel="closeSupportModal" />
        </Modal>

    </div>
</template>

<script lang="ts" src="./index.ts"></script>

<style>
    .login-validation-summary ul {
        list-style-type: none;
        padding-left: 0px;
    }
</style>
