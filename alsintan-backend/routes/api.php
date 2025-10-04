<?php

// routes/api.php - Complete version
use App\Http\Controllers\Api\DistribusiController;
use App\Http\Controllers\Api\PengajuanController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\SmartRecommendationController;
use App\Http\Controllers\Api\HelperController;
use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes (no authentication required)
Route::prefix('v1')->group(function () {
    // Authentication
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::get('/profile', [AuthController::class, 'profile'])->middleware('auth:sanctum');
});

// Protected routes (authentication required)
Route::prefix('v1')->middleware(['auth:sanctum'])->group(function () {

    // 1. PENGAJUAN ALSINTAN ENDPOINTS
    Route::prefix('pengajuan')->group(function () {
        Route::get('/', [PengajuanController::class, 'index']);           // GET /api/v1/pengajuan
        Route::post('/', [PengajuanController::class, 'store']);          // POST /api/v1/pengajuan - Input pengajuan baru (otomatis hitung SMART)
        Route::get('/{id}', [PengajuanController::class, 'show']);        // GET /api/v1/pengajuan/{id}
        Route::put('/{id}', [PengajuanController::class, 'update']);      // PUT /api/v1/pengajuan/{id}
        Route::delete('/{id}', [PengajuanController::class, 'destroy']);  // DELETE /api/v1/pengajuan/{id}
        Route::post('/{id}/approve', [PengajuanController::class, 'approvePengajuan']); // POST /api/v1/pengajuan/{id}/approve
    });

    // 2. SMART RECOMMENDATION ENDPOINTS
    Route::prefix('smart')->group(function () {
        Route::get('/rekomendasi-prioritas', [SmartRecommendationController::class, 'getRecommendations']); // GET /api/v1/smart/rekomendasi-prioritas - Ambil daftar prioritas berdasarkan ranking
        Route::get('/detail/{id}', [SmartRecommendationController::class, 'getSmartDetail']);               // GET /api/v1/smart/detail/{id} - Detail perhitungan SMART per pengajuan
        Route::put('/criteria', [SmartRecommendationController::class, 'updateCriteria']);                 // PUT /api/v1/smart/criteria - Update bobot kriteria
        Route::get('/dashboard', [SmartRecommendationController::class, 'getDashboardSmart']);             // GET /api/v1/smart/dashboard - Statistik dan grafik berbasis SMART score
        Route::post('/recalculate/{id?}', [SmartRecommendationController::class, 'recalculateScores']);     // POST /api/v1/smart/recalculate/{id?}
        Route::get('/criteria', [HelperController::class, 'getSmartCriteria']);                           // GET /api/v1/smart/criteria
    });

    // 3. HELPER ENDPOINTS (Master Data)
    Route::prefix('master')->group(function () {
        Route::get('/poktan', [HelperController::class, 'getPoktan']);         // GET /api/v1/master/poktan
        Route::get('/alsintan', [HelperController::class, 'getAlsintan']);     // GET /api/v1/master/alsintan
        Route::get('/kecamatan', [HelperController::class, 'getKecamatan']);   // GET /api/v1/master/kecamatan
    });

    // 4. REPORT ENDPOINTS
    Route::prefix('reports')->group(function () {
        Route::get('/export/excel', [ReportController::class, 'exportExcel']);     // GET /api/v1/reports/export/excel
        Route::get('/export/pdf', [ReportController::class, 'exportPDF']);         // GET /api/v1/reports/export/pdf
        Route::get('/summary', [ReportController::class, 'getSummaryReport']);     // GET /api/v1/reports/summary
    });

    // 5. DISTRIBUSI ENDPOINTS
    Route::prefix('distribusi')->group(function () {
        Route::get('/', [DistribusiController::class, 'index']);              // GET /api/v1/distribusi
        Route::post('/', [DistribusiController::class, 'store']);             // POST /api/v1/distribusi
        Route::put('/{id}/status', [DistribusiController::class, 'updateStatus']); // PUT /api/v1/distribusi/{id}/status
    });

    // 6. USER MANAGEMENT ENDPOINTS (Admin only)
    Route::prefix('users')->middleware('admin')->group(function () {
        Route::get('/', [AuthController::class, 'getAllUsers']);              // GET /api/v1/users
        Route::get('/{id}', [AuthController::class, 'getDetailUserById']); // GET /api/v1/users/{id}   
        Route::post('/', [AuthController::class, 'createUser']);              // POST /api/v1/users
        Route::put('/{id}', [AuthController::class, 'updateUser']);         // PUT /api/v1/users/{id}
        Route::delete('/{id}', [AuthController::class, 'deleteUserById']); // DELETE /api/v1/users/{id}  
    });
});
