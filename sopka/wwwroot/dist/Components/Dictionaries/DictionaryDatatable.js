var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import select2 from "../../Shared/Select2/select2.vue";
let DictionaryDatatable = class DictionaryDatatable extends Vue {
    constructor() {
        super(...arguments);
        this.showColumnFilters = false;
        this.columnFilters = [];
        this.searchString = "";
        this.itemsPerPage = [5, 10, 15, 20];
        this.actionValue = "";
        this.actions = [
            { Key: "", Value: "Действия" },
            { Key: "edit", Value: "Редактировать" },
            { Key: "delete", Value: "Удалить" }
        ];
    }
    getKey(item) {
        return item[this.columns[0].Name];
    }
    getDataColumns() {
        return this.columns
            .filter((item, idx) => idx !== 0)
            .map(x => x.Name);
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
    searchByColumn(columnName, e) {
        debugger;
        if (e.target != null) {
            const target = e.target;
            if (target.value.length >= 2) {
                const columnFilter = this.columnFilters.find(x => x.Name === columnName);
                if (columnFilter) {
                    columnFilter.FilterValue = target.value;
                }
                else {
                    this.columnFilters.push({ Name: columnName, FilterValue: target.value });
                }
                this.$emit("applyColumnFilter", this.columnFilters);
            }
        }
    }
    search() {
        const newFilter = Object.assign({}, this.filter, { Query: this.searchString });
        this.applyFilter(newFilter);
    }
    get pagesNumber() {
        const itemsPerPage = this.filter.ItemsPerPage || 5;
        return Math.ceil(this.totalItems / itemsPerPage);
    }
    selectorChange(value, item, el) {
        switch (value) {
            case "edit":
                this.rowClickHandler(item.Id);
                break;
            case "delete":
                this.removeHandler(item);
                break;
        }
        this.actionValue = "";
        $(el).val("").trigger("change");
    }
};
__decorate([
    Prop({ required: true })
], DictionaryDatatable.prototype, "filter", void 0);
__decorate([
    Prop({ required: true })
], DictionaryDatatable.prototype, "columns", void 0);
__decorate([
    Prop({ required: true })
], DictionaryDatatable.prototype, "items", void 0);
__decorate([
    Prop({ required: true })
], DictionaryDatatable.prototype, "totalItems", void 0);
__decorate([
    Prop({ required: true })
], DictionaryDatatable.prototype, "applyFilter", void 0);
__decorate([
    Prop()
], DictionaryDatatable.prototype, "rowClickHandler", void 0);
__decorate([
    Prop()
], DictionaryDatatable.prototype, "removeHandler", void 0);
__decorate([
    Prop({ default: false })
], DictionaryDatatable.prototype, "hasFilters", void 0);
__decorate([
    Prop({ default: false })
], DictionaryDatatable.prototype, "showSearch", void 0);
DictionaryDatatable = __decorate([
    Component({
        components: {
            select2
        }
    })
], DictionaryDatatable);
export default DictionaryDatatable;
//# sourceMappingURL=DictionaryDatatable.js.map