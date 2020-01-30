import Vue from "vue";
import { Component } from "vue-property-decorator";
import { Getter, Action, State, Mutation } from "vuex-class";
import { namespace, Actions, Getters, Mutations } from "../../../Store/Modules/Dictionaries/constants";
import { IOSDirectory, IDirectoryState, IOSFilter } from "../../../Store/Modules/Dictionaries/types";
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
        select2,
        SearchFilter
    }
})
export default class ObjectTypes extends Vue {

    @Getter(Getters.OS_STATE, {namespace: namespace})
    State: IDirectoryState<IOSDirectory, IOSFilter>;

    @Action(Actions.FETCH_OS, { namespace: namespace })
    Fetch: (filter: IOSFilter) => Promise<void>;

    @Action(Actions.REMOVE_OS, { namespace: namespace })
    Remove: (objectTypeID: number) => Promise<void>;

    @Mutation(Mutations.SET_OS_FILTER, { namespace: namespace })
    SetFilter: (filter: IOSFilter) => void;

    showCreateModal: boolean = false;
    showFilterModal: boolean = false;
    selectedObjectTypeIndex: number | null = null;
    modalTitle: string = "Добавить ОС";
    showError: boolean = false;
    errorText: string = "";

    //фильтр для окна фильтров
    additionalFilter: IOSFilter;

    created() {
        this.additionalFilter = { ...this.State.Filter };
    }

    mounted() {
        this.Fetch(this.State.Filter);
    }

    applyFilter(filter: IOSFilter) {
        this.SetFilter(filter);
        this.Fetch(filter);
    }

    get selectedObjectType(): IOSDirectory | null {
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
        this.modalTitle = "Изменить ОС";
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

    removeDic(dic: IOSDirectory): void {
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

    onDicSaved(dic: IOSDirectory, closeModal: boolean) {
        this.Fetch(this.State.Filter);
        if (closeModal) {
            this.closeModal();
        }
    }

    onAddClick() {
        this.modalTitle = "Добавить ОС";
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

    applyAdditionalFilter(filter: IOSFilter) {
        this.State.Filter.Product = filter.Product;
        this.State.Filter.Manufacturer = filter.Manufacturer;
        this.applyFilter(this.State.Filter);
        this.closeFilterModal();
    }


    columns: Array<IColumnOptions> = [
        { Name: "Id", DisplayName: "№", Sort: true, SortColumnName: "Id" },
        { Name: "Product", DisplayName: "Продукт", Sort: true, SortColumnName: "Product" },
        { Name: "Manufacturer", DisplayName: "Производитель", Sort: true, SortColumnName: "Manufacturer" }
    ];

    private getActions(): IDictionaryItem[] {
        return [
            { Key: "edit", Value: "Редактировать" },
            { Key: "delete", Value: "Удалить" }
        ];
    }

    private actionValue: string = '';
    public selectorChange(value: any, dic: IOSDirectory): void {
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
                CSSClass: "col-sm-5",
                Value: this.State.Filter ? this.State.Filter.Product : undefined,
            },
            {
                ForColumn: "Manufacturer",
                FieldName: "Manufacturer",
                Placeholder: "Производитель",
                Type: "text",
                CSSClass: "col-sm-5",
                Value: this.State.Filter ? this.State.Filter.Manufacturer : undefined,
            }
        ];
    }
}