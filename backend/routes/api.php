<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\FriendshipController;
use App\Http\Controllers\Api\CommentController;
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

    // Posts
    Route::apiResource('posts', PostController::class)->except(['index']);
    Route::get('/feed', [PostController::class, 'index']);
    Route::get('/feed/friends', [PostController::class, 'friendsFeed']); // Se existir

    // Friendship Routes
    Route::prefix('friends')->group(function () {
        // Enviar, aceitar e rejeitar solicitações
        Route::post('/request/{user}', [FriendshipController::class, 'sendRequest']);
        Route::post('/accept/{user}', [FriendshipController::class, 'acceptRequest']);
        Route::delete('/reject/{user}', [FriendshipController::class, 'rejectRequest']);
        Route::delete('/remove/{user}', [FriendshipController::class, 'unfriend']);
        
        // Listar amigos e solicitações
        Route::get('/', [FriendshipController::class, 'getFriends']); // Lista de amigos
        Route::get('/requests', [FriendshipController::class, 'getPendingRequests']); // Solicitações recebidas
        Route::get('/sent', [FriendshipController::class, 'getSentRequests']); // Solicitações enviadas (opcional)
    });
    
    // Comment Routes
    Route::get('/posts/{post}/comments', [CommentController::class, 'index']);
    Route::post('/posts/{post}/comments', [CommentController::class, 'store']);
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy']);
});