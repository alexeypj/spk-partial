<template>
    <div class="panel blank-panel">
        <div class="panel-heading">
            <div class="panel-options text-left">

                <div class="form-group">
                    <div class="dflex" style="align-items: baseline;">
                        <div class="radio mr15 mb0 mt0">
                            <label>
                                <input type="radio" checked="" :value="PeriodTypes.Week" 
                                       name="period" v-model="Filter.Period" @change="setPeriod(PeriodTypes.Week)"> за неделю
                            </label>
                        </div>
                        <div class="radio">
                            <label>
                                <input type="radio" checked="" :value="PeriodTypes.Month" 
                                       name="period" v-model="Filter.Period" @change="setPeriod(PeriodTypes.Month)"> за месяц
                            </label>
                        </div>
					</div>
					<div>
                        <div class="radio mb0 mt0">
                            <label class="startdates">
                                <input type="radio" checked="" :value="PeriodTypes.Period"
                                       name="period" v-model="Filter.Period" @change="setPeriod(PeriodTypes.Period)" class="mt0"> 
                                c
                                <DatePickRFX v-model="Filter.DateFrom"
                                             :pickTime="false"
                                             name="DateFrom"
                                             style="width: 130px;margin-right:5px;margin-left:5px;"
                                             class="vdpComponent-positionRight"
                                             format="YYYY-MM-DD"
                                             @input="loadStatistic()"
                                             :inputAttributes="{class:'form-control'}">
                                </DatePickRFX>
                                по
                                <DatePickRFX v-model="Filter.DateTo"
                                             :pickTime="false"
                                             name="DateTo"
                                             format="YYYY-MM-DD"
                                             style="width: 130px;margin-left:5px;"
                                             @input="loadStatistic()"
                                             :inputAttributes="{class:'form-control'}"
                                             >
                                </DatePickRFX>
                            </label>
                        </div>
                    </div>

                </div>
            </div>
            <div class="panel-options">

                <ul class="nav nav-tabs">
                    <!--<li :class="Filter.Period==PeriodTypes.Week?'active':''"><a @click="setPeriod(PeriodTypes.Week)">Неделя</a></li>
                    <li :class="Filter.Period==PeriodTypes.Month?'active':''"><a @click="setPeriod(PeriodTypes.Month)">Месяц</a></li>
                    <li :class="Filter.Period==PeriodTypes.Period?'active':''"><a @click="setPeriod(PeriodTypes.Period)">Всего</a></li>-->
                    <li :class="Filter.GroupType=='Day'?'active':''"><a @click="setGroupType('Day')">Период</a></li>
                    <li :class="Filter.GroupType=='AttackType'?'active':''"><a @click="setGroupType('AttackType')">Тип атаки</a></li>
                </ul>
            </div>
        </div>

        <div class="panel-body">

            <div class="tab-content">
                <div class="tab-pane active">
                    <!--<div class="form-group">
                        <div class="col-sm-12 text-left">
                            <div class="checkbox">
                                <label>
                                    <input type="radio" value="Day" name="groupType" v-model="Filter.GroupType" @change="setGroupType('Day')"> 
                                    По дням
                                </label>
                            </div>
                            <div class="checkbox">
                                <label>
                                    <input type="radio" value="AttackType" name="groupType" 
                                           v-model="Filter.GroupType" @change="setGroupType('AttackType')"> 
                                    По типу атаки
                                </label>
                            </div>
                        </div>
                    </div>-->

                    <IncidentChart :Statistic="Statistic" />
                </div>
                <div id="tab-2" class="tab-pane">
                    <strong>Donec quam felis</strong>
                    <p>Thousand unknown plants are noticed by me: when I hear the buzz of the little world among the stalks, and grow familiar with the countless indescribable forms of the insects and flies, then I feel the presence of the Almighty, who formed us in his own image, and the breath </p>
                    <p>I am alone, and feel the charm of existence in this spot, which was created for the bliss of souls like mine. I am so happy, my dear friend, so absorbed in the exquisite sense of mere tranquil existence, that I neglect my talents. I should be incapable of drawing a single stroke at the present moment; and yet.</p>

                </div>
            </div>

        </div>

    </div>
</template>
<script src="./index.ts" lang="ts"></script>