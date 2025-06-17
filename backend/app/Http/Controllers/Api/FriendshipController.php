<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB; // <-- Import the DB facade
use App\Http\Resources\UserResource;

class FriendshipController extends Controller
{
    public function sendRequest(User $user)
    {
        $requester = Auth::user();

        if ($requester->id === $user->id) {
            return response()->json(['message' => 'You cannot send a friend request to yourself.'], 422);
        }

        // Check if any relationship (pending or accepted) already exists between them
        $exists = DB::table('friendships')
            ->where(function ($query) use ($requester, $user) {
                $query->where('requester_id', $requester->id)
                    ->where('addressee_id', $user->id);
            })
            ->orWhere(function ($query) use ($requester, $user) {
                $query->where('requester_id', $user->id)
                    ->where('addressee_id', $requester->id);
            })
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'A friendship request already exists or you are already friends.'], 422);
        }

        // Use a direct DB insert which is very reliable
        DB::table('friendships')->insert([
            'requester_id' => $requester->id,
            'addressee_id' => $user->id,
            'status' => 'pending',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['message' => 'Friend request sent.']);
    }

    public function acceptRequest(User $user)
    {
        $addressee = Auth::user(); // The person accepting the request

        // Find the pending request and update it. This is more direct and safer.
        $affected = DB::table('friendships')
            ->where('requester_id', $user->id) // The person who sent the request
            ->where('addressee_id', $addressee->id)
            ->where('status', 'pending')
            ->update(['status' => 'accepted', 'updated_at' => now()]);

        if ($affected === 0) {
            return response()->json(['message' => 'Friend request not found or already actioned.'], 404);
        }

        return response()->json(['message' => 'Friend request accepted.']);
    }

    public function rejectRequest(User $user)
    {
        $addressee = Auth::user();

        // Find and delete the pending request record
        DB::table('friendships')
            ->where('requester_id', $user->id)
            ->where('addressee_id', $addressee->id)
            ->where('status', 'pending')
            ->delete();

        return response()->json(['message' => 'Friend request rejected.']);
    }

    public function unfriend(User $user)
    {
        $currentUser = Auth::user();

        // Delete the friendship record regardless of who is the requester or addressee
        DB::table('friendships')
            ->where('status', 'accepted')
            ->where(function ($query) use ($currentUser, $user) {
                $query->where('requester_id', $currentUser->id)
                    ->where('addressee_id',  $user->id);
            })
            ->orWhere(function ($query) use ($currentUser, $user) {
                $query->where('requester_id', $user->id)
                    ->where('addressee_id', $currentUser->id);
            })
            ->delete();

        return response()->json(['message' => 'Unfriended successfully.']);
    }

    public function getFriends()
    {
        return UserResource::collection(Auth::user()->friends());
    }

    public function getPendingRequests()
    {
        return UserResource::collection(Auth::user()->friendRequestsReceived);
    }
}