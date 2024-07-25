import { ClickSpotName } from './ClickSpotName.js';

//selectの難易度を変更したときの処理
export class DifficultySelecter {
    constructor(map) {
        this.csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        this.difficultySelect = document.getElementById('difficulty_select');
        this.prefectureSelect = document.getElementById('prefecture_select');
        this.clickSpotName = new ClickSpotName(map);
    }

    changeDifficulty() {
        if (this.difficultySelect) {
            this.difficultySelect.addEventListener('change', async (event) => {
                event.preventDefault();
                await this.fetchDifficultyData();
            });
        }
    }

    changePrefecture() {
        if (this.prefectureSelect) {
            this.prefectureSelect.addEventListener('change', async (event) => {
                event.preventDefault();
                await this.fetchPrefectureData();
            });
        }
    }

    //fetchの内容
    async fetchDifficultyData() {
        const difficulty = this.difficultySelect.value;
        const formData = new FormData();
        formData.append('difficulty', difficulty);

        try {
            const response = await fetch('/handle-form-difficulty', {
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


    async fetchPrefectureData() {
        const prefecture = this.prefectureSelect.value;
        const formData = new FormData();
        formData.append('prefecture', prefecture);

        try {
            const response = await fetch('/handle-form-prefecture', {
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
        data.spots.forEach(spot => {
            const li = document.createElement('li');
            li.classList.add('spot_name');
            li.classList.add('py-2');
            li.classList.add('ps-2');
            li.dataset.id = spot.id;
            li.dataset.coordinates = spot.coordinates;
            li.dataset.difficulty = spot.difficulty;
            li.dataset.imageUrl = spot.image_url;
            li.textContent = spot.name;
            resultList.appendChild(li);
        });
        this.clickSpotName.clickRindoList();
    }
}

