<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\UserController;
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


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
  Route::get('/user/me', [UserController::class, 'me']);
  Route::post('/profile/update', [UserController::class, 'update']);
  Route::post('/profile/password', [UserController::class, 'updatePassword']);
  Route::delete('/user', [UserController::class, 'destroy']);

  Route::post('/products', [ProductController::class, 'store']);
  Route::apiResource('categories', CategoryController::class);
  Route::apiResource('products', ProductController::class);
  Route::post('/logout', [AuthController::class, 'logout']);
  Route::get('/user', [AuthController::class, 'me']);
  // admin only
  Route::get('/users', [UserController::class, 'index']);
  Route::get('/users/{id}', [UserController::class, 'show']);


  
  Route::get('/dashboard', [DashboardController::class, 'index']);

});


