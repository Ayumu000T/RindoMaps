<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SpotController;

Route::get('/', [SpotController::class, 'index'])
        ->name('index');

// Route::post('/', [SpotController::class, 'handleForm'])
//         ->name('handleForm');

//非同期用
Route::post('/handle-form-api', [SpotController::class, 'handleFormApi'])
        ->name('handleFormApi');
