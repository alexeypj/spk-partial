
<template>
    <div class="col-md-4 col-md-offset-4 m-t text-center" v-if="Settings.Logo.LoginLogo">
        <img :src="Settings.Logo.LoginLogo" style="width:130px" />            
        <br />            
        <h3>Сброс пароля</h3>
        <div class="m-t" role="form">
            <div class="form-group">
                <input v-model="email"
                       :class="['form-control', {'required-validation-error' : errors.has('email')}]"
                       id="email"
                       placeholder="Email"
                       name="email"
                       data-vv-as="Email"
                       v-validate="'required'" />
                <span class="text-danger" v-show="errors.has('email')">{{ errors.first('email') }}</span>
            </div>
            <div class="form-group">
                <input type="password" 
                       v-model="newPassword"
                       :class="['form-control', {'required-validation-error' : errors.has('newPassword')}]"
                       id="newPassword"
                       placeholder="Новый пароль"
                       name="newPassword"
                       data-vv-as="Новый пароль"
                       v-validate="'required'" />
                <span class="text-danger" v-show="errors.has('newPassword')">{{ errors.first('newPassword') }}</span>
            </div>
            <div class="form-group">
                <input type="password"
                       v-model="confirmNewPassword"
                       :class="['form-control', {'required-validation-error' : errors.has('confirmNewPassword')}]"
                       id="confirmNewPassword"
                       placeholder="Подтверждение пароля"
                       name="confirmNewPassword"
                       data-vv-as="Подтверждение пароля"
                       v-validate="'required'" />
                <span class="text-danger" v-show="errors.has('confirmNewPassword')">{{ errors.first('confirmNewPassword') }}</span>
            </div>
            <transition name="fade">
                <div class="" v-if="errorText">
                    <div class="pull-left col-xs-12 alert alert-danger" role="alert">
                        Ошибка: {{ errorText }}
                    </div>
                </div>
            </transition>
            <button @click="reset" type="button" class="btn btn-primary block full-width m-b">Сбросить пароль</button>

        </div>
    </div>
</template>

<script lang="ts" src="./ResetPassword.ts"></script>
