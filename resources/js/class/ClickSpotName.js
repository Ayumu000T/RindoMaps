import { InfoWindowManagerSingleton, createContent } from './Utility.js';

//林道のリスト(spotName)をクリック時の処理
export class ClickSpotName {
    constructor(map) {
        this.map = map;
        const singleton = new InfoWindowManagerSingleton();
        this.infoWindowManager = singleton.getInstance();
    }

    clickRindoList() {
        document.querySelectorAll('.spot_name').forEach(spotName => {
            spotName.addEventListener('click', () => {
                this.handleSpotNameClick(spotName);
            });
        });
    }

    //↑のclickRindoLisのクリック時の実行内容
    handleSpotNameClick(spotName) {
        const coordinates = spotName.dataset.coordinates.split(',');
        const lat = parseFloat(coordinates[1]);
        const lng = parseFloat(coordinates[0]);
        const position = { lat: lat, lng: lng };
        const name = spotName.textContent.trim();
        const spotNameElement = this.infoWindowManager.findSpotName(name);
        const imageUrl = spotName.dataset.imageUrl;
        const spotId = spotName.dataset.id;
        const difficulty = spotName.dataset.difficulty;

        //infoの内容UtilityのcreateContentを使用
        const content = createContent(name, difficulty, spotId, imageUrl);

        //info表示とliのtoggle
        this.infoWindowManager.handleInfoWindow(this.map, content, position, spotId, imageUrl);
        this.infoWindowManager.spotNametoggle(spotNameElement);
    }

}

