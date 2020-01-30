<template>
    <div>
        <div class="form-horizontal">
            <div class="form-group">
                <label for="amount" class="w100 control-label text-left">Сумма</label>
                <div class="dflex">
                    <div class="flexgrow mr5">
                        <input type="text"
                               :class="['form-control', {'required-validation-error' : errors.has('Amount')}]"
                               id="amount"
                               placeholder="Сумма"
                               v-model="Amount"
                               name="Amount"
                               data-vv-as="Сумма"
                               v-validate="'min_value:0.01|decimal:2'" />

                        <span class="text-danger" v-show="errors.has('Amount')">{{ errors.first('Amount') }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="row mtop10 ptop15">
            <div class="pull-right">
                <button class="btn btn-success pull-right btn-small" @click="change">Пополнить</button>
                <button class="btn btn-white mr5 pull-right btn-small" @click="cancel">Отменa</button>
            </div>
            <transition name="fade" v-if="isSaved || errorText">
                <div class="pull-right alert alert-success alertsave eq_div" role="alert" v-if="isSaved">
                    Баланс пополнен
                </div>
                <div class="pull-right alert alert-danger alertsave eq_div" role="alert" v-if="errorText">
                    {{ errorText }}
                </div>
            </transition>
        </div>

    </div>
</template>
<script src="./ChangeBalance.ts" lant="ts"></script>