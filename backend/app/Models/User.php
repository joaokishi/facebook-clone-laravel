<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
    protected $fillable = ['name', 'email', 'password',];
    protected $hidden = ['password', 'remember_token',];
    protected function casts(): array { return ['email_verified_at' => 'datetime', 'password' => 'hashed',]; }

    public function posts() { return $this->hasMany(Post::class); }

    // *** ADD THESE METHODS ***

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    // This gets all friendships where the user is either the requester or the addressee.
    public function friends()
    {
        // Get friends where this user was the requester and the request was accepted.
        $friends = $this->belongsToMany(User::class, 'friendships', 'requester_id', 'addressee_id')
            ->wherePivot('status', 'accepted');

        // Get friends where this user was the addressee and the request was accepted.
        $friendOf = $this->belongsToMany(User::class, 'friendships', 'addressee_id', 'requester_id')
            ->wherePivot('status', 'accepted');

        // Merge the two collections and return
        return $friends->get()->merge($friendOf->get());
    }

    // Get pending friend requests this user has sent
    public function pendingFriendRequests()
    {
        return $this->belongsToMany(User::class, 'friendships', 'requester_id', 'addressee_id')
            ->wherePivot('status', 'pending');
    }

    // Get friend requests that this user has received
    public function friendRequestsReceived()
    {
        return $this->belongsToMany(User::class, 'friendships', 'addressee_id', 'requester_id')
            ->wherePivot('status', 'pending');
    }
}