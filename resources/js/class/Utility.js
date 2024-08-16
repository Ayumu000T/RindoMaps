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



