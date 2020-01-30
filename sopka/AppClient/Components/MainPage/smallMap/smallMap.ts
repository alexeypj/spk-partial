import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { IObjectEntry, IAddress, IObjectSummary } from "../../../Store/Modules/Inventory/types";

@Component
export default class extends Vue {

    @Prop()
    public mapClass: string;

    @Prop({default: "500px"})
    public readonly width: string;

    @Prop({default: "500px"})
    public readonly height: string;

    @Prop()
    public objects: IObjectSummary[];

    private readonly defaultZoom: number = 14;

    private myMap: any;

    public mounted(): void {
        const ymaps = window.ymaps;

        if (this.objects && this.objects.length > 0) {
            this.initMultiObjects(ymaps);
        }
    }

    public beforeDestroy(): void {
        if (this.myMap) {
            this.myMap.destroy();
        }
    }

    private initMultiObjects(ymaps: any) {
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

            const tasks: Array<Promise<any>> = [];
            let currentId: number = 0;
            for (const object of this.objects) {
                if (object.Latitude && object.Longitude) {
                    tasks.push(new Promise((resolve) => {
                        objectManager.add(this.getPoint(currentId++, object));
                        resolve();
                    }));
                } else {
                    tasks.push(this.getGeocode(ymaps, object.ObjectAddress).then((result) => {
                            const geoObject = result.geoObjects.get(0);
                            if (geoObject) {
                                [object.Latitude, object.Longitude] = geoObject.geometry.getCoordinates();
                                objectManager.add(this.getPoint(currentId++, object));
                            }
                        })
                    );
                }
            }

            Promise.all(tasks).then(() => {
                this.myMap.geoObjects.add(objectManager);
                this.focusAndZoom();
            });
        });
    }

    private getPoint(id: number, object: IObjectSummary): object {
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

    private getGeocode(ymaps: any, address: string | number[], results: number = 1): Promise<any> {
        return new Promise((resolve, reject) => {
            ymaps.geocode(address, {
                results: results.toString()
            }).then((res: any) => {
                resolve(res);
            });
        });
    }

   private focusAndZoom(): void {
        this.myMap.setBounds(this.myMap.geoObjects.getBounds()).then(() => {
            const zoom = this.myMap.getZoom();
            if (zoom > this.defaultZoom) {
                this.myMap.setZoom(this.defaultZoom);
            }
        });
   }
}
