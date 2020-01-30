var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
let default_1 = class default_1 extends Vue {
    constructor() {
        super(...arguments);
        this.defaultZoom = 14;
    }
    mounted() {
        const ymaps = window.ymaps;
        if (this.objects && this.objects.length > 0) {
            this.initMultiObjects(ymaps);
        }
    }
    beforeDestroy() {
        if (this.myMap) {
            this.myMap.destroy();
        }
    }
    initMultiObjects(ymaps) {
        ymaps.ready(() => {
            this.myMap = new ymaps.Map("map", {
                center: [37.620070, 55.753630],
                zoom: this.defaultZoom,
                controls: ["zoomControl", "rulerControl"]
            }, { suppressMapOpenBlock: true });
            const objectManager = new ymaps.ObjectManager({
                clusterize: true,
                clusterDisableClickZoom: true,
            });
            objectManager.objects.options.set("preset", "islands#nightIcon");
            objectManager.clusters.options.set("preset", "islands#invertedBlueClusterIcons");
            // this.myMap.behaviors.disable("drag");
            const tasks = [];
            let currentId = 0;
            for (const object of this.objects) {
                if (object.Latitude && object.Longitude) {
                    tasks.push(new Promise((resolve) => {
                        objectManager.add(this.getPoint(currentId++, object));
                        resolve();
                    }));
                }
                else {
                    tasks.push(this.getGeocode(ymaps, object.ObjectAddress).then((result) => {
                        const geoObject = result.geoObjects.get(0);
                        if (geoObject) {
                            [object.Latitude, object.Longitude] = geoObject.geometry.getCoordinates();
                            objectManager.add(this.getPoint(currentId++, object));
                        }
                    }));
                }
            }
            Promise.all(tasks).then(() => {
                this.myMap.geoObjects.add(objectManager);
                this.focusAndZoom();
            });
        });
    }
    getPoint(id, object) {
        return {
            type: "Feature",
            id,
            geometry: {
                type: "Point",
                coordinates: [object.Latitude, object.Longitude]
            },
            properties: {
                balloonContentHeader: object.ObjectName,
                iconContent: object.IncidentCount,
                iconCaption: object.ObjectName,
                clusterCaption: object.ObjectName,
                balloonContentFooter: `<a target="_blank" href="${window.baseUrl}Inventory/${object.Id}">Перейти к объекту</a>`,
                balloonContentBody: `${object.ObjectAddress}<br /> Количество инцидентов: ${object.IncidentCount}`
            }
        };
    }
    getGeocode(ymaps, address, results = 1) {
        return new Promise((resolve, reject) => {
            ymaps.geocode(address, {
                results: results.toString()
            }).then((res) => {
                resolve(res);
            });
        });
    }
    focusAndZoom() {
        this.myMap.setBounds(this.myMap.geoObjects.getBounds()).then(() => {
            const zoom = this.myMap.getZoom();
            if (zoom > this.defaultZoom) {
                this.myMap.setZoom(this.defaultZoom);
            }
        });
    }
};
__decorate([
    Prop()
], default_1.prototype, "mapClass", void 0);
__decorate([
    Prop({ default: "500px" })
], default_1.prototype, "width", void 0);
__decorate([
    Prop({ default: "500px" })
], default_1.prototype, "height", void 0);
__decorate([
    Prop()
], default_1.prototype, "objects", void 0);
default_1 = __decorate([
    Component
], default_1);
export default default_1;
//# sourceMappingURL=smallMap.js.map