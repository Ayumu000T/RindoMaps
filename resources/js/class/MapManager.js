import { KmlFileManager } from './KmlFileManager.js';
import { InfoWindowManagerSingleton, createContent, HandleCenterAndZoom } from './Utility.js';
import { FilterSelecter } from './FilterSelecter.js'
import { DetailWindow } from './DetailWindow.js'

/**
 * google maps関連の処理を管理するクラス
 */
export class MapManager {
    constructor() {
        this.map = null; // Google Mapsインスタンス
        this.layers = []; // KMLレイヤーの配列
        this.filterLayers = []; // ソートによって追加されたレイヤーを管理する配列
        const singleton = new InfoWindowManagerSingleton();
        this.infoWindowManager = singleton.getInstance(); // InfoWindowManagerのシングルトンインスタンス
        this.kmlFileManager = new KmlFileManager(); //KMLファイルを管理するインスタンス
        this.handleCenterAndZoom = new HandleCenterAndZoom();
        this.detailWindow = new DetailWindow();
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
  * マップを初期化し、Google Maps APIをロードする。
  *
  * @returns {Promise<google.maps.Map>} - 初期化されたGoogle Mapsインスタンス
  */
    async initMap() {
        const apiKeyElement = document.getElementById('google-maps-api-key');
        const apiKey = apiKeyElement ? apiKeyElement.getAttribute('data-api-key') : null;
        const prefecture = document.getElementById('prefecture_select').value;

        try {
            // ロード画面表示
            this.showLoadingScreen();

            await MapManager.loadGoogleMapsApi(apiKey);
            this.map = new google.maps.Map(document.getElementById('map'), {
                center: this.handleCenterAndZoom.getCenter(prefecture),
                zoom: this.handleCenterAndZoom.getZoomLevel(prefecture),
                styles: this.mapStyles(),
            });

            // KmlFileManagerが非同期でURLを取得するのを待つ
            await this.kmlFileManager.fetchKmlUrls();
            this.addKmlLayers();

            // ロード画面非表示
            this.hideLoadingScreen();

            return this.map;
        } catch (error) {
            console.error('Failed to load Google Maps API:', error);
            throw error;
        }
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
                if (status !== google.maps.KmlLayerStatus.OK) {
                    console.log(`KML layer status: ${status}`);
                    console.error(`Error loading KML layer from URL: ${KmlLayerURLS[key]}, Status: ${status}`);
                    confirm('マップの読み込みに失敗しました。ページを更新せず続けますか？')
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

            // 該当の林道名のリストアイテムまでスクロール
            this.infoWindowManager.scrollList(spotId);
        });
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
        if (!this.map) {
            console.error('Map is not initialized.');
            return;
        }

        const difficultySelect = document.getElementById("difficulty_select");
        const prefectureSelect = document.getElementById('prefecture_select');
        const difficultyValue = difficultySelect.value;
        const prefectureValue = prefectureSelect.value;
        const difficultyURLS = this.kmlFileManager.createDifficultyURLS(); // 表示するレイヤーのURL
        this.infoWindowManager.closeInfoWindoUpdateLayers(); // レイヤー更新時に表示されているInfoWindowを閉じる
        const filterSelecter = new FilterSelecter();

        // フィルタリングされたレイヤーをクリアする
        this.filterLayers.forEach(layer => {
            // console.log('フィルターレイヤーを削除:', layer);
            layer.setMap(null);
        });
        this.filterLayers = [];

        // 難易度と県のソートなしの場合
        if (difficultyValue === 'selectAllDifficulty' && prefectureValue === 'selectAllPrefecture') {
            // console.log('条件: 難易度と県のソートなし');
            this.layers.forEach(layer => {
                // console.log('KML Layerをマップに再表示:', layer);
                layer.setMap(this.map);
            });
            await filterSelecter.fetchFilteredData(this.map); //リストの更新
            // console.log('ソート無しの処理完了');

            this.map.setCenter(this.handleCenterAndZoom.getCenter(prefectureValue));
            this.map.setZoom(this.handleCenterAndZoom.getZoomLevel(prefectureValue));

            // 難易度のみソートの場合
        } else if (difficultyValue !== 'selectAllDifficulty' && prefectureValue === 'selectAllPrefecture') {
            this.layers.forEach(layer => {
                layer.setMap(null); // 表示してるkmlレイヤーを非表示にする
            });
            const layerToDisplay = this.layers.find(layer => layer.url === difficultyURLS[difficultyValue]);
            if (layerToDisplay) {
                layerToDisplay.setMap(this.map); //該当の難易度のkmlレイヤーのみ表示する
            }

            await filterSelecter.fetchFilteredData(this.map); //リストの更新

            // 県でソートされた場合
        } else if (prefectureValue !== 'selectAllPrefecture') {
            const result = await filterSelecter.fetchFilteredData(this.map);

            // ソート結果が無い時は処理を終了
            if (!result || !result.filteredKmlUrl) {
                console.log('ソート結果が無いので、全てのKML Layerを非表示にする');
                this.layers.forEach(layer => {
                    layer.setMap(null); // 表示してるkmlレイヤーを非表示にする
                });
                return;
            }

            const { filteredKmlUrl, data, source } = result;

            this.layers.forEach(layer => {
                layer.setMap(null); // 表示してるkmlレイヤーを非表示にする
            });

            if (filteredKmlUrl) {
                const layer = new google.maps.KmlLayer({
                    url: filteredKmlUrl,
                    map: this.map,
                    preserveViewport: true,
                    suppressInfoWindows: true
                });

                // レイヤーが更新された際にURLが有効かチェック
                // layer.addListener('status_changed', async () => {

                //     try {
                //         const newLayer = await this.handleKmlLayerStatusChange(layer, data, filteredKmlUrl, source);

                //         if (!newLayer) {
                //             // handleKmlLayerStatusChangeが成功した場合にのみフィルターレイヤーに追加
                //             this.filterLayers.push(layer); // フィルターレイヤーとして保存
                //             this.kmlLayerClick(layer);
                //         }

                //     } catch (error) {
                //         console.error('KML Layerの処理中にエラーが発生:', error);
                //     }
                // });
                this.filterLayers.push(layer); // フィルターレイヤーとして保存
                this.kmlLayerClick(layer);
            }
        }

        if (prefectureValue === 'selectAllPrefecture') {
            this.map.setCenter(this.handleCenterAndZoom.getCenter(prefectureValue));
            this.map.setZoom(this.handleCenterAndZoom.getZoomLevel(prefectureValue));
        } else {
            this.map.setCenter(this.handleCenterAndZoom.prefectureCoordinate(prefectureValue));
            this.map.setZoom(this.handleCenterAndZoom.getZoomLevel(prefectureValue));
        }

    }



