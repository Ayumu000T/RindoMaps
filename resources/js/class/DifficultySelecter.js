import { convertDifficultyToStar } from './Utility.js';
import { ClickSpotName } from './ClickSpotName.js';

//selectの難易度を変更したときの処理
export class DifficultySelecter {
    constructor(map) {
        this.csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        this.difficultySelect = document.getElementById('difficulty_select');
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

    //fetchの内容
    async fetchDifficultyData() {
        const difficulty = this.difficultySelect.value;
        const formData = new FormData();
        formData.append('difficulty', difficulty);

        try {
            const response = await fetch('/handle-form-api', {
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
            // this.updateSelectedDifficulty(data);
            this.updateSpotList(data);
        } catch {
            console.error('Error:', error);
        }
    }

    //どの難易度が選択されているかの表示を更新
    // updateSelectedDifficulty(data) {
    //     const resultDifficulty = document.getElementById('result_difficulty');
    //     resultDifficulty.textContent = `選択中の難易度: ${convertDifficultyToStar(data.selectedDifficulty)}`;
    // }

    //難易度によって表示されるリストの更新
    updateSpotList(data) {
        const resultList = document.getElementById('result_list');
        resultList.innerHTML = '';
        data.spots.forEach(spot => {
            const li = document.createElement('li');
            li.classList.add('spot_name');
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

