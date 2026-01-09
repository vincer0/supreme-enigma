<?php

declare(strict_types=1);

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::get('/', fn () => view('welcome'));

Route::post('/login', [AuthController::class, 'login']);

Route::post('/logout', [AuthController::class, 'logout']);

Route::post('/register', [AuthController::class, 'register']);

Route::get('/user', [AuthController::class, 'user']);
