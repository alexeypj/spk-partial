import { SortDirection } from "../../../Shared/Datatable/types";
import moment from "moment";
export function createFilter() {
    return {
        UsePeriod: false,
        DateFrom: moment().add(-1, "h").format("YYYY-MM-DD HH:mm:ss"),
        DateTo: moment().format("YYYY-MM-DD HH:mm:ss"),
        Page: 1,
        ItemsPerPage: 10,
        SortDirection: SortDirection.Asc,
        SortColumn: "Date"
    };
}
//# sourceMappingURL=types.js.map