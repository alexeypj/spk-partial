<template>
    <div class="h100">
        <div class="col-md-3 col-sm-4 col-xs-12 bright h100"> 
			<div class="ibox-title mb5">
				<h5>База знаний</h5>
				<div style="text-align:right" class="pull-right" v-if="isFilters">
					<button class="btn btn-white btn-small" type="button" @click="showTree" :disabled="isFilters || showingArticle == false">
                        <i class="fa fa-filter fa-lg" title="Скрыть фильтры"></i>
                    </button>
				</div>
				<div style="text-align:right" class="pull-right" v-else>
					<button class="btn btn-white btn-small" type="button" @click="showFilters"><i class="fa fa-filter fa-lg" title="Показать фильтры"></i></button>
				</div>
                               
                <div class="pull-right" >
                    <button class="btn btn-white pull-right btn-small mr5 btnlist" @click="showList" title="В виде списка" :disabled="isList">
                        <i class="fa fa-list-ul" aria-hidden="true"></i>
                    </button>
                    <button class="btn btn-white pull-right btn-small btntree" @click="showTree" title="В виде дерева" :disabled="isTree">
                        <i class="fa fa-sitemap"></i>
                    </button>
                </div>
			</div>
			<div class="ibox-content" style="padding: 0px;">
				<div class="col-xs-12 pleft0 addfart">
					<div class="pull-right" v-if="showingArticle && IsSuperAdminOrPaidAccess">
						<button class="btn btn-white pull-right btn-small mb0" @click="create" title="Добавить статью">
							<i class="fa fa-file-text-o"></i>
						</button>
						<button class="btn btn-white pull-right btn-small mr5 mb0" @click="openFolderForm" title="Добавить папку">
							<i class="fa fa-folder"></i>
						</button>
					</div>
				</div>
				
				<div v-if="isFilters" style="padding: 5px; 0">
					<!--<button class="btn btn-white mr5 btn-small"
			style="width:100%"
			type="button"
			@click="showTree">Скрыть фильтры  </button>-->

					<div class="form-group">
						<label class="font-noraml">Тип атаки</label>
						<div class="input-group w100">
							<select2 class="chosen-select w100"
									 id="attackTypeFilter"
									 :options="Dictionaries.AttackTypes"
									 data-placeholder="Выбор..."
									 name="deviceTypeFilter"
									 v-model="filter.AttackTypeId" />
						</div>
					</div>

					<div class="form-group">
						<label class="font-noraml">Тип оборудования</label>
						<div class="input-group w100">
							<select2 class="chosen-select w100"
									 id="deviceTypeFilter"
									 :options="Dictionaries.DeviceTypes"
									 data-placeholder="Выбор..."
									 name="deviceTypeFilter"
									 v-model="filter.EquipmentTypeId" />
						</div>
					</div>

					<div class="form-group">
						<label class="font-noraml">Аппаратная платформа</label>
						<div class="input-group w100">
							<select2 class="chosen-select w100"
									 id="platformFilter"
									 :options="Dictionaries.Platforms"
									 data-placeholder="Выбор..."
									 name="platformFilter"
									 v-model="filter.PlatformId" />
						</div>
					</div>

					<div class="form-group">
						<label class="font-noraml">Память</label>
						<div class="input-group w100">
							<select2 class="chosen-select w100"
									 id="memoryFilter"
									 :options="memoryDict"
									 data-placeholder="Выбор..."
									 name="memoryFilter"
									 v-model="filter.MemoryId" />
						</div>
					</div>

					<div class="form-group">
						<label class="font-noraml">Процессор</label>
						<div class="input-group w100">
							<select2 class="chosen-select w100"
									 id="cpuFilter"
									 :options="Dictionaries.CPU"
									 data-placeholder="Выбор..."
									 name="cpuFilter"
									 v-model="filter.CpuId" />
						</div>
					</div>

					<div class="form-group">
						<label class="font-noraml">RAID</label>
						<div class="input-group w100">
							<select2 class="chosen-select w100"
									 id="raidFilter"
									 :options="Dictionaries.RaidTypes"
									 data-placeholder="Выбор..."
									 name="raidFilter"
									 v-model="filter.Raid" />
						</div>
					</div>

					<div class="form-group">
						<label class="font-noraml">Диск</label>
						<div class="input-group w100">
							<select2 class="chosen-select w100"
									 id="hddFilter"
									 :options="hddDict"
									 data-placeholder="Выбор..."
									 name="hddFilter"
									 v-model="filter.HDD" />
						</div>
					</div>

					<div class="form-group">
						<label class="font-noraml">Сетевой адаптер</label>
						<div class="input-group w100">
							<select2 class="chosen-select w100"
									 id="networkAdapterFilter"
									 :options="networkAdaptersDict"
									 data-placeholder="Выбор..."
									 name="networkAdapterFilter"
									 v-model="filter.NetworkAdapter" />
						</div>
					</div>
					<div class="form-group">
						<label class="font-noraml">ПО</label>
						<div class="input-group w100">
							<select2 class="chosen-select w100"
									 id="softwareFilter"
									 :options="Dictionaries.Software"
									 data-placeholder="Выбор..."
									 name="softwareFilter"
									 v-model="filter.Software" />
						</div>
					</div>

					<div class="form-group">
						<label class="font-noraml">ОС</label>
						<div class="input-group w100">
							<select2 class="chosen-select w100"
									 id="osFilter"
									 :options="Dictionaries.OS"
									 data-placeholder="Выбор..."
									 name="osFilter"
									 v-model="filter.OS" />
						</div>
					</div>
					<div class="text-right">
						<button class="btn btn-white mr5 btn-small" type="button" @click="resetFilter">Сбросить</button>
						<button class="btn btn-success btn-small" type="button" @click="applyFilter(filter)">Применить</button>
					</div>

				</div>

				<template v-else>
						<Tree v-if="isTree"
							  id="leftPanelFolder"
							  class="pull-left"
							  v-model="selectedFolderId"
							  :Folders="JSTree"
							  @selectFile="selectFile" />		
						<template v-else>
							<div class="content alert alert-info btop0" v-if="Articles.length == 0">Нет статей подходящих под условия фильтрации</div>
							<div class="ibox-content btop0" style="padding: 0; padding-top:6px;" v-else>
								<div class="table-responsive">
									<table class="table knowtable">
										<tbody>
											<tr @click="selectFile(article.Id)" :class="[{'info': isSelected(article.Id)}]" v-for="article in Articles" :key="'articleList_' + article.Id">
												<td>
													<span :title="article.Title">{{ article.Title }}</span>
													<div class="fontgray"><span class="pull-right"><small>id:{{ article.Id }}</small></span></div>
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>			
						</template>	
				</template>
			</div>
        </div>
        <div class="col-md-9 col-sm-8 col-xs-12 h100 pleft0 bright pright0">

                <Details
                    :Dictionaries="Dictionaries"
                    v-if="showingArticle"
                    :key="selectedArticle.Id"
                    @stored="onArticleStored"
                    :Model="selectedArticle"
                    :baseIncidentId="baseIncidentId"
                    @refreshList="onArticleRemoved"
                    />

                <div class="ibox float-e-margins" v-else>

                        <div class="ibox-title newh_ibox">
                            <div class="titleleft">
                                <div class="input-group w100 text-right ptop15" style="display: flex;" v-show="!showingArticle">
									<div class="pull-left" >
										<button class="btn btn-white pull-right btn-small mr5 btnlist" @click="showListCenter" title="В виде списка" :disabled="isCenterList">
											<i class="fa fa-list-ul" aria-hidden="true"></i>
										</button>										
										<button class="btn btn-white pull-right btn-small btntree" @click="showTreeCenter" title="В виде дерева" :disabled="isCenterList == false">
											<i class="fa fa-sitemap"></i>
										</button>
									</div>
									<div class="col-md-8 pleft0">
                                    	<input type="text" placeholder="Поиск" v-model="filter.Query" 
                                               class="input-sm form-control" 
                                               style="margin-right: 5px;" 
                                               @input="delayedApplyFilter(filter)">
									</div>
                                    <!--<a href="javascript:void(0)" class="vasuper">
                                        <i class="fa fa-search fa-2x"></i>
                                    </a>-->									                  
									
                                </div>
								<div v-show="showingArticle">									
									<span>{{ selectedArticle.Title }}</span>
								</div>
                            </div>

                            <div class="btndiv pleft0 ptop15" v-if="IsSuperAdminOrPaidAccess">
                                <button class="btn btn-white pull-right btn-small mb0" @click="create" title="Добавить статью">
                                    <i class="fa fa-file-text-o"></i>
                                </button>
                                <button class="btn btn-white pull-right btn-small mr5 mb0" @click="openFolderForm" title="Добавить папку">
                                    <i class="fa fa-folder"></i>
                                </button>
                                <div class="pull-right">
                                    <transition name="fade">
                                        <div class="mr5 alert alert-success eq_div no-padding" role="alert" v-if="isSaved">
                                            Сохранено
                                        </div>
                                        <div class="mr5 alert alert-danger eq_div no-padding" role="alert" v-if="errorText">
                                            {{ errorText }}
                                        </div>
                                    </transition>
                                </div>
                                <div>
                                    <!--сюда надо перенести кнопки из Details-->
                                </div>
                            </div>
                        </div>
                                <div class="ibox-content no-padding">
                                    <div id="data">
                                        <Tree v-if="isCenterList == false"
                                              id="centerPanelFolder"
                                              v-model="selectedFolderId"
                                              :Folders="JSTree"
                                              @selectFile="selectFile" />
                                        <template v-else>
                                            <div class="content alert alert-info btop0" v-if="Articles.length == 0">
                                                Нет статей подходящих под условия фильтрации
                                            </div>
                                            <div class="ibox-content btop0" style="padding: 0; padding-top:6px;" v-else>
                                                <div class="table-responsive">
                                                    <table class="table knowtable">
                                                        <tbody>
                                                            <tr @click="selectFile(article.Id)"
                                                                :class="[{'info': isSelected(article.Id)}]"
                                                                v-for="article in Articles"
                                                                :key="'articleList_' + article.Id">
                                                                <td>
                                                                    <span :title="article.Title">{{ article.Title }}</span>
                                                                    <div class="fontgray">
                                                                        <span class="pull-right">
                                                                            <small>id:{{ article.Id }}</small>
                                                                        </span>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </template>
                                    </div>
                                </div>

                </div>
        </div>    
        <Modal v-if="showFolderForm" @cancel="closeFolderForm" title="Добавить папку" @ok="storeFolder" okText="Сохранить"> 
            <FolderForm 
				ref="folderForm"
				slot="body"
				@update="(value) => folderModel = value" 
				:folders = "Folders" 
				:parentId="selectedFolderId"				
			/>
        </Modal>
    </div>
</template>



<script lang="ts" src="./index.ts">
</script>

