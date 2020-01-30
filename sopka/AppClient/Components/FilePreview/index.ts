import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import range from "lodash/range";
// import pdfjs from "pdfjs-dist/build/pdf";
import { urlHelper } from "../../Shared/utils";
import { Action } from "vuex-class";
import { Actions, namespace, noFilePreview } from "../../Store/Modules/Common/constants";
import { IFile } from "../../Store/Modules/Common/types";

@Component
export default class extends Vue {

    @Prop({ required: true})
    public readonly Id: number;

    @Action(Actions.FETCH_FILE_INFO, { namespace })
    public FetchFileInfo: (id: number) => Promise<IFile>;

    @Watch("Id")
    public onIdChange(newVal: number): void {
        this.initFile(newVal);
    }

    private imageContentTypes: string[] = ["image/bmp", "image/png", "image/gif", "image/jpeg", "image/jpg"];
    private percentLoaded: number = 0;
    private info: IFile;
    private showDownloadButton: boolean = false;
    private showPreview: boolean = false;

    public mounted(): void {
        // pdfjs.GlobalWorkerOptions.workerSrc = "/js/pdfjs/pdf.worker.min.js";
        this.initFile(this.Id);
    }

    private initFile(id: number) {
        this.FetchFileInfo(id).then((file: IFile) => {
            this.info = file;
            this.showDownloadButton = true;
            if (this.hasPreview(file)) {
                this.loadDocument(id);
            } else {
                const target =  document.getElementById("pdf-document");
                if (!target) {
                    return;
                } else {
                    if (this.isImage(file.ContentType)) {
                        target.innerHTML = `<span id="preview"><img src="${urlHelper("Download/?id=" + this.Id, "Files")}"/></preview>`;
                    } else {
                        target.innerHTML = `<span id="preview">${noFilePreview}</span>`;
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

    private hasPreview(file: IFile): boolean {
        if (file) {
            if (file.PreviewId || file.ContentType === "application/pdf") {
                return true;
            }
        }
        return false;
    }

    private async loadDocument(id: number): Promise<void> {
        try {
            this.showPreview = true;
            // this.percentLoaded = 0;
            // const loadingTask = pdfjs.getDocument(urlHelper("Preview/?id=" + id, "Files"));
            // loadingTask.onProgress = ({loaded, total}) => {
            //     this.percentLoaded = Math.round((loaded * 100) / total);
            // };

            // const target =  document.getElementById("pdf-document");
            // if (!target) {
            //     return;
            // }

            // loadingTask.promise.then((pdf) => {
            //     this.showDownloadButton = true;
            //     const pagePromises = range(1, pdf.numPages + 1).map(num => pdf.getPage(num));
            //     Promise.all(pagePromises).then(pages => {
            //         const scale = 1.5;
            //         target.innerHTML = "";
            //         const canvases = pages.forEach(page => {
            //             const viewport = page.getViewport({ scale });

            //             // Prepare canvas using PDF page dimensions
            //             const canvas = document.createElement("canvas");
            //             canvas.height = viewport.height;
            //             canvas.width = viewport.width;

            //             // Render PDF page into canvas context
            //             const canvasContext = canvas.getContext("2d");
            //             const renderContext = { canvasContext, viewport };
            //             page.render(renderContext);
            //             const wrapper = document.createElement("div");
            //             wrapper.append(canvas);
            //             target.appendChild(wrapper);
            //         });
            //     });
            // }).catch(error => {
            //     this.showDownloadButton = false;
            //     if (error.name === "MissingPDFException") {
            //         bootbox.alert("Файл не найден");
            //     }
            // });
        } catch (error) {
            this.showDownloadButton = false;
            console.error(error);
            bootbox.alert(error);
        }
    }

    public download() {
        document.location.href = urlHelper("Download/?id=" + this.Id, "Files");
    }

    public getFileSize(bytes: number | null): string {
        if(bytes) {
            const kbytes = Math.round(bytes / 1024);
            if (kbytes > 1024) {
                return (kbytes / 1024).toFixed(2) + " Mb";
            }
            return Math.round(kbytes) + " Kb";
        }
        return "";
    }

    private isImage(contentType: string): boolean {
        if (this.imageContentTypes.indexOf(contentType) !== -1) {
            return true;
        }
        return false;
    }
}
