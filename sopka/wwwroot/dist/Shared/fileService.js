var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Vue from "vue";
import Component from "vue-class-component";
import { urlHelper } from "./utils";
let FileService = class FileService extends Vue {
    constructor() {
        super(...arguments);
        this.selectedFiles = [];
        this.removedFiles = [];
        this.existingFiles = [];
    }
    openFileDialog() {
        const realFile = document.getElementById("fileSelector");
        if (realFile) {
            realFile.click();
        }
    }
    getFileName(file) {
        if (file.target) {
            const target = file.target;
            if (target.files) {
                for (const x of target.files) {
                    this.selectedFiles.push(x);
                }
            }
        }
    }
    getFileSize(bytes) {
        const kbytes = Math.round(bytes / 1024);
        if (kbytes > 1024) {
            return (kbytes / 1024).toFixed(2) + " Mb";
        }
        return Math.round(kbytes) + " Kb";
    }
    removeFile(idx) {
        const removed = this.selectedFiles.splice(idx, 1);
    }
    openFile(file) {
        if (file) {
            window.open(urlHelper(`${file.Id}`, "FilePreview"));
        }
    }
    addToRemovedFiles(idx) {
        const removed = this.existingFiles.splice(idx, 1);
        this.removedFiles.push(...removed);
    }
};
FileService = __decorate([
    Component
], FileService);
export default FileService;
//# sourceMappingURL=fileService.js.map