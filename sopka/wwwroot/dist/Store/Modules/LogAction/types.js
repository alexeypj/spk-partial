import moment from "moment";
import { SortDirection } from "../../../Shared/Datatable/types";
var Desc = SortDirection.Desc;
export function GetDefaultFilter() {
    return {
        DateFrom: moment().add(-2, "h").format("YYYY-MM-DD HH:mm:ss"),
        DateTo: moment().add(1, "h").format("YYYY-MM-DD HH:mm:ss"),
        UserId: null,
        ActionName: null,
        SessionId: null,
        Page: 1,
        ItemsPerPage: 10,
        SortColumn: "Id",
        SortDirection: Desc,
        ActionType: undefined,
        Date: undefined,
        EntityType: undefined,
        Id: undefined,
    };
}
//# sourceMappingURL=types.js.map