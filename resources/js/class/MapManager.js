import { KmlFileManager } from './KmlFileManager.js';
import { InfoWindowManagerSingleton, createContent } from './Utility.js';

//google maps関連の処理を管理するクラス
export class MapManager {
    constructor() {
        this.map = null; // Google Mapsインスタンス
        this.layers = []; // KMLレイヤーの配列
        const singleton = new InfoWindowManagerSingleton();
        this.infoWindowManager = singleton.getInstance(); // InfoWindowManagerのシングルトンインスタンス
        this.kmlFileManager = new KmlFileManager(); //KMLファイルを管理するインスタンス
        this.center = { lat: 36.04084, lng: 138.83203 }; // マップの中心座標
        this.zoom = 10; // マップのズーム値
        this.csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content'); //CSRFトークン
    }


    /**
     * Google Maps APIスクリプトをロード。
     *
     * @param {string} apiKey - Google Maps APIキー
     * @returns {Promise<void>}
     */
    static loadGoogleMapsApi(apiKey) {
        return new Promise((resolve, reject) => {
            //すでにGoogle Maps APIがロードされている場合はresolve()
            if (window.google && window.google.maps) {
                resolve();
                return;
            }
            //head内に<script>生成
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&loading=async&callback=initMap`; //Google Maps APIスクリプトのURL
            script.async = true;
            script.defer = true;
            script.onerror = reject;
            document.head.appendChild(script);
            window.initMap = resolve;
        });
    }


    /**
     * KMLレイヤーをマップに追加。
     */
    addKmlLayers() {
        const KmlLayerURLS = this.kmlFileManager.difficultyURLS;

        //複数あるKMLファイルのURLを処理
        Object.keys(KmlLayerURLS).forEach(key => {
            const layer = new google.maps.KmlLayer({
                url: KmlLayerURLS[key],
                map: this.map,
                preserveViewport: true,
                suppressInfoWindows: true
            });
            this.layers.push(layer);
            this.kmlLayerClick(layer)
        });
    }


    /**
     * マップに表示されたラインやマーカーをクリックした時の処理
     * @param {google.maps.KmlLayer} layer -マップに表示するkmlレイヤー
     */
    kmlLayerClick(layer) {
        layer.addListener('click', (event) => {
            const name = event.featureData.name;
            const position = event.latLng;
            const spotName = this.infoWindowManager.findSpotName(name);
            const imageUrl = spotName.dataset.imageUrl;
            const spotId = spotName.dataset.id;
            const difficulty = spotName.dataset.difficulty;

            //infoの内容UtilityのcreateContentを使用
            const content = createContent(name, difficulty, spotId, imageUrl);

            //InfoWIndow表示とli(name)のtoggle
            this.infoWindowManager.handleInfoWindow(this.map, content, position, spotId, imageUrl);
            this.infoWindowManager.spotNametoggle(spotName);
        });
    }


    /**
    * 難易度に応じたレイヤーの表示、非表示。
    */
    updateLayers() {
        const difficultySelect = document.getElementById("difficulty_select");
        const selectAllRindo = "selectAllDifficulty";
        const difficultyValue = difficultySelect.value;
        const difficultyURLS = this.kmlFileManager.createDifficultyURLS(); //表示するレイヤーのURL
        this.infoWindowManager.closeInfoWindoUpdateLayers(); // レイヤー更新時に表示されているInfoWindowを閉じる

        //指定なしselectAllRindoの場合全て表示
        if (difficultyValue === selectAllRindo || difficultyValue === '') {
            this.layers.forEach(layer => {
                layer.setMap(this.map);
            });
            //layers[]をnullにしてから指定されたレイヤーを表示
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


    /**
     * マップを初期化し、Google Maps APIをロードする。
     *
     * @returns {Promise<google.maps.Map>} - 初期化されたGoogle Mapsインスタンス
     */
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

            // KmlFileManagerが非同期でURLを取得するのを待つ
            await this.kmlFileManager.fetchKmlUrls();
            this.addKmlLayers();
            // this.updateLayers();
            return this.map;
        } catch (error) {
            console.error('Google Maps APIのロードに失敗しました:', error);
            throw error;
        }
    }


    /**
     * マップのスタイルを設定する。
     *
     * @returns {Object[]} - スタイルの配列
     */
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
                    { color: "#78A1BB" }
                ]
            }
        ];
    }
}
