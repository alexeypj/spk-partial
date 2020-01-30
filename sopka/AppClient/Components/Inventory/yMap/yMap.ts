import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { IObjectEntry, IAddress } from "../../../Store/Modules/Inventory/types";

@Component
export default class extends Vue {

    @Prop()
    public mapClass: string;

    @Prop({default: "500px"})
    public readonly width: string;

    @Prop({default: "500px"})
    public readonly height: string;

    @Prop()
    public object: IObjectEntry;

    @Prop()
    public objects: IObjectEntry[];

    @Prop()
    public searchAddress: string;

    @Prop()
    public searchObjectName: string;

    @Prop()
    public searchCoordinates: IAddress;

    @Prop({default: false})
    public forceInitMultiObjects: boolean;

    @Watch("searchAddress")
    private onSearchChange(newValue: string, oldValue: string): void {
        if (newValue !== oldValue) {
            this.search(newValue);
        }
    }

    @Watch("searchCoordinates")
    private onSearchCoordinatesChanges(newValue: IAddress, oldValue: IAddress): void {
        if (newValue.Latitude != null && newValue.Longitude != null
            && (newValue.Latitude !== oldValue.Latitude || newValue.Longitude !== oldValue.Longitude)) {
                this.searchByCoordinates(newValue.Latitude, newValue.Longitude);
        }
    }

    private readonly defaultZoom: number = 14;

    private myMap: any;

    public mounted(): void {
        const ymaps = window.ymaps;
        if (this.object && this.object.ObjectAddress) {
            this.initSingleObject(ymaps);
        }

        if (this.objects && this.objects.length > 0 || this.forceInitMultiObjects) {
            this.initMultiObjects(ymaps);
        }
    }

    public beforeDestroy(): void {
        if (this.myMap) {
            this.myMap.destroy();
        }
    }

    private get styles(): object {
        return {
            height: this.height,
            width: this.width,
            paddingTop: "20px"
        };
    }

    private initSingleObject(ymaps: any) {
        ymaps.ready(() => {
            this.myMap = new ymaps.Map("map", {
                center: [37.620070, 55.753630],
                zoom: this.defaultZoom,
                controls: ["zoomControl", "rulerControl"]
            });

            this.myMap.events.add("click", (e) => {
                const localCoords = e.get("coords");
                this.myMap.geoObjects.removeAll();

                const newPoint = new ymaps.GeoObject({
                    geometry: {
                        type: "Point",
                        coordinates: [localCoords[0], localCoords[1]]
                    },
                    properties: {
                        balloonContentHeader: this.object.ObjectName,
                        balloonContentFooter: `<a href="${window.baseUrl}Inventory/${this.object.Id}">Перейти к объекту</a>`,
                    }
                }, {
                    preset: "islands#redDotIcon",
                    draggable: false,
                    hintCloseTimeout: null
                });
                this.myMap.geoObjects.add(newPoint);

                ymaps.geocode(localCoords, {
                    results: 1
                }).then((res: any) => {
                    const localGeoObject = res.geoObjects.get(0);
                    const localName = localGeoObject.properties.get("text");
                    this.$emit("setCoordinates", localName, localCoords[0], localCoords[1]);
                    newPoint.properties.set("iconCaption", localGeoObject.properties.get("text"));
                });
            });

            if (this.object.Latitude && this.object.Longitude) {
                const newPoint = new ymaps.GeoObject({
                    geometry: {
                        type: "Point",
                        coordinates: [this.object.Latitude, this.object.Longitude]
                    },
                    properties: {
                        balloonContentHeader: this.object.ObjectAddress,
                        iconCaption: this.object.ObjectName,
                    }
                }, {
                    preset: "islands#redDotIcon",
                    draggable: false,
                    hintCloseTimeout: null
                });
                this.myMap.geoObjects.add(newPoint);
                this.focusAndZoom();
            } else {
                this.getGeocode(ymaps, this.object.ObjectAddress).then((result) => {
                    const geoObject = result.geoObjects.get(0);
                    if (geoObject) {
                        geoObject.options.set("preset", "islands#redDotIconWithCaption");
                        geoObject.properties.set("iconCaption", this.object.ObjectName);
                        this.myMap.geoObjects.add(geoObject);
                        this.focusAndZoom();
                    }
                });
            }
        });
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

    private getPoint(id: number, object: IObjectEntry): object {
        return {
            type: "Feature",
            id,
            geometry: {
                type: "Point",
                coordinates: [object.Latitude, object.Longitude]
            },
            properties: {
                balloonContentHeader: object.ObjectName,
                // iconContent: object.IncidentCount,
                iconCaption: object.ObjectName,
                clusterCaption: object.ObjectName,
                balloonContentFooter: `<a href="${window.baseUrl}Inventory/${object.Id}">Перейти к объекту</a>`,
                balloonContentBody: `${object.ObjectAddress}`
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

    private search(address: string): void {
        const ymaps = window.ymaps;
        if (this.myMap == null) {
            this.object.ObjectAddress = address;
            this.initSingleObject(ymaps);
        }

        ymaps.ready(() => {
            this.myMap.geoObjects.removeAll();
            this.getGeocode(ymaps, address, 5).then((result) => {
                const iterator = result.geoObjects.getIterator();
                let geoObject = iterator.getNext();
                while (geoObject.geometry) {
                    geoObject.options.set("preset", "islands#redDotIconWithCaption");
                    // Получаем строку с адресом и выводим в иконке геообъекта.
                    geoObject.properties.set("iconCaption", geoObject.properties.get("text"));
                    geoObject.properties.set("title", geoObject.properties.get("text"));

                    // Добавляем первый найденный геообъект на карту.
                    this.myMap.geoObjects.add(geoObject);
                    const coords = geoObject.geometry.getCoordinates();
                    const geoName = geoObject.properties.get("text");
                    this.$emit("setCoordinates", address, coords[0], coords[1]);

                    geoObject.events.add("click", (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.$emit("setCoordinates", geoName, coords[0], coords[1]);
                    });
                    geoObject = iterator.getNext();
                }

                this.focusAndZoom();
            });
        });
   }

   private searchByCoordinates(latitude: number, longitude: number): void {
    const ymaps = window.ymaps;
    if (this.myMap == null) {
        this.initSingleObject(ymaps);
    }

    ymaps.ready(() => {
        this.myMap.geoObjects.removeAll();
        this.getGeocode(ymaps, [latitude, longitude], 1).then((result) => {
            const iterator = result.geoObjects.getIterator();
            let geoObject = iterator.getNext();
            while (geoObject.geometry) {
                geoObject.options.set("preset", "islands#redDotIconWithCaption");
                // Получаем строку с адресом и выводим в иконке геообъекта.
                geoObject.properties.set("iconCaption", geoObject.properties.get("text"));
                geoObject.properties.set("title", geoObject.properties.get("text"));

                // Добавляем первый найденный геообъект на карту.
                this.myMap.geoObjects.add(geoObject);
                const coords = geoObject.geometry.getCoordinates();
                const geoName = geoObject.properties.get("text");
                this.$emit("setCoordinates", geoName, latitude, longitude);

                geoObject.events.add("click", (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.$emit("setCoordinates", geoName, coords[0], coords[1]);
                });
                geoObject = iterator.getNext();
            }

            this.focusAndZoom();
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
