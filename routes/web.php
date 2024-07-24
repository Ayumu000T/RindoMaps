<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SpotController;
use App\Http\Controllers\DetailController;

Route::get('/', [SpotController::class, 'index'])
        ->name('index');


//難易度変更
Route::post('/handle-form-difficulty', [SpotController::class, 'handleFormDifficulty'])
        ->name('handleFormDifficulty');

//都道府県変更
Route::post('/handle-form-prefecture', [SpotController::class, 'handleFormPrefecture'])
        ->name('handleFormPrefecture');


//詳細ページ
Route::get('/detail/{id}', [DetailController::class, 'detail'])
        ->name('detail');
