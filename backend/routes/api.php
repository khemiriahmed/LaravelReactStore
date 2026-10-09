<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\Cart\CartController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\Orders\OrderController;
use App\Http\Controllers\Api\Products\CategoryController;
use App\Http\Controllers\Api\Products\ProductController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| Here is where you can register API routes for your application.
*/

// =======================
// 🔓 PUBLIC ROUTES
// =======================

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category}', [CategoryController::class, 'show']);

// =======================
// 🔐 AUTHENTICATED ROUTES
// =======================

Route::middleware('auth:sanctum')->group(function () {
    // Profile
    Route::get('/user', [AuthController::class, 'me']);
    Route::get('/user/me', [UserController::class, 'me']);
    Route::post('/profile/update', [UserController::class, 'update']);
    Route::post('/profile/password', [UserController::class, 'updatePassword']);
    Route::delete('/user', [UserController::class, 'destroy']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Cart
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart/add', [CartController::class, 'add']);
    Route::put('/cart/update/{id}', [CartController::class, 'update']);
    Route::delete('/cart/remove/{id}', [CartController::class, 'remove']);
    Route::delete('/cart/clear', [CartController::class, 'clear']);

    // Orders (customer)
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::post('/orders/{id}/cancel', [OrderController::class, 'cancel']);

    // =======================
    // 🧑‍💼 ADMIN ROUTES
    // =======================
    Route::middleware('admin')->group(function () {
        Route::apiResource('products', ProductController::class)->except(['index', 'show']);
        Route::apiResource('categories', CategoryController::class)->except(['index', 'show']);

        Route::get('/users', [UserController::class, 'index']);
        Route::get('/users/{id}', [UserController::class, 'show']);

        Route::get('/admin/stats', [DashboardController::class, 'stats']);
        Route::get('/admin/orders', [OrderController::class, 'adminIndex']);
        Route::get('/admin/orders/{id}', [OrderController::class, 'adminShow']);
        Route::put('/admin/orders/{id}', [OrderController::class, 'updateStatus']);
    });
});