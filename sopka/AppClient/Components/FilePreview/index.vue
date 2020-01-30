<template>
    <div id="documentWrapper">
        <div class="row no-margins" style="padding: 5px; height: auto">
            <div class="col-md-12">
                <template v-if="percentLoaded > 0 && percentLoaded < 100">
                    <span>Загружено {{ percentLoaded }}</span>
                </template>
                <div class="pull-left" style="padding-right:20px; line-height: 30px" v-if="showDownloadButton && info">
                    <strong>{{ info.Name }}</strong> ({{ getFileSize(info.Size) }})
                </div>
                <button class="btn btn-primary btn-sm" @click="download" v-if="showDownloadButton">
                    <i class="fa fa-download" aria-hidden="true"></i>&nbsp;
                    Скачать
                </button>
             </div>
        </div>        
        <div id="pdf-document">
         <iframe v-if="showPreview"
                style="width: 100%; height: 100%; min-height: 400px; border: none;-ms-transform: scale(1); -webkit-transform: scale(1); transform: scale(1);"
			    :src="'js/pdfjs/web/viewer.html?file=' + baseUrl + 'Files/Preview/'+Id">
            </iframe>
        </div>
    </div>
</template>

<script src="./index.ts" lang="ts">
</script>

<style>    
    #documentWrapper { height: 100%; display: flex; flex-direction: column; }
    #pdf-document { flex-grow: 1; }
    #preview { padding: 15px; }
    
</style>
