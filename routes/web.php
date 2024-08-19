<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SpotController;
use App\Http\Controllers\DetailController;
use App\Http\Controllers\KmlController;

// リストの初期表示
Route::get('/', [SpotController::class, 'index'])
        ->name('index');

// リストのソート
Route::post('/handle-form-filter', [SpotController::class, 'handleFormFilter'])
        ->name('handleFormFilter');

// 詳細ページ
Route::get('/detail/{id}', [DetailController::class, 'detail'])
        ->name('detail');

// マップ表示用のURL
Route::get('/get-kml-urls', [KmlController::class, 'getKmlUrls']);


//URL取得
Route::get('/kml-urls', [KmlController::class, 'getKmlUrls']);
//URL読み込み
Route::get('/fetch-kml', [KmlController::class, 'fetchKml']);


//メールフォーム
Route::get('/contact', function () {
    return view('contact');
})->name('contact');
