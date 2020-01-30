<template>
      <div>

        <div class="form-horizontal">
            <div class="form-group no-margins">
                <label for="fio" class="w100 control-label text-left">ФИО</label>
                <div class="w100">
                     <p class="form-control-static">{{ model.FIO }}</p>
                </div>
            </div>          
            <div class="form-group no-margins">
                <label for="email" class="w100 control-label text-left">Email</label>
                <div class="w100">
                   <p class="form-control-static">{{ model.Email }}</p>
                </div>
            </div>
            <div class="form-group no-margins">
                <label for="phoneNumber" class="w100 control-label text-left">Пароль</label>
				<div class="dflex">
					<div class="flexgrow mr5">
						<input type="text"
							   :class="['form-control', {'required-validation-error' : errors.has('Password')}]"
							   id="password"
							   placeholder="Пароль"
							   v-model="password"
							   name="Password"
							   data-vv-as="Пароль"
							   v-validate="'required'" />

						<span class="text-danger" v-show="errors.has('Password')">{{ errors.first('Password') }}</span>
					</div>
					<div>
						<button title="Сгенерировать пароль" @click="generatePassword()" class="btn btn-default"><i class="fa fa-refresh" aria-hidden="true"></i></button>
					</div>
				</div>
                
            </div>            
        </div>
		<div class="row mtop10 ptop15 no-margins">
			<div class="pull-right">
				<button class="btn btn-success pull-right btn-small" @click="store">Сохранить</button>
				<button class="btn btn-white mr5 pull-right btn-small" @click="cancel">Отменa</button>
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

<script src="./resetPassword.ts" lang="ts">
</script>
