<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Facades\DB;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
    protected $fillable = ['name', 'email', 'password',];
    protected $hidden = ['password', 'remember_token',];
    protected function casts(): array { return ['email_verified_at' => 'datetime', 'password' => 'hashed',]; }

    public function posts() { return $this->hasMany(Post::class); }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function friends()
    {
        $friendsAsRequester = DB::table('friendships')
            ->join('users', 'users.id', '=', 'friendships.addressee_id')
            ->where('friendships.requester_id', $this->id)
            ->where('friendships.status', 'accepted')
            ->select('users.*');

        $friendsAsAddressee = DB::table('friendships')
            ->join('users', 'users.id', '=', 'friendships.requester_id')
            ->where('friendships.addressee_id', $this->id)
            ->where('friendships.status', 'accepted')
            ->select('users.*');

        return $friendsAsRequester->union($friendsAsAddressee)->get()->map(function ($userData) {
            return User::find($userData->id);
        });
    }

    public function getAllFriends()
    {
        $friendIds = DB::table('friendships')
            ->where('status', 'accepted')
            ->where(function ($query) {
                $query->where('requester_id', $this->id)
                      ->orWhere('addressee_id', $this->id);
            })
            ->get()
            ->map(function ($friendship) {
                return $friendship->requester_id == $this->id 
                    ? $friendship->addressee_id 
                    : $friendship->requester_id;
            });

        return User::whereIn('id', $friendIds)->get();
    }

    public function pendingFriendRequests()
    {
        return $this->belongsToMany(User::class, 'friendships', 'requester_id', 'addressee_id')
            ->wherePivot('status', 'pending');
    }

    public function friendRequestsReceived()
    {
        return $this->belongsToMany(User::class, 'friendships', 'addressee_id', 'requester_id')
            ->wherePivot('status', 'pending');
    }
}