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

        $friendIds = $user->friends()->pluck('id');

        $friendIds->push($user->id);
        $posts = Post::whereIn('user_id', $friendIds)
                     ->with('user') 
                     ->latest()
                     ->paginate(10);

        return PostResource::collection($posts);
    }

}