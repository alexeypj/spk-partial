import Vue from "vue";
import { Component } from "vue-property-decorator";
import { Getter, Action, State, Mutation } from "vuex-class";
import { namespace, Actions, Getters, Mutations } from "../../../Store/Modules/Dictionaries/constants";
import { ISeveritySynonymsDirectory, IDirectoryState, ISeveritySynonymsFilter } from "../../../Store/Modules/Dictionaries/types";
import { IColumnOptions, IFilterOptions } from "../../../Shared/Datatable/types";
import Datatable from "../../../Shared/Datatable/Datatable.vue";
import Modal from "../../../Shared/Modals/modal.vue";
import EditForm from "./EditForm.vue"
import { IDictionaryItem } from "../../../Store/Modules/Inventory/types";
import select2 from "../../../Shared/Select2/select2.vue";
import { removeConfirmation } from "../../../shared/utils";
import { ISeverityDirectoryModel } from "./types"
import CreateSeverity from "./CreateSeverity.vue"


@Component({
    components: {
        Datatable,
        Modal,
        EditForm,
        select2,
        CreateSeverity
    }
})
export default class Branches extends Vue {

    @Getter(Getters.SEVERITY_SYNONYMS_STATE, {namespace: namespace})
    State: IDirectoryState<ISeveritySynonymsDirectory, ISeveritySynonymsFilter>;

    @Action(Actions.FETCH_SEVERITY_SYNONYMS, { namespace: namespace })
    Fetch: (filter: ISeveritySynonymsFilter) => Promise<void>;

    @Action(Actions.FETCH_EQUIPMENT_LOG_SEVERITY, { namespace: namespace })
    FetchEquipmentLogSeverities: () => Promise<IDictionaryItem[]>;

    @Getter(Getters.EQUIPMENT_LOG_SEVERITY, {namespace})
    public readonly SeverityDictionary: IDictionaryItem[];

    @Action(Actions.REMOVE_SEVERITY_SYNONYM, { namespace: namespace })
    Remove: (severitySynonym: ISeveritySynonymsDirectory) => Promise<void>;

    @Mutation(Mutations.SET_SEVERITY_SYNONYMS_FILTER, { namespace: namespace })
    SetFilter: (filter: ISeveritySynonymsFilter) => void;

    get severitySynonyms(): ISeverityDirectoryModel[] {
        return this.State.Items.map((x, index) => {
            return {
                Index: index + 1,
                SeverityTitle: x.SeverityTitle,
                SeverityId: x.SeverityId,
                Synonym: x.Synonym
            }
        });
    }

    showCreateModal: boolean = false;
    showFilterModal: boolean = false;
    //selectedObjectType: IAttackTypeDirectory | null = null;
    selectedObjectTypeIndex: number | null = null;
    modalTitle: string = "Добавить уровень критичности";
    showError: boolean = false;
    errorText: string = "";

    //фильтр для окна фильтров
    additionalFilter: ISeveritySynonymsFilter;

    created() {
        this.additionalFilter = { ...this.State.Filter };
    }

    mounted() {
        this.FetchEquipmentLogSeverities();
        this.Fetch(this.State.Filter);
    }

    applyFilter(filter: ISeveritySynonymsFilter) {
        this.SetFilter(filter);
        this.Fetch(filter);
    }

    get selectedObjectType(): ISeveritySynonymsDirectory | null {
        if (this.selectedObjectTypeIndex != null) {
            return this.State.Items[this.selectedObjectTypeIndex];
        }
        return null;
    }

    selectDic(index: number): void {
        this.selectedObjectTypeIndex = index;
        this.modalTitle = "Изменить уровень критичности";
        this.showCreateModal = true;
    }

    selectNext(): void {
        if (this.selectedObjectTypeIndex == null) {
            return;
        }
        if (this.selectedObjectTypeIndex >= this.State.Items.length - 1) {
            this.selectedObjectTypeIndex = 0;
        } else {
            this.selectedObjectTypeIndex += 1;
        }
    }

