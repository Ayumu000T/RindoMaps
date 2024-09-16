<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SpotController;
use App\Http\Controllers\DetailController;
use App\Http\Controllers\KmlController;
use App\Http\Controllers\ContactController;

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

// kmlファイルのアップロード
Route::post('/upload', [FileUploadController::class, 'upload']);

//メールフォーム表示
Route::get('/contact', [ContactController::class, 'showForm'])
        ->name('contact');
//送信を押した後の処理
Route::post('/contact', [ContactController::class, 'submitFrom'])
        ->name('contact.submitFrom');
