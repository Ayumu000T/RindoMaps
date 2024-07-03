<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SpotController;
use App\Http\Controllers\DetailController;

Route::get('/', [SpotController::class, 'index'])
        ->name('index');


//非同期用
Route::post('/handle-form-api', [SpotController::class, 'handleFormApi'])
        ->name('handleFormApi');


//詳細ページ
Route::get('/detail/{id}', [DetailController::class, 'detail'])
        ->name('detail');
