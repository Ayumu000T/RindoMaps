
/**
 * 詳細ウィンドウの表示と操作を管理するクラス。
 */
export class DetailWindow {
    constructor() {
        this.detailContainer = document.getElementById('detail_container');
    }


    /**
     * 詳細情報を表示。
     *
     * @param {number} spotId - 林道のID
     * @param {string} imageUrl - 画像URL
     */
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


    /**
     * 詳細ウィンドウの内容をレンダリング。
     *
     * @param {Object} data - 詳細情報を含むデータオブジェクト
     * @param {string} imageUrl - 画像URL
     */
    renderDetail(data, imageUrl) {
        //imageUrlとは別に1~3枚ある詳細ページ用の画像URLをdataから生成
        //詳細画像スライドのHTMLを生成
        const detailImgUrl = data.image_urls.map(detailImageUrl =>
            `<div class="swiper-slide"><img src="${detailImageUrl}" width="500"></div>`
        ).join(' ');


        this.detailContainer.innerHTML = `
            <div class="detail_window">
                <div id="detail_close">
                    <span>x</span>
                </div>
                <div class="detail_container">
                    <h2>${data.name}</h2>
                    <p>難易度: ${data.display_difficulty}</p>
                    <p>${data.description}</p>
                </div>
                <div class="swiper">
                    <div class="swiper-wrapper">
                        <div class="swiper-slide">
                            <img src="${imageUrl}" width="500">
                        </div>
                        ${detailImgUrl}
                    </div>
                </div>
                <div class="swiper-pagination"></div>
            </div>
        `;

        this.swiper(data); // スワイパー
        this.detailClose(); // 詳細ウィンドウの閉じる処理
    }


    /**
     * スワイパーを初期化。
     *
     * @param {Object} data - 詳細情報を含むデータオブジェクト
     */
    swiper(data) {
        //imageUrlとは別に1~3枚ある詳細ページ用の画像URLをdataから生成
        //詳細画像スライドのHTMLを生成
        const detailImgUrl = data.image_urls.map(detailImageUrl =>
            `<div class="swiper-slide"><img src="${detailImageUrl}" width="500"></div>`
        ).join(' ');

        // 画像スライドがある場合のみスワイパーのボタンを追加
        if (detailImgUrl !== '') {
            const swiperContainer = this.detailContainer.querySelector('.swiper');
            swiperContainer.insertAdjacentHTML('beforeend', `
                <div class="swiper-button-prev"></div>
                <div class="swiper-button-next"></div>
            `);

            // Swiperの初期化
            new Swiper('.swiper', {
                loop: true, //ループ有効
                navigation: {
                    nextEl: '.swiper-button-next', //スライドの右方向ボタン
                    prevEl: '.swiper-button-prev'  //スライドの左方向ボタン
                },
                effect: "fade", //画像が切り替わるときのエフェクト
                pagination: {  //画像したのページネーション(丸いやつ)
                    el: ".swiper-pagination",
                    type: "bullets",
                    clickable: "clickable"
                },
                autoHeight: true //高さ自動(画像サイズが違う場合があるため)
            });
        }
    }


    /**
     * 詳細ウィンドウを閉じる処理。
     */
    detailClose() {
        const detailClose = document.getElementById('detail_close'); // 閉じるボタン
        const detailWindow = document.querySelector('.detail_window'); // 詳細ウィンドウ

        /**
         * 詳細ウィンドウを閉じるためのクリックイベントハンドラー。
         */
        const closeHandler = (event) => {
            // クリックイベントが詳細ウィンドウの外側、または閉じるボタンの上で発生した場合
            if (!detailWindow.contains(event.target) || event.target === detailClose || event.target.closest('#detail_close')) {
                this.detailContainer.classList.remove('appear');
                this.detailContainer.innerHTML = '';
                detailClose.removeEventListener('click', closeHandler);
                this.detailContainer.removeEventListener('click', closeHandler);
            }
        };

        detailClose.addEventListener('click', closeHandler); // 閉じるボタンにクリックイベントリスナーを追加
        this.detailContainer.addEventListener('click', closeHandler); // 詳細ウィンドウにクリックイベントリスナーを追加
    }

}
