import { ClickSpotName } from './ClickSpotName.js';

//selectの難易度を変更したときの処理
export class DifficultySelecter {
    constructor(map) {
        this.csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        this.difficultySelect = document.getElementById('difficulty_select');
        this.prefectureSelect = document.getElementById('prefecture_select');
        this.clickSpotName = new ClickSpotName(map);
    }

    changeSelect() {
        if (this.difficultySelect) {
            this.difficultySelect.addEventListener('change', async (event) => {
                event.preventDefault();
                await this.fetchFilteredData();
            });
        }
        if (this.prefectureSelect) {
            this.prefectureSelect.addEventListener('change', async (event) => {
                event.preventDefault();
                await this.fetchFilteredData();
            });
        }
    }

    //リストの更新
    async fetchFilteredData() {
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
            this.updateSpotList(data);
        } catch {
            console.error('Error:', error);
        }
    }

    //難易度によって表示されるリストの更新
    updateSpotList(data) {
        const resultList = document.getElementById('result_list');
        resultList.innerHTML = '';
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
                resultList.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = '- 該当する結果がありません -';
            li.classList.add('no_data');
            resultList.appendChild(li);
        }

        this.clickSpotName.clickRindoList();
    }
}

