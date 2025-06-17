<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\PostResource;

class PostController extends Controller
{
    public function index()
    {
        return PostResource::collection(Post::with('user')->latest()->paginate(10));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $post = Auth::user()->posts()->create($validated);

        return new PostResource($post->load('user'));
    }

    public function show(Post $post)
    {
        return new PostResource($post->load('user'));
    }

    public function update(Request $request, Post $post)
    {
        if (Auth::id() !== $post->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'content' => 'sometimes|required|string|max:1000',
        ]);

        $post->update($validated);

        return new PostResource($post->load('user'));
    }

    public function destroy(Post $post)
    {
        if (Auth::id() !== $post->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $post->delete();

        return response()->json(null, 204);
    }
    public function friendsFeed()
    {
        $user = Auth::user();

        // Get an array of friend IDs
        $friendIds = $user->friends()->pluck('id');

        // Add the current user's own ID to the list so they see their own posts too
        $friendIds->push($user->id);

        // Fetch posts where the user_id is in our list of friends
        $posts = Post::whereIn('user_id', $friendIds)
                     ->with('user') // Eager load user to prevent N+1 queries
                     ->latest()
                     ->paginate(10);

        return PostResource::collection($posts);
    }

}