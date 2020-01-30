import Vue from "vue";
import { Component } from "vue-property-decorator";
import { Getter, Action, State, Mutation } from "vuex-class";
import { namespace, Actions, Getters, Mutations } from "../../../Store/Modules/Dictionaries/constants";
import { IRAMDirectory, IDirectoryState, IRAMFilter } from "../../../Store/Modules/Dictionaries/types";
import { IColumnOptions, IFilterOptions } from "../../../Shared/Datatable/types";
import Datatable from "../../../Shared/Datatable/Datatable.vue";
import Modal from "../../../Shared/Modals/modal.vue";
import EditForm from "./EditForm.vue"
import SearchFilter from "./SearchFilter.vue"
import { IDictionaryItem } from "../../../Store/Modules/Inventory/types";
import select2 from "../../../Shared/Select2/select2.vue";
import { removeConfirmation } from "../../../shared/utils";


@Component({
    components: {
        Datatable,
        Modal,
        EditForm,
        SearchFilter,
        select2
    }
})
export default class RAM extends Vue {

    @Getter(Getters.RAM_STATE, {namespace: namespace})
    State: IDirectoryState<IRAMDirectory, IRAMFilter>;

    @Action(Actions.FETCH_RAM, { namespace: namespace })
    Fetch: (filter: IRAMFilter) => Promise<void>;

    @Action(Actions.REMOVE_RAM, { namespace: namespace })
    Remove: (objectTypeID: number) => Promise<void>;

    @Mutation(Mutations.SET_RAM_FILTER, { namespace: namespace })
    SetFilter: (filter: IRAMFilter) => void;

    showCreateModal: boolean = false;
    showFilterModal: boolean = false;
    selectedObjectTypeIndex: number | null = null;
    modalTitle: string = "Добавить память";
    showError: boolean = false;
    errorText: string = "";

    //фильтр для окна фильтров
    additionalFilter: IRAMFilter;

    created() {
        this.additionalFilter = { ...this.State.Filter };
    }

    mounted() {
        this.Fetch(this.State.Filter);
    }

    applyFilter(filter: IRAMFilter) {
        this.SetFilter(filter);
        this.Fetch(filter);
    }

    get selectedObjectType(): IRAMDirectory | null {
        if (this.selectedObjectTypeIndex != null) {
            return this.State.Items[this.selectedObjectTypeIndex];
        }
        return null;
    }

    selectDic(id: number): void {
        let index = this.State.Items.findIndex((value, index, obj) => {
            return value.Id === id;
        });
        this.selectedObjectTypeIndex = index;
        this.modalTitle = "Изменить память";
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

    removeDic(dic: IRAMDirectory): void {
        removeConfirmation(`Вы уверены, что хотите удалить <strong>${dic.Title}</strong>?`,
            () => {
                this.Remove(dic.Id)
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

    onDicSaved(dic: IRAMDirectory, closeModal: boolean) {
        this.Fetch(this.State.Filter);
        if (closeModal) {
            this.closeModal();
        }
    }

    onAddClick() {
        this.modalTitle = "Добавить память";
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

    applyAdditionalFilter(filter: IRAMFilter) {
        this.State.Filter.Title = filter.Title;
        this.State.Filter.Volume = filter.Volume;
        this.applyFilter(this.State.Filter);
        this.closeFilterModal();
    }


    columns: Array<IColumnOptions> = [
        { Name: "Id", DisplayName: "№", Sort: true, SortColumnName: "Id" },
        { Name: "Title", DisplayName: "Название", Sort: true, SortColumnName: "Title" },
        { Name: "Volume", DisplayName: "Объем, гб", Sort: true, SortColumnName: "Volume" }
    ];

    private getActions(): IDictionaryItem[] {
        return [
            { Key: "edit", Value: "Редактировать" },
            { Key: "delete", Value: "Удалить" }
        ];
    }

    private actionValue: string = '';
    public selectorChange(value: any, dic: IRAMDirectory): void {
        switch (value) {
        case "edit": this.selectDic(dic.Id); break;
        case "delete": {
            this.removeDic(dic);
        } break;
        }
        this.actionValue = "";
    }


    get tableFilterOptions(): IFilterOptions[] {
        return [
            {
                ForColumn: "Id",
                FieldName: "Id",
                Placeholder: "Id",
                Type: "text",
                CSSClass: "col-sm-1",
                Value: this.State.Filter ? this.State.Filter.Id : undefined
            },
            {
                ForColumn: "Title",
                FieldName: "Title",
                Placeholder: "Название",
                Type: "text",
                CSSClass: "col-sm-6",
                Value: this.State.Filter ? this.State.Filter.Title : undefined,
            },
            {
                ForColumn: "Volume",
                FieldName: "Volume",
                Placeholder: "Объем",
                Type: "text",
                CSSClass: "col-sm-4",
                Value: this.State.Filter ? this.State.Filter.Volume : undefined,
            }
        ];
    }


}