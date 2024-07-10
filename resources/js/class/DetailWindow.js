import { convertDifficultyToStar } from './Utility.js';

//詳細ウィンドの処理
export class DetailWindow {
    constructor() {
        this.detailContainer = document.getElementById('detail_container');
    }

    async showDetail(spotId, imageUrl) {
        this.detailContainer.classList.add('appear');
        const detailUrl = `/detail/${spotId}`;

        try {
            const response = await fetch(detailUrl)
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            this.renderDetail(data, imageUrl);
        } catch (error) {
            console.error('詳細ページ取得エラー:', error);
        }
    }

    renderDetail(data, imageUrl) {
        this.detailContainer.innerHTML = `
            <div class="detail_window">
                <div id="detail_close">
                    <span>x</span>
                </div>
                <h2>${data.name}</h2>
                <p>難易度: ${convertDifficultyToStar(data.difficulty)}</p>
                <p>${data.description}</p>
                <div class="image_container">
                    <img src="${imageUrl}" width="300">
                    ${data.image_urls.map(imageUrl => `<img src="${imageUrl}" width="300">`).join(' ')}
                </div>
            </div>
        `;

        const detailClose = document.getElementById('detail_close');
        const detailWindow = document.querySelector('.detail_window');

        const closeHandler = (event) => {
            if (!detailWindow.contains(event.target) || event.target === detailClose || event.target.closest('#detail_close')) {
                this.detailContainer.classList.remove('appear');
                this.detailContainer.innerHTML = '';
                detailClose.removeEventListener('click', closeHandler);
                this.detailContainer.removeEventListener('click', closeHandler);
            }
        };

        detailClose.addEventListener('click', closeHandler);
        this.detailContainer.addEventListener('click', closeHandler);
    }
}
