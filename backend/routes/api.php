<?php

use App\Http\Controllers\AdController;
use App\Http\Controllers\PaperController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\HomeImageController;
use App\Http\Controllers\ImportantNumberController;
use App\Http\Controllers\PersonController;
use App\Http\Controllers\PotentialController;
use App\Http\Controllers\QuickLinkController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::apiResource('events', EventController::class);
Route::apiResource('persons', PersonController::class);
Route::apiResource('ads', AdController::class);
Route::apiResource('quick-links', QuickLinkController::class);
Route::apiResource('important-numbers', ImportantNumberController::class);
Route::get('/home-images', [HomeImageController::class, 'index']);
Route::get('/papers', [PaperController::class, 'index']);
Route::get('/papers/{slug}', [PaperController::class, 'show']);
Route::get('/potentials', [PotentialController::class, 'index']);


