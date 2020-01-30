<template>
   
	<div class="col-md-6 pleft0">
		<div class="btop4o">
			<div class="form-horizontal equipform">
				<transition name="fade">
					<div class="pull-leftalert alert-success alertsave" role="alert" v-if="isSaved">
						Сохранено
					</div>
					<div class="pull-leftalert alert-danger alertsave" role="alert" v-if="errorText">
						{{ errorText }}
					</div>
				</transition>
				<div class="form-group" v-if="!IsReadonly && model.Id == 0">
					<label for="objectName" class="col-lg-2 control-label w100">Название</label>
					<div class="col-md-12">						
						<input :class="['form-control', {'required-validation-error' : errors.has('ObjectName')}]"
							id="objectName"
							placeholder="Название"
							v-model="model.ObjectName"
							name="ObjectName"
							data-vv-as="Название"
							v-validate="'required|min:3'" />
						<span class="text-danger" v-show="errors.has('ObjectName')">{{ errors.first('ObjectName') }}</span>						
					</div>
				</div>
                <div v-if="!IsReadonly && model.Id > 0">
                    <input type="hidden" v-validate="'required|min:3'" v-model="model.ObjectName" />
                </div>
				<div class="form-group">
					<div class="col-md-12 float-left">
						<label for="objectAddress" class="col-lg-2 control-label w100" style="padding-left:0">Адрес</label>
						<div class="col-md-12 input-group">
							<template v-if="!IsReadonly">
								<input type="text"
									:class="['form-control', {'required-validation-error' : errors.has('ObjectAddress')}]"
									id="objectAddress"
									placeholder="Адрес"
									v-model="model.ObjectAddress"
									name="ObjectAddress"
									data-vv-as="Адрес"
									v-validate="'required|min:3'" />
								<div class="input-group-addon" title="Показать на карте" style="cursor: pointer" @click="mapSearch()">
									<i class="fa fa-map-marker" aria-hidden="true"></i>
								</div>
							</template>
							<p class="form-control-static" v-else>{{ model.ObjectAddress }}</p>
						</div>
						<div style="clear:both" class="text-danger col-md-12 pleft0" v-show="errors.has('ObjectAddress')">{{ errors.first('ObjectAddress') }}</div>
					</div>
					<div class="col-md-6 float-left" v-if="!IsReadonly || (IsReadonly && model.Latitude)">
						<label for="latitude" class="col-lg-2 control-label w100" style="padding-left:0">Широта</label>
						<div class="col-md-12" style="padding:0">
							<template v-if="!IsReadonly">
								<input type="text"
									:class="['form-control', {'required-validation-error' : errors.has('Latitude')}]"
									id="latitude"
									placeholder="Широта"
									v-model="model.Latitude"
									name="Latitude"
									data-vv-as="Широта"
									@change="checkCoordinates"
									v-validate="'decimal|min_value:-90|max_value:90'" />
								<span class="text-danger" v-show="errors.has('Latitude')">{{ errors.first('Latitude') }}</span>
							</template>
							<p class="form-control-static" v-if="IsReadonly && model.Latitude">{{ model.Latitude }}</p>
						</div>
					</div>
					<div class="col-md-6 float-left" v-if="!IsReadonly || (IsReadonly && model.Longitude)">
						<label for="longitude" class="col-lg-2 control-label w100" style="padding-left:0">Долгота</label>
						<div class="col-md-12" style="padding:0">
							<template v-if="!IsReadonly">
								<input type="text"
									:class="['form-control', {'required-validation-error' : errors.has('Longitude')}]"
									id="longitude"
									placeholder="Долгота"
									v-model="model.Longitude"
									name="Longitude"
									data-vv-as="Долгота"
									@change="checkCoordinates"
									v-validate="'decimal|min_value:-180|max_value:180'" />
								<span class="text-danger" v-show="errors.has('Longitude')">{{ errors.first('Longitude') }}</span>
							</template>
							<p class="form-control-static" v-else>{{ model.Longitude }}</p>
						</div>
					</div>
				</div>
				<div class="form-group">
					<div class="col-md-6 float-left">
						<label for="objectType" class="control-label w100 text-left pleft0">Тип объекта</label>
						<div :class="['col-md-12 pleft0 pright0' ,{'has-error': errors.has('ObjectType')}]">
							<template v-if="!IsReadonly">
								<select2 type="text"
										class="form-control"
										id="objectType"
										placeholder="Тип объекта"
										v-model="model.IdType"
										name="ObjectType"
										data-vv-as="Тип объекта"
										:options="ObjectTypes"
                                        :allowClear="false"
										v-validate="'required|min_value:1'" />
								<span class="text-danger" v-show="errors.has('ObjectType')">{{ errors.first('ObjectType') }}</span>
							</template>
							<input class="form-control-static text-ellips w100" :title="typeName" :value="typeName" id="objectType" v-else >
							<i class="fa fa-copy posabsrt0" title="Скопировать" @click="CopyF('objectType')" v-if="IsReadonly"></i>
						</div>
					</div>
					<div class="col-md-6 float-left">
						<label for="objectBranch" class="control-label w100 text-left pleft0">Филиал</label>
						<div :class="['col-md-12 pleft0 pright0',{'has-error': errors.has('ObjectBranch')}]"> 							
							<template v-if="!IsReadonly"> 
								<select2 type="text"
										class="form-control"
										id="objectBranch"
										placeholder="Филиал"
										v-model="model.IdBranch"
										name="ObjectBranch"
										data-vv-as="Филиал"
										v-validate="'required|min_value:1'"
                                        :allowClear="false"
										:options="Branches" />
								<span class="text-danger" v-show="errors.has('ObjectBranch')">{{ errors.first('ObjectBranch') }}</span>
							</template>
							<p class="form-control-static" v-else>{{ branchName }}</p>
						</div>
					</div>
				</div>

				<div class="form-group">
					<label for="contactPerson" class="col-lg-2 control-label w100">Контактное лицо</label>
					<div class="col-md-12">
						<div class="col-md-12 pleft0 pright0">
							<template v-if="!IsReadonly">
								<input type="text"
									   :class="['form-control', {'required-validation-error' : errors.has('ContactPerson')}]"
									   id="contactPerson"
									   placeholder="Контактное лицо"
									   v-model="model.ContactPerson"
									   name="ContactPerson"
									   data-vv-as="Контактное лицо"
									   v-validate="'required|min:3'" />
								<span class="text-danger" v-show="errors.has('ContactPerson')">{{ errors.first('ContactPerson') }}</span>
							</template>
							<input class="form-control-static text-ellips w100" :title="model.ContactPerson" :value="model.ContactPerson" id="ContactPerson" v-else>
							<i class="fa fa-copy posabsrt0" title="Скопировать" @click="CopyF('ContactPerson')"  v-if="IsReadonly"></i>
						</div>
					</div>
				</div>
				<div class="form-group" v-if="!IsReadonly || (IsReadonly && model.ContactPosition)">
					<label for="contactPosition" class="col-lg-2 control-label w100">Должность</label>
					<div class="col-md-12">
						<div class="col-md-12 pleft0 pright0">
							<template v-if="!IsReadonly">
								<input type="text"
									   :class="['form-control', {'required-validation-error' : errors.has('ContactPosition')}]"
									   id="contactPosition"
									   placeholder="Должность"
									   v-model="model.ContactPosition"
									   name="ContactPosition"
									   data-vv-as="Должность"
									   v-validate="'min:3'" />
								<span class="text-danger" v-show="errors.has('ContactPosition')">{{ errors.first('ContactPosition') }}</span>
							</template>
							<input class="form-control-static text-ellips w100" :title="model.ContactPosition" v-else :value="model.ContactPosition" id="ContactPosition"> 
							<i class="fa fa-copy posabsrt0" title="Скопировать" @click="CopyF('ContactPosition')"  v-if="IsReadonly"></i>
						</div>

					</div>
				</div>
				<div class="form-group">
					<div v-if="!IsReadonly || (IsReadonly && model.ContactPhone)"
						:class="['float-left', { 'col-md-6': !IsReadonly || (IsReadonly && model.ContactMail), 'col-md-12' : IsReadonly && !model.ContactMail }]">
						<label for="contactPhone" class="col-lg-2 control-label w100 pleft0">Телефон</label>
						<div class="col-md-12 pleft0 pright0">
							<template v-if="!IsReadonly">
								<input type="text"
									   :class="['form-control', {'required-validation-error' : errors.has('ContactPhone')}]"
									   id="contactPhone"
									   placeholder="Телефон"
									   v-model="model.ContactPhone"
									   name="ContactPhone"
									   data-vv-as="Телефон"
									   v-validate="'phoneNumber|min:3'" />
								<span class="text-danger" v-show="errors.has('ContactPhone')">{{ errors.first('ContactPhone') }}</span>
							</template>
							<input class="form-control-static text-ellips w100" :title="model.ContactPhone" v-else :value="model.ContactPhone" id="ContactPhone">
							<i class="fa fa-copy posabsrt0" title="Скопировать" @click="CopyF('ContactPhone')"  v-if="IsReadonly"></i>
						</div>
					</div>
					<div v-if="!IsReadonly || (IsReadonly && model.ContactMail)"
						 :class="['float-left', { 'col-md-6': !IsReadonly || (IsReadonly && model.ContactPhone), 'col-md-12' : IsReadonly && !model.ContactPhone }]" >
						<label for="contactMail" class="col-lg-2 control-label w100 pleft0">E-Mail</label>
						<div class="col-md-12 pleft0 pright0">
							<template v-if="!IsReadonly">
								<input type="text"
									   :class="['form-control', {'required-validation-error' : errors.has('ContactMail')}]"
									   id="contactMail"
									   placeholder="E-Mail"
									   v-model="model.ContactMail"
									   name="ContactMail"
									   data-vv-as="E-Mail"
									   v-validate="'email|min:3'" />
								<span class="text-danger" v-show="errors.has('ContactMail')">{{ errors.first('ContactMail') }}</span>
							</template>
							<input class="form-control-static text-ellips w100" :title="model.ContactMail" id="contactMail" v-else :value="model.ContactMail">
							<i class="fa fa-copy posabsrt0" title="Скопировать" @click="CopyF('contactMail')"  v-if="IsReadonly"></i>
						</div>
					</div>
				</div>
			</div>			
		</div>
	</div>
</template>

<script src="./ObjectDetails.ts" lang="ts">
</script>


<style>
    .objectMap {
        display:block; 
        width: 60%; 
        float: left;
        padding: 0 40px;
        text-align:right;
    }

    .btn-default {
        color: #333;
    }
    
    .btn-group {
        padding-bottom: 10px;
    }
	.alertsave {
		margin: 0px;
		padding: 8px 15px;
		width: calc(100% - 225px);
		float: left;
		margin-left: 15px;
	}
</style>