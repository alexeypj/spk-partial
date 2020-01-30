import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { ITableFilter, IColumnOptions, IColumnFilter, IFilterOptions, SortDirection } from "./types";
import Columnfilter from "./Filters/filters.vue";

@Component({
    components: {
        Columnfilter
    }
})
export default class Datatable extends Vue {

    private readonly pageButtonsCount: number = 5;

    @Prop({ required: true })
    public readonly filter: ITableFilter;

    // column[0] holds the key
    @Prop({ required: true })
    public readonly columns: IColumnOptions[];

    @Prop({ required: true })
    public readonly items: any[];

    @Prop({ required: true })
    public readonly totalItems: number;

    @Prop({ required: true })
    public readonly applyFilter: (filter: ITableFilter) => void;

    @Prop()
    public readonly rowClickHandler: (key: number) => void;

    /** Отображается ли дополнительная колонка */
    @Prop({ default: false })
    public readonly hasActions: boolean;

    /** @see IFilterOption */
    @Prop({default: false})
    public readonly hasFilters: boolean;

    @Prop()
    public readonly filterOptions: IFilterOptions[];

    @Prop({default: false})
    public readonly hasSearch: boolean;

    private showColumnFilters: boolean = false;
    private columnFilters: IColumnFilter[] = [];
    private searchString: string = "";

    public getKey(item: any): string {
        return item[this.columns[0].Name];
    }

    public getDataColumns(): IColumnOptions[] {
        return this.columns
            .filter((item: IColumnOptions, idx: number) => idx !== 0);
    }

    public setPage(page: number): void {
        const newFilter: ITableFilter = { ...this.filter, Page: page };
        this.applyFilter(newFilter);
    }

    public setItemsPerPage(): void {
        const selector: HTMLSelectElement = document.getElementById("itemsPerPageSelector") as HTMLSelectElement;
        const newFilter: ITableFilter = { ...this.filter, Page: 1, ItemsPerPage: Number(selector.value) };
        this.applyFilter(newFilter);
    }

    public switchColumnFilters(): void {
        this.showColumnFilters = !this.showColumnFilters;
    }

    public search(): void {
        this.$emit("search", this.searchString);
    }

    get pagesNumber(): number {
        const itemsPerPage: number = this.filter.ItemsPerPage || 5;
        return Math.ceil(this.totalItems / itemsPerPage);
    }

    get pageButtonsRange(): number[] {
        var allPages = [...Array(this.pagesNumber).keys()].map(x => x + 1);
        if (this.pagesNumber <= this.pageButtonsCount) {
            return allPages;
        }
        var from = this.filter.Page - 2;
        var to = this.filter.Page + 2;
        if (from < 1) {
            from = 1;
            to = from + this.pageButtonsCount -1;
        }
        if (to > this.pagesNumber) {
            to = this.pagesNumber;
            from = to - this.pageButtonsCount + 1;
        }
        return allPages.filter(x => x >= from && x <= to);
    }

    public itemsPerPage: number[] = [5, 10, 15, 20];

    private getFilterOptions(columnName: string): IFilterOptions | undefined {
        if (this.filterOptions) {
            const options = this.filterOptions.find(x => x.ForColumn === columnName);
            if (options) {
                return options;
            }
        }
    }

    private getFilterCSS(columnName: string): string | undefined {
        const options = this.getFilterOptions(columnName);
        if (options) {
            return options.CSSClass;
        }
    }

    private onQueryChanged() {
        this.applyFilter(this.filter);
    }

    public updateFilterValue(fieldName: string, value: string) {
        const newFilter: ITableFilter = { ...this.filter };
        newFilter[fieldName] = value;
        this.applyFilter(newFilter);
    }

    getSortIcon(column: IColumnOptions): string {
        if (!column.Sort || !column.SortColumnName) {
            return "";
        }
        if (column.SortColumnName !== this.filter.SortColumn) {
            return "fa-sort";
        }
        return this.filter.SortDirection === SortDirection.Asc ? "fa-sort-asc" : "fa-sort-desc";
    }

    sort(column: IColumnOptions): void {
        if (!column.Sort || !column.SortColumnName) {
            return;
        }
        var newFilter = { ...this.filter };
        if (newFilter.SortColumn !== column.SortColumnName) {
            newFilter.SortColumn = column.SortColumnName || "";
            newFilter.SortDirection = SortDirection.Asc;
        } else {
            newFilter.SortDirection = newFilter.SortDirection === SortDirection.Asc
                ? SortDirection.Desc
                : SortDirection.Asc;
        }
        this.applyFilter(newFilter);
    }

    private rowClick(key: number) {
        if (this.rowClickHandler) {
            this.rowClickHandler(key);
        }
    }
}