    selectPrev(): void {
        if (this.selectedObjectTypeIndex == null) {
            return;
        }
        if (this.selectedObjectTypeIndex <= 0) {
            this.selectedObjectTypeIndex = this.State.Items.length - 1;
        } else {
            this.selectedObjectTypeIndex -= 1;
        }
    }


    removeDic(dic: ISeverityDirectoryModel): void {
        removeConfirmation(`Вы уверены, что хотите удалить уровень критичности <strong>${dic.Synonym}<strong>?`,
            () => {
                this.Remove(dic)
                    .then((result: any) => {
                        if (result.Success) {
                            this.Fetch(this.State.Filter);
                        } else {
                            this.errorText = result.Message;
                            this.showError = true;
                            setTimeout(() => this.showError = false, 5000);
                        }
                    });
            });
    }

    onDicSaved(dic: ISeveritySynonymsDirectory, closeModal: boolean) {
        this.Fetch(this.State.Filter);
        if (closeModal) {
            this.closeModal();
        }
    }

    onAddClick() {
        this.modalTitle = "Добавить уровень критичности";
        this.selectedObjectTypeIndex = null;
        this.showCreateModal = true;
    }

    closeModal() {
        this.selectedObjectTypeIndex = null;
        this.showCreateModal = false;
    }

    closeFilterModal() {
        this.showFilterModal = false;
    }

    openFilterModal() {
        this.additionalFilter = { ...this.State.Filter };
        this.showFilterModal = true;
    }

    applyAdditionalFilter(filter: ISeveritySynonymsFilter) {
        this.State.Filter.SeverityId = filter.SeverityId;
        this.State.Filter.Synonym = filter.Synonym;
        this.applyFilter(this.State.Filter);
        this.closeFilterModal();
    }


    private showCreateSeverityModal: boolean = false;
    private onSeveritySavedCallback: (severity: IDictionaryItem) => void;
    openCreateSeverityModal(callback: (severity: IDictionaryItem) => void) {
        this.showCreateSeverityModal = true;
        this.onSeveritySavedCallback = callback;
    }

    closeCreateSeverityModal() {
        this.showCreateSeverityModal = false;
    }

    onSeveritySaved(severity: IDictionaryItem): void {
        this.FetchEquipmentLogSeverities();
        this.showCreateSeverityModal = false;
        if (this.onSeveritySavedCallback) {
            this.onSeveritySavedCallback(severity);
        }
    }

    columns: Array<IColumnOptions> = [
        { Name: "Index", DisplayName: "№", Sort: false, SortColumnName: "Id" },
        { Name: "SeverityTitle", DisplayName: "Обозначение", Sort: true, SortColumnName: "SeverityTitle" },
        { Name: "Synonym", DisplayName: "Значение", Sort: true, SortColumnName: "Synonym" }
    ];

    private getActions(): IDictionaryItem[] {
        return [
            { Key: "edit", Value: "Редактировать" },
            { Key: "delete", Value: "Удалить" }
        ];
    }

    private actionValue: string = '';
    public selectorChange(value: any, dic: ISeverityDirectoryModel): void {
        switch (value) {
        case "edit": this.selectDic(dic.Index-1); break;
        case "delete": {
            this.removeDic(dic);
        } break;
        }
        this.actionValue = "";
    }

    get tableFilterOptions(): IFilterOptions[] {
        return [
            {
                ForColumn: "Index",
                FieldName: "Index",
                Type: "none",
                Value: "",
                CSSClass: ""
            },
            {
                ForColumn: "SeverityTitle",
                FieldName: "SeverityId",
                Placeholder: "Обозначение",
                Type: "select",
                CSSClass: "col-sm-4",
                Value: this.State.Filter ? this.State.Filter.SeverityId : undefined,
                SelectValues: this.SeverityDictionary
            },
            {
                ForColumn: "Synonym",
                FieldName: "Synonym",
                Placeholder: "Значение",
                Type: "text",
                CSSClass: "col-sm-6",
                Value: this.State.Filter ? this.State.Filter.Synonym : undefined,
            }
        ];
    }
}