import { KmlFileManager } from './KmlFileManager.js';
import { InfoWindowManagerSingleton, createContent } from './Utility.js';

//google maps関連の処理
export class MapManager {
    constructor() {
        this.map = null;
        this.layers = [];
        const singleton = new InfoWindowManagerSingleton();
        this.infoWindowManager = singleton.getInstance();
        this.kmlFileManager = new KmlFileManager();
        this.center = { lat: 36.13863, lng: 138.77497 };
        this.zoom = 10;
    }

    apiスクリプトをロード
    static loadGoogleMapsApi(apiKey) {
        return new Promise((resolve, reject) => {
            if (window.google && window.google.maps) {
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&loading=async&callback=initMap`;
            script.async = true;
            script.defer = true;
            script.onerror = reject;
            document.head.appendChild(script);

            window.initMap = resolve;
        });
    }


    //kmlレイヤーを追加
    addKmlLayers() {
        const KmlLayerURLS = this.kmlFileManager.difficultyURLS;

        Object.keys(KmlLayerURLS).forEach(key => {
            const layer = new google.maps.KmlLayer({
                url: KmlLayerURLS[key],
                map: this.map,
                preserveViewport: true,
                suppressInfoWindows: true

            });
            this.layers.push(layer);

            layer.addListener('click', (event) => {
                const name = event.featureData.name;
                const position = event.latLng;
                const spotName = this.infoWindowManager.findSpotName(name);
                const imageUrl = spotName.dataset.imageUrl;
                const spotId = spotName.dataset.id;
                const difficulty = spotName.dataset.difficulty;

                //infoの内容UtilityのcreateContentを使用
                const content = createContent(name, difficulty, spotId, imageUrl);

                //info表示とliのtoggle
                this.infoWindowManager.handleInfoWindow(this.map, content, position, spotId, imageUrl);
                this.infoWindowManager.spotNametoggle(spotName);
            });
        });
    }

    //マップを表示
    async initMap() {
        const apiKeyElement = document.getElementById('google-maps-api-key');
        const apiKey = apiKeyElement ? apiKeyElement.getAttribute('data-api-key') : null;

        try {
            await MapManager.loadGoogleMapsApi(apiKey);
            this.map = new google.maps.Map(document.getElementById('map'), {
                center: this.center,
                zoom: this.zoom,
                styles: this.mapStyles(),
            });

            this.addKmlLayers();
            this.updateLayers();
            return this.map;
        } catch (error) {
            console.error('Google Maps APIのロードに失敗しました:', error);
            throw error;
        }
    }


    //難易度ごとのレイヤーを表示
    updateLayers() {
        const difficultySelect = document.getElementById("difficulty_select");
        const selectAllRindo = "selectAllRindo";
        const difficultyValue = difficultySelect.value;
        const difficultyURLS = this.kmlFileManager.createDifficultyURLS();

        this.infoWindowManager.closeInfoWindoUpdateLayers();

        if (difficultyValue === selectAllRindo || difficultyValue === '') {
            this.layers.forEach(layer => {
                layer.setMap(this.map);
            });
        } else {
            this.layers.forEach(layer => {
                layer.setMap(null);
            });
            const layerToDisplay = this.layers.find(layer => layer.url === difficultyURLS[difficultyValue]);
            if (layerToDisplay) {
                layerToDisplay.setMap(this.map);
            }
        }
        this.map.setCenter(this.center);
        this.map.setZoom(this.zoom);
    }

    setKmlLayerStyle(layer, styleOptions) {
        google.maps.event.addListener(layer, 'addfeature', function (event) {
            if (event.featureData.geometryType === 'LineString') {
                const polyline = event.featureData.mapObject;
                polyline.setOptions(styleOptions);
            }
        });
    }


    mapStyles() {
        return [
            {
                "featureType": "landscape.man_made",
                "elementType": "geometry.fill",
                "stylers": [
                    { "color": "#EFEFF7" }
                ]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [
                    { color: "#78A1BB"}
                ]
            }
        ];
    }

}
