<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Http\Resources\UserResource;

class FriendshipController extends Controller
{
    public function sendRequest(User $user)
    {
        $requester = Auth::user();

        if ($requester->id === $user->id) {
            return response()->json(['message' => 'You cannot send a friend request to yourself.'], 422);
        }

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
        $addressee = Auth::user();

        $affected = DB::table('friendships')
            ->where('requester_id', $user->id)
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

        $affected = DB::table('friendships')
            ->where('requester_id', $user->id)
            ->where('addressee_id', $addressee->id)
            ->where('status', 'pending')
            ->delete();

        if ($affected === 0) {
            return response()->json(['message' => 'Friend request not found.'], 404);
        }

        return response()->json(['message' => 'Friend request rejected.']);
    }

    public function unfriend(User $user)
    {
        $currentUser = Auth::user();

        $affected = DB::table('friendships')
            ->where('status', 'accepted')
            ->where(function ($query) use ($currentUser, $user) {
                $query->where(function ($subQuery) use ($currentUser, $user) {
                    $subQuery->where('requester_id', $currentUser->id)
                             ->where('addressee_id', $user->id);
                })
                ->orWhere(function ($subQuery) use ($currentUser, $user) {
                    $subQuery->where('requester_id', $user->id)
                             ->where('addressee_id', $currentUser->id);
                });
            })
            ->delete();

        if ($affected === 0) {
            return response()->json(['message' => 'Friendship not found.'], 404);
        }

        return response()->json(['message' => 'Unfriended successfully.']);
    }

    public function getFriends()
    {
        $currentUserId = Auth::id();

        $friendIds = DB::table('friendships')
            ->where('status', 'accepted')
            ->where(function ($query) use ($currentUserId) {
                $query->where('requester_id', $currentUserId)
                      ->orWhere('addressee_id', $currentUserId);
            })
            ->get()
            ->map(function ($friendship) use ($currentUserId) {
                return $friendship->requester_id == $currentUserId 
                    ? $friendship->addressee_id 
                    : $friendship->requester_id;
            });

        $friends = User::whereIn('id', $friendIds)->get();

        return response()->json([
            'data' => UserResource::collection($friends),
            'count' => $friends->count()
        ]);
    }

    public function getPendingRequests()
    {
        try {
            $currentUserId = Auth::id();

            $requesterIds = DB::table('friendships')
                ->where('addressee_id', $currentUserId)
                ->where('status', 'pending')
                ->pluck('requester_id');

            if ($requesterIds->isEmpty()) {
                return response()->json([]);
            }

            $users = User::whereIn('id', $requesterIds)->get();

            return response()->json($users->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at
                ];
            }));

        } catch (\Exception $e) {
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }

    public function getSentRequests()
    {
        try {
            $currentUserId = Auth::id();

            $addresseeIds = DB::table('friendships')
                ->where('requester_id', $currentUserId)
                ->where('status', 'pending')
                ->pluck('addressee_id');

            if ($addresseeIds->isEmpty()) {
                return response()->json([]);
            }


            $users = User::whereIn('id', $addresseeIds)->get();

            return response()->json($users->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at
                ];
            }));

        } catch (\Exception $e) {
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }
}