import Vue from "vue";
import Component from "vue-class-component";
import { IFile } from "../Store/Modules/Common/types";
import { urlHelper } from "./utils";

@Component
export default class FileService extends Vue {

    protected selectedFiles: File[] = [];
    protected removedFiles: IFile[] = [];
    protected existingFiles: IFile[] = [];

    public openFileDialog(): void {
        const realFile: HTMLElement | null = document.getElementById("fileSelector");
        if (realFile) {
            realFile.click();
        }
    }

    public getFileName(file: Event): void {
        if (file.target) {
            const target = file.target as HTMLInputElement;
            if (target.files) {
                for (const x of target.files) {
                    this.selectedFiles.push(x);
                }
            }
        }
    }

    public getFileSize(bytes: number): string {
        const kbytes = Math.round(bytes / 1024);
        if (kbytes > 1024) {
            return (kbytes / 1024).toFixed(2) + " Mb";
        }
        return Math.round(kbytes) + " Kb";
    }

    public removeFile(idx: number): void {
        const removed = this.selectedFiles.splice(idx, 1);
    }

    public openFile(file: IFile): void {
        if (file) {
            window.open(urlHelper(`${file.Id}`, "FilePreview"));
        }
    }

    public addToRemovedFiles(idx: number): void {
        const removed = this.existingFiles.splice(idx, 1);
        this.removedFiles.push(...removed);
    }
}
