var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import range from "lodash/range";
import pdfjs from "pdfjs-dist/build/pdf";
import { urlHelper } from "../../Shared/utils";
import { Action } from "vuex-class";
import { Actions, namespace } from "../../Store/Modules/Common/constants";
let default_1 = class default_1 extends Vue {
    constructor() {
        super(...arguments);
        this.imageContentTypes = ["image/png", "image/gif", "image/jpeg", "image/jpg"];
        this.percentLoaded = 0;
        this.showDownloadButton = false;
    }
    onIdChange(newVal) {
        this.initFile(newVal);
    }
    mounted() {
        pdfjs.GlobalWorkerOptions.workerSrc = "/js/pdfjs/pdf.worker.min.js";
        this.initFile(this.Id);
    }
    initFile(id) {
        this.FetchFileInfo(id).then((file) => {
            this.info = file;
            this.showDownloadButton = true;
            if (this.hasPreview(file)) {
                this.loadDocument(id);
            }
            else {
                const target = document.getElementById("pdf-document");
                if (!target) {
                    return;
                }
                else {
                    if (this.isImage(file.ContentType)) {
                        target.innerHTML = `<img src="${urlHelper("Download/?id=" + this.Id, "Files")}"/>`;
                    }
                    else {
                        target.innerHTML = "Превью файла недоступно";
                    }
                }
            }
        })
            .catch(error => {
            this.showDownloadButton = false;
            if (error.name === "MissingPDFException") {
                bootbox.alert("Файл не найден");
            }
        });
    }
    hasPreview(file) {
        if (file) {
            if (file.PreviewId || file.ContentType === "application/pdf") {
                return true;
            }
        }
        return false;
    }
    loadDocument(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.percentLoaded = 0;
                const loadingTask = pdfjs.getDocument(urlHelper("Preview/?id=" + id, "Files"));
                loadingTask.onProgress = ({ loaded, total }) => {
                    this.percentLoaded = Math.round((loaded * 100) / total);
                };
                const target = document.getElementById("pdf-document");
                if (!target) {
                    return;
                }
                loadingTask.promise.then((pdf) => {
                    this.showDownloadButton = true;
                    const pagePromises = range(1, pdf.numPages + 1).map(num => pdf.getPage(num));
                    Promise.all(pagePromises).then(pages => {
                        const scale = 1.5;
                        target.innerHTML = "";
                        const canvases = pages.forEach(page => {
                            const viewport = page.getViewport({ scale });
                            // Prepare canvas using PDF page dimensions
                            const canvas = document.createElement("canvas");
                            canvas.height = viewport.height;
                            canvas.width = viewport.width;
                            // Render PDF page into canvas context
                            const canvasContext = canvas.getContext("2d");
                            const renderContext = { canvasContext, viewport };
                            page.render(renderContext);
                            const wrapper = document.createElement("div");
                            wrapper.append(canvas);
                            target.appendChild(wrapper);
                        });
                    });
                }).catch(error => {
                    this.showDownloadButton = false;
                    if (error.name === "MissingPDFException") {
                        bootbox.alert("Файл не найден");
                    }
                });
            }
            catch (error) {
                this.showDownloadButton = false;
                console.error(error);
                bootbox.alert(error);
            }
        });
    }
    download() {
        document.location.href = urlHelper("Download/?id=" + this.Id, "Files");
    }
    getFileSize(bytes) {
        if (bytes) {
            const kbytes = Math.round(bytes / 1024);
            if (kbytes > 1024) {
                return (kbytes / 1024).toFixed(2) + " Mb";
            }
            return Math.round(kbytes) + " Kb";
        }
        return "";
    }
    isImage(contentType) {
        if (this.imageContentTypes.indexOf(contentType) !== -1) {
            return true;
        }
        return false;
    }
};
__decorate([
    Prop({ required: true })
], default_1.prototype, "Id", void 0);
__decorate([
    Action(Actions.FETCH_FILE_INFO, { namespace })
], default_1.prototype, "FetchFileInfo", void 0);
__decorate([
    Watch("Id")
], default_1.prototype, "onIdChange", null);
default_1 = __decorate([
    Component
], default_1);
export default default_1;
//# sourceMappingURL=index.js.map