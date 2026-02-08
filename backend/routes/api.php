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
use App\Http\Controllers\SuperAdminController;
use App\Http\Controllers\Api\ToolController;
use App\Http\Controllers\CitizenClaimController;
use App\Http\Controllers\CompanyClaimController;
use App\Http\Controllers\OrganizationClaimController;
use App\Http\Controllers\Admin\ClaimsAdminController;
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
Route::get('/home-images/{image}', [HomeImageController::class, 'show']);
Route::get('/papers', [PaperController::class, 'index']);
Route::get('/papers/{id}', [PaperController::class, 'showById']);
Route::get('/papers/slug/{slug}', [PaperController::class, 'show']);

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

// PUBLIC CLAIMS ENDPOINTS - No authentication required
Route::post('/claims/citizen', [CitizenClaimController::class, 'store']);
Route::post('/claims/company', [CompanyClaimController::class, 'store']);
Route::post('/claims/organization', [OrganizationClaimController::class, 'store']);


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
Route::middleware('auth:sanctum')->post('/refresh-token', [AuthController::class, 'refreshToken']);

Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLink']);
Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);

// Protected CRUD (create/update/delete) - require token
Route::middleware('auth:sanctum')->group(function () {
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

    // Modules - Nav items only (protected)
    Route::get('/modules/{moduleId}/nav-items', [NavItemController::class, 'index']);

    // Tools - Read endpoints (protected, role-based)
    Route::get('/tools', [ToolController::class, 'index']);

    // Users - Read endpoints (public)
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{user}', [UserController::class, 'show']);

    // Ads CRUD - with role protection
    Route::post('/ads', [AdController::class, 'store'])->middleware('api.role:API:write-ads,API:write-all');
    Route::post('/ads/upload', [AdController::class, 'upload'])->middleware('api.role:API:write-ads,API:write-all');
    Route::put('/ads/{ad}', [AdController::class, 'update'])->middleware('api.role:API:write-ads,API:write-all');
    Route::delete('/ads/{ad}', [AdController::class, 'destroy'])->middleware('api.role:API:delete-ads,API:delete-all');

    // Home Images CRUD - with role protection
    Route::post('/home-images', [HomeImageController::class, 'store'])->middleware('api.role:API:write-home-images,API:write-all');
    Route::put('/home-images/{image}', [HomeImageController::class, 'update'])->middleware('api.role:API:write-home-images,API:write-all');
    Route::delete('/home-images/{image}', [HomeImageController::class, 'destroy'])->middleware('api.role:API:delete-home-images,API:delete-all');
    Route::post('/home-images/upload', [HomeImageController::class, 'uploadImage'])->middleware('api.role:API:write-home-images,API:write-all');


    // News CRUD - with role protection
    Route::post('/news', [NewsController::class, 'store'])->middleware('api.role:API:write-news,API:write-all');
    Route::post('/news/upload', [NewsController::class, 'upload'])->middleware('api.role:API:write-news,API:write-all');
    Route::put('/news/{news}', [NewsController::class, 'update'])->middleware('api.role:API:write-news,API:write-all');
    Route::delete('/news/{news}', [NewsController::class, 'destroy'])->middleware('api.role:API:delete-news,API:delete-all');


    // Quick links - with role protection
    Route::post('/quick-links', [QuickLinkController::class, 'store'])->middleware('api.role:API:write-quick-links,API:write-all');
    Route::put('/quick-links/{id}', [QuickLinkController::class, 'update'])->middleware('api.role:API:write-quick-links,API:write-all');
    Route::delete('/quick-links/{id}', [QuickLinkController::class, 'destroy'])->middleware('api.role:API:delete-quick-links,API:delete-all');

    // Important numbers - with role protection
    Route::post('/important-numbers', [ImportantNumberController::class, 'store'])->middleware('api.role:API:write-important-numbers,API:write-all');
    Route::put('/important-numbers/{id}', [ImportantNumberController::class, 'update'])->middleware('api.role:API:write-important-numbers,API:write-all');
    Route::delete('/important-numbers/{id}', [ImportantNumberController::class, 'destroy'])->middleware('api.role:API:delete-important-numbers,API:delete-all');

    // Potentials CRUD - with role protection
    Route::post('/potentials', [PotentialController::class, 'store'])->middleware('api.role:API:write-potentials,API:write-all');
    Route::put('/potentials/{potential}', [PotentialController::class, 'update'])->middleware('api.role:API:write-potentials,API:write-all');
    Route::delete('/potentials/{potential}', [PotentialController::class, 'destroy'])->middleware('api.role:API:delete-potentials,API:delete-all');

    // Events - with role protection
    Route::post('/events', [EventController::class, 'store'])->middleware('api.role:API:write-events,API:write-all');
    Route::put('/events/{event}', [EventController::class, 'update'])->middleware('api.role:API:write-events,API:write-all');
    Route::delete('/events/{event}', [EventController::class, 'destroy'])->middleware('api.role:API:delete-events,API:delete-all');

    // Persons - with role protection
    Route::post('/persons', [PersonController::class, 'store'])->middleware('api.role:API:write-persons,API:write-all');
    Route::post('/persons/upload', [PersonController::class, 'upload'])->middleware('api.role:API:write-persons,API:write-all');
    Route::put('/persons/{person}', [PersonController::class, 'update'])->middleware('api.role:API:write-persons,API:write-all');
    Route::delete('/persons/{person}', [PersonController::class, 'destroy'])->middleware('api.role:API:delete-persons,API:delete-all');

    // Papers CRUD - with role protection
    Route::post('/papers', [PaperController::class, 'store'])->middleware('api.role:API:write-papers,API:write-all');
    Route::put('/papers/{paper}', [PaperController::class, 'update'])->middleware('api.role:API:write-papers,API:write-all');
    Route::delete('/papers/{paper}', [PaperController::class, 'destroy'])->middleware('api.role:API:delete-papers,API:delete-all');
    Route::put('/papers/{paper}/toggle-hidden', [PaperController::class, 'toggleHidden'])->middleware('api.role:API:write-papers,API:write-all');

    // Hidden toggle endpoints for all entities - with role protection
    Route::put('/events/{event}/toggle-hidden', [EventController::class, 'toggleHidden'])->middleware('api.role:API:write-events,API:write-all');
    Route::put('/home-images/{image}/toggle-hidden', [HomeImageController::class, 'toggleHidden'])->middleware('api.role:API:write-home-images,API:write-all');
    Route::put('/persons/{person}/toggle-hidden', [PersonController::class, 'toggleHidden'])->middleware('api.role:API:write-persons,API:write-all');
    Route::put('/news/{news}/toggle-hidden', [NewsController::class, 'toggleHidden'])->middleware('api.role:API:write-news,API:write-all');
    Route::put('/potentials/{potential}/toggle-hidden', [PotentialController::class, 'toggleHidden'])->middleware('api.role:API:write-potentials,API:write-all');
    Route::put('/quick-links/{id}/toggle-hidden', [QuickLinkController::class, 'toggleHidden'])->middleware('api.role:API:write-quick-links,API:write-all');
    Route::put('/important-numbers/{id}/toggle-hidden', [ImportantNumberController::class, 'toggleHidden'])->middleware('api.role:API:write-important-numbers,API:write-all');
    Route::put('/ads/{ad}/toggle-hidden', [AdController::class, 'toggleHidden'])->middleware('api.role:API:write-ads,API:write-all');

    // Modules CRUD - with role protection
    Route::get('/modules', [ModuleController::class, 'index']);
    Route::get('/modules/{module}', [ModuleController::class, 'show']);
    Route::post('/modules', [ModuleController::class, 'store'])->middleware('api.role:API:manage-modules,API:superadmin');
    Route::put('/modules/{module}', [ModuleController::class, 'update'])->middleware('api.role:API:manage-modules,API:superadmin');
    Route::delete('/modules/{module}', [ModuleController::class, 'destroy'])->middleware('api.role:API:manage-modules,API:superadmin');

    // Nav items CRUD - with role protection
    Route::post('/nav-items', [NavItemController::class, 'store'])->middleware('api.role:API:manage-modules,API:superadmin');
    Route::put('/nav-items/{navItem}', [NavItemController::class, 'update'])->middleware('api.role:API:manage-modules,API:superadmin');
    Route::delete('/nav-items/{navItem}', [NavItemController::class, 'destroy'])->middleware('api.role:API:manage-modules,API:superadmin');

    // Roles CRUD - with role protection
    Route::post('/roles', [RoleController::class, 'store'])->middleware('api.role:API:manage-roles,API:superadmin');
    Route::put('/roles/{role}', [RoleController::class, 'update'])->middleware('api.role:API:manage-roles,API:superadmin');
    Route::delete('/roles/{role}', [RoleController::class, 'destroy'])->middleware('api.role:API:manage-roles,API:superadmin');

    // Groups CRUD - with role protection
    Route::post('/groups', [GroupController::class, 'store'])->middleware('api.role:API:manage-groups,API:superadmin');
    Route::put('/groups/{group}', [GroupController::class, 'update'])->middleware('api.role:API:manage-groups,API:superadmin');
    Route::delete('/groups/{group}', [GroupController::class, 'destroy'])->middleware('api.role:API:manage-groups,API:superadmin');

    // Structures CRUD - with role protection
    Route::post('/structures', [StructureController::class, 'store'])->middleware('api.role:API:manage-structures,API:superadmin');
    Route::put('/structures/{structure}', [StructureController::class, 'update'])->middleware('api.role:API:manage-structures,API:superadmin');
    Route::delete('/structures/{structure}', [StructureController::class, 'destroy'])->middleware('api.role:API:manage-structures,API:superadmin');

    // Users CRUD - with role protection
    Route::post('/users', [UserController::class, 'store'])->middleware('api.role:API:manage-users,API:superadmin');
    Route::put('/users/{user}', [UserController::class, 'update'])->middleware('api.role:API:manage-users,API:superadmin');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->middleware('api.role:API:manage-users,API:superadmin');

    // ADMIN CLAIMS ENDPOINTS - with role protection
    Route::prefix('admin/claims')->middleware('api.role:API:manage-claims,API:superadmin')->group(function () {
        Route::get('/citizen', [ClaimsAdminController::class, 'citizenIndex']);
        Route::get('/citizen/{id}', [ClaimsAdminController::class, 'citizenShow']);
        Route::put('/citizen/{id}/answer', [ClaimsAdminController::class, 'answerCitizenClaim']);
        Route::delete('/citizen/{id}', [ClaimsAdminController::class, 'destroyCitizenClaim']);

        Route::get('/company', [ClaimsAdminController::class, 'companyIndex']);
        Route::get('/company/{id}', [ClaimsAdminController::class, 'companyShow']);
        Route::put('/company/{id}/answer', [ClaimsAdminController::class, 'answerCompanyClaim']);
        Route::delete('/company/{id}', [ClaimsAdminController::class, 'destroyCompanyClaim']);

        Route::get('/organization', [ClaimsAdminController::class, 'organizationIndex']);
        Route::get('/organization/{id}', [ClaimsAdminController::class, 'organizationShow']);
        Route::put('/organization/{id}/answer', [ClaimsAdminController::class, 'answerOrganizationClaim']);
        Route::delete('/organization/{id}', [ClaimsAdminController::class, 'destroyOrganizationClaim']);

        // Bulk operations
        Route::post('/archive-old', [ClaimsAdminController::class, 'archiveOldClaims']);
        Route::delete('/purge-old', [ClaimsAdminController::class, 'purgeOldClaims']);
    });


    Route::prefix('superadmin')->middleware('api.role:API:superadmin')->group(function () {
        // Database endpoints
        Route::get('/databases', [SuperAdminController::class, 'getDatabases']);
        Route::get('/databases/{database}/tables', [SuperAdminController::class, 'getTables']);
        Route::get('/databases/{database}/tables/{table}/structure', [SuperAdminController::class, 'getTableStructure']);
        Route::get('/databases/{database}/tables/{table}/data', [SuperAdminController::class, 'getTableData']);
        Route::post('/databases/{database}/tables/{table}/optimize', [SuperAdminController::class, 'optimizeTable']);
        Route::post('/databases/{database}/tables/{table}/repair', [SuperAdminController::class, 'repairTable']);

        // Redis endpoints
        Route::get('/redis/stats', [SuperAdminController::class, 'getRedisStats']);

        // System endpoints
        Route::get('/system/info', [SuperAdminController::class, 'getSystemInfo']);
    });
});
