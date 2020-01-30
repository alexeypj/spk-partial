<template>
    <div>
        <div class="form-horizontal">
            <div class="form-group">
                <label for="amount" class="w100 control-label text-left">Тариф</label>
                <div class="dflex">
                    <div class="flexgrow mr5">
                        <select2 type="text"
                                 :class="['form-control', {'required-validation-error' : errors.has('selectedTariffId')}]"
                                 id="selectedTariffId"
                                 placeholder="Тариф"
                                 v-model="selectedTariffId"
                                 name="selectedTariffId"
                                 data-vv-as="Тариф"
                                 :options="tariffs"
                                 v-validate="'required'" />
                        <span class="text-danger" v-show="errors.has('selectedTariffId')">{{ errors.first('selectedTariffId') }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="row mtop10 ptop15">
            <div class="pull-right">
                <button class="btn btn-success pull-right btn-small" @click="change">Изменить</button>
                <button class="btn btn-white mr5 pull-right btn-small" @click="cancel">Отменa</button>
            </div>
            <transition name="fade" v-if="isSaved || errorText">
                <div class="pull-right alert alert-success alertsave eq_div" role="alert" v-if="isSaved">
                    Тариф изменен
                </div>
                <div class="pull-right alert alert-danger alertsave eq_div" role="alert" v-if="errorText">
                    {{ errorText }}
                </div>
            </transition>
        </div>

    </div>
</template>
<script src="./ChangeTariff.ts" lant="ts"></script>