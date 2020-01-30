<template>
    <div id="wrapper" class="ibox float-e-margins">
		<div class="ibox-title newh_ibox">
			<h5 v-if="!model.Id">Новое оборудование</h5>
			<div class="titleleft mt5" v-if="!readonly && model.Id">
				<input type="text" v-model="model.Name"
					   :class="['form-control', {'required-validation-error' : errors.has('Name')}]"
					   id="name"
					   placeholder="Название оборудования"
					   name="Name"
					   data-vv-as="Название оборудования"
					   data-vv-delay="2000"
					   v-validate="'required|min:3'" />
				<span class="text-danger" v-show="errors.has('Name')">{{ errors.first('Name') }}</span>
			</div>
			<h5 v-else :title="model.Name"> {{ model.Name }} </h5>
            <router-link :to="{path:'/Incident', query: {EquipmentId: model.Id}}" v-if="model.Id"  type="button" class="btn btn-white btn-small btnto" title="Посмотреть инциденты на оборудовании"> 
                <i class="fa fa-arrow-right fa-lg"></i>
            </router-link>
            <router-link :to="{path:'/EquipmentJournals', query: {EquipmentId: model.Id}}" v-if="model.Id && Settings.IsLimited == false"  type="button" class="btn btn-white btn-small btnto" title="Посмотреть журналы"> 
                <i class="fa fa-book fa-lg"></i>
            </router-link>
			<div class="btndiv">
				<transition name="fade">
					<div class="pull-left alert alert-success eq_div" role="alert" v-if="isSaved">
						Сохранено
					</div>
					<div class="pull-left alert alert-danger eq_div" role="alert" v-if="errorText">
						{{ errorText }}
					</div>
				</transition>
				<div class="pull-left" v-if="IsSuperAdminOrPaidAccess">
					<delete-button @click="remove($event)" class="mb0" :isSaving="false" :name="model.Name" />
					<cancel-button @click="cancel($event)" class="mb0" :isSaving="false" :text="!readonly && model.Id ? 'Отмена' : 'К списку'" />
					<button type="button" class="btn btn-success mb0" @click="edit" v-if="readonly">Редактировать</button>
					<save-button className="btn btn-success ml5 mb0" @click="store" v-if="!readonly" :isSaving="false" />
					&nbsp;
				</div>
			</div>
		</div>
        <div class="ibox-content ibox-content-nested pright15 pleft0">
            <div class="ptop15" v-if="!readonly && model.Id"></div>
            <div class="form-horizontal">
                <div class="row no-margins">
                    <div class="col-xs-12 col-sm-6">
                        <div class="form-group" v-if="!readonly && !model.Id">
                            <label class="col-sm-12 pright0">Название оборудования</label>
                            <div class="col-sm-12 pright0">
                                <input type="text" v-model="model.Name"
                                       :class="['form-control', {'required-validation-error' : errors.has('Name')}]"
                                       id="name"
                                       placeholder="Название оборудования"
                                       name="Name"
                                       data-vv-as="Название оборудования"
                                       data-vv-delay="2000"
                                       v-validate="'required|min:3'" />
                                <span class="text-danger" v-show="errors.has('Name')">{{ errors.first('Name') }}</span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-12 pright0">Тип</label>
                            <div :class="['col-sm-12 pright0', {'has-error': errors.has('DeviceType')}]">
                                <select2 v-if="!readonly"
                                         :class="['form-control w100']"
                                         id="deviceType"
                                         data-placeholder="Тип"
                                         name="DeviceType"
                                         data-vv-as="Тип"
                                         v-validate="'required|min_value:1'"
                                         :options="DeviceTypes"
                                         :value="model.Type"
                                         @input="setSelectedType"
                                         :allowClear="false"
                                         @customOptionClick="addNewType"
                                         customOptionTitle="Добавить новое" />
                                <p class="form-control-static" v-else>{{ getDictionaryValue(DeviceTypes, model.Type) }}</p>
                                <span class="text-danger" v-show="errors.has('DeviceType')">Поле Тип обязательно для заполнения.</span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-12 pright0">Аппаратная платформа</label>
                            <div class="col-sm-12 pright0">
                                <select2 v-if="!readonly"
                                         :class="['w100', {'required-validation-error' : errors.has('Platform')}]"
                                         name="Platform"
                                         id="platform"
                                         data-placeholder="Аппаратная платформа"
                                         data-vv-as="Аппаратная платформа"
                                         data-vv-delay="2000"
                                         v-validate="'required'"
                                         :options="Platforms"
                                         :value="model.Platform"
                                         :allowClear="true"
                                         @input="setSelectedPlatform"
                                         @customOptionClick="addNewPlatform"
                                         customOptionTitle="Добавить новое" />
                                <p class="form-control-static" v-else>{{ getDictionaryValue(Platforms, model.Platform) }}</p>
                                <span class="text-danger" v-show="errors.has('Platform')">{{ errors.first('Platform') }}</span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-12 pright0">Объект</label>
                            <div :class="['col-sm-12 pright0 dflex', {'has-error': errors.has('Object')}]">
                                <select2 v-if="!readonly"
                                         :class="['form-control w100']"
                                         name="Object"
                                         id="object"
                                         data-placeholder="Объект"
                                         data-vv-as="Объект"
                                         v-validate="'required|min_value:1'"
                                         :options="Objects"
                                         :allowClear="false"
                                         v-model="model.IdObject" />
                                <p class="form-control-static w100" v-else>{{ getDictionaryValue(Objects, model.IdObject) }}</p>
                                <span class="text-danger" v-show="errors.has('Object')">Поле Объект обязательно для заполнения.</span>
                                <router-link v-if="model.Id && model.IdObject"
                                             :to="{path:'/Inventory/'+model.IdObject}"
                                             class="btn btn-white btn-small btn-left0 mb0"
                                             title="Перейти к объекту">
                                    <i class="fa fa-arrow-right"></i>
                                </router-link>
                            </div>
                        </div>
                        <div class="form-group" v-if="model.Location || !readonly">
                            <label class="col-sm-12 pright0">Размещение</label>
                            <div class="col-sm-12 pright0">
                                <input v-if="!readonly"
                                       type="text"
                                       :class="['form-control', {'required-validation-error' : errors.has('Location')}]"
                                       name="Location"
                                       id="location"
                                       data-vv-delay="2000"
                                       placeholder="Размещение"
                                       data-vv-as="Размещение"
                                       v-validate="'min:3'"
                                       v-model="model.Location" />
                                <p class="form-control-static" v-else>{{ model.Location }}</p>
                                <span class="text-danger" v-show="errors.has('Location')">{{ errors.first('Location') }}</span>
                            </div>
                        </div>
                        <div class="form-group" v-if="deviceModel.NetworkName || !readonly">
                            <label class="col-sm-12 pright0">Имя в сети</label>
                            <div class="col-sm-12 pright0">
                                <input v-if="!readonly"
                                       type="text"
                                       :class="['form-control', {'required-validation-error' : errors.has('NetworkName')}]"
                                       name="NetworkName"
                                       id="networkName"
                                       placeholder="Имя в сети"
                                       data-vv-as="Имя в сети"
                                       v-validate="'min:2'"
                                       data-vv-delay="2000"
                                       v-model="deviceModel.NetworkName" />
                                <p class="form-control-static" v-else>{{ deviceModel.NetworkName }}</p>
                                <span class="text-danger" v-show="errors.has('NetworkName')">{{ errors.first('NetworkName') }}</span>
                            </div>
                        </div>

                    </div>
                    <div class="col-xs-12 col-sm-6">
                        <div class="form-group" v-if="deviceModel.IP || !readonly">
                            <label class="col-sm-12 pright0">IP адрес</label>
                            <div class="col-sm-12 pright0">
                                <input v-if="!readonly"
                                       type="text"
                                       :class="['form-control', {'required-validation-error' : errors.has('IP')}]"
                                       name="IP"
                                       id="IP"
                                       placeholder="IP адрес"
                                       data-vv-as="IP адрес"
                                       v-validate="'ip'"
                                       data-vv-delay="2000"
                                       v-model="deviceModel.IP" />
                                <p class="form-control-static" v-else>{{ deviceModel.IP }}</p>
                                <span class="text-danger" v-show="errors.has('IP')">{{ errors.first('IP') }}</span>
                            </div>
                        </div>
                        <div class="form-group" v-if="deviceModel.Mask || !readonly">
                            <label class="col-sm-12 pright0">Маска</label>
                            <div class="col-sm-12 pright0">
                                <input v-if="!readonly"
                                       type="text" :disabled="readonly"
                                       :class="['form-control', {'required-validation-error' : errors.has('Mask')}]"
                                       name="Mask"
                                       id="mask"
                                       placeholder="Маска"
                                       data-vv-as="Маска"
                                       v-validate="'ip'"
                                       data-vv-delay="2000"
                                       v-model="deviceModel.Mask" />
                                <p class="form-control-static" v-else>{{ deviceModel.Mask }}</p>
                                <span class="text-danger" v-show="errors.has('Mask')">{{ errors.first('Mask') }}</span>
                            </div>
                        </div>
                        <div class="form-group" v-if="deviceModel.Gateway || !readonly">
                            <label class="col-sm-12 pright0">Шлюз</label>
                            <div class="col-sm-12 pright0">
                                <input v-if="!readonly"
                                       type="text" :disabled="readonly"
                                       :class="['form-control', {'required-validation-error' : errors.has('Gateway')}]"
                                       name="Gateway"
                                       id="gateway"
                                       placeholder="Шлюз"
                                       data-vv-as="Шлюз"
                                       v-validate="'ip'"
                                       data-vv-delay="2000"
                                       v-model="deviceModel.Gateway">
                                <p class="form-control-static" v-else>{{ deviceModel.Gateway }}</p>
                                <span class="text-danger" v-show="errors.has('Gateway')">{{ errors.first('Gateway') }}</span>
                            </div>
                        </div>
                        <div class="form-group" v-if="deviceModel.Vlan || !readonly">
                            <label class="col-sm-12 pright0">Сегмент (vlan)</label>
                            <div class="col-sm-12 pright0">
                                <input v-if="!readonly"
                                       type="text"
                                       :class="['form-control', {'required-validation-error' : errors.has('Vlan')}]"
                                       id="vlan"
                                       placeholder="Сегмент (vlan)"
                                       name="Vlan"
                                       data-vv-as="Сегмент (vlan)"
                                       data-vv-delay="2000"
                                       v-validate=""
                                       v-model="deviceModel.Vlan" />
                                <p class="form-control-static" v-else>{{ deviceModel.Vlan }}</p>
                                <span class="text-danger" v-show="errors.has('Vlan')">{{ errors.first('Vlan') }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Processor -->
                <template v-if="deviceModel.IdCPU || !readonly">
                    <div class="hr-line-dashed"></div>
                    <div class="form-group no-margins pleft15">
                        <a @click="addProcessorSlot" v-if="!readonly && (deviceModel.IdCPU == undefined || deviceModel.IdCPU == null)" title="Добавить">
                            <i class="fa fa-plus fa-lg mr5"></i><label class=" ">Процессор</label>
                        </a>
                        <label class=" " v-if="readonly">Процессор</label>
                    </div>

                    <div class="form-group ptop5" v-if="deviceModel.IdCPU != undefined && deviceModel.IdCPU != null">
                        <div class="row no-margins">
                            <div class="col-xs-10 pright0">
                                <div class="col-sm-6 col-xs-8 pright0">
                                    <select2 v-if="!readonly"
                                             :class="['w100', {'required-validation-error' : errors.has('IdCPU')}]"
                                             name="IdCPU"
                                             id="idCPU"
                                             data-placeholder="Процессор"
                                             data-vv-as="Процессор"
                                             v-validate="''"
                                             :show-labels="false"
                                             :options="CPU"
                                             label="Value"
                                             track-by="Key"
                                             :value="deviceModel.IdCPU"
                                             @input="setSelectedCPU"
                                             @customOptionClick="addNewProcessor"
                                             customOptionTitle="Добавить новое" />
                                    <p class="form-control-static" v-else>{{ getDictionaryValue(CPU, deviceModel.IdCPU) }}</p>
                                    <span class="text-danger" v-show="errors.has('IdCPU')">{{ errors.first('IdCPU') }}</span>
                                </div>
                            </div>
                            <div class="col-xs-2 pright0 text-center">
                                <a @click="clearProcessor" style="vertical-align:middle;" v-if="!readonly">
                                    <i class="fa fa-times fa-lg" style="color:red"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </template>

                <!-- Memory -->
                <template v-if="deviceModel.Memory.length > 0 || !readonly">

                    <div class="form-group no-margins mr5 pleft15">
                        <a @click="addMemorySlot" v-if="!readonly" title="Добавить">
                            <i class="fa fa-plus fa-lg mr5"></i><label class="">Память</label>
                        </a>
                        <label class="" v-if="readonly">Память</label>
                    </div>

                    <div class="form-group ptop5" v-for="(memory, idx) in deviceModel.Memory" :key="'memory_' + idx">
                        <div class="row no-margins">

                            <div class="col-xs-10 pright0">
                                <!--<label class="col-sm-12 ">#{{ idx + 1 }}</label>-->

                                <div class="col-sm-12 pright0">
                                    <div class="row">
                                        <div class="col-md-6 col-xs-8 pright0">
                                            <select2 v-if="!readonly"
                                                     :class="['w100', {'required-validation-error' : errors.has('Memory' + idx)}]"
                                                     :name="'Memory' + idx"
                                                     :id="'memory_' + idx"
                                                     data-placeholder="Тип памяти"
                                                     data-vv-as="Тип памяти"
                                                     v-validate="'required'"
                                                     :options="memoryDict"
                                                     :value="selectedMemory(idx)"
                                                     @input="setSelectedMemory"
                                                     @customOptionClick="addNewMemory(idx)"
                                                     customOptionTitle="Добавить новое" />
                                            <p class="form-control-static" v-else>
                                                <template v-if="selectedMemory(idx)">
                                                    {{ selectedMemoryText(idx) }}
                                                </template>
                                            </p>
                                            <span class="text-danger" v-show="errors.has('Memory' + idx)">{{ errors.first('Memory' + idx) }}</span>
                                        </div>
                                        <div class="col-md-2 col-xs-4 pright0">
                                            <input v-if="!readonly"
                                                   :class="['form-control', {'required-validation-error' : errors.has('Memory_count' + idx)}]"
                                                   :name="'Memory_count' + idx"
                                                   :id="'memory_count' + idx"
                                                   data-vv-as="Количество"
                                                   data-vv-delay="2000"
                                                   min="1"
                                                   step="1"
                                                   type="number"
                                                   placeholder="Количество"
                                                   v-validate="'numeric|required|min_value:1'"
                                                   v-model="memory.Count" />
                                            <p class="form-control-static" v-else>{{ memory.Count }} шт.</p>
                                            <span class="text-danger" v-show="errors.has('Memory_count' + idx)">{{ errors.first('Memory_count' + idx) }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-2 pright0 text-center">
                                <!--<label class="w100">&nbsp;</label>-->
                                <a @click="removeMemorySlot(idx)" style="vertical-align:middle;" v-if="!readonly">
                                    <i class="fa fa-times fa-lg" style="color:red"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </template>
                <!-- HDD -->
                <template v-if="deviceModel.HDD.length > 0 || !readonly">


                    <div class="form-group no-margins mr5 pleft15">
                        <a @click="addHDDSlot" v-if="!readonly" title="Добавить">
                            <i class="fa fa-plus fa-lg mr5"></i>
                            <label class="">Диск</label>
                        </a>
                        <label class="" v-if="readonly">Диск</label>
                    </div>
                    <div class="form-group ptop5" v-for="(hdd, idx) in deviceModel.HDD" :key="'hdd_' + idx">
                        <div class="row no-margins">

                            <div class="col-xs-10 pright0">
                                <!--<label class="col-sm-12 ">#{{ idx + 1 }}</label>-->
                                <div class="col-sm-12 pright0">
                                    <div class="row">
                                        <div class="col-md-6 col-xs-8 pright0">

                                            <select2 v-if="!readonly"
                                                     :class="['w100', {'required-validation-error' : errors.has('HDD' + idx)}]"
                                                     :name="'HDD' + idx"
                                                     :id="'hdd_' + idx"
                                                     data-placeholder="Диск"
                                                     data-vv-as="Диск"
                                                     v-validate="'required'"
                                                     :options="hddDict"
                                                     :value="selectedHDD(idx)"
                                                     @input="setSelectedHDD"
                                                     @customOptionClick="addNewHDD(idx)"
                                                     customOptionTitle="Добавить новое" />
                                            <p class="form-control-static" v-else>
                                                <template v-if="selectedHDD(idx)">
                                                    {{ selectedHDDText(idx) }}
                                                </template>
                                            </p>
                                            <span class="text-danger" v-show="errors.has('HDD' + idx)">{{ errors.first('HDD' + idx) }}</span>
                                        </div>
                                        <!-- <div class="col-md-3"><input type="text" placeholder="Объём" class="form-control"></div> -->
                                        <div class="col-md-2 col-xs-2 pright0">
                                            <input v-if="!readonly"
                                                   :class="['form-control', {'required-validation-error' : errors.has('HDD_count' + idx)}]"
                                                   :name="'HDD_count' + idx"
                                                   :id="'hdd_count' + idx"
                                                   type="number"
                                                   min="1"
                                                   step="1"
                                                   placeholder="Количество"
                                                   data-vv-as="Количество"
                                                   data-vv-delay="2000"
                                                   v-validate="'numeric|required|min_value:1'"
                                                   v-model="hdd.Count" />
                                            <p class="form-control-static" v-else>{{ hdd.Count }} шт.</p>
                                            <span class="text-danger" v-show="errors.has('HDD_count' + idx)">{{ errors.first('HDD_count' + idx) }}</span>
                                        </div>
                                        <div class="col-md-3 col-xs-2 pright0">
                                            <select2 v-if="!readonly"
                                                     :class="['form-control w100', {'required-validation-error' : errors.has('HDD_raid' + idx)}]"
                                                     :name="'HDD_raid' + idx"
                                                     :id="'hdd_raid' + idx"
                                                     data-vv-as="RAID"
                                                     data-placeholder="RAID"
                                                     v-validate="'required'"
                                                     :options="RaidTypes"
                                                     v-model="hdd.IdRAIDDirectory">
                                            </select2>
                                            <p class="form-control-static" v-else>{{ getDictionaryValue(RaidTypes, hdd.IdRAIDDirectory) }}</p>
                                            <span class="text-danger" v-show="errors.has('HDD_raid' + idx)">{{ errors.first('HDD_raid' + idx) }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-2 pright0 text-center">
                                <!--<label class="w100">&nbsp;</label>-->
                                <a @click="removeHDDSlot(idx)" style="vertical-align:middle;" v-if="!readonly">
                                    <i class="fa fa-times fa-lg" style="color:red"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </template>
                <!-- Network adapter -->
                <template v-if="deviceModel.NetworkAdapters.length > 0 || !readonly">

                    <div class="form-group no-margins mr5 pleft15">
                        <a @click="addNetworkAdapterSlot" v-if="!readonly" title="Добавить">
                            <i class="fa fa-plus fa-lg mr5"></i><label class="">Сетевой адаптер</label>
                        </a>
                        <label class="" v-if="readonly">Сетевой адаптер</label>
                    </div>

                    <div class="form-group ptop5" v-for="(adapter, idx) in deviceModel.NetworkAdapters" :key="'adapter_' + idx">
                        <div class="row no-margins">

                            <div class="col-xs-10 pright0">
                                <!--<label class="col-sm-12 ">#{{ idx + 1}} </label>-->
                                <div class="col-sm-12 pright0">
                                    <div class="row">
                                        <div class="col-md-6 col-xs-8 pright0">

                                            <select2 v-if="!readonly"
                                                     :class="['w100', {'required-validation-error' : errors.has('Adapter' + idx)}]"
                                                     :name="'Adapter' + idx"
                                                     :id="'adapter_' + idx"
                                                     data-placeholder="Сетевой адаптер"
                                                     data-vv-as="Сетевой адаптер"
                                                     v-validate="'required'"
                                                     :options="networkAdaptersDict"
                                                     :value="selectedNetworkAdapter(idx)"
                                                     @input="setSelectedNetworkAdapter"
                                                     @customOptionClick="addNewNetworkAdapter(idx)"
                                                     customOptionTitle="Добавить новое" />
                                            <p class="form-control-static" v-else>
                                                <template v-if="selectedNetworkAdapter(idx)">
                                                    {{ selectedNetworkAdapterText(idx) }}
                                                </template>
                                            </p>
                                            <span class="text-danger" v-show="errors.has('Adapter' + idx)">{{ errors.first('Adapter' + idx) }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-2 col-md-2 pright0 text-center">
                                <!--<label class="w100">&nbsp;</label>-->
                                <a @click="removeNetworkAdapterSlot(idx)" style="vertical-align:middle;" v-if="!readonly">
                                    <i class="fa fa-times fa-lg" style="color:red"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </template>
                <!-- OS -->
                <template v-if="deviceModel.OperationSystems.length > 0 || !readonly">
                    <div class="hr-line-dashed"></div>
                    <div class="form-group no-margins mr5 pleft15">
                        <a @click="addOSSlot" v-if="!readonly" title="Добавить">
                            <i class="fa fa-plus fa-lg mr5"></i><label class="">Системное ПО</label>
                        </a>
                        <label class="" v-if="readonly">Системное ПО</label>
                    </div>

                    <div class="form-group ptop5" v-for="(os, idx) in deviceModel.OperationSystems" :key="'os_' + idx">
                        <div class="row no-margins">

                            <div class="col-xs-10 pright0">
                                <!--<label class="col-sm-12 ">#{{ idx + 1}} </label>-->
                                <div class="col-sm-12 pright0">
                                    <div class="row">
                                        <div class="col-md-6 col-xs-8 pright0">

                                            <select2 v-if="!readonly"
                                                     :class="['w100', {'required-validation-error' : errors.has('OS' + idx)}]"
                                                     :name="'OS' + idx"
                                                     :id="'os_' + idx"
                                                     data-placeholder="Тип системного ПО"
                                                     data-vv-as="Тип системного ПО"
                                                     v-validate="'required'"
                                                     :show-labels="false"
                                                     :options="OS"
                                                     label="Value"
                                                     track-by="Key"
                                                     :value="selectedOS(idx)"
                                                     @input="setSelectedOS"
                                                     @customOptionClick="addNewOS(idx)"
                                                     customOptionTitle="Добавить новое" />
                                            <p class="form-control-static" v-else>
                                                <template v-if="selectedOS(idx)">
                                                    {{ selectedOSText(idx) }}
                                                </template>
                                            </p>
                                            <span class="text-danger" v-show="errors.has('OS' + idx)">{{ errors.first('OS' + idx) }}</span>
                                        </div>
                                        <div class="col-md-2 col-xs-4 pright0">
                                            <input v-if="!readonly"
                                                   type="text"
                                                   placeholder="Версия"
                                                   :class="['form-control', {'required-validation-error' : errors.has('OS_version' + idx)}]"
                                                   :name="'OS_version' + idx"
                                                   :id="'os_version' + idx"
                                                   v-model="os.Version"
                                                   data-vv-as="Версия"
                                                   data-vv-delay="2000"
                                                   v-validate="'required'" />
                                            <p class="form-control-static" v-else>{{ os.Version }}</p>
                                            <span class="text-danger" v-show="errors.has('OS_version' + idx)">{{ errors.first('OS_version' + idx) }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-2 pright0 text-center">
                                <!--<label class="w100">&nbsp;</label>-->
                                <a @click="removeOSSlot(idx)" style="vertical-align:middle;" v-if="!readonly">
                                    <i class="fa fa-times fa-lg" style="color:red"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </template>
                <!-- Software -->
                <template v-if="deviceModel.Software.length > 0 || !readonly">

                    <div class="form-group mb0 no-margins mr5 pleft15">
                        <a @click="addSoftwareSlot" v-if="!readonly" title="Добавить">
                            <i class="fa fa-plus fa-lg mr5"></i><label class="">Прикладное ПО</label>
                        </a>
                        <label class="" v-if="readonly">Прикладное ПО</label>
                    </div>

                    <div class="form-group ptop5" v-for="(software, idx) in deviceModel.Software" :key="'software_' + idx">
                        <div class="row no-margins">

                            <div class="col-xs-10 pright0">
                                <!--<label class="col-sm-12 ">#{{ idx + 1}}</label>-->

                                <div class="col-sm-12 pright0">
                                    <div class="row">
                                        <div class="col-md-6 col-xs-8 pright0">

                                            <select2 v-if="!readonly"
                                                     :class="['w100', {'required-validation-error' : errors.has('Software' + idx)}]"
                                                     :name="'Software' + idx"
                                                     :id="'software_' + idx"
                                                     data-placeholder="Тип прикладного ПО"
                                                     data-vv-as="Тип прикладного ПО"
                                                     v-validate="'required'"
                                                     :show-labels="false"
                                                     :options="Software"
                                                     label="Value"
                                                     track-by="Key"
                                                     :value="selectedSoftware(idx)"
                                                     @input="setSelectedSoftware"
                                                     @customOptionClick="addNewSoftware(idx)"
                                                     customOptionTitle="Добавить новое" />
                                            <p class="form-control-static" v-else>
                                                <template v-if="selectedSoftware(idx)">
                                                    {{ selectedSoftwareText(idx) }}
                                                </template>
                                            </p>
                                            <span class="text-danger" v-show="errors.has('Software' + idx)">{{ errors.first('Software' + idx) }}</span>
                                        </div>
                                        <div class="col-md-2 col-xs-4 pright0">
                                            <input v-if="!readonly"
                                                   type="text"
                                                   placeholder="Версия"
                                                   :class="['form-control', {'required-validation-error' : errors.has('Software_version' + idx)}]"
                                                   :name="'Software_version' + idx"
                                                   :id="'software_version' + idx"
                                                   v-model="software.Version"
                                                   data-vv-as="Версия"
                                                   data-vv-delay="2000"
                                                   v-validate="'required'" />
                                            <p class="form-control-static" v-else>{{ software.Version }}</p>
                                            <span class="text-danger" v-show="errors.has('Software_version' + idx)">{{ errors.first('Software_version' + idx) }}</span>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-2 pright0 text-center">
                                <!--<label class="w100">&nbsp;</label>-->
                                <a @click="removeSoftwareSlot(idx)" style="vertical-align:middle;" v-if="!readonly">
                                    <i class="fa fa-times fa-lg" style="color:red"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </template>
                <!-- Other -->
                <template v-if="deviceModel.SyslogAddress || deviceModel.EventRegist || deviceModel.AWZ || deviceModel.AWZDate || deviceModel.AWZDatePeriod || deviceModel.IAF || !readonly">
                    <div class="hr-line-dashed"></div>
                    <div class="form-group pleft15">
                        <label class="col-lg-12 ">Параметры настройки функций/СрЗИ</label>
                    </div>
                </template>
                <template v-if="deviceModel.SyslogAddress || !readonly">
                    <div class="form-group pleft15">
                        <label class="col-sm-12 ">РСБ: адрес syslog-сервера</label>
                        <div class="col-sm-12">
                            <input v-if="!readonly"
                                   type="text"
                                   v-model="deviceModel.SyslogAddress"
                                   :class="['form-control', {'required-validation-error' : errors.has('SyslogAddress')}]"
                                   id="name"
                                   placeholder="Адрес syslog-сервера"
                                   name="SyslogAddress"
                                   data-vv-as="Адрес syslog-сервера"
                                   data-vv-delay="2000"
                                   v-validate="'min:3'" />
                            <p class="form-control-static" v-else>{{ deviceModel.SyslogAddress }}</p>
                            <span class="text-danger" v-show="errors.has('SyslogAddress')">{{ errors.first('SyslogAddress') }}</span>
                        </div>
                    </div>
                </template>
                <template v-if="deviceModel.EventRegist || !readonly">
                    <div class="form-group pleft15">
                        <label class="col-sm-12 ">РСБ: регистраци событий ИБ</label>
                        <div class="col-sm-12">
                            <input v-if="!readonly"
                                   type="text" v-model="deviceModel.EventRegist"
                                   :class="['form-control', {'required-validation-error' : errors.has('EventRegist')}]"
                                   id="eventRegist"
                                   placeholder="Регистраци событий ИБ"
                                   name="EventRegist"
                                   data-vv-as="Регистраци событий ИБ"
                                   data-vv-delay="2000"
                                   v-validate="'min:3'" />
                            <p class="form-control-static" v-else>{{ deviceModel.EventRegist }}</p>
                            <span class="text-danger" v-show="errors.has('EventRegist')">{{ errors.first('EventRegist') }}</span>
                        </div>
                    </div>
                </template>
                <template v-if="deviceModel.AWZ || !readonly">
                    <div class="form-group pleft15">
                        <label class="col-sm-12 ">РСБ: установленные средства</label>
                        <div class="col-sm-12">
                            <input v-if="!readonly"
                                   type="text" v-model="deviceModel.AWZ"
                                   :class="['form-control', {'required-validation-error' : errors.has('AWZ')}]"
                                   id="AWZ"
                                   placeholder="Установленные средства"
                                   name="AWZ"
                                   data-vv-as="Установленные средства"
                                   data-vv-delay="2000"
                                   v-validate="'min:3'" />
                            <p class="form-control-static" v-else>{{ deviceModel.AWZ }}</p>
                            <span class="text-danger" v-show="errors.has('AWZ')">{{ errors.first('AWZ') }}</span>
                        </div>
                    </div>
                </template>
                <div class="form-group pleft15">
                    <template v-if="deviceModel.AWZDate || !readonly" class="col-sm-6">
                        <div class="form-group col-sm-6 pright0 no-margins pleft0">
                            <label class="col-sm-12">РСБ: дата последнего обновления</label>
                            <div class="col-sm-12">
                                <date-pick v-model="deviceModel.AWZDate" v-if="!readonly"
                                           :pickTime="true"
                                           :inputAttributes="{
															class: 'form-control'
														}"
                                           :format="'YYYY-MM-DD HH:mm'"
                                           :nextMonthCaption="'Следующий месяц'"
                                           :prevMonthCaption="'Предыдущий месяц'"
                                           :setTimeCaption="'Время'"
                                           :weekdays="['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']"
                                           :months="['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']">
                                </date-pick>
                                <p class="form-control-static" v-else>{{ formatDate(deviceModel.AWZDate) }}</p>
                                <span class="text-danger" v-show="errors.has('AWZDate')">{{ errors.first('AWZDate') }}</span>
                            </div>
                        </div>
                    </template>
                    <template v-if="deviceModel.AWZDatePeriod || !readonly" class="col-sm-6 pright0">
                        <div class="form-group col-sm-6 no-margins">
                            <label class="col-sm-12 pright0 pleft0_992">РСБ: периодичность</label>
                            <div class="col-sm-12 pright0 pleft0_992">
                                <input v-if="!readonly"
                                       type="text" v-model="deviceModel.AWZDatePeriod"
                                       :class="['form-control', {'required-validation-error' : errors.has('AWZDatePeriod')}]"
                                       id="AWZDatePeriod"
                                       placeholder="Периодичность"
                                       name="AWZDatePeriod"
                                       data-vv-as="Периодичность"
                                       data-vv-delay="2000"
                                       v-validate="'min:3'" />
                                <p class="form-control-static" v-else>{{ deviceModel.AWZDatePeriod }}</p>
                                <span class="text-danger" v-show="errors.has('AWZDatePeriod')">{{ errors.first('AWZDatePeriod') }}</span>
                            </div>
                        </div>
                    </template>
                </div>

                <template v-if="deviceModel.IAF || !readonly">
                    <div class="form-group pleft15">
                        <label class="col-sm-12 ">ИАФ: учётные записи и политики</label>
                        <div class="col-sm-12">
                            <input v-if="!readonly"
                                   type="text"
                                   v-model="deviceModel.IAF"
                                   :class="['form-control', {'required-validation-error' : errors.has('IAF')}]"
                                   id="IAF"
                                   placeholder="Учётные записи и политики"
                                   name="IAF"
                                   data-vv-as="Учётные записи и политики"
                                   data-vv-delay="2000"
                                   v-validate="'min:3'" />
                            <p class="form-control-static" v-else>{{ deviceModel.IAF }}</p>
                            <span class="text-danger" v-show="errors.has('IAF')">{{ errors.first('IAF') }}</span>
                        </div>
                    </div>
                </template>

                <template v-if="model.RecordsMinCount || model.RecordsMaxCount || !readonly">
                    <div class="hr-line-dashed"></div>
                    <div class="form-group pleft15">
                        <label class="col-lg-12 ">Параметры возникновения инцидентов</label>
                    </div>
                </template>

                <div class="form-group pleft15">
                    <template v-if="model.RecordsMinCount || !readonly" class="col-sm-4">
                        <div class="form-group col-sm-4 pright0 no-margins pleft0">
                            <label class="col-sm-12 pright0 pleft0_992">Мин. количество записей</label>
                            <div class="col-sm-12 pright0 pleft0_992">
                                <input v-if="!readonly"
                                       type="text" v-model="model.RecordsMinCount"
                                       :class="['form-control', {'required-validation-error' : errors.has('RecordsMinCount')}]"
                                       id="RecordsMinCount"
                                       placeholder="Периодичность"
                                       name="RecordsMinCount"
                                       data-vv-as="Периодичность"
                                       data-vv-delay="2000"
                                       v-validate="'min_value:1'" />
                                <p class="form-control-static" v-else>{{ model.RecordsMinCount }}</p>
                                <span class="text-danger" v-show="errors.has('RecordsMinCount')">{{ errors.first('RecordsMinCount') }}</span>
                            </div>
                        </div>
                    </template>
                    <template v-if="model.RecordsMaxCount || !readonly" class="col-sm-4 pright0">
                        <div class="form-group col-sm-4 no-margins">
                            <label class="col-sm-12 pright0 pleft0_992">Макс. количество записей</label>
                            <div class="col-sm-12 pright0 pleft0_992">
                                <input v-if="!readonly"
                                       type="text" v-model="model.RecordsMaxCount"
                                       :class="['form-control', {'required-validation-error' : errors.has('RecordsMaxCount')}]"
                                       id="RecordsMaxCount"
                                       placeholder="Периодичность"
                                       name="RecordsMaxCount"
                                       data-vv-as="Периодичность"
                                       data-vv-delay="2000"
                                       v-validate="'min_value:1'" />
                                <p class="form-control-static" v-else>{{ model.RecordsMaxCount }}</p>
                                <span class="text-danger" v-show="errors.has('RecordsMaxCount')">{{ errors.first('RecordsMaxCount') }}</span>
                            </div>
                        </div>
                    </template>
                    <template v-if="model.RecordsMinCount || model.RecordsMaxCount || !readonly" class="col-sm-4 pright0">
                        <div class="form-group col-sm-4 no-margins">
                            <label class="col-sm-12 pright0 pleft0_992">Частота проверок журнала</label>
                            <div class="col-sm-12 pright0 pleft0_992">
                                <select2 v-if="!readonly"
                                         :class="['form-control w100']"
                                         name="RecordsCheckPeriod"
                                         id="RecordsCheckPeriod"
                                         data-placeholder="Частота проверок"
                                         data-vv-as="Частота проверок"
                                         :options="RecordsCheckPeriods"
                                         :allowClear="false"
                                         v-model="model.RecordsCheckPeriod" />
                                <p class="form-control-static" v-else>{{ getDictionaryValue(RecordsCheckPeriods, model.RecordsCheckPeriod) }}</p>
                                <span class="text-danger" v-show="errors.has('RecordsCheckPeriod')">{{ errors.first('RecordsCheckPeriod') }}</span>
                            </div>
                        </div>
                    </template>
                </div>

                <template v-if="deviceModel.Additional || !readonly">
                    <div class="hr-line-dashed"></div>
                    <div class="form-group pleft15">
                        <label class="col-sm-12 ">Дополнительно</label>
                        <div class="col-sm-12">
                            <textarea v-if="!readonly" class="form-control" v-model="deviceModel.Additional" rows="5"></textarea>
                            <p class="form-control-static" v-else>{{ deviceModel.Additional }}</p>
                        </div>
                    </div>
                </template>


            </div>
        </div>
        <!-- Создание типа устройства -->
        <Modal @cancel="closeModals"
               v-if="showCreateTypeModal"
               okText="Сохранить"
               :showFooter="false"
               title="Добавить тип устройства">
            <CreateType slot="body" @cancel="closeModals" :SaveHandler="onTypeSaved" />
        </Modal>

        <!-- Создание платформы -->
        <Modal @cancel="closeModals"
               v-if="showCreatePlatformModal"
               okText="Сохранить"
               :showFooter="false"
               title="Добавить платформу">
            <CreatePlatform slot="body" @cancel="closeModals" :SaveHandler="onPlatformSaved" />
        </Modal>
        <!-- Создание процессора -->
        <Modal @cancel="closeModals"
               v-if="showCreateProcessorModal"
               okText="Сохранить"
               :showFooter="false"
               title="Добавить процессор">
            <CreateProcessor slot="body" @cancel="closeModals" :SaveHandler="onProcessorSaved" />
        </Modal>
        <!-- Создание памяти -->
        <Modal @cancel="closeModals"
               v-if="showCreateMemoryModal"
               okText="Сохранить"
               :showFooter="false"
               title="Добавить RAM">
            <CreateMemory slot="body" @cancel="closeModals" :SaveHandler="onMemorySaved" />
        </Modal>
        <!-- Создание HDD -->
        <Modal @cancel="closeModals"
               v-if="showCreateHDDModal"
               okText="Сохранить"
               :showFooter="false"
               title="Добавить HDD">
            <CreateHDD slot="body" @cancel="closeModals" :SaveHandler="onHDDSaved" />
        </Modal>
        <!-- Создание сетевого адаптера -->
        <Modal @cancel="closeModals"
               v-if="showCreateNetworkAdapterModal"
               okText="Сохранить"
               :showFooter="false"
               title="Добавить сетевой адаптер">
            <CreateNetworkAdapter slot="body" @cancel="closeModals" :SaveHandler="onNetworkAdapterSaved" />
        </Modal>
        <!-- Создание ПО -->
        <Modal @cancel="closeModals"
               v-if="showCreateSoftwareModal"
               okText="Сохранить"
               :showFooter="false"
               title="Добавить ПО">
            <CreateSoftware slot="body" @cancel="closeModals" :SaveHandler="onSoftwareSaved" />
        </Modal>
        <!-- Создание ОС -->
        <Modal @cancel="closeModals"
               v-if="showCreateOSModal"
               okText="Сохранить"
               :showFooter="false"
               title="Добавить системное ПО">
            <CreateOS slot="body" @cancel="closeModals" :SaveHandler="onOSSaved" />
        </Modal>

    </div>
</template>

<script lang="ts" src="./EquipmentDetails.ts">
</script>
