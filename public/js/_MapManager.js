
import KmlFileManager from './_KmlFileManager.js';

const KmlFile = new KmlFileManager();
const KmlLayerURLS = KmlFile.kmlLayerURLS


// export default class MapManager {
//     constructor() {
//         this.map = null;
//         this.layers = [];
//         this.showInfoWindow = null;
//         this.currentSpotName = null;
//     }

//     //マップの表示関連
//     initMap() {
//         this.map = new google.maps.Map(document.getElementById('map'), {
//             center: { lat: 35.80920, lng: 139.09663 },
//             zoom: 11
//         });

//         //kmlを読み込み
//         Object.keys(KmlLayerURLS).forEach(key => {
//             const layer = new google.maps.KmlLayer({
//                 url: KmlLayerURLS[key],
//                 map: null,
//                 preserveViewport: true,
//                 suppressInfoWindows: true
//             });
//             this.layers.push(layer);

//             layer.addListener('click', function (event) {
//                 const name = event.featureData.name;
//                 const description = event.featureData.description;
//                 let imageSrc = `img/info_img_${name}.jpg`;

//                 //focusと同じ処理
//                 imageExistsAsync(imageSrc, function (exists) {
//                     //該当の画像がない場合
//                     if (!exists) {
//                         imageSrc = 'img/info_img_non.jpg';
//                     }
//                     //focusと同じ処理
//                     //info内容
//                     const content =
//                         `<h2>${name}</h2>
//                         <p>${description}</p>
//                         <p>詳細</p>
//                         <img src="${imageSrc}" width="300">`;
//                 });
//             });
//         });

//     }

//     //難易度によってマップのレイヤーの表示変更
//     updateLayers() {
//     const selectAllRindo = "selectAllRindo";
//     const difficultySelect = document.getElementById("difficulty_select");
//     //難易度変更前に開いてたinfoを閉じる
//     // if (showInfoWindow) {
//     //     showInfoWindow.close();
//     //     showInfoWindow = null;
//     //     currentSpotName = null;
//     // }
//     const difficultyValue = difficultySelect.value;
//     if (difficultyValue === selectAllRindo || difficultyValue === '') {
//         layers.forEach(layer => {
//             layer.setMap(map);
//         });
//     } else {
//         layers.forEach(layer => {
//             layer.setMap(null);
//         });
//         const layerToDisplay = layers.find(layer => layer.url === difficultyURLS[difficultyValue]);
//         if (layerToDisplay) {
//             layerToDisplay.setMap(map);
//         }
//     }
//     this.map.setCenter({ lat: 35.80920, lng: 139.09663 });
//     this.map.setZoom(11);
//     }


//     handleInfoWindow(content, position, spotName) {
//         if (this.showInfoWindow) {
//             if (this.currentSpotName) {
//                 this.spotNametoggle(this.currentSpotName);
//             }
//             this.showInfoWindow.close();
//             this.showInfoWindow = null;
//         }

//         this.showInfoWindow = new google.maps.InfoWindow({
//             content: content,
//             position: position
//         });

//         this.showInfoWindow.open(this.map);
//         this.map.setCenter(position);
//         this.map.setZoom(13);

//         const spotNameElement = this.findSpotNameElement(spotName);
//         if (spotNameElement) {
//             this.spotNametoggle(spotNameElement);
//             this.currentSpotName = spotNameElement;
//         }

//         google.maps.event.addListener(this.showInfoWindow, 'closeclick', () => {
//             if (this.currentSpotName) {
//                 this.spotNametoggle(this.currentSpotName);
//                 this.currentSpotName = null;
//                 this.showInfoWindow = null;
//             }
//             this.map.setCenter({ lat: 35.80920, lng: 139.09663 });
//             this.map.setZoom(11);
//         });
//     }
// }


export default class MapManager {
    constructor() {
        this.map = null;
        this.layers = [];
        this.showInfoWindow = null;
        this.currentSpotName = null;
    }

    initMap(kmlFileManager) {
        this.map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 35.80920, lng: 139.09663 },
            zoom: 11
        });

        Object.keys(KmlLayerURLS).forEach(key => {
            const layer = new google.maps.KmlLayer({
                url: KmlLayerURLS[key],
                map: null,
                preserveViewport: true,
                suppressInfoWindows: true
            });
            this.layers.push(layer);

            layer.addListener('click', (event) => {
                const name = event.featureData.name;
                const description = event.featureData.description;
                let imageSrc = `img/info_img_${name}.jpg`;

                this.imageExistsAsync(imageSrc, (exists) => {
                    if (!exists) {
                        imageSrc = 'img/info_img_non.jpg';
                    }

                    const content = `
                        <h2>${name}</h2>
                        <p>${description}</p>
                        <p>詳細</p>
                        <img src="${imageSrc}" width="300">
                    `;

                    this.handleInfoWindow(content, event.latLng, name);
                });
            });
        });

        this.updateLayers();
    }

    updateLayers() {
        if (this.showInfoWindow) {
            this.showInfoWindow.close();  // 難易度変更前に開いてた infoWindow を閉じる
            this.showInfoWindow = null;
            this.currentSpotName = null;
        }

        const difficultyValue = document.getElementById("difficulty_select").value;
        const kmlFileManager = new KmlFileManager();
        const difficultyURLs = kmlFileManager.createDifficultyURLs();

        if (difficultyValue === 'selectAllRindo' || difficultyValue === '') {
            this.layers.forEach(layer => {
                layer.setMap(this.map);
            });
        } else {
            this.layers.forEach(layer => {
                layer.setMap(null);
            });
            const layerToDisplay = this.layers.find(layer => layer.url === difficultyURLs[difficultyValue]);
            if (layerToDisplay) {
                layerToDisplay.setMap(this.map);
            }
        }

        this.map.setCenter({ lat: 35.80920, lng: 139.09663 });
        this.map.setZoom(11);
    }


    handleInfoWindow(content, position, spotName) {
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

        this.showInfoWindow.open(this.map);
        this.map.setCenter(position);
        this.map.setZoom(13);

        const spotNameElement = this.findSpotNameElement(spotName);
        if (spotNameElement) {
            this.spotNametoggle(spotNameElement);
            this.currentSpotName = spotNameElement;
        }

        google.maps.event.addListener(this.showInfoWindow, 'closeclick', () => {
            if (this.currentSpotName) {
                this.spotNametoggle(this.currentSpotName);
                this.currentSpotName = null;
                this.showInfoWindow = null;
            }
            this.map.setCenter({ lat: 35.80920, lng: 139.09663 });
            this.map.setZoom(11);
        });
    }

    spotNametoggle(spotName) {
        spotName.classList.toggle('selected');
    }

    findSpotNameElement(content) {
        const spotNames = document.querySelectorAll('.spot_name');
        for (let spotName of spotNames) {
            const SpotName = spotName.textContent.trim();
            if (SpotName === content.trim()) {
                return spotName;
            }
        }
        return null;
    }

    imageExistsAsync(url, callback) {
        const img = new Image();
        img.onload = () => callback(true);
        img.onerror = () => callback(false);
        img.src = url;
    }
}



