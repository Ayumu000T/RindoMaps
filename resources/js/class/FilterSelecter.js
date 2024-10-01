import { ClickSpotName } from './ClickSpotName.js';
import { KmlFileManager } from './KmlFileManager.js';

/**
 * selectの難易度を変更したときの処理
 */
export class FilterSelecter {
    constructor(map) {
        this.csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content'); //トークン
        this.difficultySelect = document.getElementById('difficulty_select'); //難易度
        this.prefectureSelect = document.getElementById('prefecture_select'); //県
        this.clickSpotName = new ClickSpotName(map);
        this.kmlFileManager = new KmlFileManager();
    }

    /**
     * フィルターデータをサーバーから取得してリストを更新
     * @returns {Promise<{sortedKmlUrl: string, data: object, source: string}>}
     *  - sortedKmlUrl: ソートされたKMLファイルのURL
     *  - data: サーバーから取得したフィルタリングされたデータ
     *  - source: URLが新規生成されたものか既存のものかを示す文字列 ('new url' または 'existing url')
     */
    async fetchFilteredData(map) {
        const difficulty = this.difficultySelect.value;
        const prefecture = this.prefectureSelect.value;
        const formData = new FormData();
        formData.append('input_difficulty', difficulty);
        formData.append('input_prefecture', prefecture);

        try {
            const response = await fetch('/handle-form-filter', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': this.csrfToken
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            this.updateSpotList(data, map); //取得したデータでリストを更新

            // 県でフィルターされたときのみ呼び出して、ソートされたkmlのURLを返す
            if (prefecture !== 'selectAllPrefecture') {
                // フィルター結果がない場合
                if (!data.spots[0]) {
                    alert('該当するデータがありません。');
                    return;
                }

                // サーバーに配置してあるフィルターされたkmlファイルを条件に合わせて返す
                const baseURL = 'http://ic21at.oops.jp/rindo-map/filtered_kml/filtered';
                let filteredKmlUrl = `${baseURL}_${prefecture}`;

                if (difficulty !== 'selectAllDifficulty') {
                    filteredKmlUrl += `_${difficulty}`;
                }

                filteredKmlUrl += '.kml';

                return { filteredKmlUrl, data, source: 'new url' };
            }
        } catch (error) {
            console.error('Error fetching filtered data:', error);
            throw error;
        }
    }


    /**
     * 取得したデータに基づいて林道リストを更新
     * @param {Object} data - サーバーから取得したフィルタリングされたデータ
     */
    updateSpotList(data, map) {
        const resultList = document.getElementById('result_list');
        resultList.innerHTML = '';
        //データが0以上だったらリストを作成
        if (data.spots.length > 0) {
            data.spots.forEach(spot => {
                const li = document.createElement('li');
                li.classList.add('spot_name');
                li.classList.add('py-2');
                li.classList.add('ps-2');
                li.dataset.id = spot.id;
                li.dataset.coordinates = spot.coordinates;
                li.dataset.difficulty = spot.display_difficulty;
                li.dataset.imageUrl = spot.image_url;
                li.textContent = spot.name;
                li.id = `spot_${spot.id}`;
                resultList.appendChild(li);
            });
        } else {
            // 該当するデータがない場合
            const li = document.createElement('li');
            li.textContent = '- 該当する結果がありません -';
            li.classList.add('no_data');
            resultList.appendChild(li);
        }

        this.clickSpotName.clickRindoList(map); // リスト項目のクリックイベントを設定
    }
}

