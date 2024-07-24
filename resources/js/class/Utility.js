
import { InfoWindowManager } from './InfoWindowManager.js';

//InfoWindowManagerの処理をClickSpotNameとMapManagerで共有する
export class InfoWindowManagerSingleton {
    constructor() {
        if (!InfoWindowManagerSingleton.instance) {
            InfoWindowManagerSingleton.instance = new InfoWindowManager();
        }
    }

    getInstance() {
        return InfoWindowManagerSingleton.instance;
    }
}

//selectに難易度の難易度を星に変換
export function convertDifficultyToStar(difficulty) {
    switch (difficulty) {
        case '1':
            return '★';
        case '2':
            return '★★';
        case '3':
            return '★★★';
        case '4':
            return '★★★★';
        case '5':
            return '★★★★★';
        case '指定無し':
            return difficulty;
        default:
            return '';
    }
}

//infoの内容
export function createContent(name, difficulty, spotId, imageUrl) {
    return `
        <div class="info_window">
            <h2>${name.trim()}</h2>
            <p>難易度: ${convertDifficultyToStar(difficulty)}</p>
            <a class="detail_link" href="/detail/${spotId}">詳細</a><br>
            <img src="${imageUrl}" width="300">
        </div>

    `.trim();
}
