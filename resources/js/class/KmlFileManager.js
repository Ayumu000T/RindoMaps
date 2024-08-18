
/**
 * kmlファイルに関するクラス
 */
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
     * セッションストレージのkmlファイルを$spotsのデータを元にソート
     *
     * @param {Object} data - FilterSelecter.jsのfetchFilteredData()で難易度or県でソートされた$spotsデータ
     * @returns {Array} $spotsのnameと合致いたplacemarkのデータが入った配列
     */
    extractPlacemarksFromKml(data) {
        const kmlKeys = ['kml1', 'kml2', 'kml3', 'kml4', 'kml5']; // ここに必要な KML のキーを追加
        const styleMap = {};
        const allPlacemarks = [];

        kmlKeys.forEach(key => {
            const kmlData = sessionStorage.getItem(key);
            if (kmlData) {
                const parser = new DOMParser();
                const kmlDoc = parser.parseFromString(kmlData, 'application/xml');

                // スタイルを抽出
                const styles = kmlDoc.getElementsByTagName('Style');
                const styleMaps = kmlDoc.getElementsByTagName('StyleMap');
                Array.from(styles).forEach(style => {
                    styleMap[style.id] = new XMLSerializer().serializeToString(style);
                });
                Array.from(styleMaps).forEach(styleMapElement => {
                    styleMap[styleMapElement.id] = new XMLSerializer().serializeToString(styleMapElement);
                });

                // Placemarkを抽出
                const placemarks = kmlDoc.getElementsByTagName('Placemark');
                Array.from(placemarks).forEach(placemark => {
                    allPlacemarks.push(placemark);
                });
            }
        });

        // フィルタリングされたPlacemarkを抽出
        const filteredPlacemarks = [];
        data.spots.forEach(spot => {
            for (let i = 0; i < allPlacemarks.length; i++) {
                const nameElement = allPlacemarks[i].getElementsByTagName('name')[0];
                if (nameElement) {
                    const nameText = nameElement.textContent.replace(/\s+/g, '');
                    if (nameText === spot.name.replace(/\s+/g, '')) {
                        filteredPlacemarks.push(allPlacemarks[i]);
                    }
                }
            }
        });

        return { filteredPlacemarks, styleMap };
    }


    /**
     *
     * @param {Array} placemarks - extractPlacemarksFromKmlで作った配列
     * @returns {Blob} - KML ファイル データを含む Blob オブジェクト。
     */
    createKmlFromPlacemarks(placemarks, styleMap) {
        if (!placemarks || placemarks.length === 0) {
            console.error('No placemarks to create KML.');
            if (!confirm('マップの読み込みに失敗しました。ページを更新しますか？(更新推奨)')) {
                return;
            };
            window.location.reload();
        }

        const kmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
        <kml xmlns="http://www.opengis.net/kml/2.2">
        <Document>`;
        const kmlFooter = `</Document></kml>`;

        let kmlContent = '';
        // スタイルを追加
        Object.values(styleMap).forEach(style => {
            kmlContent += style;
        });

        // Placemarkを追加
        placemarks.forEach(placemark => {
            kmlContent += new XMLSerializer().serializeToString(placemark);
        });

        const kmlString = kmlHeader + kmlContent + kmlFooter;
        return new Blob([kmlString], { type: 'application/vnd.google-earth.kml+xml' });
    }


    /**
     *
     * @param {Object} data - KML のデータに基づいて Placemark を抽出するための情報を含むオブジェクト。
     * @param {Array} data.spots - ソートされたスポットの情報を含む配列。
     * @returns {Promise<string|null>} - KMLファイルのURL。サーバーからのレスポンスとして、アップロードしたファイルのURLが返される。アップロードに失敗した場合は null。
     */
    async generateKmlUrl(data) {
        const { filteredPlacemarks, styleMap } = this.extractPlacemarksFromKml(data);
        const kmlBlob = this.createKmlFromPlacemarks(filteredPlacemarks, styleMap);
        const prefecture = data.spots[0].prefecture;
        const difficultySelect = document.getElementById('difficulty_select');
        const difficulty = difficultySelect.value;

        //サーバーに新規作成したkmlファイルをアップ
        const sortedKmlUrl = await this.fetchHttpSever(kmlBlob);
        const key = `D: ${difficulty}, P: ${prefecture}`;

        //サーバーにアップしたURLをローカルストレージに保存
        localStorage.setItem(key, sortedKmlUrl);

        return sortedKmlUrl;
    }

    /**
      * 生成したkmlファイルをサーバーにアップロードして、そのファイルのURLを返す
      * apiがkmlを読み込むためにオンライン上に配置する必要がある
      *
      * @param {Blob} blob - 生成したKMLファイルを含むBlobオブジェクト。
      * @returns {Promise<string|null>} - サーバーにアップロードしたKMLファイルのURL。アップロードに失敗した場合は null。
      */
    async fetchHttpSever(blob) {
        const formData = new FormData();
        formData.append('kmlFile', blob, 'filteredData.kml');

        try {
            const response = await fetch('http://localhost:3000/filtered-data', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                console.log('KML file successfully uploaded.');
                return data.fileUrl;
            } else {
                console.error('Failed to upload KML file. Status:', response.status);
                return null;
            }
        } catch (error) {
            console.error('Error uploading KML file:', error);
            return null;
        }
    }


    /**
     * Google Maps APIにkmlファイルのURLを読み込ませた後に、サーバーにあるkmlファイルを削除するリクエストを送る
     * @param {string} url - kmlファイルのURL
     */
    async fetchDeleteKml(url) {
        //ソート無しの場合にも関わらず、まれに呼び出されエラーが起こる
        //非同期処理のタイミングの問題？エラーのタイミングが毎回違うから現状原因不明。該当の条件の場合ここで処理を終了すればエラーは回避できる。
        const difficultySelect = document.getElementById("difficulty_select");
        const prefectureSelect = document.getElementById('prefecture_select');
        const difficultyValue = difficultySelect.value;
        const prefectureValue = prefectureSelect.value;
        if (difficultyValue === 'selectAllDifficulty' && prefectureValue === 'selectAllPrefecture') {
            return;
        }

        const data = { kmlFileUrl: url };

        try {
            const response = await fetch('http://localhost:3000/delete-kml', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                console.log('kml file in the server has been deleted.')
            } else {
                console.error('Failed to delete KML file. Status:', response.status);
            }
        } catch (error) {
            console.error('Error deleting KML file:', error);
        }
    }

}
