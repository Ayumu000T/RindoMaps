import { InfoWindowManagerSingleton, createContent } from './Utility.js';

/**
 * 林道のリスト(spotName)をクリック時の処理
 */
export class ClickSpotName {
    /**
     * @param {google.maps.Map} map map Google Maps の Map オブジェクト
     */
    constructor(map) {
        this.map = map;
        const singleton = new InfoWindowManagerSingleton();
        this.infoWindowManager = singleton.getInstance(); // InfoWindowManagerのシングルトンインスタンス
    }

    /**
     * 林道リストの各林道名にクリックイベントリスナーを追加する。
     */
    clickRindoList() {
        document.querySelectorAll('.spot_name').forEach(spotName => {
            spotName.addEventListener('click', () => {
                this.handleSpotNameClick(spotName);
            });
        });
    }


    /**
     *リストの林道名がクリックされたときの処理

     * @param {HTMLElement} spotName クリックされたスポット名の li 要素
     */
    handleSpotNameClick(spotName) {
        // データ属性から情報を取得
        const coordinates = spotName.dataset.coordinates.split(','); // 座標情報
        const lat = parseFloat(coordinates[1]); // 緯度
        const lng = parseFloat(coordinates[0]); // 緯度
        const position = { lat: lat, lng: lng };
        const name = spotName.textContent.trim();
        const spotNameElement = this.infoWindowManager.findSpotName(name);
        const imageUrl = spotName.dataset.imageUrl;
        const spotId = spotName.dataset.id;
        const difficulty = spotName.dataset.difficulty;

        // InfoWindow の内容を Utility の createContent を使用して作成
        const content = createContent(name, difficulty, spotId, imageUrl);

        // InfoWindow を表示し、スポット名のスタイルをトグル
        this.infoWindowManager.handleInfoWindow(this.map, content, position, spotId, imageUrl);
        this.infoWindowManager.spotNametoggle(spotNameElement);
    }

}

