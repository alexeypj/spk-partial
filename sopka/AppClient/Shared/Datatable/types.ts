import { IDictionaryItem } from "../../Store/Modules/Inventory/types";

export interface ITableFilter {
    Page: number;
    ItemsPerPage: number;
    SortColumn: string;
    SortDirection: string;
    Query?: string
}

export interface IColumnOptions {
    Name: string;
    DisplayName: string;
    Sort?: boolean;
    SortColumnName?: string;
    UseComponent?: boolean;
    Component?: any
}

export interface IColumnFilter {
    Name: string;
    FilterValue: string;
}

export enum SortDirection {
    Asc = "ASC",
    Desc = "DESC",
}

/** Параметры фильтров для таблицы */
export interface IFilterOptions {
    /** Целевой столбец */
    ForColumn: string;
    /** Название в фильтре */
    FieldName: string;
    /** Тип text, select, date, datetime */
    Type: string;
    /** Установленное значение */
    Value: undefined|number|Date|string|string[];
    /** Значения для select */
    SelectValues?: IDictionaryItem[];
    /** Текст для плейсхолдера */
    Placeholder?: string;
    /** класса */
    CSSClass: string;
}
