<?php

use App\Http\Controllers\AdController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ModuleController;
use App\Http\Controllers\NavItemController;
use App\Http\Controllers\PaperController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\HomeImageController;
use App\Http\Controllers\ImportantNumberController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\PersonController;
use App\Http\Controllers\PotentialController;
use App\Http\Controllers\QuickLinkController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\StructureController;
use App\Http\Controllers\UserController;
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

Route::get('/home-images', [HomeImageController::class, 'index']);
Route::get('/papers', [PaperController::class, 'index']);
Route::get('/papers/{slug}', [PaperController::class, 'show']);
Route::get('/potentials', [PotentialController::class, 'index']);
Route::get('/potentials/{potential}', [PotentialController::class, 'show']);
Route::get('/events', [EventController::class, 'index']);
Route::get('/events/{event}', [EventController::class, 'show']);
Route::get('/persons', [PersonController::class, 'index']);
Route::get('/persons/{person}', [PersonController::class, 'show']);

// Example: make read endpoints public, protect modifications
Route::get('/ads', [AdController::class, 'index']);
Route::get('/ads/{ad}', [AdController::class, 'show']);

// News read endpoints
Route::get('/news', [NewsController::class, 'index']);
Route::get('/news/{news}', [NewsController::class, 'show']);

// other public resource reads...
Route::get('/quick-links', [QuickLinkController::class, 'index']);
// Return a single quick link (raw model with full label object) for editing in admin UI
Route::get('/quick-links/{id}', [QuickLinkController::class, 'show']);
Route::get('/important-numbers', [ImportantNumberController::class, 'index']);
Route::get('/important-numbers/{id}', [ImportantNumberController::class, 'show']);

// Roles - Read endpoint (public)
Route::get('/roles', [RoleController::class, 'index']);
Route::get('/roles/{role}', [RoleController::class, 'show']);

// Groups - Read endpoints (public)
Route::get('/groups', [GroupController::class, 'index']);
Route::get('/groups/{group}', [GroupController::class, 'show']);

// Structures - Read endpoints (public)
Route::get('/structures', [StructureController::class, 'index']);
Route::get('/structures/tree', [StructureController::class, 'tree']);
Route::get('/structures/{structure}', [StructureController::class, 'show']);

// Modules - Read endpoints (public)
Route::get('/modules', [ModuleController::class, 'index']);
Route::get('/modules/{module}', [ModuleController::class, 'show']);
Route::get('/modules/{moduleId}/nav-items', [NavItemController::class, 'index']);

// Users - Read endpoints (public)
Route::get('/users', [UserController::class, 'index']);
Route::get('/users/{user}', [UserController::class, 'show']);

// Auth endpoints
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLink']);
Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);

// Protected CRUD (create/update/delete) - require token
Route::middleware('auth:sanctum')->group(function () {
    // Ads CRUD
    Route::post('/ads', [AdController::class, 'store']);
    Route::post('/ads/upload', [AdController::class, 'upload']);
    Route::put('/ads/{ad}', [AdController::class, 'update']);
    Route::delete('/ads/{ad}', [AdController::class, 'destroy']);

    // News CRUD
    Route::post('/news', [NewsController::class, 'store']);
    Route::post('/news/upload', [NewsController::class, 'upload']);
    Route::put('/news/{news}', [NewsController::class, 'update']);
    Route::delete('/news/{news}', [NewsController::class, 'destroy']);
    

    // Quick links
    Route::post('/quick-links', [QuickLinkController::class, 'store']);
    Route::put('/quick-links/{id}', [QuickLinkController::class, 'update']);
    Route::delete('/quick-links/{id}', [QuickLinkController::class, 'destroy']);

    // Important numbers
    Route::post('/important-numbers', [ImportantNumberController::class, 'store']);
    Route::put('/important-numbers/{id}', [ImportantNumberController::class, 'update']);
    Route::delete('/important-numbers/{id}', [ImportantNumberController::class, 'destroy']);

    // Potentials CRUD
    Route::post('/potentials', [PotentialController::class, 'store']);
    Route::put('/potentials/{potential}', [PotentialController::class, 'update']);
    Route::delete('/potentials/{potential}', [PotentialController::class, 'destroy']);

   // Events 
    Route::post('/events', [EventController::class, 'store']);
    Route::put('/events/{event}', [EventController::class, 'update']);
    Route::delete('/events/{event}', [EventController::class, 'destroy']);

    // Personsx
    Route::post('/persons', [PersonController::class, 'store']);
    Route::post('/persons/upload', [PersonController::class, 'upload']);
    Route::put('/persons/{person}', [PersonController::class, 'update']);
    Route::delete('/persons/{person}', [PersonController::class, 'destroy']);

    // Papers CRUD
    Route::post('/papers', [PaperController::class, 'store']);
    Route::put('/papers/{paper}', [PaperController::class, 'update']);
    Route::delete('/papers/{paper}', [PaperController::class, 'destroy']);

    // Modules CRUD - Write operations only
    Route::post('/modules', [ModuleController::class, 'store']);
    Route::put('/modules/{module}', [ModuleController::class, 'update']);
    Route::delete('/modules/{module}', [ModuleController::class, 'destroy']);
    
    // Nav items CRUD
    Route::post('/nav-items', [NavItemController::class, 'store']);
    Route::put('/nav-items/{navItem}', [NavItemController::class, 'update']);
    Route::delete('/nav-items/{navItem}', [NavItemController::class, 'destroy']);

    // Roles CRUD
    Route::post('/roles', [RoleController::class, 'store']);
    Route::put('/roles/{role}', [RoleController::class, 'update']);
    Route::delete('/roles/{role}', [RoleController::class, 'destroy']);

    // Groups CRUD
    Route::post('/groups', [GroupController::class, 'store']);
    Route::put('/groups/{group}', [GroupController::class, 'update']);
    Route::delete('/groups/{group}', [GroupController::class, 'destroy']);

    // Structures CRUD
    Route::post('/structures', [StructureController::class, 'store']);
    Route::put('/structures/{structure}', [StructureController::class, 'update']);
    Route::delete('/structures/{structure}', [StructureController::class, 'destroy']);

    // Users CRUD
    Route::post('/users', [UserController::class, 'store']);
    Route::put('/users/{user}', [UserController::class, 'update']);
    Route::delete('/users/{user}', [UserController::class, 'destroy']); 
    
});
