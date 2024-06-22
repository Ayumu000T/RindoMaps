<?php

 function convertDifficultyToStar($difficulty)
{
    switch ($difficulty) {
        case '1':
            return '★';
        case '2':
            return '★★';
        case '3':
            return '★★★';
        case '4':
            return '★★★★';
        default:
            return '';
    }
}
