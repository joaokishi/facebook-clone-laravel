<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\CommentResource;

class CommentController extends Controller
{
    public function index(Post $post)
    {
        return CommentResource::collection($post->comments()->with('user')->paginate(10));
    }

    public function store(Request $request, Post $post)
    {
        $request->validate(['content' => 'required|string']);

        $postOwner = $post->user;
        $currentUser = Auth::user();

        $comment = $post->comments()->create([
            'user_id' => $currentUser->id,
            'content' => $request->content,
        ]);

        return new CommentResource($comment->load('user'));
    }

    public function destroy(Comment $comment)
    {
        if (Auth::id() !== $comment->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $comment->delete();

        return response()->json(null, 204);
    }
}
