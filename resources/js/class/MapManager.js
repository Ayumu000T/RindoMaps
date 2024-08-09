import { KmlFileManager } from './KmlFileManager.js';
import { InfoWindowManagerSingleton, createContent } from './Utility.js';
import { FilterSelecter } from './FilterSelecter.js'

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

            // URLが有効かチェック
            google.maps.event.addListener(layer, 'status_changed', () => {
                const status = layer.getStatus();
                if (status === google.maps.KmlLayerStatus.ERROR) {
                    console.error(`Error loading KML layer from URL: ${KmlLayerURLS[key]}`);
                    // 必要に応じて追加のエラーハンドリングを実施
                } else {
                    console.log(`KML layer status: ${status}`);
                }
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

    addFilteredKml(kmlUrl) {
        let kml = null;

        if (kmlUrl) {
            kml = kmlUrl;
        }
        confirm.log(kmlUrl);
    }

    /**
    * 難易度に応じたレイヤーの表示、非表示。
    *
    * ソートの条件と表示KMLレイヤー
    * ・ソートなし→初期ロード時に読み込んだkmlファイル
    * ・難易度でソート→初期ロード時に読み込んだ中の該当のkmlファイル
    * ・県と難易度でソート→この条件のkmlは存在しないので、新たにkml生成。KmlFileManager.jsを参照。
    */
    async updateLayers() {
        const difficultySelect = document.getElementById("difficulty_select");
        const prefectureSelect = document.getElementById('prefecture_select');
        const difficultyValue = difficultySelect.value;
        const prefectureValue = prefectureSelect.value;

        const difficultyURLS = this.kmlFileManager.createDifficultyURLS(); //表示するレイヤーのURL

        this.infoWindowManager.closeInfoWindoUpdateLayers(); // レイヤー更新時に表示されているInfoWindowを閉じる
        const filterSelecter = new FilterSelecter();

        //難易度と県のソートなしの場合
        if (difficultyValue === 'selectAllDifficulty' && prefectureValue === 'selectAllPrefecture') {
            this.layers.forEach(layer => {
                layer.setMap(this.map);
            });
            filterSelecter.fetchFilteredData(); //リストの更新

            //難易度のみソートの場合
        } else if (difficultyValue !== 'selectAllDifficulty' && prefectureValue === 'selectAllPrefecture') {
            this.layers.forEach(layer => {
                layer.setMap(null); // 表示してるkmlレイヤーを非表示にする
            });
            const layerToDisplay = this.layers.find(layer => layer.url === difficultyURLS[difficultyValue]);
            if (layerToDisplay) {
                layerToDisplay.setMap(this.map); //該当の難易度のkmlレイヤーのみ表示する
            }
            filterSelecter.fetchFilteredData(); //リストの更新

            //県でソートされた場合
        } else if (prefectureValue !== 'selectAllPrefecture') {
            const sortedKmlUrl = await filterSelecter.fetchFilteredData(); // リストの更新とソートされたkmlのURL(この条件の時のみ)
            this.layers.forEach(layer => {
                layer.setMap(null); // 表示してるkmlレイヤーを非表示にする
            });
            console.log('File URL:', sortedKmlUrl);

            /**
             *  APIが読み込んだkmlのキャッシュを残すので、そこらへんの対応をするコードを追加する。
             *  現状の問題
             *  ・ソートされたkmlファイルのURLが全て同一なので、新しく読み込ませてもapiがキャッシュを参照してしまう
             *  ・↑の問題解決のためにURLをユニークなものにすると、毎回違うURLを読み込まることになりapiのアクセスが増え課金されそうで良くない。
             *  解決策
             *  ・（済）URLをユニークにする
             *  ・（済）ソートされたURLを保存（ローカルストレージ？）
             *  ・保存したURLを読み込ませて、apiのキャッシュが有効なら既存のURLを、無効なら新規発行URLを使う
             */
            if (sortedKmlUrl) {
                const layer = new google.maps.KmlLayer({
                    url: sortedKmlUrl,
                    map: this.map,
                    preserveViewport: true,
                    suppressInfoWindows: true
                });
                this.layers.push(layer);
                this.kmlLayerClick(layer);
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
