<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\FriendshipController; // <-- Add this
use App\Http\Controllers\Api\CommentController;    // <-- Add this
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/users/{user}', [UserController::class, 'show']);
Route::get('/users/{user}/posts', [UserController::class, 'posts']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    Route::apiResource('posts', PostController::class)->except(['index']); // We can have separate feeds later
    Route::get('/feed', [PostController::class, 'index']); // Example for a "friends feed" later

    // Friendship Routes
    Route::get('/friends', [FriendshipController::class, 'getFriends']);
    Route::get('/friends/pending', [FriendshipController::class, 'getPendingRequests']);
    Route::post('/friends/request/{user}', [FriendshipController::class, 'sendRequest']);
    Route::post('/friends/accept/{user}', [FriendshipController::class, 'acceptRequest']);
    Route::post('/friends/reject/{user}', [FriendshipController::class, 'rejectRequest']);
    Route::delete('/friends/unfriend/{user}', [FriendshipController::class, 'unfriend']);
    Route::get('/feed/friends', [PostController::class, 'friendsFeed']);
    
    // Comment Routes
    Route::get('/posts/{post}/comments', [CommentController::class, 'index']);
    Route::post('/posts/{post}/comments', [CommentController::class, 'store']);
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy']);
});
