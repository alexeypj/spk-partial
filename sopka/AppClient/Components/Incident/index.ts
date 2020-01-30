import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { Getter, Action, State, Mutation } from "vuex-class";
import Datatable from "../../Shared/Datatable/Datatable.vue";
import IncidentFilter from "./Filter/IncidentFilter.vue";
import { namespace, Actions, Getters, Mutations } from "../../Store/Modules/Incident/constants";
import moment from "moment";
import {
  IIncidentCreationState,
  IIncidentCreationDictionaries,
  IIncident,
  IIncidentListFilter,
  IIncidentListItem,
  IIncidentStatus
} from "../../Store/Modules/Incident/types";
import { IDictionaryItem } from "../../Store/Modules/Inventory/types";
import { IColumnOptions, IFilterOptions } from "../../Shared/Datatable/types";
import DatePick from "vue-date-pick";
import "vue-date-pick/dist/vueDatePick.css";
import Form from "./Form/form.vue";
import select2 from "../../Shared/Select2/select2.vue";
import { formatDate, logAction } from "../../Shared/utils";
import { LogActions, EntityType } from "../../Shared/LogActions";
import { Getters as commonGetters, namespace as commonNamespace, losingChangesConfirmation } from "../../Store/Modules/Common/constants";
import { IUser, IFile } from "../../Store/Modules/Common/types";

@Component({
    components: {
        DatePick,
        IncidentFilter,
        Datatable,
        Form,
        select2
    }
})
export default class IncidentCreation extends Vue {

    @Prop()
    public readonly Id: number | undefined;

    @Prop()
    public readonly EquipmentId: number | undefined;

    @State(namespace)
    public readonly State: IIncidentCreationState;

    @Getter(Getters.GET_CURRENT_FILTER, { namespace })
    public readonly Filter: IIncidentListFilter;

    @Getter(Getters.GET_DICTIONARIES_FOR_CREATION, { namespace })
    public readonly Dictionaries: IIncidentCreationDictionaries;

    @Action(Actions.FETCH_DICTIONARIES_FOR_CREATION, { namespace })
    public FetchDictionaries: () => Promise<void>;

    @Action(Actions.FETCH_STATUSES, { namespace })
    public FetchStatuses: () => Promise<IIncidentStatus[]>;

    @Getter(Getters.GET_DICTIONARIES_FOR_FILTER, { namespace})
    public readonly FilterDictionaries: IIncidentCreationDictionaries;

    @Getter(Getters.INCIDENTS, { namespace })
    public readonly Incidents: IIncidentListItem[];

    @Getter(Getters.INCIDENTS_TOTAL_ITEMS, { namespace })
    public readonly TotalItems: number;

    @Action(Actions.FETCH_DICTIONARIES_FOR_FILTER, { namespace })
    public FetchFilterDictionaries: () => Promise<void>;

    @Action(Actions.FETCH_INCIDENTS, { namespace })
    public FetchIncidents: (filter: IIncidentListFilter) => Promise<void>;

    @Action(Actions.SAVE_INCIDENT, { namespace })
    public SaveIncident: ({incident, removedFiles}: {incident: IIncident, removedFiles: IFile[]}) => Promise<any>;

    @Action(Actions.FETCH_INCIDENT, { namespace })
    public FetchIncident: (id: number) => Promise<IIncident>;

    @Mutation(Mutations.SET_FILTER, { namespace })
    public SetFilter: (fitler: IIncidentListFilter) => void;

    @Getter(Getters.STATUSES, { namespace })
    public readonly Statuses: IIncidentStatus[];

    @Getter(commonGetters.CURRENT_USER, { namespace: commonNamespace })
    public readonly CurrentUser: IUser;

    @Getter(commonGetters.IS_SUPER_ADMIN_OR_PAID, { namespace: commonNamespace })
    public readonly IsSuperAdminOrPaidAccess: boolean;

