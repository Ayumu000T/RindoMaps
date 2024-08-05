
//KMLファイルの読み込み
export class KmlFileManager {
    constructor() {
        this.kmlLayerURLS = {};
        this.difficultyURLS = {};
    }

    //KmlControllerのgetKmlUrlsからURLを取得
    async fetchKmlUrls() {
        try {
            const response = await fetch('/kml-urls');
            const urls = await response.json();
            this.kmlLayerURLS = urls;
            this.difficultyURLS = this.createDifficultyURLS();
        } catch (error) {
            console.error('KML URLの取得に失敗しました:', error);
        }
    }

    // KMLレイヤーのURLを難易度ごとに整理してオブジェクトとして返す
    createDifficultyURLS() {
        const urls = {};
        Object.keys(this.kmlLayerURLS).forEach(key => {
            const difficulty = key.replace('difficulty', '');
            urls[difficulty] = this.kmlLayerURLS[key];
        });
        return urls;
    }
}
