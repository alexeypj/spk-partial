<template>

    <div class="ibox float-e-margins">

        <div class="ibox-title newh_ibox">
            <div class="titleleft">
                <div>
                    <span>{{ Model.Title }}</span>
                </div>
            </div>

            <div class="btndiv pleft0 ptop15" v-if="IsSuperAdminOrPaidAccess">
                <div>
                    <transition name="fade">
                        <div class="pull-left alert alert-success eq_div" role="alert" v-if="isSaved">
                            Сохранено
                        </div>
                        <div class="pull-left alert alert-danger eq_div" role="alert" v-if="errorText">
                            {{ errorText }}
                        </div>
                    </transition>
                    <cancel-button @click="cancel" :isSaving="IsLoading" />
                    <button class="btn btn-danger pull-left mr5" @click="remove" :disabled="IsLoading" v-if="!readonly && model.Id != 0">Удалить</button>
                    <save-button @click="store" :isSaving="IsLoading" v-if="!readonly" />
                    <button class="btn btn-success" @click="unlock" :disabled="IsLoading" v-else>Редактировать</button>
                    <input id="fileSelector" type="file" multiple class="hide" @change="getFileName" />
                </div>
            </div>
        </div>

        <div class="ibox-content pleft15 pright15">
            <div id="data">

                <div class="row no-margins ">
                    <div class="col-lg-12 knowldiv">
                        <div class="form-horizontal">
                            <div class="row" v-if="!readonly">
                                <div class="form-group">
                                    <label class="col-md-12 ">Заголовок</label>
                                    <div class="col-md-12">
                                        <input v-if="!readonly"
                                               type="text" v-model="model.Title"
                                               :class="['form-control', {'required-validation-error' : errors.has('Title')}]"
                                               id="title"
                                               placeholder="Заголовок"
                                               name="Title"
                                               data-vv-as="Заголовок"
                                               v-validate="'required|min:3'" />
                                        <p class="form-control-static" v-else>{{ model.Title }}</p>
                                        <span class="text-danger" v-show="errors.has('Title')">{{ errors.first('Title') }}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="form-group">
                                    <div class="col-md-10">
                                        <div class="pull-left" style="padding-right: 5px; height: 30px; padding-top:5px" v-if="folderName"><i class="fa fa-folder"></i></div>
                                        <div class="pull-left" style="padding-right: 20px; height: 30px; padding-top:5px" v-if="folderName" v-html="folderName"></div>
                                        <button class="btn btn-primary btn-sm" @click="selectFolder" v-if="!readonly">Выбрать папку</button>
                                        <input type="hidden" name="IdFolder" v-model="model.IdFolder" data-vv-as="Папка" v-validate="'required|min_value:1'" />
                                        <span class="text-danger" v-show="errors.has('IdFolder')"><br />Папка не указана</span>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="form-group mb5">
                                    <label class="col-md-12 ">Описание</label>
                                    <div class="col-md-12">
                                        <textarea v-if="!readonly"
                                                  type="text"
                                                  :value="model.Description"
                                                  :class="['summernote', {'required-validation-error' : errors.has('Description')}]"
                                                  id="description"
                                                  placeholder="Описание"
                                                  name="Description"
                                                  data-vv-as="Описание"
                                                  data-vv-delay="2000"
                                                  v-validate="''">
									</textarea>
                                        <p class="form-control-static" v-else v-html="model.Description"></p>
                                        <span class="text-danger" v-show="errors.has('Description')">{{ errors.first('Description') }}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="row" v-if="!readonly || model.Solution">
                                <div class="form-group mb5">
                                    <label class="col-md-12">Решение</label>
                                    <div class="col-md-12">
                                        <textarea v-if="!readonly"
                                                  type="text"
                                                  :value="model.Solution"
                                                  :class="['summernote', {'required-validation-error' : errors.has('Solution')}]"
                                                  id="solution"
                                                  placeholder="Решение"
                                                  name="Solution"
                                                  data-vv-as="Решение"
                                                  data-vv-delay="2000"
                                                  v-validate="''">
									</textarea>
                                        <p class="form-control-static" v-else v-html="model.Solution">{{ model.Title }}</p>
                                        <span class="text-danger" v-show="errors.has('Solution')">{{ errors.first('Solution') }}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="form-group">
                                    <div class="col-md-3 text-right pull-right">
                                        <a @click="showRelatedIncidents" v-if="model.Id != 0">Решенные инциденты</a>
                                    </div>
                                    <div class="col-md-9">
                                        <div class="col-md-12 dflex" style="align-items:center; padding-left: 0">
                                            <template v-if="IsFileListLoading">
                                                <i class="fa fa-spinner fa-spin fa-2x fa-fw"></i>
                                            </template>
                                            <template v-else>
                                                <div class="pull-left" style="padding-right: 10px;" v-if="!readonly">
                                                    <button class="btn btn-primary btn-sm mb0" @click="openFileDialog" :disabled="IsLoading">
                                                        <i class="fa fa-link" aria-hidden="true"></i>
                                                    </button>
                                                </div>
                                                <div class="pull-left">
                                                    <div v-for="(file,idx) in importedFiles" :key="file.Name + '_' + file.Size">
                                                        <a @click="openFile(file)" target="_blank">
                                                            {{ file.Name }} <span>({{ getFileSize(file.Size) }}) </span>
                                                        </a>
                                                        <a v-if="!readonly && !IsLoading" @click="removeFromImportedFiles(idx)"><i class="fa fa-times" aria-hidden="true"></i></a>
                                                    </div>
                                                    <div v-for="(file,idx) in selectedFiles" :key="'new_' + file.name + '_' + file.size">
                                                        {{ file.name }} <span>({{ getFileSize(file.size) }}) </span> <a v-if="!readonly && !IsLoading" @click="removeFile(idx)"><i class="fa fa-times" aria-hidden="true"></i></a>
                                                    </div>

                                                    <template v-if="readonly">
                                                        <div v-for="(file,idx) in existingFiles" :key="file.Name + '_' + file.Size">
                                                            <a @click="openFile(file)" target="_blank">
                                                                {{ file.Name }} <span>({{ getFileSize(file.Size) }}) </span> <a v-if="!readonly && !IsLoading" @click="removeFile(idx)"><i class="fa fa-times" aria-hidden="true"></i></a>
                                                            </a>
                                                        </div>
                                                    </template>
                                                    <template v-else>
                                                        <div v-for="(file,idx) in existingFiles" :key="file.Name + '_' + file.Size">
                                                            <a @click="openFile(file)" target="_blank">
                                                                {{ file.Name }} <span>({{ getFileSize(file.Size) }}) </span>
                                                            </a>
                                                            <a v-if="!readonly && !IsLoading" @click="addToRemovedFiles(idx)"><i class="fa fa-times" aria-hidden="true"></i></a>
                                                        </div>
                                                        <p class="text-muted">Максимальный размер файла: {{ maxUploadFileSize }} Mb </p>
                                                    </template>
                                                </div>
                                            </template>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row iconsdiv">
                                <div class="form-group">
                                    <div class="col-md-6">
                                        <select2 v-if="!readonly"
                                                 :class="['w100', {'required-validation-error' : errors.has('AttackType')}]"
                                                 id="attackType"
                                                 multiple="true"
                                                 v-model="model.AttackTypeTags"
                                                 :options="Dictionaries.AttackTypes"
                                                 data-placeholder="Тип атаки"
                                                 name="AttackType"
                                                 data-vv-as="Тип атаки" />
                                        <p class=" w100" v-else>
                                            <template v-if="model.AttackTypeTags && model.AttackTypeTags.length > 0">
                                                <i title="Тип атаки" class="fa fa-bomb mr5"></i>{{ getDictionaryValues(Dictionaries.AttackTypes, model.AttackTypeTags) }}
                                            </template>
                                        </p>

                                        <select2 v-if="!readonly"
                                                 :class="['w100', {'required-validation-error' : errors.has('DeviceType')}]"
                                                 id="deviceType"
                                                 multiple="true"
                                                 v-model="model.EquipmentTypeTags"
                                                 :options="Dictionaries.DeviceTypes"
                                                 data-placeholder="Тип оборудования"
                                                 name="DeviceType"
                                                 data-vv-as="Тип оборудования" />
                                        <p class=" w100" v-else>
                                            <template v-if="model.EquipmentTypeTags && model.EquipmentTypeTags.length > 0">
                                                <i title="Тип оборудования" class="fa fa-laptop mr5"></i>{{ getDictionaryValues(Dictionaries.DeviceTypes, model.EquipmentTypeTags) }}
                                            </template>
                                        </p>

                                        <select2 v-if="!readonly"
                                                 :class="['w100', {'required-validation-error' : errors.has('Platform')}]"
                                                 id="platform"
                                                 multiple="true"
                                                 v-model="model.PlatformTags"
                                                 :options="Dictionaries.Platforms"
                                                 data-placeholder="Аппаратная платформа"
                                                 name="Platform"
                                                 data-vv-as="Аппаратная платформа" />
                                        <p class=" w100" v-else>
                                            <template v-if="model.PlatformTags && model.PlatformTags.length > 0">
                                                <i title="Аппаратная платформа" class="fa fa-tablet mr5"></i>{{ getDictionaryValues(Dictionaries.Platforms, model.PlatformTags) }}
                                            </template>
                                        </p>

                                        <select2 v-if="!readonly"
                                                 :class="['w100', {'required-validation-error' : errors.has('Memory')}]"
                                                 id="memory"
                                                 multiple="true"
                                                 v-model="model.MemoryTags"
                                                 :options="memoryDict"
                                                 data-placeholder="Память"
                                                 name="Memory"
                                                 data-vv-as="Память" />
                                        <p class=" w100" v-else>
                                            <template v-if="model.MemoryTags && model.MemoryTags.length > 0">
                                                <i title="Память" class="fa fa-inbox mr5"></i>{{ getDictionaryValues(memoryDict, model.MemoryTags) }}
                                            </template>
                                        </p>

                                        <select2 v-if="!readonly"
                                                 :class="['w100', {'required-validation-error' : errors.has('CPU')}]"
                                                 id="CPU"
                                                 multiple="true"
                                                 v-model="model.CPUTags"
                                                 :options="Dictionaries.CPU"
                                                 data-placeholder="Процессор"
                                                 name="CPU"
                                                 data-vv-as="Процессор" />
                                        <p class=" w100" v-else>
                                            <template v-if="model.CPUTags && model.CPUTags.length > 0">
                                                <i title="Процессор" class="fa fa-microchip mr5"></i>{{ getDictionaryValues(Dictionaries.CPU, model.CPUTags) }}
                                            </template>
                                        </p>
                                    </div>
                                    <div class="col-md-6">
                                        <select2 v-if="!readonly"
                                                 :class="['w100', {'required-validation-error' : errors.has('RaidType')}]"
                                                 id="raidType"
                                                 multiple="true"
                                                 v-model="model.RaidTags"
                                                 :options="Dictionaries.RaidTypes"
                                                 data-placeholder="RAID"
                                                 name="raidType"
                                                 data-vv-as="RAID" />
                                        <p class=" w100" v-else>
                                            <template v-if="model.RaidTags && model.RaidTags.length > 0">
                                                <i title="RAID" class="fa fa-server mr5"></i>{{ getDictionaryValues(Dictionaries.RaidTypes, model.RaidTags) }}
                                            </template>
                                        </p>

                                        <select2 v-if="!readonly"
                                                 :class="['w100', {'required-validation-error' : errors.has('HDD')}]"
                                                 id="HDD"
                                                 multiple="true"
                                                 v-model="model.HddTags"
                                                 :options="hddDict"
                                                 data-placeholder="Диск"
                                                 name="HDD"
                                                 data-vv-as="Диск" />
                                        <p class=" w100" v-else>
                                            <template v-if="model.HddTags && model.HddTags.length > 0">
                                                <i title="Диск" class="fa fa-hdd-o mr5"></i>{{ getDictionaryValues(hddDict, model.HddTags) }}
                                            </template>
                                        </p>

                                        <select2 v-if="!readonly"
                                                 :class="['w100', {'required-validation-error' : errors.has('NetworkAdapter')}]"
                                                 id="networkAdapter"
                                                 multiple="true"
                                                 v-model="model.NetworkAdapterTags"
                                                 :options="networkAdaptersDict"
                                                 data-placeholder="Сетевой адаптер"
                                                 name="NetworkAdapter"
                                                 data-vv-as="Сетевой адаптер" />
                                        <p class=" w100" v-else>
                                            <template v-if="model.NetworkAdapterTags && model.NetworkAdapterTags.length > 0">
                                                <i title="Сетевой адаптер" class="fa fa-signal mr5" aria-hidden="true"></i>{{ getDictionaryValues(networkAdaptersDict, model.NetworkAdapterTags) }}
                                            </template>
                                        </p>

                                        <select2 v-if="!readonly"
                                                 :class="['w100', {'required-validation-error' : errors.has('Software')}]"
                                                 id="software"
                                                 multiple="true"
                                                 v-model="model.SoftwareTags"
                                                 :options="Dictionaries.Software"
                                                 data-placeholder="ПО"
                                                 name="Software"
                                                 data-vv-as="ПО" />
                                        <p class=" w100" v-else>
                                            <template v-if="model.SoftwareTags && model.SoftwareTags.length > 0">
                                                <i title="ПО" class="fa fa-list-alt mr5" aria-hidden="true"></i>{{ getDictionaryValues(Dictionaries.Software, model.SoftwareTags) }}
                                            </template>
                                        </p>

                                        <select2 v-if="!readonly"
                                                 :class="['w100', {'required-validation-error' : errors.has('OS')}]"
                                                 id="OS"
                                                 multiple="true"
                                                 v-model="model.OSTags"
                                                 :options="Dictionaries.OS"
                                                 data-placeholder="ОС"
                                                 name="OS"
                                                 data-vv-as="ОС" />
                                        <p class=" w100" v-else>
                                            <template v-if="model.OSTags && model.OSTags.length > 0">
                                                <i title="ОС" class="fa fa-windows mr5" aria-hidden="true"></i>{{ getDictionaryValues(Dictionaries.OS, model.OSTags) }}
                                            </template>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Modal v-show="showFolderForm" @cancel="closeFolderForm" title="Выбрать папку" @ok="setFolder" okText="Выбрать">
                        <Tree id="selectFolderTree" v-model="selectedFolder" slot="body" :Folders="JSTree" />
                    </Modal>
                    <Modal v-show="showRelatedIncidentsModal" @cancel="closeRelatedIncidents" title="Решенные инциденты" :showFooter="false">
                        <RelatedIncidents slot="body" :Incidents="relatedIncidents" :Dictionaries="Dictionaries" @cancel="closeRelatedIncidents" />
                    </Modal>
                </div>

            </div>
        </div>
    </div>
</template>

<script src="./details.ts" lang="ts">
</script>
