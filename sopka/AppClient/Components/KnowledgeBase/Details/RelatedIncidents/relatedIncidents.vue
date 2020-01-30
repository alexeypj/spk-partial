<template>
    <div class="row">
        <div v-if="Incidents.length == 0" class="col-md-12">
            Нет связанных инцидентов
        </div>
        <div v-else class="col-md-12">
            <div v-for="incident in Incidents" :key="'incident_' + incident.IncidentId" style="padding-bottom:15px">
                <a href="#">{{incident.Title}} </a>
                <router-link :to="'/Incident/' + incident.IncidentId" target="_blank" title="Открыть в новом">
                    <i class="fa fa-external-link" aria-hidden="true"></i>
                </router-link>&nbsp;
                <p class="text-muted">
                    {{ getType(incident.Type) }}
                </p>
                <div>{{ getAttachType(incident.Incident.AttackType) }}, {{ dateFormat(incident.Incident.FixationTime )}}</div>
            </div>
        </div>
        <div class="pull-right ptop15" style="margin-right: 15px;">
            <cancel-button :isSaving="false" className="btn btn-white btn-small" @click="$emit('cancel')" text="Закрыть" />
        </div>
    </div>
</template>

<script src="./relatedIncidents.ts" lang="ts">
</script>
