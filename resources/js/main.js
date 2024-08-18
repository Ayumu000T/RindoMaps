'use strict';

import { MapManager } from './class/MapManager.js';
import { ClickSpotName } from './class/ClickSpotName.js';
import { HeaderMenu } from './class/HeaderMenu.js';
import { KmlFileManager } from './class/KmlFileManager.js';


{
    document.addEventListener('DOMContentLoaded', async function () {
        try {
            const kmlFileManager = new KmlFileManager;
            kmlFileManager.fetchAndSaveKmls();

            //マップの初期化
            const mapManager = new MapManager();
            const map = await mapManager.initMap();

            //ヘッダーメニューの処理
            const headerMenu = new HeaderMenu();
            headerMenu.clickMenuItems();

            //林道リストのクリックイベント
            const clickSpotName = new ClickSpotName(map);
            clickSpotName.clickRindoList(map);

            //表示レイヤーを更新(現在難易度でソートのみ)
            const difficultySelect = document.getElementById('difficulty_select');
            difficultySelect.addEventListener('change', function () {
                mapManager.updateLayers();
            });
            const prefectureSelect = document.getElementById('prefecture_select');
            prefectureSelect.addEventListener('change', function () {
                mapManager.updateLayers();
            });

            // ソートのリセット
            mapManager.sortReset();
        } catch (error) {
            console.error('マップの初期化に失敗しました:', error);
        }
    });
}