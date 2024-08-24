import { InfoWindowManager } from './InfoWindowManager.js';

/**
 * InfoWindowManager.jsの処理を管理するクラス。
 * ClickSpotName.jsとMapManager.jsで使用。
 */
export class InfoWindowManagerSingleton {
    constructor() {
        /**
         * 初回のインスタンス生成時に InfoWindowManager のインスタンスを作成し保存。
         * それ以降は既存のインスタンスを使用。
         */
        if (!InfoWindowManagerSingleton.instance) {
            InfoWindowManagerSingleton.instance = new InfoWindowManager();
        }
    }

    getInstance() {
        return InfoWindowManagerSingleton.instance;
    }
}


/**
 * マップの中心座標とズーム値を設定するクラス
 */
export class HandleCenterAndZoom {
    constructor() {
        this.width = window.innerWidth;
    }

    /**
     * ズーム値を設定
     * @param {string} id -選択中の県1~の数字かselectAllPrefecture
     * @returns {string} - ズーム値
     */
    getZoomLevel(id) {
        if (id !== 'selectAllPrefecture') {
            if (this.width >= 768) return 10;  // md以上のズーム値を10
            return 9; // md未満のズーム値を9
        } else {
            if (this.width >= 768) return 9;  // md以上のズーム値を9
            return 8; // md未満のズーム値を8
        }
    }

    /**
     * 中心座標を設定
     * @param {string} id - 選択中の県1~の数字かselectAllPrefecture
     * @returns {object} - 中心座標
     */
    getCenter(id) {
        if (id !== 'selectAllPrefecture') {
            return this.prefectureCoordinate(id);
        } else {
            if (this.width >= 768) return { lat: 36.119417, lng: 138.974642 };  // md以上(神無湖上流の太田部橋)
            return { lat: 36.145823, lng: 138.842241 }; //md以下(御荷鉾スーパー林道（公園内）)
        }
    }


    /**
     * 県でソートされた場合の中心座標を設定
     * @param {string} id - 1~の数字。
     * @returns {object} - 該当idの中心座標
     */
    prefectureCoordinate(id) {
        const coordinates = [
            { id: '1', coordinate: { lat: 35.809512, lng: 139.097101 } }, //東京: 奥多摩駅
            { id: '2', coordinate: { lat: 35.994789, lng: 139.085967 } }, //埼玉: 秩父鉄道の秩父駅
            { id: '3', coordinate: { lat: 36.455127, lng: 138.889588 } }, //群馬: 榛名神社
            { id: '4', coordinate: { lat: 35.606833, lng: 138.716750 } }, //山梨: 大月市にある滝子山
            { id: '5', coordinate: { lat: 36.193933, lng: 138.345227 } }, //長野: 佐久穂町役場
        ];

        // 配列から一致するIDを持つオブジェクトを検索し、対応するcoordinateを返す
        const result = coordinates.find(item => item.id === id);

        // resultが見つかった場合、そのcoordinateを返す。見つからない場合はundefinedを返す。
        return result ? result.coordinate : undefined;
    }
}


/**
 * 林道リストorマップ内マーカーをクリックしたときに表示するInfoWindowの内容。
 * ClickSpotName.jsとMapManager.jsで使用。
 * @param {string} name - 林道名
 * @param {string} difficulty - 難易度(★表記)
 * @param {number} spotId - 林道名のID
 * @param {string} imageUrl - 画像のURL
 * @returns {string} HTML - InfoWindowに表示するHTML
 */
export function createContent(name, difficulty, spotId, imageUrl) {
    return `
        <div class="info_window">
            <h2>${name.trim()}</h2>
            <p>難易度: ${difficulty}</p>
            <a class="detail_link" href="/detail/${spotId}">詳細</a><br>
            <img src="${imageUrl}" class="info_window_img" width="">
        </div>
    `.trim();
}
