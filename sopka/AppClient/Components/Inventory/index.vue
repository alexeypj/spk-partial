<template>
    <div class="h100 inv objdiv">

        <div class="col-md-3 col-sm-4 col-xs-12 bright h100">
            <div class="ibox float-e-margins">
				<div class="bordertop pright5 pleft5 ptop5">
					<div class="row no-margins">
						<div class="row no-margins">

							<div class="col-sm-12 m-b-xs search-p pleft0 pright5">
								<div class="input-group">
									<input type="text" placeholder="Поиск" class="input-sm form-control" v-model="searchString" @keypress="trySearch" />
									<span class="input-group-btn">
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
                <div class="ibox-content pright0 btop0 ptop0">
                   
                    <ObjectList />
                </div>
            </div>
        </div>
		<div class="col-md-9 col-sm-8 col-xs-12 pright0 h100 eqmap pleft0 bright">

			<div class="ibox float-e-margins borderbottom" v-if="SelectedObjectId != null">
                <div class="ibox-title newh_ibox">
                    <h5 v-if="SelectedObject && SelectedObjectId != 0 && readonly">
                        <span v-if="readonly" :title="SelectedObject.ObjectName">{{ SelectedObject.ObjectName }}</span>
                    </h5>
                    <div class="titleleft mt5" v-if="SelectedObject && SelectedObjectId != 0 && !readonly">
                        <input :class="['form-control', {'required-validation-error' : errors.has('ObjectName')}]"
                               id="objectName"
                               placeholder="Название"
                               v-model="ObjectName"
                               name="ObjectName"
                               data-vv-as="Название"
                               v-validate="'required|min:3'" />
                        <span class="text-danger" v-show="errors.has('ObjectName')">{{ errors.first('ObjectName') }}</span>
                    </div>
                    <h5 v-if="SelectedObjectId == 0 && !readonly">
                        Новый объект
                    </h5>
                    <div class="btndiv" v-if="IsSuperAdminOrPaidAccess">
                        <div class="pull-right">
                            <button class="btn btn-danger pull-left mr5 mb0" @click="$emit('remove')" :disabled="State.IsObjectSaving" v-if="!readonly && SelectedObjectId">Удалить</button>
                            <button class="btn btn-white mb0" @click="cancel" :disabled="State.IsObjectSaving" v-if="!readonly && SelectedObjectId != 0">Отмена</button>
                            <button class="btn btn-white mb0" @click="close" :disabled="State.IsObjectSaving" v-if="readonly || SelectedObjectId == 0">К списку</button>
                            <button type="button" class="btn btn-success mb0" :disabled="State.IsObjectSaving" @click="edit" v-if="readonly">Редактировать</button>
                            <save-button className="btn btn-success ml5" @click="$emit('store')" class="mb0" v-if="!readonly" :isSaving="State.IsObjectSaving" />
                            &nbsp;
                        </div>
                    </div>
                </div>

                <div class="ibox-content pright15 pleft0">
                    <ObjectDetails v-if="SelectedObjectId != null"
                                   :key="SelectedObjectId"
                                   @mapSearch="mapSearch"
                                   @changedCoordinates="changedCoordinates"
                                   :address="searchAddress"
                                   :IsReadonly="readonly || !IsSuperAdminOrPaidAccess"
                                   @refreshList="refreshList"
                                   :ObjectName="ObjectName"
                                   @onStore="onStoreHandler" />
                    <yMap v-if="Id && SelectedObject" mapClass="col-md-6 pleft0 ptop30" width="50%" height="395px"
                          :object="SelectedObject"
                          :key="'map_' + SelectedObject.Id"
                          :searchAddress="searchAddressStr"
                          :searchCoordinates="searchCoordinates"
                          @setCoordinates="setCoordinates" />
                    <EquipmentList v-if="SelectedObject != null && SelectedObjectId != 0" :IsReadonly="readonly"/>
                </div>


			</div>

			<div>

			</div>
			<div v-if="SelectedObjectId == null" class="ibox-title newh_ibox pright22">
				<h5>Объекты</h5>
				<div class="ibox-tools" v-if="IsSuperAdminOrPaidAccess">
					<a @click="create"
					   class="btn btn-small btn-success btn-outline"
					   data-toggle="tooltip"
					   title="Добавить новый объект">
						<i class="fa fa-plus fa-lg"></i>
					</a>
				</div>
			</div>
			<yMap v-if="!Id" width="99%" height="100%" :objects="Objects" :key="mapKey" mapClass="startmap" 
                  :forceInitMultiObjects="true"/>
		</div>
       
    </div>   
</template>

<script lang="ts" src="./index.ts">
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 1s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>