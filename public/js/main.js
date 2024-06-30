'use script';

{
    const difficultySelect = document.getElementById('difficulty_select');
    const selectAllRindo = 'selectAllRindo';
    const layers = [];
    let map;
    let showInfoWindow = null;
    let currentSpotName = null;

    //オンライ上のKMLファイル
    const KmlLayerURLS = {
        difficulty1: 'https://www.google.com/maps/d/u/0/kml?forcekml=1&mid=1T0oMKSRVbGhwBW33mJuhVOo0-MGQeds&lid=7ynBOV8jQUo',
        difficulty2: 'https://www.google.com/maps/d/u/0/kml?forcekml=1&mid=1T0oMKSRVbGhwBW33mJuhVOo0-MGQeds&lid=FHEwq7ut1X8',
        difficulty3: 'https://www.google.com/maps/d/u/0/kml?forcekml=1&mid=1T0oMKSRVbGhwBW33mJuhVOo0-MGQeds&lid=rd6pvMc1c1c',
        difficulty4: 'https://www.google.com/maps/d/u/0/kml?forcekml=1&mid=1T0oMKSRVbGhwBW33mJuhVOo0-MGQeds&lid=7SU8cepGjbg',
        difficulty5: 'https://www.google.com/maps/d/u/0/kml?forcekml=1&mid=1T0oMKSRVbGhwBW33mJuhVOo0-MGQeds&lid=2_crKVxfQWY',
    };
    const difficultyURLS = {};
    Object.keys(KmlLayerURLS).forEach(key => {
        const difficulty = key.replace('difficulty', '');
        difficultyURLS[difficulty] = KmlLayerURLS[key];
    });

    //選択した難易度のレイヤーをマップに表示
    function updateLayers() {
        const difficultyValue = difficultySelect.value;
        if (difficultyValue === selectAllRindo || difficultySelect === '') {
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



    //オンライン上のkmlを読み込みマップを表示
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

                // 画像が存在しない場合の処理
                if (!imageExists(imageSrc)) {
                    imageSrc = 'img/info_img_non.jpg';
                }

                const content = `
                    <h2>${name}</h2>
                    <p>${description}</p>
                    <p>詳細</p>
                    <img src="${imageSrc}" width="300">
                `;

                // 画像の存在を確認する関数
                function imageExists(url) {
                    const http = new XMLHttpRequest();
                    http.open('HEAD', url, false);
                    http.send();
                    return http.status !== 404;
                }

                const position = event.latLng;
                const spotName = findSpotName(name);

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
                showInfoWindow.open(map);
                map.setCenter(position);
                map.setZoom(13);

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


        updateLayers();
    }


    function spotNametoggle(spotName) {
        spotName.classList.toggle('selected');
    }

    function focusMaker() {
        document.querySelectorAll('.spot_name').forEach(spotName => {
            spotName.addEventListener('click', () => {
                const coordinates = spotName.dataset.coordinates.split(',');
                const lat = parseFloat(coordinates[1]);
                const lng = parseFloat(coordinates[0]);
                const position = { lat: lat, lng: lng };

                //変更後コード
                const name = spotName.textContent.trim();
                const description = spotName.dataset.description.trim();

                let imageSrc = `img/info_img_${name}.jpg`;

                // 画像が存在しない場合の処理
                if (!imageExists(imageSrc)) {
                    imageSrc = 'img/info_img_non.jpg'; // 画像が存在しない場合の代替画像のパス
                }

                const content = `
                    <h2>${name}</h2>
                    <p>${description}</p>
                    <p>詳細</p>
                    <img src="${imageSrc}" width="300">
                `;

                // 画像の存在を確認する関数
                function imageExists(url) {
                    const http = new XMLHttpRequest();
                    http.open('HEAD', url, false);
                    http.send();
                    return http.status !== 404;
                }


                //infowindowの表示切り替え
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
                        initMap();
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            });
        }
        focusMaker();
        initMap();
    });
}