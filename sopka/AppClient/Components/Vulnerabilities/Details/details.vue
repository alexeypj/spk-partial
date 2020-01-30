<template>
	 <div class="panel mb0" id="incdiv_center">
        <div class="panel-heading pbottom0">
            <div class="panel-title m-b-xs">
				<div v-if="IsLoading">
					<div class="row">
						<div class="col-md-12">
							<i class="fa fa-spinner fa-spin fa-2x fa-fw"></i> Загрузка
						</div>
					</div>
				</div>
				<template  v-else>
					<div class="row">
						<div class="col-md-12">
							<h4>
								{{ Model.Title }}
							</h4>     
						</div>
					</div>
					<div class="row">
						<div class="col-md-12">
							<div class="pull-left" style="padding-right: 15px;">
								Страна: {{ Model.Country}}
							</div>
							<div class="pull-left" style="padding-right: 15px;">
								Ресурс: {{ Model.Resources }}
							</div>
							<div class="pull-left" style="padding-right: 15px;">
								Дата загрузки: {{ createDate }}
							</div>
							<div class="pull-right">
								<i class="fa fa-spinner fa-spin fa-fw" v-if="IsStatusSaving"></i> 
						   		<select2 class="chosen-select w100"
								    :disabled="IsStatusSaving"
									:allowClear="false"
									id="statusDetails"
									:options="Statuses"
									data-placeholder="Выбор..."
									name="StatusDetails"
									v-model="statusType" 
								/>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-12">							
							<span v-for="folder in GetFolderPath(Model.IdFolder)" :key="folder[0]">
								<a @click="openFolder(folder[0])">{{ folder [1] }}</a> <template v-if="folder[0] != Model.IdFolder"> > </template>
							</span>								
						</div>
					</div>
				</template>

            </div>

            <div class="panel-options">
                <ul class="nav nav-tabs inctab">
                    <li class="active"><a data-toggle="tab" href="#tab-1">Оригинал</a></li>
                    <li class=""><a data-toggle="tab" href="#tab-2" v-if="hasTranslation">Перевод</a></li>
					<li class=""><a data-toggle="tab" href="#tab-3">Обсуждение</a></li>
                </ul>
            </div>
        </div>			
		<div class="panel-body">
			<div class="tab-content">
				<div id="tab-1" class="tab-pane active">                    
					<div class="ibox float-e-margins">
						<div class="ibox-content btop0 no-padding">
							<div class="form-group">
								<div class="row mb5">
									<div class="col-md-12" id="original-document">
										Оригинал
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div id="tab-2" class="tab-pane"  v-if="hasTranslation">                    
					<div class="ibox float-e-margins">
						<div class="ibox-content btop0 no-padding">
							<div class="form-group">
								<div class="row mb5">
									<div class="col-md-12" id="translation-document">
										Перевод
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div id="tab-3" class="tab-pane">                    
					<div class="ibox float-e-margins">
						<div class="ibox-content btop0 no-padding">
							<div class="form-group">
								<div class="row mb5">
									<div class="col-md-12">
										<button class="btn btn-small btn-default" @click="toggleCommentForm" :disabled="CommentSaving">
											Добавить комментарий
										</button>
										<div class="form-horizontal" v-show="showCommentForm">
											<div class="alert alert-danger" role="alert" v-if="errorText">
												{{ errorText }}
											</div>
											<textarea 
												:disabled="CommentSaving"
												class="form-control" 
												rows="6" 
												placeholder="Введите текст комментария" 
												v-model="commentText" 
												name="CommentText"
												data-vv-as="Текст комментария"
												v-validate="'required'">
											</textarea>
											<div class="text-danger" v-show="errors.has('CommentText')">{{ errors.first('CommentText') }}</div>
											<save-button className="btn btn-small btn-primary pt5" @click="storeComment" :isSaving="CommentSaving" />											
										</div>										
									</div>
									<div class="col-md-12">
										<i class="fa fa-spinner fa-spin fa-2x fa-fw" v-if="CommentsLoading"></i>
										<div v-for="comment in comments" :key="'comment_' + comment.Id" style="padding-bottom:10px; padding-top: 5px;">
											{{ dateFormat(comment.CreateDate) }}&nbsp;&nbsp; ({{ GetUserName(comment.UserId) }})
											<textarea class="form-control" :value="comment.Comment" readonly="readonly"></textarea>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			
				<div class="pull-left" style="padding-right: 15px;">
					Производитель: {{ Model.Manufacturer }}
				</div>
				<div class="pull-left" style="padding-right: 15px;">
					Инцидент: {{ Model.Incidents }}
				</div>
				<div class="pull-left" style="padding-right: 15px;">
					Нормативная документация: {{ Model.Regulations}}
				</div>
			
		</div>
	</div>						
</template>

<script src="./details.ts" lang="ts">
</script>