    @Getter(Getters.IS_INCIDENT_SAVING, { namespace })
    public readonly IsIncidentSaving: boolean;

    @Watch("Id")
    public async onIdChange(newVal: number|undefined) {
      if (newVal) {
        if (Number(newVal) === 0) {
          this.displayCreationForm();
          this.initTextares();
          logAction(LogActions.IncidentCreateForm);
        } else {
          await this.openIncidentImpl(newVal);
          this.showFilters = false;
        }
      } else {
        logAction(LogActions.IncidentIndex);
        this.showCreationForm = false;
        this.showEditForm = false;
        this.showFilters = true;
      }
    }

    @Watch("model.AttackType")
    public onAttackTypeChange(newVal: string) {
      if (newVal) {
        const attackType = this.Dictionaries.Attacks.find(x => x.Key == newVal);
        if (attackType && attackType.Data && attackType.Data !== "0") {
          this.model.Criticality = Number(attackType.Data);
        }
      }
    }

    private showCreationForm: boolean = false;
    private showEditForm: boolean = false;
    private errorText: string = "";
    private showFilters: boolean = true;

    private model: IIncident = {
        Id: 0,
        RelatedIncidents: [],
        FixationTime: moment().format("YYYY-MM-DD HH:mm:ss")
    };

    public mounted(): void {
        this.FetchDictionaries();
        this.FetchFilterDictionaries();
        this.FetchStatuses();
        const filter = { ...this.Filter };
        if (this.EquipmentId) {
            filter.EquipmentId = this.EquipmentId;
        }

        if (this.CurrentUser && this.CurrentUser.UserRoles && this.CurrentUser.UserRoles.length > 0) {
          filter.ResponsibleRoleId = this.CurrentUser.UserRoles[0].RoleId;
        }

        this.SetFilter(filter);
        this.FetchIncidents(filter);
        this.onIdChange(this.Id);

        window.addEventListener("beforeunload", this.onUnloadListener);
        this.initTextares();
    }

    private initTextares() {
      this.$nextTick(() => ($("#description") as any).resizeTextarea());
    }

    public beforeRouteLeave(to, from, next): void {
      this.checkChanges()
          .then(x => next(x))
          .catch(() => next(false));
    }

    public beforeDestroy(): void {
      window.removeEventListener("beforeunload", this.onUnloadListener);
    }

    public onUnloadListener(event: Event): string|undefined {
      let hasChanges: boolean = false;
      if (this.showEditForm) {
        hasChanges = (this.$refs.editForm as any).hasChanges();
      }
      if (this.showCreationForm) {
        hasChanges = this.hasChanges();
      }

      if (hasChanges) {
        event.preventDefault();
        event.returnValue = false;
        return losingChangesConfirmation;
      }
      return;
    }

    private checkChanges(): Promise<boolean> {
      let hasChanges: boolean = false;
      if (this.showEditForm) {
        hasChanges = (this.$refs.editForm as any).hasChanges();
      }
      if (this.showCreationForm) {
        hasChanges = this.hasChanges();
      }

      return new Promise((resolve, reject) => {
        if (hasChanges) {
          bootbox.confirm({
            message: losingChangesConfirmation,
            animate: false,
            buttons: {
                confirm: {
                    label: "Да",
                    className: "btn-success"
                },
                cancel: {
                    label: "Отмена",
                    className: "btn-white"
                },

            },
            callback: (result: boolean) => {
                if (result) {
                    resolve(true);
                } else {
                  resolve(false);
                }
            }
          });
        } else {
          resolve(true);
        }
      });
    }

    get loadedIncidents(): IIncidentListItem[] {
        return this.Incidents.map(x => {
            return { ...x, FixationTimeFormatted: formatDate(x.FixationTime, "DD.MM.YYYY HH:mm:ss") };
        });
    }

    get equipmentIp(): string {
        if (this.model.SourceEquipmentId) {
          this.model.SourceEquipmentId = Number(this.model.SourceEquipmentId);
          const equipment =  this.Dictionaries.Equipments.find(x => x.Id === this.model.SourceEquipmentId);
          if (equipment) {
            return equipment.IP;
          }
        }
        return "";
    }

