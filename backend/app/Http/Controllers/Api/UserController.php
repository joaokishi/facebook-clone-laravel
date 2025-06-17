<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Http\Resources\UserResource;
use App\Http\Resources\PostResource;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a specific user's profile information.
     */
    public function show(User $user)
    {
        return new UserResource($user);
    }

    /**
     * Display all of the posts for a specific user.
     */
    public function posts(User $user)
    {
        // Get paginated posts for the given user
        $posts = $user->posts()->with('user')->latest()->paginate(10);
        
        return PostResource::collection($posts);
    }
}