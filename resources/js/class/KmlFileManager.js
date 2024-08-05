
//KMLファイルの読み込み
export class KmlFileManager {
    constructor() {
        this.kmlLayerURLS = {};
        this.difficultyURLS = {};
    }

    //KmlControllerのgetKmlUrlsからURLを取得
    async fetchKmlUrls() {
        try {
            const response = await fetch('/get-kml-urls');
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

    //テスト用
    //kmlファイルのURLを読み込んで解析
    async testKml() {
        try {
            // PHPからKMLのURLを取得
            const urlResponse = await fetch('/kml-urls');
            if (!urlResponse.ok) {
                throw new Error(`Failed to fetch KML URLs: ${urlResponse.statusText}`);
            }
            const kmlUrls = await urlResponse.json();

            // URLのリストを取得
            const urls = Object.values(kmlUrls);

            // 各KMLファイルの読み込み
            const kmlResponses = await Promise.all(urls.map(url => fetch(`/fetch-kml?kmlUrl=${encodeURIComponent(url)}`)));

            const kmlTexts = await Promise.all(kmlResponses.map(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text();
            }));

            kmlTexts.forEach((kmlText, index) => {
                // XMLをパースする
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(kmlText, "application/xml");

                // <name>タグを取得
                const names = xmlDoc.getElementsByTagName("name");

                // 各<name>タグの内容をコンソールに表示
                for (let i = 0; i < names.length; i++) {
                    console.log(`Name ${i + 1}:`, names[i].textContent);
                }
            });
        } catch (error) {
            console.error('Failed to fetch KML:', error);
        }
    }
}