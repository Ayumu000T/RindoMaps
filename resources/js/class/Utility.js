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
 * マップ初期読み込み時のズーム値
 * @returns {string} - ズーム値
 */
export function getZoomLevel() {
    const width = window.innerWidth;
    if (width >= 768) return 9;  // md以上のズーム値を9
    return 8;                 // md未満のズーム値を8
}


/**
 * マップ初期読み込み時の座標
 * @returns {string} - 座標
 */
export function getCenter() {
    const width = window.innerWidth;
    if (width >= 768) return { lat: 36.119417, lng: 138.974642 };  // md以上(神無湖上流の太田部橋)
    return { lat: 36.145823, lng: 138.842241 }; //md以下(御荷鉾スーパー林道（公園内）)
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



