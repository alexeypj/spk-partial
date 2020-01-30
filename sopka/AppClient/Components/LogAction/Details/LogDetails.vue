<template>
    <div>
        <form class="form-horizontal equipform" >
            <div class="form-group no-margins">
                <label for="fio" class="control-label w100 text-left">Параметры</label>
                <div class="w100">
                    <p class="form-control-static" v-if="logParameters.length === 0">Параметры отсутствуют</p>
                    <p v-for="param in logParameters">{{param.Key}}: {{param.Value}}</p>
                </div>
            </div>

            <div class="form-group no-margins" v-if="SelectedLog && SelectedLog.Ip">
                <label for="fio" class="control-label w100 text-left">IP адрес</label>
                <div class="w100">
                    <p>{{ SelectedLog.Ip }}</p>
                </div>
            </div>

            <div class="form-group no-margins" v-if="headers.length">
                <label for="fio" class="control-label w100 text-left">Заголовки</label>
                <div class="w100">
                    <p v-for="param in headers">{{param.Key}}: {{param.Value}}</p>
                </div>
            </div>
            <div class="form-group no-margins" v-if="SelectedLog.EntityUrl" >
                <label class="control-label w100 text-left">Сущность</label>
                <div class="w100">
                    <p >
                        {{(SelectedLog.Entity + ": " + (SelectedLog.EntityTitle || SelectedLog.EntityId))}}
                        <a :href="SelectedLog.EntityUrl" target="_blank"><i class="fa fa-external-link"></i></a>
                    </p>
                </div>
            </div>
        </form>
        <div class="row mtop10 ptop15">
            <div class="pull-right">
                <button class="btn btn-white mr5 pull-right" @click="$emit('cancel', true)">Закрыть</button>
            </div>
        </div>
    </div>
</template>

<script src="./LogDetails.ts" lang="ts">
</script>
