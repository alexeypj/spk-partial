<template>
    <div class="form-horizontal">
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
        <div class="row">
            <div class="col-xs-12">
                <div class="form-group">
                    <label class="col-sm-12 ">Email</label>
                    <div class="col-sm-12">
                        <input type="text" v-model="email"
                               :class="['form-control', {'required-validation-error' : errors.has('email')}]"
                               id="email"
                               placeholder="Email"
                               name="email"
                               data-vv-as="Название"
                               v-validate="'required|email'" />
                        <span class="text-danger" v-show="errors.has('email')">{{ errors.first('email') }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
			<div class="col-xs-12 text-right ptop15">
				<button class="btn btn-white btn-small" @click="$emit('cancel', true)" :disabled="isSaving">Отмена</button>
				<button class="btn btn-success btn-small" @click="recover" :disabled="isSaving">Отправить</button>
			</div>
        </div>
    </div>
</template>
<script lang="ts" src="./AccessRecovery.ts"></script>