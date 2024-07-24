import { DetailWindow } from './DetailWindow.js';

//InfoWindowに関する処理
export class InfoWindowManager {
    constructor() {
        this.showInfoWindow = null;
        this.currentSpotName = null;
        this.detailWindow = new DetailWindow();
    }

    handleInfoWindow(map, content, position, spotId, imageUrl) {
        //クリックした林道と既存のinfoWindowが同じだったら閉じる
        if (this.showInfoWindow && this.showInfoWindow.getContent() === content) {
            this.showInfoWindow.close();
            this.showInfoWindow = null;
            map.setCenter({ lat: 35.80920, lng: 139.09663 });
            map.setZoom(10);
            return;
        } else {
            //infoWindowを開く＆既存のものを閉じる
            if (this.showInfoWindow) {
                if (this.currentSpotName) {
                    this.spotNametoggle(this.currentSpotName);
                }
                this.showInfoWindow.close();
                this.showInfoWindow = null;
            }

            this.showInfoWindow = new google.maps.InfoWindow({
                content: content,
                position: position
            });

            this.showInfoWindow.open(map);
            map.setCenter(position);
            map.setZoom(13);

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
                map.setCenter({ lat: 35.80920, lng: 139.09663 });
                map.setZoom(10);
                this.spotNametoggle(this.currentSpotName);
            });
        }
    }

    //MapManagerのupdateLayers実行時にinfoWindowが存在したら閉じる
    closeInfoWindoUpdateLayers() {
        if (this.showInfoWindow) {
            this.showInfoWindow.close();
            this.showInfoWindow = null;
            this.currentSpotName = null;
        }
    }

    //選択されてる林道のspotNameのスタイルを変更
    spotNametoggle(spotName) {
        spotName.classList.toggle('selected');
        this.currentSpotName = spotName;
    }

    //spotNametoggleのspotNameを探す
    findSpotName(content) {
        const spotNames = document.querySelectorAll('.spot_name');
        for (let spotName of spotNames) {
            const SpotName = spotName.textContent.trim();
            if (SpotName === content.trim()) {
                return spotName;
            }
        }
        return null;
    }
}