    get RelatedIncidents(): IDictionaryItem[] {
      return this.Dictionaries.Incidents.map(x => <IDictionaryItem> {
        Key: x.Id,
        Value: `${x.AttackTypeName} (${formatDate(x.FixationTime)})`
      });
    }

    public get equipmentDict(): IDictionaryItem[] {
      return this.Dictionaries.Equipments.map(x => <IDictionaryItem> { Key: x.Id, Value: x.Name });
    }

    get statusDictionaries(): IDictionaryItem[] {
      return this.Statuses.map(x => <IDictionaryItem> { Key: x.Id, Value: x.Name });
    }

    public setRelatedIncident(items: string[]): void {
      this.model.RelatedIncidents = items.map(x => Number(x));
    }

    public applyFilter(filter: IIncidentListFilter): void {
      this.SetFilter(filter);
      this.FetchIncidents(filter);
    }

    public async save() {
      const valid = await this.$validator.validateAll();
      if (valid) {
          this.SaveIncident({incident: this.model, removedFiles: []})
            .then((result) => {
              this.showCreationForm = false;
              this.FetchIncidents(this.State.Filter);
              this.$router.push({ path: "/Incident/" + result });
            })
            .catch(error => this.errorText = error.data);
        }
    }

    public async cancel() {
      const confirm = await this.checkChanges();
      if (confirm) {
        this.showCreationForm = false;
        this.showEditForm = false;
        this.model =  {
          Id: 0,
          RelatedIncidents: [],
          FixationTime: moment().format("YYYY-MM-DD HH:mm:ss")
        };
        this.showFilters = true;
        this.$router.push({ path: "/Incident/" });
      }
    }

    public async displayCreationForm() {
      const confirm = await this.checkChanges();
      if (confirm) {
        this.$router.push({ path: "/Incident/0" });
        this.showCreationForm = true;
        this.closeFilters();
        this.showEditForm = false;
        this.model = {
          Id: 0,
          RelatedIncidents: [],
          FixationTime: moment().format("YYYY-MM-DD HH:mm:ss")
        };
      }
    }

    public async onSaved(id: number) {
      await Promise.all([
        this.openIncidentImpl(id),
        this.FetchIncidents(this.Filter)
      ]);
    }

    public async openIncident(id: number, validate: boolean = true) {
      const confirm = validate ? await this.checkChanges() : true;
      if (confirm) {
        this.$router.push({ path: "/Incident/" + id.toString() });
      }
    }

    public async openIncidentImpl(id: number) {
      this.showCreationForm = false;
      this.showEditForm = true;
      this.showFilters = false;

      try {
        const result = await this.FetchIncident(id);
        this.model = {... result};
        logAction(LogActions.IncidentItem, EntityType.Incident, id.toString(), null, result.Title);
      } catch(error) {
        this.errorText = error;
      }
    }

    public openFilters(): void {
      this.showFilters = true;
    }

    public closeFilters(): void {
      this.showFilters = false;
    }

    public isSelected(id: number): boolean {
      return id === this.model.Id;
    }

    public get showHideFiltersBtn(): boolean {
      return (this.showEditForm || this.showCreationForm) && this.showFilters;
    }

    public getAttackType(id: number): string {
      const attack = this.Dictionaries.Attacks.find(x => x.Key === id);
      if (attack) {
        return attack.Value;
      }
      return "";
    }

    public dateFormat(date: Date): string {
      if (date) {
        return formatDate(date);
      }
      return "";
    }

    private getObjectName(): string {
      if (this.model.SourceEquipmentId) {
          const equipment = this.Dictionaries.Equipments.find(x => x.Id === this.model.SourceEquipmentId);
          if (equipment) {
              const object = this.FilterDictionaries.Objects.find(x => x.Key === equipment.IdObject);
              if (object) {
                  return object.Value;
              }
          }
      }
      return "";
  }

