<template>
    <div class="h100">
        <div class="col-md-3 col-sm-4 col-xs-12 bright h100"> 
			<div class="ibox-title mb5">
				<h5>Уязвимости</h5>
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
				</div>
				
				<div v-if="isFilters" style="padding: 5px; 0">
					<!--<button class="btn btn-white mr5 btn-small"
			style="width:100%"
			type="button"
			@click="showTree">Скрыть фильтры  </button>-->
					<VulnerabilitiesFilter 
						:Filter="Filter"
						:Dictionaries="Dictionaries"
						:IsLoading="DictionariesLoading || VulnerabilitiesLoading"
						@resetFilter="resetFilter"
						@applyFilter="applyFilter"
					/>
				</div>

				<template v-else>
						<Tree v-if="isTree"
							  id="leftPanelFolder"
							  class="pull-left"
							  v-model="selectedFolderId"
							  :Folders="JSTree"
							  @selectFolder="openFolder"
							  @selectFile="selectFile" />
						<template v-else>
							<div class="content alert alert-info btop0" v-if="Vulnerabilities.length == 0">Нет статей подходящих под условия фильтрации</div>
							<div class="ibox-content btop0" style="padding: 0; padding-top:6px;" v-else>
								<div class="table-responsive">
									<table class="table">
										<tbody>
											<tr @click="selectFile(vulnerability.Id)" :class="[{'info': isSelected(vulnerability.Id)}]" v-for="vulnerability in Vulnerabilities" :key="'vulnerabilityList_' + vulnerability.Id">
												<td>
													{{ vulnerability.Title }}<br />
													<div class="fontgray"><span class="pull-right"><small>id:{{ vulnerability.Id }}</small></span></div>
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
        <div class="col-md-9 col-sm-8 col-xs-12 h100 pleft0 pright0">
            <div class="col-md-12 pleft0"  v-if="showingList || showingTree" >
                <div class="ibox float-e-margins">
                    <div class="" style="padding: 0">
                        <div class="ibox-title newh_ibox">
                            <div class="col-sm-7 col-xs-8 pright0 pleft0">
                                <div class="input-group w100 text-right" style="display: flex;" v-show="showingList || showingTree">
                                    <input type="text" placeholder="Поиск" class="input-sm form-control" style="margin-right: 5px;">
                                    <!--<a href="javascript:void(0)" class="vasuper">
                                        <i class="fa fa-search fa-2x"></i>
                                    </a>-->
                                </div>
                            </div>                           
                        </div>
                        <div class="bordertop">
                            <div class="ibox float-e-margins">
                                <div class="ibox-content btop0">
                                    <div id="data">                                       
                                        <Tree 
											v-if="showingTree"
                                            id="centerPanelFolder" 
                                            v-model="selectedFolderId" 
                                            :Folders="JSTree" 
                                            @selectFile="selectFile"
											@selectFolder="openFolder"
                                        />
										<template v-if="showingList">
											<i class="fa fa-spinner fa-spin fa-2x fa-fw" v-if="FolderContentsLoading"></i>
											<template v-else>
												<h4>{{ folderName }}</h4>
												<div v-for="item in vulnerabilities" :key="'vulnerability_' + item.Id" class="bordered">													
													<div class="pull-right" style="position:relative; top: 10px">
														<div :class="['status-button', getStatusColor(item.StatusType)]"> {{ getStatus(item.StatusType) }}</div>
													</div>
													<strong><a @click="openTreeArticle(item.Id)">{{ item.Title }}</a></strong>
													<div style="padding-top:10px" >
														{{ item.Country }}, {{ item.Regulations }}, {{ item.Manufacturer }}, {{ item.Research }}, {{ item.Incidents }}
													</div>																										
												</div>
											</template>
										</template>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
			 <Details                                        
				v-if="showingArticle" 
				:key="selectedArticle.Id"                                            
				:Model="selectedArticle"         
				@openFolder="openFolder"                                    
			/>
        </div>            
    </div>
</template>

<style scoped>
	.bordered {
		border: 1px #ccc solid;
		padding: 5px 10px 10px 10px;
	}

	.status-button {
		border: 1px #ccc solid;
		padding: 5px 10px;
		border-radius: 15px;
		width:100px;
		text-align: center;
	}
	.status-new {
		background-color:aquamarine;
	}
	.status-inwork {
		background-color: #DDD;
	}
	.status-error {
		background-color:chocolate
	}
	.status-workedout {
		background-color: #fff
	}

	
</style>

<script lang="ts" src="./index.ts">
</script>

