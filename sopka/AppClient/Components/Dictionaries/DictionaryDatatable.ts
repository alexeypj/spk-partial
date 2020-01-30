import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { ITableFilter, IColumnOptions, IColumnFilter } from "../../Shared/Datatable/types";
import { IDictionaryFilter } from "../../Store/Modules/Dictionaries/types";
import select2 from "../../Shared/Select2/select2.vue";
import { IDictionaryItem } from "../../Store/Modules/Inventory/types";

@Component({
    components: {
        select2
    }
})
export default class DictionaryDatatable extends Vue {

    @Prop({ required: true })
    public readonly filter: IDictionaryFilter;

    // column[0] holds the key
    @Prop({ required: true })
    public readonly columns: IColumnOptions[];

    @Prop({ required: true })
    public readonly items: any[];

    @Prop({ required: true })
    public readonly totalItems: number;

    @Prop({ required: true })
    public readonly applyFilter: (filter: IDictionaryFilter) => void;

    @Prop()
    public readonly rowClickHandler: (key: number) => void;

    @Prop()
    public readonly removeHandler: (item: any) => void;

    @Prop({ default: false })
    public readonly hasFilters: boolean;

    @Prop({ default: false })
    public readonly showSearch: boolean;

    private showColumnFilters: boolean = false;
    private columnFilters: IColumnFilter[] = [];
    private searchString: string = "";

    public getKey(item: any): string {
        return item[this.columns[0].Name];
    }

    public getDataColumns(): string[] {
        return this.columns
            .filter((item: IColumnOptions, idx: number) => idx !== 0)
            .map(x => x.Name);
    }

    public setPage(page: number): void {
        const newFilter: IDictionaryFilter = { ...this.filter, Page: page };
        this.applyFilter(newFilter);
    }

    public setItemsPerPage(): void {
        const selector: HTMLSelectElement = document.getElementById("itemsPerPageSelector") as HTMLSelectElement;
        const newFilter: IDictionaryFilter = { ...this.filter, Page: 1, ItemsPerPage: Number(selector.value) };
        this.applyFilter(newFilter);
    }

    public switchColumnFilters(): void {
        this.showColumnFilters = !this.showColumnFilters;
    }

    public searchByColumn(columnName: string, e: Event): void {
        debugger;
        if (e.target != null) {
            const target = e.target as HTMLInputElement;
            if (target.value.length >= 2) {
                const columnFilter = this.columnFilters.find(x => x.Name === columnName);
                if (columnFilter) {
                    columnFilter.FilterValue = target.value;
                } else {
                    this.columnFilters.push({ Name: columnName, FilterValue: target.value });
                }
                this.$emit("applyColumnFilter", this.columnFilters);
            }
        }
    }

    public search(): void {
        const newFilter: IDictionaryFilter = { ...this.filter, Query: this.searchString };
        this.applyFilter(newFilter);
    }

    get pagesNumber(): number {
        const itemsPerPage: number = this.filter.ItemsPerPage || 5;
        return Math.ceil(this.totalItems / itemsPerPage);
    }

    public itemsPerPage: number[] = [5, 10, 15, 20];

    public selectorChange(value: string, item: any, el: any): void {
        switch (value) {
            case "edit": this.rowClickHandler(item.Id); break;
            case "delete": this.removeHandler(item); break;
        }
        this.actionValue = "";
        $(el).val("").trigger("change");
    }

    public actionValue: string = "";
    public  actions: IDictionaryItem[] = [
        { Key: "", Value: "Действия" },
        { Key: "edit", Value: "Редактировать" },
        { Key: "delete", Value: "Удалить" }
    ];
}
