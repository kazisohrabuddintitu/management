<?php

use App\Http\Controllers\UserProfileController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [UserProfileController::class, 'index'])->name('dashboard');
    Route::post('user-profiles', [UserProfileController::class, 'store'])->name('user-profiles.store');
    Route::put('user-profiles/{user}', [UserProfileController::class, 'update'])->name('user-profiles.update');
    Route::delete('user-profiles/{user}', [UserProfileController::class, 'destroy'])->name('user-profiles.destroy');
});

require __DIR__.'/settings.php';
