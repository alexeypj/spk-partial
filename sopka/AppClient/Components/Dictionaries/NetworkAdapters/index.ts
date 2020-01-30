import Vue from "vue";
import { Component } from "vue-property-decorator";
import { Getter, Action, State, Mutation } from "vuex-class";
import { namespace, Actions, Getters, Mutations } from "../../../Store/Modules/Dictionaries/constants";
import { INetworkAdapterDirectory, IDirectoryState, INetworkAdapterFilter } from "../../../Store/Modules/Dictionaries/types";
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
export default class NetworkAdapter extends Vue {

    @Getter(Getters.NETWORK_ADAPTER_STATE, {namespace: namespace})
    State: IDirectoryState<INetworkAdapterDirectory, INetworkAdapterFilter>;

    @Action(Actions.FETCH_NETWORK_ADAPTER, { namespace: namespace })
    Fetch: (filter: INetworkAdapterFilter) => Promise<void>;

    @Action(Actions.REMOVE_NETWORK_ADAPTER, { namespace: namespace })
    Remove: (objectTypeID: number) => Promise<void>;

    @Mutation(Mutations.SET_NETWORK_ADAPTER_FILTER, { namespace: namespace })
    SetFilter: (filter: INetworkAdapterFilter) => void;

    showCreateModal: boolean = false;
    showFilterModal: boolean = false;
    selectedObjectTypeIndex: number | null = null;
    modalTitle: string = "Добавить сетевой адаптер";
    showError: boolean = false;
    errorText: string = "";

    //фильтр для окна фильтров
    additionalFilter: INetworkAdapterFilter;

    created() {
        this.additionalFilter = { ...this.State.Filter };
    }

    mounted() {
        this.Fetch(this.State.Filter);
    }

    applyFilter(filter: INetworkAdapterFilter) {
        this.SetFilter(filter);
        this.Fetch(filter);
    }

    get selectedObjectType(): INetworkAdapterDirectory | null {
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
        this.modalTitle = "Изменить сетевой адаптер";
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

    removeDic(dic: INetworkAdapterDirectory): void {
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

    onDicSaved(dic: INetworkAdapterDirectory, closeModal: boolean) {
        this.Fetch(this.State.Filter);
        if (closeModal) {
            this.closeModal();
        }
    }

    onAddClick() {
        this.modalTitle = "Добавить сетевой адаптер";
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

    applyAdditionalFilter(filter: INetworkAdapterFilter) {
        this.State.Filter.Title = filter.Title;
        this.State.Filter.Speed = filter.Speed;
        this.applyFilter(this.State.Filter);
        this.closeFilterModal();
    }


    columns: Array<IColumnOptions> = [
        { Name: "Id", DisplayName: "№", Sort: true, SortColumnName: "Id" },
        { Name: "Title", DisplayName: "Название", Sort: true, SortColumnName: "Title" },
		{ Name: "Speed", DisplayName: "Скорость, Мб/сек", Sort: true, SortColumnName: "Speed" }
    ];
    
    private getActions(): IDictionaryItem[] {
        return [
            { Key: "edit", Value: "Редактировать" },
            { Key: "delete", Value: "Удалить" }
        ];
    }

    private actionValue: string = '';
    public selectorChange(value: any, dic: INetworkAdapterDirectory): void {
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
                ForColumn: "Speed",
                FieldName: "Speed",
				Placeholder: "Скорость, Мб/сек",
                Type: "text",
                CSSClass: "col-sm-4",
                Value: this.State.Filter ? this.State.Filter.Speed : undefined,
            }
        ];
    }
}