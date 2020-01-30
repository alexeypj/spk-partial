import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Getter, Action, State, Mutation, } from "vuex-class";
import { Getters, Actions, Mutations, namespace } from "../../Store/Modules/Companies/constants";
import { ICompanyFilter, ICompaniesState, ICompanyListItem, ICompanyEditModel } from "Store/Modules/Companies/types";
import { IColumnOptions, IFilterOptions } from "../../Shared/Datatable/types";
import moment from "moment";
import { IDictionaryItem, IDictionaryItem as IDictionaryItem1 } from "../../Store/Modules/Inventory/types";
import Datatable from "../../Shared/Datatable/Datatable.vue";
import Modal from "../../Shared/Modals/modal.vue";
import select2 from "../../Shared/Select2/select2.vue";
import ChangeBalance from "./ChangeBalance.vue";
import LimitationsCell from "./TableCellComponents/LimitationsCell.vue";
import SupportCell from "./TableCellComponents/SupportCell.vue";
import EditForm from "./EditForm.vue";
import "vue-date-pick/dist/vueDatePick.css";

@Component({
    components: {
        Datatable,
        Modal,
        select2,
        ChangeBalance,
        LimitationsCell,
        EditForm
    }
})
export default class Companies extends Vue {

    @Action(Actions.FETCH_COMPANIES, {namespace: namespace})
    FetchCompanies: (filter: ICompanyFilter) => Promise<ICompanyListItem[]>;

    @Getter(Getters.COMPANIES_LIST, {namespace})
    List: ICompanyListItem[];

    @Getter(Getters.FILTER, {namespace})
    Filter: ICompanyFilter;

    @Getter(Getters.TOTAL, {namespace})
    TotalItems: number;

    @Mutation(Mutations.SET_FILTER, {namespace})
    SetFilter: (filter: ICompanyFilter) => void;

    mounted(): void {
        this.FetchCompanies(this.Filter);
    }

    applyFilter(filter: ICompanyFilter): void {
        this.SetFilter(filter);
        this.FetchCompanies(filter);
    }

    reload(): void {
        this.FetchCompanies(this.Filter);
    }

    private selectedCompanyId: number | null = null;
    private errorText: string = "";
    private showChangeBalanceForm: boolean = false;
    private showEditForm: boolean = false;

    private actionValue: string = "";
    public selectorChange(value: any, company: ICompanyListItem): void {
        switch (value) {
            case "changeBalance":
                this.selectedCompanyId = company.Id;
                this.showChangeBalanceForm = true;
                break;
            case "edit":
                this.selectedCompanyId = company.Id;
                this.showEditForm = true;
                break;
        }
        this.actionValue = "";
    }

    get SelectedCompanyToEdit(): ICompanyEditModel | null {
        if (this.selectedCompanyId) {
            const company = this.List.find(x => x.Id == this.selectedCompanyId);
            if (!company) {
                return null;
            }
            return {
                Id: company.Id,
                ObjectsCount: company.ObjectsCount,
                UsersCount: company.UsersCount,
                EquipmentsCount: company.EquipmentsCount,
                Support: company.Support,
                PaidTo: company.PaidTo,
                Name: company.Name,
                Comment: company.Comment,
                ResponsiblePersonEmail: company.ResponsiblePersonEmail,
                PaidToFormatted: ""
            };
        }
        return null;
    }

    private columns: IColumnOptions[] = [
        { Name: "Id", DisplayName: "№", Sort: true, SortColumnName: "Id" },
        { Name: "Name", DisplayName: "Название", Sort: true, SortColumnName: "Name" },
        { Name: "Support", DisplayName: "Поддержка", Sort: true, SortColumnName: "Support", UseComponent: true, Component: SupportCell },
        { Name: "PaidToFormatted", DisplayName: "Срок истечения", Sort: true, SortColumnName: "PaidTo" },
        { Name: "UsersCount", DisplayName: "Ограничения", UseComponent: true, Component: LimitationsCell },
        { Name: "ResponsiblePersonEmail", DisplayName: "Ответственный", Sort: true, SortColumnName: "ResponsiblePersonEmail" },
        { Name: "Comment", DisplayName: "Коментарий", Sort: true, SortColumnName: "Comment" }
    ];

    private getActions(user: ICompanyListItem): IDictionaryItem[] {
        return [
            { Key: "changeBalance", Value: "Пополнить баланс" },
            { Key: "edit", Value: "Редактировать" }
        ];
    }


    get tableFilterOptions(): IFilterOptions[] {
        return [
            {
                ForColumn: "Id",
                FieldName: "Id",
                Type: "none",
                CSSClass: "",
                Value: ""
            },
            {
                ForColumn: "Name",
                FieldName: "Name",
                Placeholder: "Название",
                Type: "text",
                CSSClass: "col-sm-2",
                Value: this.Filter ? this.Filter.Name : undefined
            },
            {
                ForColumn: "Support",
                FieldName: "Support",
                Placeholder: "Поддержка",
                Type: "select",
                CSSClass: "col-sm-1",
                Value: this.Filter ? this.Filter.Support : undefined,
                SelectValues: [{ Key: 1, Value: "Да" }, { Key: 0, Value: "Нет" }]
            },
            {
                ForColumn: "PaidToFormatted",
                FieldName: "PaidTo",
                Placeholder: "Срок истечения",
                Type: "date",
                CSSClass: "col-sm-1",
                Value: this.Filter ? this.Filter.PaidTo : undefined,
            },
            {
                ForColumn: "ResponsiblePersonEmail",
                FieldName: "ResponsiblePersonEmail",
                Placeholder: "Ответсвенный",
                Type: "text",
                CSSClass: "col-sm-2",
                Value: this.Filter ? this.Filter.ResponsiblePersonEmail : undefined,
            },
            {
                ForColumn: "Comment",
                FieldName: "Comment",
                Placeholder: "Коментарий",
                Type: "text",
                CSSClass: "col-sm-3",
                Value: this.Filter ? this.Filter.Comment : undefined,
            }
        ];
    }


}