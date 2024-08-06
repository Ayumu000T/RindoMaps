
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


    /**
     * kmlファイルの内容をセッションストレージに保存
     */
    async fetchAndSaveKmls() {
        // すべてのKMLファイルがセッションストレージに保存されているかチェック
        // 保存されてたら処理を終了
        const kmlCount = 5;
        let allKmlsLoaded = true;

        for (let i = 1; i <= kmlCount; i++) {
            if (!sessionStorage.getItem(`kml${i}`)) {
                allKmlsLoaded = false;
                break;
            }
        }
        if (allKmlsLoaded) {
            return;
        }

        try {
            // KmlController.phpのgetKmlUrlsからkmlファイルのURLを取得
            const urlResponse = await fetch('/kml-urls');
            if (!urlResponse.ok) {
                throw new Error(`Failed to fetch KML URLs: ${urlResponse.statusText}`);
            }
            const kmlUrls = await urlResponse.json();

            // 取得したURLを配列にする
            const urls = Object.values(kmlUrls);

            // 配列のURLにKmlController.phpのfetchKml経由でリクエストを送りkmlファイルを取得
            const kmlResponses = await Promise.all(urls.map(url => fetch(`/fetch-kml?kmlUrl=${encodeURIComponent(url)}`)));

            //各リクエストのレスポンスに対してテキストとして内容を取得
            const kmlTexts = await Promise.all(kmlResponses.map(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text();
            }));

            // セッションストレージにKML全体を保存
            kmlTexts.forEach((kmlText, index) => {
                sessionStorage.setItem(`kml${index + 1}`, kmlText);
            });
        } catch (error) {
            console.error('Failed to fetch KML:', error);
        }
    }

    /**
     * セッションストレージに保存したデータをkmlファイルとしてBlobでDLリンクを生成する
     * テストとしてセッションのkml2のDLリンクを生成
     */
    KmlBlobCreator() {
        //セッションストレージのkmlデータ取得
        const kmlData = sessionStorage.getItem('kml2');

        // Blobオブジェクトを作成
        if (kmlData) {
            const blob = new Blob([kmlData], { type: 'application/vnd.google-earth.kml+xml' });

            // Blobから一時的なURLを生成
            const url = URL.createObjectURL(blob);

            //テストDLして内容を確認をした
            // const blobDiv = document.getElementById('blob')
            // const a = document.createElement('a');
            // a.href = url;
            // a.download = 'map.kml';
            // a.textContent = 'Download KML file';
            // blobDiv.appendChild(a);

            return url;
        } else {
            console.error('No KML data found in session storage.');
            return null;
        }
    }
}