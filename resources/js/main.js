'use strict';

import { MapManager } from './class/MapManager.js';
import { ClickSpotName } from './class/ClickSpotName.js';
import { DifficultySelecter } from './class/DifficultySelecter.js';
import { HeaderMenu } from './class/HeaderMenu.js';
import { KmlFileManager } from './class/KmlFileManager.js';

{
    document.addEventListener('DOMContentLoaded', async function () {
        try {
            const headerMenu = new HeaderMenu();
            headerMenu.clickMenuItems();

            const mapManager = new MapManager();
            const map = await mapManager.initMap();

            const clickSpotName = new ClickSpotName(map);
            clickSpotName.clickRindoList();

            const difficultySelect = document.getElementById('difficulty_select');
            difficultySelect.addEventListener('change', function () {
                mapManager.updateLayers();
            });

            const difficultySelecter = new DifficultySelecter(map);
            difficultySelecter.changeSelect();
        } catch (error) {
            console.error('マップの初期化に失敗しました:', error);
        }
    });
}


