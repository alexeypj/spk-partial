import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import Chart from 'chart.js';
import { IncidentStatisticGroupType, IncidentStatisticPeriodType  } from "./types";
import { IIncidentStatistic } from "../../../../Store/Modules/Incident/types";

@Component
export default class IncidentChart extends Vue {

    @Prop({ required: true })
    Statistic: IIncidentStatistic | null;

    @Watch("Statistic", { immediate: true })
    onStatisticUpdate(newStat: IIncidentStatistic, oldStat: IIncidentStatistic): void {
        this.createChart(newStat);
    }

    private chart: any;

    private lineOptions = {
        responsive: true,
        title: {
            display: true,
            text: 'Инциденты'
        },
        legend: {
            display: true,
            position: 'top',
            labels: {
                boxWidth: 80,
                fontColor: 'black'
            }
        },
        scales: {
            yAxes: [{
                ticks: {
                    stepSize: 1,
                    min: 0
                }
            }]
        },
        tooltips: {
            callbacks: {
                label: function (tooltipItem, data) {
                    return "Инциденты: " + tooltipItem.value;
                }
            }
        }
    };

    private pieOptions = {
        responsive: true,
        title: {
            display: true,
            text: 'Типы атак'
        },
        legend: {
            position: "right",
            labels: {
                padding: 20
            }
        }
    }

    createChart(stat: IIncidentStatistic | null): void {
        if (!stat) {
            return;
        }
        if (this.chart) {
            this.chart.destroy();
        }

        let config = stat.GroupType == IncidentStatisticGroupType.AttackType
            ? this.createPieChartConfig(stat)
            : this.createLineChartConfig(stat);

        let canvas: any = document.getElementById("incident-chart");
        let ctx = canvas.getContext("2d");
        this.chart = new Chart(ctx, config);
    }

    createPieChartConfig(stat: IIncidentStatistic): any {
        let colorPool = [
            "#0074D9",
            "#FF4136", "#2ECC40", "#FF851B", "#7FDBFF", "#B10DC9",
            "#FFDC00", "#001f3f", "#39CCCC", "#01FF70", "#85144b", "#F012BE", "#3D9970", "#111111", "#AAAAAA"
        ];

        let colors = stat.Statistic.map((x, i) => {
            if (i < colorPool.length) {
                return colorPool[i];
            }
            let r = this.getRandomColor();
            return r;
        });

        let data = {
            labels: stat.Statistic.map(x => x.Key),
            datasets: [{
                data: stat.Statistic.map(x => x.Value),
                label: stat.Title,
                backgroundColor: colors
            }]
        };

        return {
            type: "pie",
            data: data,
            options: this.pieOptions
        };
    }

    createLineChartConfig(stat: IIncidentStatistic): any {
        let data = {
            labels: stat.Statistic.map(x => x.Key),
            datasets: [{
                data: stat.Statistic.map(x => x.Value),
                label: stat.Title,
                borderColor: "rgb(54, 162, 235)",
                backgroundColor: "rgb(54, 162, 235)",
                fill: false
            }]
        };

        return {
            type: "line",
            data: data,
            options: this.lineOptions
        };
    }

    getRandomColor(): string {
        let letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
}