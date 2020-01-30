 <template>
    <div>
        <div v-if="IsRelatedArticlesLoading" style="text-align:center">
            <i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>
        </div>
        <template v-else>
            <template v-if="showArticlePreview">
                <div class="row">
                    <div class="col-md-9">
                        <h3>{{ articlePreview.Title}}</h3>
                    </div>
                    <div class="col-md-3">
                        <div class="pull-right">
                            <a @click="closePreview()"><i class="fa fa-undo" aria-hidden="true"></i></a>&nbsp;
                             <router-link :to="'/KnowledgeBase/' + articlePreview.Id" target="_blank" title="Открыть в новом">
                                    <i class="fa fa-external-link" aria-hidden="true"></i>
                            </router-link>&nbsp;                                                                                                         
                            <a @click="$emit('cancel')"><i class="fa fa-close" aria-hidden="true"></i></a>
                        </div>
                    </div>
                </div>                
                <div class="row" v-if="articlePreview.Description">
                    <div class="col-md-12" v-html="articlePreview.Description"></div>
                </div>
                <div class="row" v-if="articlePreview.Solution" style="padding-top:10px;">
                    <div class="col-md-12" v-html="articlePreview.Solution"></div>
                </div>
                <div class="row" v-if="isTextOverflow">
                    <div class="col-md-12">
                        <router-link :to="'/KnowledgeBase/' + articlePreview.Id" target="_blank" title="Открыть в новом">
                            Читать продолжение в отдельной вкладке
                        </router-link>&nbsp;                                                                                                                                 
                    </div>
                </div>
                <div class="row" v-if="articlePreviewFiles && articlePreviewFiles.length > 0" style="padding-top:10px">
                    <div class="col-md-12">
                        <div v-for="(file) in articlePreviewFiles" :key="'preview_' + file.Name + '_' + file.Size">
                            <span style="padding-right: 20px">{{ file.Name }}</span>
                            <a @click="openFile(file)" target="_blank">
                                <i class="fa fa-external-link" aria-hidden="true"></i>
                            </a>                        
                        </div>
                    </div>
                </div>
                <div class="row"  style="padding-top:10px">
                    <div class="col-md-12">
                        Параметры: {{ getTags() }}
                    </div>
                </div>
                <div class="row" style="padding-top:10px">
                    <div class="col-md-12 text-center">
                        <button class="btn btn-default btn-xs" @click="attachArticle(articlePreview.Id)" :disabled="IsArticleAttaching" v-if="!isAttached(articlePreview.Id)">
                            <i class="fa fa-spinner fa-spin fa-fw" v-if="IsArticleAttaching"></i>
                            Выбрать статью
                        </button>
                        <div v-else>
                            Статья привязана к инциденту <br />
                            <button class="btn btn-default btn-xs" @click="detachArticle(articlePreview.Id)">
                                Открепить статью        
                            </button>
                        </div>
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="row">
                    <div class="col-md-12">
                        <div class="pull-right">
                            <a @click="removeMatchesFromStorage()"><i class="fa fa-refresh" aria-hidden="true"></i></a>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div v-for="match in kbMatches" :key="'match_' + match.ArticleId" class="col-md-12 articleMatch">
                        <div class="pull-left">
                            <a class="articleInfo" @click="openArticleInfo(match.ArticleId)">{{ match.ArticleName }}</a>
                            <router-link :to="'/KnowledgeBase/' + match.ArticleId" target="_blank" title="Открыть в новом">
                                <i class="fa fa-external-link" aria-hidden="true"></i>
                            </router-link> <br />
                            Совпадение по параметрам: <br />
                            {{ getMatchList(match.MatchTags) }}
                        </div>
                        <div class="pull-right">
                            <a @click="removeMatchFromArticle(match.ArticleId)"><i class="fa fa-ban" aria-hidden="true"></i></a>
                        </div>
                    </div>
                </div>
            </template>
		</template>
    </div>
</template>	

<script src="./KbArticles.ts" lang="ts">
</script>
