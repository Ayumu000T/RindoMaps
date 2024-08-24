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

            // 県でソートされたときのみ呼び出して、ソートされたkmlのURLを生成
            if (prefecture !== 'selectAllPrefecture') {
                /**
                 * もし、ソート結果に該当するkmlファイルがローカルストレージにあったら、それを返り値とする
                 * なければgenerateKmlUrl()を呼び出しサーバーに生成したkmlファイルをアップしてURLを返す
                 */
                if (!data.spots[0]) {
                    //ソート結果が無い場合
                    alert('該当するデータがありません。');
                    return;
                }

                const prefecture_key = data.spots[0].prefecture;
                const key = `D: ${difficulty}, P: ${prefecture_key}`; // ローカルストレージに保存する際のキー名

                //URLがあれば既存のURL、なければkmlファイルとURL生成
                if (!localStorage.getItem(key)) {
                    console.log('ローカルストレージにURL無し');
                    const sortedKmlUrl = await this.kmlFileManager.generateKmlUrl(data);
                    return { sortedKmlUrl, data, source: 'new url' }; // kmlがない場合は新規URL
                } else {
                    console.log('ローカルストレージにURL有り');
                    const sortedKmlUrl = localStorage.getItem(key);
                    console.log('ローカルURL', sortedKmlUrl);
                    return { sortedKmlUrl, data, source: 'existing url' }; // 保存された既存のURL
                }
            } else {
                return;
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

