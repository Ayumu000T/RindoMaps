'use script';

{
    const difficultySelect = document.getElementById('difficulty_select');
    const selectAllRindo = 'selectAllRindo';
    const layers = [];
    let map;

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
                const infoWindow = new google.maps.InfoWindow({
                    content: event.featureData.name, // My Mapsで設定した情報を表示
                    position: event.latLng // マーカーの位置にInfoWindowを表示

                });
                infoWindow.open(map);
            });
        });

        updateLayers();
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

    //focusMaker()でズームした時にinfoWindowを表示する
    // function showInfoWindow(content, position) {
    //     const infoWindow = new google.maps.InfoWindow({
    //         content: content,
    //         position: position
    //     });
    //     infoWindow.open(map);
    // }



    //マーカーにズームイン
    // function focusMaker() {
    //     document.querySelectorAll('.spot_name').forEach(spotName => {
    //         spotName.addEventListener('click', () => {
    //             const coordinates = spotName.dataset.coordinates.split(',');
    //             const lat = parseFloat(coordinates[1]);
    //             const lng = parseFloat(coordinates[0]);
    //             const position = { lat: lat, lng: lng };
    //             const content = spotName.childNodes[1].nodeValue.trim();

    //             if (lat && lng) {
    //                 // マーカーの位置にマップを移動させる
    //                 map.setCenter(position);
    //                 map.setZoom(12);

    //                 showInfoWindow(content, position);
    //             }
    //         });
    //     });
    // }

    function focusMaker() {
        let showInfoWindow = null;

        document.querySelectorAll('.spot_name').forEach(spotName => {
            spotName.addEventListener('click', () => {
                const coordinates = spotName.dataset.coordinates.split(',');
                const lat = parseFloat(coordinates[1]);
                const lng = parseFloat(coordinates[0]);
                const position = { lat: lat, lng: lng };
                const content = spotName.childNodes[1].nodeValue.trim();

                // クリックされた要素がすでに表示されているInfoWindowの要素と同じであれば閉じる
                if (showInfoWindow && showInfoWindow.getContent() === content) {
                    showInfoWindow.close();
                    showInfoWindow = null;
                } else {
                    // 新しいInfoWindowを開く
                    showInfoWindow = new google.maps.InfoWindow({
                        content: content,
                        position: position
                    });
                    showInfoWindow.open(map);
                }

                // マーカーの位置にマップを移動させる
                map.setCenter(position);
                map.setZoom(12);
            });
        });
    }


    function zoomOutMarker() {
        document.querySelectorAll('.spot_name').forEach(spotName => {
            spotName.addEventListener('click', () => {
                map = new google.maps.Map(document.getElementById('map'), {
                    center: { lat: 35.80920, lng: 139.09663 },
                    zoom: 11
                });
            });
        });
    }


    //クリックで説明文の表示と▲の向き変更
    function appearDescription() {
        const spotNames = document.querySelectorAll('.spot_name');
        spotNames.forEach(spotName => {
            spotName.addEventListener('click', () => {
                const description = spotName.nextElementSibling;
                if (description && description.classList.contains('spot_description')) {
                    description.classList.toggle('appear');

                    const spanIcon = spotName.querySelector('.spot_name_icon');
                    if (spanIcon) {
                        if (spanIcon.textContent === '▲') {
                            spanIcon.textContent = '▼';
                        } else {
                            spanIcon.textContent = '▲';
                        }
                    }
                }
            });
        });
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
                            const dt = document.createElement('dt');
                            dt.innerHTML = `<span class="spot_name_icon">▼</span>${spot.name}`;
                            dt.classList.add('spot_name');
                            dt.dataset.coordinates = spot.coordinates;
                            resultList.appendChild(dt);

                            const dd = document.createElement('dd');
                            dd.textContent = `Info: ${spot.description}`;
                            dd.classList.add('spot_description');
                            resultList.appendChild(dd);

                        });

                        appearDescription();
                        focusMaker();
                        initMap();
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            });
        }
        appearDescription();
        focusMaker();
        initMap();
    });

}
