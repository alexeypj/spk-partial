import Vue from "vue";
import { Component } from "vue-property-decorator";
import { Getter, Action, State, Mutation } from "vuex-class";
import { namespace, Actions, Getters, Mutations } from "../../../Store/Modules/Dictionaries/constants";
import { ICPUDirectory, IDirectoryState, ICPUFilter } from "../../../Store/Modules/Dictionaries/types";
import { IColumnOptions, IFilterOptions } from "../../../Shared/Datatable/types";
import Datatable from "../../../Shared/Datatable/Datatable.vue";
import Modal from "../../../Shared/Modals/modal.vue";
import EditForm from "./EditForm.vue";
import SearchFilter from "./SearchFilter.vue";
import { IDictionaryItem } from "../../../Store/Modules/Inventory/types";
import select2 from "../../../Shared/Select2/select2.vue";
import { removeConfirmation } from "../../../shared/utils";

@Component({
    components: {
        Datatable,
        Modal,
        EditForm,
        select2,
        SearchFilter
    }
})
export default class ObjectTypes extends Vue {

    @Getter(Getters.CPU_STATE, {namespace: namespace})
    State: IDirectoryState<ICPUDirectory, ICPUFilter>;

    @Action(Actions.FETCH_CPU, { namespace: namespace })
    Fetch: (filter: ICPUFilter) => Promise<void>;

    @Action(Actions.REMOVE_CPU, { namespace: namespace })
    Remove: (objectTypeID: number) => Promise<void>;

    @Mutation(Mutations.SET_CPU_FILTER, { namespace: namespace })
    SetFilter: (filter: ICPUFilter) => void;

    showCreateModal: boolean = false;
    showFilterModal: boolean = false;
    selectedObjectTypeIndex: number | null = null;
    modalTitle: string = "Добавить процессор";
    showError: boolean = false;
    errorText: string = "";

    //фильтр для окна фильтров
    additionalFilter: ICPUFilter;

    created() {
        this.additionalFilter = { ...this.State.Filter };
    }

    mounted() {
        this.Fetch(this.State.Filter);
    }

    applyFilter(filter: ICPUFilter) {
        this.SetFilter(filter);
        this.Fetch(filter);
    }

    get selectedObjectType(): ICPUDirectory | null {
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
        this.modalTitle = "Изменить процессор";
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

    removeDic(dic: ICPUDirectory): void {
        removeConfirmation(`Вы уверены, что хотите удалить <strong>${dic.Product}</strong>?`,
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

    onDicSaved(dic: ICPUDirectory, closeModal: boolean) {
        this.Fetch(this.State.Filter);
        if (closeModal) {
            this.closeModal();
        }
    }

    onAddClick() {
        this.modalTitle = "Добавить процессор";
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

    applyAdditionalFilter(filter: ICPUFilter) {
        this.State.Filter.Product = filter.Product;
        this.State.Filter.Manufacturer = filter.Manufacturer;
        this.applyFilter(this.State.Filter);
        this.closeFilterModal();
    }

    private columns: IColumnOptions[] = [
        { Name: "Id", DisplayName: "№", Sort: true, SortColumnName: "Id" },
        { Name: "Product", DisplayName: "Продукт", Sort: true, SortColumnName: "Product" },
        { Name: "Manufacturer", DisplayName: "Производитель", Sort: true, SortColumnName: "Manufacturer" },
        { Name: "CoresNumber", DisplayName: "Кол-во ядер", Sort: true, SortColumnName: "CoresNumber" }
    ];

    private getActions(): IDictionaryItem[] {
        return [
            { Key: "edit", Value: "Редактировать" },
            { Key: "delete", Value: "Удалить" }
        ];
    }

    private actionValue: string = '';
    public selectorChange(value: any, dic: ICPUDirectory): void {
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
                ForColumn: "Product",
                FieldName: "Product",
                Placeholder: "Продукт",
                Type: "text",
                CSSClass: "col-sm-4",
                Value: this.State.Filter ? this.State.Filter.Product : undefined,
            },
            {
                ForColumn: "Manufacturer",
                FieldName: "Manufacturer",
                Placeholder: "Производитель",
                Type: "text",
                CSSClass: "col-sm-4",
                Value: this.State.Filter ? this.State.Filter.Manufacturer : undefined,
            },
            {
                ForColumn: "CoresNumber",
                FieldName: "CoresNumber",
                Placeholder: "Кол-во ядер",
                Type: "text",
                CSSClass: "col-sm-2",
                Value: this.State.Filter ? this.State.Filter.Manufacturer : undefined,
            }

        ];
    }

}
