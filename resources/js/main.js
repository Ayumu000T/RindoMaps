'use strict';

import { MapManager } from './class/MapManager.js';
import { ClickSpotName } from './class/ClickSpotName.js';
import { FilterSelecter } from './class/FilterSelecter.js';
import { HeaderMenu } from './class/HeaderMenu.js';
// import { KmlFileManager } from './class/KmlFileManager.js';

{
    document.addEventListener('DOMContentLoaded', async function () {
        try {
            //ヘッダーメニューの処理
            const headerMenu = new HeaderMenu();
            headerMenu.clickMenuItems();

            //マップの初期化
            const mapManager = new MapManager();
            const map = await mapManager.initMap();

            //林道リストのクリックイベント
            const clickSpotName = new ClickSpotName(map);
            clickSpotName.clickRindoList();

            //表示レイヤーを更新(現在難易度でソートのみ)
            const difficultySelect = document.getElementById('difficulty_select');
            difficultySelect.addEventListener('change', function () {
                mapManager.updateLayers();
            });

            //リストを難易度と県でソート
            const difficultySelecter = new FilterSelecter(map);
            difficultySelecter.changeSelect();
        } catch (error) {
            console.error('マップの初期化に失敗しました:', error);
        }
    });
}


