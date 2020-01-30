<template>
    <div class="col-md-300px col-sm-offset-4" style="margin-top:50px">

        <div class="m-t text-center" role="form" v-if="Settings.Logo.LoginLogo">
            <img :src="Settings.Logo.LoginLogo" style="width:130px" />
            <br />


            <!--<h3>Вход в систему</h3>
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
    </div>-->
            <div class="text-left">
                Тестовый кабинет не поддерживается текущей версией Сопки
            </div>

            <div class="row">
                <div class="col-md-6 text-left">
                    <router-link to="/"><small>На главную</small></router-link>
                </div>
            </div>

        </div>

    </div>

</template>
<script lang="ts" src="./NoDemo.ts"></script>