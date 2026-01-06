<?php

use Illuminate\Support\Facades\Route;

Route::resource('categories', App\Http\Controllers\CategoryController::class)->middleware('auth')->except(['create', 'edit']);
Route::resource('todos', App\Http\Controllers\TodoController::class)->middleware('auth')->except(['create', 'edit']);

Route::post('/logout', [App\Http\Controllers\Otp::class, 'Logout'])->middleware('auth');
Route::post('/send-otp', [App\Http\Controllers\Otp::class, 'sendOtp']);
Route::post('/verify-otp', [App\Http\Controllers\Otp::class, 'verifyOtp']);

Route::get('/{any}', function () {
    return view('index');
})->where('any', '.*');