  private getObjectAddress(): string {
      if (this.model.SourceEquipmentId) {
          const equipment = this.Dictionaries.Equipments.find(x => x.Id === this.model.SourceEquipmentId);
          if (equipment) {
              const object = this.FilterDictionaries.Objects.find(x => x.Key === equipment.IdObject);
              if (object) {
                  return object.Data || "";
              }
          }
      }
      return "";
  }

  public openObject() {
    if (this.model.SourceEquipmentId) {
        const equipment = this.Dictionaries.Equipments.find(x => x.Id === this.model.SourceEquipmentId);
        if (equipment) {
            this.$router.push({ path: "/Inventory/" + (equipment.IdObject) });
        }
    }
  }

  public hasChanges(): boolean {
    for (const field in this.model) {
      if (this.model.hasOwnProperty(field)) {
        if (field === "Id" || field === "FixationTime") {
          continue;
        }
        if (field === "RelatedIncidents") {
          if (this.model.RelatedIncidents.length > 0) {
            return true;
          }
          continue;
        }
        return true;
      }
    }
    return false;
  }

    private columns: IColumnOptions[] = [
        { Name: "Id", DisplayName: "№", Sort: true, SortColumnName: "Id" },
        { Name: "Title", DisplayName: "Название", Sort: true, SortColumnName: "Title" },
        { Name: "AttackTypeName", DisplayName: "Тип атаки", Sort: true, SortColumnName: "AttackType" },
        { Name: "StatusName", DisplayName: "Статус", Sort: true, SortColumnName: "IdStatus" },
        { Name: "FixationTimeFormatted", DisplayName: "Дата фиксации", Sort: true, SortColumnName: "FixationTime" },
        { Name: "SourceIP", DisplayName: "IP источника", Sort: true, SortColumnName: "SourceIP" },
        { Name: "SourceCountry", DisplayName: "Страна источника", Sort: true, SortColumnName: "SourceCountry" }
    ];

    get tableFilterOptions(): IFilterOptions[] {
      return [
      {
        ForColumn: "Id",
        FieldName: "Id",
        Placeholder: "Id",
        Type: "text",
        CSSClass: "col-sm-1",
        Value: this.Filter ? this.Filter.Id : undefined
      },
      {
        ForColumn: "Title",
        FieldName: "Title",
        Placeholder: "Название",
        Type: "text",
        CSSClass: "col-sm-2",
        Value: this.Filter ? this.Filter.Title : undefined
      },
      {
        ForColumn: "AttackTypeName",
        FieldName: "AttackType",
        Placeholder: "Тип компьютерной атаки",
        Type: "select",
        CSSClass: "col-sm-2",
        Value: this.Filter ? this.Filter.AttackType : undefined,
        SelectValues: this.Dictionaries.Attacks
      },
      {
        ForColumn: "StatusName",
        FieldName: "Status",
        Placeholder: "Статус",
        Type: "select",
        CSSClass: "col-sm-3",
        Value: this.Filter ? this.Filter.Status : undefined,
        SelectValues: this.statusDictionaries
      },
      {
        ForColumn: "FixationTimeFormatted",
        FieldName: "FixationTime",
        Placeholder: "Дата фиксации",
        Type: "date",
        CSSClass: "col-sm-2",
        Value: this.Filter ? this.Filter.FixationTime : undefined
      },
      {
        ForColumn: "SourceIP",
        FieldName: "SourceIP",
        Placeholder: "IP источника",
        Type: "text",
        CSSClass: "col-sm-2",
        Value: this.Filter ? this.Filter.SourceIP : undefined
      },
      {
        ForColumn: "SourceCountry",
        FieldName: "Country",
        Placeholder: "Страна источника",
        Type: "text",
        CSSClass: "col-sm-2",
        Value: this.Filter ? this.Filter.Country : undefined
      },
    ];
  }
}
