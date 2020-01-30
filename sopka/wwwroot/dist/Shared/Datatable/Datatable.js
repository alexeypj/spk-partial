var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { SortDirection } from "./types";
import Columnfilter from "./Filters/filters.vue";
let Datatable = class Datatable extends Vue {
    constructor() {
        super(...arguments);
        this.showColumnFilters = false;
        this.columnFilters = [];
        this.searchString = "";
        this.itemsPerPage = [5, 10, 15, 20];
    }
    getKey(item) {
        return item[this.columns[0].Name];
    }
    getDataColumns() {
        return this.columns
            .filter((item, idx) => idx !== 0);
    }
    setPage(page) {
        const newFilter = Object.assign({}, this.filter, { Page: page });
        this.applyFilter(newFilter);
    }
    setItemsPerPage() {
        const selector = document.getElementById("itemsPerPageSelector");
        const newFilter = Object.assign({}, this.filter, { Page: 1, ItemsPerPage: Number(selector.value) });
        this.applyFilter(newFilter);
    }
    switchColumnFilters() {
        this.showColumnFilters = !this.showColumnFilters;
    }
    search() {
        this.$emit("search", this.searchString);
    }
    get pagesNumber() {
        const itemsPerPage = this.filter.ItemsPerPage || 5;
        return Math.ceil(this.totalItems / itemsPerPage);
    }
    getFilterOptions(columnName) {
        if (this.filterOptions) {
            const options = this.filterOptions.find(x => x.ForColumn === columnName);
            if (options) {
                return options;
            }
        }
        console.warn(`No options for column ${columnName}`);
    }
    getFilterCSS(columnName) {
        const options = this.getFilterOptions(columnName);
        if (options) {
            return options.CSSClass;
        }
    }
    updateFilterValue(fieldName, value) {
        const newFilter = Object.assign({}, this.filter);
        newFilter[fieldName] = value;
        this.applyFilter(newFilter);
    }
    getSortIcon(column) {
        if (!column.Sort || !column.SortColumnName) {
            return "";
        }
        if (column.SortColumnName !== this.filter.SortColumn) {
            return "fa-sort";
        }
        return this.filter.SortDirection === SortDirection.Asc ? "fa-sort-asc" : "fa-sort-desc";
    }
    sort(column) {
        if (!column.Sort || !column.SortColumnName) {
            return;
        }
        var newFilter = Object.assign({}, this.filter);
        if (newFilter.SortColumn !== column.SortColumnName) {
            newFilter.SortColumn = column.SortColumnName || "";
            newFilter.SortDirection = SortDirection.Asc;
        }
        else {
            newFilter.SortDirection = newFilter.SortDirection === SortDirection.Asc
                ? SortDirection.Desc
                : SortDirection.Asc;
        }
        this.applyFilter(newFilter);
    }
    rowClick(key) {
        if (this.rowClickHandler) {
            this.rowClickHandler(key);
        }
    }
};
__decorate([
    Prop({ required: true })
], Datatable.prototype, "filter", void 0);
__decorate([
    Prop({ required: true })
], Datatable.prototype, "columns", void 0);
__decorate([
    Prop({ required: true })
], Datatable.prototype, "items", void 0);
__decorate([
    Prop({ required: true })
], Datatable.prototype, "totalItems", void 0);
__decorate([
    Prop({ required: true })
], Datatable.prototype, "applyFilter", void 0);
__decorate([
    Prop()
], Datatable.prototype, "rowClickHandler", void 0);
__decorate([
    Prop({ default: false })
], Datatable.prototype, "hasActions", void 0);
__decorate([
    Prop({ default: false })
], Datatable.prototype, "hasFilters", void 0);
__decorate([
    Prop()
], Datatable.prototype, "filterOptions", void 0);
__decorate([
    Prop({ default: false })
], Datatable.prototype, "hasSearch", void 0);
Datatable = __decorate([
    Component({
        components: {
            Columnfilter
        }
    })
], Datatable);
export default Datatable;
//# sourceMappingURL=Datatable.js.map