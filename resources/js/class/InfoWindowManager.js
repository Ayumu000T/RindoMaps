import { DetailWindow } from './DetailWindow.js';
import { HandleCenterAndZoom } from './Utility.js';

/**
 * Google Maps APIのInfoWindowに関するクラス。
 * 地図上のInfoWindowの表示、管理、操作をする。
 */
export class InfoWindowManager {
    constructor() {
        this.showInfoWindow = null; // 現在表示中のInfoWindow
        this.currentSpotName = null; //現在選択中の林道名(li)
        this.detailWindow = new DetailWindow(); // 詳細ページの処理
        this.handleCenterAndZoom = new HandleCenterAndZoom();
    }


    /**
     * InfoWindow を地図上に表示、非表示、詳細リンクの処理。
     *
     * @param {google.maps.Map} map - Google Maps の地図オブジェクト
     * @param {string} content - InfoWindow に表示する HTML コンテンツ
     * @param {google.maps.LatLng} position - InfoWindow の表示座標
     * @param {number} spotId - 林道のID
     * @param {string} imageUrl - 画像 URL
     */
    handleInfoWindow(map, content, position, spotId, imageUrl) {
        //クリックした林道(li)と表示したinfoWindowの内容が同じだったら閉じる
        const id = document.getElementById('prefecture_select').value;
        if (this.showInfoWindow && this.showInfoWindow.getContent() === content) {
            this.showInfoWindow.close();
            this.showInfoWindow = null;
            map.setCenter(this.handleCenterAndZoom.getCenter(id));
            map.setZoom(this.handleCenterAndZoom.getZoomLevel(id));
            return;
        } else {
            //表示中のInfoWindowがあれば閉じる
            if (this.showInfoWindow) {
                if (this.currentSpotName) {
                    this.spotNametoggle(this.currentSpotName);
                }
                this.showInfoWindow.close();
                this.showInfoWindow = null;
            }

            // 新しい InfoWindow のインスタンスを作成して表示
            this.showInfoWindow = new google.maps.InfoWindow({
                content: content,
                position: position
            });

            this.showInfoWindow.open(map);
            map.setCenter(position);
            map.setZoom(12);


            //infoWindowの詳細をクリックしたときの処理
            google.maps.event.addListener(this.showInfoWindow, 'domready', () => {
                const detailLink = document.querySelector('.detail_link');
                if (detailLink) {
                    detailLink.addEventListener('click', (event) => {
                        event.preventDefault();
                        this.detailWindow.showDetail(spotId, imageUrl);
                    });
                }
            });

            //infoWindowを閉じるときの処理
            google.maps.event.addListener(this.showInfoWindow, 'closeclick', () => {
                this.showInfoWindow = null;
                this.spotNametoggle(this.currentSpotName);
            });
        }
    }


    /**
     *  マーカーをクリックしたときに、リストの該当の林道名にスクロール
     * @param {string} spotId - id
     */
    scrollList(spotId) {
        const listItem = document.querySelector(`#spot_${spotId}`);
        if (listItem) {
            const scrollList = document.querySelector('#result');
            if (scrollList) {
                // スクロールコンテナとその内容の高さを比較する
                const containerHeight = scrollList.clientHeight;
                const contentHeight = scrollList.scrollHeight;

                // スクロールが必要な場合のみスクロール処理を実行
                if (contentHeight > containerHeight) {
                    scrollList.scroll({
                        top: listItem.offsetTop - scrollList.offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        }
    }


    /**
     *  MapManagerのupdateLayers実行時にinfoWindowが存在したら閉じる
     */
    closeInfoWindoUpdateLayers() {
        if (this.showInfoWindow) {
            this.showInfoWindow.close();
            this.showInfoWindow = null;
            this.currentSpotName = null;
        }
    }


    /**
     * 選択されてる林道の要素のスタイルを変更。
     * 要素に'selected'クラスを追加してトグル、選択されている林道名の要素を更新。
     *
     * @param {string} spotName - スタイルを変更する林道名の要素
     */
    spotNametoggle(spotName) {
        spotName.classList.toggle('selected');
        this.currentSpotName = spotName;
    }


    /**
     *  spotNametoggleの引数spotNameに該当する林道名の要素を検索。
     *
     * @param {string} content - 検索する林道名のテキスト内容
     * @returns {Element|null} - 林道名の要素が見つかった場合その要素、見つからない場合nullを返す
     */
    findSpotName(content) {
        const spotNames = document.querySelectorAll('.spot_name'); //全ての林道名要素を取得
        for (let spotName of spotNames) {
            const SpotName = spotName.textContent.trim(); //要素のテキスト内容を取得してトリム
            if (SpotName === content.trim()) { // 指定された内容と一致するか比較
                return spotName; // 一致する要素を返す
            }
        }
        return null; // 一致する要素が見つからない場合は `null` を返す
    }
}