    /**
     * マップに読み込んだローカルストレージのURLが有効か無効化チェック
     * Googl Maps APIに読み込んだURLのキャッシュがあればファイルがなくてもマップを読み込める
     * キャッシュがない時は新規kmlファイルを作成してURLを生成する処理をする。
     * @param {google.maps.KmlLayer} layer - Google Maps API の KmlLayer オブジェクト
     * @param {Object} data - KML ファイルの生成に必要なデータ
     * @returns {Promise<void>}
     */
    async handleKmlLayerStatusChange(layer, data, url, source) {
        // URLが有効で、新規作成されたURLの場合
        if (layer.getStatus() === google.maps.KmlLayerStatus.OK && source === 'new url') {
            await this.kmlFileManager.fetchDeleteKml(url);
            return;
        // URLが有効で、既存のURLの場合
        } else if (layer.getStatus() === google.maps.KmlLayerStatus.OK && source === 'existing url') {
            return;
        //既存のURLが無効の場合
        } else {
            console.log('Failed to load KML file. New URL generated.');
            try {
                // 新しいURLを生成
                const newSortedKmlUrl = await this.kmlFileManager.generateKmlUrl(data);

                // 新しいレイヤーを作成して追加
                if (newSortedKmlUrl) {
                    const newLayer = new google.maps.KmlLayer({
                        url: newSortedKmlUrl,
                        map: this.map,
                        preserveViewport: true,
                        suppressInfoWindows: true
                    });

                    google.maps.event.addListener(newLayer, 'status_changed', async () => {
                        const status = newLayer.getStatus();

                        if (status === google.maps.KmlLayerStatus.OK) {
                            await this.kmlFileManager.fetchDeleteKml(newSortedKmlUrl);

                            // 古いレイヤーを `filterLayers` から削除
                            this.filterLayers = this.filterLayers.filter(l => l !== layer);

                            // 新しいレイヤーを追加
                            this.filterLayers.push(newLayer); // 新しいレイヤーをフィルターレイヤーとして保存
                            this.kmlLayerClick(newLayer);
                        } else {
                            console.error('Failed to load new KML layer. Status:', status);
                        }
                    });

                    /// 古いレイヤーを削除
                    layer.setMap(null);
                    return newLayer; // 成功した新しいレイヤーを返す
                }
            } catch (error) {
                console.error('Failed to generate new KML URL', error);
            }
        }
    }

    /**
     * ロード画面のアニメーションを表示
     */
    showLoadingScreen() {
        document.getElementById('detail_container').classList.add('appear');
        document.getElementById('loader_container').style.display = 'flex';

    }

    /**
     * ロード画面のアニメーションを非表示
     */
    hideLoadingScreen() {
        document.getElementById('detail_container').classList.remove('appear');
        document.getElementById('loader_container').style.display = 'none';
    }

    /**
     * リストと表示レイヤーをリセット
     */
    sortReset() {
        document.getElementById('sort_reset').addEventListener('click', () => {
            const difficultySelect = document.getElementById("difficulty_select");
            const prefectureSelect = document.getElementById('prefecture_select');
            const difficultyValue = difficultySelect.value;
            const prefectureValue = prefectureSelect.value;

            if (difficultyValue === 'selectAllDifficulty' && prefectureValue === 'selectAllPrefecture') {
                return;
            } else {
                difficultySelect.selectedIndex = 0;
                prefectureSelect.selectedIndex = 0;
                this.updateLayers();
            }
        });
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
                    { color: "#78A1BB"}
                ]
            }
        ];
    }
}
