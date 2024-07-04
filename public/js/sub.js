'use strict';

import KmlFileManager from './_KmlFileManager.js';

{
    let map;
    const difficultyURLS = {};
    const layers = [];
    let showInfoWindow = null;
    let currentSpotName = null;
    const selectAllRindo = "selectAllRindo";
    const difficultySelect = document.getElementById("difficulty_select");


    //難易度によってマップのレイヤーの表示変更
    function updateLayers() {
        //難易度変更前に開いてたinfoを閉じる
        if (showInfoWindow) {
            showInfoWindow.close();
            showInfoWindow = null;
            currentSpotName = null;
        }
        const difficultyValue = difficultySelect.value;
        if (difficultyValue === selectAllRindo || difficultyValue === '') {
            layers.forEach(layer => {
                layer.setMap(map);
            });
        } else {
            layers.forEach(layer => {
                layer.setMap(null);
            });
            const layerToDisplay = layers.find(layer => layer.url === difficultyURLS[difficultyValue]);
            if (layerToDisplay) {
                layerToDisplay.setMap(map);
            }
        }
        map.setCenter({ lat: 35.80920, lng: 139.09663 });
        map.setZoom(11);
    }

    difficultySelect.addEventListener('change', function () {
        updateLayers();
    });



    function imageExistsAsync(url, callback) {
        const img = new Image();
        img.onload = () => callback(true);
        img.onerror = () => callback(false);
        img.src = url;
    }



//kmlファイルのクラス読み込み
        const KmlFile = new KmlFileManager();
        const KmlLayerURLS = KmlFile.kmlLayerURLS
    //マップの表示
    function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
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
            layers.push(layer);

            layer.addListener('click', function (event) {
                const name = event.featureData.name;
                const description = event.featureData.description;
                let imageSrc = `img/info_img_${name}.jpg`;

                //focusと同じ処理
                imageExistsAsync(imageSrc, function (exists) {
                    //該当の画像がない場合
                    if (!exists) {
                        imageSrc = 'img/info_img_non.jpg';
                    }
                    //focusと同じ処理
                    //info内容
                    const content = `
                        <h2>${name}</h2>
                        <p>${description}</p>
                        <p>詳細</p>
                        <img src="${imageSrc}" width="300">
                    `;

                    const position = event.latLng;
                    //focusと同期させるための処理
                    const spotName = findSpotName(name);

                 

                    //ここからfocusと同じ処理
                    // 既存のInfoWindowがある場合は閉じる
                    if (showInfoWindow) {
                        if (currentSpotName) {
                            spotNametoggle(currentSpotName);
                        }
                        showInfoWindow.close();
                        showInfoWindow = null;
                    }

                    // 新しいInfoWindowを開く
                    showInfoWindow = new google.maps.InfoWindow({
                        content: content,
                        position: position
                    });
                    map.setCenter(position);
                    map.setZoom(13);
                    showInfoWindow.open(map);
                    //ここまでfocusと同じ処理

                    //focusはspotNametoggle(spotName);のみだが、initMapの方は少し条件が違う
                    if (spotName) {
                        spotNametoggle(spotName);
                        currentSpotName = spotName;
                    }

                    google.maps.event.addListener(showInfoWindow, 'closeclick', function () {
                        if (currentSpotName) {
                            spotNametoggle(spotName);
                            currentSpotName = null;
                            showInfoWindow = null;
                        }
                        map.setCenter({ lat: 35.80920, lng: 139.09663 });
                        map.setZoom(11);
                    });
                });
            });
        });

        updateLayers();
    }

    function spotNametoggle(spotName) {
        spotName.classList.toggle('selected');
    }

    //林道一覧のliをクリックしたときの処理
    function focusMaker() {
        document.querySelectorAll('.spot_name').forEach(spotName => {
            spotName.addEventListener('click', () => {
                const coordinates = spotName.dataset.coordinates.split(',');
                const lat = parseFloat(coordinates[1]);
                const lng = parseFloat(coordinates[0]);
                const position = { lat: lat, lng: lng };
                const name = spotName.textContent.trim();
                const description = spotName.dataset.description.trim();
                let imageSrc = `img/info_img_${name}.jpg`;

                imageExistsAsync(imageSrc, function (exists) {
                    if (!exists) {
                        imageSrc = 'img/info_img_non.jpg';
                    }

                    const content = `
                        <h2>${name}</h2>
                        <p>${description}</p>
                        <p>詳細</p>
                        <img src="${imageSrc}" width="300">
                    `;

                    // クリックされた要素がすでに表示されているInfoWindowの要素と同じであれば閉じる
                    if (showInfoWindow && showInfoWindow.getContent() === content) {
                        showInfoWindow.close();
                        showInfoWindow = null;
                        currentSpotName = null;
                        map.setCenter({ lat: 35.80920, lng: 139.09663 });
                        map.setZoom(11);
                        spotNametoggle(spotName);
                        return;
                    } else {
                        // 既存のInfoWindowがある場合は閉じる
                        if (showInfoWindow) {
                            if (currentSpotName) {
                                spotNametoggle(currentSpotName);
                            }
                            showInfoWindow.close();
                            showInfoWindow = null;

                            map.setCenter({ lat: 35.80920, lng: 139.09663 });
                            map.setZoom(11);
                        }

                        // 新しいInfoWindowを開く
                        showInfoWindow = new google.maps.InfoWindow({
                            content: content,
                            position: position
                        });
                        map.setCenter(position);
                        map.setZoom(13);
                        showInfoWindow.open(map);
                        spotNametoggle(spotName)

                        google.maps.event.addListener(showInfoWindow, 'closeclick', function () {
                            if (currentSpotName) {
                                spotNametoggle(spotName);
                                currentSpotName = null;
                                showInfoWindow = null;
                            }
                            map.setCenter({ lat: 35.80920, lng: 139.09663 });
                            map.setZoom(11);
                        });

                        if (spotName) {
                            currentSpotName = spotName;
                        }
                    }
                });
            });
        });
    }

    function findSpotName(content) {
        const spotNames = document.querySelectorAll('.spot_name');
        for (let spotName of spotNames) {
            const SpotName = spotName.textContent.trim();
            if (SpotName === content.trim()) {
                return spotName;
            }
        }
        return null;
    }




    //selectに難易度の難易度を星に変換
    function convertDifficultyToStar(difficulty) {
        switch (difficulty) {
            case '1':
                return '★';
            case '2':
                return '★★';
            case '3':
                return '★★★';
            case '4':
                return '★★★★';
            case '5':
                return '★★★★★';
            case '全ての林道':
                return difficulty;
            default:
                return '';
        }
    }


    //選択した難易度と一覧を表示
    document.addEventListener('DOMContentLoaded', function () {
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        const difficultySelect = document.getElementById('difficulty_select');

        if (difficultySelect) {
            difficultySelect.addEventListener('change', function (event) {
                event.preventDefault();

                const difficulty = difficultySelect.value;

                //フォームデータ作成
                const formData = new FormData();
                formData.append('difficulty', difficulty);

                //fetch送信
                fetch('/handle-form-api', {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': csrfToken
                    },
                    body: formData
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        //難易度の表示
                        const resultDifficulty = document.getElementById('result_difficulty');
                        resultDifficulty.textContent = `選択中の難易度: ${convertDifficultyToStar(data.selectedDifficulty)}`;

                        //↑の林道一覧
                        const resultList = document.getElementById('result_list');
                        resultList.innerHTML = '';

                        data.spots.forEach(spot => {
                            const li = document.createElement('li');
                            li.classList.add('spot_name');
                            li.dataset.coordinates = spot.coordinates;
                            li.dataset.description = spot.description;
                            li.textContent = spot.name;
                            resultList.appendChild(li);
                        });

                        focusMaker();
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            });
        }
        focusMaker();
        initMap();

    });
    // window.initMap = initMap;
}



