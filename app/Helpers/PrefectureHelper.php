<?php

{
     function convertPrefectureToKanji($prefecture)
    {
        switch ($prefecture) {
            case 'tokyo':
                return '東京都';
            case 'saitama':
                return '埼玉県';
            case 'gunma':
                return '群馬県';
            case 'nagano':
                return '長野県';
            case 'yamanashi':
                return '山梨県';
            default:
                return '';
        }
    }
}
