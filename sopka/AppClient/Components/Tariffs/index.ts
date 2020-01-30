import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import { namespace, Actions, Getters, Mutations } from "../../Store/Modules/Tariffs/constants";
import { Action, Getter, Mutation } from "vuex-class";
import { IUser, IUserRole } from "../../Store/Modules/Common/types";
import { ITariff, ITariffFilter, ITariffsState, ITariffInList } from "../../Store/Modules/Tariffs/types";
import Datatable from "../../Shared/Datatable/Datatable.vue";
import Modal from "../../Shared/Modals/modal.vue";
import Columnfilter from "../../Shared/Datatable/Filters/filters.vue";
import { IFilterOptions, IColumnOptions } from "../../Shared/Datatable/types";
import { IDictionaryItem } from "../../Store/Modules/Inventory/types";
import select2 from "../../Shared/Select2/select2.vue";
import { logAction, removeConfirmation } from "../../Shared/utils";
import { LogActions, EntityType } from "../../Shared/LogActions"
import { Getters as commonGetters, namespace as commonNamespace } from "../../Store/Modules/Common/constants";
import SupportCell from "./TableCellComponents/SupportCell.vue";
import IsActiveCell from "./TableCellComponents/IsActiveCell.vue";
import EditForm from "./EditForm/editForm.vue";


@Component({
    components: {
        Datatable,
        Modal,
        Columnfilter,
        select2,
        SupportCell,
        EditForm
    }
})
export default class Tariffs extends Vue {

    @Action(Actions.FETCH_TARIFFS_LIST, { namespace })
    public readonly FetchTariffList: (filter: ITariffFilter) => Promise<ITariff[]>;

    @Action(Actions.REMOVE_TARIFF, { namespace })
    public readonly RemoveTariff: (tariffId: number) => Promise<any>;

    @Getter(Getters.IS_LOADING, { namespace })
    public readonly IsLoading: boolean;

    @Getter(Getters.TARIFFS_LIST, { namespace })
    public readonly Tariffs: ITariff[];

    @Getter(Getters.FILTER, { namespace })
    public readonly Filter: ITariffFilter;

    @Getter(Getters.SELECTED_TARIFF_ID, { namespace })
    public readonly SelectedTariffId: number | null;

    @Getter(Getters.TARIFFS_TOTAL, { namespace })
    public readonly Total: number;

    @Mutation(Mutations.SET_SELECTED_TARIFF_ID, { namespace })
    public readonly SetSelectedTariffId: (id?: number) => void;

    @Mutation(Mutations.SET_FILTER, { namespace })
    public readonly SetFilter: (filter: ITariffFilter) => void;

    @Getter(commonGetters.IS_SUPER_ADMIN_OR_PAID, { namespace: commonNamespace })
    public readonly IsSuperAdminOrPaidAccess: boolean;

    @Watch("Tariffs")
    private onUsersChange(): void {
        this.initTariffs();
    }

    private errorText: string = "";
    private showColumnFilters: boolean = false;

    public mounted(): void {
        this.FetchTariffList(this.Filter)
            .then(() => {
                this.initTariffs();
                const id: any = this.$router.currentRoute.params.Id;
                if (id) {
                    this.SetSelectedTariffId(id);
                }
            })
            .catch(error => this.errorText = "Ошибка получения списка тарифов");
        logAction(LogActions.UserIndex);
    }

    private initTariffs() {
    }

    public create(): void {
        this.$router.push({ path: "/Tariffs", params: { Id : "0"}});
        this.SetSelectedTariffId(0);
    }

    public closeModals(): void {
        this.$router.push({ path: "/Tariffs" });
        this.SetSelectedTariffId();
    }

    public reload(): void {
        this.FetchTariffList(this.Filter);
        setTimeout(this.closeModals, 1000);
    }

    public open(id: number): void {
        this.$router.push({path: "/Tariffs", query: { id : id.toString()}});
        this.SetSelectedTariffId(id);
    }

    get tariffs(): ITariffInList[] {
        return this.Tariffs.map(x => {
            return {
                ...x,
                ActiveText: x.IsActive ?
                    `Да`:
                    `Нет`,
                SupportText: x.Support ?
                    `Да`:
                    `Нет`,
            };
        });
    }

    removeTariff(tariff: ITariff): void {
        this.errorText = "";
        removeConfirmation(
            `Вы уверены, что хотите удалить тариф <strong>${tariff.Name}</strong>?`,
            () => {
                this.RemoveTariff(tariff.Id)
                    .then((result: any) => {
                        if (result.Success) {
                            this.FetchTariffList(this.Filter);
                        } else {
                            this.errorText = result.Message;
                        }

                    })
                    .catch((error) => this.errorText = error);
            }
        );
    }

    private getActions(user: ITariff): IDictionaryItem[] {
        return [
            { Key: "edit", Value: "Редактировать"},
            { Key: "delete", Value: "Удалить"}
        ];
    }

    private actionValue: string = "";
    private showEditForm: boolean = false;
    public selectorChange(value: any, tariff: ITariffInList): void {
        switch (value) {
            case "delete":
                this.removeTariff(tariff);
                break;
            case "edit":
                this.SetSelectedTariffId(tariff.Id);
                this.showEditForm = true;
                break;
        }
        this.actionValue = "";
    }

    public applyFilter(filter: ITariffFilter) {
        this.SetFilter(filter);
        this.FetchTariffList(filter);
    }

    private columns: IColumnOptions[] = [
        { Name: "Id", DisplayName: "№", Sort: true, SortColumnName: "Id" },
        { Name: "Name", DisplayName: "Наименование", Sort: true, SortColumnName: "Name" },
        { Name: "SupportText", DisplayName: "Техподдержка", Sort: true, SortColumnName: "Support", UseComponent: true, Component: SupportCell },
        { Name: "ActiveText", DisplayName: "Активен", Sort: true, SortColumnName: "IsActive", UseComponent: true, Component: IsActiveCell }
    ];
}
