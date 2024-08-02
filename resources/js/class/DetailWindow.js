
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
        const detailImg = data.image_urls.map(imageUrl =>
            `<div class="swiper-slide"><img src="${imageUrl}" width="500"></div>`
        ).join(' ');

        this.detailContainer.innerHTML = `
            <div class="detail_window">
                <div id="detail_close">
                    <span>x</span>
                </div>
                <div class="detail_container">
                    <h2>${data.name}</h2>
                    <p>難易度: ${data.display_difficulty}</p>
                    <p>説明: ${data.description}</p>
                </div>
                <div class="swiper">
                    <div class="swiper-wrapper">
                        <div class="swiper-slide">
                            <img src="${imageUrl}" width="500">
                        </div>
                        ${detailImg}
                    </div>
                </div>
                <div class="swiper-pagination"></div>
            </div>
        `;

        this.swiper(data);
        this.detailClose();
    }


    swiper(data) {
        const detailImg = data.image_urls.map(imageUrl =>
            `<div class="swiper-slide"><img src="${imageUrl}" width="500"></div>`
        ).join(' ');

        if (detailImg !== '') {
            const swiperContainer = this.detailContainer.querySelector('.swiper');
            swiperContainer.insertAdjacentHTML('beforeend', `
                <div class="swiper-button-prev"></div>
                <div class="swiper-button-next"></div>
            `);

            new Swiper('.swiper', {
                loop: true,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                },
                effect: "fade",
                pagination: {
                    el: ".swiper-pagination",
                    type: "bullets",
                    clickable: "clickable"
                },
                autoHeight: true
            });
        }
    }

    detailClose() {
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
